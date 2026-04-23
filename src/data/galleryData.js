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
    caption: 'First gig photo — coming soon',
    event:   '',
    // Replace with real photo:
    type:    'image',
    src:     '/images/events/gig-2026-04-18.jpg',
    thumb:   '/images/events/gig-2026-04-18.jpg',
    caption: 'Live at Roadhouse Rock & Dine — April 18, 2026',
    event:   'Pitalo Noise',
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
    videoId: 'x-5z-q_tQcQ', // ← replace with your real YouTube video ID
    caption: 'Voidace - Proliferate',
    event:   'Official Video Lyrics',
  },
  // {
  //   type:    'video',
  //   videoId: 'dQw4w9WgXcQ', // ← replace with your real YouTube video ID
  //   caption: 'Studio Session — replace videoId with your YouTube ID',
  //   event:   'Studio',
  // },
]
