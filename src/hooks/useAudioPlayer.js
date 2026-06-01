import { useState, useRef, useEffect, useCallback } from 'react'
import { AudioEngine } from '../utils/audioEngine'
import { TRACKS as FALLBACK_TRACKS } from '../data/bandData'
import { client, QUERIES } from '../lib/sanity'

export default function useAudioPlayer() {
  const engine       = useRef(new AudioEngine())
  const startedAtRef = useRef(0)
  const timerRef     = useRef(null)

  const [tracks,      setTracks]      = useState(FALLBACK_TRACKS)
  const [trackIndex,  setTrackIndex]  = useState(0)
  const [isPlaying,   setIsPlaying]   = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume,      setVolume]      = useState(0.7)
  const [muted,       setMuted]       = useState(false)

  // Fetch tracks from Sanity on mount — normalize to same shape
  useEffect(() => {
    client.fetch(QUERIES.tracks).then(results => {
      if (results?.length) {
        setTracks(results.map(t => ({
          title:        t.title,
          album:        t.album        || 'N/A',
          duration:     t.duration     || 0,
          paletteIndex: t.paletteIndex ?? 2,
          type:         t.type         || 'djent',
          audioSrc:     t.audioSrc     || null,
          freq:         [55, 82, 110],
          pad:          [200, 300],
        })))
      }
    }).catch(() => {}) // silently keep fallback on error
  }, [])

  const track = tracks[trackIndex]

  const formatTime = s => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60)
    return `${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  // ── Progress timer ───────────────────────────────────────────
  const startTimer = useCallback((fromTime = 0) => {
    clearInterval(timerRef.current)
    startedAtRef.current = engine.current.currentTime - fromTime
    timerRef.current = setInterval(() => {
      let ct
      if (tracks[trackIndex]?.audioSrc) {
        ct = engine.current.currentTime
      } else {
        ct = engine.current.ready
          ? engine.current.currentTime - startedAtRef.current
          : fromTime
      }
      const dur = tracks[trackIndex]?.duration || 0
      if (ct >= dur) {
        setTrackIndex(i => (i + 1) % tracks.length)
        setCurrentTime(0)
        clearInterval(timerRef.current)
        return
      }
      setCurrentTime(ct)
    }, 250)
  }, [trackIndex, tracks])

  // ── Play ─────────────────────────────────────────────────────
  const play = useCallback((idx = trackIndex, from = 0) => {
    const vol = muted ? 0 : volume
    if (isPlaying && from === 0) {
      engine.current.crossfadeTo(tracks[idx], vol)
    } else {
      engine.current.play(tracks[idx], vol)
      if (tracks[idx]?.audioSrc && from > 0) engine.current.seek(from)
    }
    setTrackIndex(idx)
    setCurrentTime(from)
    setIsPlaying(true)
    startTimer(from)
  }, [trackIndex, isPlaying, volume, muted, startTimer, tracks])

  // ── Pause ────────────────────────────────────────────────────
  const pause = useCallback(() => {
    clearInterval(timerRef.current)
    setIsPlaying(false)
    engine.current.fadeOut()
  }, [])

  // ── Toggle ───────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play(trackIndex, currentTime)
  }, [isPlaying, pause, play, trackIndex, currentTime])

  // ── Next / Prev ───────────────────────────────────────────────
  const next = useCallback(() => {
    play((trackIndex + 1) % tracks.length, 0)
  }, [trackIndex, play, tracks.length])

  const prev = useCallback(() => {
    play((trackIndex - 1 + tracks.length) % tracks.length, 0)
  }, [trackIndex, play, tracks.length])

  // ── Seek ─────────────────────────────────────────────────────
  const seek = useCallback(pct => {
    const t = pct * (tracks[trackIndex]?.duration || 0)
    setCurrentTime(t)
    if (isPlaying) {
      engine.current.play(tracks[trackIndex], muted ? 0 : volume)
      if (tracks[trackIndex]?.audioSrc) engine.current.seek(t)
      startTimer(t)
    }
  }, [trackIndex, isPlaying, volume, muted, startTimer, tracks])

  // ── Volume ───────────────────────────────────────────────────
  const changeVolume = useCallback(v => {
    setVolume(v); setMuted(false); engine.current.setVolume(v)
  }, [])

  const toggleMute = useCallback(() => {
    const n = !muted
    setMuted(n)
    engine.current.setVolume(n ? 0 : volume)
  }, [muted, volume])

  // ── Cleanup ──────────────────────────────────────────────────
  useEffect(() => () => {
    engine.current.stop()
    clearInterval(timerRef.current)
  }, [])

  const progress = track ? Math.min((currentTime / track.duration) * 100, 100) : 0

  return {
    track, tracks, trackIndex, isPlaying, currentTime, progress,
    volume, muted, formatTime,
    play, pause, togglePlay, next, prev, seek,
    changeVolume, toggleMute,
  }
}
