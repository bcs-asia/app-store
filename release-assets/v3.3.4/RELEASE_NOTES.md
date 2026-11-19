# BCS Store 3.3.4 — News and statistics through the updater

Based on MGU Store 0.9.40 by Robert Nisipeanu (GPL-3.0-or-later). App id `bcs_store`; installs over 3.x.

- **Fix**: News said "Cannot load: getaddrinfo ENOTFOUND raw.github...". On a head unit only the updater reaches the internet, not the Store app. The Store now adds one hidden source to the updater, the BCS feed on our server: it carries the announcements (text and photo) and is the usage check-in. It is not shown in Sources, Apps, Tools or Updates.
- Opening News asks the updater to check; an empty page says why.
- Announcement photos are under 120 KB (an updater limit).
- Needs the updated Worker (`analytics/`, `npx wrangler deploy`).
- Includes 3.3.3 (fix for 3.3.2 staying on loading) and 3.3.2 (`istt1899/x3` removed).

Replace the old store: UPGRADE.md.
