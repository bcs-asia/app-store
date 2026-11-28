# Changelog

## 3.4.16

- Pull a list past its end and it gives a little, then springs back; the ring shows and the next tiles load.
- Sources and System pages (iDrive 7): the title and the back button no longer sit over the BCS logo.
- Removed waliworld/MGU-Styles2 (HTTP 404 on the car). Cars that have it get it removed automatically.

## 3.4.15

- The Apps and Tools lists show 12 tiles at first. Scroll to the bottom and a turning ring shows below the last row (not in a card, no text); a moment later the next 12 tiles appear, and so on. Once every tile is shown, the same scroll loads the next sources (three at a time). The ring row can also be pressed. This replaces 3.4.14's ring tile at the end of the list.
- News: the arrows and the "1 of 4" count moved to the bottom row (right); the text stops above them (iDrive 8: the text is a little smaller to leave room).

## 3.4.14

- Faster Apps and Tools lists: the screen was rebuilt with a scan of every app for each app (slow with a few hundred apps from two dozen sources). It is now built in one pass: about 25 times faster here, the screens are the same.
- Sources load as you scroll: the 14 main sources are added at once as before; the 10 newer community sources wait. When the Apps or Tools list is scrolled to its end, or the ring at its end is pressed, the next three are added while the ring turns (no text). A car that already has them all shows no ring. Each source is still added once per run, and the loop breaker still applies.

## 3.4.13

- One more source, added when missing: waliworld/Beem-Net (a web browser for iDrive 7 and 8; beta; Releases).

## 3.4.12

- One more source, added when missing: waliworld/MGU-Styles2 (Releases). The repository could not be read when this was added, so it shows as unavailable until it is public with a catalog.

## 3.4.11

- One more source, added when missing: jsbaughman/apps (a copy of the bimmer-lab apps: Cluster Themes and HUD Widgets; iDrive 7; built from the main branch). It uses the same app ids as bimmer-lab/apps, so an app installed from one of the two is updated only from that one.

## 3.4.10

- One more source, added when missing: sas46/idrive7_dpf_app (a diesel particulate filter regeneration monitor; iDrive 7; built from the main branch).

## 3.4.9

- Statistics: the Store version and the iDrive generation (ID7 or ID8) are back in the feed address, so the dashboard shows them again. The address is fixed for a given install of a given build: the id, the version and the generation (taken from the RHMI the Store loaded, not from the updater). When the Store itself is updated, the old feed source is replaced once: the new address is written down first, the replacement happens at most once per address even across restarts, and it does not happen at all when the address cannot be saved. The loop breaker still guards every source add and remove.

## 3.4.8

- One more source, added when missing: Vizualyse/idrive-apps (Cast to cluster: a phone stream on the instrument cluster or the HUD; iDrive 7; a tech demo tested on a bench unit; Releases).

## 3.4.7

- Three more sources, added when missing: robertnisipeanu/idrive-apps (cluster-render and the Waze cluster tools; Releases), ALMSTRA/idv7lol (cluster theme editor; iDrive 7; Releases) and eroobeeroo/idrive7-cluster-info (cluster layouts and vehicle information; iDrive 7; built from the main branch). 3.4.6 added mlurker/bmw-idrive7-apps and dwz365365/id7f.

## 3.4.6

- Two new sources, added when missing: mlurker/bmw-idrive7-apps (HUD turn and blind spot signals; iDrive 7) and dwz365365/id7f (a cluster map app; iDrive 7, experimental: parked testing only). Both are on the Releases channel.

## 3.4.5

- News: more of the announcement text shows. The text starts higher (the gap under the title is gone), the text column is wider, the arrows moved up beside the "1 of 2" count so the text can use the column down to the bottom, and the layout is the same on iDrive 8.

## 3.4.4

- The side menu is easier to hit: each tab's touch area is now its whole cell (before, 8 px at the sides and 16 px between the tabs did nothing when pressed).

## 3.4.3

- New: a Check for updates button under the lists on the Updates page (iDrive 7 and iDrive 8). One press asks the updater to check every source once, which also brings the latest announcements. While it runs the button is greyed and says Checking, and a second press does nothing, so it cannot be pressed in a loop.

## 3.4.2

- Fix: on a car where the Store could not save its install ID, the feed was never added (News said "feed not added yet", and no check-in reached the server). The ID now comes from something stable of the unit when it cannot be saved, so it is still one fixed ID.
- The News page says exactly why the feed is not there yet (for example: no install ID, updater busy, adding the other sources, no updater key, stopped by the loop breaker).

## 3.4.1

- Fix: the loop breaker of 3.4.0 counted every message to the updater, so a fresh install adding its dozen sources in a row looked like a loop: it switched the feed off and closed the Store (News said "feed not added yet"). It now counts only the same message to the same target (the same source added, removed or checked) more than 10 times within 10 seconds.
- With the feed off, News says "No announcements yet" and no longer "Cannot load".

## 3.4.0

- The BCS feed (announcements and the usage check-in) is back, with safeguards after the head-unit hangs of 3.3.x:
  - One fixed install ID. It is made once, saved and read back; if it cannot be saved, no feed is added and no second ID is ever made. The feed address holds only that ID.
  - Exactly one feed source in the updater. If an earlier version left more, the extras are removed; none is added while one exists.
  - Loop breaker: more than 10 messages to the updater (add or remove a source, check) within 10 seconds stops the feed, leaves a flag so it stays off for this version, and closes the Store.
  - Announcements are asked for only when the Store is opened while the car is online, once per opening. The News tab sends nothing itself. Photos are read only while News is on screen.
- Announcements stay empty for the first test on one car.

## 3.3.63

- Clean-up: with the BCS feed off, the Store no longer makes an install ID and deletes the install ID and the announcement files (text and photos) an earlier version kept in its own data folder. Together with 3.3.62 (every leftover BCS feed source removed from the updater) nothing of the feed or the announcements is left on the car. Everything else is as in 3.3.62.

## 3.3.62

- Clean-up: every BCS feed source an earlier version left in the updater is now removed, all at once and even while the updater is busy (3.3.61 removed them one by one as the updater sent its state). Nothing is added back. Everything else is as in 3.3.61.

## 3.3.61

- The BCS feed is switched off for good in this build (News and the usage check-in). On the cars it made the head unit hang or lag. The Store removes the feed source from the updater, once, and adds nothing. Everything else is as in 3.3.6.

## 3.3.6

- The BCS feed (News and the usage check-in) is back on. A blank Store page was seen with 3.3.4; to be safe, the announcement photo is now read only while News is on screen, so no other screen carries picture data. Announcements are still empty on purpose for this first test.

## 3.3.5

- Safety release: the BCS feed (News and the usage check-in) is switched off while a blank Store page seen on a car with 3.3.4 is traced. The Store removes the feed source from the updater, once, and adds nothing. News shows nothing until the feed is back; everything else is as in 3.3.4.

## 3.3.4

- Fix: News and the usage statistics could not reach the internet. On a head unit only the updater can (the Store app got `getaddrinfo ENOTFOUND raw.githubusercontent.com`). The Store now adds one hidden source to the updater, the BCS feed on our server: the updater reads it with its other sources, the announcements come back as its entries (text and photo), and the request is the usage check-in. The source and its entries are not shown anywhere else.
- News: opening the page asks the updater to check; with no announcements it says why (for example Offline).
- USB: a stick marked as a copy of the BCS-Asia repository (the sticks made for the releases) now shows BCS Store in the USB tab; before, the Store hid every copy of itself that did not come from GitHub.
- Announcement photos are under 120 KB now (the updater keeps an icon of 128 KiB at most).

## 3.3.3

- Fix: 3.3.2 stayed on "loading" on the car. The usage statistics asked for a random ID with a function the car's older Node does not have (crypto.randomUUID), which stopped the Store from starting. The ID is now made with randomBytes, and a statistics or announcements error can no longer stop the Store from starting.
- Fix: the announcements and statistics network calls now use only what the car's older Node has (the URL class and the request(options) form).

## 3.3.2

- Usage statistics are on: the Store now reports to the BCS statistics server (bcs-stats.bcs-asia.workers.dev). See PRIVACY.md.
- Source removed: istt1899/x3 (the Store takes it out of the updater when it finds it, and does not add it again).

## 3.3.1

- Source removed: istt1899/x3 (the Store takes it out of the updater when it finds it, and does not add it again).
- News: the page fetches the announcements every time it is opened (and when the Store opens), not only at start and every half hour; it says Checking... while it does and, when it cannot load them, why (for example offline).

## 3.3.0

- New source added when missing: noth4m4d/mgu-hamadstools (AirPlay screen mirroring while parked, and Waze Cards on the instrument cluster; iDrive 7).

- News tab (it takes the place of Sources, which is now a row in Settings): announcements with photos, fetched from the BCS Store's GitHub (the announcements/ folder; add one by dropping a photo in announcements/inbox). A NEW tag shows on one not opened yet and a count on the tab. What was fetched is kept, so the page works offline.
- Usage statistics, always on once the BCS server address is set in src/bcs_config.js: the Store tells the server that it is alive (a random install ID, the Store and iDrive versions; the server works out country, region and city from the connection and keeps a shortened address). Nothing about the owner. PRIVACY.md says exactly what.

## 3.2.2

- New sources added by the Store when missing: waliworld/iDrive8-RideTube (BeeMTube2, YouTube for iDrive 8), cauliflowermossgrape/idrive7-apps (shift lights, dyno, G-Force, fault scanner and more) and IterioDev/car-apps (Seats, Ambient Light, Drive Recorder, Turn View, Car Data and more).

## 3.2.1

- Performance Red is sharp: square cards, buttons, tags, rows and icons; a red corner flag and a fading red line on every card; a flat red band on the open tab.
- Performance Red shows a black, red and white BMW M4 GT3 photo behind the Apps, Tools and USB cards (BCS Blue keeps its plain look).
- Luxury Carbon, a third look: carbon-fibre photo backdrop with a curved light sweep, black glass cards with gold frames, gold buttons and a gold bar on the open tab.
- Settings > Theme: a tile per look with a miniature of the Apps screen in it.

## 3.2.0

- Settings > Theme: choose BCS Blue or Performance Red. The choice is kept on the head unit; Performance Red stays the default.

## 3.1.0

- Sport design in red and black: graphite cards with a red bar on their left edge, red buttons and accents, a black menu with a slanted red band on the open tab (a white disc with a red icon), red count badges.

## 3.0.3

- Apps and Tools have two buttons left of the Wi-Fi state: All apps (All tools) and Installed. Installed lists what is installed, including Robert's MGU Store when it is installed; All keeps hiding it.

## 3.0.2

- Community sources that do not work on the cars are removed, and no longer added: eroobeeroo, arefahmad, pinguinooo and nickgcode (idrive7-apps), aurelmarius/bmw-games, hexlay/idrive7-custom-apps, NamelsMissing/mgu-apps, isaakbruno2/carplay-map-cluster. Where a car already has one, the Store removes it from the updater.
- Kept: aurelmarius/bmw-apps, istt1899/x3, aidac/apps and the BCS, bimmer-lab and JustAnotherPU feeds.

## 3.0.1

- Adds the aidac/apps source (a bimmer-lab fork: Cluster Themes, HUD Widgets), add-only, from the main branch.

## 3.0.0

- New side menu: each tab is a round icon button over its word. The open tab is a BCS-blue disc with a soft halo, the count badge is a red dot on the disc.
- More community sources are added to the Store (add-only): eroobeeroo, arefahmad, pinguinooo, nickgcode, aurelmarius (apps and games), hexlay, NamelsMissing, istt1899/x3, JustAnotherPU (ridewatch, moonride, waze-hud), pllanaio/mgu-browser, isaakbruno2/carplay-map-cluster, from the awesome-bmw-mgu list.

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
