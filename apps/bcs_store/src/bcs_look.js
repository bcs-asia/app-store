'use strict';
/**
 * BCS Store's looks, the choice on Settings > Theme:
 *
 *   blue  BCS BLUE - Christmas  the cyan-blue look on the kit's tricolour theme, soft round cards, the snowy chalet backdrop and a Santa hat on the logo (3.4.18; the default)
 *   red   Performance Red  the black and red sport look: square cards with a red corner flag, a flat red tab, the M4 GT3 backdrop
 *   carbon Luxury Carbon   black carbon fibre with a light sweep, gold buttons and thin gold frames
 *
 * The layouts and the view-model name one accent, RED (the Performance Red's); the drawing maps it to the chosen
 * look's (accent()), and the widgets (src/am_store_widgets.js) draw each look's own style. The choice is kept by the
 * Store in data/look (src/store.js) and reaches the drawing through the model's `look`.
 */
const kit = require('./kit_record.js');
const RED = '#e4002b';
const LOOKS = {
    blue: { id: 'blue', name: 'BCS BLUE - Christmas', theme: 'm_tricolour', accent: '#00bfff', sport: false, sharp: false, photo: 'xmas', hat: true },
    carbon: { id: 'carbon', name: 'Luxury Carbon', theme: 'm_carbon', accent: '#d4b36a', sport: true, sharp: true, lux: true, photo: 'carbon' },
    red: { id: 'red', name: 'Performance Red', theme: 'm_red', accent: RED, sport: true, sharp: true, photo: 'red' }
};
const ORDER = ['blue', 'red', 'carbon'];
const DEFAULT = 'blue';
let current = LOOKS[DEFAULT];

const known = (id) => Object.prototype.hasOwnProperty.call(LOOKS, id);
/* The look in use for the drawing (set by the view of each frame). */
function use(id) { current = LOOKS[known(id) ? id : DEFAULT]; kit.setSharp(!!current.sharp); return current; }
const get = () => current;
const list = () => ORDER.map((id) => LOOKS[id]);
/* The layout's accent in the look in use: any other colour stays as it is. */
const accent = (c) => (c === RED ? current.accent : c);
/* Deep copy of options with the accent mapped (a no-op for the red look). */
function paint(v) {
    if (current.accent === RED) return v;
    if (typeof v === 'string') return v === RED ? current.accent : v;
    if (Array.isArray(v)) return v.map(paint);
    if (v && typeof v === 'object') { const o = {}; Object.keys(v).forEach((k) => { o[k] = paint(v[k]); }); return o; }
    return v;
}

module.exports = { RED, LOOKS, DEFAULT, known, use, get, list, accent, paint };
