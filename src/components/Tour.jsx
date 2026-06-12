import { SOCIALS, TOUR_DATES as FALLBACK_TOUR_DATES } from '../data/bandData'
import { useSanityQuery, QUERIES } from '../hooks/useSanity'
import { getNextShow, getPastShowsCount } from '../utils/tourDates'

const STATUS_LABELS = {
  upcoming: 'Upcoming',
  available: 'Tickets Available',
  'free-entry': 'Free Entry',
  limited: 'Few Left',
  'sold-out': 'Sold Out',
  done: 'Done',
  cancelled: 'Cancelled',
}

function getTourStats(tourDates) {
  const playedCount = getPastShowsCount(tourDates)
  const soldOutCount = tourDates.filter(item => item.status === 'sold-out').length
  const nextShow = getNextShow(tourDates)

  return [
    { value: String(playedCount), label: 'Shows Played' },
    { value: String(soldOutCount), label: 'Sold Out' },
    { value: nextShow?.date || 'TBA', label: 'Next Show' },
  ]
}

function TourItem({ item, muted }) {
  return (
    <div className={`tour-item${muted ? ' tour-item--muted' : ''}`}>
      <div className="tour-date">
        {item.date}<span>{item.year}</span>
      </div>
      <div className="tour-venue">
        <h4>{item.venue}</h4>
        <p>{item.location}</p>
      </div>
      <div className="tour-status">
        <span className={`status-badge ${item.status}`}>
          {STATUS_LABELS[item.status] || item.status}
        </span>
      </div>
    </div>
  )
}

export default function Tour() {
  const { data: sanityDates, loading } = useSanityQuery(QUERIES.tourDates, [])
  const tourDates = !loading && sanityDates.length > 0 ? sanityDates : FALLBACK_TOUR_DATES
  const tourStats = getTourStats(tourDates)
  const facebook = SOCIALS.find(s => s.label === 'Facebook')
  const youtube = SOCIALS.find(s => s.label === 'YouTube')

  return (
    <section id="tour">
      <div className="container">
        <div className="section-header">
          <span className="section-num">05 //</span>
          <h2 className="section-title">TOUR DATES</h2>
          <div className="section-line" />
        </div>

        <div className="tour-stats-row">
          {tourStats.map(stat => (
            <div className="tour-stat" key={stat.label}>
              <span className="tour-stat-val">{stat.value}</span>
              <span className="tour-stat-lbl">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="tour-list">
          {tourDates.map((item, i) => <TourItem key={`${item.venue}-${i}`} item={item} />)}
          <TourItem
            muted
            item={{
              date: 'TBA',
              year: '2026',
              venue: 'Next Venue - To Be Announced',
              location: 'Cebu City, Philippines',
              status: 'upcoming',
            }}
          />
        </div>

        <div className="tour-upcoming-note">
          <span>// UPDATES</span>
          <p>Next show details are coming. Follow us on <strong>Facebook</strong> and <strong>YouTube</strong> to be the first to know.</p>
        </div>

        <div className="tour-social-row">
          {facebook?.active && <a className="soc-btn" href={facebook.url} target="_blank" rel="noopener noreferrer">Facebook</a>}
          {youtube?.active && <a className="soc-btn" href={youtube.url} target="_blank" rel="noopener noreferrer">YouTube</a>}
        </div>
      </div>
    </section>
  )
}
