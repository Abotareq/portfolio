import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Thin lines that follow a set of moving objects. `targets` is an array of
 * refs (to Object3D); `pairs` lists [i, j] index pairs to connect.
 */
export default function ConnectionLines({ targets, pairs, color = '#22D3EE', opacity = 0.2 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(pairs.length * 6), 3))
    return g
  }, [pairs.length])
  const _a = useRef(new THREE.Vector3())
  const _b = useRef(new THREE.Vector3())

  useFrame(() => {
    const arr = geo.attributes.position.array
    pairs.forEach(([i, j], k) => {
      const A = targets[i]?.current
      const B = targets[j]?.current
      if (!A || !B) return
      A.getWorldPosition(_a.current)
      B.getWorldPosition(_b.current)
      arr[k * 6] = _a.current.x
      arr[k * 6 + 1] = _a.current.y
      arr[k * 6 + 2] = _a.current.z
      arr[k * 6 + 3] = _b.current.x
      arr[k * 6 + 4] = _b.current.y
      arr[k * 6 + 5] = _b.current.z
    })
    geo.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  )
}
