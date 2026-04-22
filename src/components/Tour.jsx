import { TOUR_DATES } from '../data/bandData'

const STATUS_LABELS = {
  available: 'Tickets Available',
  limited:   'Few Left',
  'sold-out': 'Sold Out',
}

function TourItem({ item }) {
  return (
    <div className="tour-item">
      <div className="tour-date">
        {item.date}<span>{item.year}</span>
      </div>
      <div className="tour-venue">
        <h4>{item.venue}</h4>
        <p>{item.location}</p>
      </div>
      <div className="tour-status">
        <span className={`status-badge ${item.status}`}>
          {STATUS_LABELS[item.status]}
        </span>
      </div>
    </div>
  )
}

export default function Tour() {
  return (
    <section id="tour">
      <div className="container">
        <div className="section-header">
          <span className="section-num">05 //</span>
          <h2 className="section-title">TOUR DATES</h2>
          <div className="section-line" />
        </div>
        <div className="tour-list">
          {TOUR_DATES.map((item, i) => <TourItem key={i} item={item} />)}
        </div>
      </div>
    </section>
  )
}
