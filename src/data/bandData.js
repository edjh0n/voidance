// ── Band identity ──────────────────────────────────────────────
export const BAND = {
  name:    'VOIDANCE',
  tagline: 'Born from the collapse of dying stars',
  genre:   'Progressive Metal',
  origin:  'Cebu City, Philippines',
  formed:  2026,
  email:   null,    // e.g. 'signal@voidance.band'
  booking: null,    // e.g. 'booking@voidance.band'
}

// ── Members ─────────────────────────────────────────────────────
export const MEMBERS = [
  { initials: 'JG',  role: 'Vocals', name: 'Jayke Garganera',  socials: {} },
  { initials: 'RY',  role: 'Guitar', name: 'Rovalle Yraola',   socials: {} },
  { initials: 'EB',  role: 'Guitar', name: 'Erik Bombeza',     socials: {} },
  { initials: 'EJB', role: 'Guitar', name: 'Ed Jan Baquero',   socials: {} },
  { initials: 'AB',  role: 'Bass',   name: 'Adrian Buquis',    socials: {} },
  { initials: 'ER',  role: 'Drums',  name: 'Elizier Roca',     socials: {} },
]

// ── Albums ──────────────────────────────────────────────────────
export const ALBUMS = [
  { id: 'a1', title: 'COMING SOON',       year: 'TBH',          tracks: 'N/A',  paletteIndex: 0, latest: false },
  // { id: 'a2', title: 'DARK MATTER HYMNS',   year: '2021',          tracks: '11 Tracks · 63:08', paletteIndex: 1, latest: false },
  // { id: 'a3', title: 'THE DYING FREQUENCY', year: '2024 · LATEST', tracks: '10 Tracks · 71:44', paletteIndex: 2, latest: true  },
]

// ── Tour dates ───────────────────────────────────────────────────
export const TOUR_DATES = [
  { date: 'APRIL 18', year: '2026', venue: 'Roadhouse Rock & Dine', location: 'San Fernando, Cebu, Philippines',       status: 'sold-out' },
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
// youtubeId: the ID from the YouTube URL → youtube.com/watch?v=THIS_PART
//            Set to null to show a placeholder thumbnail until you have a real video.
// featured:  true  = large slot on the left
//            false = small slot on the right sidebar (max 2)
export const VIDEOS = [
  {
    id:        'vid1',
    title:     'PERIHELION — Official Video',
    meta:      'The Dying Frequency · 2024 · 7:32',
    hue:       200,
    featured:  true,
    youtubeId: null, // e.g. 'dQw4w9WgXcQ'
  },
  {
    id:        'vid2',
    title:     'NEUTRON PSALMS (Live)',
    meta:      'Wacken Open Air · 2024 · 9:14',
    hue:       270,
    featured:  false,
    youtubeId: null, // e.g. 'dQw4w9WgXcQ'
  },
  {
    id:        'vid3',
    title:     'PARALLAX REQUIEM',
    meta:      'Dark Matter Hymns · 2021 · 8:47',
    hue:       180,
    featured:  false,
    youtubeId: null, // e.g. 'dQw4w9WgXcQ'
  },
]

// ── Gallery — Events & Live ───────────────────────────────────────
// type: 'image'       → local photo from public/images/events/
// type: 'video'       → YouTube embed (supply videoId only)
// type: 'placeholder' → shown when no real content yet
//
// To add real content: drop image files into public/images/events/
// then update src/thumb below, or paste the YouTube video ID.
// See public/images/events/README.md for full instructions.
export const GALLERY = [
  {
    type:    'placeholder',
    caption: 'Event photos coming soon...',
    event:   '',
    // When ready, replace with:
    // type: 'image',
    // src:  '/images/events/your-photo.jpg',
    // thumb: '/images/events/your-photo.jpg',
    // caption: 'Live at [Venue] — [Date]',
    // event: '[Event Name]',
  },
  {
    type:    'placeholder',
    caption: 'More photos on the way...',
    event:   '',
  },
  {
    type:    'placeholder',
    caption: 'Video content loading...',
    event:   '',
    // When ready, replace with:
    // type: 'video',
    // videoId: 'YOUTUBE_VIDEO_ID_HERE',
    // caption: 'Live at [Venue] — Official Recording',
    // event: '[Event Name]',
  },
]
// ── Album art palettes ───────────────────────────────────────────
export const ALBUM_PALETTES = [
  { center: 'rgba(8,20,50,0.9)',  edge: 'rgba(2,4,8,1)', ring: '0,180,220',  line: '0,212,255',  glow: '0,180,255'  },
  { center: 'rgba(40,5,30,0.9)',  edge: 'rgba(2,4,8,1)', ring: '180,20,80',  line: '200,30,60',  glow: '192,24,42'  },
  { center: 'rgba(5,30,25,0.9)',  edge: 'rgba(2,4,8,1)', ring: '0,200,120',  line: '20,220,150', glow: '0,210,130'  },
]

// ── Tracks for music player ───────────────────────────────────────
export const TRACKS = [
  { title: 'CONTRITE',              album: 'N/A · 2026', duration: 452, paletteIndex: 2, audioSrc: '/music/contrite.mp3', freq: [55,82,110], pad: [200,300], type: 'progressive metal' },
  { title: 'RAPTURE',               album: 'N/A · 2026', duration: 554, paletteIndex: 2, audioSrc: '/music/rapture.mp3', freq: [41,61,82],  pad: [150,250], type: 'djent'  },
  { title: 'THE GREAT BOUNDARIES',  album: 'N/A · 2026', duration: 488, paletteIndex: 2, audioSrc: '/music/the-great-boundaries.mp3', freq: [65,98,130], pad: [220,330], type: 'djent'  },
]
