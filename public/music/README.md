# VOIDANCE — Music Files

Drop your audio files into this folder.
Vite serves everything in `public/` as static assets, so files placed here
are accessible at the root URL with no import needed.

Example: `public/music/perihelion.mp3` → available in the browser at `/music/perihelion.mp3`

---

## Supported Formats

| Format | Extension | Notes                              |
|--------|-----------|------------------------------------|
| MP3    | .mp3      | Recommended — best browser support |
| WAV    | .wav      | Lossless, larger file size         |
| OGG    | .ogg      | Good for Firefox fallback           |
| FLAC   | .flac     | Lossless, limited browser support  |

---

## Naming Convention

Name each file to match the `audioSrc` field in `src/data/bandData.js`.
Use lowercase, hyphens instead of spaces.

| Track Title          | Expected Filename               |
|----------------------|---------------------------------|
| PERIHELION           | perihelion.mp3                  |
| NEUTRON PSALMS       | neutron-psalms.mp3              |
| THE DYING FREQUENCY  | the-dying-frequency.mp3         |
| PARALLAX REQUIEM     | parallax-requiem.mp3            |
| EVENT HORIZON        | event-horizon.mp3               |
| ACCRETION DISK       | accretion-disk.mp3              |
| PULSAR DRIFT         | pulsar-drift.mp3                |

---

## How It Works

- If a track has an `audioSrc` set in `bandData.js` AND the file exists here,
  the player uses the real audio file via `HTMLAudioElement`.
- If `audioSrc` is `null` or the file is missing, the player falls back
  to the procedural Web Audio API synth automatically.
- No code changes needed — just drop the file in and set the path in `bandData.js`.

---

## Adding a New Track

1. Copy your audio file here (e.g. `my-new-song.mp3`)
2. Open `src/data/bandData.js`
3. Add a new entry to the `TRACKS` array with `audioSrc: '/music/my-new-song.mp3'`
4. Done — the player picks it up instantly on next save.
