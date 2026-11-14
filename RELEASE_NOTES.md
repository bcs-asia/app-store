# BCS Store v2.1.4 — RideTube source integration (pre-release candidate)

## Changes
- Register `JustAnotherPU/ridetube` on `releases` automatically when not present.
- Register companion `JustAnotherPU/mgu-apps` on `releases` automatically for RideTube's `jap-node22` runtime.
- Keep `bimmer-lab/apps` on `branch:main`.
- Preserve existing BCS, Robert/upstream, and customer-defined sources, ID7/ID8 Store UI, Wi-Fi, USB, and other existing features.
- Only request missing sources; no existing sources are deleted or overwritten.

## RideTube prerequisites and limitations
- RideTube is an unofficial **ID7-only** application, not an ID8 app. The Store itself still advertises both ID7/ID8.
- RideTube's upstream README requires the MGU Store uplink, `mgu-render >= 0.6.11`, `mgu-deploy >= 0.7.0`, `mgu-python 1.0.2`, `mgu-inputgate 1.0.0`, and `jap-node22` in its companion release catalog.
- The upstream project states that playback is experimental and video is hidden while driving by default.
- Source registration does not install RideTube, guarantee compatibility, or bypass prerequisites.

## Packaging and verification
- Release package includes `bcs_store@2.1.4.tgz`, `catalog.json`, release notes, and corresponding GPL Store source ZIP.
- Source unit is built on the MGU by the updater/deploy workflow, like v2.1.3. The absence of a precompiled `javascript/runner.js` is intentional for a source unit.
- All available JavaScript syntax checks and archive checksum verification passed.
- **Not tested on a BMW head unit or through OTA; publish as a pre-release and test before promoting to stable.**
- Automatic Store download cleanup was not implemented; retained deployment packages are needed for rollback.

## Attribution
RideTube: https://github.com/JustAnotherPU/ridetube (GPL-3.0-or-later).
RideTube companion: https://github.com/JustAnotherPU/mgu-apps.
Bimmer Lab: https://github.com/bimmer-lab/apps (MIT).
Existing upstream Store attribution and licenses remain in the provided corresponding source.
