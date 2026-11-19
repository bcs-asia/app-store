'use strict';
/* BCS Store's own small HTTPS client (the Announcements photos and the usage check-in). One request, a time limit, a size
 * limit, at most three redirects, https only (http only to this computer, for the tests). BCS_OFFLINE=1 refuses every request. */
const https = require('https');
const http = require('http');
const { URL } = require('url');      // not a global on the car's older Node

const LOCAL = /^(127\.0\.0\.1|localhost|\[::1\])$/;

function request(url, opts) {
    const o = Object.assign({ method: 'GET', body: null, headers: {}, timeoutMs: 15000, maxBytes: 1 << 20, redirects: 3 }, opts || {});
    return new Promise((resolve, reject) => {
        if (process.env.BCS_OFFLINE === '1') {
            return reject(new Error('offline'));
        }
        let u;
        try { u = new URL(url); } catch (e) { return reject(new Error('bad url')); }
        const local = LOCAL.test(u.hostname);
        if (u.protocol !== 'https:' && !(local && u.protocol === 'http:')) {
            return reject(new Error('https only'));
        }
        const lib = u.protocol === 'https:' ? https : http;
        const headers = Object.assign({ 'user-agent': 'BCS-Store' }, o.headers);
        if (o.body !== null) {
            headers['content-length'] = Buffer.byteLength(o.body);
        }
        // an options object, not request(url, options): the car's older Node takes only one of the two
        const req = lib.request({ protocol: u.protocol, hostname: u.hostname.replace(/^\[|\]$/g, ''), port: u.port || undefined,
            path: `${u.pathname}${u.search}`, method: o.method, headers, timeout: o.timeoutMs }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && o.redirects > 0) {
                res.resume();
                return request(new URL(res.headers.location, u).toString(), Object.assign({}, o, { redirects: o.redirects - 1 })).then(resolve, reject);
            }
            const chunks = [];
            let n = 0;
            res.on('data', (c) => {
                n += c.length;
                if (n > o.maxBytes) {
                    req.destroy(new Error('too large'));
                } else {
                    chunks.push(c);
                }
            });
            res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
            res.on('error', reject);
        });
        req.on('timeout', () => req.destroy(new Error('timeout')));
        req.on('error', reject);
        req.end(o.body !== null ? o.body : undefined);
    });
}

const get = (url, opts) => request(url, opts).then((r) => {
    if (r.status !== 200) {
        throw new Error(`http ${r.status}`);
    }
    return r.body;
});
const postJson = (url, obj, opts) => request(url, Object.assign({ method: 'POST', body: JSON.stringify(obj), headers: { 'content-type': 'application/json' },
    timeoutMs: 10000, maxBytes: 4096 }, opts || {}));

module.exports = { request, get, postJson };
