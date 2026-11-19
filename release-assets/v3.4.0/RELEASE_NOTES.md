# BCS Store 3.4.0

- The BCS feed (announcements and the usage check-in) is back, with safeguards after the head-unit hangs of 3.3.x:
  - One fixed install ID. It is made once, saved and read back; if it cannot be saved, no feed is added and no second ID is ever made. The feed address holds only that ID.
  - Exactly one feed source in the updater. If an earlier version left more, the extras are removed; none is added while one exists.
  - Loop breaker: more than 10 messages to the updater (add or remove a source, check) within 10 seconds stops the feed, leaves a flag so it stays off for this version, and closes the Store.
  - Announcements are asked for only when the Store is opened while the car is online, once per opening. The News tab sends nothing itself. Photos are read only while News is on screen.
- Announcements stay empty for the first test on one car.

