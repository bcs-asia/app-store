# One-time head-unit setup (needed once per car)

Robert's updater gives its control key only to the app named in `store_app` in
`/var/opt/mgu-updater/updater.local.conf` (it also refuses to remove that app).
BCS Store is `bcs_store_2`. If the file says `bcs_store` (the old 2.1.x store) or nothing, Remove, Restart,
Wi-Fi buttons and source changes do nothing.

Check:   grep store_app /var/opt/mgu-updater/updater.local.conf

As root on the head unit:

    grep -q '^store_app' /var/opt/mgu-updater/updater.local.conf 2>/dev/null \
      && sed -i 's/^store_app.*/store_app = bcs_store_2/' /var/opt/mgu-updater/updater.local.conf \
      || echo 'store_app = bcs_store_2' >> /var/opt/mgu-updater/updater.local.conf
    chmod 600 /var/opt/mgu-updater/updater.local.conf

Then restart the head unit with the car's own restart (hold the volume knob ~10 s), because the store's
Restart button needs the key too. Afterwards the old "bcs_store" (2.1.x) can be removed from its page.
