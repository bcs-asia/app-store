# Announcements

What the BCS Store's **Settings > Announcements** page shows. Every Store 3.3.0 or later reads `news.json` from this folder
(`raw.githubusercontent.com/bcs-asia/app-store/main/announcements/`) when it starts and every half hour, keeps what it fetched
and shows a **NEW** tag and a count on the Settings tab until the announcement has been opened.

## Add one (on github.com, no tools needed)

1. Open the `announcements/inbox` folder, **Add file > Upload files**, and drop the photo (JPG, PNG or WebP, any size).
   - Optional: a text file with the same name (`my-photo.txt`): first line = the title, the rest = the text (up to 600 characters).
   - Optional: start the name with a date, `2026-12-01-my-photo.jpg`; without one, today's date is used.
2. Commit to `main`. The **Announcements** workflow converts the photo (at most 960 x 540, 256 colours, under 650 KB), adds it to
   the top of `news.json`, removes the inbox files and commits. A minute later the cars can fetch it.

## Remove or change one

Edit `news.json` on GitHub: delete the item (its photo is cleaned up at the next conversion) or change its `title`, `text` or `date`.
At most the 30 newest announcements are kept.

## By hand

`python3 tools/announce.py` (needs Pillow) does what the workflow does in your own copy of the repository.

## Notes

- Photos are 16:9 on the page; other shapes are shown whole, not cropped.
- Only `news.json` and the PNG files named in it are read; anything else here is ignored by the Store.
