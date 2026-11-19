# BCS Store 3.4.1

- Fix: the loop breaker of 3.4.0 counted every message to the updater, so a fresh install adding its dozen sources in a row looked like a loop: it switched the feed off and closed the Store (News said "feed not added yet"). It now counts only the same message to the same target (the same source added, removed or checked) more than 10 times within 10 seconds.
- With the feed off, News says "No announcements yet" and no longer "Cannot load".

