import { SOCIALS, BAND } from '../data/bandData'

export default function Contact() {
  const activeSocials = SOCIALS.filter(s => s.active)

  return (
    <section id="contact">
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
          <span className="section-num">06 //</span>
          <h2 className="section-title">CONTACT</h2>
          <div className="section-line" style={{ maxWidth: '200px' }} />
        </div>
        <div className="contact-inner">
          <p>
            For bookings, press inquiries, or if you&apos;ve been swallowed by
            the void and need to reach someone on the other side.
          </p>
          <div className="contact-links">
            {activeSocials.map(s => (
              <a key={s.label} href={s.url} className="social-link"
                 target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          {/* Uncomment when email is available:
          {BAND.email && (
            <a href={`mailto:${BAND.email}`} className="email-link">{BAND.email}</a>
          )}
          */}
        </div>
      </div>
    </section>
  )
}
