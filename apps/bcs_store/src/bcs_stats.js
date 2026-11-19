'use strict';
/* Usage statistics, off until the owner of the car says yes (Settings > Usage statistics). When on, the Store tells the BCS
 * server now and then that this install is alive: a random install id (made when it is switched on), the Store's version
 * and the iDrive version. The server sees the connection's address and works out country, region and city from it; it keeps
 * a shortened address (see analytics/README.md). Off: the server is told to forget the id and the id is deleted here. The
 * address of the server is STATS_URL in src/bcs_config.js; empty = this feature is not offered. */
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
        this.last = '';               // 'ok' | 'failed' | ''
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

    /* 'on', 'off' (said no) or 'unset' (not asked yet). */
    state() {
        const v = this._read('stats');
        return v === 'on' || v === 'off' ? v : 'unset';
    }

    id() {
        let id = this._read('install-id');
        if (!/^[0-9a-f-]{36}$/.test(id)) {
            id = crypto.randomUUID();
            this._write('install-id', id);
        }
        return id;
    }

    _send(ev, id) {
        if (!this.available()) {
            return Promise.resolve(false);
        }
        return this.post(`${this.url}/ping`, { v: 1, id, ev, ver: this.version(), hmi: this.hmi() })
            .then((r) => { this.last = r.status === 200 ? 'ok' : 'failed'; return r.status === 200; }, () => { this.last = 'failed'; return false; });
    }

    ping(ev) {
        return this.state() === 'on' ? this._send(ev || 'ping', this.id()) : Promise.resolve(false);
    }

    /* Switch on or off; off tells the server to forget this install. */
    set(on) {
        if (on) {
            this._write('stats', 'on');
            this.start();
            return this._send('open', this.id());
        }
        const id = this._read('install-id');
        this._write('stats', 'off');
        this.stop();
        try { fs.unlinkSync(this._file('install-id')); } catch (e) { /* none */ }
        this.last = '';
        return id && this.available() ? this.post(`${this.url}/optout`, { v: 1, id }).then(() => true, () => false) : Promise.resolve(false);
    }

    /* While on: once now and every five minutes. */
    start() {
        this.stop();
        if (this.state() !== 'on' || !this.available()) {
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
