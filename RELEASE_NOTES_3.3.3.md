# BCS Store 3.3.3 — fix for 3.3.2 (stayed on loading)

Based on MGU Store 0.9.40 by Robert Nisipeanu (GPL-3.0-or-later). App id `bcs_store`; installs over 3.x.

- **Fix**: 3.3.2 stayed on "loading". The usage statistics used a function the car's older Node does not have (`crypto.randomUUID`). It now uses `randomBytes`, and an error in statistics or announcements can no longer stop the Store from starting.
- **Fix**: the announcements and statistics network calls now use only what the car's older Node has, so News can load.
- Includes 3.3.2 (usage statistics on, `istt1899/x3` source removed) and 3.3.1 (News fetches every time it is opened).

Replace the old store: UPGRADE.md.
