import { BAND } from '../data/bandData'

const FACTS = [
  { label: 'Origin', value: BAND.origin  },
  { label: 'Formed', value: BAND.formed  },
  { label: 'Genre',  value: BAND.genre   },
]

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-num">01 //</span>
          <h2 className="section-title">ORIGIN</h2>
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
            <p>
              Emerging from the underground depths of{' '}
              <strong>{BAND.origin}</strong>, Voidance channels the crushing
              weight of the cosmos into polyrhythmic devastation. Formed in{' '}
              <strong>{BAND.formed}</strong>, five architects of sound unified
              by a singular obsession: the frequencies that exist beyond human
              comprehension.
            </p>
            <p>
              Fusing the mechanical precision of <strong>djent</strong> with
              the expansive atmosphere of progressive metal, their sound recalls
              the death of a massive star — catastrophic, beautiful, and
              inevitable. Each composition is a chapter in an unfolding cosmic
              narrative.
            </p>
            <div className="band-facts">
              {FACTS.map(f => (
                <div className="fact-item" key={f.label}>
                  <span className="fact-label">{f.label}</span>
                  <span className="fact-value">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
