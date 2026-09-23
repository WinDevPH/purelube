import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, ContactShadows, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Product 2 — 1L gold plastic container.
 * Same turntable as the can: full spin, tilt to cap and base,
 * front + back labels, molded gold body (not a flat card).
 */

const LABEL_W = 1024
const LABEL_H = 1400

type BottleTextures = {
  front: THREE.CanvasTexture
  back: THREE.CanvasTexture
  labelAspect: number
  gold: THREE.CanvasTexture
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

function drawHoneycomb(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#ffe566')
  bg.addColorStop(0.55, '#f6cf3a')
  bg.addColorStop(1, '#efc02a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const size = 34
  const hexH = size * Math.sqrt(3)
  ctx.strokeStyle = 'rgba(214, 164, 28, 0.42)'
  ctx.lineWidth = 2.2
  for (let row = -1; row < h / (hexH * 0.5) + 3; row += 1) {
    for (let col = -1; col < w / (size * 1.5) + 3; col += 1) {
      const x = col * size * 1.5 + (row % 2 ? size * 0.75 : 0)
      const y = row * hexH * 0.5
      ctx.beginPath()
      for (let i = 0; i < 6; i += 1) {
        const a = (Math.PI / 3) * i - Math.PI / 6
        const px = x + Math.cos(a) * size * 0.5
        const py = y + Math.sin(a) * size * 0.5
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
    }
  }
}

function drawDEFlag(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const colors = ['#111', '#dd0000', '#ffce00']
  colors.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y + (h / 3) * i, w, h / 3 + 1)
  })
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'
  ctx.lineWidth = 2
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2)
}

function drawEagle(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.fillStyle = '#1a1a1a'
  ctx.strokeStyle = '#c9a227'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, -s * 0.48)
  ctx.lineTo(s * 0.38, -s * 0.08)
  ctx.lineTo(s * 0.22, -s * 0.04)
  ctx.lineTo(s * 0.42, s * 0.22)
  ctx.lineTo(s * 0.12, s * 0.08)
  ctx.lineTo(0, s * 0.46)
  ctx.lineTo(-s * 0.12, s * 0.08)
  ctx.lineTo(-s * 0.42, s * 0.22)
  ctx.lineTo(-s * 0.22, -s * 0.04)
  ctx.lineTo(-s * 0.38, -s * 0.08)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

function drawWheel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a1a'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x, y, r * 0.42, 0, Math.PI * 2)
  ctx.fillStyle = '#d8d8d8'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x, y, r * 0.16, 0, Math.PI * 2)
  ctx.fillStyle = '#222'
  ctx.fill()
}

function drawSedan(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = 'rgba(0,0,0,0.16)'
  ctx.beginPath()
  ctx.ellipse(w * 0.5, h * 0.9, w * 0.42, h * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#d21f24'
  ctx.beginPath()
  ctx.moveTo(w * 0.08, h * 0.58)
  ctx.lineTo(w * 0.22, h * 0.58)
  ctx.lineTo(w * 0.32, h * 0.32)
  ctx.lineTo(w * 0.7, h * 0.32)
  ctx.lineTo(w * 0.82, h * 0.58)
  ctx.lineTo(w * 0.94, h * 0.58)
  ctx.quadraticCurveTo(w * 0.98, h * 0.72, w * 0.9, h * 0.74)
  ctx.lineTo(w * 0.1, h * 0.74)
  ctx.quadraticCurveTo(w * 0.02, h * 0.72, w * 0.08, h * 0.58)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#8fd4ee'
  ctx.beginPath()
  ctx.moveTo(w * 0.34, h * 0.36)
  ctx.lineTo(w * 0.5, h * 0.36)
  ctx.lineTo(w * 0.5, h * 0.56)
  ctx.lineTo(w * 0.26, h * 0.56)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#6ec4e4'
  ctx.fillRect(w * 0.52, h * 0.36, w * 0.16, h * 0.2)
  drawWheel(ctx, w * 0.26, h * 0.74, h * 0.13)
  drawWheel(ctx, w * 0.76, h * 0.74, h * 0.13)
  ctx.restore()
}

function drawPickup(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = 'rgba(0,0,0,0.16)'
  ctx.beginPath()
  ctx.ellipse(w * 0.5, h * 0.9, w * 0.44, h * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1d4f9a'
  ctx.beginPath()
  ctx.moveTo(w * 0.06, h * 0.52)
  ctx.lineTo(w * 0.28, h * 0.52)
  ctx.lineTo(w * 0.36, h * 0.3)
  ctx.lineTo(w * 0.58, h * 0.3)
  ctx.lineTo(w * 0.62, h * 0.52)
  ctx.lineTo(w * 0.94, h * 0.52)
  ctx.lineTo(w * 0.94, h * 0.72)
  ctx.lineTo(w * 0.06, h * 0.72)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#7ec8e8'
  ctx.fillRect(w * 0.38, h * 0.34, w * 0.18, h * 0.18)
  ctx.fillStyle = '#163e7a'
  ctx.fillRect(w * 0.64, h * 0.54, w * 0.28, h * 0.08)
  drawWheel(ctx, w * 0.24, h * 0.74, h * 0.13)
  drawWheel(ctx, w * 0.78, h * 0.74, h * 0.13)
  ctx.restore()
}

function drawSUV(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = 'rgba(0,0,0,0.16)'
  ctx.beginPath()
  ctx.ellipse(w * 0.5, h * 0.9, w * 0.44, h * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#6a4a2a'
  ctx.beginPath()
  ctx.moveTo(w * 0.08, h * 0.5)
  ctx.lineTo(w * 0.2, h * 0.5)
  ctx.lineTo(w * 0.28, h * 0.28)
  ctx.lineTo(w * 0.78, h * 0.28)
  ctx.lineTo(w * 0.9, h * 0.5)
  ctx.lineTo(w * 0.94, h * 0.5)
  ctx.lineTo(w * 0.94, h * 0.72)
  ctx.lineTo(w * 0.06, h * 0.72)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#9ad4ea'
  ctx.fillRect(w * 0.3, h * 0.32, w * 0.16, h * 0.18)
  ctx.fillRect(w * 0.5, h * 0.32, w * 0.24, h * 0.18)
  drawWheel(ctx, w * 0.24, h * 0.74, h * 0.14)
  drawWheel(ctx, w * 0.78, h * 0.74, h * 0.14)
  ctx.restore()
}

function drawFront(ctx: CanvasRenderingContext2D, logo: HTMLImageElement | null) {
  const w = LABEL_W
  const h = LABEL_H
  drawHoneycomb(ctx, w, h)

  paintLogo(ctx, logo, w * 0.5, h * 0.13, w * 0.42, h * 0.16)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#141414'
  ctx.font = '800 64px Rajdhani, Arial, sans-serif'
  ctx.fillText('PLATINUM', w * 0.5, h * 0.235)
  ctx.font = '800 28px Rajdhani, Arial, sans-serif'
  ctx.fillStyle = '#2a2a2a'
  ctx.fillText('ULTIMATE PERFORMANCE', w * 0.5, h * 0.275)

  drawEagle(ctx, w * 0.2, h * 0.355, 72)

  const specs = ['FULLY SYNTHETIC', 'SAE 5W-40', 'API SP / CK-4', 'ACEA A3 / B4']
  ctx.textAlign = 'left'
  ctx.fillStyle = '#141414'
  ctx.font = '800 36px Rajdhani, Arial, sans-serif'
  specs.forEach((line, i) => ctx.fillText(line, w * 0.08, h * 0.44 + i * 42))

  ctx.font = '800 32px Rajdhani, Arial, sans-serif'
  ctx.fillText('FOR GASOLINE & DIESEL', w * 0.08, h * 0.64)
  ctx.fillText('ENGINES', w * 0.08, h * 0.678)
  ctx.fillText('MILEAGE 10,000 KM', w * 0.08, h * 0.72)
  ctx.fillText('NET: 1 LITER', w * 0.08, h * 0.768)

  drawSedan(ctx, w * 0.5, h * 0.3, 460, 180)
  drawPickup(ctx, w * 0.5, h * 0.455, 460, 180)
  drawSUV(ctx, w * 0.5, h * 0.61, 460, 180)

  ctx.fillStyle = '#1d3fb8'
  ctx.fillRect(0, h * 0.84, w, h * 0.16)
  drawDEFlag(ctx, w * 0.08, h * 0.875, 120, 78)
  ctx.textAlign = 'left'
  ctx.fillStyle = '#fff'
  ctx.font = '800 48px Rajdhani, Arial, sans-serif'
  ctx.fillText('MADE IN', w * 0.26, h * 0.905)
  ctx.fillText('GERMANY', w * 0.26, h * 0.955)
}

function drawBack(ctx: CanvasRenderingContext2D) {
  const w = LABEL_W
  const h = LABEL_H
  drawHoneycomb(ctx, w, h)

  ctx.save()
  ctx.translate(w * 0.5, h * 0.09)
  ctx.rotate(-0.18)
  drawDEFlag(ctx, -70, -28, 140, 56)
  ctx.restore()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#1a1a1a'
  ctx.font = '800 40px Rajdhani, Arial, sans-serif'
  ctx.fillText('GERMAN TECHNOLOGY', w * 0.5, h * 0.16)
  ctx.fillText('ADVANCED FORMULA', w * 0.5, h * 0.2)

  ctx.fillStyle = '#1d3fb8'
  ctx.fillRect(0, h * 0.23, w, 48)
  ctx.fillStyle = '#fff'
  ctx.font = '800 26px Rajdhani, Arial, sans-serif'
  ctx.fillText('GUARANTEED GENUINE LUBRICANT', w * 0.5, h * 0.248)

  ctx.fillStyle = '#1a1a1a'
  ctx.font = '800 28px Rajdhani, Arial, sans-serif'
  ctx.fillText('MEETS PERFORMANCE STANDARD', w * 0.5, h * 0.3)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = '600 22px Rajdhani, Arial, sans-serif'
  wrapText(
    ctx,
    'PureLube Fully Synthetic multi-grade motor oils are superior quality, all-season high performance products formulated from high quality synthetic base fluids and high-speed circuit proven additives technology meeting and exceeding API & SAE specifications. Highly shear stable automotive crankcase oil for gasoline and diesel cars, vans and light trucks.',
    56,
    h * 0.33,
    w - 112,
    28,
  )

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '800 28px Rajdhani, Arial, sans-serif'
  ctx.fillText('BENEFITS', w * 0.5, h * 0.58)

  const benefits = [
    'Maximum power and fuel economy',
    'Prolongs engine life under severe conditions',
    'Reduces maintenance costs',
    'Thermal stability and oxidation resistance',
    'Lower oil consumption from a shear-stable formula',
  ]
  ctx.textAlign = 'left'
  ctx.font = '700 22px Rajdhani, Arial, sans-serif'
  benefits.forEach((line, i) => {
    ctx.fillText(`•  ${line}`, 64, h * 0.62 + i * 30)
  })

  ctx.textAlign = 'center'
  ctx.font = '800 36px Rajdhani, Arial, sans-serif'
  ctx.fillText('API', w * 0.18, h * 0.84)
  ctx.beginPath()
  ctx.arc(w * 0.38, h * 0.84, 40, 0, Math.PI * 2)
  ctx.lineWidth = 4
  ctx.strokeStyle = '#1a1a1a'
  ctx.stroke()
  ctx.font = '700 16px Rajdhani, Arial, sans-serif'
  ctx.fillText('ISO', w * 0.38, h * 0.828)
  ctx.font = '600 12px Rajdhani, Arial, sans-serif'
  ctx.fillText('9001:2015', w * 0.38, h * 0.852)

  ctx.textAlign = 'left'
  ctx.font = '700 18px Rajdhani, Arial, sans-serif'
  wrapText(
    ctx,
    'Manufactured by PureLube Lubricant GmbH · Am Haupttor, Gebäude 4609 · 06237 Leuna, Germany',
    w * 0.52,
    h * 0.81,
    w * 0.4,
    22,
  )
}

function buildGoldTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, size, size)
  g.addColorStop(0, '#f6e7a8')
  g.addColorStop(0.35, '#e2c56a')
  g.addColorStop(0.7, '#c9a227')
  g.addColorStop(1, '#a67c2d')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 4200; i += 1) {
    const x = Math.random() * size
    const y = Math.random() * size
    const a = 0.04 + Math.random() * 0.08
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,245,200,${a})` : `rgba(90,60,12,${a})`
    ctx.fillRect(x, y, 2, 2)
  }
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
  const gold = ctx.createRadialGradient(cx - 40, cy - 80, 30, cx, cy, size * 0.52)
  gold.addColorStop(0, '#f7e7b0')
  gold.addColorStop(0.45, '#e2c56a')
  gold.addColorStop(1, '#9a7324')
  ctx.fillStyle = gold
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(80, 55, 10, 0.28)'
  ctx.lineWidth = 3
  for (let r = 36; r < 500; r += 12) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 2
  for (let r = 42; r < 500; r += 12) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }
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
  bump.fillStyle = '#000'
  bump.fillRect(0, 0, size, size)

  const paint = (target: CanvasRenderingContext2D, fill: string, dy: number) => {
    target.textAlign = 'center'
    target.textBaseline = 'middle'
    target.fillStyle = fill
    target.font = '700 84px Rajdhani, Arial, sans-serif'
    target.fillText('PURELUBE', cx, cy - 24 + dy)
    target.font = '700 40px Rajdhani, Arial, sans-serif'
    target.fillText('1L  ·  MADE IN GERMANY', cx, cy + 52 + dy)
  }
  paint(ctx, 'rgba(255,248,220,0.55)', -2)
  paint(ctx, 'rgba(70, 48, 10, 0.72)', 2)
  paint(bump, '#fff', 0)

  return {
    base: stamp(new THREE.CanvasTexture(colorCanvas)),
    baseBump: stamp(new THREE.CanvasTexture(bumpCanvas), false),
  }
}

function buildLabel(draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = LABEL_W
  canvas.height = LABEL_H
  const ctx = canvas.getContext('2d')!
  draw(ctx)
  return stamp(new THREE.CanvasTexture(canvas))
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(src))
    img.src = src
  })
}

function extractLabelFromPhoto(
  img: HTMLImageElement,
  inset: { t: number; b: number; l: number; r: number },
): THREE.CanvasTexture | null {
  const w = img.naturalWidth
  const h = img.naturalHeight
  if (!w || !h) return null

  const src = document.createElement('canvas')
  src.width = w
  src.height = h
  const ctx = src.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, w, h)
  const d = data.data

  let minX = w
  let minY = h
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * 4
      const r = d[i]
      const g = d[i + 1]
      const b = d[i + 2]
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const sat = max === 0 ? 0 : (max - min) / max
      const lum = (r + g + b) / 3
      if (lum > 246 && sat < 0.08) continue
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  const bw = maxX - minX
  const bh = maxY - minY
  if (bw < 80 || bh < 80) return null

  const x0 = minX + bw * inset.l
  const y0 = minY + bh * inset.t
  const lw = Math.round(bw * (1 - inset.l - inset.r))
  const lh = Math.round(bh * (1 - inset.t - inset.b))
  if (lw < 80 || lh < 80) return null

  const out = document.createElement('canvas')
  out.width = lw
  out.height = lh
  out.getContext('2d')!.drawImage(src, x0, y0, lw, lh, 0, 0, lw, lh)
  return stamp(new THREE.CanvasTexture(out))
}

function buildBottleTextures(
  logo: HTMLImageElement | null,
  frontImg?: HTMLImageElement | null,
  backImg?: HTMLImageElement | null,
): BottleTextures {
  const front =
    (frontImg && extractLabelFromPhoto(frontImg, { t: 0.408, b: 0.09, l: 0.178, r: 0.178 })) ||
    buildLabel((ctx) => drawFront(ctx, logo))
  const back =
    (backImg && extractLabelFromPhoto(backImg, { t: 0.378, b: 0.08, l: 0.175, r: 0.175 })) ||
    buildLabel(drawBack)
  const gold = buildGoldTexture()
  const cap = buildCapTexture()
  const { base, baseBump } = buildBaseTextures()
  return {
    front,
    back,
    labelAspect: (front.image as HTMLCanvasElement).width / (front.image as HTMLCanvasElement).height,
    gold,
    cap,
    base,
    baseBump,
    dispose() {
      front.dispose()
      back.dispose()
      gold.dispose()
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

function makeBottleBodyGeometry() {
  const s = new THREE.Shape()
  s.moveTo(-0.74, -1.14)
  s.lineTo(0.74, -1.14)
  s.lineTo(0.74, 0.42)
  s.quadraticCurveTo(0.74, 0.62, 0.52, 0.82)
  s.quadraticCurveTo(0.22, 1.16, -0.16, 1.26)
  s.lineTo(-0.5, 1.26)
  s.quadraticCurveTo(-0.74, 1.26, -0.74, 1.0)
  s.lineTo(-0.74, -1.14)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.52,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 4,
    curveSegments: 20,
  })
  geo.translate(0, 0, -0.26)
  geo.computeVertexNormals()
  return geo
}

function GoldPlastic({ map }: { map: THREE.CanvasTexture }) {
  return (
    <meshPhysicalMaterial
      map={map}
      color="#f0d27a"
      metalness={0.72}
      roughness={0.3}
      clearcoat={0.5}
      clearcoatRoughness={0.32}
    />
  )
}

function BottleModel({ held }: { held: MutableRefObject<boolean> }) {
  const group = useRef<THREE.Group>(null)
  const [maps, setMaps] = useState<BottleTextures>(() => buildBottleTextures(null))
  const mapsRef = useRef(maps)
  mapsRef.current = maps
  const bodyGeo = useMemo(() => makeBottleBodyGeometry(), [])

  useEffect(() => {
    return () => bodyGeo.dispose()
  }, [bodyGeo])

  useEffect(() => {
    let alive = true
    Promise.all([
      document.fonts.ready,
      loadLogo(),
      loadImage('/img/platinum-5w40-front-exact.png').catch(() => null),
      loadImage('/img/platinum-5w40-back-exact.png').catch(() => null),
    ]).then(([, logo, frontImg, backImg]) => {
      if (!alive) return
      const next = buildBottleTextures(logo, frontImg, backImg)
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

  const bodyD = 0.52
  const neckX = -0.38
  const neckR = 0.118
  const capR = 0.15
  const neckH = 0.2
  const capH = 0.22
  const neckY = 1.26 + neckH / 2
  const capY = neckY + neckH / 2 + capH / 2
  const labelH = 1.82
  const labelW = Math.min(1.32, labelH * maps.labelAspect)
  const labelZ = bodyD / 2 + 0.08

  return (
    <group ref={group} rotation={[0.04, Math.PI + 0.16, 0]}>
      <mesh geometry={bodyGeo} castShadow>
        <GoldPlastic map={maps.gold} />
      </mesh>

      <mesh position={[neckX, neckY, 0]} castShadow>
        <cylinderGeometry args={[neckR, neckR * 1.04, neckH, 48]} />
        <GoldPlastic map={maps.gold} />
      </mesh>
      <mesh position={[neckX, neckY - neckH / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[neckR * 1.06, 0.018, 12, 36]} />
        <meshStandardMaterial color="#e6c56b" metalness={0.85} roughness={0.28} />
      </mesh>

      <mesh position={[neckX, capY, 0]} castShadow>
        <cylinderGeometry args={[capR, capR * 0.98, capH, 64]} />
        <GoldPlastic map={maps.gold} />
      </mesh>
      <mesh position={[neckX, capY + capH / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[capR * 0.98, 64]} />
        <meshStandardMaterial map={maps.cap} color="#ffffff" metalness={0.78} roughness={0.28} />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2
        return (
          <mesh key={i} position={[neckX + Math.cos(a) * capR, capY, Math.sin(a) * capR]}>
            <boxGeometry args={[0.018, capH * 0.72, 0.03]} />
            <meshStandardMaterial color="#d4b24a" metalness={0.7} roughness={0.35} />
          </mesh>
        )
      })}

      <mesh position={[0, -0.12, labelZ]}>
        <planeGeometry args={[labelW, labelH]} />
        <meshPhysicalMaterial
          map={maps.front}
          roughness={0.42}
          metalness={0.04}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>
      <mesh position={[0, -0.12, -labelZ]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[labelW, labelH]} />
        <meshPhysicalMaterial
          map={maps.back}
          roughness={0.42}
          metalness={0.04}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>

      <mesh position={[0, -1.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 48]} />
        <meshStandardMaterial
          map={maps.base}
          bumpMap={maps.baseBump}
          bumpScale={0.01}
          color="#ffffff"
          metalness={0.62}
          roughness={0.36}
        />
      </mesh>
    </group>
  )
}

export default function Bottle3D({ className = '' }: { className?: string }) {
  const held = useRef(false)

  return (
    <div className={className} role="img" aria-label="Rotate PureLube bottle">
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
              <BottleModel held={held} />
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
