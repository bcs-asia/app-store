# BCS Store 3.4.2

- Fix: on a car where the Store could not save its install ID, the feed was never added (News said "feed not added yet", and no check-in reached the server). The ID now comes from something stable of the unit when it cannot be saved, so it is still one fixed ID.
- The News page says exactly why the feed is not there yet (for example: no install ID, updater busy, adding the other sources, no updater key, stopped by the loop breaker).

