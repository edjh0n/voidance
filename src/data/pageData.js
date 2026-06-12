import { BAND, MEMBERS, TIMELINE, TRACKS } from './bandData'

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

export const DISCOGRAPHY_RELEASE = {
  title: 'DEMO EP',
  year: '2026',
  tags: ['3 Tracks', '2026', 'Progressive Metal / Djent'],
  paletteIndex: 2,
  tracks: TRACKS.map(({ title, type, duration }) => ({ title, type, duration })),
  noteLabel: '// NEXT',
  note: "Debut album is in the works. Heavier, longer, and stranger than what you've heard. No timeline yet - it's done when it's done.",
}
