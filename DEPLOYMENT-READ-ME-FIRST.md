# IRCBM 2026 — Current GitHub version + shared database integration

**STATUS: Integration candidate. NOT ready for live conference operation.**

This source package was produced from the user's uploaded `ircbm-conf-day-main.zip` and integrates the earlier Firebase starter into a single React project. It preserves the current `HomeView.tsx`, official logo image files, Header, and white footer logo styling.

## What has been integrated

- Public Programme reads Firebase Firestore live when configured. If Firebase is not configured, the existing website can still show a **read-only 58-entry verified programme snapshot**; administrators cannot edit the database in that mode.
- Admin Programme panel: upload CSV to replace all programme entries (confirmation required), edit a presentation, add a presentation, delete one.
- Admin Participants panel: upload an approved **separate** CSV (initial status must be Pending); display totals and participant rows, refreshed periodically.
- Admin Volunteer panel: authorize or revoke scanner access by verified email.
- Participant email-link sign-in and their own signed QR pass.
- Mobile scanner: only an authenticated, authorized volunteer/admin can successfully check in an attendee. Server checks QR token and creates one attendance record, with duplicate prevention.
- `?gate=tracker` link *only navigates* to the protected scanner page. It **no longer grants permission**.
- The previous browser-local admin dashboard and credentials are **not accessible** through the running App. Old source view files remain in the repository for reference but are not imported by the active App.
- Static original logos and mobile styling were preserved from the most recent ZIP.

## Critical: Do not deploy directly to the live Netlify site yet

The previous `bun.lock` was removed because it does not contain the new Firebase dependency; use `npm install` to generate a fresh lockfile, review it and commit it.

No Firebase project credentials or permission to deploy into the user's account were available. The production build could not be fully verified here because packages were unavailable to install. The cloud functions, Firestore rules, user roles, authentication, bulk import and simultaneous scans have NOT been tested against a real or emulator database.

Before any live rollout, a technical operator must:

1. Back up the currently working GitHub repository and current Netlify deployment; export any browser-only edits and other data needed, as replacing source will not migrate browser localStorage.
2. Create/choose an institution-controlled Firebase project. Enable Firestore, Authentication email-link sign-in, and a billing plan suitable for second-generation Cloud Functions. Check hosting/billing quotas.
3. Add `ircbmconferencecompanion.netlify.app` under Firebase Authentication **authorized domains**. Configure an email sending workflow and sign-in link redirect. Note: The old registration website is NOT integrated, so this system requires a *separate email-link sign-in* by approved participants.
4. Install the Firebase CLI on a developer's computer, log in, choose Firebase project. Deploy `firestore.rules` and the `functions/` source after reviewing them. Set a strong randomly generated `IRCBM_QR_SECRET` using Firebase Secret Manager (example command `firebase functions:secrets:set IRCBM_QR_SECRET`). Never place this secret in a repository or `.env` committed to GitHub.
5. Bootstrap ONE administrator: using Firebase Auth, create and verify their email account and copy the UID. In Firestore make `roles/{uid}` document with fields `role` = `admin` (string) and `enabled` = `true` (boolean). No default admin credentials exist.
6. Add these FOUR environment variables to Netlify **build environment** before deployment: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` (use Firebase console -> Project Settings -> Your apps -> Web app config). They are client identifiers, not admin credentials. Netlify must rebuild after changing variables.
7. From a development clone of this repository, run `npm install`, `npm run lint`, and `npm run build`. Fix any problems before deployment. Netlify should build with `npm run build` and publish `dist/`.
8. First publish a **separate Netlify preview/staging deployment** rather than overriding the existing public conference website. Test login, roles, upload of 58 programme entries, volunteer authorization and mobile scanner.
9. On the staging admin Programme tab, upload `data/programme_verified_58.csv`. It replaces the Firestore programme. Confirm all 58 rows appear on desktop and a fresh mobile browser.
10. Import only the REAL participants using a correctly formatted six-column CSV; see `data/participants_blank_clean.csv`. The current provided sample contains demo admin and Dr. Tariq Rahman and MUST NOT be used as participant data.
11. Have volunteers verify their own email first, then authorize each in the admin Volunteers tab. Test a valid pass, duplicate scan, invalid pass, unapproved volunteer, and simultaneous volunteers. QR scanning requires HTTPS and camera permission.
12. Once all tests pass, promote the staged build to live. Keep an offline printed roster and manual check-in fallback in case venue connectivity is unavailable.

## Functions and Firestore model

- `programme/{paperId}`: public reads; writes only via authorized callable functions.
- `participants/{participantId}`: not readable from web browser directly; backend handles imports, QR-pass retrieval and admin list.
- `roles/{firebaseAuthUid}`: admin and volunteer enabled/disabled roles, user can read own role only.
- `checkin_audit/{auditId}`: only server writes, no browser direct access.
- Server calls: `replaceProgramme`, `saveProgrammeItem`, `deleteProgrammeItem`, `importParticipants`, `getMyPass`, `checkInQR`, `listParticipants`, `createOrUpdateVolunteer`.

## Important limitations still requiring confirmation

- This migration intentionally disables the old insecure self-registration form. Approved attendees sign in with verified email; it does NOT connect to the original external registration website.
- Email invitations to approved presenters are **not automatically bulk-sent**. A Firebase email sign-in link is sent only when the participant requests it. You may distribute the website link by the existing authorized conference email process.
- The original Announcements and Venue data still come from this browser's local storage/defaults, not Firestore. The user's request prioritized programme, participants and volunteer attendance.
- The old Venue defaults in the source refer to KIET North Nazimabad. Organizers should verify the correct physical venue before using this view; this integration does not silently revise venue information.
- The `My Schedule` browser state is personal to each browser and is **not synced between devices**.
- No participant-email list should be committed to GitHub, posted publicly, or placed in the browser application bundle.
- Dashboard participant data is refreshed roughly every 10 seconds, rather than being a direct Firestore listener.
- The CSV example `data/participants_blank_clean.csv` contains headings only. Real participants are not included.
- A second-generation Cloud Functions backend and Firebase auth provider may incur charges and may require a paid billing account.

## Manual acceptance tests before launch

1. Anonymous user can read programme, cannot enter secure admin or scanner.
2. 58 papers are shown after first central import on a different computer.
3. Approved, verified presenter receives a QR pass for their email only.
4. Unlisted email cannot obtain another presenter's pass.
5. Authorized volunteer can scan QR and mark checked in; unapproved volunteer cannot.
6. Second scan says already checked in; first timestamp unchanged.
7. Two volunteers scanning simultaneously do not create duplicate attendance.
8. Admin Participants panel updates after scans; CSV reimport preserves status.
9. Admin can edit a programme session and a fresh mobile device sees the change.
10. Existing KIET anniversary/IBHM logo/white footer remain visually correct on mobile and desktop.

**For the user's no-code workflow:** Once Firebase has been configured and the project is staged, all routine programme uploads, volunteer authorization and participant imports can be done through the website administrator interface—no future code edits for these tasks are expected.
