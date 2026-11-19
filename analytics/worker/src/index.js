/* BCS Store usage statistics: a Cloudflare Worker with a D1 database. Receives the Store's check-ins (only from cars whose
 * owner switched sharing on), keeps one row per install and shows totals on a dashboard behind a token.
 *   POST /v1/ping    { v:1, id, ev:'open'|'ping', ver, hmi }   the Store, every five minutes while on
 *   POST /v1/optout  { v:1, id }                               the Store, when sharing is switched off: the row is deleted
 *   GET  /api/stats  Authorization: Bearer <DASH_TOKEN>        the numbers
 *   GET  /           the dashboard (asks for the token)
 * The address is shortened before it is kept (IPv4 a.b.c.0, IPv6 its first three groups); location is Cloudflare's
 * country, region and city for the connection. */
import { DASHBOARD } from './dashboard.js';

const ONLINE_S = 10 * 60;          // online: heard from in the last ten minutes (two pings missed = gone)
const THROTTLE_S = 30;             // a check-in sooner than this after the last one is ignored
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
        if (request.method === 'POST' && url.pathname === '/v1/ping') {
            const b = await body(request);
            if (!b || b.v !== 1 || !UUID.test(b.id) || (b.ev !== 'open' && b.ev !== 'ping')) { return json({ error: 'bad request' }, 400); }
            const cf = request.cf || {};
            const ver = /^\d{1,3}(\.\d{1,3}){0,3}$/.test(b.ver) ? b.ver : '';
            const hmi = b.hmi === 'ID7' || b.hmi === 'ID8' ? b.hmi : '';
            const ip = shorten(request.headers.get('cf-connecting-ip'));
            await env.DB.prepare(`INSERT INTO installs (id, first_seen, last_seen, ver, hmi, country, region, city, ip, pings)
                VALUES (?1, ?2, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1)
                ON CONFLICT(id) DO UPDATE SET last_seen = ?2, ver = ?3, hmi = ?4, country = ?5, region = ?6, city = ?7, ip = ?8, pings = pings + 1
                WHERE installs.last_seen <= ?2 - ?9`)
                .bind(b.id, now, ver, hmi, clean(cf.country, 2), clean(cf.region, 60), clean(cf.city, 60), ip, THROTTLE_S).run();
            return json({ ok: true });
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
