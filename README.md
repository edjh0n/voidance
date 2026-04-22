# VOIDANCE — Band Website

Progressive Metal / Djent band website for **Voidance** (Cebu City, Philippines),
built with **React 18 + Vite 7**.

---

## Requirements

| Tool    | Minimum Version | Check Command | Download               |
|---------|-----------------|---------------|------------------------|
| Node.js | v18 or higher   | `node -v`     | https://nodejs.org     |
| npm     | v9 or higher    | `npm -v`      | Comes with Node.js     |

---

## Cloning on a New Machine

Use this when you want to work on the project from a different computer.

### Step 1 — Install the requirements

Make sure **Node.js v18+** and **Git** are installed on the new machine:

| Tool    | Download                        |
|---------|---------------------------------|
| Node.js | https://nodejs.org              |
| Git     | https://git-scm.com/downloads   |

Verify after installing:
```bash
node -v
git --version
```

---

### Step 2 — Clone the repository

```bash
git clone https://github.com/edjh0n/voidance.git
```

This creates a `voidance/` folder with all project files.

---

### Step 3 — Install dependencies

```bash
cd voidance
npm install
```

> `node_modules/` is not stored in GitHub — this step recreates it locally.
> It may take 30–60 seconds the first time.

---

### Step 4 — Run the dev server

```bash
npm run dev
```

Open **`http://localhost:5173`** in your browser. Done!

---

### Step 5 — Restore your media files *(if needed)*

These folders are excluded from GitHub (listed in `.gitignore`).
Copy them manually from your other machine if you had real files:

| Folder                    | What goes here         |
|---------------------------|------------------------|
| `public/music/`           | `.mp3` / `.wav` files  |
| `public/images/events/`   | Event / gig photos     |

---

### Pushing changes back to GitHub

After editing on the new machine:

```bash
git add .
git commit -m "describe your change"
git push
```

Vercel will auto-redeploy the live site within 30 seconds.

---

### Pulling latest changes on your original machine

When you switch back to your original machine and want the latest code:

```bash
cd C:\Users\ebaquero\voidance-react
git pull
```

---

## First-Time Setup

Run this **once** after cloning or extracting the project:

```bash
cd C:\Users\ebaquero\voidance-react
npm install
```

---

## Running the Dev Server

```bash
cd C:\Users\ebaquero\voidance-react
npm run dev
```

Open your browser at **`http://localhost:5173`**
*(Vite auto-picks the next port if 5173 is busy — check terminal output)*

**Stop the server:** `Ctrl + C`

---

## Available Commands

| Command           | What it does                                      |
|-------------------|---------------------------------------------------|
| `npm install`     | Install / restore all dependencies                |
| `npm run dev`     | Start local dev server with hot reload            |
| `npm run build`   | Build optimised production files into `dist/`     |
| `npm run preview` | Preview the production build at localhost:4173    |

---

## Deploying to Vercel

```bash
# First time only
npm install -g vercel
vercel login
vercel

# Every update after that
git add .
git commit -m "your change"
git push        # Vercel auto-deploys on push
```

---

## Project Structure

```
voidance-react/
├── index.html                   ← HTML entry point + Google Fonts
├── vite.config.js               ← Vite 7 + @vitejs/plugin-react config
├── vercel.json                  ← Vercel SPA routing config
├── package.json
├── public/
│   ├── music/                   ← Drop .mp3 / .wav audio files here
│   │   └── README.md            ← Audio file naming & format guide
│   └── images/
│       └── events/              ← Drop event / gig photos here
│           └── README.md        ← Image naming & gallery guide
└── src/
    ├── main.jsx                 ← React app entry point
    ├── App.jsx                  ← Root component — assembles all sections
    ├── styles/
    │   └── index.css            ← All styles, animations, responsive breakpoints
    ├── data/
    │   ├── bandData.js          ← Members, albums, tour dates, tracks, socials
    │   └── galleryData.js       ← Gallery / carousel items (images + videos)
    ├── utils/
    │   ├── canvasArt.js         ← Procedural album art & video thumbnail canvas
    │   └── audioEngine.js       ← Dual-mode audio (real file + Web Audio synth)
    ├── hooks/
    │   ├── useAudioPlayer.js    ← Music player state (play/pause/seek/volume)
    │   └── useScrollReveal.js   ← IntersectionObserver scroll-reveal hook
    └── components/
        ├── Starfield.jsx        ← Animated canvas starfield background
        ├── Nav.jsx              ← Desktop nav + mobile hamburger drawer
        ├── Hero.jsx             ← Full-screen hero with glitch band name
        ├── Gallery.jsx          ← Events & Live carousel (images + YouTube)
        ├── About.jsx            ← Band origin, bio, and quick-facts strip
        ├── Members.jsx          ← Band member cards with avatar initials
        ├── Discography.jsx      ← Album grid with procedural canvas artwork
        ├── Tour.jsx             ← Tour dates with ticket status badges
        ├── Media.jsx            ← Featured video + sidebar video thumbnails
        ├── Contact.jsx          ← Social links and contact info
        ├── Footer.jsx           ← Footer
        └── MusicPlayer.jsx      ← Sticky bottom player with playlist drawer
```

---

## Page Section Order

```
Hero
├── 01 // EVENTS & LIVE    ← Gallery carousel
├── 02 // ORIGIN           ← Band bio + facts
├── 03 // THE VOID COLLECTIVE  ← Members
├── 04 // DISCOGRAPHY
├── 05 // TOUR DATES
├── 06 // MEDIA
└── 07 // CONTACT
```

---

## Band Details

| Field   | Value                            |
|---------|----------------------------------|
| Name    | Voidance                         |
| Origin  | Cebu City, Philippines           |
| Formed  | 2026                             |
| Genre   | Progressive Metal · Djent        |
| Facebook | https://www.facebook.com/voidanceph |

---

## Editing Content

### Band info, members, albums, tour dates, socials, tracks
```
src/data/bandData.js
```
All content is centralised here. Edit this file — no component changes needed.

### Gallery (events & live)
```
src/data/galleryData.js
```
Add, remove, or reorder carousel items here.

---

## Adding Real Music Files

1. Drop your file into `public/music/` (e.g. `perihelion.mp3`)
2. Open `src/data/bandData.js` and set `audioSrc` on the matching track:

```js
audioSrc: '/music/perihelion.mp3',
```

The player auto-detects the file. If missing, it silently falls back to the
built-in Web Audio synth. See `public/music/README.md` for the full guide.

---

## Adding Gallery Photos & Videos

### Local photos
1. Drop images into `public/images/events/`
2. Add an entry to `src/data/galleryData.js`:

```js
{
  type:    'image',
  src:     '/images/events/gig-cebu.jpg',
  thumb:   '/images/events/gig-cebu.jpg',
  caption: 'Live at Cebu — 2026',
  event:   'Cebu Underground Fest',
},
```

### YouTube videos
```js
{
  type:    'video',
  videoId: 'YOUTUBE_ID_HERE',   // part after ?v= in the URL
  caption: 'Live at Cebu — Full Set',
  event:   'Cebu Underground Fest',
},
```

The carousel handles any number of mixed images and videos.
Filter tabs (All / Photos / Videos) and a thumbnail strip appear automatically.
See `public/images/events/README.md` for the full guide.

---

## Music Player

- Plays real audio files when `audioSrc` is set
- Falls back to procedural Web Audio synth when no file is provided
- Controls: play/pause, prev/next, seekable progress bar, volume, mute
- Playlist drawer with full tracklist
- Mini spectrum visualiser

---

## Activating Commented-Out Content

| What                       | Where                                        |
|----------------------------|----------------------------------------------|
| Email address              | `src/components/Contact.jsx`                 |
| Booking email              | `src/components/Contact.jsx`                 |
| Instagram / YouTube / etc. | `src/data/bandData.js` → set `active: true`  |
| Member individual socials  | `src/components/Members.jsx`                 |
| Management / label info    | `src/components/Footer.jsx`                  |

---

## Troubleshooting

**`npm install` fails**
- Confirm Node.js v18+: `node -v`
- Clear cache: `npm cache clean --force` then retry

**Port already in use**
- Vite auto-picks the next available port — check terminal for the URL

**Blank page or console errors**
- Open DevTools (`F12`) → Console tab
- Make sure `npm install` was run before `npm run dev`

**Fonts not loading**
- Google Fonts requires an internet connection
- The site falls back to system fonts if offline

**Vite version conflict**
- This project is pinned to Vite 7 (`^7.0.0`) in `package.json`
- Do not upgrade to Vite 8 — plugin compatibility is pending
