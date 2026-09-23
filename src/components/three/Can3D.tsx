import { Suspense, useEffect, useRef, useState, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, ContactShadows, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * PureLube 1L tin — full packaging wrap.
 * Front, platinum side, and back share one cylinder map.
 * Lid (red pull-cap) and base (embossed PureLube) are separate faces
 * so the can can be turned to any side.
 */

const LABEL_W = 3072
const LABEL_H = 1536
const FRONT_U = 0.4
const SIDE_U = 0.22

type CanTextures = {
  label: THREE.CanvasTexture
  lid: THREE.CanvasTexture
  cap: THREE.CanvasTexture
  base: THREE.CanvasTexture
  baseBump: THREE.CanvasTexture
  dispose: () => void
}

function stamp(tex: THREE.CanvasTexture, color = true) {
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy)
      line = word
      yy += lineHeight
    } else {
      line = test
    }
  }
  if (line) {
    ctx.fillText(line, x, yy)
    yy += lineHeight
  }
  return yy
}

function drawArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  start: number,
  end: number,
  size: number,
) {
  ctx.save()
  ctx.fillStyle = '#fff6f6'
  ctx.font = `700 ${size}px Rajdhani, Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const chars = [...text]
  const span = end - start
  chars.forEach((ch, i) => {
    if (ch === ' ') return
    const a = start + (span * (i + 0.5)) / chars.length
    ctx.save()
    ctx.translate(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius)
    ctx.rotate(a + Math.PI / 2)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
  ctx.restore()
}

function strokeArrowArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  start: number,
  end: number,
) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.92)'
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, cy, radius, start, end)
  ctx.stroke()
  const a = end
  const px = cx + Math.cos(a) * radius
  const py = cy + Math.sin(a) * radius
  const tx = -Math.sin(a)
  const ty = Math.cos(a)
  const nx = Math.cos(a)
  const ny = Math.sin(a)
  ctx.beginPath()
  ctx.moveTo(px + tx * 18, py + ty * 18)
  ctx.lineTo(px - tx * 8 + nx * 12, py - ty * 8 + ny * 12)
  ctx.lineTo(px - tx * 8 - nx * 12, py - ty * 8 - ny * 12)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawLogoVector(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)
  ctx.lineWidth = 16
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#ee1c2e'
  ctx.beginPath()
  ctx.arc(0, 0, 78, Math.PI * 0.85, Math.PI * 1.7)
  ctx.stroke()
  ctx.strokeStyle = '#1d3fb8'
  ctx.beginPath()
  ctx.arc(0, 0, 78, Math.PI * -0.15, Math.PI * 0.7)
  ctx.stroke()
  const drop = ctx.createLinearGradient(0, -58, 0, 52)
  drop.addColorStop(0, '#ffe07a')
  drop.addColorStop(1, '#d4891a')
  ctx.fillStyle = drop
  ctx.beginPath()
  ctx.moveTo(0, -58)
  ctx.bezierCurveTo(-48, 8, -40, 52, 0, 52)
  ctx.bezierCurveTo(40, 52, 48, 8, 0, -58)
  ctx.fill()
  ctx.restore()
}

function drawWordmark(ctx: CanvasRenderingContext2D, cx: number, y: number, size: number) {
  ctx.save()
  ctx.font = `italic 700 ${size}px Rajdhani, Arial, sans-serif`
  ctx.textBaseline = 'middle'
  const pure = 'PURE'
  const lube = 'LUBE'
  const w1 = ctx.measureText(pure).width
  const w2 = ctx.measureText(lube).width
  const gap = size * 0.08
  const x0 = cx - (w1 + w2 + gap) / 2
  ctx.textAlign = 'left'
  ctx.fillStyle = '#1a3fbf'
  ctx.fillText(pure, x0, y)
  ctx.fillStyle = '#e10613'
  ctx.fillText(lube, x0 + w1 + gap, y)
  ctx.restore()
}

function paintLogo(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  cx: number,
  cy: number,
  maxW: number,
  maxH: number,
) {
  if (!logo) {
    drawLogoVector(ctx, cx, cy - maxH * 0.16, maxH / 280)
    drawWordmark(ctx, cx, cy + maxH * 0.28, Math.round(maxH * 0.22))
    return
  }
  const aspect = logo.naturalWidth / logo.naturalHeight
  let w = maxW
  let h = w / aspect
  if (h > maxH) {
    h = maxH
    w = h * aspect
  }
  const scratch = document.createElement('canvas')
  scratch.width = logo.naturalWidth
  scratch.height = logo.naturalHeight
  const g = scratch.getContext('2d')!
  g.drawImage(logo, 0, 0)
  const image = g.getImageData(0, 0, scratch.width, scratch.height)
  const d = image.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]
    const gg = d[i + 1]
    const b = d[i + 2]
    const max = Math.max(r, gg, b)
    const min = Math.min(r, gg, b)
    const sat = max === 0 ? 0 : (max - min) / max
    const lum = (r + gg + b) / 3
    if (lum > 246 && sat < 0.08) d[i + 3] = 0
    else if (lum > 228 && sat < 0.07) d[i + 3] = Math.round(d[i + 3] * Math.max(0, (246 - lum) / 18))
  }
  g.putImageData(image, 0, 0)
  ctx.drawImage(scratch, cx - w / 2, cy - h / 2, w, h)
}

function drawSportbike(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.translate(x, y)

  ctx.fillStyle = 'rgba(0,0,0,0.22)'
  ctx.beginPath()
  ctx.ellipse(w * 0.5, h * 0.9, w * 0.4, h * 0.065, 0, 0, Math.PI * 2)
  ctx.fill()

  const wheel = (cx: number, cy: number, r: number) => {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = '#111'
    ctx.fill()
    ctx.lineWidth = Math.max(4, r * 0.18)
    ctx.strokeStyle = '#2c2c2c'
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2)
    ctx.strokeStyle = '#d5d5d5'
    ctx.lineWidth = Math.max(2, r * 0.07)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.1, 0, Math.PI * 2)
    ctx.fillStyle = '#eee'
    ctx.fill()
  }

  const rw = h * 0.27
  wheel(w * 0.2, h * 0.7, rw)
  wheel(w * 0.8, h * 0.7, rw * 0.95)

  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = Math.max(6, h * 0.045)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(w * 0.2, h * 0.7)
  ctx.lineTo(w * 0.46, h * 0.6)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(w * 0.18, h * 0.58)
  ctx.bezierCurveTo(w * 0.3, h * 0.16, w * 0.58, h * 0.14, w * 0.74, h * 0.3)
  ctx.lineTo(w * 0.93, h * 0.46)
  ctx.bezierCurveTo(w * 0.99, h * 0.56, w * 0.86, h * 0.68, w * 0.68, h * 0.66)
  ctx.lineTo(w * 0.26, h * 0.7)
  ctx.closePath()
  const body = ctx.createLinearGradient(0, h * 0.15, 0, h * 0.75)
  body.addColorStop(0, '#5ad4f0')
  body.addColorStop(0.5, '#1496c4')
  body.addColorStop(1, '#0b516c')
  ctx.fillStyle = body
  ctx.fill()
  ctx.lineWidth = 5
  ctx.strokeStyle = '#f3e14a'
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(w * 0.64, h * 0.26)
  ctx.quadraticCurveTo(w * 0.8, h * 0.12, w * 0.88, h * 0.34)
  ctx.quadraticCurveTo(w * 0.72, h * 0.32, w * 0.62, h * 0.4)
  ctx.closePath()
  ctx.fillStyle = 'rgba(186, 236, 255, 0.62)'
  ctx.fill()

  ctx.fillStyle = '#d6ff00'
  ctx.beginPath()
  ctx.moveTo(w * 0.38, h * 0.4)
  ctx.lineTo(w * 0.64, h * 0.34)
  ctx.lineTo(w * 0.66, h * 0.43)
  ctx.lineTo(w * 0.4, h * 0.5)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#141414'
  ctx.lineWidth = h * 0.08
  ctx.beginPath()
  ctx.moveTo(w * 0.42, h * 0.4)
  ctx.quadraticCurveTo(w * 0.55, h * 0.32, w * 0.7, h * 0.46)
  ctx.stroke()

  ctx.fillStyle = '#161616'
  ctx.beginPath()
  ctx.ellipse(w * 0.48, h * 0.38, w * 0.12, h * 0.11, -0.55, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#c6f531'
  ctx.beginPath()
  ctx.ellipse(w * 0.6, h * 0.24, w * 0.07, h * 0.095, 0.45, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1b1b1b'
  ctx.beginPath()
  ctx.ellipse(w * 0.645, h * 0.255, w * 0.038, h * 0.05, 0.45, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#111'
  roundBox(ctx, w * 0.5, h * 0.48, w * 0.16, h * 0.16, 6)
  ctx.fillStyle = '#ffe14a'
  ctx.font = `900 ${Math.round(h * 0.12)}px Rajdhani, Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('46', w * 0.58, h * 0.56)

  ctx.restore()
}

function roundBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
  ctx.fill()
}

function drawMiniBike(
  ctx: CanvasRenderingContext2D,
  kind: 'sport' | 'dirt' | 'scooter',
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = '#161616'
  ctx.strokeStyle = '#161616'
  ctx.lineWidth = Math.max(2, h * 0.04)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  const wheel = (cx: number, cy: number, r: number) => {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2)
    ctx.fillStyle = '#ffe14a'
    ctx.fill()
    ctx.fillStyle = '#161616'
  }

  if (kind === 'sport') {
    ctx.beginPath()
    ctx.moveTo(w * 0.16, h * 0.58)
    ctx.quadraticCurveTo(w * 0.42, h * 0.18, w * 0.66, h * 0.3)
    ctx.lineTo(w * 0.9, h * 0.46)
    ctx.lineTo(w * 0.72, h * 0.58)
    ctx.lineTo(w * 0.28, h * 0.66)
    ctx.closePath()
    ctx.fill()
    wheel(w * 0.22, h * 0.7, h * 0.18)
    wheel(w * 0.78, h * 0.7, h * 0.18)
  } else if (kind === 'dirt') {
    ctx.beginPath()
    ctx.moveTo(w * 0.06, h * 0.42)
    ctx.quadraticCurveTo(w * 0.2, h * 0.08, w * 0.38, h * 0.28)
    ctx.lineTo(w * 0.58, h * 0.36)
    ctx.lineTo(w * 0.78, h * 0.3)
    ctx.lineTo(w * 0.86, h * 0.48)
    ctx.lineTo(w * 0.48, h * 0.58)
    ctx.closePath()
    ctx.fill()
    wheel(w * 0.2, h * 0.74, h * 0.2)
    wheel(w * 0.78, h * 0.74, h * 0.2)
  } else {
    ctx.beginPath()
    ctx.moveTo(w * 0.2, h * 0.62)
    ctx.lineTo(w * 0.34, h * 0.16)
    ctx.lineTo(w * 0.52, h * 0.16)
    ctx.lineTo(w * 0.46, h * 0.4)
    ctx.lineTo(w * 0.84, h * 0.48)
    ctx.lineTo(w * 0.7, h * 0.62)
    ctx.lineTo(w * 0.26, h * 0.68)
    ctx.closePath()
    ctx.fill()
    wheel(w * 0.24, h * 0.74, h * 0.18)
    wheel(w * 0.76, h * 0.74, h * 0.14)
  }
  ctx.restore()
}

function drawVertical(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxAlong: number,
  color: string,
  weight: number,
) {
  let size = Math.min(maxAlong / 4.2, 210)
  ctx.font = `${weight} ${size}px Rajdhani, Arial, sans-serif`
  const width = ctx.measureText(text).width
  if (width > maxAlong) size *= maxAlong / width
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(-Math.PI / 2)
  ctx.font = `${weight} ${Math.floor(size)}px Rajdhani, Arial, sans-serif`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

function drawFlag(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w - h * 0.35, y)
  ctx.lineTo(x + w, y + h / 2)
  ctx.lineTo(x + w - h * 0.35, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.clip()
  const colors = ['#111', '#de1c1c', '#f0c020']
  colors.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y + (h / 3) * i, w, h / 3 + 1)
  })
  ctx.restore()
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w - h * 0.35, y)
  ctx.lineTo(x + w, y + h / 2)
  ctx.lineTo(x + w - h * 0.35, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.stroke()
}

function drawFront(
  ctx: CanvasRenderingContext2D,
  x: number,
  w: number,
  h: number,
  logo: HTMLImageElement | null,
) {
  ctx.fillStyle = '#e10613'
  ctx.fillRect(x, h * 0.27, w, h * 0.5)

  const stripe = x + w * 0.045
  ctx.fillStyle = '#1d4ed8'
  ctx.fillRect(stripe, 0, 16, h)
  ctx.fillStyle = '#e10613'
  ctx.fillRect(stripe + 22, 0, 12, h)
  ctx.fillStyle = '#f5c542'
  ctx.fillRect(stripe + 40, 0, 10, h)

  const cx = x + w * 0.56
  paintLogo(ctx, logo, cx, h * 0.135, w * 0.62, h * 0.22)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.font = '700 64px Rajdhani, Arial, sans-serif'
  ctx.fillText('FULLY SYNTHETIC', cx, h * 0.325)
  ctx.fillText('ENGINE OIL', cx - 78, h * 0.385)
  ctx.fillStyle = '#ffe14a'
  ctx.font = '700 64px Rajdhani, Arial, sans-serif'
  ctx.fillText('4T', cx + 196, h * 0.385)

  drawSportbike(ctx, cx - 250, h * 0.41, 500, 230)

  ctx.fillStyle = '#fff'
  ctx.font = '700 108px Rajdhani, Arial, sans-serif'
  ctx.fillText('10W-40', cx, h * 0.69)
  ctx.font = '700 46px Rajdhani, Arial, sans-serif'
  ctx.fillText('API SN   JASO MA', cx, h * 0.75)

  ctx.font = '700 72px Rajdhani, Arial, sans-serif'
  ctx.fillText('NET:', cx, h * 0.86)
  ctx.fillText('1LITER', cx, h * 0.935)
}

function drawSide(ctx: CanvasRenderingContext2D, x: number, w: number, h: number) {
  const footer = h * 0.2
  ctx.fillStyle = '#e10613'
  ctx.fillRect(x, 0, w, h - footer)

  const yellowX = x + w * 0.68
  ctx.fillStyle = '#f5c518'
  ctx.fillRect(yellowX, 0, w * 0.32, h - footer)

  const midY = (h - footer) * 0.52
  const along = (h - footer) * 0.82
  drawVertical(ctx, 'PLATINUM', x + w * 0.2, midY, along, '#ffe14a', 700)
  drawVertical(ctx, 'ULTIMATE PERFORMANCE', x + w * 0.48, midY, along, '#ffffff', 700)
  drawVertical(ctx, 'FULLY SYNTHETIC 10W40 4T', yellowX + w * 0.16, midY, along * 0.92, '#ffffff', 700)

  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(x, h - footer, w, footer)

  const kinds = ['sport', 'dirt', 'scooter'] as const
  const tile = Math.min(w * 0.26, footer * 0.78)
  const gap = (w - tile * 3) / 4
  kinds.forEach((kind, i) => {
    const tx = x + gap + i * (tile + gap)
    const ty = h - footer + (footer - tile * 0.78) / 2
    ctx.fillStyle = '#111'
    ctx.fillRect(tx, ty, tile, tile * 0.78)
    ctx.fillStyle = '#ffe14a'
    ctx.fillRect(tx + 4, ty + 4, tile - 8, tile * 0.78 - 8)
    drawMiniBike(ctx, kind, tx + 8, ty + 6, tile - 16, tile * 0.78 - 14)
  })
}

function drawBack(ctx: CanvasRenderingContext2D, x: number, w: number, h: number) {
  ctx.fillStyle = '#e10613'
  ctx.fillRect(x, h * 0.24, w, h * 0.56)

  const cx = x + w * 0.5
  drawFlag(ctx, cx - 150, h * 0.035, 300, 78)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.font = '700 48px Rajdhani, Arial, sans-serif'
  ctx.fillText('GERMAN TECHNOLOGY', cx, h * 0.145)
  ctx.fillText('GENUINE LUBRICANT', cx, h * 0.195)

  ctx.font = '700 64px Rajdhani, Arial, sans-serif'
  ctx.fillText('FULLY SYNTHETIC', cx, h * 0.3)
  ctx.font = '700 36px Rajdhani, Arial, sans-serif'
  ctx.fillText('SAE 10W-40   API SN   JASO MA2', cx, h * 0.355)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = '500 26px Rajdhani, Arial, sans-serif'
  const bullets = [
    'Suitable for high performance racing 4T engines. Equipped with integrated transmission, wet or dry clutch.',
    'High quality full synthetic base oil, so the engine copes with extreme weather and harsh conditions, with a longer oil change cycle.',
    'Excellent shear stability and viscosity retention for smooth running at high temperature, low temperature, and high speed.',
    'Anti-wear and anti-friction additives help prevent clutch slip, cut component wear, and prolong engine life.',
    'Excellent low temperature start-up, suitable for all-weather use in varied regions.',
  ]
  let yy = h * 0.4
  const textX = x + 48
  const maxW = w - 96
  bullets.forEach((line) => {
    ctx.fillStyle = '#fff'
    ctx.font = '700 26px Rajdhani, Arial, sans-serif'
    ctx.fillText('•', textX, yy)
    ctx.font = '500 26px Rajdhani, Arial, sans-serif'
    yy = wrapText(ctx, line, textX + 28, yy, maxW - 28, 32) + 10
  })

  const logoY = h * 0.9
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.font = '700 54px Rajdhani, Arial, sans-serif'
  ctx.fillText('API', x + w * 0.16, logoY)

  const isoX = x + w * 0.4
  ctx.beginPath()
  ctx.arc(isoX, logoY, 52, 0, Math.PI * 2)
  ctx.lineWidth = 4
  ctx.strokeStyle = '#fff'
  ctx.stroke()
  ctx.font = '700 22px Rajdhani, Arial, sans-serif'
  ctx.fillText('ISO', isoX, logoY - 16)
  ctx.font = '600 16px Rajdhani, Arial, sans-serif'
  ctx.fillText('9001:2015', isoX, logoY + 8)
  ctx.font = '500 13px Rajdhani, Arial, sans-serif'
  ctx.fillText('CERTIFIED', isoX, logoY + 28)

  const dropX = x + w * 0.62
  ctx.beginPath()
  ctx.arc(dropX, logoY, 36, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#e10613'
  ctx.beginPath()
  ctx.moveTo(dropX, logoY - 22)
  ctx.bezierCurveTo(dropX - 16, logoY, dropX - 14, logoY + 16, dropX, logoY + 18)
  ctx.bezierCurveTo(dropX + 14, logoY + 16, dropX + 16, logoY, dropX, logoY - 22)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = '700 28px Rajdhani, Arial, sans-serif'
  ctx.fillText('EELQMS', dropX, logoY + 62)

  const bars = [3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1]
  const barW = 150 / bars.reduce((sum, n) => sum + n, 0)
  let bx = x + w * 0.78
  const by = logoY - 36
  bars.forEach((n, i) => {
    if (i % 2 === 0) {
      ctx.fillStyle = '#f4f4f4'
      ctx.fillRect(bx, by, n * barW, 56)
    }
    bx += n * barW
  })
}

function buildLabelTexture(logo: HTMLImageElement | null) {
  const canvas = document.createElement('canvas')
  canvas.width = LABEL_W
  canvas.height = LABEL_H
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#0b0b0b'
  ctx.fillRect(0, 0, LABEL_W, LABEL_H)

  const frontW = Math.round(LABEL_W * FRONT_U)
  const sideW = Math.round(LABEL_W * SIDE_U)
  const sideX = frontW
  const backX = sideX + sideW
  const backW = LABEL_W - backX

  drawFront(ctx, 0, frontW, LABEL_H, logo)
  drawSide(ctx, sideX, sideW, LABEL_H)
  drawBack(ctx, backX, backW, LABEL_H)

  const sheen = ctx.createLinearGradient(0, 0, LABEL_W, 0)
  sheen.addColorStop(0, 'rgba(255,255,255,0)')
  sheen.addColorStop(0.18, 'rgba(255,255,255,0.05)')
  sheen.addColorStop(0.22, 'rgba(255,255,255,0)')
  sheen.addColorStop(0.55, 'rgba(255,255,255,0.04)')
  sheen.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, LABEL_W, LABEL_H)

  const tex = stamp(new THREE.CanvasTexture(canvas))
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.offset.x = FRONT_U / 2
  return tex
}

function buildLidTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx = size / 2
  const cy = size / 2
  const gold = ctx.createRadialGradient(cx - 30, cy - 80, 40, cx, cy, size * 0.52)
  gold.addColorStop(0, '#f6e7a8')
  gold.addColorStop(0.45, '#e2c56a')
  gold.addColorStop(1, '#a67c2d')
  ctx.fillStyle = gold
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(255,255,255,0.16)'
  ctx.lineWidth = 2
  for (let r = 40; r < 500; r += 14) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(90, 60, 12, 0.55)'
  ctx.font = '700 42px Rajdhani, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('LZ603-007', cx + 1, cy + 340)
  ctx.fillStyle = '#fff4d2'
  ctx.fillText('LZ603-007', cx, cy + 338)
  return stamp(new THREE.CanvasTexture(canvas))
}

function buildCapTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx = size / 2
  const cy = size / 2
  const red = ctx.createRadialGradient(cx - 20, cy - 30, 20, cx, cy, size * 0.5)
  red.addColorStop(0, '#ff4a4a')
  red.addColorStop(0.55, '#e10613')
  red.addColorStop(1, '#9d0010')
  ctx.fillStyle = red
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 10
  for (let i = 0; i < 14; i += 1) {
    const a = (i / 14) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(cx, cy, size * 0.43, a - 0.05, a + 0.05)
    ctx.stroke()
  }

  drawArcText(ctx, 'HOCHZIEHEN', cx, cy, 300, Math.PI * 1.08, Math.PI * 1.42, 34)
  drawArcText(ctx, 'PULL UP', cx, cy, 250, Math.PI * 1.48, Math.PI * 1.72, 48)
  drawArcText(ctx, 'ETIRER', cx, cy, 300, Math.PI * 1.78, Math.PI * 1.98, 34)
  strokeArrowArc(ctx, cx, cy, 190, Math.PI * 1.2, Math.PI * 1.85)

  drawArcText(ctx, 'ABSCHRAUBEN', cx, cy, 300, Math.PI * 0.05, Math.PI * 0.38, 32)
  drawArcText(ctx, 'REMOVE CAP', cx, cy, 250, Math.PI * 0.4, Math.PI * 0.72, 44)
  drawArcText(ctx, 'DEVISSER', cx, cy, 300, Math.PI * 0.74, Math.PI * 0.98, 32)
  strokeArrowArc(ctx, cx, cy, 190, Math.PI * 0.12, Math.PI * 0.82)

  ctx.beginPath()
  ctx.arc(cx, cy, 78, 0, Math.PI * 2)
  ctx.fillStyle = '#c40012'
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = 'rgba(255,230,230,0.85)'
  ctx.stroke()

  return stamp(new THREE.CanvasTexture(canvas))
}

function buildBaseTextures() {
  const size = 1024
  const colorCanvas = document.createElement('canvas')
  const bumpCanvas = document.createElement('canvas')
  colorCanvas.width = bumpCanvas.width = size
  colorCanvas.height = bumpCanvas.height = size
  const ctx = colorCanvas.getContext('2d')!
  const bump = bumpCanvas.getContext('2d')!
  const cx = size / 2
  const cy = size / 2

  const gold = ctx.createRadialGradient(cx, cy - 40, 30, cx, cy, size * 0.5)
  gold.addColorStop(0, '#f3dc8c')
  gold.addColorStop(0.6, '#d7b25a')
  gold.addColorStop(1, '#8d6824')
  ctx.fillStyle = gold
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.lineWidth = 2
  for (let r = 60; r < 480; r += 16) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  bump.fillStyle = '#000'
  bump.fillRect(0, 0, size, size)

  const paint = (target: CanvasRenderingContext2D, fill: string, dy: number) => {
    target.textAlign = 'center'
    target.textBaseline = 'middle'
    target.fillStyle = fill
    target.font = '700 92px Rajdhani, Arial, sans-serif'
    target.fillText('PURELUBE', cx, cy - 30 + dy)
    target.font = '700 42px Rajdhani, Arial, sans-serif'
    target.fillText('MADE IN GERMANY', cx, cy + 58 + dy)
  }

  paint(ctx, 'rgba(255,248,220,0.55)', -2)
  paint(ctx, 'rgba(70, 48, 10, 0.72)', 2)
  paint(bump, '#fff', 0)

  const base = stamp(new THREE.CanvasTexture(colorCanvas))
  const baseBump = stamp(new THREE.CanvasTexture(bumpCanvas), false)
  baseBump.wrapS = baseBump.wrapT = THREE.ClampToEdgeWrapping
  return { base, baseBump }
}

function buildCanTextures(logo: HTMLImageElement | null): CanTextures {
  const { base, baseBump } = buildBaseTextures()
  const label = buildLabelTexture(logo)
  const lid = buildLidTexture()
  const cap = buildCapTexture()
  return {
    label,
    lid,
    cap,
    base,
    baseBump,
    dispose() {
      label.dispose()
      lid.dispose()
      cap.dispose()
      base.dispose()
      baseBump.dispose()
    },
  }
}

function loadLogo() {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = '/img/purelube-logo.png'
  })
}

function CanModel({ held }: { held: MutableRefObject<boolean> }) {
  const group = useRef<THREE.Group>(null)
  const [maps, setMaps] = useState<CanTextures>(() => buildCanTextures(null))
  const mapsRef = useRef(maps)
  mapsRef.current = maps

  useEffect(() => {
    let alive = true
    Promise.all([document.fonts.ready, loadLogo()]).then(([, logo]) => {
      if (!alive) return
      const next = buildCanTextures(logo)
      mapsRef.current.dispose()
      mapsRef.current = next
      setMaps(next)
    })
    return () => {
      alive = false
      mapsRef.current.dispose()
    }
  }, [])

  useFrame((_, dt) => {
    if (group.current && !held.current) group.current.rotation.y -= dt * 0.22
  })

  const radius = 0.82
  const height = 2.62
  const capRadius = radius * 0.46
  const capHeight = 0.075
  const lidY = height / 2 + 0.02

  return (
    <group ref={group} rotation={[0.04, -0.28, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, height, 96, 1, true]} />
        <meshPhysicalMaterial
          map={maps.label}
          metalness={0.08}
          roughness={0.38}
          clearcoat={0.55}
          clearcoatRoughness={0.28}
          side={THREE.FrontSide}
        />
      </mesh>

      {[height / 2, -height / 2].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.05, 20, 80]} />
          <meshStandardMaterial color="#e6c56b" metalness={1} roughness={0.28} />
        </mesh>
      ))}

      <mesh position={[0, lidY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius - 0.02, 80]} />
        <meshStandardMaterial map={maps.lid} color="#ffffff" metalness={0.82} roughness={0.32} />
      </mesh>

      <mesh position={[0, lidY + capHeight / 2, 0]}>
        <cylinderGeometry args={[capRadius, capRadius * 0.98, capHeight, 64, 1, true]} />
        <meshStandardMaterial color="#e10613" metalness={0.05} roughness={0.42} />
      </mesh>
      <mesh position={[0, lidY + capHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[capRadius * 0.98, 64]} />
        <meshStandardMaterial map={maps.cap} metalness={0.04} roughness={0.48} />
      </mesh>
      <mesh position={[0, lidY + 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[capRadius, 0.012, 12, 48]} />
        <meshStandardMaterial color="#f4f4f4" metalness={0.25} roughness={0.4} />
      </mesh>

      <mesh position={[0, -height / 2 - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius - 0.02, 80]} />
        <meshStandardMaterial
          map={maps.base}
          bumpMap={maps.baseBump}
          bumpScale={0.012}
          color="#ffffff"
          metalness={0.62}
          roughness={0.36}
        />
      </mesh>
    </group>
  )
}

export default function Can3D({ className = '' }: { className?: string }) {
  const held = useRef(false)

  return (
    <div className={className} role="img" aria-label="Rotate PureLube can">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 8.6], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <hemisphereLight args={['#ffffff', '#5c4a28', 0.45]} />
          <directionalLight position={[4, 6, 5]} intensity={1.8} />
          <directionalLight position={[-4, 2.5, -3]} intensity={0.65} />
          <directionalLight position={[0, -5, 2]} intensity={0.55} />

          <Bounds fit observe margin={1.22}>
            <Float speed={1.15} rotationIntensity={0.04} floatIntensity={0.28}>
              <CanModel held={held} />
            </Float>
          </Bounds>

          <ContactShadows position={[0, -1.7, 0]} opacity={0.45} scale={7} blur={2.4} far={3} color="#000" />
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.9}
            minPolarAngle={0.02}
            maxPolarAngle={Math.PI - 0.02}
            onStart={() => {
              held.current = true
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
