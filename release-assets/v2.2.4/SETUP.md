# Only if the Store's buttons say "Setup needed: store_app"

Robert's updater gives its control key only to the app named in `store_app` in
/var/opt/mgu-updater/updater.local.conf (default `robertn_store`). BCS Store is `bcs_store`.
Cars that ran BCS Store 2.1.x already have this. If not, as root:

    grep -q '^store_app' /var/opt/mgu-updater/updater.local.conf 2>/dev/null \
      && sed -i 's/^store_app.*/store_app = bcs_store/' /var/opt/mgu-updater/updater.local.conf \
      || echo 'store_app = bcs_store' >> /var/opt/mgu-updater/updater.local.conf
    chmod 600 /var/opt/mgu-updater/updater.local.conf

Then restart the head unit (hold the volume knob ~10 s).
