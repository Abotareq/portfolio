import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const _v = new THREE.Vector3()

/**
 * Wraps children in gentle bobbing + slow rotation, and (optionally) nudges
 * away from the cursor when it comes close. Lighter than drei's <Float> and
 * composable with cursor proximity.
 *
 * `pointer` is a ref to a THREE.Vector3 in world space (or null).
 */
const Drift = forwardRef(function Drift({
  children,
  position = [0, 0, 0],
  speed = 1,
  bob = 0.25,
  rotate = [0.15, 0.25, 0],
  seed = 0,
  pointer = null,
  radius = 2.2,
  push = 0.9,
  motion = true,
  ...rest
}, fwd) {
  const g = useRef()
  useImperativeHandle(fwd, () => g.current)
  const base = useRef(new THREE.Vector3(...position))
  const offset = useRef(new THREE.Vector3())

  useFrame((state, dt) => {
    if (!g.current) return
    const t = state.clock.elapsedTime * speed + seed
    const m = motion ? 1 : 0.15
    if (pointer?.current) {
      _v.copy(base.current).sub(pointer.current)
      const d = _v.length()
      if (d < radius && d > 0.0001) {
        _v.normalize().multiplyScalar((1 - d / radius) * push)
      } else {
        _v.set(0, 0, 0)
      }
      offset.current.lerp(_v, Math.min(1, dt * 4))
    }
    g.current.position.set(
      base.current.x + offset.current.x + Math.sin(t * 0.7) * bob * 0.35 * m,
      base.current.y + offset.current.y + Math.sin(t) * bob * m,
      base.current.z + offset.current.z + Math.cos(t * 0.6) * bob * 0.25 * m
    )
    g.current.rotation.x += dt * rotate[0] * m
    g.current.rotation.y += dt * rotate[1] * m
    g.current.rotation.z += dt * rotate[2] * m
  })

  return (
    <group ref={g} position={position} {...rest}>
      {children}
    </group>
  )
})

export default Drift
