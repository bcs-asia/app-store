# BCS Store usage statistics

A small Cloudflare Worker (free tier) with a D1 database. It counts the BCS Stores whose owners switched
**Settings > Usage statistics > Share anonymous usage** on, and shows them on a dashboard:

- **Online now** (heard from in the last 10 minutes), **Installed** (cars sharing), **Active 24 hours / 7 days**
- by country, by Store version, by iDrive version
- the latest installs: location (country, region, city), shortened address, Store and iDrive version, last and first seen

## What the Store sends (and nothing else)

`{ v: 1, id: <random install id>, ev: "open" | "ping", ver: "3.3.0", hmi: "ID7" | "ID8" }`, once when sharing is switched on or the
Store starts, then every five minutes while the head unit is on. The Worker adds what any server sees of a connection: Cloudflare's
country, region and city for it, and the address, which it **shortens before saving** (IPv4 `a.b.c.0`, IPv6 the first three groups).
No VIN, name, account, location from the car's GPS or list of installed apps. Switching sharing off sends `/v1/optout`, the row is
deleted and the id is deleted on the head unit. See [PRIVACY.md](../PRIVACY.md).

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

Open that address for the dashboard. Then tell the Store where it is: in `apps/bcs_store/src/bcs_config.js` set

```js
module.exports = { STATS_URL: 'https://bcs-stats.<your-account>.workers.dev/v1' };
```

and release the Store again. Until `STATS_URL` is set, Settings does not offer Usage statistics and nothing is sent. A custom
domain (Workers > your Worker > Settings > Domains) keeps the address stable if you ever move the Worker.

## Tests

`npm test` in `analytics/worker` runs the Worker against a real SQLite database (Node 22).

## Keeping it lawful

Sharing is **opt-in**: the Store asks once (a NEW tag on Settings) and sends nothing before a yes. Keep the privacy text in
Settings and PRIVACY.md true: if you add a field, say so there first. The shortened address and the city are still personal data in
some places (Malaysia's PDPA, the EU's GDPR): name BCS Automotive Solutions as the controller in PRIVACY.md and give a contact.
