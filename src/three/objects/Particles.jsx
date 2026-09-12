import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Instanced particle field. One draw call regardless of count.
 * `spread` = [x, y, z] half-extents, `center` offsets the field,
 * `drift` adds slow per-particle motion, `pointer` (world Vector3 ref)
 * pushes nearby particles away from the cursor.
 */
export default function Particles({
  count = 800,
  spread = [12, 8, 8],
  center = [0, 0, -2],
  size = 0.03,
  color = '#22D3EE',
  opacity = 0.6,
  drift = 0.15,
  pointer = null,
  pointerRadius = 2.5,
  motion = true,
}) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: center[0] + (Math.random() - 0.5) * 2 * spread[0],
        y: center[1] + (Math.random() - 0.5) * 2 * spread[1],
        z: center[2] + (Math.random() - 0.5) * 2 * spread[2],
        s: 0.5 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
      })
    }
    return arr
  }, [count, spread, center])

  const _p = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    const ptr = pointer?.current
    for (let i = 0; i < count; i++) {
      const d = data[i]
      const m = motion ? 1 : 0.1
      let x = d.x + Math.sin(t * d.speed + d.phase) * drift * m
      let y = d.y + Math.cos(t * d.speed * 0.8 + d.phase) * drift * m
      let z = d.z + Math.sin(t * d.speed * 0.5 + d.phase) * drift * 0.5 * m
      if (ptr) {
        _p.set(x - ptr.x, y - ptr.y, z - ptr.z)
        const dist = _p.length()
        if (dist < pointerRadius && dist > 0.001) {
          const k = (1 - dist / pointerRadius) * 1.2
          _p.normalize().multiplyScalar(k)
          x += _p.x
          y += _p.y
          z += _p.z
        }
      }
      dummy.position.set(x, y, z)
      const pulse = 1 + Math.sin(t * 2 + d.phase) * 0.25
      dummy.scale.setScalar(d.s * pulse)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}
