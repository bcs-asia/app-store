'use strict';
/* BCS's own network features, against a server on this computer: Announcements (src/bcs_news.js) and Usage statistics
 * (src/bcs_stats.js). node tools/test_bcs_net.js */
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const zlib = require('zlib');
const net = require('../src/bcs_net.js');
const { News, parse } = require('../src/bcs_news.js');
const { Stats } = require('../src/bcs_stats.js');

let checks = 0;
const eq = (a, b, m) => { checks++; assert.deepStrictEqual(a, b, m); };

// a w x h RGB PNG
function makePng(w, h) {
    const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
    const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
    const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
    const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
    const raw = Buffer.alloc((w * 3 + 1) * h, 90);
    for (let y = 0; y < h; y++) raw[y * (w * 3 + 1)] = 0;
    return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

const files = new Map();
const posts = [];
const srv = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let b = ''; req.on('data', (c) => { b += c; });
        req.on('end', () => { posts.push({ url: req.url, body: JSON.parse(b) }); res.end('{"ok":true}'); });
        return;
    }
    const f = files.get(req.url);
    if (!f) { res.statusCode = 404; return res.end('no'); }
    res.end(f);
});

(async () => {
    await new Promise((r) => srv.listen(0, '127.0.0.1', r));
    const base = `http://127.0.0.1:${srv.address().port}`;
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bcsnet-'));

    // https only (except this computer), offline switch
    await assert.rejects(net.get('http://example.com/x'), /https only/); checks++;
    process.env.BCS_OFFLINE = '1';
    await assert.rejects(net.get(`${base}/x`), /offline/); checks++;
    delete process.env.BCS_OFFLINE;

    // the manifest: bad entries dropped, newest first
    const good = [{ id: 'b', title: 'Second', text: 'x', date: '2026-11-20', image: 'b.png' }, { id: 'a', title: 'First', text: 'y', date: '2026-11-10' },
        { id: '../evil', title: 'no', date: '2026-11-21' }, { id: 'c', title: 'bad image', date: '2026-11-22', image: '../x.png' },
        { id: 'a', title: 'dup', date: '2026-11-23' }, { id: 'd', title: 'bad date', date: 'yesterday' }];
    eq(parse(JSON.stringify({ items: good })).map((x) => x.id), ['b', 'a'], 'manifest filtered and sorted');
    eq(parse('nope'), null); eq(parse('{"items":1}'), null);

    // refresh: the manifest and its photos are kept; the page works offline afterwards
    files.set('/news.json', JSON.stringify({ items: good }));
    files.set('/b.png', makePng(64, 36));
    const news = new News({ dir: path.join(tmp, 'news'), base: `${base}/` });
    eq(news.items(), [], 'nothing before the first fetch');
    eq(await news.refresh(), true);
    eq(news.items().map((x) => x.id), ['b', 'a']);
    eq(news.unseen(), 2);
    eq(/^data:image\/png;base64,/.test(news.photo(news.items()[0])), true, 'the photo is kept');
    eq(news.photo(news.items()[1]), '', 'no photo, none shown');
    eq(news.markSeen('b'), true); eq(news.markSeen('b'), false); eq(news.unseen(), 1);
    eq(await news.refresh(), false, 'nothing new, nothing changed');
    const again = new News({ dir: path.join(tmp, 'news'), base: 'http://127.0.0.1:1/' });
    eq(again.items().map((x) => x.id), ['b', 'a'], 'kept across a restart');
    eq(again.unseen(), 1, 'seen is kept too');
    eq(await again.refresh(), false); eq(again.items().length, 2, 'unreachable server: what was kept stays');

    // a new announcement shows as unseen; a photo over 1024 pixels is left out; a gone one is cleaned up
    files.set('/news.json', JSON.stringify({ items: good.slice(0, 2).concat([{ id: 'e', title: 'Big', date: '2026-12-01', image: 'e.png' }]) }));
    files.set('/e.png', makePng(1100, 20));
    eq(await news.refresh(), true);
    eq(news.items()[0].id, 'e'); eq(news.unseen(), 2);
    eq(news.photo(news.items()[0]), '', 'too big: no photo');
    files.set('/news.json', JSON.stringify({ items: [good[1]] }));
    await news.refresh();
    eq(fs.readdirSync(path.join(tmp, 'news')).sort(), ['news.json', 'seen.json'], 'photos of gone announcements removed');

    // statistics: nothing without a server address; with one, a check-in with only these fields, the same id each time
    const noUrl = new Stats({ dir: path.join(tmp, 's0'), url: '' });
    eq(noUrl.available(), false); eq(await noUrl.ping('open'), false); eq(posts.length, 0, 'no address, nothing sent');
    const st = new Stats({ dir: path.join(tmp, 's1'), url: `${base}/v1`, version: () => '3.3.0', hmi: () => 'ID7' });
    eq(await st.ping('open'), true); eq(st.last, true);
    const p = posts[posts.length - 1];
    eq(p.url, '/v1/ping'); eq(Object.keys(p.body).sort(), ['ev', 'hmi', 'id', 'v', 'ver'], 'only these fields are sent');
    eq(/^[0-9a-f-]{36}$/.test(p.body.id), true); eq([p.body.ev, p.body.ver, p.body.hmi], ['open', '3.3.0', 'ID7']);
    const id = p.body.id;
    eq(await st.ping(), true); eq(posts[posts.length - 1].body.id, id, 'the same id each time'); eq(posts[posts.length - 1].body.ev, 'ping');
    eq(await new Stats({ dir: path.join(tmp, 's1'), url: `${base}/v1` }).id(), id, 'kept across a restart');
    st.start(); await new Promise((r) => setTimeout(r, 50)); st.stop();
    eq(posts[posts.length - 1].body.ev, 'open', 'start checks in at once');
    // the car's Node is old: no crypto.randomUUID (3.3.2 died there and the Store never finished starting)
    const crypto = require('crypto');
    const had = crypto.randomUUID;
    crypto.randomUUID = undefined;
    try {
        const old = new Stats({ dir: path.join(tmp, 's3'), url: `${base}/v1` });
        const oid = old.id();
        eq(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(oid), true, 'an id without randomUUID');
        eq(await old.ping('open'), true, 'and a check-in without it');
        const broken = new Stats({ dir: path.join(tmp, 's4'), url: `${base}/v1` });
        broken.id = () => { throw new Error('boom'); };
        eq(await broken.ping('open'), false, 'a failing id is not thrown at the Store');
        broken.start(); broken.stop();
    } finally { crypto.randomUUID = had; }
    const dead = new Stats({ dir: path.join(tmp, 's2'), url: 'http://127.0.0.1:1/v1' });
    eq(await dead.ping(), false); eq(dead.last, false, 'an unreachable server is not an error');

    srv.close();
    console.log(`bcs_net: ${checks} checks pass`);
})().catch((e) => { console.error(e); process.exit(1); });
