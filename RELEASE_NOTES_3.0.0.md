# BCS Store 3.0.0

Based on MGU Store 0.9.40 by Robert Nisipeanu (GPL-3.0-or-later). App id `bcs_store`; installs over 2.1.x.

- Fix: the catalog lists the Store under the title "Store" (its entry-point text on the head unit). The updater hands an installed app over from a removed source to the source with the same title; "BCS Store" never matched, so a 2.1.x installed from bcs-develop could not be replaced ("bcs_store is already installed from ...").
- Includes 2.2.5 (BCS Store only from bcs-asia; source label fix) and earlier.

Replace the old store: UPGRADE.md.


## What changed in 3.0.0

- New side menu: round icon buttons over their words; the open tab is a BCS-blue disc with a halo, the count badge a red dot.
- Community sources added (add-only) from the awesome-bmw-mgu list: eroobeeroo, arefahmad, pinguinooo, nickgcode, aurelmarius (apps, games), hexlay, NamelsMissing, istt1899/x3, JustAnotherPU (ridewatch, moonride, waze-hud), pllanaio/mgu-browser, isaakbruno2/carplay-map-cluster.
- The Store is BCS STORE; Robert's MGU Store stays hidden.
