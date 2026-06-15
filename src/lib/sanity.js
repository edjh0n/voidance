import { createClient } from '@sanity/client'
import imageUrlBuilder  from '@sanity/image-url'

export const client = createClient({
  projectId: 'zx2gw68l',
  dataset:   'production',
  apiVersion: '2024-01-01',
  useCdn:    true,
})

export const freshClient = client.withConfig({ useCdn: false })

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

// ── GROQ queries ─────────────────────────────────────────────────

export const QUERIES = {
  gallery: `*[_type == "galleryItem"] | order(_createdAt desc) {
    _id, type, caption, event, videoId, photo,
    "imageUrl": photo.asset->url,
    "thumbUrl": photo.asset->url
  }`,

  mediaVideos: `*[_type == "mediaVideo"] | order(_createdAt desc) {
    _id, title, meta, youtubeId, featured, hue
  }`,

  tracks: `*[_type == "track"] | order(_createdAt desc) {
    _id, title, album, duration, type, paletteIndex,
    "audioSrc": audioFile.asset->url
  }`,

  tourDates: `*[_type == "tourDate"] | order(_createdAt desc) {
    _id, date, year, venue, location, status
  }`,

  merchProducts: `*[_type == "merchProduct" && active == true] | order(sortOrder asc, _createdAt desc) {
    _id, name, sub, description, category, price, sizes, badge, stock, art, sortOrder, image,
    "imageUrl": image.asset->url
  }`,

  merchSettings: `coalesce(*[_id == "merchSettings-main"][0], *[_type == "merchSettings"] | order(_updatedAt desc)[0]) {
    _id, mode, comingSoonTitle, comingSoonMessage
  }`,

  originPage: `*[_type == "originPage"] | order(_updatedAt desc)[0] {
    _id, title, paragraphs, facts, timeline
  }`,

  bandMembers: `*[_type == "bandMember" && active == true] | order(sortOrder asc, _createdAt asc) {
    _id, initials, role, name, instrument, quote
  }`,

  discographyRelease: `*[_type == "discographyRelease" && featured == true] | order(sortOrder asc, _createdAt desc)[0] {
    _id, title, year, tags, paletteIndex, tracks, noteLabel, note
  }`,

  siteAnnouncement: `*[_type == "siteAnnouncement" && (active == true || announcementType in ["gig", "single", "album", "merch"])] | order(sortOrder asc, _updatedAt desc) {
    _id, active, announcementType, title, message, ctaLabel, ctaType, ctaPage, ctaUrl, tone,
    eventDate, releaseDate, autoShowDaysBefore, priority, expiresAt
  }`,
}
