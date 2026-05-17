// ── Gallery — Events & Live ───────────────────────────────────────
// type: 'image'       → local photo from public/images/events/
// type: 'video'       → YouTube embed (supply videoId only)
// type: 'placeholder' → shown when no real content yet
//
// The carousel handles unlimited items of any mix.
// Filter tabs (All / Photos / Videos) appear automatically.
// Thumbnail strip appears automatically when there are 6+ items.
//
// To add real photos: drop images into public/images/events/
// then update src/thumb. See public/images/events/README.md for details.
// To add YouTube videos: paste the video ID from the URL (the part after ?v=)
export const GALLERY = [

  // ── Photos (replace placeholders with real event photos) ──────────
  {
    type:    'placeholder',
    caption: 'First gig photo',
    event:   '',
    // Replace with real photo:
    type:    'image',
    src:     '/images/events/gig-2026-04-18.jpg',
    thumb:   '/images/events/gig-2026-04-18.jpg',
    caption: 'Live at Roadhouse Rock & Dine — April 18, 2026',
    event:   'Pitalo Noise',
  },
  {
    type:    'placeholder',
    caption: 'Second gig photo',
    event:   'Mosh with the Underground',
    // Replace with real photo:
    type:    'image',
    src:     '/images/events/gig-2026-05-16.jpg',
    thumb:   '/images/events/gig-2026-05-16.jpg',
    caption: 'Live at Quady\'s Bar — May 16, 2026',
    event:   'Replica Music Production',
  },
  // {
  //   type:    'placeholder',
  //   caption: 'Soundcheck — coming soon',
  //   event:   '',
  //   // type: 'image', src: '/images/events/soundcheck.jpg', thumb: '/images/events/soundcheck.jpg',
  //   // caption: 'Soundcheck — [Venue]', event: '[Event]',
  // },
  // {
  //   type:    'placeholder',
  //   caption: 'Behind the scenes — coming soon',
  //   event:   '',
  //   // type: 'image', src: '/images/events/bts.jpg', thumb: '/images/events/bts.jpg',
  //   // caption: 'Behind the scenes', event: '',
  // },
  // {
  //   type:    'placeholder',
  //   caption: 'On stage — coming soon',
  //   event:   '',
  // },
  // {
  //   type:    'placeholder',
  //   caption: 'After show — coming soon',
  //   event:   '',
  // },

  // ── Videos (replace videoId with your actual YouTube video IDs) ───
  {
    type:    'video',
    videoId: 'KZ0QZHibRqA', // ← replace with your real YouTube video ID
    caption: 'Voidance - Rapture',
    event:   'Live @ Roadhouse Rock & Dine',
  },
  {
    type:    'video',
    videoId: 'rNYLZIXmIOs', // ← replace with your real YouTube video ID
    caption: 'Voidance - Proliferate',
    event:   'Live @ Quady\'s Bar',
  },
  {
    type:    'video',
    videoId: 'BEWQtq5pM6o', // ← replace with your real YouTube video ID
    caption: 'Voidance - Rapture',
    event:   'Live @ Quady\'s Bar',
  },
  {
    type:    'video',
    videoId: 'wWaAujU_mG0', // ← replace with your real YouTube video ID
    caption: 'Voidance - The Great Boundaries',
    event:   'Live @ Quady\'s Bar',
  },
  {
    type:    'video',
    videoId: '4uwZf6B4Z84', // ← replace with your real YouTube video ID
    caption: 'Voidance - Rain',
    event:   'Live @ Quady\'s Bar',
  },
  // {
  //   type:    'video',
  //   videoId: 'dQw4w9WgXcQ', // ← replace with your real YouTube video ID
  //   caption: 'Studio Session — replace videoId with your YouTube ID',
  //   event:   'Studio',
  // },
]
