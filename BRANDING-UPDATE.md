# IRCBM 2026 — Official branding update

This version uses the three original supplied institutional graphics as static files.

| Display | File in `public/` |
| --- | --- |
| IRCBM conference logo (header, footer, badge) | `ircbm-2026-official.png` |
| KIET emblem (homepage, badge) | `kiet-official.png` |
| KIET 25-year banner (homepage, badge) | `kiet-25-years.jpg` |

The three files must keep these names. To change one, replace it in `public/`, commit to GitHub, and let Netlify rebuild. No logo update in the website's admin Asset Management area is necessary or effective for these three branding positions.

The other existing application features and their browser-local storage have not been migrated. In particular, participant information and schedules are still browser-local, not synced centrally between devices.

To deploy: upload all project files to the existing GitHub repository, preserving the `src` and `public` folders. If deploying manually on Netlify without GitHub, first run `npm install` and `npm run build` and publish the generated `dist` folder. Do not upload only `index.html`.

Verification: check homepage and header on desktop/mobile and the printable participant badge. If an older deployment remains visible, inspect the Netlify deploy status and perform one hard refresh.
