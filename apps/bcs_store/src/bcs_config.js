'use strict';
/* Settings of the BCS servers.
 * FEED_URL: the BCS feed (analytics/README.md). The Store adds it to the updater as a hidden https source, because on a head unit only
 *   the updater can reach the internet, not the Store app. The updater reads it when it checks; the answer carries the announcements,
 *   and the request (a random install id, the Store and iDrive versions in its query) is the usage check-in. Empty: no feed.
 * STATS_URL: kept empty; the Store app cannot look up internet names itself (getaddrinfo ENOTFOUND on the car). */
module.exports = { FEED_URL: 'https://bcs-stats.bcs-asia.workers.dev/v1/feed.json', STATS_URL: '' };
