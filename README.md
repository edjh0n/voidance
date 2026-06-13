# VOIDANCE — Band Website

Progressive Metal band website for **Voidance** (Cebu City, Philippines),
built with **React 18 + Vite 7** and powered by **Sanity CMS** for content.

- **Live site:** https://www.voidanze.com
- **Admin panel (CMS):** https://voidance-studio.vercel.app
- **GitHub repo:** https://github.com/edjh0n/voidance

---

## How It Works (Architecture)

The project has two parts that work together:

```
Sanity Studio (CMS)  -->  React Site (frontend)
voidance-studio           voidance.vercel.app
.vercel.app               reads content live from Sanity on load
      |
      v
  Sanity CDN  <- stores uploaded photos + MP3 audio
```

- **Content** (gallery photos/videos, media videos, tracks, tour dates) lives in
  **Sanity** and is edited from the admin panel — no code needed.
- **Audio and images** are uploaded through the admin panel and served from
  **Sanity's CDN** — no more deploying large files to Vercel.
- The React site fetches content from Sanity on page load. If Sanity is
  unreachable, it falls back to the static data in `src/data/`.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite 7 |
| Styling | Plain CSS (`src/styles/index.css`) |
| CMS | Sanity v3 (Studio + Content Lake) |
| Hosting | Vercel (both site and studio) |
| Audio | Web Audio API + HTML5 Audio, files on Sanity CDN |

---

## Requirements

| Tool | Minimum | Check | Download |
|------|---------|-------|----------|
| Node.js | v20+ | `node -v` | https://nodejs.org |
| npm | v9+ | `npm -v` | comes with Node.js |
| Git | any | `git --version` | https://git-scm.com |

---

## Project Structure

```
voidance-react/
- index.html               HTML entry + Google Fonts + favicon/social tags
- vite.config.js
- vercel.json              SPA routing + audio headers
- package.json
- public/
  - brand/                 Logo assets (committed)
    - voidance-logo.svg      nav bar logo
    - voidance-logo.png      social share image (og:image)
    - voidance-hero.svg      large eclipse logo for the hero
    - favicon.png            browser tab icon (cropped eclipse)
    - apple-touch-icon.png   iOS home-screen icon
  - music/                 Local MP3 fallback (gitignored)
  - images/events/         Local photo fallback (gitignored)
- src/
  - main.jsx               App entry, scroll reset
  - App.jsx                Section layout
  - styles/index.css       All styles + responsive breakpoints
  - lib/sanity.js          Sanity client + GROQ queries
  - hooks/
    - useSanity.js         Generic Sanity fetch hook w/ fallback
    - useAudioPlayer.js    Music player state + Sanity tracks
  - data/
    - bandData.js          Static config + FALLBACK content
    - galleryData.js       FALLBACK gallery content
  - utils/
    - audioEngine.js       Audio playback (real + synth fallback)
    - canvasArt.js         Procedural album/video art
  - components/            Nav, Hero, Gallery(01), About(02), Members(03),
                           Discography(04), Tour(05), Merch(06), Contact(07),
                           OrderConfirmed, Footer, Starfield, MusicPlayer
- studio/                  Sanity Studio (the CMS / admin panel)
  - sanity.config.js       Studio config (project ID, plugins)
  - sanity.cli.js          CLI config (deploy host)
  - schemas/               galleryItem, mediaVideo, track, tourDate, index
```

---

## Page Section Order

```
Hero
- 01 // EVENTS & LIVE        (Gallery carousel)
- 02 // ORIGIN              (About)
- 03 // THE VOID COLLECTIVE (Members)
- 04 // DISCOGRAPHY
- 05 // TOUR DATES
- 06 // MEDIA
- 07 // CONTACT
```

---

## Branding / Logo

All logo assets live in `public/brand/` and are committed to the repo.

| File | Used for |
|------|----------|
| `voidance-logo.svg` | Nav bar logo |
| `voidance-logo.png` | Social share preview (og:image) |
| `voidance-hero.svg` | Large glowing eclipse logo in the hero |
| `favicon.png` | Browser tab icon (cropped eclipse "O", round, transparent corners) |
| `apple-touch-icon.png` | iOS home-screen icon (180×180) |

Wired up in: `src/components/Hero.jsx` (hero eclipse), `src/components/Nav.jsx`
(nav logo), and `index.html` (favicon + social tags).

**Hero blend trick:** the hero image has a black background. To blend it into the
dark starfield with no visible square edge, `.hero-eclipse img` uses
`mix-blend-mode: screen` in `src/styles/index.css`. If you swap in a
transparent-background image later, you can remove that line.

**To replace the logo:** drop the new file into `public/brand/` (same filename),
then `git push`. Sizing is controlled in `src/styles/index.css` —
`.nav-logo-img` (nav, with a separate value in the `@media (max-width: 600px)`
block for mobile) and `.hero-eclipse` (hero).

---

## Managing Content (Admin Panel)

**This is the main thing you'll use day to day.** No code required.

Go to **https://voidance-studio.vercel.app** and log in with GitHub.
You'll see four content types in the sidebar:

| Section | What it controls | How to add |
|---------|------------------|------------|
| **Gallery Item** | Events & Live carousel (01) | Upload a photo OR paste a YouTube video ID |
| **Media Video** | Media section (06) | Paste a YouTube video ID, set one as "featured" |
| **Track** | Music player | Type title + duration, upload the MP3 file |
| **Tour Date** | Tour dates (05) | Fill date, venue, location, ticket status |

### To add content
1. Click the content type in the sidebar
2. Click the **+ / compose** icon (top of the list)
3. Fill in the fields
4. Click **Publish** (bottom right)
5. The change appears on the live site within seconds — no deploy needed

### Important: the fallback rule
Each section is independent. As soon as **one** item exists in a section in
Sanity, the site shows **only** Sanity items for that section and ignores the
static fallback in `src/data/`. So when you start managing a section in the CMS,
add **all** the items you want there.

### Finding a YouTube video ID
The ID is the part after `?v=` in the URL:
`https://www.youtube.com/watch?v=KZ0QZHibRqA` -> the ID is `KZ0QZHibRqA`

### Adding a new track (audio)
1. Studio -> **Track** -> compose new
2. Title, Album, Duration **in seconds** (3:45 = 225)
3. Under **Audio File**, upload the MP3 (it goes to Sanity's CDN)
4. Set **Playlist Order** and **Publish**

No `vercel --prod` needed for audio anymore — the MP3 is served from Sanity's CDN.

---

## Local Development

First-time setup after cloning:

```bash
cd voidance-react
npm install            # install site dependencies
npm run dev            # start dev server -> http://localhost:5173
```

The dev server reads live content from Sanity (CORS is already configured for
`localhost:5173` and `5174`).

### Local merch mode override

Merch Settings in Sanity affects the live production site because the frontend
reads from the `production` Sanity dataset. For local testing, use a Vite env
override instead of changing the Studio setting.

Create a local `.env.local` file in the project root:

```text
VITE_MERCH_MODE_OVERRIDE=coming-soon
```

Accepted values:

```text
live
coming-soon
```

Remove the variable, leave it blank, or restart the dev server without it to go
back to following Sanity Merch Settings.

Do not add `VITE_MERCH_MODE_OVERRIDE` in Vercel Production unless you
intentionally want production to ignore the Sanity merch toggle.

### Testing merch orders locally

Local merch order emails use the Vercel serverless function at
`/api/merch-order`, so run both the Vite frontend and Vercel dev server:

```bash
npm run dev
vercel dev --listen 3000
```

Open the site from the Vite URL:

```text
http://localhost:5173
```

When the frontend runs on `localhost:5173`, merch orders are routed to the local
Vercel function on `localhost:3000`.

For local auto-response testing, add these server-side values to `.env.local`
alongside `VITE_MERCH_MODE_OVERRIDE`:

```text
RESEND_API_KEY=
MERCH_ORDER_TO_EMAIL=
MERCH_ORDER_FROM_EMAIL=VOIDANCE <orders@mail.voidanze.com>
FORMSPREE_MERCH_ENDPOINT=https://formspree.io/f/xykanyew
```

After a successful merch order, the site redirects to hidden page
`#order-confirmed`, shows the order status, then returns to `#merch` after a few
seconds.

### Running the Studio locally (optional)
```bash
cd studio
npm install
npm run dev            # -> http://localhost:3333
```

### Available commands

Site (run from project root):
| Command | Does |
|---------|------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |

Studio (run from `studio/`):
| Command | Does |
|---------|------|
| `npm run dev` | Local studio at :3333 |
| `npm run build` | Build studio into `studio/dist/` |

---

## Deploying to Production

Since the site now uses Sanity, there are **two different kinds of "deploy"** —
and most of the time you won't touch code at all.

### Quick decision: what are you changing?

| What you changed | What to do | Takes effect |
|------------------|-----------|--------------|
| Content (photos, videos, songs, tour dates) | Publish in the Studio | Seconds — no deploy |
| Site code or design (CSS, components, logo) | Push to GitHub | ~30s auto-deploy |
| Studio schema (`studio/schemas/`) | Rebuild + redeploy studio | ~1 min |

---

### A) Publishing CONTENT (the everyday case)

You do **not** touch code or run any commands.

1. Go to **https://voidance-studio.vercel.app**
2. Log in with GitHub
3. Add or edit an item (Gallery Item, Media Video, Track, Tour Date)
4. Click **Publish** (bottom-right)
5. Open **https://www.voidanze.com** and hard-refresh (Ctrl+Shift+R)

The live site reads from Sanity on load, so published content appears within
seconds. **No git, no Vercel, no build.** Audio/images come from Sanity's CDN,
so even new MP3s need no code deploy.

---

### B) Deploying CODE / DESIGN changes to production

Use this when you've edited components, CSS, the logo, `index.html`, etc.

**Step 1 — Make sure it builds locally (catch errors before production)**
```bash
cd voidance-react
npm run build
```
If this completes with no red errors, you're good. (It creates a `dist/` folder
you can ignore — it's gitignored.)

**Step 2 — Optionally preview the production build**
```bash
npm run preview
```
Open the URL it prints and click around. Ctrl+C to stop.

**Step 3 — Commit and push**
```bash
git add .
git commit -m "describe what you changed"
git push
```

**Step 4 — Vercel auto-deploys**
Pushing to the `main` branch triggers Vercel automatically. Within ~30 seconds
the change is live at **https://www.voidanze.com**. Watch the build at
https://vercel.com (your project dashboard).

> You do **not** run `vercel --prod` for normal code changes — the GitHub push
> handles it.

If `git push` is rejected for email privacy, see "Working Across Machines" below.

### C) Deploying STUDIO changes (rare — only when schemas change)

Only needed if you edited files in `studio/schemas/` (e.g. added a new field to
a Track or Tour Date).

```bash
cd studio
npm run build
vercel dist --prod --yes
```
This redeploys **https://voidance-studio.vercel.app**.

> Note: the built-in `sanity deploy` command currently has a CLI bug
> (`uploadSchema is not a function`), so we deploy the studio's built `dist/`
> folder to Vercel instead. That's why the studio lives on
> `voidance-studio.vercel.app` rather than `*.sanity.studio`.

---

### Full release checklist (when you've changed several things)

1. Content added/edited in Studio -> **Published**
2. `npm run build` passes locally with no errors
3. `git add . && git commit -m "..." && git push`
4. Vercel shows a successful deploy (green) in the dashboard
5. Hard-refresh https://www.voidanze.com and verify
6. (Only if schemas changed) redeploy the studio per section C

---

## First-Time Vercel Setup (new machine)

```bash
npm install -g vercel     # install Vercel CLI
vercel login              # log in (opens browser)
```

When deploying the site for the first time on a machine, it may ask to link a
project — choose **voidance** (not voidance-studio).

---

## First-Time Sanity Setup (new machine)

Only needed to manage content via CLI or run the studio locally. For normal
content editing, just use the hosted admin panel — no setup needed.

```bash
npm install -g sanity     # install Sanity CLI
sanity login              # log in with GitHub (opens browser)
```

Project details:
- **Project ID:** `zx2gw68l`
- **Dataset:** `production`
- **Manage at:** https://www.sanity.io/manage

---

## Working Across Machines (Git)

### Get the latest code
```bash
git pull
```

### If git push is rejected for email privacy
1. Get your private email at https://github.com/settings/emails
   (looks like `123456789+username@users.noreply.github.com`)
2. Set it: `git config --global user.email "...noreply.github.com"`
3. Re-commit and push:
   ```bash
   git commit --amend --reset-author --no-edit
   git push
   ```

---

## Music Player

- Plays real MP3s served from Sanity CDN
- Falls back to a procedural Web Audio synth if a track has no audio file
- Fade in on play, fade out on pause, crossfade between tracks
- Controls: play/pause, prev/next, seek, volume, mute, playlist drawer
- Cross-browser (Chrome, Firefox, Brave, mobile)

---

## Fallback Data

The files in `src/data/` are **offline fallbacks** — used only if Sanity returns
nothing. Static items not managed in the CMS also live here:

- **Always from `bandData.js`:** band identity, members, albums, social links,
  album-art colour palettes
- **Fallback only (CMS is primary):** tracks, media videos, tour dates, gallery

---

## Current Production Release Flow

Use this flow when deploying the current site. The main website and Sanity Studio
are deployed separately.

### 1. Verify the main website

From the project root:

```bash
npm run build
```

### 2. Verify the Sanity Studio

```bash
cd studio
npm run build
cd ..
```

### 3. Commit and push the main website

```bash
git add .
git commit -m "Add merch flow, CMS settings, and site enhancements"
git push
```

Pushing to GitHub deploys the main website through Vercel.

This is required for frontend/API changes such as:

- merch page and cart quantity controls
- merch checkout delivery fields
- merch order API fallback behavior
- merch coming soon/live display toggle
- dynamic hero stats
- tour date status logic
- styling and component updates

### 4. Deploy Sanity Studio when schemas change

Run this only when files under `studio/schemas/` or Studio config changed:

```bash
cd studio
npm run deploy
cd ..
```

This is required for Studio changes such as:

- `Merch Settings`
- `Merch Product`
- `Origin Page`
- `Band Member`
- `Discography Release`
- updated `Tour Date` status options

### 5. Merch order auto-response env vars

The merch checkout API lives at:

```text
/api/merch-order
```

It forwards merch orders to Formspree and, when Resend is configured, sends the
customer auto-response.

Add these environment variables in the main website Vercel project:

```text
RESEND_API_KEY
MERCH_ORDER_TO_EMAIL
MERCH_ORDER_FROM_EMAIL
```

Optional:

```text
FORMSPREE_MERCH_ENDPOINT=https://formspree.io/f/xykanyew
```

If Resend is not configured, merch orders should still be captured through the
Formspree fallback. Customer auto-response emails are skipped until the Resend
variables are set.

After a successful merch order, the frontend redirects the customer to hidden
page `#order-confirmed`. This page is not listed in the navigation. It displays
the order summary, email status, and then returns the customer to `#merch`.

### 6. Final production checks

After deploy:

- Open the main website.
- In Sanity Studio, test `Merch Settings`.
- Set `Merch Display Mode` to `Coming Soon`, publish, and confirm the merch page hides products.
- Set it back to `Live Store`, publish, and confirm products return.
- Test merch checkout and confirm the order reaches Formspree.
- If Resend env vars are configured, confirm the customer auto-response is sent.
- Confirm successful merch orders redirect to `#order-confirmed`, then return to `#merch`.
- Confirm `Tour Date` status options include Upcoming, Free Entry, Done, and Cancelled.

---

## Troubleshooting

**Content not showing** — confirm the item is **Published** (not draft); hard refresh (Ctrl+Shift+R).
**New audio won't play** — confirm the MP3 uploaded fully and Duration (seconds) is set.
**`npm install` fails** — confirm Node v20+ (`node -v`); `npm cache clean --force`.
**Port already in use** — Vite auto-picks the next free port; check the terminal URL.
**Studio schema warning** — if you changed `studio/schemas/`, rebuild + redeploy (section C).

---

## Quick Reference

| I want to... | Where |
|--------------|-------|
| Add a gig photo | Studio -> Gallery Item |
| Add a live video | Studio -> Gallery Item (type: video) |
| Add a featured video | Studio -> Media Video |
| Add a song | Studio -> Track (upload MP3) |
| Add a tour date | Studio -> Tour Date |
| Change site design/text | edit code -> `git push` |
| Change the logo | replace file in `public/brand/` -> `git push` |
| Change band members/socials | edit `src/data/bandData.js` -> `git push` |
