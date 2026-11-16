# Changelog

## 2.2.9

- The Store is named BCS STORE: on the head unit's app tile and in the Store's own screens.
- Robert Nisipeanu's MGU Store is hidden again; BCS Store is the only Store offered.
- The side menu's tabs (Apps, Tools, Updates, USB, Sources, Settings) are larger buttons of their own: a bigger icon and word, the open tab in the BCS blue, the count badge inside the button. The iDrive 7 menu is wider.

## 2.2.8

- No change to the Store itself. Release packaging: merging a version's release assets now publishes the release and refreshes the OTA catalog automatically, and the release carries the icon.

## 2.2.7

- Robert Nisipeanu's MGU Store is listed again, to install or remove like any other app. BCS Store itself is still offered only from bcs-asia/app-store.

## 2.2.6

- The catalog lists the Store under the title "Store", the text of its entry point on the head unit (the Store still shows as "BCS Store" in its own screens). The updater hands an installed app over from a removed source to the source whose listing has the same title; "BCS Store" did not match, so 2.1.x installed from bcs-develop could not be replaced from bcs-asia.

## 2.2.5

- BCS Store is offered only from the bcs-asia/app-store source: another source's copy of it (the retired bcs-develop one) is not shown.
- Fix: the Store recognised a source by a field the updater does not send, so the retired bcs-develop sources were never removed and the BCS sources were asked for again every start. It now uses the source's label (its repository).

## 2.2.4

- The app id is `bcs_store` again (the id of the 2.1.x Store), so this installs over 2.1.x as an ordinary update and the updater already gives it its key: Remove, Restart head unit and the Wi-Fi buttons work without any head-unit setup. (2.2.0 to 2.2.3 used `bcs_store_2`.)
- A car whose updater is set to another Store id still needs `store_app = bcs_store` in updater.local.conf (SETUP.md).

## 2.2.3

- Restart head unit, installs and every other request that needs the updater's key now say "Setup needed: store_app" on the screen when the Store has no key, instead of doing nothing (updater.local.conf: store_app = bcs_store, then restart the head unit; SETUP.md).
- The message is short enough for the Preferred connection page.

## 2.2.2

Fixes from the first head-unit test.

- ID7 / ID8 tags on the app cards (the head units an app supports; none stated = both).
- The Store is named "BCS Store" everywhere, never with its source's name behind it.
- The upstream Store (robertn_store) is hidden completely, so nobody installs it from here.
- The retired bcs-develop sources are removed from the updater when found, and are no longer added.
- Updates lists only what has an update (or waits on something, or is not working); "All up to date" when nothing does.
- Sources has a Refresh button (the same as Check now); Wi-Fi's Scan is now "Refresh network".
- When the updater has not given the Store its key (updater.local.conf needs `store_app = bcs_store`), the buttons that need it say "Setup needed ..." instead of "no updater secret". See SETUP.md in the release.

## 2.2.1

BCS Store, rebuilt on Robert Nisipeanu's MGU Store 0.9.40 (the upstream Store's behaviour, tests and updater protocol unchanged).

- Six tabs: Apps, Tools, Updates, USB, Sources, Settings. Settings is a list of pages (Wi-Fi, Accounts, Preferred connection, Proxy, Phone access, System); System has the versions, Check now, Restart head unit and who made the Store.
- Large cards on Apps, Tools and USB, with Install now / Update now on the card; no source line (two sources' apps of the same name say their source in the title).
- A Wi-Fi signal-strength chip (No WiFi, or the bars of the uplink's signal) instead of Online / Offline / Checking.
- The BCS logo on every screen, held once in memory.
- BCS sources (bcs-asia/app-store first, then the community feeds) are added when missing, one at a time; the updater keeps the source records, and the upstream tools source stays as the updater's own.
- The upstream Store (robertn_store) is not offered beside this one; an installed copy is listed so it can be removed.
- Own id (bcs_store), vendor, logo and tile icon; this Store cannot be removed from itself.
