import { MEMBERS as FALLBACK_MEMBERS, TOUR_DATES as FALLBACK_TOUR_DATES, TRACKS as FALLBACK_TRACKS } from '../data/bandData'
import { useSanityQuery, QUERIES } from '../hooks/useSanity'
import { getPastShowsCount } from '../utils/tourDates'

export default function Hero({ onNavigate }) {
  const { data: members } = useSanityQuery(QUERIES.bandMembers, FALLBACK_MEMBERS)
  const { data: tracks } = useSanityQuery(QUERIES.tracks, FALLBACK_TRACKS)
  const { data: tourDates } = useSanityQuery(QUERIES.tourDates, FALLBACK_TOUR_DATES)

  const stats = [
    { value: String(members.length), label: 'Members' },
    { value: String(tracks.length), label: 'Tracks' },
    { value: String(getPastShowsCount(tourDates)), label: 'Shows Played' },
  ]

  return (
    <>
      <section id="hero">
        <div className="hero-eclipse" aria-hidden="true">
          <img src="/brand/voidance-hero.svg" alt="" />
        </div>

        <div className="hero-content">
          <p className="hero-tag">// Progressive Metal / Experimental &middot; Cebu City, Philippines</p>
          <div className="hero-divider" />
          <p className="tagline">Born from the collapse of dying stars</p>
          <div className="hero-cta">
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('discography')}>Listen Now</button>
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('tour')}>Tour Dates</button>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="hero-stats" aria-label="Band stats">
        {stats.map(stat => (
          <div className="hero-stat" key={stat.label}>
            <span className="hero-stat-val">{stat.value}</span>
            <span className="hero-stat-lbl">{stat.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
