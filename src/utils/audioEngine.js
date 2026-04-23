/**
 * audioEngine.js — original working version restored for diagnosis
 * Dual-mode: real audio (HTMLAudioElement) + Web Audio synth fallback
 */
export class AudioEngine {
  constructor() {
    this._ctx         = null
    this._masterGain  = null
    this._synthNodes  = []
    this._rhythmTimer = null
    this._audio       = null
    this._mode        = 'synth'
  }

  get currentTime() {
    if (this._mode === 'real' && this._audio) return this._audio.currentTime
    return this._ctx ? this._ctx.currentTime : 0
  }
  get duration() {
    if (this._mode === 'real' && this._audio) return this._audio.duration || 0
    return 0
  }
  get ready() { return this._mode === 'real' ? !!this._audio : !!this._ctx }

  setVolume(v) {
    if (this._mode === 'real' && this._audio) this._audio.volume = Math.max(0, Math.min(1, v))
    if (this._masterGain) this._masterGain.gain.value = v
  }

  stop() {
    if (this._audio) { this._audio.pause(); this._audio.src = ''; this._audio = null }
    if (this._rhythmTimer) { clearInterval(this._rhythmTimer); this._rhythmTimer = null }
    this._synthNodes.forEach(n => {
      try { if (n.stop) n.stop() } catch (_) {}
      try { if (n.disconnect) n.disconnect() } catch (_) {}
    })
    this._synthNodes = []
  }

  // Fade out → ramps volume to 0 then stops
  fadeOut(durationMs = 400) {
    return new Promise(resolve => {
      if (this._mode === 'real' && this._audio) {
        const audio      = this._audio
        const startVol   = audio.volume
        const steps      = 20
        const intervalMs = durationMs / steps
        let step = 0
        const timer = setInterval(() => {
          step++
          audio.volume = Math.max(0, startVol * (1 - step / steps))
          if (step >= steps) {
            clearInterval(timer)
            this.stop()
            resolve()
          }
        }, intervalMs)
      } else if (this._mode === 'synth' && this._masterGain && this._ctx) {
        const now = this._ctx.currentTime
        const dur = durationMs / 1000
        this._masterGain.gain.cancelScheduledValues(now)
        this._masterGain.gain.setValueAtTime(this._masterGain.gain.value, now)
        this._masterGain.gain.linearRampToValueAtTime(0.001, now + dur)
        setTimeout(() => { this.stop(); resolve() }, durationMs)
      } else {
        this.stop(); resolve()
      }
    })
  }

  play(track, volume = 0.7) {
    this.stop()
    if (track.audioSrc) { this._playReal(track, volume) }
    else                 { this._playSynth(track, volume) }
  }

  // Crossfade: fade out current while fading in next
  crossfadeTo(track, volume = 0.7) {
    const XFADE_MS   = 800
    const XFADE_STEPS = 20
    const oldAudio   = this._audio
    const oldMode    = this._mode

    // Detach old audio so stop() won't kill it
    this._audio = null

    // Fade out the old audio independently
    if (oldMode === 'real' && oldAudio) {
      const startVol   = oldAudio.volume
      const intervalMs = XFADE_MS / XFADE_STEPS
      let step = 0
      const timer = setInterval(() => {
        step++
        oldAudio.volume = Math.max(0, startVol * (1 - step / XFADE_STEPS))
        if (step >= XFADE_STEPS) {
          clearInterval(timer)
          oldAudio.pause()
          oldAudio.src = ''
        }
      }, intervalMs)
    } else if (oldMode === 'synth' && this._masterGain && this._ctx) {
      // Stop synth nodes after fade
      const synthNodes = this._synthNodes
      const rhythmTimer = this._rhythmTimer
      this._synthNodes = []
      this._rhythmTimer = null
      const now = this._ctx.currentTime
      this._masterGain.gain.linearRampToValueAtTime(0.001, now + XFADE_MS / 1000)
      setTimeout(() => {
        if (rhythmTimer) clearInterval(rhythmTimer)
        synthNodes.forEach(n => { try { n.stop() } catch (_) {} try { n.disconnect() } catch (_) {} })
      }, XFADE_MS)
    }

    // Start new track with fade in
    if (track.audioSrc) {
      this._mode     = 'real'
      const audio    = new Audio()
      audio.preload  = 'auto'
      audio.volume   = Math.max(0, Math.min(1, volume))
      audio.src      = track.audioSrc
      audio.load()
      audio.play().catch(() => {
        this._audio = null
        this._playSynth(track, volume)
      })
      this._audio    = audio
      audio.volume   = 0
      // Ramp new audio up
      const intervalMs = XFADE_MS / XFADE_STEPS
      let step = 0
      const timer = setInterval(() => {
        step++
        audio.volume = Math.max(0, Math.min(1, volume * step / XFADE_STEPS))
        if (step >= XFADE_STEPS) { clearInterval(timer); audio.volume = volume }
      }, intervalMs)
    } else {
      this._playSynth(track, volume)
    }
  }

  seek(seconds) {
    if (this._mode === 'real' && this._audio) this._audio.currentTime = seconds
  }

  onEnded(cb) {
    if (this._mode === 'real' && this._audio)
      this._audio.addEventListener('ended', cb, { once: true })
  }

  _playReal(track, volume) {
    this._mode    = 'real'
    const audio   = new Audio()
    audio.preload = 'auto'
    audio.volume  = Math.max(0, Math.min(1, volume)) // full vol so browser commits to load
    audio.src     = track.audioSrc
    audio.load()
    audio.play().catch(() => {
      console.warn(`[AudioEngine] Could not play ${track.audioSrc}, falling back to synth`)
      this._audio = null
      this._playSynth(track, volume)
    })
    this._audio = audio
    // Fade in: drop to 0 after play() is called, then ramp up
    audio.volume = 0
    const steps = 20, intervalMs = 400 / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      audio.volume = Math.max(0, Math.min(1, volume * step / steps))
      if (step >= steps) { clearInterval(timer); audio.volume = volume }
    }, intervalMs)
  }

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
    const now = this._ctx.currentTime, nodes = []

    track.freq.forEach((freq, i) => {
      const osc = this._ctx.createOscillator(), env = this._ctx.createGain(), filt = this._ctx.createBiquadFilter()
      osc.type = ['sawtooth','square','triangle'][i] || 'sine'
      osc.frequency.value = freq; filt.type = 'lowpass'; filt.frequency.value = 300 + i*80; filt.Q.value = 2
      env.gain.value = [0.18,0.08,0.05][i] ?? 0.04
      osc.connect(filt); filt.connect(env); env.connect(this._masterGain)
      osc.start(now); nodes.push(osc, filt, env)
    })

    track.pad.forEach((freq, i) => {
      const osc = this._ctx.createOscillator(), gain = this._ctx.createGain()
      const filt = this._ctx.createBiquadFilter(), reverb = this._ctx.createConvolver()
      const irLen = this._ctx.sampleRate * 2.5, irBuf = this._ctx.createBuffer(2, irLen, this._ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) { const d = irBuf.getChannelData(ch); for (let j = 0; j < irLen; j++) d[j] = (Math.random()*2-1)*Math.pow(1-j/irLen,2.5) }
      reverb.buffer = irBuf; osc.type = 'sine'; osc.frequency.value = freq
      filt.type = 'bandpass'; filt.frequency.value = freq*2; filt.Q.value = 8; gain.gain.value = 0.06
      const lfo = this._ctx.createOscillator(), lfoGain = this._ctx.createGain()
      lfo.frequency.value = 0.12+i*0.07; lfoGain.gain.value = 0.025
      lfo.connect(lfoGain); lfoGain.connect(gain.gain)
      osc.connect(filt); filt.connect(gain); gain.connect(reverb); reverb.connect(this._masterGain); gain.connect(this._masterGain)
      osc.start(now); lfo.start(now); nodes.push(osc,filt,gain,reverb,lfo,lfoGain)
    })

    if (track.type === 'djent' || track.type === 'prog') {
      const bpm = track.type==='djent'?180:130, stepMs = (60/bpm)*1000
      const pOsc = this._ctx.createOscillator(), pGain = this._ctx.createGain(), pFilt = this._ctx.createBiquadFilter()
      pOsc.type='sawtooth'; pOsc.frequency.value=track.freq[0]*2; pFilt.type='lowpass'; pFilt.frequency.value=200; pGain.gain.value=0
      const pat = track.type==='djent'?[1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0]:[1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1]
      let step=0
      const tick = () => { const t=this._ctx.currentTime+0.01,vel=pat[step%pat.length]*0.22; pGain.gain.cancelScheduledValues(t); pGain.gain.setValueAtTime(vel,t); pGain.gain.linearRampToValueAtTime(0.001,t+(stepMs/1000)*0.35); step++ }
      this._rhythmTimer = setInterval(tick, stepMs); tick()
      pOsc.connect(pFilt); pFilt.connect(pGain); pGain.connect(this._masterGain); pOsc.start(now); nodes.push(pOsc,pFilt,pGain)
    }
    this._synthNodes = nodes
  }
}
