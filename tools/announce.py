#!/usr/bin/env python3
"""Turn the photos dropped in announcements/inbox/ into BCS Store announcements.

  announcements/inbox/<name>.jpg|png|webp     the photo (any size)
  announcements/inbox/<name>.txt              optional: first line = title, the rest = text (up to 600 characters)

Each photo becomes announcements/<id>.png (at most 960 x 540, up to 256 colours, under 120 KB: the car's updater carries it from our server and takes a PNG of 128 KiB at most) and an entry at
the top of announcements/news.json. A name that starts with YYYY-MM-DD- sets the date, else today's. The inbox files are removed.
The GitHub workflow "Announcements" runs this on every push that adds to the inbox; it also runs by hand:  python3 tools/announce.py
"""
import datetime
import json
import os
import re
import sys

from PIL import Image, ImageOps

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
NEWS = os.path.join(ROOT, 'announcements')
EXT = ('.jpg', '.jpeg', '.png', '.webp')
MAX_BYTES = 120 * 1024            # the updater keeps an icon PNG of 128 KiB at most, and the photo travels as one
SIZES = [(960, 540), (800, 450), (640, 360), (560, 315), (480, 270), (400, 225), (320, 180)]
COLOURS = [256, 128, 64, 32]


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:60] or 'news'


def convert(src, dst):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    for box in SIZES:
        small = im.copy()
        small.thumbnail(box, Image.LANCZOS)
        for colours in COLOURS:
            small.quantize(colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(dst, 'PNG', optimize=True)
            if os.path.getsize(dst) <= MAX_BYTES:
                return small.size
    return small.size


def main(folder=NEWS):
    inbox = os.path.join(folder, 'inbox')
    manifest = os.path.join(folder, 'news.json')
    items = []
    if os.path.exists(manifest):
        items = json.load(open(manifest, encoding='utf-8')).get('items', [])
    added = []
    for name in sorted(os.listdir(inbox)) if os.path.isdir(inbox) else []:
        stem, ext = os.path.splitext(name)
        if ext.lower() not in EXT:
            continue
        m = re.match(r'(\d{4}-\d{2}-\d{2})[-_ ]+(.*)', stem)
        date, rest = (m.group(1), m.group(2)) if m else (datetime.date.today().isoformat(), stem)
        title, text = re.sub(r'[-_]+', ' ', rest).strip().capitalize(), ''
        side = os.path.join(inbox, stem + '.txt')
        if os.path.exists(side):
            lines = open(side, encoding='utf-8').read().strip().splitlines()
            if lines and lines[0].strip():
                title, text = lines[0].strip()[:120], ' '.join(l.strip() for l in lines[1:] if l.strip())[:600]
        nid = f'{date}-{slug(rest)}'
        size = convert(os.path.join(inbox, name), os.path.join(folder, nid + '.png'))
        items = [x for x in items if x.get('id') != nid]
        items.insert(0, {'id': nid, 'title': title, 'text': text, 'date': date, 'image': nid + '.png'})
        for f in (name, stem + '.txt'):
            if os.path.exists(os.path.join(inbox, f)):
                os.remove(os.path.join(inbox, f))
        added.append((nid, size))
    items.sort(key=lambda x: (x['date'], x['id']), reverse=True)
    items = items[:30]
    keep = {x['image'] for x in items if x.get('image')}
    for f in os.listdir(folder):          # photos of announcements that fell off the list
        if f.endswith('.png') and f not in keep:
            os.remove(os.path.join(folder, f))
    with open(manifest, 'w', encoding='utf-8') as fh:
        json.dump({'items': items}, fh, indent=2, ensure_ascii=False)
        fh.write('\n')
    for nid, size in added:
        print(f'added {nid} ({size[0]}x{size[1]})')
    if not added:
        print('nothing in the inbox')
    return added


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else NEWS)
