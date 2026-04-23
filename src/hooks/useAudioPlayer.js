import { useState, useRef, useEffect, useCallback } from 'react'
import { AudioEngine } from '../utils/audioEngine'
import { TRACKS } from '../data/bandData'

export default function useAudioPlayer() {
  const engine       = useRef(new AudioEngine())
  const startedAtRef = useRef(0)
  const timerRef     = useRef(null)

  const [trackIndex,  setTrackIndex]  = useState(0)
  const [isPlaying,   setIsPlaying]   = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume,      setVolume]      = useState(0.7)
  const [muted,       setMuted]       = useState(false)

  const track = TRACKS[trackIndex]

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
      if (TRACKS[trackIndex].audioSrc) {
        ct = engine.current.currentTime
      } else {
        ct = engine.current.ready
          ? engine.current.currentTime - startedAtRef.current
          : fromTime
      }
      const dur = TRACKS[trackIndex].duration
      if (ct >= dur) {
        setTrackIndex(i => (i + 1) % TRACKS.length)
        setCurrentTime(0)
        clearInterval(timerRef.current)
        return
      }
      setCurrentTime(ct)
    }, 250)
  }, [trackIndex])

  // ── Play (with fade in) ──────────────────────────────────────
  const play = useCallback((idx = trackIndex, from = 0) => {
    const vol = muted ? 0 : volume
    engine.current.play(TRACKS[idx], vol)
    if (TRACKS[idx].audioSrc && from > 0) engine.current.seek(from)
    setTrackIndex(idx)
    setCurrentTime(from)
    setIsPlaying(true)
    startTimer(from)
  }, [trackIndex, volume, muted, startTimer])

  // ── Pause (with fade out) ────────────────────────────────────
  const pause = useCallback(() => {
    clearInterval(timerRef.current)  // stop progress bar immediately
    setIsPlaying(false)
    engine.current.fadeOut()         // audio fades to silence then stops
  }, [])

  // ── Toggle ───────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play(trackIndex, currentTime)
  }, [isPlaying, pause, play, trackIndex, currentTime])

  // ── Next (crossfade) ─────────────────────────────────────────
  const next = useCallback(() => {
    const idx = (trackIndex + 1) % TRACKS.length
    if (isPlaying) {
      const vol = muted ? 0 : volume
      engine.current.crossfadeTo(TRACKS[idx], vol)
      setTrackIndex(idx)
      setCurrentTime(0)
      startTimer(0)
    } else {
      setTrackIndex(idx)
      setCurrentTime(0)
    }
  }, [trackIndex, isPlaying, volume, muted, startTimer])

  // ── Prev (crossfade) ─────────────────────────────────────────
  const prev = useCallback(() => {
    const idx = (trackIndex - 1 + TRACKS.length) % TRACKS.length
    if (isPlaying) {
      const vol = muted ? 0 : volume
      engine.current.crossfadeTo(TRACKS[idx], vol)
      setTrackIndex(idx)
      setCurrentTime(0)
      startTimer(0)
    } else {
      setTrackIndex(idx)
      setCurrentTime(0)
    }
  }, [trackIndex, isPlaying, volume, muted, startTimer])

  // ── Seek ─────────────────────────────────────────────────────
  const seek = useCallback(pct => {
    const t = pct * TRACKS[trackIndex].duration
    setCurrentTime(t)
    if (isPlaying) {
      engine.current.play(TRACKS[trackIndex], muted ? 0 : volume)
      if (TRACKS[trackIndex].audioSrc) engine.current.seek(t)
      startTimer(t)
    }
  }, [trackIndex, isPlaying, volume, muted, startTimer])

  // ── Volume ───────────────────────────────────────────────────
  const changeVolume = useCallback(v => {
    setVolume(v); setMuted(false); engine.current.setVolume(v)
  }, [])

  const toggleMute = useCallback(() => {
    const next = !muted
    setMuted(next)
    engine.current.setVolume(next ? 0 : volume)
  }, [muted, volume])

  // ── Cleanup on unmount ───────────────────────────────────────
  useEffect(() => () => {
    engine.current.stop()
    clearInterval(timerRef.current)
  }, [])

  const progress = track ? Math.min((currentTime / track.duration) * 100, 100) : 0

  return {
    track, trackIndex, isPlaying, currentTime, progress,
    volume, muted, formatTime,
    play, pause, togglePlay, next, prev, seek,
    changeVolume, toggleMute,
  }
}
