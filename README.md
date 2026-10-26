# GS Baseball Tryout Form

- `index.html` — the tryout registration form families fill out
- `admin.html` — your private dashboard (visits, unique visitors, signups, sources, devices, full list, CSV download)
- `config.js` — team name, season, tryout sessions, age groups, and the backend URL
- `apps-script/Code.gs` — the backend; saves every visit and registration into a Google Sheet and emails you on each signup

## One-time setup (≈5 min, works from a phone browser in desktop mode)

1. Create a new Google Sheet named **GS Tryouts**.
2. **Extensions → Apps Script**. Delete what's there, paste all of `apps-script/Code.gs`.
3. Change `ADMIN_KEY` at the top to your own password. Save.
4. Pick `setup` in the function dropdown → **Run** → allow permissions.
5. **Deploy → New deployment → Web app**. Execute as **Me**, access **Anyone** → Deploy. Copy the URL ending in `/exec`.
6. Paste that URL into `API_URL` in `config.js`.
7. Repo **Settings → Pages** → Deploy from branch `main`, folder `/ (root)`.

Form: `https://keubanks16.github.io/TryoutForm/`
Dashboard: `https://keubanks16.github.io/TryoutForm/admin.html`

## Tracking where people came from
Add `?src=` to the link you share and the dashboard groups visits by it:
- `…/TryoutForm/?src=facebook`
- `…/TryoutForm/?src=flyer`
- `…/TryoutForm/?src=teamtext`
