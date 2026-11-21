# BCS Store 3.4.9

- **Statistics show the Store version and iDrive (ID7 / ID8) again.** They are part of the feed address now, together with the install id. The address does not change while the Store runs: it changes only when the Store is updated.
- **No loops.** On an update the old feed source is replaced once. The new address is saved first and a replacement happens at most once per address, even across restarts; if the address cannot be saved, nothing is replaced. The loop breaker from 3.4.0 still guards every source add and remove.
- Also in this build (from 3.4.6 to 3.4.8): new sources `mlurker/bmw-idrive7-apps`, `dwz365365/id7f` (experimental, parked testing only), `robertnisipeanu/idrive-apps`, `ALMSTRA/idv7lol`, `eroobeeroo/idrive7-cluster-info` and `Vizualyse/idrive-apps` (Cast to cluster, tech demo).

Update from the USB stick or over the air: the Store shows Update now (3.4.9). Install it, then restart the head unit.
