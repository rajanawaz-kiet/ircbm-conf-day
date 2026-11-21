# IRCBM 2026 — Secure migration review branch

This branch is **isolated from the live Netlify deployment**. The live application remains unchanged.

A separate complete updated source ZIP has been prepared in this conversation:

`IRCBM_2026_FASTTRACK_Updated_Project.zip`

It contains:
- Firebase Authentication with the administrator's existing email/password account and email-link access for presenters/volunteers.
- Firestore programme management (58 verified presentations), participant CSV import, and volunteer role checks.
- Signed QR passes, atomic check-in, duplicate protection, server-enforced conference closure and attendance CSV export.
- Preserved logos, anniversary banner, DUHS partner logo, and white footer.

The full source has **not yet been transferred to this branch**, and the CI workflow currently verifies the baseline site. Do **not** merge this branch into main or deploy it as the conference website until the complete updated project has been transferred and backend + frontend tests pass.

The backend package separately requires Cloud Functions deployment to Firebase project `ircbm-2026-companion`, a server-only QR signing secret, and end-to-end mobile testing.

### Acceptance gates
1. Vite production build passes.
2. Firebase backend deployment and sign-in pass.
3. Admin imports programme; a different mobile device sees the 58 presentations.
4. Participant receives their own QR token.
5. Authorized volunteer scans once; repeated scan is rejected as duplicate.
6. Closing check-in blocks all scanners.
7. Attendance CSV exports successfully.
8. Branding remains unchanged on mobile and desktop.

**No production deployment should take place from this review-only branch.**
