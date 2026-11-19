# Replacing the old BCS Store (2.1.x installed from bcs-develop)

The updater lets only the source that installed an app update it ("bcs_store is already installed from ...").
When that source is removed, the installed Store is handed to the source whose listing has the same title
(the Store's entry-point text, "Store"). 3.3.0's catalog uses that title.

On the car, in the OLD BCS Store (2.1.x; it has the updater key):
1. Sources: remove bcs-develop/bcs-store and bcs-develop/bcs-mgu-apps.
2. Keep bcs-asia/app-store listed (Add source if needed), then refresh (Check for updates).
3. Apps: the Store now shows Update now (3.3.2). Install it, then restart the head unit.

If it still says "already installed from ...", tell me the full text of the message (open the Store page,
the line is cut off on screen) and which sources are listed.
