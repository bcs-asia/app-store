# Replacing the old BCS Store (2.1.x from bcs-develop)

The updater lets only the source that installed an app update it. 2.1.x was installed from bcs-develop/bcs-store,
so bcs-asia/app-store is refused ("bcs_store is already installed from ..."). Once that source is gone, the
installed Store is updated by the source that lists it under the same title ("BCS Store").

On the car, in the OLD BCS Store (2.1.x, it has the updater key):
1. Sources: remove bcs-develop/bcs-store and bcs-develop/bcs-mgu-apps (open each, Remove).
2. Make sure bcs-asia/app-store is listed (add it with Add source if not), then Refresh / check for updates.
3. Apps: BCS Store 2.2.5 shows Update now; install it, then restart the head unit.

From 2.2.5 on the Store removes the bcs-develop sources by itself and only offers BCS Store from bcs-asia.
