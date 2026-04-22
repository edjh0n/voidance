import { useEffect, useRef, useState } from 'react'
import useAudioPlayer from '../hooks/useAudioPlayer'
import { drawAlbumArt } from '../utils/canvasArt'
import { TRACKS, ALBUM_PALETTES } from '../data/bandData'

/* ── SVG Icons ── */
const PrevIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
const NextIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2.5-6l-2.5 1.5v-3l2.5 1.5zM16 6h2v12h-2z"/></svg>
const PlayIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
const PauseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
const VolIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>

/* ── Mini visualizer ── */
function Visualizer({ playing }) {
  const bars = Array.from({ length: 10 }, (_, i) => i)
  return (
    <div id="player-viz">
      {bars.map(i => (
        <div key={i} className="viz-bar" style={{
          animationName:     playing ? 'vizPlay' : 'vizIdle',
          animationDuration: playing ? `${(0.3 + Math.random() * 0.6).toFixed(2)}s` : '1.5s',
          animationDelay:    `${(i * 0.04).toFixed(2)}s`,
          opacity:           playing ? 0.9 : 0.3,
        }} />
      ))}
    </div>
  )
}

export default function MusicPlayer() {
  const player       = useAudioPlayer()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const artRef       = useRef(null)

  // Refresh mini album art when track changes
  useEffect(() => {
    if (artRef.current && player.track) {
      drawAlbumArt(artRef.current, ALBUM_PALETTES[player.track.paletteIndex], 'small')
    }
  }, [player.trackIndex, player.track])

  const handleSeek = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    player.seek((e.clientX - rect.left) / rect.width)
  }

  return (
    <>
      {/* Playlist drawer */}
      <div id="playlist-drawer" className={drawerOpen ? 'open' : ''}>
        <div className="playlist-inner">
          <div className="playlist-header">
            <span>// TRACKLIST</span>
            <span>{player.track?.album}</span>
          </div>
          <div className="playlist-items">
            {TRACKS.map((t, i) => (
              <div key={i}
                   className={`pl-item${i === player.trackIndex ? ' active' : ''}`}
                   onClick={() => player.play(i, 0)}>
                <div className="pl-num">
                  {i === player.trackIndex
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--cyan)"><path d="M8 5v14l11-7z"/></svg>
                    : <span className="pl-num-text">{String(i + 1).padStart(2, '0')}</span>}
                </div>
                <div className="pl-info">
                  <div className="pl-title">{t.title}</div>
                  <div className="pl-meta">{t.album}</div>
                </div>
                <div className="pl-duration">{player.formatTime(t.duration)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player bar */}
      <div id="music-player">
        {/* Left: track info */}
        <div className="player-track">
          <div className="player-album-art">
            <canvas ref={artRef} width={52} height={52} />
          </div>
          <Visualizer playing={player.isPlaying} />
          <div className="player-track-info">
            <div className="player-track-name">{player.track?.title}</div>
            <div className="player-track-album">{player.track?.album}</div>
          </div>
        </div>

        {/* Center: controls + progress */}
        <div className="player-center">
          <div className="player-controls">
            <button className="ctrl-btn" onClick={player.prev}><PrevIcon /></button>
            <button className="ctrl-btn ctrl-btn--play" onClick={player.togglePlay}>
              {player.isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="ctrl-btn" onClick={player.next}><NextIcon /></button>
          </div>
          <div className="player-progress">
            <span className="time-label">{player.formatTime(player.currentTime)}</span>
            <div className="progress-track" onClick={handleSeek}>
              <div className="progress-fill" style={{ width: `${player.progress}%` }} />
            </div>
            <span className="time-label time-label--right">
              {player.track ? player.formatTime(player.track.duration) : '0:00'}
            </span>
          </div>
        </div>

        {/* Right: volume + playlist */}
        <div className="player-right">
          <div className="volume-group">
            <button className="ctrl-btn" onClick={player.toggleMute}
              style={{ color: player.muted ? 'var(--blood)' : undefined }}>
              <VolIcon />
            </button>
            <input type="range" className="volume-slider"
              min={0} max={1} step={0.02}
              value={player.muted ? 0 : player.volume}
              onChange={e => player.changeVolume(parseFloat(e.target.value))} />
          </div>
          <button className={`playlist-toggle${drawerOpen ? ' active' : ''}`}
            onClick={() => setDrawerOpen(o => !o)}>
            Tracks
          </button>
        </div>
      </div>
    </>
  )
}
