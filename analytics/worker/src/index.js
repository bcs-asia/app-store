/* BCS Store usage statistics: a Cloudflare Worker with a D1 database. Receives the Store's check-ins (only from cars whose
 * owner switched sharing on), keeps one row per install and shows totals on a dashboard behind a token.
 *   POST /v1/ping    { v:1, id, ev:'open'|'ping', ver, hmi }   the Store, every five minutes while on
 *   POST /v1/optout  { v:1, id }                               the Store, when sharing is switched off: the row is deleted
 *   GET  /v1/feed.json?id=&v=&hmi=                            the BCS feed: the updater of a car reads it as a catalog (the Store adds it as a
 *                                                               hidden source: only the updater reaches the internet on a head unit). The request is
 *                                                               the check-in; the answer lists the announcements as components.
 *   GET  /v1/img/<file>.png                                    an announcement's photo (from the GitHub announcements/ folder)
 *   GET  /api/stats  Authorization: Bearer <DASH_TOKEN>        the numbers
 *   GET  /api/export.csv  Authorization: Bearer <DASH_TOKEN>   every install, one row each (the dashboard's Export all button)
 *   GET  /           the dashboard (asks for the token)
 * The address is shortened before it is kept (IPv4 a.b.c.0, IPv6 its first three groups); location is Cloudflare's
 * country, region and city for the connection. */
import { DASHBOARD } from './dashboard.js';

const ONLINE_S = 10 * 60;          // online: heard from in the last ten minutes (two pings missed = gone)
const THROTTLE_S = 30;             // a check-in sooner than this after the last one is ignored
const RAW = 'https://raw.githubusercontent.com/bcs-asia/app-store/main/announcements/';
const IMG = /^[A-Za-z0-9._-]{1,100}\.png$/;
const NO_SHA = '0'.repeat(64);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const json = (obj, status) => new Response(JSON.stringify(obj), { status: status || 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export function shorten(ip) {
    if (!ip) { return ''; }
    if (ip.includes(':')) { return `${ip.split(':').slice(0, 3).join(':')}::`; }
    const p = ip.split('.');
    return p.length === 4 ? `${p[0]}.${p[1]}.${p[2]}.0` : '';
}

const clean = (s, n) => String(s || '').replace(/[^\p{L}\p{N} .,'()/-]/gu, '').slice(0, n);

function same(a, b) {            // constant-time compare
    if (a.length !== b.length) { return false; }
    let d = 0;
    for (let i = 0; i < a.length; i++) { d |= a.charCodeAt(i) ^ b.charCodeAt(i); }
    return d === 0;
}

async function body(request) {
    const text = await request.text();
    if (text.length > 1024) { return null; }
    try { return JSON.parse(text); } catch (e) { return null; }
}

/* Every install as CSV (the dashboard lists only the latest 100). A cell that starts like a formula gets a quote in front, so a spreadsheet does not run it. */
const csvCell = (v) => { let t = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(t)) { t = `'${t}`; } return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
const iso = (t) => new Date(t * 1000).toISOString().replace('T', ' ').slice(0, 19);
export async function exportCsv(db) {
    const { results } = await db.prepare('SELECT id, first_seen, last_seen, ver, hmi, country, region, city, ip, pings FROM installs ORDER BY first_seen ASC').all();
    const lines = [['install_id', 'first_seen_utc', 'last_seen_utc', 'store_version', 'idrive', 'country', 'region', 'city', 'address', 'check_ins'].join(',')];
    (results || []).forEach((r) => lines.push([r.id, iso(r.first_seen), iso(r.last_seen), r.ver, r.hmi, r.country, r.region, r.city, r.ip, r.pings].map(csvCell).join(',')));
    return `${lines.join('\r\n')}\r\n`;
}

/* One check-in (the Store's POST /v1/ping, or the feed request): one row per install, a check-in within 30 s of the last one ignored. */
async function record(env, request, id, ver, hmi, now) {
    const cf = request.cf || {};
    const v = /^\d{1,3}(\.\d{1,3}){0,3}$/.test(ver) ? ver : '';
    const h = hmi === 'ID7' || hmi === 'ID8' ? hmi : '';
    const ip = shorten(request.headers.get('cf-connecting-ip'));
    await env.DB.prepare(`INSERT INTO installs (id, first_seen, last_seen, ver, hmi, country, region, city, ip, pings)
        VALUES (?1, ?2, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1)
        ON CONFLICT(id) DO UPDATE SET last_seen = ?2, ver = ?3, hmi = ?4, country = ?5, region = ?6, city = ?7, ip = ?8, pings = pings + 1
        WHERE installs.last_seen <= ?2 - ?9`)
        .bind(id, now, v, h, clean(cf.country, 2), clean(cf.region, 60), clean(cf.city, 60), ip, THROTTLE_S).run();
}

/* The announcements (announcements/news.json on GitHub) as the components of a catalog the updater reads (README.md of the updater:
 * schema 2; an entry needs an artifact, which is never installed here: the Store hides these). The date goes in `author`, the photo is `icon`
 * (a PNG of up to 128 KiB, announcements/<id>.png). */
export function feedCatalog(news, origin) {
    const list = news && Array.isArray(news.items) ? news.items : [];
    const seen = new Set();
    const components = [];
    for (const x of list) {
        const id = `bcsnews-${String((x && x.id) || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}`.slice(0, 64).replace(/-+$/, '');
        const title = String((x && x.title) || '').replace(/\s+/g, ' ').trim().slice(0, 80);
        if (!id || id === 'bcsnews' || !title || seen.has(id) || !/^\d{4}-\d{2}-\d{2}$/.test(String(x.date)) || components.length >= 30) { continue; }
        seen.add(id);
        const c = { id, kind: 'app', title, description: String(x.text || '').slice(0, 600), version: '1.0.0', author: x.date, optional: true,
            mguHmi: ['ID7', 'ID8'], artifact: { name: `${id}@1.0.0.tgz`, size: 1, sha256: NO_SHA, url: `${origin}/v1/none.tgz` } };
        if (IMG.test(String(x.image || ''))) { c.icon = `${origin}/v1/img/${x.image}`; }
        components.push(c);
    }
    return { schema: 2, components };
}

export async function stats(db, now) {
    const one = async (sql, ...a) => (await db.prepare(sql).bind(...a).first()) || {};
    const all = async (sql, ...a) => (await db.prepare(sql).bind(...a).all()).results || [];
    const t = await one('SELECT COUNT(*) AS installed, SUM(last_seen >= ?) AS online, SUM(last_seen >= ?) AS d1, SUM(last_seen >= ?) AS d7 FROM installs',
        now - ONLINE_S, now - 86400, now - 7 * 86400);
    return {
        now, onlineWindow: ONLINE_S,
        installed: t.installed || 0, online: t.online || 0, active24h: t.d1 || 0, active7d: t.d7 || 0,
        byCountry: await all("SELECT country AS k, COUNT(*) AS n, SUM(last_seen >= ?) AS online FROM installs GROUP BY country ORDER BY n DESC, k LIMIT 30", now - ONLINE_S),
        byVersion: await all('SELECT ver AS k, COUNT(*) AS n FROM installs GROUP BY ver ORDER BY n DESC, k LIMIT 20'),
        byHmi: await all('SELECT hmi AS k, COUNT(*) AS n FROM installs GROUP BY hmi ORDER BY n DESC, k'),
        recent: await all('SELECT substr(id, 1, 8) AS id, first_seen AS firstSeen, last_seen AS lastSeen, ver, hmi, country, region, city, ip, pings FROM installs ORDER BY last_seen DESC LIMIT 100')
    };
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const now = Math.floor(Date.now() / 1000);
        if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
            return new Response(DASHBOARD, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store',
                'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'" } });
        }
        if (request.method === 'GET' && url.pathname === '/api/stats') {
            const auth = request.headers.get('authorization') || '';
            if (!env.DASH_TOKEN || !same(auth, `Bearer ${env.DASH_TOKEN}`)) { return json({ error: 'unauthorized' }, 401); }
            return json(await stats(env.DB, now));
        }
        if (request.method === 'GET' && url.pathname === '/api/export.csv') {
            const auth = request.headers.get('authorization') || '';
            if (!env.DASH_TOKEN || !same(auth, `Bearer ${env.DASH_TOKEN}`)) { return json({ error: 'unauthorized' }, 401); }
            return new Response(await exportCsv(env.DB), { headers: { 'content-type': 'text/csv; charset=utf-8', 'cache-control': 'no-store',
                'content-disposition': 'attachment; filename="bcs-store-installs.csv"' } });
        }
        if (request.method === 'POST' && url.pathname === '/v1/ping') {
            const b = await body(request);
            if (!b || b.v !== 1 || !UUID.test(b.id) || (b.ev !== 'open' && b.ev !== 'ping')) { return json({ error: 'bad request' }, 400); }
            await record(env, request, b.id, b.ver, b.hmi, now);
            return json({ ok: true });
        }
        const get = env.GET_RAW || ((u) => fetch(u, { cf: { cacheTtl: 300, cacheEverything: true } }));
        if (request.method === 'GET' && url.pathname === '/v1/feed.json') {
            const id = url.searchParams.get('id') || '';
            if (UUID.test(id)) {
                try { await record(env, request, id, url.searchParams.get('v'), url.searchParams.get('hmi'), now); } catch (e) { /* the feed answers anyway */ }
            }
            let news = null;
            try {
                const r = await get(`${RAW}news.json`);
                news = r.ok ? JSON.parse(await r.text()) : null;
            } catch (e) { news = null; }
            return new Response(JSON.stringify(feedCatalog(news, url.origin)), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
        }
        const img = request.method === 'GET' && /^\/v1\/img\/([^/]+)$/.exec(url.pathname);
        if (img && IMG.test(img[1])) {
            try {
                const r = await get(`${RAW}${img[1]}`);
                if (r.ok) { return new Response(r.body, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=3600' } }); }
            } catch (e) { /* not found below */ }
            return json({ error: 'not found' }, 404);
        }
        if (request.method === 'POST' && url.pathname === '/v1/optout') {
            const b = await body(request);
            if (!b || !UUID.test(b.id)) { return json({ error: 'bad request' }, 400); }
            await env.DB.prepare('DELETE FROM installs WHERE id = ?').bind(b.id).run();
            return json({ ok: true });
        }
        return json({ error: 'not found' }, 404);
    }
};
