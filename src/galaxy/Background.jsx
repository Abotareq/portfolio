import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ACCENT = '#22D3EE'

/* ------------------------------------------------------------------ */
/* Procedural textures (no external assets)                            */
/* ------------------------------------------------------------------ */
function radialTexture(stops, size = 256) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, col]) => g.addColorStop(o, col))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function spiralTexture(size = 256) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const cx = size / 2
  const core = ctx.createRadialGradient(cx, cx, 0, cx, cx, size / 2)
  core.addColorStop(0, 'rgba(230,245,255,0.9)')
  core.addColorStop(0.25, 'rgba(120,200,230,0.35)')
  core.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = core
  ctx.fillRect(0, 0, size, size)
  // two faint arms
  ctx.globalCompositeOperation = 'lighter'
  for (let arm = 0; arm < 2; arm++) {
    for (let i = 0; i < 220; i++) {
      const t = i / 220
      const a = t * Math.PI * 2.6 + arm * Math.PI
      const r = 6 + t * (size / 2 - 10)
      const x = cx + Math.cos(a) * r
      const y = cx + Math.sin(a) * r * 0.55
      ctx.fillStyle = `rgba(140,210,240,${0.18 * (1 - t)})`
      ctx.beginPath()
      ctx.arc(x, y, 2 + (1 - t) * 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ------------------------------------------------------------------ */
/* Star layers: three Points clouds at different depths/sizes/speeds   */
/* ------------------------------------------------------------------ */
function StarLayer({ count, radius, size, speed, opacity, color, twinkle = 0.4 }) {
  const ref = useRef()
  const mat = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = radius * (0.55 + Math.random() * 0.45)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi) - 50
    }
    return arr
  }, [count, radius])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  useFrame((state, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed
    if (mat.current) mat.current.opacity = opacity * (1 - twinkle * 0.5 + Math.sin(state.clock.elapsedTime * 0.8 + size * 10) * twinkle * 0.5)
  })

  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial ref={mat} size={size} sizeAttenuation color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

export function StarField({ tier }) {
  const n = tier === 'low' ? 0.35 : tier === 'mid' ? 0.65 : 1
  return (
    <group>
      <StarLayer count={Math.round(2600 * n)} radius={160} size={0.12} speed={0.004} opacity={0.55} color="#cfefff" />
      <StarLayer count={Math.round(1400 * n)} radius={110} size={0.22} speed={0.007} opacity={0.75} color="#ffffff" />
      <StarLayer count={Math.round(400 * n)} radius={80} size={0.4} speed={0.011} opacity={0.9} color="#a5f3fc" twinkle={0.7} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Nebulae: large additive sprites drifting far behind the journey     */
/* ------------------------------------------------------------------ */
export function Nebulae({ tier }) {
  const tex = useMemo(
    () => ({
      cyan: radialTexture([
        [0, 'rgba(34,211,238,0.35)'],
        [0.35, 'rgba(14,116,144,0.18)'],
        [0.7, 'rgba(8,47,73,0.06)'],
        [1, 'rgba(0,0,0,0)'],
      ]),
      violet: radialTexture([
        [0, 'rgba(167,139,250,0.28)'],
        [0.4, 'rgba(91,63,180,0.12)'],
        [1, 'rgba(0,0,0,0)'],
      ]),
      warm: radialTexture([
        [0, 'rgba(251,191,36,0.16)'],
        [0.4, 'rgba(180,90,40,0.07)'],
        [1, 'rgba(0,0,0,0)'],
      ]),
    }),
    []
  )
  const clouds = useMemo(
    () => [
      { t: 'cyan', p: [-30, 12, -40], s: 70 },
      { t: 'violet', p: [36, -10, -75], s: 80 },
      { t: 'cyan', p: [10, 18, -120], s: 90 },
      { t: 'warm', p: [-28, -16, -100], s: 60 },
      { t: 'violet', p: [-6, 6, -150], s: 110 },
    ],
    []
  )
  const shown = tier === 'low' ? clouds.slice(0, 3) : clouds
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    group.current.children.forEach((c, i) => {
      c.material.rotation = state.clock.elapsedTime * 0.01 * (i % 2 ? 1 : -1)
    })
  })
  return (
    <group ref={group}>
      {shown.map((c, i) => (
        <sprite key={i} position={c.p} scale={[c.s, c.s * 0.75, 1]}>
          <spriteMaterial map={tex[c.t]} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.9} />
        </sprite>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Distant galaxies: tiny spiral sprites at the edge of the fog        */
/* ------------------------------------------------------------------ */
export function DistantGalaxies({ tier }) {
  const tex = useMemo(() => spiralTexture(), [])
  const items = useMemo(
    () => [
      { p: [-48, 22, -60], s: 9, r: 0.4 },
      { p: [55, 14, -95], s: 12, r: -0.7 },
      { p: [-40, -24, -130], s: 14, r: 0.2 },
      { p: [30, 30, -140], s: 8, r: 1.1 },
    ],
    []
  )
  const shown = tier === 'low' ? items.slice(0, 2) : items
  return (
    <group>
      {shown.map((g, i) => (
        <sprite key={i} position={g.p} scale={[g.s, g.s * 0.6, 1]}>
          <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} rotation={g.r} />
        </sprite>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Dust: near-camera fine particles that drift, giving parallax        */
/* ------------------------------------------------------------------ */
export function Dust({ count = 600 }) {
  const ref = useRef()
  const data = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30
      arr[i * 3 + 2] = -Math.random() * 120 + 10
    }
    return arr
  }, [count])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data, 3))
    return g
  }, [data])
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.6
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.02
  })
  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial size={0.05} sizeAttenuation color={ACCENT} transparent opacity={0.35} depthWrite={false} />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Asteroid belts: one instanced mesh per belt, slowly tumbling        */
/* ------------------------------------------------------------------ */
export function AsteroidBelt({ center = [0, 0, 0], radius = 8, thickness = 1.5, count = 120, tilt = 0.3, speed = 0.02, color = '#1f4560' }) {
  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        a: Math.random() * Math.PI * 2,
        r: radius + (Math.random() - 0.5) * thickness,
        y: (Math.random() - 0.5) * thickness * 0.5,
        s: 0.05 + Math.random() * 0.13,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        spin: 0.2 + Math.random() * 0.6,
      })),
    [count, radius, thickness]
  )
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    items.forEach((it, i) => {
      const a = it.a + t * speed
      dummy.position.set(Math.cos(a) * it.r, it.y, Math.sin(a) * it.r)
      dummy.rotation.set(it.rx + t * it.spin * 0.3, it.ry + t * it.spin * 0.5, 0)
      dummy.scale.setScalar(it.s)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <group position={center} rotation={[tilt, 0, tilt * 0.4]}>
      <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} flatShading />
      </instancedMesh>
    </group>
  )
}
