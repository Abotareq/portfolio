import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useDeviceTier from '../hooks/useDeviceTier'
import { getPalette } from './palette'
import Particles from './objects/Particles'
import Drift from './objects/Drift'
import { useMaterials, Symbol3D, Laptop, Monitor, Database, GlassPanel, Orbiters, Shape, Cloud, ServerRack, GitGraph, Keyboard } from './objects/DevObjects'

/**
 * WorldScene — a fixed, full-page canvas that sits *behind* every section.
 * Page pixels map to world units (1 unit ≈ 110px); the camera travels down
 * the world as the user scrolls, so 3D objects placed next to each section
 * enter and leave the viewport like scenery. Cursor movement adds parallax.
 */
const S = 1 / 110
const SECTIONS = ['about', 'skills', 'projects', 'experience', 'education', 'github', 'contact']

const PRESETS = {
  low: { particles: 150, dpr: [1, 1], rich: false },
  mid: { particles: 350, dpr: [1, 1.5], rich: true },
  high: { particles: 600, dpr: [1, 2], rich: true },
}

/* Measure section positions → world Y anchors. */
function useLayout() {
  const [layout, setLayout] = useState({ anchors: {}, total: 4000, halfW: 8 })
  useEffect(() => {
    let raf
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const anchors = {}
        SECTIONS.forEach((id) => {
          const el = document.getElementById(id)
          if (el) anchors[id] = { top: el.offsetTop, h: el.offsetHeight }
        })
        const aspect = window.innerWidth / window.innerHeight
        setLayout({ anchors, total: document.documentElement.scrollHeight, halfW: 5.6 * aspect })
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      cancelAnimationFrame(raf)
    }
  }, [])
  return layout
}

/* Camera follows scroll; cursor adds parallax. */
function Rig({ motion }) {
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, dt) => {
    const y = -(window.scrollY + window.innerHeight / 2) * S
    const px = motion ? state.pointer.x : 0
    const py = motion ? state.pointer.y : 0
    target.set(px * 0.9, y + py * 0.4, 12)
    // vertical tracking is tight so objects stay pinned to their sections
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, target.x, dt * 3)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, target.y, Math.min(1, dt * 12))
    state.camera.position.z = 12
    state.camera.lookAt(px * 0.3, state.camera.position.y, 0)
  })
  return null
}

/**
 * Scales / pushes an object in depth based on how far it is from the camera's
 * vertical centre, so scenery grows as it enters and recedes as it leaves.
 * Also spins gently with scroll.
 */
function Approach({ children, position, spin = 0.2, motion }) {
  const g = useRef()
  const { camera } = useThree()
  useFrame(() => {
    if (!g.current) return
    const dy = Math.abs(position[1] - camera.position.y)
    const k = THREE.MathUtils.clamp(1 - dy / 9, 0, 1)
    const e = k * k * (3 - 2 * k)
    g.current.scale.setScalar(0.55 + 0.45 * e)
    g.current.position.set(position[0], position[1], position[2] - (1 - e) * 4)
    // turns as it passes the viewport centre (bounded, so objects keep facing the camera)
    if (motion) g.current.rotation.y = (camera.position.y - position[1]) * spin
  })
  return (
    <group ref={g} position={position}>
      {children}
    </group>
  )
}

function Scenery({ tier, theme, isRTL }) {
  const p = getPalette(theme)
  const m = useMaterials(p)
  const preset = PRESETS[tier]
  const motion = tier !== 'low'
  const { anchors, total, halfW } = useLayout()
  const dir = isRTL ? -1 : 1
  // Objects sit outside the 6xl content column on wide screens and peek in from
  // the edges on narrow ones.
  const side = Math.max(4.8, halfW * 0.94)
  const L = -side * dir
  const R = side * dir

  // y for a fraction of the way through a section
  const at = (id, f = 0.5) => {
    const a = anchors[id]
    if (!a) return null
    return -(a.top + a.h * f) * S
  }

  const items = useMemo(() => {
    const out = []
    const push = (id, f, x, z, node, opts = {}) => {
      const y = at(id, f)
      if (y == null) return
      out.push({ key: `${id}-${out.length}`, pos: [x, y, z], node, ...opts })
    }

    // About — brackets + a glass "card" + orbiting dots
    push("about", 0.35, L * 1.05, -3, (m) => <Symbol3D text="{ }" size={1} depth={0.2} material={m.accent} />)
    push('about', 0.7, R, -3, (m, p) => <GlassPanel m={m} p={p} w={2.4} h={1.4} rows={4} rotation={[0.05, -0.4 * dir, 0]} />)
    push('about', 0.15, R * 0.75, -5, (m) => <Orbiters m={m} radius={1.2} count={3} speed={0.5} tilt={0.9} />)

    // Skills — wireframe polyhedra (the orbit itself lives in the section)
    push('skills', 0.25, R, -3, (m) => <Shape index={0} size={0.9} material={m.wire} />)
    push('skills', 0.8, L * 0.9, -4, (m) => <Shape index={3} size={0.6} material={m.body} />)

    // Projects — monitor, laptop, keyboard, </>
    push('projects', 0.12, L, -2, (m) => <Monitor m={m} scale={0.9} rotation={[0.1, 0.55 * dir, 0]} />)
    push('projects', 0.5, R, -2.5, (m) => <Laptop m={m} scale={0.9} rotation={[0.3, -0.6 * dir, 0]} />)
    if (preset.rich) push('projects', 0.82, L, -3, (m) => <Keyboard m={m} scale={0.8} rotation={[0.9, 0.3 * dir, 0]} />)
    push('projects', 0.3, R * 0.7, -6, (m) => <Symbol3D text="</>" size={0.9} depth={0.15} material={m.wire} />)

    // Experience — infrastructure: server rack, cloud, a torus knot
    push('experience', 0.25, R, -2, (m) => <ServerRack m={m} scale={0.7} units={5} rotation={[0.05, -0.7 * dir, 0]} />)
    push('experience', 0.6, L, -3, (m) => <Cloud m={m} scale={0.85} />)
    if (preset.rich) push('experience', 0.9, R * 0.8, -5, (m) => <Shape index={4} size={0.7} material={m.body} />)

    // Education — low-poly cluster + <>
    push('education', 0.4, L, -2.5, (m) => (
      <group>
        <Shape index={3} size={0.8} material={m.flat} />
        <Shape index={0} size={0.35} material={m.accent} position={[1.2, 0.6, 0.3]} />
        <Shape index={6} size={0.3} material={m.wire} position={[-1.1, -0.5, 0.2]} />
      </group>
    ))
    push('education', 0.6, R, -4, (m) => <Symbol3D text="<>" size={0.9} depth={0.15} material={m.accent} />)

    // GitHub — branch graph + octahedron
    push('github', 0.35, L, -2, (m, p) => <GitGraph m={m} p={p} scale={1.05} />)
    push('github', 0.75, R, -3.5, (m) => <Shape index={1} size={0.8} material={m.wire} />)

    // Contact — database, cloud, glass panel
    push('contact', 0.25, R, -2, (m) => <Database m={m} scale={0.8} />)
    push('contact', 0.55, L, -3, (m) => <Cloud m={m} scale={0.7} />)
    if (preset.rich) push('contact', 0.85, L * 0.8, -4.5, (m, p) => <GlassPanel m={m} p={p} w={2} h={1.2} rows={3} rotation={[0, 0.4 * dir, 0]} />)

    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchors, L, R, dir, preset.rich])

  const totalUnits = total * S

  return (
    <>
      <fog attach="fog" args={[p.fog, 15, 30]} />
      <ambientLight intensity={p.ambient + 0.25} />
      <directionalLight position={[4, 8, 8]} intensity={1.6} color="#dffbff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.45} color={p.accent} />

      {/* page-spanning particle field, parallaxed by depth */}
      <Particles count={preset.particles} spread={[halfW + 4, totalUnits / 2, 4]} center={[0, -totalUnits / 2, -4]} size={0.03} color={p.particle} opacity={theme === 'dark' ? 0.4 : 0.5} drift={0.25} motion={motion} />

      <Suspense fallback={null}>
        {items.map((it, i) => (
          <Approach key={it.key} position={it.pos} motion={motion} spin={0.18 * (i % 2 ? 1 : -1)}>
            <Drift seed={i * 1.7} speed={0.5 + (i % 3) * 0.15} bob={0.22} rotate={[0.02, 0.1, 0.01]} motion={motion}>
              {it.node(m, p)}
            </Drift>
          </Approach>
        ))}
      </Suspense>

      <Rig motion={motion} />
    </>
  )
}

export default function WorldScene({ theme = 'dark', isRTL = false }) {
  const tier = useDeviceTier()
  const preset = PRESETS[tier]
  const [visible, setVisible] = useState(true)
  // The scenery needs room outside the content column; below 1280px it would
  // sit behind the cards, so it is not mounted at all there.
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1280)
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    const onResize = () => setWide(window.innerWidth >= 1280)
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  if (!wide) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={preset.dpr}
        camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 40 }}
        gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
      >
        <Scenery tier={tier} theme={theme} isRTL={isRTL} />
      </Canvas>
    </div>
  )
}
