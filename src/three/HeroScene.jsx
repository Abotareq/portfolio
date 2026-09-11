import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Points, PointMaterial, Text } from '@react-three/drei'
import * as THREE from 'three'
import useDeviceTier from '../hooks/useDeviceTier'
import useMouse from '../hooks/useMouse'

const ACCENT = '#22D3EE'

/* --------------------------- quality presets --------------------------- */
const PRESETS = {
  low: { particles: 350, shapes: 3, dpr: [1, 1.25], transmission: false, glyphs: 6 },
  mid: { particles: 900, shapes: 5, dpr: [1, 1.5], transmission: false, glyphs: 10 },
  high: { particles: 1800, shapes: 7, dpr: [1, 2], transmission: true, glyphs: 16 },
}

/* ----------------------------- particle field --------------------------- */
function Particles({ count }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 4
    }
    return arr
  }, [count])

  useFrame((state, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.02
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={ACCENT} size={0.035} sizeAttenuation depthWrite={false} opacity={0.55} />
    </Points>
  )
}

/* ------------------------- floating geometric shapes -------------------- */
const GEOMETRIES = [
  (p) => <icosahedronGeometry args={[p, 0]} />,
  (p) => <octahedronGeometry args={[p, 0]} />,
  (p) => <torusGeometry args={[p, p * 0.32, 16, 48]} />,
  (p) => <dodecahedronGeometry args={[p, 0]} />,
  (p) => <torusKnotGeometry args={[p * 0.7, p * 0.22, 96, 12]} />,
  (p) => <boxGeometry args={[p * 1.3, p * 1.3, p * 1.3]} />,
  (p) => <tetrahedronGeometry args={[p, 0]} />,
]

function Shape({ index, transmission }) {
  const mesh = useRef()
  const cfg = useMemo(() => {
    const angle = (index / 7) * Math.PI * 2 + 0.6
    const radius = 3.2 + (index % 3) * 0.9
    return {
      pos: [Math.cos(angle) * radius, (Math.sin(index * 1.7) * 1.6), Math.sin(angle) * radius * 0.55 - 1],
      size: 0.45 + (index % 3) * 0.18,
      speed: 0.25 + (index % 4) * 0.08,
      wire: index % 3 === 1,
    }
  }, [index])

  useFrame((_, dt) => {
    if (!mesh.current) return
    mesh.current.rotation.x += dt * cfg.speed * 0.6
    mesh.current.rotation.y += dt * cfg.speed
  })

  const Geo = GEOMETRIES[index % GEOMETRIES.length]

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.4} floatingRange={[-0.3, 0.3]}>
      <mesh ref={mesh} position={cfg.pos}>
        {Geo(cfg.size)}
        {cfg.wire ? (
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.45} />
        ) : transmission ? (
          <MeshTransmissionMaterial
            thickness={0.6}
            roughness={0.15}
            transmission={0.95}
            ior={1.3}
            chromaticAberration={0.05}
            anisotropy={0.2}
            color="#9ff5ff"
            samples={4}
            resolution={256}
          />
        ) : (
          <meshStandardMaterial color="#0e2a35" metalness={0.8} roughness={0.25} emissive={ACCENT} emissiveIntensity={0.12} />
        )}
      </mesh>
    </Float>
  )
}

/* --------------------------- code-inspired glyphs ----------------------- */
const GLYPHS = ['</>', '{ }', '=>', 'async', 'await', '#', 'SQL', '()', '[ ]', 'API', 'JWT', 'DDD', 'C#', 'TS', 'npm', 'git']

function Glyphs({ count }) {
  const group = useRef()
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        const r = 5.5 + (i % 2) * 1.5
        return {
          text: GLYPHS[i % GLYPHS.length],
          pos: [Math.cos(angle) * r, (Math.random() - 0.5) * 5, Math.sin(angle) * r * 0.5 - 3],
          size: 0.22 + Math.random() * 0.16,
          speed: 0.4 + Math.random() * 0.6,
        }
      }),
    [count]
  )
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.03
  })
  return (
    <group ref={group}>
      {items.map((g, i) => (
        <Float key={i} speed={g.speed} rotationIntensity={0.2} floatIntensity={0.8}>
          <Text position={g.pos} fontSize={g.size} color={ACCENT} fillOpacity={0.22} anchorX="center" anchorY="middle">
            {g.text}
          </Text>
        </Float>
      ))}
    </group>
  )
}

/* ------------------------------ core object ----------------------------- */
function Core() {
  const outer = useRef()
  const inner = useRef()
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (outer.current) {
      outer.current.rotation.y += dt * 0.15
      outer.current.rotation.z = Math.sin(t * 0.3) * 0.15
    }
    if (inner.current) {
      inner.current.rotation.x -= dt * 0.35
      inner.current.rotation.y += dt * 0.25
      const s = 1 + Math.sin(t * 1.4) * 0.04
      inner.current.scale.setScalar(s)
    }
  })
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial color="#04202a" emissive={ACCENT} emissiveIntensity={0.35} metalness={0.9} roughness={0.25} />
      </mesh>
      <pointLight color={ACCENT} intensity={4} distance={7} decay={2} />
    </group>
  )
}

/* ------------------------- camera rig: mouse + scroll -------------------- */
function Rig({ mouse, scrollRef, offsetX }) {
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, dt) => {
    const scroll = scrollRef.current
    target.set(mouse.current.x * 0.9 + offsetX * 0.35, mouse.current.y * 0.5 + 0.2 - scroll * 2.2, 8.5 + scroll * 4)
    state.camera.position.lerp(target, Math.min(1, dt * 2.2))
    state.camera.lookAt(offsetX * 0.35, -scroll * 1.2, 0)
  })
  return null
}

/* --------------------------------- scene -------------------------------- */
export default function HeroScene({ scrollRef }) {
  const tier = useDeviceTier()
  const mouse = useMouse()
  const preset = PRESETS[tier]
  const offsetX = tier === 'high' ? 3.2 : tier === 'mid' ? 2.2 : 0
  // On phones the copy fills the viewport, so the composition drops below and behind it.
  const groupPos = tier === 'low' ? [1.2, -3.6, -2.5] : [offsetX, 0, 0]

  return (
    <Canvas
      dpr={preset.dpr}
      camera={{ position: [0, 0.2, 8.5], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      frameloop="always"
    >
      <color attach="background" args={['#070A12']} />
      <fog attach="fog" args={['#070A12', 9, 22]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} color="#dffbff" />
      <directionalLight position={[-6, -3, -4]} intensity={0.4} color={ACCENT} />

      <Suspense fallback={null}>
        {/* On wide screens the composition sits to the right of the hero copy. */}
        <group position={groupPos} scale={tier === 'low' ? 0.85 : 1}>
          <Core />
          {Array.from({ length: preset.shapes }, (_, i) => (
            <Shape key={i} index={i} transmission={preset.transmission && i % 3 === 0} />
          ))}
          {tier !== 'low' && <Glyphs count={preset.glyphs} />}
        </group>
        <Particles count={preset.particles} />
      </Suspense>

      <Rig mouse={mouse} scrollRef={scrollRef} offsetX={offsetX} />
    </Canvas>
  )
}
