# VOIDANCE — React Website

Progressive Metal / Djent band website built with **React 18 + Vite 5**.

---

## Requirements

Before running this project, make sure you have these installed on your machine:

| Tool    | Minimum Version | Check Command       | Download                        |
|---------|-----------------|---------------------|---------------------------------|
| Node.js | v18 or higher   | `node -v`           | https://nodejs.org              |
| npm     | v9 or higher    | `npm -v`            | Comes with Node.js              |

---

## First-Time Setup

You only need to do this **once** after cloning or extracting the project.

**1. Open a terminal and navigate to the project folder:**

```bash
cd C:\Users\ebaquero\voidance-react
```

**2. Install dependencies:**

```bash
npm install
```

This creates a `node_modules/` folder with all required packages.
It may take 30–60 seconds the first time.

---

## Running the Development Server

```bash
cd C:\Users\ebaquero\voidance-react
npm run dev
```

Then open your browser and go to:

```
http://localhost:5173
```

> If port 5173 is already in use, Vite will automatically try 5174, 5175, etc.
> The exact URL is always shown in the terminal output.

**To stop the server:** press `Ctrl + C` in the terminal.

---

## Building for Production

When the site is ready to deploy, run:

```bash
npm run build
```

This creates an optimised `dist/` folder with static files ready for any web host
(Netlify, Vercel, GitHub Pages, cPanel, etc.).

To preview the production build locally before deploying:

```bash
npm run preview
```

---

## Available Commands

| Command             | What it does                                          |
|---------------------|-------------------------------------------------------|
| `npm install`       | Install / restore all dependencies                    |
| `npm run dev`       | Start local development server with hot reload        |
| `npm run build`     | Build optimised production files into `dist/`         |
| `npm run preview`   | Preview the production build at localhost:4173        |

---

## Project Structure

```
voidance-react/
├── index.html                 ← HTML entry point + Google Fonts
├── vite.config.js             ← Vite configuration
├── package.json               ← Project info and scripts
├── public/
│   └── music/                 ← Drop .mp3 / .wav files here
│       └── README.md          ← Music file naming guide
└── src/
    ├── main.jsx               ← React app entry point
    ├── App.jsx                ← Root component (assembles all sections)
    ├── styles/
    │   └── index.css          ← All styles, animations, responsive rules
    ├── data/
    │   └── bandData.js        ← All content: members, albums, tours, tracks, socials
    ├── utils/
    │   ├── canvasArt.js       ← Album art + video thumbnail generators
    │   └── audioEngine.js     ← Web Audio synth + real audio file support
    ├── hooks/
    │   ├── useAudioPlayer.js  ← Music player state management
    │   └── useScrollReveal.js ← Scroll-reveal animation hook
    └── components/
        ├── Starfield.jsx      ← Animated canvas background
        ├── Nav.jsx            ← Navigation + mobile hamburger menu
        ├── Hero.jsx           ← Hero / landing section
        ├── About.jsx          ← Band origin and facts
        ├── Members.jsx        ← Band member cards
        ├── Discography.jsx    ← Album grid with generated artwork
        ├── Tour.jsx           ← Tour dates list
        ├── Media.jsx          ← Video thumbnails
        ├── Contact.jsx        ← Social links and contact info
        ├── Footer.jsx         ← Footer
        └── MusicPlayer.jsx    ← Sticky bottom music player
```

---

## Editing Content

All band information lives in **one file**:

```
src/data/bandData.js
```

Edit this file to update members, albums, tour dates, social links, and tracks.
No need to touch any component files for content changes.

---

## Adding Real Music Files

1. Copy your `.mp3` or `.wav` file into `public/music/`
   - Example: `public/music/perihelion.mp3`

2. Open `src/data/bandData.js` and update the matching track's `audioSrc`:

```js
// Before
audioSrc: null,

// After
audioSrc: '/music/perihelion.mp3',
```

3. Save the file — the player switches to real audio automatically.
   If the file is missing or can't play, it falls back to the synth.

See `public/music/README.md` for the full naming guide.

---

## Uncomment When Ready

These sections are commented out in the code until you have the info:

| What                        | Where to uncomment                          |
|-----------------------------|---------------------------------------------|
| Email address               | `src/components/Contact.jsx`                |
| Booking email               | `src/components/Contact.jsx`                |
| Instagram / YouTube / etc.  | `src/data/bandData.js` → set `active: true` |
| Member Instagram links      | `src/components/Members.jsx`                |
| Management / label info     | `src/components/Footer.jsx`                 |

---

## Troubleshooting

**`npm install` fails or is slow**
- Make sure Node.js v18+ is installed: `node -v`
- Try clearing the npm cache: `npm cache clean --force` then `npm install` again

**Port already in use**
- Vite automatically picks the next available port (5174, 5175, etc.)
- Or kill the process using that port and re-run `npm run dev`

**Page is blank / errors in browser**
- Open browser DevTools (`F12`) → Console tab for error details
- Make sure you ran `npm install` before `npm run dev`

**Fonts not loading**
- You need an internet connection for Google Fonts to load
- The site still works without them — it will fall back to system fonts
