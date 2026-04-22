/**
 * canvasArt.js — Procedural canvas art for album covers and video thumbnails.
 * Pure functions; no DOM side-effects beyond drawing to the passed canvas.
 */

export function drawAlbumArt(canvas, palette, size = 'normal') {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const isSmall = size === 'small'

  ctx.fillStyle = '#020408'
  ctx.fillRect(0, 0, W, H)

  const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.7)
  bgGrad.addColorStop(0, palette.center)
  bgGrad.addColorStop(1, palette.edge)
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  const ringCount = isSmall ? 4 : 6
  const ringStep  = isSmall ? 10 : 35
  for (let i = 0; i < ringCount; i++) {
    ctx.strokeStyle = `rgba(${palette.ring},${0.15 - i * 0.02})`
    ctx.lineWidth   = 1.2
    ctx.beginPath()
    ctx.arc(W/2, H/2, (i + 1) * ringStep, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.strokeStyle = `rgba(${palette.line},0.08)`
  ctx.lineWidth   = 1
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(W/2, H/2)
    ctx.lineTo(W/2 + Math.cos(a) * W, H/2 + Math.sin(a) * W)
    ctx.stroke()
  }

  const gr = isSmall ? 14 : 60
  const cg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, gr)
  cg.addColorStop(0, `rgba(${palette.glow},0.6)`)
  cg.addColorStop(1, 'transparent')
  ctx.fillStyle = cg
  ctx.beginPath()
  ctx.arc(W/2, H/2, gr, 0, Math.PI * 2)
  ctx.fill()
}

export function drawVideoThumb(canvas, hue) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const g = ctx.createRadialGradient(W*0.4, H*0.4, 10, W*0.5, H*0.5, W*0.7)
  g.addColorStop(0, `hsla(${hue},70%,12%,1)`)
  g.addColorStop(1, '#020408')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  for (let y = 0; y < H; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.fillRect(0, y, W, 2)
  }
}
