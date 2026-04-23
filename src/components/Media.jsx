import { useEffect, useRef } from 'react'
import { VIDEOS } from '../data/bandData'
import { drawVideoThumb } from '../utils/canvasArt'

function PlayIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function VideoCard({ video, featured }) {
  const canvasRef = useRef(null)
  const wfRef     = useRef(null)
  const hasVideo  = !!video.youtubeId

  useEffect(() => {
    if (!hasVideo) {
      drawVideoThumb(canvasRef.current, video.hue)
      if (featured && wfRef.current) {
        wfRef.current.innerHTML = ''
        for (let i = 0; i < 60; i++) {
          const bar = document.createElement('div')
          bar.className = 'waveform-bar'
          bar.style.height          = (Math.random() * 80 + 20) + '%'
          bar.style.animationDelay    = (i * 0.04) + 's'
          bar.style.animationDuration = (0.8 + Math.random() * 1.2) + 's'
          wfRef.current.appendChild(bar)
        }
      }
    }
  }, [video.hue, featured, hasVideo])

  const thumbClass = featured ? 'media-thumb' : 'media-thumb-mini'
  const btnClass   = `play-btn${featured ? '' : ' play-btn--sm'}`
  const btnSize    = featured ? 22 : 16

  return (
    <div className="media-feature">
      <div className={thumbClass}>
        {hasVideo ? (
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt={video.title} className="gallery-img" draggable={false}
          />
        ) : (
          <>
            <canvas ref={canvasRef}
              width={featured ? 800 : 400} height={featured ? 450 : 225} />
            {featured && <div className="waveform" ref={wfRef} />}
          </>
        )}
        {hasVideo ? (
          <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank" rel="noopener noreferrer"
            className={btnClass} aria-label={`Watch ${video.title} on YouTube`}
            onClick={e => e.stopPropagation()}>
            <PlayIcon size={btnSize} />
          </a>
        ) : (
          <div className={btnClass}><PlayIcon size={btnSize} /></div>
        )}
      </div>
      <div className="media-label">
        <h4>{video.title}</h4>
        <p>{video.meta}</p>
        {hasVideo && (
          <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank" rel="noopener noreferrer" className="media-yt-link">
            Watch on YouTube ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default function Media() {
  // First video marked featured = large left slot
  // Videos 2–3 = right sidebar
  // Videos 4+ = responsive grid below
  const featured  = VIDEOS.find(v => v.featured)
  const sidebar   = VIDEOS.filter(v => !v.featured).slice(0, 2)
  const overflow  = VIDEOS.filter(v => !v.featured).slice(2)

  return (
    <section id="media">
      <div className="container">
        <div className="section-header">
          <span className="section-num">06 //</span>
          <h2 className="section-title">MEDIA</h2>
          <div className="section-line" />
        </div>

        {/* Main layout: featured + sidebar (always 1 large + 2 small) */}
        <div className="media-grid">
          {featured && <VideoCard video={featured} featured />}
          <div className="media-sidebar">
            {sidebar.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>

        {/* Overflow grid: 4th video onwards in a 3-column responsive grid */}
        {overflow.length > 0 && (
          <div className="media-overflow-grid">
            {overflow.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        )}

      </div>
    </section>
  )
}
