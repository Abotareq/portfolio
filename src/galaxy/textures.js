import * as THREE from 'three'

/**
 * Procedural planet textures drawn on a canvas at runtime — no image assets.
 * A tiny seeded RNG keeps every planet identical between visits.
 */
function rng(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const rgba = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

/**
 * kind:
 *  'terra'  — oceans + continents + polar caps (About)
 *  'ice'    — pale icy world with fractures (Education)
 *  'rock'   — cratered rocky world (Experience)
 *  'giant'  — banded gas giant (Projects)
 *  'metal'  — smooth banded steel-blue world (Skills)
 *  'beacon' — luminous white-blue world (Contact)
 */
export function planetTexture(kind, seed = 1, w = 1024, h = 512) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const R = rng(seed)

  const palettes = {
    terra: { base: '#0a2f5c', land: '#2f6b3e', land2: '#8a9a4c', cap: '#eef9ff', bandA: '#0d3d6b', bandB: '#082647' },
    ice: { base: '#b9d6e6', land: '#dcefff', land2: '#9fc4dd', cap: '#f4fbff', bandA: '#c9e2f0', bandB: '#a8c8db' },
    rock: { base: '#7a4a35', land: '#a4664a', land2: '#4a2d22', cap: '#c9b7ad', bandA: '#8a5540', bandB: '#5e3a2b' },
    giant: { base: '#12455a', land: '#1e6b7d', land2: '#0b2f3f', cap: '#12455a', bandA: '#2b8d9e', bandB: '#0d3546', bandC: '#d9a441' },
    metal: { base: '#33506a', land: '#46688a', land2: '#22384f', cap: '#4b6c8c', bandA: '#5a7fa3', bandB: '#2a4460' },
    beacon: { base: '#cfeeff', land: '#e9f8ff', land2: '#9fd8f0', cap: '#ffffff', bandA: '#dbf3ff', bandB: '#b9e4f7' },
  }
  const P = palettes[kind] || palettes.terra
  const base = hexToRgb(P.base)

  ctx.fillStyle = P.base
  ctx.fillRect(0, 0, w, h)

  // latitude bands (strong on giants, subtle elsewhere)
  const bandStrength = kind === 'giant' ? 1 : kind === 'metal' ? 0.6 : 0.25
  const bands = kind === 'giant' ? 26 : 14
  for (let i = 0; i < bands; i++) {
    const y0 = (i / bands) * h
    const y1 = ((i + 1) / bands) * h
    const t = 0.5 + 0.5 * Math.sin(i * 1.7 + R() * 0.6)
    let col = mix(hexToRgb(P.bandA), hexToRgb(P.bandB), t)
    if (kind === 'giant' && P.bandC && R() > 0.72) col = mix(col, hexToRgb(P.bandC), 0.55)
    ctx.fillStyle = rgba(col, bandStrength * (0.35 + R() * 0.45))
    ctx.fillRect(0, y0, w, y1 - y0 + 1)
  }

  // turbulence along bands for gas giants
  if (kind === 'giant' || kind === 'metal') {
    for (let i = 0; i < (kind === 'giant' ? 900 : 300); i++) {
      const y = R() * h
      const x = R() * w
      const len = 40 + R() * 260
      const col = mix(hexToRgb(P.bandA), hexToRgb(P.bandB), R())
      ctx.fillStyle = rgba(col, 0.08 + R() * 0.12)
      ctx.beginPath()
      ctx.ellipse(x, y, len, 3 + R() * 9, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    // a great storm
    if (kind === 'giant') {
      const g = ctx.createRadialGradient(w * 0.68, h * 0.62, 4, w * 0.68, h * 0.62, 70)
      g.addColorStop(0, rgba(hexToRgb(P.bandC || P.bandA), 0.9))
      g.addColorStop(1, rgba(hexToRgb(P.bandC || P.bandA), 0))
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(w * 0.68, h * 0.62, 110, 55, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // continents / plates / craters: layered soft blobs
  if (kind === 'terra' || kind === 'ice' || kind === 'rock' || kind === 'beacon') {
    const land = hexToRgb(P.land)
    const land2 = hexToRgb(P.land2)
    const blobs = kind === 'rock' ? 260 : 140
    for (let i = 0; i < blobs; i++) {
      const x = R() * w
      const y = h * 0.12 + R() * h * 0.76
      const r = (kind === 'rock' ? 6 : 18) + R() * (kind === 'rock' ? 26 : 90)
      const col = mix(land, land2, R())
      ctx.fillStyle = rgba(col, kind === 'rock' ? 0.35 + R() * 0.4 : 0.55 + R() * 0.45)
      ctx.beginPath()
      // irregular blob: several overlapping ellipses
      for (let k = 0; k < 4; k++) ctx.ellipse(x + (R() - 0.5) * r, y + (R() - 0.5) * r * 0.6, r * (0.5 + R() * 0.7), r * (0.35 + R() * 0.5), R() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
      // wrap seam
      if (x + r > w) {
        ctx.beginPath()
        ctx.ellipse(x - w, y, r * 0.8, r * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    if (kind === 'rock') {
      // crater rims
      for (let i = 0; i < 70; i++) {
        const x = R() * w
        const y = R() * h
        const r = 4 + R() * 22
        ctx.strokeStyle = rgba(mix(land2, [0, 0, 0], 0.4), 0.45)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.ellipse(x, y, r, r * 0.55, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = rgba(mix(land, [255, 255, 255], 0.2), 0.18)
        ctx.beginPath()
        ctx.ellipse(x, y - r * 0.15, r * 0.8, r * 0.4, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    // polar caps
    const cap = hexToRgb(P.cap)
    const capH = kind === 'ice' ? h * 0.2 : h * 0.09
    const top = ctx.createLinearGradient(0, 0, 0, capH)
    top.addColorStop(0, rgba(cap, 0.95))
    top.addColorStop(1, rgba(cap, 0))
    ctx.fillStyle = top
    ctx.fillRect(0, 0, w, capH)
    const bot = ctx.createLinearGradient(0, h - capH, 0, h)
    bot.addColorStop(0, rgba(cap, 0))
    bot.addColorStop(1, rgba(cap, 0.95))
    ctx.fillStyle = bot
    ctx.fillRect(0, h - capH, w, capH)
  }

  // fine grain
  for (let i = 0; i < 4000; i++) {
    const v = R() > 0.5 ? 255 : 0
    ctx.fillStyle = `rgba(${v},${v},${v},${0.03 + R() * 0.04})`
    ctx.fillRect(R() * w, R() * h, 1 + R() * 2, 1 + R() * 2)
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.anisotropy = 4
  return tex
}

/** Soft cloud layer (transparent) for terra-like worlds. */
export function cloudTexture(seed = 7, w = 1024, h = 512) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const R = rng(seed)
  ctx.clearRect(0, 0, w, h)
  for (let i = 0; i < 420; i++) {
    const x = R() * w
    const y = h * 0.08 + R() * h * 0.84
    const r = 10 + R() * 70
    ctx.fillStyle = `rgba(255,255,255,${0.05 + R() * 0.12})`
    ctx.beginPath()
    ctx.ellipse(x, y, r * (1 + R()), r * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  return tex
}
