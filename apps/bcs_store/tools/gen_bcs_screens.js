'use strict';
/**
 * Writes src/am_screens.js: the Store's iDrive 8 screens in BCS Store's
 * layout, from tools/upstream/am_screens.upstream.js (the screens of the MGU
 * Store this one is based on, unchanged):
 *
 *   node tools/gen_bcs_screens.js
 *
 * The side menu has six tabs (Apps, Tools, Updates, USB, Sources, Settings),
 * every screen carries the BCS logo above it, the Apps / Tools / USB grids
 * show large cards, and Settings, Sources and System are laid out for the
 * BCS pages. The logo is one string (src/bcs_brand.js) shared by all screens.
 */
const fs = require('fs');
const path = require('path');

const HERE = path.join(__dirname, '..');
const up = require('./upstream/am_screens.upstream.js');
const S = JSON.parse(JSON.stringify(up.screens));
const BLUE = '#00bfff';
const NAV = 'Apps, grid\nTools, wrench\nUpdates, check\nUSB, usb\nSources, unlock\nSettings, gear';
const LOGO_MARK = '__BCS_LOGO__';

const find = (st, n) => st.components.find((c) => c.name === n);
const drop = (st, ...names) => { st.components = st.components.filter((c) => names.indexOf(c.name) < 0); };
const comp = (name, gpu, x, y, w, h, opts, onTap) => Object.assign({ name, rtype: 'gpu', gpu, x, y, w, h, opts }, onTap ? { onTap } : {});
const get = (n) => S.find((s) => s.name === n);
const clone = (n, name) => Object.assign(JSON.parse(JSON.stringify(get(n))), { name });
const card = (g) => Object.assign(g.opts, { cols: 3, tileH: 285, cardStyle: 'billboard', iconK: 0.5, titleSize: 40, subSize: 27 });
const place = (c, x, y, w, h) => Object.assign(c, { x, y, w, h });

// Apps (and Tools, which uses this screen): the cards start under the title
const store = get('store');
drop(store, 'filter');
store.title = 'Apps';
place(find(store, 'grid'), 460, 270, 2380, 570);
card(find(store, 'grid'));
place(find(store, 'online'), 2200, 146, 640, 84);

const usb = get('usb');
place(find(usb, 'grid'), 460, 270, 2380, 570);
card(find(usb, 'grid'));

// Sources: the settings screen's list of sources and Add source, over the whole width
const sources = clone('settings', 'sources');
sources.components = sources.components.filter((c) => ['nav', 'title', 'note', 'reposLabel', 'repos', 'addRepo'].indexOf(c.name) >= 0);
find(sources, 'title').opts.text = 'Sources';
sources.components.splice(2, 0, comp('subtitle', 'text', 480, 227, 1300, 43, { text: '', size: 34, font: 'label', align: 'left', color: 'dim' }));
drop(sources, 'reposLabel');
place(find(sources, 'repos'), 460, 292, 2380, 440);
place(find(sources, 'addRepo'), 480, 744, 1000, 96);
{   // Refresh: rechecks every source (the same as Check now)
    const add = find(sources, 'addRepo'), r = JSON.parse(JSON.stringify(add));
    r.name = 'refresh'; r.opts.text = '';
    sources.components.push(r);
    place(r, 1500, 744, 880, 96);
}
find(sources, 'note').opts.text = '';

// System: the head unit's state, versions, Check now, Restart head unit and who made the Store
const system = clone('accounts', 'system');
system.components = system.components.filter((c) => ['nav', 'back', 'title'].indexOf(c.name) >= 0);
find(system, 'title').opts.text = '';
system.components.push(
    comp('note', 'text', 610, 227, 1600, 43, { text: '', size: 34, font: 'label', align: 'left', color: '#ffb020' }),
    comp('unit', 'text', 610, 292, 2230, 40, { text: '', size: 30, font: 'bold', align: 'left', color: 'text' }),
    comp('versions', 'text', 610, 336, 2230, 40, { text: '', size: 28, font: 'label', align: 'left', color: 'dim' }),
    comp('about', 'appList', 610, 398, 2230, 330, { items: [], rowH: 110, fit: true }),
    comp('checkNow', 'vbutton', 610, 744, 640, 96, { text: 'Check now', vicon: 'refresh', style: 'outline', size: 30 }, 'event:checkNow'),
    comp('restart', 'vbutton', 1280, 744, 700, 96, { text: 'Restart head unit', vicon: 'refresh', style: 'outline', size: 30 }, 'event:restart'));

// Settings: a row per page, two columns
const settings = get('settings');
settings.components = settings.components.filter((c) => ['nav', 'title', 'note'].indexOf(c.name) >= 0);
settings.components.splice(2, 0, comp('subtitle', 'text', 480, 227, 1300, 43, { text: '', size: 34, font: 'label', align: 'left', color: 'dim' }));
find(settings, 'note').y = 227;
find(settings, 'note').x = 1500;
find(settings, 'note').w = 1340;
settings.components.push(
    comp('accessLeft', 'appList', 470, 292, 1170, 548, { items: [], rowH: 170, fit: true }),
    comp('accessRight', 'appList', 1690, 292, 1150, 548, { items: [], rowH: 170, fit: true }));

// Updates (Robert's installed lists) keeps its layout
const screens = S.filter((s) => s.name !== 'sources' && s.name !== 'system');
const at = screens.findIndex((s) => s.name === 'settings');
screens.splice(at + 1, 0, sources, system);

// every screen: six tabs, the logo above the menu, the BCS blue
screens.forEach((st) => {
    st.components.forEach((c) => { if (c.name === 'nav') { c.opts.items = NAV; } });
    st.components.unshift(comp('headerLogo', 'image', 126, 38, 300, 64, { src: LOGO_MARK, radius: 0 }));
});
const json = JSON.stringify({ design: up.design, screens }, null, 1).split('"text": "Scan"').join('"text": ""').split('#3d9bff').join(BLUE).replace(JSON.stringify(LOGO_MARK), 'LOGO')
    .split(JSON.stringify(LOGO_MARK)).join('LOGO');
const head = fs.readFileSync(path.join(__dirname, 'upstream', 'am_screens.upstream.js'), 'utf8').split('module.exports')[0]
    .replace("'use strict';\n", "'use strict';\nconst { LOGO } = require('./bcs_brand.js');\n")
    .replace(' * own in the same frame.', ' * own in the same frame; BCS Store lays them out for six tabs and large cards (tools/gen_bcs_screens.js writes this file\n * from tools/upstream/am_screens.upstream.js).');
fs.writeFileSync(path.join(HERE, 'src', 'am_screens.js'), `${head}module.exports = ${json};\n`);
console.error(`src/am_screens.js: ${screens.length} screens`);
