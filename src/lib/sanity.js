import { createClient } from '@sanity/client'
import imageUrlBuilder  from '@sanity/image-url'

export const client = createClient({
  projectId: 'zx2gw68l',
  dataset:   'production',
  apiVersion: '2024-01-01',
  useCdn:    true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

// ── GROQ queries ─────────────────────────────────────────────────

export const QUERIES = {
  gallery: `*[_type == "galleryItem"] | order(order asc) {
    _id, type, caption, event, videoId,
    "imageUrl": photo.asset->url,
    "thumbUrl": photo.asset->url
  }`,

  mediaVideos: `*[_type == "mediaVideo"] | order(order asc) {
    _id, title, meta, youtubeId, featured, hue
  }`,

  tracks: `*[_type == "track"] | order(order asc) {
    _id, title, album, duration, type, paletteIndex,
    "audioSrc": audioFile.asset->url
  }`,

  tourDates: `*[_type == "tourDate"] | order(order asc) {
    _id, date, year, venue, location, status
  }`,
}
