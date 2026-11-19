'use strict';
/* Announcements: a manifest (news.json) and its photos, kept in the BCS Store's GitHub (the announcements/ folder, filled by
 * tools/announce.py) and fetched here. The page shows one announcement at a time; one not seen yet carries NEW, and the
 * Settings tab a count. What was fetched is kept in <dir>, so the page works without the internet.
 *   news.json: { "items": [ { "id", "title", "text", "date": "YYYY-MM-DD", "image": "<id>.png" } ] }
 * Photos are PNG up to 1024 pixels a side (what the renderer's decoder takes); a bigger or unreadable one is left out and
 * its announcement is shown without the photo. */
const fs = require('fs');
const path = require('path');
const net = require('./bcs_net.js');
const png = require('./kit_png.js');

const BASE = 'https://raw.githubusercontent.com/bcs-asia/app-store/main/announcements/';
const MAX_ITEMS = 30;
const MAX_IMAGE = 700 * 1024;
const ID = /^[A-Za-z0-9._-]{1,80}$/;
const IMAGE = /^[A-Za-z0-9._-]{1,100}\.png$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

/* The manifest's items that are well formed, newest first. */
function parse(buf) {
    let doc;
    try { doc = JSON.parse(String(buf)); } catch (e) { return null; }
    const list = doc && Array.isArray(doc.items) ? doc.items : null;
    if (!list) {
        return null;
    }
    const seen = new Set();
    return list.map((x) => ({ id: str(x && x.id, 80), title: str(x && x.title, 120), text: str(x && x.text, 600), date: str(x && x.date, 10),
        image: str(x && x.image, 100) }))
        .filter((x) => ID.test(x.id) && x.title && DATE.test(x.date) && (!x.image || IMAGE.test(x.image)) && !seen.has(x.id) && seen.add(x.id))
        .sort((a, b) => (a.date === b.date ? (a.id < b.id ? 1 : -1) : (a.date < b.date ? 1 : -1))).slice(0, MAX_ITEMS);
}

class News {
    constructor(opts) {
        const o = opts || {};
        this.dir = o.dir;
        this.base = o.base || BASE;
        this.get = o.get || net.get;
        this._items = [];
        this._seen = new Set();
        this._urls = new Map();       // image file -> data URL (the two or three last shown)
        this.error = '';
        this.load();
    }

    _read(name) {
        try { return fs.readFileSync(path.join(this.dir, name)); } catch (e) { return null; }
    }

    _write(name, data) {
        try {
            fs.mkdirSync(this.dir, { recursive: true });
            fs.writeFileSync(path.join(this.dir, name), data);
        } catch (e) { /* kept in memory only */ }
    }

    /* What was kept: the last manifest and the ids seen. */
    load() {
        const cached = this._read('news.json');
        this._items = (cached && parse(cached)) || [];
        let seen = [];
        try { seen = JSON.parse(String(this._read('seen.json') || '[]')); } catch (e) { seen = []; }
        this._seen = new Set(Array.isArray(seen) ? seen.filter((x) => typeof x === 'string') : []);
    }

    items() { return this._items; }

    unseen() { return this._items.filter((x) => !this._seen.has(x.id)).length; }

    isSeen(id) { return this._seen.has(id); }

    markSeen(id) {
        if (this._seen.has(id)) {
            return false;
        }
        this._seen.add(id);
        this._write('seen.json', JSON.stringify(Array.from(this._seen).slice(-200)));
        return true;
    }

    /* The item's photo as a data URL ('' when it has none or it is not here). */
    photo(item) {
        if (!item || !item.image) {
            return '';
        }
        if (this._urls.has(item.image)) {
            return this._urls.get(item.image);
        }
        const buf = this._read(item.image);
        let url = '';
        if (buf) {
            url = `data:image/png;base64,${buf.toString('base64')}`;
        }
        this._urls.set(item.image, url);
        if (this._urls.size > 3) {
            this._urls.delete(this._urls.keys().next().value);
        }
        return url;
    }

    /* Fetch the manifest and the photos it names that are not kept; resolves true when what is shown changed. */
    async refresh() {
        let body;
        try {
            body = await this.get(`${this.base}news.json`, { maxBytes: 64 * 1024 });
        } catch (e) {
            this.error = e.message;
            return false;
        }
        const items = parse(body);
        if (!items) {
            this.error = 'bad manifest';
            return false;
        }
        this.error = '';
        for (const it of items) {
            if (it.image && !this._read(it.image)) {
                try {
                    const img = await this.get(`${this.base}${it.image}`, { maxBytes: MAX_IMAGE, timeoutMs: 30000 });
                    const p = png.decode(img);
                    if (p && p.w <= 1024 && p.h <= 1024) {
                        this._write(it.image, img);
                    }
                } catch (e) { /* shown without its photo; tried again at the next refresh */ }
            }
        }
        const before = JSON.stringify(this._items);
        this._items = items;
        this._write('news.json', JSON.stringify({ items }));
        this._urls.clear();
        // photos of announcements that are gone
        try {
            const keep = new Set(items.map((x) => x.image).concat(['news.json', 'seen.json']));
            fs.readdirSync(this.dir).filter((f) => !keep.has(f)).forEach((f) => fs.unlinkSync(path.join(this.dir, f)));
        } catch (e) { /* nothing to clean */ }
        return before !== JSON.stringify(items);
    }
}

module.exports = { News, parse, BASE };
