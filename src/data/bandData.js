// ─────────────────────────────────────────────────────────────────
//  bandData.js — FALLBACK content + static config
// ─────────────────────────────────────────────────────────────────
//  Primary content (gallery, media videos, tracks, tour dates) is
//  managed in Sanity CMS → https://voidance-studio.vercel.app
//
//  The values below are used ONLY as an offline fallback if Sanity
//  returns nothing. Band identity, members, albums, socials and the
//  album-art palettes are static config and always read from here.
// ─────────────────────────────────────────────────────────────────

// ── Band identity (static) ──────────────────────────────────────
export const BAND = {
  name:    'VOIDANCE',
  tagline: 'Born from the collapse of dying stars',
  genre:   'Progressive Metal',
  origin:  'Cebu City, Philippines',
  formed:  2026,
  email:   null,
  booking: null,
}

// ── Members (static) ────────────────────────────────────────────
export const MEMBERS = [
  { initials: 'MBA', role: 'Vocals', name: 'Mort Brian Apostol', instrument: 'Lead Vocals', quote: 'The voice that carries the void.', socials: {} },
  { initials: 'RY',  role: 'Guitar', name: 'Rovalle Yraola',     instrument: 'Lead Guitar', quote: 'Every riff is a controlled collapse.', socials: {} },
  { initials: 'EB',  role: 'Guitar', name: 'Erik Bombeza',       instrument: 'Rhythm Guitar', quote: 'Texture is everything.', socials: {} },
  { initials: 'EJB', role: 'Guitar', name: 'Ed Jan Baquero',     instrument: 'Guitar', quote: 'Three guitars, one sound.', socials: {} },
  { initials: 'AB',  role: 'Bass',   name: 'Adrian Buquis',      instrument: 'Bass Guitar', quote: 'The low end is where it lives.', socials: {} },
  { initials: 'ER',  role: 'Drums',  name: 'Elizier Roca',       instrument: 'Drums & Percussion', quote: 'Precision is the only language.', socials: {} },
]

// ── Albums (static) ─────────────────────────────────────────────
export const ALBUMS = [
  { id: 'a1', title: 'COMING SOON', year: 'TBH', tracks: 'N/A', paletteIndex: 0, latest: false },
]

// ── Social media links (static) ─────────────────────────────────
export const SOCIALS = [
  { label: 'Facebook',    url: 'https://www.facebook.com/voidanceph', active: true  },
  { label: 'Instagram',   url: '#', active: false },
  { label: 'YouTube',     url: 'https://www.youtube.com/@voidanceph', active: true },
  { label: 'Spotify',     url: '#', active: false },
  { label: 'Apple Music', url: '#', active: false },
  { label: 'Bandcamp',    url: '#', active: false },
]

export const HERO_STATS = [
  { value: '6', label: 'Members' },
  { value: '3', label: 'Tracks' },
  { value: '2', label: 'Shows Played' },
]

export const TIMELINE = [
  { year: 'EARLY 2026', text: 'Band forms. First rehearsals begin in Cebu City.' },
  { year: 'MARCH 2026', text: 'CONTRITE recorded. First demo EP takes shape.' },
  { year: 'APRIL 18, 2026', text: 'Debut live show - Roadhouse Rock & Dine, San Fernando. Sold out.' },
  { year: 'MAY 16, 2026', text: "Second show - Quady's Bar, Cebu City. Sold out again." },
  { year: 'COMING SOON', text: 'Debut album in the works. More shows announced soon.', muted: true },
]

export const ORIGIN_PAGE = {
  title: 'ORIGIN',
  paragraphs: [
    'Formed in Cebu City, Philippines in 2026, VOIDANCE emerged from a shared obsession with progressive metal - music that does not just play but collapses inward on itself, dragging the listener into the dark.',
    "Six musicians who had orbited each other's circles for years finally converged in early 2026. What started as late-night jams quickly became something heavier, stranger, and more deliberate.",
    'The name says it all: the act of becoming void - emptying everything unnecessary until only the essential heaviness remains.',
  ],
  facts: [
    { label: 'Genre', value: BAND.genre },
    { label: 'Origin', value: 'Cebu City, PH' },
    { label: 'Formed', value: String(BAND.formed) },
    { label: 'Members', value: String(MEMBERS.length) },
  ],
  timeline: TIMELINE,
}

// ── Album art colour palettes (static — used by canvas art) ─────
export const ALBUM_PALETTES = [
  { center: 'rgba(8,20,50,0.9)',  edge: 'rgba(2,4,8,1)', ring: '0,180,220',  line: '0,212,255',  glow: '0,180,255'  },
  { center: 'rgba(40,5,30,0.9)',  edge: 'rgba(2,4,8,1)', ring: '180,20,80',  line: '200,30,60',  glow: '192,24,42'  },
  { center: 'rgba(5,30,25,0.9)',  edge: 'rgba(2,4,8,1)', ring: '0,200,120',  line: '20,220,150', glow: '0,210,130'  },
]

// ── Tour dates (FALLBACK — managed in Sanity) ───────────────────
export const TOUR_DATES = [
  { date: 'MAY 16',   year: '2026', venue: "Quady's Bar",           location: 'Cebu City, Cebu, Philippines',    status: 'sold-out' },
  { date: 'APRIL 18', year: '2026', venue: 'Roadhouse Rock & Dine', location: 'San Fernando, Cebu, Philippines', status: 'sold-out' },
]

// ── Media videos (FALLBACK — managed in Sanity) ─────────────────
export const VIDEOS = []

// ── Tracks (FALLBACK — managed in Sanity) ───────────────────────
export const TRACKS = [
  { title: 'CONTRITE',             album: 'N/A · 2026', duration: 269, paletteIndex: 2, audioSrc: '/music/contrite.mp3',             freq: [55,82,110], pad: [200,300], type: 'progressive metal' },
  { title: 'RAPTURE',              album: 'N/A · 2026', duration: 281, paletteIndex: 2, audioSrc: '/music/rapture.mp3',              freq: [41,61,82],  pad: [150,250], type: 'djent' },
  { title: 'THE GREAT BOUNDARIES', album: 'N/A · 2026', duration: 307, paletteIndex: 2, audioSrc: '/music/the-great-boundaries.mp3', freq: [65,98,130], pad: [220,330], type: 'djent' },
]
