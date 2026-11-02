# GS Baseball Tryout Form

Public tryout registration form. Every registration and every visit goes straight into the
**GS Baseball Hub** (same Firebase project). See them in the Hub: **Team → Tryout Signups** (owner only).

- `index.html` — the form
- `config.js` — team name, season, tryout sessions, age groups

Form link: `https://tryouts.stingerz-baseball.com`

## One-time setup
1. **GitHub Pages:** this repo → Settings → Pages → Deploy from branch `main`, `/ (root)`.
2. **Firebase:** Authentication → Settings → Authorized domains → **Add domain** → `tryouts.stingerz-baseball.com`.
3. **GoDaddy DNS:** add a CNAME record, name `tryouts`, value `keubanks16.github.io`.
4. **Firebase:** publish the latest `firestore.rules` from the Hub repo (adds `tryoutSignups` and `tryoutFormVisits`).

## Tracking where visitors came from
Add `?src=` to links you share and the Hub groups visits by it:
`tryouts.stingerz-baseball.com/?src=facebook`, `?src=flyer`, `?src=teamtext`

## Started but didn't finish
- While someone types, the form records **how far they got** on their visit record (which fields have an answer and the last one they touched, never what they typed). The Hub shows "Started typing", "Didn't finish" and "Where they stopped".
- **Save for later** (button under Submit): only when a family taps it, their answers are kept on that phone and saved to `tryoutDrafts`, so they can finish later and the coach can see them in the Hub. Submitting, or "Delete my saved answers", removes them.
- Needs the latest `firestore.rules` from the Hub repo.
