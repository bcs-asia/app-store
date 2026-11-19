// node --test analytics/worker/test.mjs : the Worker against a real SQLite database (node:sqlite) behind a D1-shaped wrapper
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { shorten } from './src/index.js';

function d1() {
    const db = new DatabaseSync(':memory:');
    db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
    return { prepare: (sql) => { const st = db.prepare(sql); let args = [];
        const o = { bind: (...a) => { args = a; return o; }, run: async () => { st.run(...args); return {}; }, first: async () => st.get(...args) || null,
            all: async () => ({ results: st.all(...args) }) }; return o; }, raw: db };
}
const ID = '0b0e7c52-4c3e-4f1d-9d38-0123456789ab';
const call = (env, method, path, body, headers, cf) => {
    const req = new Request(`https://x.example${path}`, { method, headers: Object.assign({ 'content-type': 'application/json' }, headers || {}), body: body === undefined ? undefined : JSON.stringify(body) });
    if (cf) { Object.defineProperty(req, 'cf', { value: cf }); }
    return worker.fetch(req, env);
};

test('shorten', () => {
    assert.equal(shorten('203.0.113.77'), '203.0.113.0');
    assert.equal(shorten('2001:db8:abcd:12:1:2:3:4'), '2001:db8:abcd::');
    assert.equal(shorten(''), ''); assert.equal(shorten('nonsense'), '');
});

test('ping, throttle, totals, opt-out, auth', async () => {
    const env = { DB: d1(), DASH_TOKEN: 's3cret' };
    const ping = (id, ip, cf, ev) => call(env, 'POST', '/v1/ping', { v: 1, id, ev: ev || 'ping', ver: '3.3.0', hmi: 'ID7' }, { 'cf-connecting-ip': ip }, cf);

    assert.equal((await ping(ID, '203.0.113.77', { country: 'MY', region: 'Selangor', city: 'Petaling Jaya' })).status, 200);
    const row = env.DB.raw.prepare('SELECT * FROM installs').get();
    assert.deepEqual([row.country, row.region, row.city, row.ip, row.ver, row.hmi, row.pings], ['MY', 'Selangor', 'Petaling Jaya', '203.0.113.0', '3.3.0', 'ID7', 1]);
    await ping(ID, '203.0.113.78', { country: 'MY' });                         // within 30 s: ignored
    assert.equal(env.DB.raw.prepare('SELECT pings FROM installs').get().pings, 1, 'throttled');
    env.DB.raw.exec('UPDATE installs SET last_seen = last_seen - 600');
    await ping(ID, '203.0.113.79', { country: 'MY', region: 'Selangor', city: 'Shah Alam' });
    assert.deepEqual([env.DB.raw.prepare('SELECT city, pings FROM installs').get()].map((r) => [r.city, r.pings])[0], ['Shah Alam', 2], 'updated');
    await ping('11111111-2222-4333-8444-555555555555', '198.51.100.5', { country: 'SG', city: 'Singapore' }, 'open');
    env.DB.raw.exec("UPDATE installs SET last_seen = last_seen - 100000 WHERE id LIKE '1111%'");

    // bad requests
    for (const b of [{ v: 1, id: 'nope', ev: 'ping' }, { v: 2, id: ID, ev: 'ping' }, { v: 1, id: ID, ev: 'evil' }]) {
        assert.equal((await call(env, 'POST', '/v1/ping', b)).status, 400);
    }
    assert.equal((await call(env, 'GET', '/api/stats')).status, 401);
    assert.equal((await call(env, 'GET', '/api/stats', undefined, { authorization: 'Bearer wrong' })).status, 401);
    assert.equal((await call({ DB: env.DB }, 'GET', '/api/stats', undefined, { authorization: 'Bearer undefined' })).status, 401, 'no token configured: closed');
    const s = await (await call(env, 'GET', '/api/stats', undefined, { authorization: 'Bearer s3cret' })).json();
    assert.deepEqual([s.installed, s.online, s.active24h, s.active7d], [2, 1, 1, 2]);
    assert.deepEqual(s.byCountry.map((c) => [c.k, c.n, c.online]), [['MY', 1, 1], ['SG', 1, 0]]);
    assert.equal(s.recent[0].id, '0b0e7c52'); assert.equal(s.recent[0].ip, '203.0.113.0');
    assert.ok(!JSON.stringify(s).includes(ID), 'the full install id never leaves the server');

    assert.equal((await call(env, 'POST', '/v1/optout', { v: 1, id: ID })).status, 200);
    assert.equal(env.DB.raw.prepare('SELECT COUNT(*) AS n FROM installs').get().n, 1, 'opt-out deletes the row');
    const page = await call(env, 'GET', '/');
    assert.equal(page.status, 200); assert.match(await page.text(), /BCS Store Live/);
    assert.equal((await call(env, 'GET', '/nope')).status, 404);
});
