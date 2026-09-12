import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

/* ==========================================================================
 * Developer-themed primitives. All are built from cheap geometries and share
 * a small set of materials so the scenes stay light.
 * ========================================================================== */

const FONT = '/fonts/helvetiker_bold.typeface.json'

/* --------------------------- shared materials --------------------------- */
export function useMaterials(p) {
  return useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: p.mesh, metalness: 0.15, roughness: 0.5 }),
      bodyDark: new THREE.MeshStandardMaterial({ color: p.meshDark, metalness: 0.2, roughness: 0.55 }),
      accent: new THREE.MeshStandardMaterial({ color: p.accent, emissive: p.accent, emissiveIntensity: p.glowIntensity, metalness: 0.1, roughness: 0.4 }),
      wire: new THREE.MeshBasicMaterial({ color: p.accent, wireframe: true, transparent: true, opacity: p.wireOpacity }),
      glow: new THREE.MeshBasicMaterial({ color: p.accent, transparent: true, opacity: 0.9, toneMapped: false }),
      screen: new THREE.MeshStandardMaterial({ color: p.screen, emissive: p.accent, emissiveIntensity: p.glowIntensity * 0.5, roughness: 0.6 }),
      glass: new THREE.MeshPhysicalMaterial({ color: p.glass, transparent: true, opacity: 0.16, roughness: 0.1, metalness: 0.1, transmission: 0, side: THREE.DoubleSide, depthWrite: false }),
      flat: new THREE.MeshStandardMaterial({ color: p.mesh, flatShading: true, metalness: 0.1, roughness: 0.65 }),
    }),
    [p]
  )
}

/* ------------------------------ 3D text ------------------------------- */
export function Symbol3D({ text, size = 0.9, depth = 0.18, material, ...rest }) {
  return (
    <group {...rest}>
      <Center>
        <Text3D font={FONT} size={size} height={depth} curveSegments={6} bevelEnabled bevelSize={0.015} bevelThickness={0.02} bevelSegments={2} material={material}>
          {text}
        </Text3D>
      </Center>
    </group>
  )
}

/* ------------------------------- laptop ------------------------------- */
export function Laptop({ m, scale = 1, ...rest }) {
  const lines = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ w: 0.5 + ((i * 37) % 10) / 10, y: 0.62 - i * 0.16, x: (i % 3) * 0.12 })), [])
  return (
    <group scale={scale} {...rest}>
      {/* base */}
      <mesh material={m.body} position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.09, 1.6]} />
      </mesh>
      {/* keys */}
      <Keys m={m} position={[0, 0.05, 0.05]} cols={12} rows={4} pitch={0.16} keySize={0.12} />
      {/* trackpad */}
      <mesh material={m.bodyDark} position={[0, 0.048, 0.58]}>
        <boxGeometry args={[0.7, 0.01, 0.35]} />
      </mesh>
      {/* lid */}
      <group position={[0, 0.04, -0.78]} rotation={[-1.15, 0, 0]}>
        <mesh material={m.body} position={[0, 0.8, 0]}>
          <boxGeometry args={[2.4, 1.6, 0.07]} />
        </mesh>
        <mesh material={m.screen} position={[0, 0.8, 0.04]}>
          <planeGeometry args={[2.2, 1.4]} />
        </mesh>
        {/* code lines */}
        {lines.map((l, i) => (
          <mesh key={i} material={i % 3 === 0 ? m.glow : m.accent} position={[-0.95 + l.x + l.w / 2, 0.8 + l.y, 0.05]}>
            <planeGeometry args={[l.w, 0.05]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ------------------------------ keyboard ------------------------------ */
export function Keys({ m, cols = 14, rows = 5, pitch = 0.18, keySize = 0.14, ...rest }) {
  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = cols * rows
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // a few keys "press" over time
        const press = Math.sin(t * 3 + c * 0.9 + r * 1.7) > 0.985 ? -0.02 : 0
        dummy.position.set((c - (cols - 1) / 2) * pitch, press, (r - (rows - 1) / 2) * pitch)
        dummy.updateMatrix()
        ref.current.setMatrixAt(i++, dummy.matrix)
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <group {...rest}>
      <instancedMesh ref={ref} args={[null, null, count]} material={m.bodyDark}>
        <boxGeometry args={[keySize, 0.035, keySize]} />
      </instancedMesh>
    </group>
  )
}

export function Keyboard({ m, scale = 1, ...rest }) {
  return (
    <group scale={scale} {...rest}>
      <mesh material={m.body}>
        <boxGeometry args={[2.8, 0.08, 1.05]} />
      </mesh>
      <Keys m={m} position={[0, 0.05, -0.05]} cols={14} rows={4} pitch={0.18} keySize={0.14} />
      <mesh material={m.bodyDark} position={[0, 0.05, 0.36]}>
        <boxGeometry args={[1.2, 0.035, 0.14]} />
      </mesh>
    </group>
  )
}

/* ------------------------------- monitor ------------------------------ */
export function Monitor({ m, scale = 1, ...rest }) {
  const bars = useMemo(() => [0.5, 0.9, 0.65, 1.1, 0.8, 1.3, 1.0], [])
  return (
    <group scale={scale} {...rest}>
      <mesh material={m.body} position={[0, 1.0, 0]}>
        <boxGeometry args={[2.6, 1.6, 0.08]} />
      </mesh>
      <mesh material={m.screen} position={[0, 1.0, 0.045]}>
        <planeGeometry args={[2.4, 1.4]} />
      </mesh>
      {/* chart bars on the screen */}
      {bars.map((h, i) => (
        <mesh key={i} material={i % 2 ? m.accent : m.glow} position={[-0.9 + i * 0.3, 0.45 + h * 0.35, 0.05]}>
          <planeGeometry args={[0.18, h * 0.7]} />
        </mesh>
      ))}
      <mesh material={m.bodyDark} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.25, 12]} />
      </mesh>
      <mesh material={m.bodyDark} position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.05, 24]} />
      </mesh>
    </group>
  )
}

/* ------------------------------ database ------------------------------ */
export function Database({ m, scale = 1, discs = 3, ...rest }) {
  return (
    <group scale={scale} {...rest}>
      {Array.from({ length: discs }, (_, i) => (
        <group key={i} position={[0, (i - (discs - 1) / 2) * 0.55, 0]}>
          <mesh material={m.body}>
            <cylinderGeometry args={[0.75, 0.75, 0.42, 32]} />
          </mesh>
          <mesh material={m.glow} position={[0, 0.215, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.75, 0.012, 6, 48]} />
          </mesh>
          <mesh material={m.accent} position={[0.55, 0, 0.45]}>
            <sphereGeometry args={[0.035, 8, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ------------------------------- server ------------------------------- */
export function ServerRack({ m, scale = 1, units = 5, ...rest }) {
  const leds = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const ledCount = units * 3
  useFrame((state) => {
    if (!leds.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < ledCount; i++) {
      const u = Math.floor(i / 3)
      const k = i % 3
      const blink = Math.sin(t * (2 + k) + i * 1.3) > 0.2 ? 1 : 0.35
      dummy.position.set(-0.55 + k * 0.14, (u - (units - 1) / 2) * 0.36, 0.42)
      dummy.scale.setScalar(blink)
      dummy.updateMatrix()
      leds.current.setMatrixAt(i, dummy.matrix)
    }
    leds.current.instanceMatrix.needsUpdate = true
  })
  return (
    <group scale={scale} {...rest}>
      <mesh material={m.bodyDark}>
        <boxGeometry args={[1.6, units * 0.36 + 0.15, 0.8]} />
      </mesh>
      {Array.from({ length: units }, (_, i) => (
        <mesh key={i} material={m.body} position={[0, (i - (units - 1) / 2) * 0.36, 0.41]}>
          <boxGeometry args={[1.45, 0.26, 0.04]} />
        </mesh>
      ))}
      <instancedMesh ref={leds} args={[null, null, ledCount]} material={m.glow}>
        <sphereGeometry args={[0.03, 6, 6]} />
      </instancedMesh>
      {/* vents */}
      {Array.from({ length: units }, (_, i) => (
        <mesh key={`v${i}`} material={m.bodyDark} position={[0.35, (i - (units - 1) / 2) * 0.36, 0.44]}>
          <boxGeometry args={[0.6, 0.12, 0.01]} />
        </mesh>
      ))}
    </group>
  )
}

/* -------------------------------- cloud ------------------------------- */
export function Cloud({ m, scale = 1, ...rest }) {
  const blobs = useMemo(
    () => [
      [0, 0, 0, 0.6],
      [-0.65, -0.1, 0.1, 0.45],
      [0.65, -0.08, -0.1, 0.48],
      [0.2, 0.35, 0.05, 0.42],
      [-0.25, 0.3, -0.15, 0.38],
    ],
    []
  )
  return (
    <group scale={scale} {...rest}>
      {blobs.map(([x, y, z, r], i) => (
        <mesh key={i} material={m.flat} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 1]} />
        </mesh>
      ))}
      <mesh material={m.wire} position={[0, 0.02, 0]}>
        <icosahedronGeometry args={[1.05, 1]} />
      </mesh>
    </group>
  )
}

/* ------------------------------ git graph ----------------------------- */
export function GitGraph({ m, p, scale = 1, ...rest }) {
  // A small branch/merge graph: main line with a feature branch that merges back.
  const nodes = useMemo(
    () => [
      [0, -1.6, 0],
      [0, -0.8, 0],
      [0, 0, 0],
      [0, 0.8, 0],
      [0, 1.6, 0],
      [0.9, -0.4, 0.1],
      [0.9, 0.4, 0.1],
    ],
    []
  )
  const edges = useMemo(
    () => [
      [nodes[0], nodes[1]],
      [nodes[1], nodes[2]],
      [nodes[2], nodes[3]],
      [nodes[3], nodes[4]],
      [nodes[1], nodes[5]],
      [nodes[5], nodes[6]],
      [nodes[6], nodes[3]],
    ],
    [nodes]
  )
  const pulse = useRef()
  useFrame((state) => {
    if (!pulse.current) return
    // a "commit" travelling up the main line
    const t = (state.clock.elapsedTime * 0.35) % 1
    pulse.current.position.set(0, -1.6 + t * 3.2, 0.02)
  })
  return (
    <group scale={scale} {...rest}>
      {edges.map((e, i) => (
        <Line key={i} points={e} color={p.accent} transparent opacity={0.55} lineWidth={1.2} />
      ))}
      {nodes.map((n, i) => (
        <mesh key={i} material={i >= 5 ? m.accent : m.body} position={n}>
          <sphereGeometry args={[i >= 5 ? 0.1 : 0.13, 12, 12]} />
        </mesh>
      ))}
      <mesh ref={pulse} material={m.glow}>
        <sphereGeometry args={[0.06, 8, 8]} />
      </mesh>
    </group>
  )
}

/* ----------------------------- glass panel ---------------------------- */
export function GlassPanel({ m, p, w = 2.2, h = 1.3, rows = 4, ...rest }) {
  return (
    <group {...rest}>
      <mesh material={m.glass}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <Line
        points={[
          [-w / 2, -h / 2, 0],
          [w / 2, -h / 2, 0],
          [w / 2, h / 2, 0],
          [-w / 2, h / 2, 0],
          [-w / 2, -h / 2, 0],
        ]}
        color={p.accent}
        transparent
        opacity={0.35}
        lineWidth={1}
      />
      {Array.from({ length: rows }, (_, i) => (
        <mesh key={i} material={i === 0 ? m.glow : m.accent} position={[-w / 2 + 0.2 + (0.5 + ((i * 53) % 7) / 10) / 2, h / 2 - 0.25 - i * 0.24, 0.01]}>
          <planeGeometry args={[0.5 + ((i * 53) % 7) / 10, 0.045]} />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------ orbiters ------------------------------ */
export function Orbiters({ m, count = 3, radius = 1.6, speed = 0.6, tilt = 0.5, size = 0.06, ...rest }) {
  const g = useRef()
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * speed
  })
  return (
    <group rotation={[tilt, 0, 0]} {...rest}>
      <mesh material={m.wire} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.004, 4, 64]} />
      </mesh>
      <group ref={g}>
        {Array.from({ length: count }, (_, i) => {
          const a = (i / count) * Math.PI * 2
          return (
            <mesh key={i} material={m.glow} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}>
              <sphereGeometry args={[size, 8, 8]} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

/* ------------------------------ 3D grid ------------------------------- */
export function Grid3D({ p, size = 30, divisions = 30, opacity = 0.12, ...rest }) {
  const geo = useMemo(() => {
    const pts = []
    const half = size / 2
    const step = size / divisions
    for (let i = 0; i <= divisions; i++) {
      const v = -half + i * step
      pts.push(-half, 0, v, half, 0, v, v, 0, -half, v, 0, half)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [size, divisions])
  return (
    <lineSegments geometry={geo} {...rest}>
      <lineBasicMaterial color={p.accent} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  )
}

/* --------------------------- abstract shapes -------------------------- */
export const SHAPES = [
  (s) => <icosahedronGeometry args={[s, 0]} />,
  (s) => <octahedronGeometry args={[s, 0]} />,
  (s) => <torusGeometry args={[s, s * 0.32, 12, 40]} />,
  (s) => <dodecahedronGeometry args={[s, 0]} />,
  (s) => <torusKnotGeometry args={[s * 0.7, s * 0.22, 72, 10]} />,
  (s) => <boxGeometry args={[s * 1.3, s * 1.3, s * 1.3]} />,
  (s) => <tetrahedronGeometry args={[s, 0]} />,
]

export function Shape({ index, size = 0.5, material, ...rest }) {
  const Geo = SHAPES[index % SHAPES.length]
  return (
    <mesh material={material} {...rest}>
      {Geo(size)}
    </mesh>
  )
}
