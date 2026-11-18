# BCS Store 3.0.2

Based on MGU Store 0.9.40 by Robert Nisipeanu (GPL-3.0-or-later). App id `bcs_store`; installs over 2.1.x.

- Fix: the catalog lists the Store under the title "Store" (its entry-point text on the head unit). The updater hands an installed app over from a removed source to the source with the same title; "BCS Store" never matched, so a 2.1.x installed from bcs-develop could not be replaced ("bcs_store is already installed from ...").
- Includes 2.2.5 (BCS Store only from bcs-asia; source label fix) and earlier.

Replace the old store: UPGRADE.md.


## What changed in 3.0.2

- Community sources that do not work on the cars are removed and no longer added: eroobeeroo, arefahmad, pinguinooo, nickgcode (idrive7-apps), aurelmarius/bmw-games, hexlay/idrive7-custom-apps, NamelsMissing/mgu-apps, isaakbruno2/carplay-map-cluster. A car that already has one has it removed by the Store.
- Kept: aurelmarius/bmw-apps, istt1899/x3, aidac/apps, and the BCS, bimmer-lab and JustAnotherPU feeds.
