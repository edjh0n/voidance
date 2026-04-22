import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let W, H, stars = [], nebulae = [], t = 0, raf

    const init = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
      stars = []; nebulae = []
      for (let i = 0; i < 280; i++)
        stars.push({ x: Math.random()*W, y: Math.random()*H,
          r: Math.random()*1.5+0.2, a: Math.random(),
          speed: Math.random()*0.3+0.05, pulse: Math.random()*Math.PI*2 })
      for (let i = 0; i < 4; i++)
        nebulae.push({ x: Math.random()*W, y: Math.random()*H,
          r: Math.random()*300+150, h: Math.random()*40+180,
          s: Math.random()*30+40,   a: Math.random()*0.04+0.01 })
    }

    const draw = () => {
      t += 0.008
      ctx.clearRect(0, 0, W, H)
      nebulae.forEach(n => {
        const g = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r)
        g.addColorStop(0, `hsla(${n.h},${n.s}%,15%,${n.a})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill()
      })
      stars.forEach(s => {
        const alpha = (Math.sin(t*s.speed+s.pulse)*0.5+0.5)*s.a*0.8+0.1
        ctx.fillStyle = `rgba(168,200,232,${alpha})`
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', init)
    init(); draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init) }
  }, [])

  return <canvas ref={canvasRef} id="cosmos" />
}
