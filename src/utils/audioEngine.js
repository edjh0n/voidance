/**
 * audioEngine.js
 *
 * Dual-mode audio engine with fade in/out and crossfade support:
 *   1. REAL MODE  — HTMLAudioElement when track.audioSrc is set
 *   2. SYNTH MODE — Web Audio API synthesis fallback
 *
 * Fade timings:
 *   FADE_MS      = 400ms  → play / pause
 *   CROSSFADE_MS = 800ms  → next / previous track
 */

const FADE_MS      = 400
const CROSSFADE_MS = 800
const FADE_STEPS   = 20   // volume update intervals during a fade

export class AudioEngine {
  constructor() {
    this._ctx          = null
    this._masterGain   = null
    this._synthNodes   = []
    this._rhythmTimer  = null
    this._audio        = null
    this._mode         = 'synth'
    this._fadeTimer    = null  // active ramp interval for real-audio fades
  }

  // ── Getters ──────────────────────────────────────────────────
  get currentTime() {
    if (this._mode === 'real' && this._audio) return this._audio.currentTime
    return this._ctx ? this._ctx.currentTime : 0
  }
  get ready() { return this._mode === 'real' ? !!this._audio : !!this._ctx }

  // ── Volume (immediate, no fade) ──────────────────────────────
  setVolume(v) {
    if (this._mode === 'real' && this._audio)
      this._audio.volume = Math.max(0, Math.min(1, v))
    if (this._masterGain) this._masterGain.gain.value = v
  }

  // ── Helper: ramp HTMLAudioElement volume over time ───────────
  // Cancels any in-progress ramp before starting a new one.
  _rampVolume(audio, targetVol, durationMs, onComplete) {
    if (this._fadeTimer) { clearInterval(this._fadeTimer); this._fadeTimer = null }
    const startVol   = audio.volume
    const delta      = (targetVol - startVol) / FADE_STEPS
    const intervalMs = durationMs / FADE_STEPS
    let step = 0
    this._fadeTimer = setInterval(() => {
      step++
      audio.volume = Math.max(0, Math.min(1, startVol + delta * step))
      if (step >= FADE_STEPS) {
        clearInterval(this._fadeTimer)
        this._fadeTimer = null
        audio.volume = targetVol
        if (onComplete) onComplete()
      }
    }, intervalMs)
  }

  // ── Stop (immediate, no fade) ─────────────────────────────────
  stop() {
    if (this._fadeTimer) { clearInterval(this._fadeTimer); this._fadeTimer = null }
    if (this._audio) {
      this._audio.pause()
      this._audio.src = ''
      this._audio = null
    }
    if (this._rhythmTimer) { clearInterval(this._rhythmTimer); this._rhythmTimer = null }
    this._synthNodes.forEach(n => {
      try { if (n.stop) n.stop() } catch (_) {}
      try { if (n.disconnect) n.disconnect() } catch (_) {}
    })
    this._synthNodes = []
  }

  // ── Fade out → Promise resolves when silence is reached ──────
  fadeOut(durationMs = FADE_MS) {
    return new Promise(resolve => {
      if (this._mode === 'real' && this._audio) {
        this._rampVolume(this._audio, 0, durationMs, () => {
          this.stop()
          resolve()
        })
      } else if (this._mode === 'synth' && this._masterGain && this._ctx) {
        const now = this._ctx.currentTime
        const dur = durationMs / 1000
        this._masterGain.gain.cancelScheduledValues(now)
        this._masterGain.gain.setValueAtTime(this._masterGain.gain.value, now)
        this._masterGain.gain.linearRampToValueAtTime(0.001, now + dur)
        setTimeout(() => { this.stop(); resolve() }, durationMs)
      } else {
        this.stop()
        resolve()
      }
    })
  }

  // ── Play with fade in (starts from silence) ──────────────────
  play(track, volume = 0.7) {
    this.stop()
    if (track.audioSrc) {
      this._playReal(track, volume)
    } else {
      this._playSynth(track, volume)
    }
  }

  // ── Crossfade to a new track ──────────────────────────────────
  // Old audio fades out while new audio simultaneously fades in.
  crossfadeTo(track, volume = 0.7) {
    const oldAudio       = this._audio
    const oldNodes       = this._synthNodes
    const oldRhythm      = this._rhythmTimer
    const oldMode        = this._mode

    // Detach old references so stop() won't kill them prematurely
    this._audio       = null
    this._synthNodes  = []
    this._rhythmTimer = null
    if (this._fadeTimer) { clearInterval(this._fadeTimer); this._fadeTimer = null }

    if (track.audioSrc) {
      // ── Real audio crossfade ────────────────────────────────
      // Fade out the old audio on its own ramp (independent timer)
      if (oldMode === 'real' && oldAudio) {
        const startVol   = oldAudio.volume
        const steps      = FADE_STEPS
        const intervalMs = CROSSFADE_MS / steps
        let step = 0
        const fadeOutTimer = setInterval(() => {
          step++
          oldAudio.volume = Math.max(0, startVol * (1 - step / steps))
          if (step >= steps) {
            clearInterval(fadeOutTimer)
            oldAudio.pause()
            oldAudio.src = ''
          }
        }, intervalMs)
      } else if (oldMode === 'synth') {
        // Fade out synth masterGain while new real audio fades in
        if (this._masterGain && this._ctx) {
          const now = this._ctx.currentTime
          this._masterGain.gain.linearRampToValueAtTime(0.001, now + CROSSFADE_MS / 1000)
        }
        setTimeout(() => {
          if (oldRhythm) clearInterval(oldRhythm)
          oldNodes.forEach(n => { try { n.stop() } catch(_) {} try { n.disconnect() } catch(_) {} })
        }, CROSSFADE_MS)
      }
      // Start new real audio at 0 and fade in
      this._mode = 'real'
      const newAudio    = new Audio()
      newAudio.preload  = 'auto'
      newAudio.volume   = 0
      newAudio.src      = track.audioSrc
      newAudio.load()
      newAudio.play().catch(() => {
        console.warn(`[AudioEngine] Crossfade fallback to synth for ${track.audioSrc}`)
        this._audio = null
        this._playSynth(track, 0)
        this._fadeInSynth(volume, CROSSFADE_MS)
      })
      this._audio = newAudio
      this._rampVolume(newAudio, volume, CROSSFADE_MS)

    } else {
      // ── Synth crossfade (sequential: fade out → fade in) ────
      if (oldMode === 'real' && oldAudio) {
        oldAudio.pause(); oldAudio.src = ''
      } else if (this._masterGain && this._ctx) {
        const now = this._ctx.currentTime
        this._masterGain.gain.linearRampToValueAtTime(0.001, now + (CROSSFADE_MS / 2) / 1000)
      }
      setTimeout(() => {
        if (oldRhythm) clearInterval(oldRhythm)
        oldNodes.forEach(n => { try { n.stop() } catch(_) {} try { n.disconnect() } catch(_) {} })
        this._playSynth(track, 0)
        this._fadeInSynth(volume, CROSSFADE_MS / 2)
      }, CROSSFADE_MS / 2)
    }
  }

  // ── Synth fade-in helper ──────────────────────────────────────
  _fadeInSynth(targetVolume, durationMs) {
    if (!this._masterGain || !this._ctx) return
    const now = this._ctx.currentTime
    const dur = durationMs / 1000
    this._masterGain.gain.cancelScheduledValues(now)
    this._masterGain.gain.setValueAtTime(0, now)
    this._masterGain.gain.linearRampToValueAtTime(targetVolume, now + dur)
  }

  // ── Event binding ─────────────────────────────────────────────
  onEnded(cb) {
    if (this._mode === 'real' && this._audio)
      this._audio.addEventListener('ended', cb, { once: true })
  }

  // ── Seek ──────────────────────────────────────────────────────
  seek(seconds) {
    if (this._mode === 'real' && this._audio)
      this._audio.currentTime = seconds
  }

  // ── REAL MODE ─────────────────────────────────────────────────
  _playReal(track, volume) {
    this._mode         = 'real'
    const audio        = new Audio()
    audio.preload      = 'auto'
    audio.volume       = 0           // start silent — fade in applied after
    audio.src          = track.audioSrc
    audio.load()
    audio.play().catch(() => {
      console.warn(`[AudioEngine] Could not play ${track.audioSrc}, falling back to synth.`)
      this._audio = null
      this._playSynth(track, 0)
      this._fadeInSynth(volume, FADE_MS)
    })
    this._audio = audio
    // Fade in from silence to target volume
    this._rampVolume(audio, volume, FADE_MS)
  }

  // ── SYNTH MODE ────────────────────────────────────────────────
  _bootCtx() {
    if (!this._ctx) {
      this._ctx        = new (window.AudioContext || window.webkitAudioContext)()
      this._masterGain = this._ctx.createGain()
      this._masterGain.connect(this._ctx.destination)
    }
    if (this._ctx.state === 'suspended') this._ctx.resume()
  }

  _playSynth(track, volume) {
    this._mode = 'synth'
    this._bootCtx()
    this._masterGain.gain.value = volume
    const now   = this._ctx.currentTime
    const nodes = []

    track.freq.forEach((freq, i) => {
      const osc  = this._ctx.createOscillator()
      const env  = this._ctx.createGain()
      const filt = this._ctx.createBiquadFilter()
      osc.type = ['sawtooth', 'square', 'triangle'][i] || 'sine'
      osc.frequency.value  = freq
      filt.type            = 'lowpass'
      filt.frequency.value = 300 + i * 80
      filt.Q.value         = 2
      env.gain.value       = [0.18, 0.08, 0.05][i] ?? 0.04
      osc.connect(filt); filt.connect(env); env.connect(this._masterGain)
      osc.start(now); nodes.push(osc, filt, env)
    })

    track.pad.forEach((freq, i) => {
      const osc    = this._ctx.createOscillator()
      const gain   = this._ctx.createGain()
      const filt   = this._ctx.createBiquadFilter()
      const reverb = this._ctx.createConvolver()
      const irLen  = this._ctx.sampleRate * 2.5
      const irBuf  = this._ctx.createBuffer(2, irLen, this._ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const d = irBuf.getChannelData(ch)
        for (let j = 0; j < irLen; j++)
          d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / irLen, 2.5)
      }

      reverb.buffer        = irBuf
      osc.type             = 'sine'
      osc.frequency.value  = freq
      filt.type            = 'bandpass'
      filt.frequency.value = freq * 2
      filt.Q.value         = 8
      gain.gain.value      = 0.06
      const lfo     = this._ctx.createOscillator()
      const lfoGain = this._ctx.createGain()
      lfo.frequency.value = 0.12 + i * 0.07
      lfoGain.gain.value  = 0.025
      lfo.connect(lfoGain); lfoGain.connect(gain.gain)
      osc.connect(filt); filt.connect(gain)
      gain.connect(reverb); reverb.connect(this._masterGain)
      gain.connect(this._masterGain)
      osc.start(now); lfo.start(now)
      nodes.push(osc, filt, gain, reverb, lfo, lfoGain)
    })

    if (track.type === 'djent' || track.type === 'prog') {
      const bpm    = track.type === 'djent' ? 180 : 130
      const stepMs = (60 / bpm) * 1000
      const pOsc   = this._ctx.createOscillator()
      const pGain  = this._ctx.createGain()
      const pFilt  = this._ctx.createBiquadFilter()
      pOsc.type = 'sawtooth'; pOsc.frequency.value = track.freq[0] * 2
      pFilt.type = 'lowpass'; pFilt.frequency.value = 200
      pGain.gain.value = 0
      const pat  = track.type === 'djent'
        ? [1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0]
        : [1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1]
      let step = 0
      const tick = () => {
        const t   = this._ctx.currentTime + 0.01
        const vel = pat[step % pat.length] * 0.22
        pGain.gain.cancelScheduledValues(t)
        pGain.gain.setValueAtTime(vel, t)
        pGain.gain.linearRampToValueAtTime(0.001, t + (stepMs / 1000) * 0.35)
        step++
      }
      this._rhythmTimer = setInterval(tick, stepMs)
      tick()
      pOsc.connect(pFilt); pFilt.connect(pGain); pGain.connect(this._masterGain)
      pOsc.start(now); nodes.push(pOsc, pFilt, pGain)
    }
    this._synthNodes = nodes
  }
}
