# One-time head-unit setup (needed once per car)

Robert's updater gives its control key only to the app named in `store_app` (default `robertn_store`).
BCS Store is `bcs_store_2`, so tell the updater. This file survives Robert's tool updates.

As root on the head unit:

    grep -q '^store_app' /var/opt/mgu-updater/updater.local.conf 2>/dev/null \
      && sed -i 's/^store_app.*/store_app = bcs_store_2/' /var/opt/mgu-updater/updater.local.conf \
      || echo 'store_app = bcs_store_2' >> /var/opt/mgu-updater/updater.local.conf
    chmod 600 /var/opt/mgu-updater/updater.local.conf

Then restart the head unit. Afterwards Remove, Wi-Fi buttons, Refresh and source add/remove work,
and the retired bcs-develop sources are removed automatically.
