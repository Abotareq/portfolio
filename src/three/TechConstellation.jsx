import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import useDeviceTier from '../hooks/useDeviceTier'
import { techConstellation } from '../data/portfolioData'

const ACCENT = '#22D3EE'

/** Spread N points evenly on a sphere (Fibonacci sphere). */
function fibonacciSphere(n, radius) {
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius))
  }
  return pts
}

function Node({ position, label, index }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.scale.setScalar(1 + Math.sin(t * 1.5 + index) * 0.12)
  })
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
      <Billboard>
        <Text position={[0, 0.22, 0]} fontSize={0.19} color="#e2f7fb" anchorX="center" anchorY="bottom" fillOpacity={0.9}>
          {label}
        </Text>
      </Billboard>
    </group>
  )
}

function Constellation({ labels, interactive }) {
  const group = useRef()
  const points = useMemo(() => fibonacciSphere(labels.length, 2.4), [labels.length])
  const edges = useMemo(() => {
    const out = []
    for (let i = 0; i < points.length; i++) {
      // connect each node to its 2 nearest neighbours
      const dists = points
        .map((p, j) => ({ j, d: p.distanceTo(points[i]) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
      dists.forEach(({ j }) => {
        if (i < j) out.push([points[i], points[j]])
      })
    }
    return out
  }, [points])

  useFrame((state, dt) => {
    if (!group.current) return
    group.current.rotation.y += dt * 0.08
    if (interactive) {
      const targetX = state.pointer.y * 0.35
      const targetZ = state.pointer.x * 0.2
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, dt * 2)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetZ, dt * 2)
    }
  })

  return (
    <group ref={group}>
      {edges.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color={ACCENT} transparent opacity={0.18} lineWidth={1} />
      ))}
      {labels.map((label, i) => (
        <Node key={label} position={points[i]} label={label} index={i} />
      ))}
      <mesh>
        <sphereGeometry args={[2.4, 24, 24]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.035} />
      </mesh>
    </group>
  )
}

export default function TechConstellation() {
  const tier = useDeviceTier()
  const labels = tier === 'low' ? techConstellation.slice(0, 12) : techConstellation
  return (
    <Canvas dpr={tier === 'high' ? [1, 2] : [1, 1.25]} camera={{ position: [0, 0, 9.5], fov: 38 }} gl={{ alpha: true, antialias: tier !== 'low' }}>
      <ambientLight intensity={0.8} />
      <Suspense fallback={null}>
        <Constellation labels={labels} interactive={tier !== 'low'} />
      </Suspense>
    </Canvas>
  )
}
