# BCS Store 3.3.0 — Announcements and usage statistics

Based on MGU Store 0.9.40 by Robert Nisipeanu (GPL-3.0-or-later). App id `bcs_store`; installs over 3.x.

- **Settings > Announcements**: photos and news from the BCS GitHub, one at a time, with a NEW tag and a count on the Settings tab until opened. Add one by dropping a photo in `announcements/inbox` (README there).
- **Settings > Usage statistics**: opt-in, off by default. A random install ID, versions, and country/region/city plus a shortened address from the connection; Off deletes the record. Offered once the server address is set (`src/bcs_config.js`); the Worker and its dashboard are in `analytics/`. See `PRIVACY.md`.
- Includes 3.2.2 (RideTube for iDrive 8, idrive7-apps and IterioDev sources) and 3.2.1 (Luxury Carbon theme).

Replace the old store: UPGRADE.md.
