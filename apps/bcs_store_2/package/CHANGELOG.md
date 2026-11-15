# Changelog

## 2.2.3

- Restart head unit, installs and every other request that needs the updater's key now say "Setup needed: store_app" on the screen when the Store has no key, instead of doing nothing (updater.local.conf: store_app = bcs_store_2, then restart the head unit; SETUP.md).
- The message is short enough for the Preferred connection page.

## 2.2.2

Fixes from the first head-unit test.

- ID7 / ID8 tags on the app cards (the head units an app supports; none stated = both).
- The Store is named "BCS Store" everywhere, never with its source's name behind it.
- The upstream Store (robertn_store) is hidden completely, so nobody installs it from here.
- The retired bcs-develop sources are removed from the updater when found, and are no longer added.
- Updates lists only what has an update (or waits on something, or is not working); "All up to date" when nothing does.
- Sources has a Refresh button (the same as Check now); Wi-Fi's Scan is now "Refresh network".
- When the updater has not given the Store its key (updater.local.conf needs `store_app = bcs_store_2`), the buttons that need it say "Setup needed ..." instead of "no updater secret". See SETUP.md in the release.

## 2.2.1

BCS Store, rebuilt on Robert Nisipeanu's MGU Store 0.9.40 (the upstream Store's behaviour, tests and updater protocol unchanged).

- Six tabs: Apps, Tools, Updates, USB, Sources, Settings. Settings is a list of pages (Wi-Fi, Accounts, Preferred connection, Proxy, Phone access, System); System has the versions, Check now, Restart head unit and who made the Store.
- Large cards on Apps, Tools and USB, with Install now / Update now on the card; no source line (two sources' apps of the same name say their source in the title).
- A Wi-Fi signal-strength chip (No WiFi, or the bars of the uplink's signal) instead of Online / Offline / Checking.
- The BCS logo on every screen, held once in memory.
- BCS sources (bcs-asia/app-store first, then the community feeds) are added when missing, one at a time; the updater keeps the source records, and the upstream tools source stays as the updater's own.
- The upstream Store (robertn_store) is not offered beside this one; an installed copy is listed so it can be removed.
- Own id (bcs_store_2), vendor, logo and tile icon; this Store cannot be removed from itself.
