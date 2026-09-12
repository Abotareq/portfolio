import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import useDeviceTier from '../hooks/useDeviceTier'
import { getPalette } from './palette'
import { useMaterials } from './objects/DevObjects'
import ConnectionLines from './objects/ConnectionLines'
import { techConstellation } from '../data/portfolioData'

/**
 * TechOrbit — the technologies from the resume orbit a central core on three
 * tilted rings. Nodes on the same ring are linked by thin lines that follow
 * them; the whole system leans toward the cursor and nodes grow on hover.
 */
const RINGS = [
  { radius: 1.7, tilt: [0.55, 0.2, 0], speed: 0.22 },
  { radius: 2.45, tilt: [-0.4, 0.5, 0.3], speed: -0.16 },
  { radius: 3.15, tilt: [0.25, -0.35, -0.5], speed: 0.11 },
]

function Node({ label, ringIndex, index, count, p, m, nodeRef, motion, inv = 1 }) {
  const [hover, setHover] = useState(false)
  const ring = RINGS[ringIndex]
  const phase = (index / count) * Math.PI * 2
  const inner = useRef()

  useFrame((state, dt) => {
    const g = nodeRef.current
    if (!g) return
    const t = motion ? state.clock.elapsedTime * ring.speed : 0
    const a = phase + t
    g.position.set(Math.cos(a) * ring.radius, Math.sin(a * 1.7) * 0.12, Math.sin(a) * ring.radius)
    if (inner.current) {
      const target = (hover ? 1.8 : 1) * inv
      inner.current.scale.setScalar(THREE.MathUtils.lerp(inner.current.scale.x, target, dt * 8))
    }
  })

  return (
    <group ref={nodeRef}>
      <mesh
        ref={inner}
        material={hover ? m.glow : ringIndex === 0 ? m.accent : m.body}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = ''
        }}
      >
        <sphereGeometry args={[0.085, 12, 12]} />
      </mesh>
      {/* halo */}
      <mesh material={m.wire} scale={inv}>
        <sphereGeometry args={[0.13, 6, 6]} />
      </mesh>
      <Billboard>
        <Text position={[0, 0.24 * inv, 0]} fontSize={(hover ? 0.24 : 0.19) * inv} color={hover ? p.accentSoft : p.text} anchorX="center" anchorY="bottom" fillOpacity={hover ? 1 : 0.85} outlineWidth={0.004 * inv} outlineColor={p.bg}>
          {label}
        </Text>
      </Billboard>
    </group>
  )
}

function Ring({ ring, m }) {
  return (
    <group rotation={ring.tilt}>
      <mesh material={m.wire} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ring.radius, 0.005, 4, 96]} />
      </mesh>
    </group>
  )
}

function System({ labels, p, m, motion }) {
  const root = useRef()
  const core = useRef()
  // Fit the outer ring to the canvas width; labels/nodes are counter-scaled so
  // they stay legible when the system shrinks inside a narrow card.
  const { viewport } = useThree()
  const s = THREE.MathUtils.clamp((Math.min(viewport.width, viewport.height * 1.15) / 2 - 0.2) / 3.5, 0.45, 1)
  const inv = THREE.MathUtils.clamp(1 / s, 1, 1.7)

  // distribute labels across rings: inner 6, middle 8, rest outer
  const assignment = useMemo(() => {
    const sizes = [Math.min(6, labels.length), Math.min(8, Math.max(0, labels.length - 6)), Math.max(0, labels.length - 14)]
    const out = []
    let idx = 0
    sizes.forEach((n, r) => {
      for (let i = 0; i < n; i++) out.push({ label: labels[idx++], ring: r, index: i, count: n })
    })
    return out
  }, [labels])

  const refs = useMemo(() => assignment.map(() => ({ current: null })), [assignment])
  const pairs = useMemo(() => {
    const out = []
    RINGS.forEach((_, r) => {
      const ids = assignment.map((a, i) => (a.ring === r ? i : -1)).filter((i) => i >= 0)
      ids.forEach((id, k) => out.push([id, ids[(k + 1) % ids.length]]))
    })
    // a few spokes between rings
    for (let i = 0; i < assignment.length; i += 4) out.push([i, (i + 5) % assignment.length])
    return out
  }, [assignment])

  useFrame((state, dt) => {
    if (root.current) {
      const tx = motion ? state.pointer.y * 0.45 : 0
      const ty = motion ? state.pointer.x * 0.6 : 0
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, tx + 0.25, dt * 2)
      root.current.rotation.y += dt * (motion ? 0.05 : 0.01)
      root.current.rotation.z = THREE.MathUtils.lerp(root.current.rotation.z, ty * 0.2, dt * 2)
    }
    if (core.current) {
      core.current.rotation.y += dt * 0.3
      core.current.rotation.x -= dt * 0.15
    }
  })

  return (
    <group ref={root} scale={s}>
      <mesh ref={core} material={m.wire}>
        <icosahedronGeometry args={[0.55, 1]} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.28, 1]} />
        <meshStandardMaterial color={p.meshDark} emissive={p.accent} emissiveIntensity={p.glowIntensity * 1.6} metalness={0.9} roughness={0.3} />
      </mesh>
      <pointLight color={p.accent} intensity={2.5} distance={6} decay={2} />

      {RINGS.map((r, i) => (
        <Ring key={i} ring={r} m={m} />
      ))}

      {assignment.map((a, i) => (
        <group key={a.label} rotation={RINGS[a.ring].tilt}>
          <Node label={a.label} ringIndex={a.ring} index={a.index} count={a.count} p={p} m={m} nodeRef={refs[i]} motion={motion} inv={inv} />
        </group>
      ))}
      <ConnectionLines targets={refs} pairs={pairs} color={p.accent} opacity={0.22} />
    </group>
  )
}

export default function TechOrbit({ theme = 'dark', active = true }) {
  const tier = useDeviceTier()
  const p = getPalette(theme)
  const m = useMaterials(p)
  const labels = tier === 'low' ? techConstellation.slice(0, 14) : techConstellation
  return (
    <Canvas dpr={tier === 'high' ? [1, 2] : [1, 1.25]} camera={{ position: [0, 4.2, 8.6], fov: 40 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)} gl={{ alpha: true, antialias: tier !== 'low' }} frameloop={active ? 'always' : 'never'}>
      <ambientLight intensity={p.ambient + 0.3} />
      <directionalLight position={[4, 6, 5]} intensity={1} />
      <Suspense fallback={null}>
        <System labels={labels} p={p} m={m} motion={tier !== 'low'} />
      </Suspense>
    </Canvas>
  )
}
