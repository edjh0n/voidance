// ─────────────────────────────────────────────────────────────────
//  galleryData.js — FALLBACK gallery content
// ─────────────────────────────────────────────────────────────────
//  Primary gallery content is managed in Sanity CMS →
//  https://voidance-studio.vercel.app  (Gallery Item documents)
//
//  The list below is used ONLY as an offline fallback if Sanity
//  returns nothing.
//
//  type: 'image' → local photo from public/images/events/
//  type: 'video' → YouTube embed (videoId = part after ?v= in URL)
// ─────────────────────────────────────────────────────────────────
export const GALLERY = [
  {
    type:    'image',
    src:     '/images/events/gig-2026-04-18.jpg',
    thumb:   '/images/events/gig-2026-04-18.jpg',
    caption: 'Live at Roadhouse Rock & Dine — April 18, 2026',
    event:   'Pitalo Noise',
  },
  { type: 'video', videoId: 'KZ0QZHibRqA', caption: 'Voidance - Rapture',              event: 'Live @ Roadhouse Rock & Dine' },
  { type: 'video', videoId: 'rNYLZIXmIOs', caption: 'Voidance - Proliferate',          event: "Live @ Quady's Bar" },
  { type: 'video', videoId: 'BEWQtq5pM6o', caption: 'Voidance - Rapture',              event: "Live @ Quady's Bar" },
  { type: 'video', videoId: 'wWaAujU_mG0', caption: 'Voidance - The Great Boundaries', event: "Live @ Quady's Bar" },
  { type: 'video', videoId: '4uwZf6B4Z84', caption: 'Voidance - Rain',                 event: "Live @ Quady's Bar" },
]
