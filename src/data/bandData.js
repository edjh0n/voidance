// ── Band identity ──────────────────────────────────────────────
export const BAND = {
  name:    'VOIDANCE',
  tagline: 'Born from the collapse of dying stars',
  genre:   'Progressive Metal · Djent',
  origin:  'Cebu City, Philippines',
  formed:  2026,
  email:   null,    // e.g. 'signal@voidance.band'
  booking: null,    // e.g. 'booking@voidance.band'
}

// ── Members ─────────────────────────────────────────────────────
export const MEMBERS = [
  { initials: 'JG',  role: 'Vocals', name: 'Jayke Garganera',  socials: {} },
  { initials: 'RY',  role: 'Guitar', name: 'Rovalle Yraola',   socials: {} },
  { initials: 'EJB', role: 'Guitar', name: 'Ed Jan Baquero',   socials: {} },
  { initials: 'AB',  role: 'Bass',   name: 'Adrian Buquis',    socials: {} },
  { initials: 'ER',  role: 'Drums',  name: 'Elizier Roca',     socials: {} },
]

// ── Albums ──────────────────────────────────────────────────────
export const ALBUMS = [
  { id: 'a1', title: 'EVENT HORIZON',       year: '2019',          tracks: '9 Tracks · 54:22',  paletteIndex: 0, latest: false },
  { id: 'a2', title: 'DARK MATTER HYMNS',   year: '2021',          tracks: '11 Tracks · 63:08', paletteIndex: 1, latest: false },
  { id: 'a3', title: 'THE DYING FREQUENCY', year: '2024 · LATEST', tracks: '10 Tracks · 71:44', paletteIndex: 2, latest: true  },
]

// ── Tour dates ───────────────────────────────────────────────────
export const TOUR_DATES = [
  { date: 'MAY 14', year: '2025', venue: 'The Masquerade — Heaven Stage', location: 'Atlanta, Georgia · USA',      status: 'available' },
  { date: 'MAY 18', year: '2025', venue: 'Regent Theater',                location: 'Los Angeles, California · USA', status: 'limited'   },
  { date: 'MAY 22', year: '2025', venue: 'Cobalt',                        location: 'Vancouver, BC · Canada',      status: 'available' },
  { date: 'JUN 03', year: '2025', venue: 'Impericon Festival',            location: 'Leipzig · Germany',           status: 'sold-out'  },
  { date: 'JUN 08', year: '2025', venue: 'Koko',                          location: 'London · United Kingdom',     status: 'available' },
  { date: 'JUN 14', year: '2025', venue: 'Petit Bain',                    location: 'Paris · France',              status: 'limited'   },
]

// ── Social media links ───────────────────────────────────────────
export const SOCIALS = [
  { label: 'Facebook',    url: 'https://www.facebook.com/voidanceph', active: true  },
  { label: 'Instagram',   url: '#', active: false },
  { label: 'YouTube',     url: '#', active: false },
  { label: 'Spotify',     url: '#', active: false },
  { label: 'Apple Music', url: '#', active: false },
  { label: 'Bandcamp',    url: '#', active: false },
]

// ── Media videos ─────────────────────────────────────────────────
export const VIDEOS = [
  { id: 'vid1', title: 'PERIHELION — Official Video', meta: 'The Dying Frequency · 2024 · 7:32', hue: 200, featured: true  },
  { id: 'vid2', title: 'NEUTRON PSALMS (Live)',        meta: 'Wacken Open Air · 2024 · 9:14',    hue: 270, featured: false },
  { id: 'vid3', title: 'PARALLAX REQUIEM',             meta: 'Dark Matter Hymns · 2021 · 8:47',  hue: 180, featured: false },
]

// ── Tracks for music player ───────────────────────────────────────
// audioSrc: path to real audio file in public/music/
//   - Set to a string (e.g. '/music/perihelion.mp3') once you drop the file in public/music/
//   - Set to null to use the procedural Web Audio synth fallback
export const TRACKS = [
  {
    title:        'PERIHELION',
    album:        'The Dying Frequency · 2024',
    duration:     452,
    paletteIndex: 2,
    audioSrc:     null, // set to '/music/perihelion.mp3' when file is ready
    freq: [55, 82, 110], pad: [200, 300], type: 'djent',
  },
  {
    title:        'NEUTRON PSALMS',
    album:        'The Dying Frequency · 2024',
    duration:     554,
    paletteIndex: 2,
    audioSrc:     null, // '/music/neutron-psalms.mp3'
    freq: [41, 61, 82],  pad: [150, 250], type: 'doom',
  },
  {
    title:        'THE DYING FREQUENCY',
    album:        'The Dying Frequency · 2024',
    duration:     488,
    paletteIndex: 2,
    audioSrc:     null, // '/music/the-dying-frequency.mp3'
    freq: [65, 98, 130], pad: [220, 330], type: 'prog',
  },
  {
    title:        'PARALLAX REQUIEM',
    album:        'Dark Matter Hymns · 2021',
    duration:     527,
    paletteIndex: 1,
    audioSrc:     null, // '/music/parallax-requiem.mp3'
    freq: [46, 69, 92],  pad: [180, 270], type: 'djent',
  },
  {
    title:        'EVENT HORIZON',
    album:        'Event Horizon · 2019',
    duration:     389,
    paletteIndex: 0,
    audioSrc:     null, // '/music/event-horizon.mp3'
    freq: [36, 54, 72],  pad: [160, 240], type: 'doom',
  },
  {
    title:        'ACCRETION DISK',
    album:        'Dark Matter Hymns · 2021',
    duration:     476,
    paletteIndex: 1,
    audioSrc:     null, // '/music/accretion-disk.mp3'
    freq: [58, 87, 116], pad: [210, 315], type: 'prog',
  },
  {
    title:        'PULSAR DRIFT',
    album:        'Event Horizon · 2019',
    duration:     412,
    paletteIndex: 0,
    audioSrc:     null, // '/music/pulsar-drift.mp3'
    freq: [44, 66, 88],  pad: [170, 255], type: 'djent',
  },
]

// ── Album art palettes ───────────────────────────────────────────
export const ALBUM_PALETTES = [
  { center: 'rgba(8,20,50,0.9)',  edge: 'rgba(2,4,8,1)', ring: '0,180,220',  line: '0,212,255',  glow: '0,180,255'  },
  { center: 'rgba(40,5,30,0.9)',  edge: 'rgba(2,4,8,1)', ring: '180,20,80',  line: '200,30,60',  glow: '192,24,42'  },
  { center: 'rgba(5,30,25,0.9)',  edge: 'rgba(2,4,8,1)', ring: '0,200,120',  line: '20,220,150', glow: '0,210,130'  },
]
