# GS Baseball Tryout Form

Public tryout registration form. Every registration and every visit goes straight into the
**GS Baseball Hub** (same Firebase project). See them in the Hub: **Team → Tryout Signups** (owner only).

- `index.html` — the form
- `config.js` — team name, season, tryout sessions, age groups

Form link: `https://keubanks16.github.io/TryoutForm/`

## One-time setup
1. **GitHub Pages:** this repo → Settings → Pages → Deploy from branch `main`, `/ (root)`.
2. **Firebase:** Authentication → Settings → Authorized domains → **Add domain** → `keubanks16.github.io`.
3. **Firebase:** publish the latest `firestore.rules` from the Hub repo (adds `tryoutSignups` and `tryoutFormVisits`).

## Tracking where visitors came from
Add `?src=` to links you share and the Hub groups visits by it:
`…/TryoutForm/?src=facebook`, `?src=flyer`, `?src=teamtext`
