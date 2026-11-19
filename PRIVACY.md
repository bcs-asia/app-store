# BCS Store privacy

The Store sends car statistics to the BCS server so BCS can plan better. There is no personal information in them.

It sends: a random install ID (made at the first check-in, not linked to you, your car or your VIN), the Store version, your iDrive
version (7 or 8), every five minutes while the Store is running with internet. The server also sees your
internet connection: it works out your **country, region and city** from it and keeps a **shortened internet address** (the last
part removed). It never receives your name, VIN, accounts, GPS position, the apps you install or anything you type.

BCS uses it to count how many cars use the Store and which versions and countries to look after. It is not sold or shared.

To have the record of an install deleted, contact BCS with the install ID (the Store's data folder, file `install-id`).

**Announcements** (Settings > Announcements): the Store fetches `news.json` and photos from this repository on GitHub. GitHub sees
the request as it sees any download.

Controller: BCS Automotive Solutions. Contact: _add your contact address here_.
