'use strict';
/* Usage statistics: the car's statistics, for planning. The Store tells the BCS server now and then that this install is alive:
 * a random install id (made at the first check-in, not linked to the car or its owner), the Store's version and the iDrive
 * version. Nothing about the owner: no name, email, VIN, account or GPS. The server sees the connection's address and works out
 * country, region and city from it; it keeps a shortened address (analytics/README.md, PRIVACY.md). The address of the server is
 * STATS_URL in src/bcs_config.js; empty = nothing is sent. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const net = require('./bcs_net.js');

const PING_MS = 5 * 60 * 1000;

class Stats {
    constructor(opts) {
        const o = opts || {};
        this.dir = o.dir;
        this.url = o.url || '';
        this.post = o.post || net.postJson;
        this.version = o.version || (() => '');
        this.hmi = o.hmi || (() => '');
        this.seed = o.seed || (() => '');     // something stable of this install, for an id when none can be saved
        this.last = null;             // the last check-in reached the server (null: none yet)
        this._timer = null;
    }

    _file(n) { return path.join(this.dir, n); }

    _read(n) { try { return fs.readFileSync(this._file(n), 'utf8').trim(); } catch (e) { return ''; } }

    _write(n, v) {
        try {
            fs.mkdirSync(this.dir, { recursive: true });
            fs.writeFileSync(this._file(n), v);
        } catch (e) { /* not kept */ }
    }

    available() { return !!this.url; }

    /* The install id: made once, saved, and read back. If it cannot be saved there is no id ('' ), so nothing built on it (the feed address)
     * can ever change: a second id is never made. Kept in memory once it is good. */
    id() {
        if (this._id) {
            return this._id;
        }
        let id = this._read('install-id');
        if (!/^[0-9a-f-]{36}$/.test(id)) {
            // randomBytes, not randomUUID: the car's Node is old and has no randomUUID (it stopped the Store from starting in 3.3.2)
            const b = crypto.randomBytes(16);
            b[6] = (b[6] & 0x0f) | 0x40;
            b[8] = (b[8] & 0x3f) | 0x80;
            const h = b.toString('hex');
            id = `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
            this._write('install-id', id);
            if (this._read('install-id') !== id) {
                // cannot be saved: an id made from something stable of this install, so it is still the same one every time
                let seed = '';
                try { seed = String(this.seed() || ''); } catch (e) { seed = ''; }
                if (!seed) {
                    return '';
                }
                const h = crypto.createHash('sha256').update(`bcs-store-install:${seed}`).digest('hex');
                id = `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
            }
        }
        this._id = id;
        return id;
    }

    ping(ev) {
        if (!this.available()) {
            return Promise.resolve(false);
        }
        try {
            return this.post(`${this.url}/ping`, { v: 1, id: this.id(), ev: ev || 'ping', ver: this.version(), hmi: this.hmi() })
                .then((r) => { this.last = r.status === 200; return this.last; }, () => { this.last = false; return false; });
        } catch (e) {
            this.last = false;      // statistics must never stop the Store
            return Promise.resolve(false);
        }
    }

    /* Once now and every five minutes. */
    start() {
        this.stop();
        if (!this.available()) {
            return;
        }
        this.ping('open');
        this._timer = setInterval(() => this.ping('ping'), PING_MS);
        if (this._timer.unref) {
            this._timer.unref();
        }
    }

    stop() {
        clearInterval(this._timer);
        this._timer = null;
    }
}

module.exports = { Stats, PING_MS };
