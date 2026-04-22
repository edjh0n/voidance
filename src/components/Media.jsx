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

  useEffect(() => {
    drawVideoThumb(canvasRef.current, video.hue)
    if (featured && wfRef.current) {
      wfRef.current.innerHTML = ''
      for (let i = 0; i < 60; i++) {
        const bar = document.createElement('div')
        bar.className = 'waveform-bar'
        bar.style.height = (Math.random() * 80 + 20) + '%'
        bar.style.animationDelay    = (i * 0.04) + 's'
        bar.style.animationDuration = (0.8 + Math.random() * 1.2) + 's'
        wfRef.current.appendChild(bar)
      }
    }
  }, [video.hue, featured])

  return (
    <div className="media-feature">
      <div className={featured ? 'media-thumb' : 'media-thumb-mini'}>
        <canvas ref={canvasRef} width={featured ? 800 : 400} height={featured ? 450 : 225} />
        {featured && <div className="waveform" ref={wfRef} />}
        <div className={`play-btn${featured ? '' : ' play-btn--sm'}`}>
          <PlayIcon size={featured ? 22 : 16} />
        </div>
      </div>
      <div className="media-label">
        <h4>{video.title}</h4>
        <p>{video.meta}</p>
      </div>
    </div>
  )
}

export default function Media() {
  const featured = VIDEOS.filter(v => v.featured)
  const sidebar  = VIDEOS.filter(v => !v.featured)

  return (
    <section id="media">
      <div className="container">
        <div className="section-header">
          <span className="section-num">06 //</span>
          <h2 className="section-title">MEDIA</h2>
          <div className="section-line" />
        </div>
        <div className="media-grid">
          {featured.map(v => <VideoCard key={v.id} video={v} featured />)}
          <div className="media-sidebar">
            {sidebar.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
