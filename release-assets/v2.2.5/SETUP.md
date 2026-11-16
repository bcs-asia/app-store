# Only if the Store's buttons say "Setup needed: store_app"
The updater gives its key only to the app named in `store_app` in /var/opt/mgu-updater/updater.local.conf.
BCS Store is `bcs_store` (cars that ran 2.1.x already have it). If not, as root:
    grep -q '^store_app' /var/opt/mgu-updater/updater.local.conf 2>/dev/null \
      && sed -i 's/^store_app.*/store_app = bcs_store/' /var/opt/mgu-updater/updater.local.conf \
      || echo 'store_app = bcs_store' >> /var/opt/mgu-updater/updater.local.conf
Then restart the head unit.
