# BCS Store usage statistics

A small Cloudflare Worker (free tier) with a D1 database. It counts the BCS Stores (3.3.4 and later) that reach the internet, and
shows them on a dashboard:

- **Online now** (heard from in the last 10 minutes), **Installed** (every install that has checked in), **Active 24 hours / 7 days**
- by country, by Store version, by iDrive version
- the latest installs: location (country, region, city), shortened address, Store and iDrive version, last and first seen

## How a car reaches the Worker, and what it sends (and nothing else)

On a head unit only the updater can reach the internet, not the Store app. So the Store adds one hidden source to the updater, the **BCS feed**:

`https://bcs-stats.<account>.workers.dev/v1/feed.json?id=<random install id>&v=<Store version>&hmi=ID7|ID8`

The updater reads it like any catalog whenever it checks its sources (when the Store opens, when the News page opens, and every six hours). That
request is the check-in. The answer is a catalog whose entries are the announcements (title, text, date, photo); the Store hides the source and
shows them under News. The Worker keeps GitHub's `announcements/` answer for about five minutes. It adds what any server sees of a connection:
Cloudflare's country, region and city for it, and the address, which it **shortens before saving** (IPv4 `a.b.c.0`, IPv6 the first three
groups). No VIN, name, email, account, location from the car's GPS or list of installed apps. To delete an install on request, call
`/v1/optout` with its id (or delete the row in D1). See [PRIVACY.md](../PRIVACY.md). "Online now" counts installs that checked in during the
last 10 minutes, so it means "the Store was just opened" rather than "the car is on"; Active 24 hours and 7 days are the useful numbers.

## Deploy (about ten minutes, needs a free Cloudflare account and Node)

```
cd analytics/worker
npm install
npx wrangler login
npx wrangler d1 create bcs-stats              # copy the database_id it prints into wrangler.toml
npx wrangler d1 execute bcs-stats --remote --file=schema.sql
npx wrangler secret put DASH_TOKEN            # a long random password: the dashboard asks for it
npx wrangler deploy                           # prints https://bcs-stats.<your-account>.workers.dev
```

Open that address for the dashboard. Then tell the Store where it is: in `apps/bcs_store/src/bcs_config.js` set `FEED_URL` to
`https://bcs-stats.<your-account>.workers.dev/v1/feed.json` and release the Store again. Until `FEED_URL` is set, nothing is sent and News stays
empty. To deploy a newer Worker, run `npx wrangler deploy` again in this folder (the database and the password stay). A custom
domain (Workers > your Worker > Settings > Domains) keeps the address stable if you ever move the Worker.

## Tests

`npm test` in `analytics/worker` runs the Worker against a real SQLite database (Node 22).

## Keeping it lawful

There is no question in the Store: the check-in is on whenever `STATS_URL` is set. Keep what is sent as small as it is, keep
[PRIVACY.md](../PRIVACY.md) true, and say it in the Store's release notes and README so it is not hidden. A shortened address and a
city can still count as personal data in some places (Malaysia's PDPA, the EU's GDPR): if you have users there, take local advice
on whether a notice or an opt-out is needed, and name BCS Automotive Solutions as the controller with a contact in PRIVACY.md.
