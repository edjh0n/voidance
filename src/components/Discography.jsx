import { useEffect, useRef } from 'react'
import { ALBUMS, ALBUM_PALETTES } from '../data/bandData'
import { drawAlbumArt } from '../utils/canvasArt'

function AlbumCard({ album }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    drawAlbumArt(canvasRef.current, ALBUM_PALETTES[album.paletteIndex])
  }, [album.paletteIndex])

  return (
    <div className={`album-card${album.latest ? ' album-card--latest' : ''}`}>
      <div className="album-art">
        <canvas ref={canvasRef} width={400} height={400} />
        <div className="album-overlay" />
        <span className={`album-year${album.latest ? ' album-year--latest' : ''}`}>
          {album.year}
        </span>
      </div>
      <div className="album-info">
        <div className="album-title">{album.title}</div>
        <div className="album-tracks">{album.tracks}</div>
      </div>
    </div>
  )
}

export default function Discography() {
  return (
    <section id="discography">
      <div className="container">
        <div className="section-header">
          <span className="section-num">03 //</span>
          <h2 className="section-title">DISCOGRAPHY</h2>
          <div className="section-line" />
        </div>
        <div className="albums-grid">
          {ALBUMS.map(a => <AlbumCard key={a.id} album={a} />)}
        </div>
      </div>
    </section>
  )
}
