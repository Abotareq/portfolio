import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useDeviceTier from '../hooks/useDeviceTier'
import { getPalette } from './palette'
import Particles from './objects/Particles'
import Drift from './objects/Drift'
import ConnectionLines from './objects/ConnectionLines'
import { useMaterials, Symbol3D, Laptop, Database, GlassPanel, Orbiters, Grid3D, Shape, Cloud, ServerRack } from './objects/DevObjects'

/* --------------------------- quality presets --------------------------- */
const PRESETS = {
  low: { bg: 250, fg: 60, shapes: 4, dpr: [1, 1.25], symbols: 2, panels: 1, objects: false },
  mid: { bg: 700, fg: 120, shapes: 6, dpr: [1, 1.5], symbols: 4, panels: 2, objects: true },
  high: { bg: 1400, fg: 220, shapes: 8, dpr: [1, 2], symbols: 6, panels: 3, objects: true },
}

const SYMBOLS = ['{ }', '</>', '<>', '=>', '( )', '[ ]']

/* Cursor → world position on the z=0 plane, shared with every object. */
function PointerTracker({ pointer, active }) {
  const { camera } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    if (!active) {
      pointer.current = null
      return
    }
    ray.setFromCamera(state.pointer, camera)
    if (ray.ray.intersectPlane(plane, hit)) pointer.current = hit
  })
  return null
}

/* Camera rig: mouse parallax + scroll dolly. */
function Rig({ scrollRef, offsetX, motion }) {
  const target = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, dt) => {
    const s = scrollRef.current
    const px = motion ? state.pointer.x : 0
    const py = motion ? state.pointer.y : 0
    target.set(px * 1.1 + offsetX * 0.35, py * 0.6 + 0.2 - s * 2.5, 9 + s * 5)
    state.camera.position.lerp(target, Math.min(1, dt * 2.5))
    look.set(offsetX * 0.35 + px * 0.2, -s * 1.5 + py * 0.1, 0)
    state.camera.lookAt(look)
  })
  return null
}

/* Slow global rotation of the composition following the cursor. */
function Sway({ children, amount = 0.12 }) {
  const g = useRef()
  useFrame((state, dt) => {
    if (!g.current) return
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, state.pointer.x * amount, dt * 2)
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -state.pointer.y * amount * 0.6, dt * 2)
  })
  return <group ref={g}>{children}</group>
}

/* ------------------------------ core object ----------------------------- */
function Core({ m, p, motion }) {
  const outer = useRef()
  const inner = useRef()
  const ring = useRef()
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const k = motion ? 1 : 0.15
    if (outer.current) {
      outer.current.rotation.y += dt * 0.15 * k
      outer.current.rotation.z = Math.sin(t * 0.3) * 0.15 * k
    }
    if (inner.current) {
      inner.current.rotation.x -= dt * 0.35 * k
      inner.current.rotation.y += dt * 0.25 * k
      inner.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.04 * k)
    }
    if (ring.current) ring.current.rotation.z -= dt * 0.2 * k
  })
  return (
    <group>
      <mesh ref={outer} material={m.wire}>
        <icosahedronGeometry args={[1.6, 1]} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshStandardMaterial color={p.meshDark} emissive={p.accent} emissiveIntensity={p.glowIntensity * 0.7} metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh ref={ring} material={m.wire} rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[2.1, 0.006, 4, 96]} />
      </mesh>
      <Orbiters m={m} radius={2.4} count={3} speed={0.35} tilt={1.1} />
      <Orbiters m={m} radius={1.95} count={2} speed={-0.5} tilt={-0.7} size={0.045} />
      <pointLight color={p.accent} intensity={motion ? 3 : 1.5} distance={8} decay={2} />
    </group>
  )
}

/* -------------------------------- scene -------------------------------- */
function Scene({ tier, theme, scrollRef, offsetX, isRTL }) {
  const p = getPalette(theme)
  const m = useMaterials(p)
  const preset = PRESETS[tier]
  const motion = tier !== 'low'
  const pointer = useRef(null)
  const dir = isRTL ? -1 : 1

  // Floating abstract shapes on a ring around the core, at varying depth.
  const shapeRefs = useMemo(() => Array.from({ length: preset.shapes }, () => ({ current: null })), [preset.shapes])
  const shapes = useMemo(
    () =>
      Array.from({ length: preset.shapes }, (_, i) => {
        // angles restricted to the right-facing arc; the copy lives on the left
        const a = -1.9 + (i / Math.max(1, preset.shapes - 1)) * 3.8
        const rx = 2.3 + (i % 3) * 0.35
        const ry = 2.7 + (i % 2) * 0.4
        return {
          pos: [Math.cos(a) * rx + 0.3, Math.sin(a) * ry, -0.5 - (i % 3) * 1.2],
          size: 0.3 + (i % 3) * 0.12,
          wire: i % 3 === 1,
          seed: i * 1.3,
        }
      }),
    [preset.shapes]
  )
  const pairs = useMemo(() => shapes.map((_, i) => [i, (i + 1) % shapes.length]), [shapes])

  const symbols = useMemo(
    () =>
      SYMBOLS.slice(0, preset.symbols).map((text, i) => {
        const a = -2.1 + (i / Math.max(1, preset.symbols - 1)) * 4.2
        const r = 3.4 + (i % 2) * 0.8
        return { text, pos: [Math.cos(a) * r + 0.6, Math.sin(a) * (r * 0.8), -3 - (i % 3)], size: 0.4 + (i % 2) * 0.14, seed: i * 2.1 }
      }),
    [preset.symbols]
  )

  return (
    <>
      <fog attach="fog" args={[p.fog, 10, 26]} />
      <ambientLight intensity={p.ambient} />
      <directionalLight position={[5, 6, 4]} intensity={1.3} color="#dffbff" />
      <directionalLight position={[-6, -3, -4]} intensity={0.5} color={p.accent} />

      <PointerTracker pointer={pointer} active={motion} />

      {/* deep background: grid floor + far particles */}
      <group position={[0, -4.2, -6]} rotation={[0.08, 0, 0]}>
        <Grid3D p={p} size={48} divisions={32} opacity={theme === 'dark' ? 0.1 : 0.14} />
      </group>
      <Particles count={preset.bg} spread={[16, 9, 6]} center={[0, 0, -8]} size={0.028} color={p.particle} opacity={0.45} drift={0.2} motion={motion} />

      <Sway amount={motion ? 0.1 : 0}>
        <group position={[offsetX * dir, 0, 0]}>
          <Core m={m} p={p} motion={motion} />

          {/* mid layer: abstract shapes + connecting lines */}
          {shapes.map((s, i) => (
            <Drift key={i} ref={shapeRefs[i]} position={s.pos} seed={s.seed} pointer={pointer} radius={2.4} push={1.1} speed={0.8 + (i % 3) * 0.2} bob={0.3} rotate={[0.2, 0.35, 0.05]} motion={motion}>
              <Shape index={i} size={s.size} material={s.wire ? m.wire : i % 4 === 0 ? m.accent : m.body} />
            </Drift>
          ))}
          <ConnectionLines targets={shapeRefs} pairs={pairs} color={p.accent} opacity={theme === 'dark' ? 0.16 : 0.22} />

          {/* code symbols, further back */}
          <Suspense fallback={null}>
            {symbols.map((s, i) => (
              <Drift key={s.text} position={s.pos} seed={s.seed} pointer={pointer} radius={2.2} push={0.7} speed={0.6} bob={0.35} rotate={[0.05, 0.25, 0.02]} motion={motion}>
                <Symbol3D text={s.text} size={s.size} depth={0.12} material={i % 2 ? m.wire : m.accent} />
              </Drift>
            ))}
          </Suspense>

          {/* developer objects on the outer ring */}
          {preset.objects && (
            <>
              <Drift position={[-0.4 * dir, -3.1, 1.4]} seed={3} pointer={pointer} speed={0.7} bob={0.18} rotate={[0, 0.14, 0]} motion={motion}>
                <Laptop m={m} scale={0.7} rotation={[0.35, 0.45 * dir, 0]} />
              </Drift>
              <Drift position={[2.5 * dir, 2.5, -1.5]} seed={7} pointer={pointer} speed={0.6} bob={0.25} rotate={[0, 0.3, 0]} motion={motion}>
                <Database m={m} scale={0.5} />
              </Drift>
              <Drift position={[-1.1 * dir, 3.1, -3.5]} seed={5} pointer={pointer} speed={0.5} bob={0.3} rotate={[0.05, 0.2, 0]} motion={motion}>
                <Cloud m={m} scale={0.55} />
              </Drift>
              {tier === 'high' && (
                <Drift position={[2.7 * dir, -1.9, -2.5]} seed={9} pointer={pointer} speed={0.55} bob={0.2} rotate={[0, 0.22, 0]} motion={motion}>
                  <ServerRack m={m} scale={0.42} units={4} rotation={[0.1, -0.6 * dir, 0]} />
                </Drift>
              )}
            </>
          )}

          {/* floating glass panels */}
          {[
            [2.1, 1.3, -3],
            [0.5, -2.3, -4.5],
            [3.3, -0.5, -5.5],
          ]
            .slice(0, preset.panels)
            .map(([x, y, z], i) => (
              <Drift key={`g${i}`} position={[x * dir, y, z]} seed={i * 4} pointer={pointer} radius={2} push={0.5} speed={0.45} bob={0.3} rotate={[0, 0.06, 0]} motion={motion}>
                <GlassPanel m={m} p={p} w={2.2 - i * 0.3} h={1.3 - i * 0.15} rows={4 - i} rotation={[0.05, -0.35 * dir, 0]} />
              </Drift>
            ))}
        </group>
      </Sway>

      {/* foreground particles for depth, react to the cursor */}
      <Particles count={preset.fg} spread={[9, 5, 2]} center={[0, 0, 3.5]} size={0.022} color={p.particle} opacity={0.9} drift={0.35} pointer={pointer} pointerRadius={2.2} motion={motion} />

      <Rig scrollRef={scrollRef} offsetX={offsetX * dir} motion={motion} />
    </>
  )
}

export default function HeroScene({ scrollRef, theme = 'dark', isRTL = false, active = true }) {
  const tier = useDeviceTier()
  const preset = PRESETS[tier]
  const offsetX = tier === 'high' ? 3.6 : tier === 'mid' ? 2.6 : 0
  // On phones the copy fills the viewport; keep the composition beneath it.
  const phone = tier === 'low'

  return (
    <Canvas
      dpr={preset.dpr}
      camera={{ position: [0, 0.2, 9], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      frameloop={active ? 'always' : 'never'}
    >
      <group position={phone ? [1.4, -4.6, -3] : [0, 0, 0]} scale={phone ? 0.8 : 1}>
        <Scene tier={tier} theme={theme} scrollRef={scrollRef} offsetX={offsetX} isRTL={isRTL} />
      </group>
    </Canvas>
  )
}
