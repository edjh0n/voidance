import { MERCH_PRODUCTS } from '../data/merchData'
import { TOUR_DATES as FALLBACK_TOUR_DATES } from '../data/bandData'
import { useSanityQuery, QUERIES } from '../hooks/useSanity'
import { parseTourDate } from '../utils/tourDates'

const SITE_URL = 'https://www.voidanze.com/'

function parsePrice(price = '') {
  const amount = String(price).replace(/[^\d.]/g, '')
  return amount || undefined
}

function toIsoDate(item) {
  const parsed = parseTourDate(item)
  if (!parsed) return undefined
  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function StructuredData() {
  const { data: merchProducts } = useSanityQuery(QUERIES.merchProducts, MERCH_PRODUCTS)
  const { data: tourDates } = useSanityQuery(QUERIES.tourDates, FALLBACK_TOUR_DATES)

  const products = merchProducts
    .filter(product => product.stock !== 0)
    .slice(0, 12)
    .map(product => ({
      '@type': 'Product',
      name: product.name,
      description: product.description || product.sub,
      image: product.imageUrl,
      brand: {
        '@type': 'Brand',
        name: 'VOIDANCE',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PHP',
        price: parsePrice(product.price),
        availability: product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: `${SITE_URL}#merch`,
      },
    }))

  const events = tourDates
    .map(item => ({
      '@type': 'MusicEvent',
      name: `VOIDANCE at ${item.venue}`,
      startDate: toIsoDate(item),
      eventStatus: item.status === 'cancelled'
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: item.venue,
        address: item.location,
      },
      performer: {
        '@type': 'MusicGroup',
        name: 'VOIDANCE',
      },
      url: `${SITE_URL}#tour`,
    }))
    .filter(event => event.startDate)

  const graph = [...products, ...events]
  if (!graph.length) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  )
}
