# BCS Store 3.4.14

- **Faster lists.** The Apps and Tools screens were rebuilt with a scan of every app for each app, which is slow with a few hundred apps from two dozen sources. They are now built in one pass: about 25 times faster in our tests, with the same screens.
- **Sources load as you scroll.** The 14 main sources are added at once, as before. The 10 newer community sources wait: when you scroll the Apps or Tools list to its end, or press the ring at its end, the next three are added while the ring turns (no text). A car that already has them all shows no ring. Each source is still added once per run, and the loop breaker still guards it.
- Everything up to 3.4.13 (all the new sources, the version and iDrive in the stats) is already published.

Update from the USB stick or over the air: the Store shows Update now (3.4.14). Install it, then restart the head unit.
