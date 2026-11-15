# Changelog

## 2.2.1

BCS Store, rebuilt on Robert Nisipeanu's MGU Store 0.9.40 (the upstream Store's behaviour, tests and updater protocol unchanged).

- Six tabs: Apps, Tools, Updates, USB, Sources, Settings. Settings is a list of pages (Wi-Fi, Accounts, Preferred connection, Proxy, Phone access, System); System has the versions, Check now, Restart head unit and who made the Store.
- Large cards on Apps, Tools and USB, with Install now / Update now on the card; no source line (two sources' apps of the same name say their source in the title).
- A Wi-Fi signal-strength chip (No WiFi, or the bars of the uplink's signal) instead of Online / Offline / Checking.
- The BCS logo on every screen, held once in memory.
- BCS sources (bcs-asia/app-store first, then the community feeds) are added when missing, one at a time; the updater keeps the source records, and the upstream tools source stays as the updater's own.
- The upstream Store (robertn_store) is not offered beside this one; an installed copy is listed so it can be removed.
- Own id (bcs_store_2), vendor, logo and tile icon; this Store cannot be removed from itself.
