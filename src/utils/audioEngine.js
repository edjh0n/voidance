/**
 * audioEngine.js
 *
 * Dual-mode audio engine:
 *   1. REAL MODE   — uses HTMLAudioElement when track.audioSrc is set and the file exists.
 *   2. SYNTH MODE  — falls back to procedural Web Audio API synthesis when no file is provided.
 *
 * Usage is identical from the outside — just call engine.play(track).
 */

export class AudioEngine {
  constructor() {
    // Synth nodes
    this._ctx          = null
    this._masterGain   = null
    this._synthNodes   = []
    this._rhythmTimer  = null

    // Real audio
    this._audio        = null   // HTMLAudioElement
    this._mode         = 'synth' // 'real' | 'synth'
  }

  // ── Getters ──────────────────────────────────────────────────
  get currentTime() {
    if (this._mode === 'real' && this._audio) return this._audio.currentTime
    return this._ctx ? this._ctx.currentTime : 0
  }

  get duration() {
    if (this._mode === 'real' && this._audio) return this._audio.duration || 0
    return 0
  }

  get ready() { return this._mode === 'real' ? !!this._audio : !!this._ctx }

  // ── Volume ───────────────────────────────────────────────────
  setVolume(v) {
    if (this._mode === 'real' && this._audio) this._audio.volume = Math.max(0, Math.min(1, v))
    if (this._masterGain) this._masterGain.gain.value = v
  }

  // ── Stop everything ──────────────────────────────────────────
  stop() {
    // Stop real audio
    if (this._audio) {
      this._audio.pause()
      this._audio.src = ''
      this._audio = null
    }
    // Stop synth
    if (this._rhythmTimer) { clearInterval(this._rhythmTimer); this._rhythmTimer = null }
    this._synthNodes.forEach(n => {
      try { if (n.stop) n.stop() } catch (_) {}
      try { if (n.disconnect) n.disconnect() } catch (_) {}
    })
    this._synthNodes = []
  }

  // ── Main play method ─────────────────────────────────────────
  play(track, volume = 0.7) {
    this.stop()

    if (track.audioSrc) {
      this._playReal(track, volume)
    } else {
      this._playSynth(track, volume)
    }
  }

  // ── Seek (real audio only) ───────────────────────────────────
  seek(seconds) {
    if (this._mode === 'real' && this._audio) {
      this._audio.currentTime = seconds
    }
  }

  // ── Event binding (real audio) ───────────────────────────────
  onEnded(cb) {
    if (this._mode === 'real' && this._audio) this._audio.addEventListener('ended', cb, { once: true })
  }

  // ── REAL MODE ─────────────────────────────────────────────────
  _playReal(track, volume) {
    this._mode  = 'real'
    const audio = new Audio(track.audioSrc)
    audio.volume = Math.max(0, Math.min(1, volume))
    audio.play().catch(() => {
      // Autoplay blocked or file not found — fall back to synth
      console.warn(`[AudioEngine] Could not play ${track.audioSrc}, falling back to synth.`)
      this._audio = null
      this._playSynth(track, volume)
    })
    this._audio = audio
  }

  // ── SYNTH MODE ────────────────────────────────────────────────
  _bootCtx(volume) {
    if (!this._ctx) {
      this._ctx        = new (window.AudioContext || window.webkitAudioContext)()
      this._masterGain = this._ctx.createGain()
      this._masterGain.connect(this._ctx.destination)
    }
    if (this._ctx.state === 'suspended') this._ctx.resume()
    this._masterGain.gain.value = volume
  }

  _playSynth(track, volume) {
    this._mode = 'synth'
    this._bootCtx(volume)
    const now   = this._ctx.currentTime
    const nodes = []

    // Bass drone layers
    track.freq.forEach((freq, i) => {
      const osc  = this._ctx.createOscillator()
      const env  = this._ctx.createGain()
      const filt = this._ctx.createBiquadFilter()
      osc.type             = ['sawtooth', 'square', 'triangle'][i] || 'sine'
      osc.frequency.value  = freq
      filt.type            = 'lowpass'
      filt.frequency.value = 300 + i * 80
      filt.Q.value         = 2
      env.gain.value       = [0.18, 0.08, 0.05][i] ?? 0.04
      osc.connect(filt); filt.connect(env); env.connect(this._masterGain)
      osc.start(now); nodes.push(osc, filt, env)
    })

    // Ambient pad with shimmer reverb
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

    // Rhythmic pulse for djent / prog tracks
    if (track.type === 'djent' || track.type === 'prog') {
      const bpm    = track.type === 'djent' ? 180 : 130
      const stepMs = (60 / bpm) * 1000
      const pOsc   = this._ctx.createOscillator()
      const pGain  = this._ctx.createGain()
      const pFilt  = this._ctx.createBiquadFilter()
      pOsc.type             = 'sawtooth'
      pOsc.frequency.value  = track.freq[0] * 2
      pFilt.type            = 'lowpass'
      pFilt.frequency.value = 200
      pGain.gain.value      = 0
      const pat = track.type === 'djent'
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
