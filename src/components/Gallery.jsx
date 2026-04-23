import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { GALLERY } from '../data/galleryData'

/* ── Icons ── */
const IconImage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>
)
const IconVideo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
)
const IconAll = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)

/* ── Placeholder slide ── */
function PlaceholderSlide({ item }) {
  return (
    <div className="gallery-placeholder">
      <div className="gallery-placeholder-icon"><IconImage /></div>
      <p className="gallery-placeholder-text">{item.caption}</p>
    </div>
  )
}

/* ── Image slide ── */
function ImageSlide({ item, active }) {
  return (
    <div className="gallery-image-wrap">
      <img src={item.src} alt={item.caption} className="gallery-img"
        loading={active ? 'eager' : 'lazy'} draggable={false} />
    </div>
  )
}

/* ── YouTube video slide ── */
function VideoSlide({ item, active }) {
  return (
    <div className="gallery-video-wrap">
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${item.videoId}?rel=0&modestbranding=1`}
          title={item.caption}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen className="gallery-iframe"
        />
      ) : (
        <div className="gallery-video-thumb">
          <img src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
            alt={item.caption} className="gallery-img" draggable={false} />
          <div className="gallery-video-badge"><IconVideo /> VIDEO</div>
        </div>
      )}
    </div>
  )
}

/* ── Thumbnail ── */
function Thumb({ item, active, onClick, index }) {
  return (
    <button
      className={`gallery-thumb${active ? ' gallery-thumb--active' : ''}`}
      onClick={onClick}
      aria-label={`Slide ${index + 1}`}
    >
      {item.type === 'image'       && <img src={item.thumb || item.src} alt="" draggable={false} />}
      {item.type === 'video'       && <img src={`https://img.youtube.com/vi/${item.videoId}/default.jpg`} alt="" draggable={false} />}
      {item.type === 'placeholder' && <div className="gallery-thumb-placeholder"><IconImage /></div>}
      {item.type === 'video'       && <span className="gallery-thumb-video-icon"><IconVideo /></span>}
    </button>
  )
}

const FILTER_TABS = [
  { key: 'all',   label: 'All',    icon: <IconAll /> },
  { key: 'image', label: 'Photos', icon: <IconImage /> },
  { key: 'video', label: 'Videos', icon: <IconVideo /> },
]
const THUMB_THRESHOLD = 5

export default function Gallery() {
  const [filter,   setFilter]   = useState('all')
  const [current,  setCurrent]  = useState(0)
  const [paused,   setPaused]   = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [inView,   setInView]   = useState(false)

  const touchRef   = useRef(null)
  const timerRef   = useRef(null)
  const thumbsRef  = useRef(null)
  const activeRef  = useRef(null)
  const sectionRef = useRef(null)

  // ── Derived data ────────────────────────────────────────────────
  const items = useMemo(() => {
    if (filter === 'all')   return GALLERY
    if (filter === 'image') return GALLERY.filter(i => i.type === 'image' || i.type === 'placeholder')
    return GALLERY.filter(i => i.type === 'video')
  }, [filter])

  const total     = items.length
  const item      = items[current]
  const isVideo   = item?.type === 'video'
  const useThumbs = total > THUMB_THRESHOLD

  // Indices within `items` that are actual images (lightbox only navigates these)
  const imageIndices = useMemo(
    () => items.reduce((acc, s, i) => { if (s.type === 'image') acc.push(i); return acc }, []),
    [items]
  )

  // Where the current lightbox sits within imageIndices, and its neighbours
  const lightboxImagePos = lightbox !== null ? imageIndices.indexOf(lightbox) : -1
  const prevImageIdx     = lightboxImagePos > 0                       ? imageIndices[lightboxImagePos - 1] : null
  const nextImageIdx     = lightboxImagePos < imageIndices.length - 1 ? imageIndices[lightboxImagePos + 1] : null

  const hasPhotos = GALLERY.some(i => i.type === 'image' || i.type === 'placeholder')
  const hasVideos = GALLERY.some(i => i.type === 'video')
  const tabCount  = (tab) =>
    tab === 'all'   ? GALLERY.length
    : tab === 'image' ? GALLERY.filter(i => i.type === 'image' || i.type === 'placeholder').length
    : GALLERY.filter(i => i.type === 'video').length

  // ── Effects ─────────────────────────────────────────────────────

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  // Reset to slide 0 when filter changes
  useEffect(() => { setCurrent(0) }, [filter])

  // Pause auto-advance when section is off-screen
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Auto-advance timer
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    if (!paused && !isVideo && total > 1 && inView) {
      timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 5000)
    }
  }, [paused, isVideo, total, inView])

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current) }, [startTimer])

  // Scroll active thumbnail into view (horizontal only — never moves the page)
  useEffect(() => {
    if (!thumbsRef.current || !activeRef.current) return
    const container = thumbsRef.current
    const thumb     = activeRef.current.querySelector('button') || activeRef.current
    const target    = thumb.offsetLeft - (container.offsetWidth / 2) + (thumb.offsetWidth / 2)
    container.scrollTo({ left: target, behavior: 'smooth' })
  }, [current])

  // Keyboard navigation — declared AFTER prevImageIdx / nextImageIdx
  const go = useCallback((dir) => setCurrent(c => (c + dir + total) % total), [total])

  useEffect(() => {
    const onKey = e => {
      if (lightbox !== null) {
        if (e.key === 'ArrowLeft'  && prevImageIdx !== null) setLightbox(prevImageIdx)
        if (e.key === 'ArrowRight' && nextImageIdx !== null) setLightbox(nextImageIdx)
        if (e.key === 'Escape') setLightbox(null)
      } else {
        if (e.key === 'ArrowLeft')  go(-1)
        if (e.key === 'ArrowRight') go(1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, lightbox, prevImageIdx, nextImageIdx])

  // Touch swipe
  const onTouchStart = e => { touchRef.current = e.touches[0].clientX }
  const onTouchEnd   = e => {
    if (touchRef.current === null) return
    const dx = e.changedTouches[0].clientX - touchRef.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchRef.current = null
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <section id="gallery" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-num">01 //</span>
          <h2 className="section-title">EVENTS &amp; LIVE</h2>
          <div className="section-line" />
        </div>

        {/* Filter tabs */}
        <div className="gallery-tabs">
          {FILTER_TABS.map(tab => {
            if (tab.key === 'image' && !hasPhotos) return null
            if (tab.key === 'video' && !hasVideos) return null
            return (
              <button key={tab.key}
                className={`gallery-tab${filter === tab.key ? ' gallery-tab--active' : ''}`}
                onClick={() => setFilter(tab.key)}>
                {tab.icon}<span>{tab.label}</span>
                <span className="gallery-tab-count">{tabCount(tab.key)}</span>
              </button>
            )
          })}
        </div>

        {/* Carousel stage */}
        <div className="carousel"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

          <div className="carousel-track">
            {items.map((slide, i) => (
              <div key={i}
                className={`carousel-slide${i === current ? ' carousel-slide--active' : ''}`}
                onClick={() => slide.type === 'image' && setLightbox(i)}>
                {slide.type === 'placeholder' && <PlaceholderSlide item={slide} />}
                {slide.type === 'image'       && <ImageSlide item={slide} active={i === current} />}
                {slide.type === 'video'       && <VideoSlide item={slide} active={i === current} />}
              </div>
            ))}
          </div>

          {total > 1 && (<>
            <button className="carousel-btn carousel-btn--prev" onClick={() => go(-1)} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button className="carousel-btn carousel-btn--next" onClick={() => go(1)} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </>)}

          <div className="carousel-caption">
            {item?.event && <span className="carousel-event-tag">{item.event}</span>}
            <span className="carousel-caption-text">{item?.caption}</span>
          </div>
          <div className="carousel-counter">
            {String(current + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}
          </div>
        </div>

        {/* Thumbnail strip or dot indicators */}
        {total > 1 && (useThumbs ? (
          <div className="gallery-thumbs" ref={thumbsRef}>
            {items.map((slide, i) => (
              <div key={i} ref={i === current ? activeRef : null}>
                <Thumb item={slide} active={i === current} index={i} onClick={() => setCurrent(i)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="carousel-dots">
            {items.map((_, i) => (
              <button key={i}
                className={`carousel-dot${i === current ? ' carousel-dot--active' : ''}`}
                onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        ))}

      </div>{/* /container */}

      {/* Lightbox — only opens for image type, navigates only among images */}
      {lightbox !== null && items[lightbox]?.type === 'image' && (
        <div className="lightbox" onClick={() => setLightbox(null)}>

          <button className="lightbox-close" onClick={() => setLightbox(null)}>&#x2715;</button>

          {/* Prev hidden when no previous image exists */}
          {prevImageIdx !== null && (
            <button className="lightbox-prev"
              onClick={e => { e.stopPropagation(); setLightbox(prevImageIdx) }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
          )}

          <img
            src={items[lightbox].src}
            alt={items[lightbox].caption}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
            draggable={false}
          />

          {/* Next hidden when no next image exists */}
          {nextImageIdx !== null && (
            <button className="lightbox-next"
              onClick={e => { e.stopPropagation(); setLightbox(nextImageIdx) }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          )}

          {/* Counter shows position among images only e.g. 2 / 5 */}
          <div className="lightbox-counter">
            {lightboxImagePos + 1} / {imageIndices.length}
          </div>

          {items[lightbox].caption && (
            <p className="lightbox-caption">{items[lightbox].caption}</p>
          )}

        </div>
      )}
    </section>
  )
}
