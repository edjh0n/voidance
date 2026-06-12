import { useEffect, useRef } from 'react'
import { ALBUM_PALETTES } from '../data/bandData'
import { DISCOGRAPHY_RELEASE } from '../data/pageData'
import { useSanityQuery, QUERIES } from '../hooks/useSanity'
import { drawAlbumArt } from '../utils/canvasArt'

function formatTime(seconds = 0) {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec < 10 ? '0' : ''}${sec}`
}

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export default function Discography() {
  const canvasRef = useRef(null)
  const { data: release } = useSanityQuery(QUERIES.discographyRelease, DISCOGRAPHY_RELEASE)
  const paletteIndex = release.paletteIndex ?? DISCOGRAPHY_RELEASE.paletteIndex
  const tracks = release.tracks?.length ? release.tracks : DISCOGRAPHY_RELEASE.tracks
  const tags = release.tags?.length ? release.tags : DISCOGRAPHY_RELEASE.tags

  useEffect(() => {
    drawAlbumArt(canvasRef.current, ALBUM_PALETTES[paletteIndex] || ALBUM_PALETTES[0])
  }, [paletteIndex])

  const playTrack = track => {
    window.dispatchEvent(new CustomEvent('voidance:play-track', { detail: { title: track.title } }))
  }

  return (
    <section id="discography">
      <div className="container">
        <div className="section-header">
          <span className="section-num">04 //</span>
          <h2 className="section-title">DISCOGRAPHY</h2>
          <div className="section-line" />
        </div>
        <div className="disco-layout">
          <div className="disco-art-card">
            <div className="album-art album-art--feature">
              <canvas ref={canvasRef} width={500} height={500} />
              <div className="album-overlay" />
              <span className="album-year album-year--latest">{release.year || DISCOGRAPHY_RELEASE.year}</span>
            </div>
          </div>

          <div className="album-detail">
            <h3>{release.title || DISCOGRAPHY_RELEASE.title}</h3>
            <div className="album-tags">
              {tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>

            <div className="track-list">
              {tracks.map((track, index) => (
                <button type="button" className="track-item" key={`${track.title}-${index}`} onClick={() => playTrack(track)}>
                  <span className="track-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="track-play"><PlayIcon /></span>
                  <span className="track-name">{track.title}</span>
                  <span className="track-type">{track.type}</span>
                  <span className="track-dur">{formatTime(track.duration)}</span>
                </button>
              ))}
            </div>

            {(release.note || DISCOGRAPHY_RELEASE.note) && (
              <div className="disco-coming">
                <span>{release.noteLabel || DISCOGRAPHY_RELEASE.noteLabel}</span>
                <p>{release.note || DISCOGRAPHY_RELEASE.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
