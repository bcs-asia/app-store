'use strict';
/**
 * Assembles BCS Store's GitHub release folders from apps/bcs_store's build:
 *
 *   node release/bcs_release.js <out dir>
 *
 *   <out>/catalog/  the assets of the release tagged `catalog` (what every car reads): catalog.json, the artifact, the icon
 *   <out>/v<x.y.z>/ the assets of the versioned release: the same artifact and catalog.json, the notes, SHA256SUMS.txt
 *
 * The catalog is the updater's schema 2 (release/README.md, docs/PUBLISHING.md): the artifact is the source package
 * (`build: "unit"`, built on the head unit), with the tool versions it requires, which the updater takes from the
 * source that has them (the upstream MGU Store source stays the updater's own).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO = 'bcs-asia/app-store';
const APP = path.join(__dirname, '..', 'apps', 'bcs_store');
const out = path.resolve(process.argv[2] || 'release-out');
const pkg = JSON.parse(fs.readFileSync(path.join(APP, 'package', 'package.json'), 'utf8'));
const rel = JSON.parse(fs.readFileSync(path.join(APP, 'release.json'), 'utf8'));
const id = pkg.name, version = pkg.version;
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`${version} is not x.y.z (the updater and deploy tool refuse any other)`);
}
const src = path.join(APP, `${id}@${version}.src.tgz`);
const icon = path.join(APP, 'package', 'rhmiData', 'variantGroups', 'Common', 'images', 'store_icon.png');
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const name = `${id}@${version}.tgz`;
const url = (tag, n) => `https://github.com/${REPO}/releases/download/${tag}/${n}`;

// title = the installed app's entry-point text (SID_STORE_TITLE): the updater matches it to hand an app over from a removed source
function entry(tag) {
    return {
        id, kind: 'app', title: 'Store', description: 'BCS Automotive Solutions: apps and head-unit tools for the BMW MGU, from BCS and community sources',
        version,
        artifact: { name, size: fs.statSync(src).size, sha256: sha(src), url: url(tag, name) },
        build: 'unit', requires: rel.requires, uninstallable: false, mguHmi: pkg.mguHmi,
        icon: `${id}.png`, iconSha256: sha(icon)
    };
}
const write = (dir, tag) => {
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, path.join(dir, name));
    fs.copyFileSync(icon, path.join(dir, `${id}.png`));
    fs.writeFileSync(path.join(dir, 'catalog.json'), JSON.stringify({ schema: 2, components: [entry(tag)] }, null, 2) + '\n');
};
write(path.join(out, 'catalog'), 'catalog');
write(path.join(out, `v${version}`), `v${version}`);
fs.rmSync(path.join(out, `v${version}`, `${id}.png`));
console.log(`${name} ${entry('catalog').artifact.size} bytes sha256 ${entry('catalog').artifact.sha256}`);
