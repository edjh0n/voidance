export default function Hero() {
  return (
    <section id="hero">
      {/* Eclipse logo as large centered background — content overlaps on top */}
      <div className="hero-eclipse" aria-hidden="true">
        <img src="/brand/voidance-hero.svg" alt="" />
      </div >

      <div className="hero-content">
        <p className="hero-tag">// Progressive Metal / Experimental &middot; Cebu City, Philippines</p>
        <div className="hero-divider" />
        <p className="tagline">Born from the collapse of dying stars</p>
        <div className="hero-cta">
          <a href="#discography" className="btn btn-primary">Listen Now</a >
          <a href="#tour"        className="btn btn-ghost">Tour Dates</a >
        </div >
      </div >

      <div className="scroll-hint">
        <span>Scroll</span >
        <div className="scroll-line" />
      </div>
    </section>
  )
}
// ... existing code ...

