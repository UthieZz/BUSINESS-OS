Sprint Zero residuals:
- Live vault read/write + search/filter/edit/delete confirmed (InventoryView implemented).
- Atomic decrementStock exposed via Sell control on vault items (uses Firestore transaction).
- Delete confirmation is now an in-app modal (mobile-friendly; no window.confirm).
- Theme Card aligned to --card-bg.
- Build green.
Next: live smoke with real env, Auth + rules before public, Sales module that consumes decrement.
