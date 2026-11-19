CREATE TABLE IF NOT EXISTS installs (
  id         TEXT PRIMARY KEY,      -- random install id made on the head unit when sharing is switched on
  first_seen INTEGER NOT NULL,      -- unix seconds
  last_seen  INTEGER NOT NULL,
  ver        TEXT NOT NULL DEFAULT '',
  hmi        TEXT NOT NULL DEFAULT '',
  country    TEXT NOT NULL DEFAULT '',
  region     TEXT NOT NULL DEFAULT '',
  city       TEXT NOT NULL DEFAULT '',
  ip         TEXT NOT NULL DEFAULT '',   -- shortened: IPv4 a.b.c.0, IPv6 first three groups
  pings      INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS installs_last_seen ON installs(last_seen);
