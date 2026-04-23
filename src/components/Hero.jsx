export default function Hero() {
  return (
    <section id="hero">
      <p className="hero-tag">// Progressive Metal &middot; Cebu City, Philippines</p>
      <h1 className="band-name">
        <span className="glitch" data-text="VOIDANCE">VOIDANCE</span>
      </h1>
      <div className="hero-divider" />
      <p className="tagline">Born from the collapse of dying stars</p>
      <div className="hero-cta">
        <a href="#discography" className="btn btn-primary">Listen Now</a>
        <a href="#tour"        className="btn btn-ghost">Tour Dates</a>
      </div>
      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
