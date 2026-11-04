# TNTJ Jummah Schedule — அமைப்பு / Setup

1. `npm install` then `npm run dev` to develop, `npm run build` to produce `dist` for Netlify.
2. Firebase Console → Authentication → Sign-in method → **Email/Password** enable. Create administrator email/password in Authentication → Users. **Old `users/{username}` plaintext-password records are not used.** Migrate users manually, then remove those old plaintext records.
3. Create `.env.local` using `.env.example`, populate Firebase project settings. These client-side Firebase identifiers are not secrets; **database rules are the security boundary**.
4. Firebase Console → Realtime Database → Rules: deploy `database.rules.json`. The included rules require any authenticated user for Dhayi/image/schedule edits; **restrict access to trusted administrators only** by provisioning only admin accounts, or extend the rules with custom admin claims before granting other user accounts. Branch master data is read-only with these rules.
5. Existing `TNTJ_THANJAI_BRANCH/jummah_details`, `DHAYINAMES`, `IMAGES` data remain unchanged. New per-Friday records are stored under `SCHEDULES/YYYY-MM-DD`.
6. Auto assignment uses Fisher–Yates shuffle; unique names only; excess branches stay unassigned. Changes are not saved until **சேமி** is clicked.
7. Tamil typography uses Google Fonts `Noto Sans Tamil`; an internet connection is needed for the web font, with system sans-serif fallback. PDF/image export is rasterized to retain Tamil glyph rendering.
8. Test login, database permissions, date switching, assignment/save/reload, and exports against your Firebase project before production deployment. No live database or browser testing was performed during this source modification.
