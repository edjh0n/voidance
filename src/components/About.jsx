import { ORIGIN_PAGE } from '../data/pageData'
import { useSanityQuery, QUERIES } from '../hooks/useSanity'

export default function About() {
  const { data: page } = useSanityQuery(QUERIES.originPage, ORIGIN_PAGE)
  const paragraphs = page.paragraphs?.length ? page.paragraphs : ORIGIN_PAGE.paragraphs
  const facts = page.facts?.length ? page.facts : ORIGIN_PAGE.facts
  const timeline = page.timeline?.length ? page.timeline : ORIGIN_PAGE.timeline

  return (
    <section id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-num">02 //</span>
          <h2 className="section-title">{page.title || ORIGIN_PAGE.title}</h2>
          <div className="section-line" />
        </div>
        <div className="about-grid">
          <div className="about-visual">
            <div className="planet-ring">
              <div className="planet-core" />
              <div className="orbit-ring" />
            </div>
          </div>
          <div className="about-text">
            {paragraphs.map(text => <p key={text}>{text}</p>)}
            <div className="band-facts">
              {facts.map(f => (
                <div className="fact-item" key={f.label}>
                  <span className="fact-label">{f.label}</span>
                  <span className="fact-value">{f.value}</span>
                </div>
              ))}
            </div>
            <div className="timeline">
              {timeline.map(item => (
                <div className={`timeline-item${item.muted ? ' timeline-item--muted' : ''}`} key={item.year}>
                  <span className="timeline-dot" />
                  <span className="timeline-year">{item.year}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
