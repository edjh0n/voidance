# VOIDANCE — Band Website

Progressive Metal band website for **Voidance** (Cebu City, Philippines),
built with **React 18 + Vite 7** and powered by **Sanity CMS** for content.

- **Live site:** https://voidance.vercel.app
- **Admin panel (CMS):** https://voidance-studio.vercel.app
- **GitHub repo:** https://github.com/edjh0n/voidance

---

## How It Works (Architecture)

The project has two parts that work together:

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   Sanity Studio (CMS)   │        │   React Site (frontend)  │
│  voidance-studio        │ ─────► │  voidance.vercel.app     │
│  .vercel.app            │ fetch  │                          │
│                         │        │  Reads content live      │
│  You add content here   │        │  from Sanity on load     │
└─────────────────────────┘        └──────────────────────────┘
            │
            ▼
   ┌──────────────────┐
   │  Sanity CDN      │  ← stores uploaded photos + MP3 audio
   └──────────────────┘
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
├── index.html               ← HTML entry + Google Fonts
├── vite.config.js
├── vercel.json              ← SPA routing + audio headers
├── package.json
├── .gitignore
├── public/
│   ├── music/               ← Local MP3 fallback (gitignored)
│   └── images/events/       ← Local photo fallback (gitignored)
├── src/
│   ├── main.jsx             ← App entry, scroll reset
│   ├── App.jsx              ← Section layout
│   ├── styles/index.css     ← All styles + responsive breakpoints
│   ├── lib/
│   │   └── sanity.js        ← Sanity client + GROQ queries
│   ├── hooks/
│   │   ├── useSanity.js     ← Generic Sanity fetch hook w/ fallback
│   │   └── useAudioPlayer.js← Music player state + Sanity tracks
│   ├── data/
│   │   ├── bandData.js      ← Static config + FALLBACK content
│   │   └── galleryData.js   ← FALLBACK gallery content
│   ├── utils/
│   │   ├── audioEngine.js   ← Audio playback (real + synth fallback)
│   │   └── canvasArt.js     ← Procedural album/video art
│   └── components/
│       ├── Nav.jsx          Hero.jsx        Gallery.jsx (01)
│       ├── About.jsx (02)   Members.jsx (03) Discography.jsx (04)
│       ├── Tour.jsx (05)    Media.jsx (06)   Contact.jsx (07)
│       ├── Footer.jsx       Starfield.jsx    MusicPlayer.jsx
└── studio/                  ← Sanity Studio (the CMS / admin panel)
    ├── sanity.config.js     ← Studio config (project ID, plugins)
    ├── sanity.cli.js        ← CLI config (deploy host)
    ├── package.json
    └── schemas/
        ├── index.js         ← Schema registry
        ├── galleryItem.js   ← Gallery photos + videos
        ├── mediaVideo.js    ← Media section videos
        ├── track.js         ← Music player tracks + MP3 upload
        └── tourDate.js      ← Tour dates
```

---

## Page Section Order

```
Hero
├── 01 // EVENTS & LIVE   (Gallery carousel)
├── 02 // ORIGIN          (About)
├── 03 // THE VOID COLLECTIVE (Members)
├── 04 // DISCOGRAPHY
├── 05 // TOUR DATES
├── 06 // MEDIA
└── 07 // CONTACT
```

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
```
https://www.youtube.com/watch?v=KZ0QZHibRqA
                                ^^^^^^^^^^^ this is the ID
```

### Adding a new track (audio)
1. Studio → **Track** → compose new
2. Title (e.g. `NEW SONG`), Album, Duration **in seconds** (3:45 = 225)
3. Under **Audio File**, upload the MP3 (it goes to Sanity's CDN)
4. Set **Playlist Order** and **Publish**

That's it — **no `vercel --prod` needed for audio anymore.** The MP3 is served
from Sanity's CDN.

---

## Local Development

First-time setup after cloning:

```bash
cd voidance-react
npm install            # install site dependencies
npm run dev            # start dev server → http://localhost:5173
```

The dev server reads live content from Sanity (CORS is already configured for
`localhost:5173` and `5174`).

### Running the Studio locally (optional)
You normally use the hosted studio, but to run it locally:
```bash
cd studio
npm install
npm run dev            # → http://localhost:3333
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

## Deploying

### The simple rule

| What changed | How to deploy |
|--------------|---------------|
| **Content** (photos, videos, tracks, tour dates) | Nothing! Publish in the studio — it's instant |
| **Site code / design** | `git push` (Vercel auto-deploys) |
| **Studio schema** (new content fields) | rebuild + redeploy the studio (below) |

Because all content and media now live in Sanity, **you almost never need to
deploy manually anymore.** Day-to-day content updates happen entirely in the
admin panel.

### Deploying site code changes
```bash
git add .
git commit -m "describe your change"
git push
```
Vercel auto-deploys the site within ~30 seconds.

### Deploying the studio (only when schemas change)
Only needed if you edit files in `studio/schemas/`:
```bash
cd studio
npm run build
vercel dist --prod --yes
```
This redeploys https://voidance-studio.vercel.app.

> Note: the built-in `sanity deploy` command currently has a CLI bug
> (`uploadSchema is not a function`), so we deploy the studio's built `dist/`
> folder to Vercel instead. This is why the studio is hosted on
> `voidance-studio.vercel.app` rather than `*.sanity.studio`.

---

## First-Time Vercel Setup (new machine)

Do this once per machine before you can deploy.

```bash
npm install -g vercel     # install Vercel CLI
vercel login              # log in (opens browser)
```

When deploying the site for the first time on a machine, it may ask to link a
project — choose **voidance** (not voidance-studio).

---

## First-Time Sanity Setup (new machine)

Only needed if you want to manage content via CLI or run the studio locally.
For normal content editing, just use the hosted admin panel — no setup needed.

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
GitHub may block a push that exposes a private email. Fix once per machine:
1. Get your private email at https://github.com/settings/emails
   (looks like `123456789+username@users.noreply.github.com`)
2. Set it:
   ```bash
   git config --global user.email "123456789+username@users.noreply.github.com"
   ```
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
- Cross-browser support (Chrome, Firefox, Brave, mobile)

---

## Fallback Data

The files in `src/data/` (`bandData.js`, `galleryData.js`) are **offline
fallbacks** — used only if Sanity returns nothing. Static items that aren't
managed in the CMS also live here:

- **Always from `bandData.js`:** band identity, members, albums, social links,
  album-art colour palettes
- **Fallback only (CMS is primary):** tracks, media videos, tour dates, gallery

You normally never edit these. Update content in the admin panel instead.

---

## Troubleshooting

**Content not showing / site looks empty**
- Check the item is **Published** (not draft) in the studio
- Hard refresh the browser (`Ctrl+Shift+R`)

**New audio won't play**
- Confirm the MP3 uploaded fully in the studio Track document
- Confirm Duration (seconds) is set correctly

**`npm install` fails**
- Confirm Node.js v20+: `node -v`
- Clear cache: `npm cache clean --force`, then retry

**Port already in use**
- Vite auto-picks the next free port — check the terminal for the URL

**Studio shows a schema warning**
- If you changed `studio/schemas/`, rebuild + redeploy the studio (see Deploying)

---

## Quick Reference

| I want to... | Where |
|--------------|-------|
| Add a gig photo | Studio → Gallery Item |
| Add a live video | Studio → Gallery Item (type: video) |
| Add a featured video | Studio → Media Video |
| Add a song | Studio → Track (upload MP3) |
| Add a tour date | Studio → Tour Date |
| Change site design/text | edit code → `git push` |
| Change band members/socials | edit `src/data/bandData.js` → `git push` |
