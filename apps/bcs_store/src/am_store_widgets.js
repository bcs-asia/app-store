'use strict';
/*
 * The store's widgets (App Manager 2) for renderer screens: app icons, app grid, lists with pictures, chips, side
 * menu, buttons, on-screen keyboard, sheet. Every icon here is drawn by the renderer - kit/vicons.js vector icons or
 * pictures an app hands over (ScreenApp.setImage -> 'key:<name>') - never the HMI's glyph icons, which differ between
 * iDrive 7 and 8 (widgets.js icon()). Same signature as widgets.js: (cv, t, b, o).
 * Taps reach the app as ScreenApp 'change' events: o.tap = { id, part, n } / o.key = { text, n }, n counting up so a
 * second tap on the same thing is a change too.
 */
const { withAlpha, mix } = require('./kit_canvas.js');
const { vicon } = require('./kit_vicons.js');
const W = require('./am_widgets.js');
const { t: tr } = require('./i18n.js');
const look = require('./bcs_look.js');
const kit = require('./kit_record.js');
const { BG, CARBON, XMAS, RATIO: BG_RATIO } = require('./bcs_bg.js');

const GREEN = '#35d07f', BLUE = '#e4002b', AMBER = '#ffb020';
const C = (t, c, d) => (c ? t[c] || c : d);
const mid = (cv, s, x, cy, size, c, opts) => cv.text(String(s), x, cy + size * 0.36, size, c, opts);
const lines = (s) => String(s || '').split('\n').map((l) => l.split(',').map((x) => x.trim())).filter((l) => l[0]);
const pair = (s, d) => { const p = String(s || '').split(',').map((x) => x.trim()).filter(Boolean); return p.length >= 2 ? p : d; };
const tapped = (o, id, part) => { o.tapN = (o.tapN || 0) + 1; o.tap = { id, part, n: o.tapN }; };
const BADGE = { installed: () => [GREEN, 'check'], update: () => [look.get().accent, 'arrowDown'], queued: () => [AMBER, 'clock'] };

/**
 * App icon in the s x s square at (x, y): the picture a.icon names, else a gradient (a.colors) with the vector glyph
 * a.vicon, else the title's first letter. Apps: rounded square; system services (a.kind 'service' or a service kind):
 * round. a.badge: installed | update | queued; a.progress 0..1: a ring (downloading). bg: the colour behind the badge.
 */
function appIcon(cv, t, a, x, y, s, bg) {
    const cx = x + s / 2, cy = y + s / 2, round = a.kind && a.kind !== 'app', c = pair(a.colors, ['#3a4352', '#232a35']);
    const img = a.icon ? W.picture(a.icon) : null;
    if (img) cv.image(img, x, y, s, s, round ? s / 2 : s * 0.24);
    else if (round) {
        cv.circle(cx, cy, s / 2, c[1]); cv.circle(cx, cy, s / 2 - s * 0.06, c[0]); cv.circle(cx, cy, s / 2 - s * 0.12, withAlpha(c[1], 0.55));
    } else {
        cv.card(x, y, s, s, s * 0.24, [[0, c[0]], [1, c[1]]]);
        cv.card(x, y, s, s * 0.5, s * 0.24, [[0, withAlpha('#ffffff', 0.18)], [1, withAlpha('#ffffff', 0)]]);
    }
    if (!img) {
        const g = s * 0.56;
        if (!(a.vicon && vicon(cv, a.vicon, cx - g / 2, cy - g / 2, g, '#ffffff'))) {
            const letter = String(a.letter || a.title || '?').trim()[0] || '?';
            cv.text(letter.toUpperCase(), cx, cy + s * 0.18, Math.round(s * 0.5), '#ffffff', { align: 'center', font: 'bold' });
        }
    }
    if (typeof a.progress === 'number' && a.progress >= 0) {
        const r0 = s / 2 + s * 0.06, r1 = s / 2 + s * 0.1;
        cv.arc(cx, cy, r0, r1, 0, 360, withAlpha('#ffffff', 0.15));
        if (a.progress > 0) cv.arc(cx, cy, r0, r1, 0, 360 * Math.min(1, a.progress), look.get().accent);
    }
    const bd = BADGE[a.badge] && BADGE[a.badge]();
    if (bd) {
        const br = s * 0.17, bx = x + s - br * 0.6, by = y + br * 0.6, gs = br * 1.3;
        cv.circle(bx, by, br + Math.max(2, s * 0.03), bg || t.bg);
        cv.circle(bx, by, br, bd[0]);
        vicon(cv, bd[1], bx - gs / 2, by - gs / 2, gs, '#ffffff');
    }
}

/** Wi-Fi style signal icon: 4 rising bars, the first n lit (0..4), at x, centred on cy, w wide and hh high. */
function signalBars(cv, x, cy, w, hh, n, c) {
    const gap = w * 0.12, bw = (w - 3 * gap) / 4, bottom = cy + hh / 2;
    [0.34, 0.56, 0.78, 1].forEach((k, i) => {
        const bh = hh * k;
        cv.roundRect(x + i * (bw + gap), bottom - bh, bw, bh, bw * 0.3, i < n ? c : withAlpha(c, 0.3));
    });
}

/** Pill with optional dot or signal bars (bars: 0..4 lit); returns its width. x = right edge when right. */
function chip(cv, text, x, y, h, c, dot, right, bars) {
    const s = Math.round(h * 0.44), d = h * 0.16, bw = typeof bars === 'number' ? h * 0.56 : 0;
    const w = cv.textWidth(text, s) + h * 0.9 + (dot ? d * 3 : 0) + (bw ? bw + h * 0.22 : 0), x0 = right ? x - w : x;
    cv.roundRect(x0, y, w, h, h / 2, withAlpha(c, 0.14));
    cv.strokeRoundRect(x0, y, w, h, h / 2, 2, withAlpha(c, 0.55));
    let tx = x0 + h * 0.45;
    if (dot) { cv.circle(tx + d, y + h / 2, d, c); tx += d * 3; }
    if (bw) { signalBars(cv, tx, y + h / 2, bw, h * 0.44, bars, c); tx += bw + h * 0.22; }
    cv.text(text, tx, y + h / 2 + s * 0.36, s, c);
    return w;
}
const chipItems = (items) => (Array.isArray(items) ? items
    : String(items || '').split(';').map((s) => s.split('|').map((x) => x.trim())).filter((p) => p[0])
        .map((p) => ({ text: p[0], color: p[1], dot: p[2] === 'dot', bars: /^bars:\d$/.test(p[2] || '') ? +p[2].slice(5) : undefined })));

function chips(cv, t, b, o) {
    const items = chipItems(o.items), gap = b.h * 0.25;
    if (o.align === 'right') {
        let x = b.x + b.w;
        for (let i = items.length - 1; i >= 0; i--) x -= chip(cv, items[i].text, x, b.y, b.h, C(t, items[i].color, t.text), items[i].dot, true, items[i].bars) + gap;
    } else {
        let x = b.x;
        for (const it of items) x += chip(cv, it.text, x, b.y, b.h, C(t, it.color, t.text), it.dot, false, it.bars) + gap;
    }
}

function appIconEl(cv, t, b, o) {
    const s = Math.min(b.w, b.h);
    appIcon(cv, t, o, b.x + (b.w - s) / 2, b.y + (b.h - s) / 2, s);
}

// ---- Settings > Theme: a tile per look, a miniature of the Apps screen in that look over its name ---------------
/* The Apps screen of look `id` in miniature inside box (x, y, w, h). The corners are those of that look, whichever look is in use. */
function themeThumb(cv, id, x, y, w, h) {
    const red = id !== 'blue', lux = id === 'carbon', inUse = look.get().sharp, AC = look.LOOKS[id].accent;
    kit.setSharp(red);
    try {
        const rd = red ? 0 : Math.max(4, w * 0.012), nw = w * 0.13;
        if (red) {
            cv.fillRect(x, y, w, h, '#0a0a0a');
            const ih = Math.min(h, (w - nw) / BG_RATIO), img = W.picture(lux ? CARBON : BG);
            if (img) cv.image(img, x + nw, y + h - ih, w - nw, ih, 0);
        } else {
            cv.card(x, y, w, h, 0, [[0, '#0d3a5c'], [1, '#06182a']]);
            const xi = W.picture(XMAS), xh = Math.min(h, (w - nw) / BG_RATIO);
            if (xi) cv.image(xi, x + nw, y + h - xh, w - nw, xh, 0);
        }
        // side menu: the open tab (a flat red band / a round blue disc) over three more
        cv.fillRect(x, y, nw, h, red ? withAlpha('#050505', 0.94) : withAlpha('#07192b', 0.9));
        const ty = y + h * 0.06, th = h * 0.15;
        if (lux) { cv.card(x, ty, nw, th, 0, [[0, withAlpha('#ffffff', 0.14)], [1, withAlpha('#ffffff', 0)]]); cv.fillRect(x, ty, Math.max(2, nw * 0.07), th, AC); }
        else if (red) cv.card(x, ty, nw, th, 0, [[0, '#e4002b'], [1, withAlpha('#e4002b', 0.62)]]);
        else cv.circle(x + nw / 2, ty + th / 2, th * 0.4, '#3d9bff');
        for (let i = 1; i < 5; i++) {
            const cy = ty + i * (h * 0.17) + th / 2;
            if (red) cv.fillRect(x + nw * 0.34, cy - nw * 0.1, nw * 0.32, nw * 0.2, '#6a6a6a');
            else cv.circle(x + nw / 2, cy, th * 0.3, withAlpha('#ffffff', 0.12));
        }
        // header: the title bar, the two toggles
        const hx = x + nw + w * 0.04, hy = y + h * 0.07, hh = h * 0.07;
        cv.roundRect(hx, hy, w * 0.14, hh, rd / 2, '#ffffff');
        const tw = w * 0.1, tg = hy - h * 0.012, tgh = h * 0.1;
        cv.roundRect(x + w - w * 0.03 - tw * 2 - w * 0.015, tg, tw, tgh, rd, lux ? AC : red ? '#ffffff' : '#00bfff');
        if (lux) cv.strokeRoundRect(x + w - w * 0.03 - tw, tg, tw, tgh, 0, 2, AC);
        else if (red) { cv.roundRect(x + w - w * 0.03 - tw, tg, tw, tgh, 0, withAlpha('#ffffff', 0.12)); cv.fillRect(x + w - w * 0.03 - tw, tg + tgh - 2, tw, 2, '#e4002b'); }
        else cv.strokeRoundRect(x + w - w * 0.03 - tw, tg, tw, tgh, rd, 2, '#00bfff');
        // six cards
        const gx = x + nw + w * 0.04, gw = (x + w - w * 0.03 - gx - 2 * w * 0.02) / 3, gy = y + h * 0.27, gh = (y + h - h * 0.07 - gy - h * 0.04) / 2;
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
            const cx = gx + c * (gw + w * 0.02), cy = gy + r * (gh + h * 0.04);
            if (lux) {
                cv.card(cx, cy, gw, gh, 0, [[0, withAlpha('#000000', 0.78)], [1, withAlpha('#000000', 0.86)]]);
                cv.strokeRoundRect(cx, cy, gw, gh, 0, 1.5, withAlpha(AC, 0.9));
            } else if (red) {
                cv.card(cx, cy, gw, gh, 0, [[0, withAlpha('#141414', 0.85)], [1, withAlpha('#0a0a0a', 0.35)]]);
                cv.quad([[cx, cy], [cx + gh * 0.2, cy], [cx, cy + gh * 0.2], [cx, cy]], '#e4002b');
                cv.fillRect(cx, cy + gh - 2, gw * 0.7, 2, '#e4002b');
            } else {
                cv.card(cx, cy, gw, gh, rd * 1.8, [[0, '#14405f'], [1, '#07192b']]);
                cv.strokeRoundRect(cx, cy, gw, gh, rd * 1.8, 1, withAlpha('#5fb8ee', 0.4));
            }
            cv.roundRect(cx + gw * 0.08, cy + gh * 0.3, gh * 0.4, gh * 0.4, red ? 0 : rd, red ? '#7a7a7a' : '#2a6a9a');
            cv.roundRect(cx + gw * 0.08 + gh * 0.5, cy + gh * 0.34, gw * 0.3, gh * 0.1, 0, withAlpha('#ffffff', 0.85));
        }
    } finally {
        kit.setSharp(inUse);
    }
}

// a ring with a bright arc that turns with a (degrees): the loading tile at the end of the Apps list
function spinner(cv, cx, cy, size, a, color, loading) {
    const r1 = size / 2, r0 = r1 * 0.78;
    cv.arc(cx, cy, r0, r1, 0, 360, withAlpha('#ffffff', 0.14));
    cv.arc(cx, cy, r0, r1, a, a + (loading ? 110 : 70), color, { round: true });
}

/** The footer row of a grid with o.more: the ring at its middle, turning while o.loading (o.spin degrees). */
function gridFooter(cv, b, g, o) {
    if (!o.more) return;
    const fr = Math.ceil(g.all.length / g.cols);
    if (fr < g.first || fr >= g.end) return;
    const y = b.y + (fr - g.top) * g.th;
    spinner(cv, b.x + b.w / 2, y + g.th / 2, Math.min(g.th * 0.34, 96), o.spin || 0, o.ringColor || look.get().accent, !!o.loading);
}
// ---- app grid: tiles in rows, scrolled by the pixel (o.top: rows scrolled, fractional) -------------------------
const gridItems = (o) => (Array.isArray(o.items) ? o.items
    : lines(o.items).map((l, i) => ({ id: `item${i}`, title: l[0], sub: l[1] || '', vicon: l[2] || '', colors: l[3] ? `${l[3]},${l[4] || l[3]}` : '' })));
function gridView(b, o) {
    // o.more: one empty row after the last tile, where the turning ring shows (more tiles are coming as the list is scrolled to its end)
    const cols = Math.max(1, o.cols | 0 || 5), th = o.tileH || 274, all = gridItems(o), rows = Math.ceil(all.length / cols) + (o.more ? 1 : 0);
    const shown = b.h / th, max = Math.max(0, rows - shown), top = Math.max(0, Math.min(max, +o.top || 0));
    return { cols, th, tw: b.w / cols, all, rows, shown, max, top, first: Math.floor(top), end: Math.min(rows, Math.ceil(top + shown)) };
}
/** The ids of the tiles on screen (the app decodes only their icons). */
function visibleIds(b, o) {
    const g = gridView(b, o);
    return g.all.slice(g.first * g.cols, g.end * g.cols).map((a) => a.id);
}
// a source line too long for its tile keeps its repo name whole and shortens the owner
function fitSource(cv, s, w, size) {
    const i = s.lastIndexOf('/');
    if (i < 0 || cv.textWidth(s, size) <= w) return W.fit(cv, s, w, size);
    const repo = s.slice(i);
    return W.fit(cv, s.slice(0, i), Math.max(0, w - cv.textWidth(repo, size)), size) + repo;
}
// ---- billboard cards: the card of tile k, and what is where on it ---------------------------------------------
/** Card k (0 = the grid's first tile) as the grid box b shows it, scrolled by g.top. */
function cardBox(b, g, k) {
    return { x: b.x + (k % g.cols) * g.tw + 8, y: b.y + (Math.floor(k / g.cols) - g.top) * g.th + 6, w: g.tw - 16, h: g.th - 12 };
}
/** What is where on a card: the big icon on the left, its name and state beside it and, for a tile with a.btn
 *  (Install now / Update now) on a card tall enough, the button under them. Used by the drawing and by store_frame.js. */
function cardLayout(card, a) {
    const ch = card.h, cw = card.w;
    const iconS = Math.round(Math.max(52, Math.min(ch * 0.58, cw * 0.31)));
    const iconX = card.x + 22, iconY = card.y + (ch - iconS) / 2;
    const tx = iconX + iconS + 22, maxW = Math.max(50, card.x + cw - tx - 18);
    const nameSize = Math.round(Math.max(19, Math.min(38, ch * 0.14, maxW / 7.5)));
    const subSize = Math.round(Math.max(16, nameSize * 0.7));
    const btnH = Math.round(Math.min(66, ch * 0.25));
    const btn = a && a.btn && ch >= 170 ? { x: tx, y: card.y + ch - btnH - Math.round(ch * 0.12), w: maxW, h: btnH } : null;
    const nameY = card.y + ch * (btn ? 0.33 : 0.46);
    return { iconS, iconX, iconY, tx, maxW, nameSize, subSize, nameY, subY: nameY + subSize * 1.6, btn };
}
// (the Store: o.iconK, o.titleSize, o.subSize size a smaller tile's icon and texts; the defaults are the design's.
// Tiles with a source line (item.src, dim, under the title) set the three lines closer and take the icon that
// leaves them, descenders included, above the tile's bottom 8 px, where the focus rings are drawn: store_frame.js.)
function appGrid(cv, t, b, o) {
    const g = gridView(b, o), k = g.th / 274;
    const ts = o.titleSize || 40, ss = o.subSize || 30, rs = Math.round(ss * 0.9), top = 12 * k;
    const src = g.all.some((a) => a.src);
    const gap = src ? [ts * 1.2, rs * 1.25, ss * 1.25] : [ts * 1.45, 0, ss * 1.4];
    const s = src ? Math.floor(Math.min(g.th * (o.iconK || 0.5), g.th - 8 - top - gap[0] - gap[1] - gap[2] - ss * 0.25))
        : Math.round(g.th * (o.iconK || 0.5));
    cv.clip(b.x, b.y, b.w, b.h);
    if (o.cardStyle === 'billboard') {
        const first = g.first * g.cols;
        g.all.slice(first, g.end * g.cols).forEach((a, i) => {
            const card = cardBox(b, g, first + i), { x, y, w: cw, h: ch } = card, L = cardLayout(card, a);
            const LK = look.get(), sport = LK.sport, lux = !!LK.lux, AC = LK.accent;
            if (lux) {           // a carbon card: dark glass over the backdrop, a thin gold frame and a gold line under it
                cv.card(x, y, cw, ch, 0, [[0, withAlpha('#000000', 0.74)], [1, withAlpha('#000000', 0.82)]]);
                cv.card(x, y, cw, ch * 0.45, 0, [[0, withAlpha('#ffffff', 0.09)], [1, withAlpha('#ffffff', 0)]]);
                cv.strokeRoundRect(x + 1, y + 1, cw - 2, ch - 2, 0, 2, withAlpha(AC, 0.85));
                cv.fillRect(x + cw * 0.04, y + ch - 3, cw * 0.62, 2, withAlpha(AC, 0.9));
            } else if (sport) {  // a sport card: square, see-through and fading to the bottom, a red flag in the corner and a red line under it
                cv.card(x, y, cw, ch, 0, [[0, withAlpha('#141414', 0.82)], [0.55, withAlpha('#0c0c0c', 0.62)], [1, withAlpha('#0a0a0a', 0.3)]]);
                cv.strokeRoundRect(x + 1, y + 1, cw - 2, ch - 2, 0, 2, withAlpha('#ffffff', 0.13));
                const fl = Math.round(Math.min(40, ch * 0.16));
                cv.quad([[x, y], [x + fl, y], [x, y + fl], [x, y]], '#e4002b');
                [[0, 0.95], [0.22, 0.75], [0.44, 0.5], [0.66, 0.28], [0.84, 0.12]].forEach(([k0_, al], j, arr) => {
                    const x1 = j + 1 < arr.length ? arr[j + 1][0] : 1;
                    cv.fillRect(x + cw * k0_, y + ch - 4, cw * (x1 - k0_), 4, withAlpha('#e4002b', al));
                });
            } else {             // a soft card: no side bar, a light top edge and a thin border
                cv.card(x, y, cw, ch, 24, [[0, '#14405f'], [1, '#07192b']]);
                cv.card(x, y, cw, ch * 0.5, 24, [[0, withAlpha('#ffffff', 0.08)], [1, withAlpha('#ffffff', 0)]]);
                cv.strokeRoundRect(x + 1, y + 1, cw - 2, ch - 2, 24, 2, withAlpha('#5fb8ee', 0.4));
            }
            if (a.thumb) {       // Settings > Theme: the look's miniature, its name and what a tap does
                const pad = Math.round(Math.min(18, cw * 0.02)), th = Math.round(ch * 0.64), acc = look.LOOKS[a.thumb] ? look.LOOKS[a.thumb].accent : '#00bfff';
                themeThumb(cv, a.thumb, x + pad, y + pad, cw - 2 * pad, th);
                cv.strokeRoundRect(x + pad, y + pad, cw - 2 * pad, th, 0, 1, withAlpha('#ffffff', 0.25));
                if (a.selected) cv.strokeRoundRect(x, y, cw, ch, sport ? 0 : 24, 4, acc);
                const ns2 = Math.round(Math.max(20, Math.min(40, ch * 0.075))), ss3 = Math.round(Math.max(15, ns2 * 0.62)), by = y + pad + th + ns2 * 1.35;
                cv.text(String(a.title || ''), x + pad + 6, by, ns2, '#ffffff', { font: 'bold' });
                cv.text(W.fit(cv, String(a.sub || ''), cw - 2 * pad - 12, ss3), x + pad + 6, by + ss3 * 1.5, ss3, withAlpha('#ffffff', 0.62));
                const cs = Math.round(ss3 * 1.05), label = String(a.state || ''), cw2 = cv.textWidth(label, cs, { font: 'bold' }) + cs * 1.8, ch2 = cs * 2.1;
                const cx0 = x + cw - pad - cw2, cy0 = y + ch - pad - ch2;
                if (a.selected) cv.roundRect(cx0, cy0, cw2, ch2, sport ? 0 : ch2 / 2, acc);
                else cv.strokeRoundRect(cx0, cy0, cw2, ch2, sport ? 0 : ch2 / 2, 2, acc);
                cv.text(label, cx0 + cw2 / 2, cy0 + ch2 / 2 + cs * 0.36, cs, a.selected ? '#ffffff' : acc, { align: 'center', font: 'bold' });
                return;
            }
            appIcon(cv, t, a, L.iconX, L.iconY, L.iconS, sport ? '#0b0b0c' : '#0b1b31');
            // (the source line is not shown on a card)
            const ns = W.shrink(cv, String(a.title || ''), L.maxW, L.nameSize, 'bold', 0.7);
            cv.text(W.fit(cv, String(a.title || ''), L.maxW, ns, 'bold'), L.tx, L.nameY, ns, sport ? '#ffffff' : '#f0f8ff', { font: 'bold' });
            // a long state (a translation) takes a smaller size before it is cut
            const ss2 = a.sub ? W.shrink(cv, String(a.sub), L.maxW, L.subSize, 'label', 0.8) : 0;
            if (a.sub) cv.text(W.fit(cv, String(a.sub), L.maxW, ss2), L.tx, L.subY, ss2, C(t, a.subColor, lux ? '#e8d29b' : sport ? '#ff8a96' : '#5de0ff'));
            // ID7 / ID8 tags (the head units it supports), top right of the card
            if (ch >= 150 && Array.isArray(a.tags) && a.tags.length) {
                const th = Math.round(Math.min(36, ch * 0.13)); let tx2 = x + cw - 18;
                for (let i = a.tags.length - 1; i >= 0; i--) {
                    tx2 -= chip(cv, a.tags[i], tx2, y + 14, th, a.tags[i] === 'ID8' ? (sport ? '#ffffff' : '#27e1c1') : (lux ? AC : sport ? '#ff5a64' : '#00bfff'), false, true) + th * 0.25;
                }
            }
            if (L.btn) {
                const q = L.btn, bs = Math.round(q.h * 0.44);
                cv.card(q.x, q.y, q.w, q.h, q.h / 2, lux ? [[0, '#ecd39a'], [1, '#b8914a']] : sport ? [[0, '#ff2a4a'], [1, '#b3001f']] : [[0, '#22b8ff'], [1, '#0b78d4']]);
                cv.strokeRoundRect(q.x + 1, q.y + 1, q.w - 2, q.h - 2, q.h / 2, 2, withAlpha('#ffffff', 0.25));
                cv.text(W.fit(cv, String(a.btn), q.w - 24, bs, 'bold'), q.x + q.w / 2, q.y + q.h / 2 + bs * 0.36, bs, lux ? '#14110a' : '#ffffff', { align: 'center', font: 'bold' });
            }
        });
        gridFooter(cv, b, g, o);
        cv.noclip();
        if (!g.all.length && o.empty) mid(cv, o.empty, b.x + b.w / 2, b.y + b.h / 2, 36, t.dim, { align: 'center' });
        if (g.max > 0 && o.bar !== false) {
            const h = b.h * g.shown / g.rows, y = b.y + (b.h - h) * g.top / g.max;
            cv.roundRect(b.x + b.w - 6, y, 6, h, 3, look.get().accent);
        }
        return;
    }
    g.all.slice(g.first * g.cols, g.end * g.cols).forEach((a, i) => {
        const x = b.x + (i % g.cols) * g.tw, y = b.y + (g.first + Math.floor(i / g.cols) - g.top) * g.th;
        appIcon(cv, t, a, x + (g.tw - s) / 2, y + top, s);
        const ny = y + top + s + gap[0], sy = ny + gap[1];
        cv.text(W.fit(cv, String(a.title || ''), g.tw - 16, ts, 'bold'), x + g.tw / 2, ny, ts, t.text, { align: 'center', font: 'bold' });
        if (a.src) cv.text(fitSource(cv, String(a.src), g.tw - 16, rs), x + g.tw / 2, sy, rs, t.dim, { align: 'center' });
        if (a.sub) cv.text(W.fit(cv, String(a.sub), g.tw - 16, ss), x + g.tw / 2, sy + gap[2], ss, C(t, a.subColor, t.dim), { align: 'center' });
    });
    gridFooter(cv, b, g, o);
    cv.noclip();
    if (!g.all.length && o.empty) mid(cv, o.empty, b.x + b.w / 2, b.y + b.h / 2, 36, t.dim, { align: 'center' });
    if (g.max > 0 && o.bar !== false) { // scroll bar (o.bar false: none, store_frame.js's drag rows)
        const h = b.h * g.shown / g.rows, y = b.y + (b.h - h) * g.top / g.max;
        cv.roundRect(b.x + b.w - 6, y, 6, h, 3, withAlpha(t.text, 0.25));
    }
}

// ---- list rows with a picture / vector icon and a control on the right ---------------------------------------
const rowItems = (o) => (Array.isArray(o.items) ? o.items
    : lines(o.items).map((l, i) => ({ id: `row${i}`, title: l[0], sub: l[1] || '', right: l[2] || 'chevron', vicon: l[3] || '' })));
// (the Store: o.fit, rows that do not all fit at o.rowH share the box, each on one line: its title, then its sub)
function listView(b, o) {
    const all = rowItems(o), line = !!o.fit && all.length * (o.rowH || 120) > b.h + 1e-6, rh = line ? b.h / all.length : o.rowH || 120;
    const n = b.h / rh, max = Math.max(0, all.length - n), top = Math.max(0, Math.min(max, +o.top || 0));
    // the gap between rows keeps the focus ring (8 px out from a row) off the next one
    const gap = Math.max(9, Math.round(rh * 0.13));
    return { rh, gap, all, n, max, top, line, first: Math.floor(top), end: Math.min(all.length, Math.ceil(top + n)) };
}
// the right-hand controls of a row ("toggle:on+trash": laid out from the right) -> [{ kind, arg, x, w }]
const RIGHT_W = { chevron: 60, trash: 80, toggle: 150 };
// (the Store: c scales the controls of a smaller row, o.ctlK)
function rightBoxes(b, it, cv, c) {
    let x = b.x + b.w;
    const k = c || 1;
    return String(it.right || '').split('+').filter(Boolean).reverse().map((r) => {
        const kind = r.split(':')[0], arg = r.slice(kind.length + 1);
        const w = (kind === 'chip' ? cv.textWidth(arg, 26 * k) + 54 * k : (RIGHT_W[kind] || 0) * k) + 24 * k;
        x -= w;
        return { kind, arg, x, w };
    });
}
// (the Store: o.titleSize, o.subSize and o.ctlK size a smaller row's texts and controls; the defaults are the design's)
function appList(cv, t, b, o) {
    const v = listView(b, o), gap = v.gap, q = o.ctlK || 1, ts = o.titleSize || 40, ss = o.subSize || 30;
    cv.clip(b.x, b.y, b.w, b.h);
    v.all.slice(v.first, v.end).forEach((it, k) => {
        const y = b.y + (v.first + k - v.top) * v.rh, h = v.rh - gap, s = Math.round(h * 0.73);
        cv.card(b.x, y, b.w, h, 22 * q, [[0, t.panelTop], [1, t.panelBottom]]);
        if (look.get().lux) cv.fillRect(b.x, y, 4, h, look.get().accent);
        else if (look.get().sport) { const fl = Math.round(Math.min(30, h * 0.28)); cv.quad([[b.x, y], [b.x + fl, y], [b.x, y + fl], [b.x, y]], '#e4002b'); }
        let tx = b.x + 28 * q;
        if (it.icon || it.vicon || it.colors || it.letter) {
            if (it.plain && it.vicon) vicon(cv, it.vicon, b.x + 28 * q, y + (h - s) / 2, s, C(t, it.iconColor, t.text));
            else appIcon(cv, t, it, b.x + 22 * q, y + (h - s) / 2, s, t.panelTop);
            tx = b.x + 22 * q + s + 32 * q;
        }
        const boxes = rightBoxes(b, it, cv, q), room = (boxes.length ? boxes[boxes.length - 1].x : b.x + b.w) - tx - 8;
        if (v.line) {
            const title = W.fit(cv, String(it.title || ''), room, ts, 'bold'), sx = tx + cv.textWidth(title, ts, { font: 'bold' }) + 24 * q;
            cv.text(title, tx, y + h / 2 + ts * 0.36, ts, t.text, { font: 'bold' });
            const sw = tx + room - sx, sz = it.sub ? W.shrink(cv, it.sub, sw, ss, undefined, 0.85) : ss;
            if (it.sub && sw > 0) cv.text(W.fit(cv, String(it.sub), sw, sz), sx, y + h / 2 + ts * 0.36, sz, C(t, it.subColor, t.dim));
        } else {
            cv.text(W.fit(cv, String(it.title || ''), room, ts, 'bold'), tx, it.sub ? y + h * 0.47 : y + h / 2 + ts * 0.36, ts, t.text, { font: 'bold' });
            if (it.sub) cv.text(W.fit(cv, String(it.sub), room, ss), tx, y + h * 0.83, ss, C(t, it.subColor, t.dim));
        }
        const cy = y + h / 2;
        for (const rb of boxes) {
            const re = rb.x + rb.w - 24 * q;                // the control's right edge
            if (rb.kind === 'chevron') W.chevron(cv, re - 28 * q, cy, 22 * q, 'right', 4 * q, t.dim);
            else if (rb.kind === 'trash') vicon(cv, 'trash', re - 66 * q, cy - 30 * q, 60 * q, t.dim);
            else if (rb.kind === 'toggle') {
                const on = rb.arg === 'on', tw = 150 * q, th = 76 * q, tx0 = re - tw;
                cv.roundRect(tx0, cy - th / 2, tw, th, th / 2, on ? GREEN : '#3a4352');
                cv.circle(on ? tx0 + tw - th / 2 : tx0 + th / 2, cy, th / 2 - 8 * q, '#ffffff');
            } else if (rb.kind === 'chip') chip(cv, rb.arg, re, cy - 30 * q, 60 * q, C(t, it.chipColor, look.get().accent), it.chipDot, true);
        }
    });
    cv.noclip();
    if (!v.all.length && o.empty) mid(cv, o.empty, b.x + b.w / 2, b.y + b.h / 2, 36, t.dim, { align: 'center' });
}

// ---- side menu with vector icons and count badges ------------------------------------------------------------
const navItems = (o) => (Array.isArray(o.items) ? o.items
    : lines(o.items).map((l, i) => ({ id: l[0].toLowerCase(), label: l[0], vicon: l[1] || '', badge: l[2] || '' })));
// (the Store: o.labelSize for a narrower menu; the default is the design's)
function sideNav(cv, t, b, o) {
    const items = navItems(o), n = Math.max(1, items.length), ih = b.h / n, ls = o.labelSize || 34;
    const LK = look.get(), sport = LK.sport, lux = !!LK.lux, AC = LK.accent;
    if (sport) {
        cv.fillRect(b.x, b.y, b.w, b.h, withAlpha('#050505', 0.92));
        cv.fillRect(b.x + b.w - 1.5, b.y, 1.5, b.h, withAlpha('#ffffff', 0.12));
    } else {
        cv.fillRect(b.x, b.y, b.w, b.h, withAlpha(t.panelBottom, 0.85));
        cv.fillRect(b.x + b.w - 1.5, b.y, 1.5, b.h, t.panelEdge);
    }
    items.forEach((it, i) => {
        const on = i === (o.sel | 0), cx = b.x + (b.w - 1.5) / 2, y = b.y + i * ih;
        const d = Math.round(Math.min(ih * 0.56, b.w * 0.5, 84));
        let block = d + ls * 1.3, top = y + (ih - block) / 2 + 2, cy = top + d / 2, base = 0;
        if (sport) {         // the picture and its word as drawn (not the box they are laid out in) centred in the tab, both ways
            const gh = Math.round(d * 0.62), gap = ls * 0.42, ink = gh + gap + ls * 0.74, t0 = y + (ih - ink) / 2;
            cy = t0 + gh / 2; base = t0 + ink;
        }
        if (!sport) {        // a round icon button over its word: the open tab's disc is BCS blue with a soft halo, the others a faint disc
            if (on) {
                cv.circle(cx, cy, d / 2 + 6, withAlpha('#3d9bff', 0.22));
                cv.circle(cx, cy, d / 2, '#3d9bff');
            } else {
                cv.circle(cx, cy, d / 2, withAlpha('#ffffff', 0.10));
            }
        } else if (on && lux) {   // the open tab: a gold bar on the left and a soft light band
            const y0 = y + 3, y1 = y + ih - 3;
            cv.card(b.x, y0, b.w - 1.5, y1 - y0, 0, [[0, withAlpha('#ffffff', 0.14)], [1, withAlpha('#ffffff', 0)]]);
            cv.fillRect(b.x, y0, 5, y1 - y0, AC);
        } else if (on) {     // the open tab: a flat red band across the menu, fading out to the right
            const y0 = y + 3, y1 = y + ih - 3;
            cv.card(b.x, y0, b.w - 1.5, y1 - y0, 0, [[0, '#e4002b'], [1, withAlpha('#e4002b', 0.62)]]);
            cv.fillRect(b.x, y0, 5, y1 - y0, '#ffffff');
        }
        const g = Math.round(d * (sport ? 0.62 : 0.54)), mx = cx;
        vicon(cv, it.vicon, mx - g / 2, cy - g / 2, g, sport ? (on ? (lux ? AC : '#ffffff') : '#c9c9c9') : (on ? '#06121c' : t.text));
        const room = b.w - (sport ? 24 : 16), ts = W.shrink(cv, String(it.label), room, ls, 'bold', 0.6);
        cv.text(W.fit(cv, String(it.label), room, ts, 'bold'), mx, sport ? base : top + d + ts * 1.05, ts, on ? (lux ? AC : '#ffffff') : sport ? '#9a9a9a' : t.dim, { align: 'center', font: 'bold' });
        if (it.badge && String(it.badge) !== '0') {
            const rr = Math.max(14, Math.round(d * 0.26)), bx = mx + d * 0.42, by = cy - d * 0.42;
            if (sport) {
                cv.circle(bx, by, rr + 3, '#050505'); cv.circle(bx, by, rr, AC);
            } else {
                cv.circle(bx, by, rr + 3, t.bg); cv.circle(bx, by, rr, '#e5484d');
            }
            cv.text(String(it.badge), bx, by + rr * 0.42, Math.round(rr * 1.2), lux ? '#14110a' : '#ffffff', { align: 'center', font: 'bold' });
        }
    });
}

// ---- button with a vector icon -------------------------------------------------------------------------------
function vbutton(cv, t, b, o) {
    const c = C(t, o.color, look.get().accent), s = o.size || Math.round(b.h * 0.34), is = Math.round(b.h * 0.4), r = Math.min(18, b.h / 2);
    const off = o.disabled;
    if (o.style === 'round' && look.get().sport) {   // Performance Red: an icon in a square frame
        const g = Math.min(b.w, b.h) * 0.5;
        cv.roundRect(b.x, b.y, b.w, b.h, 0, withAlpha('#000000', 0.35));
        cv.strokeRoundRect(b.x, b.y, b.w, b.h, 0, 2, withAlpha('#ffffff', 0.45));
        vicon(cv, o.vicon, b.x + (b.w - g) / 2, b.y + (b.h - g) / 2, g, off ? t.dim : '#ffffff');
        return;
    }
    if (o.style === 'round') {                       // an icon on a soft disc (back, close)
        const d = Math.min(b.w, b.h), g = d * 0.55;
        cv.circle(b.x + b.w / 2, b.y + b.h / 2, d / 2, withAlpha(off ? t.dim : c, 0.14));
        vicon(cv, o.vicon, b.x + (b.w - g) / 2, b.y + (b.h - g) / 2, g, off ? t.dim : c);
        return;
    }
    if (o.style === 'primary') cv.card(b.x, b.y, b.w, b.h, r, off ? [[0, '#2a3341'], [1, '#232a35']] : look.get().lux ? [[0, '#ecd39a'], [1, '#b8914a']] : look.get().sport ? [[0, c], [1, c]] : [[0, c], [1, withAlpha(c, 0.78)]]);
    else cv.strokeRoundRect(b.x, b.y, b.w, b.h, r, 3, off ? t.panelEdge : o.style === 'outline' ? withAlpha(t.text, 0.6) : withAlpha(c, 0.6));
    const fg = off ? t.dim : o.style === 'primary' ? (look.get().lux ? '#14110a' : '#ffffff') : o.style === 'outline' ? t.text : c;
    const hasIcon = !!o.vicon, room = b.w - 2 * r - (hasIcon ? is + 18 : 0);
    const ts = W.shrink(cv, String(o.text || ''), room, s, 'bold'), text = W.fit(cv, String(o.text || ''), room, ts, 'bold');
    const tw = cv.textWidth(text, ts, { font: 'bold' }) + (hasIcon ? is + 18 : 0), x1 = b.x + (b.w - tw) / 2;
    if (hasIcon) vicon(cv, o.vicon, x1, b.y + (b.h - is) / 2, is, fg);
    cv.text(text, x1 + (hasIcon ? is + 18 : 0), b.y + b.h / 2 + ts * 0.36, ts, fg, { font: 'bold' });
}

// ---- on-screen keyboard: URLs and tokens (layout 'url'), or words (layout 'text': a space bar) ----------------
const ROWS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ['Delete', 1.3, 'mod']],
    [['Shift', 1.3, 'mod'], 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '/'],
    [['https://', 1.6, 'mod'], ['github.com/', 2.1, 'mod'], ['.com', 1.2, 'mod'], ['-', 0.8], ['_', 0.8], [':', 0.8], ['Next', 1.7, 'go']],
];
const TEXT_ROWS = ROWS.slice(0, 3).concat([
    [['Shift', 1.3, 'mod'], 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
    [['-', 0.8], ["'", 0.8], ['Space', 5.2, 'mod'], ['?', 0.8], ['!', 0.8], ['Next', 1.7, 'go']],
]);
// o.symbols (word keyboard only): a '#+=' key opens the symbols page (o.sym), 'abc' goes back - all the printable ASCII
// symbols (a Wi-Fi password may hold any), the digits stay on top
const SYM_KEY = '#+=', ABC_KEY = 'abc';
const TEXT_SYM_ROWS = TEXT_ROWS.slice(0, 4).concat([[[SYM_KEY, 1.3, 'mod'], ["'", 0.8], ['Space', 4.7, 'mod'], ['?', 0.8], ['!', 0.8], ['Next', 1.7, 'go']]]);
const SYM_ROWS = [ROWS[0],
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['-', '_', '=', '+', '[', ']', '{', '}', '\\', ['Delete', 1.3, 'mod']],
    [';', ':', '"', "'", ',', '.', '/', '<', '>', '?'],
    [[ABC_KEY, 1.3, 'mod'], ['`', 0.8], ['|', 0.8], ['Space', 4.7, 'mod'], ['~', 0.8], ['Next', 1.7, 'go']]];
/** Every key's box: { text, kind, x, y, w, h } (design px). o.layout 'text': the word keyboard (+ o.symbols, o.sym). */
function keyBoxes(b, o) {
    const rows = o && o.layout === 'text' ? (o.symbols ? (o.sym ? SYM_ROWS : TEXT_SYM_ROWS) : TEXT_ROWS) : ROWS;
    const gap = 16, rh = (b.h - gap * (rows.length - 1)) / rows.length, out = [];
    rows.forEach((r, ri) => {
        const ks = r.map((k) => (Array.isArray(k) ? k : [k, 1])), tw = ks.reduce((a, k) => a + k[1], 0), unit = (b.w - gap * (ks.length - 1)) / tw;
        let kx = b.x;
        ks.forEach(([text, wt, kind]) => { out.push({ text, kind, x: kx, y: b.y + ri * (rh + gap), w: unit * wt, h: rh }); kx += unit * wt + gap; });
    });
    return out;
}
// the Enter key says o.go (e.g. 'Search') and types that; default 'Next'
const shown = (k, o) => (k.kind === 'go' ? o.go || k.text : o.shift && !k.kind && /^[a-z]$/.test(k.text) ? k.text.toUpperCase() : k.text);
// what a key says: Space, Delete and Shift in the display language (the key itself stays the English name)
const keyLabel = (s) => ({ Space: tr("Space"), Delete: tr("Delete"), Shift: tr("Shift") })[s] || s;
function keyboard(cv, t, b, o) {
    keyBoxes(b, o).forEach((k, i) => {
        const press = i === o.pressed;
        const fill = k.kind === 'go' ? [[0, '#5fb4ff'], [1, '#1f5fd0']] : press ? [[0, '#4a5568'], [1, '#3a4352']]
            : k.kind === 'mod' ? (k.text === 'Shift' && o.shift ? [[0, '#3d4a5e'], [1, '#2e3949']] : [[0, '#232b38'], [1, '#18202b']]) : [[0, '#2a3341'], [1, '#1d2430']];
        cv.card(k.x, k.y, k.w, k.h, 18, fill);
        const label = keyLabel(shown(k, o));
        const font = k.kind ? 'bold' : 'label', size = W.shrink(cv, label, k.w - 16, label.length > 2 ? 38 : 48, font);
        cv.text(W.fit(cv, label, k.w - 16, size, font), k.x + k.w / 2, k.y + k.h / 2 + 17, size, '#ffffff', { align: 'center', font });
    });
}

// ---- sheet: dims the app area, a card on top (other elements sit on it) --------------------------------------
function sheet(cv, t, b, o) {
    const a = o.area || { x: 0, y: 0, w: 2880, h: 960 };
    cv.fillRect(a.x, a.y, a.w, a.h, withAlpha('#000000', o.dim == null ? 0.55 : o.dim));
    cv.card(b.x, b.y, b.w, b.h, o.radius == null ? 32 : o.radius, [[0, '#1e2632'], [1, '#121820']]);
}

const DRAW = { appIcon: appIconEl, chips, appGrid, appList, sideNav, vbutton, keyboard, sheet };

// ---- touch (gpu.js touchElement: Try mode and the app) -------------------------------------------------------
// a drag scrolls with the finger; a release without a drag is a tap. ponytail: one gesture at a time.
let drag = null;
function scroller(view, rowSize) {
    return Object.assign((cv, b, o, p) => {
        const v = view(b, o);
        if (!p.move) { drag = { y0: p.y, top: v.top, moved: false }; return false; }
        const d = drag, dy = d ? p.y - d.y0 : 0, size = rowSize(v);
        if (!d || (!d.moved && Math.abs(dy) < size * 0.25)) return false;
        d.moved = true;
        const nt = Math.max(0, Math.min(v.max, d.top - dy / size));
        if (nt === v.top) return false;
        o.top = nt;
    }, { drag: true });
}
const gridTry = scroller(gridView, (v) => v.th);
gridTry.up = (cv, b, o, p) => {
    const d = drag, g = gridView(b, o);
    drag = null;
    if (!d || d.moved) return false;
    const col = Math.floor((p.x - b.x) / g.tw), row = Math.floor((p.y - b.y) / g.th + g.top), it = g.all[row * g.cols + col];
    if (!it || col < 0 || col >= g.cols) return false;
    tapped(o, it.id, 'tile');
};
const listTry = scroller(listView, (v) => v.rh);
listTry.up = (cv, b, o, p) => {
    const d = drag, v = listView(b, o);
    drag = null;
    if (!d || d.moved) return false;
    const it = v.all[Math.floor((p.y - b.y) / v.rh + v.top)];
    if (!it) return false;
    const rb = rightBoxes(b, it, cv, o.ctlK).find((x) => p.x >= x.x && p.x < x.x + x.w && ['toggle', 'trash', 'chip'].indexOf(x.kind) >= 0);
    tapped(o, it.id, rb ? rb.kind : 'row');
};
const TRY = {
    appGrid: gridTry,
    appList: listTry,
    sideNav: (cv, b, o, p) => {
        const items = navItems(o), i = Math.max(0, Math.min(items.length - 1, Math.floor((p.y - b.y) / (b.h / Math.max(1, items.length)))));
        if (!items.length) return false;
        o.sel = i;
        tapped(o, items[i].id, 'nav');
    },
    keyboard: Object.assign((cv, b, o, p) => {
        const ks = keyBoxes(b), i = ks.findIndex((k) => p.x >= k.x && p.x < k.x + k.w && p.y >= k.y && p.y < k.y + k.h);
        if (i < 0) return false;
        const text = shown(ks[i], o);
        if (text === 'Shift') o.shift = !o.shift;
        o.pressed = i; o.keyN = (o.keyN || 0) + 1; o.key = { text, n: o.keyN };
    }, { up: (cv, b, o) => { if (o.pressed == null) return false; o.pressed = null; } }),
};

// (the Store: shown is what a key types, store_frame.js's items)
module.exports = { DRAW, TRY, appIcon, chip, cardBox, cardLayout, visibleIds, keyBoxes, shown, gridView, listView, rightBoxes, navItems, GREEN, BLUE, AMBER };
