import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sunMaterial, atmosphereMaterial } from './materials'

function coronaTexture() {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.18, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,214,150,0.55)')
  g.addColorStop(0.25, 'rgba(255,160,70,0.22)')
  g.addColorStop(0.6, 'rgba(255,110,40,0.06)')
  g.addColorStop(1, 'rgba(255,90,30,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/**
 * The Developer Core is the system's star: an animated sun that lights every
 * planet along the journey. It rotates slowly and leans toward the cursor.
 */
export default function Core({ tier }) {
  const motion = tier !== 'low'
  const sun = useRef()
  const glow = useRef()
  const corona = useRef()
  const corona2 = useRef()
  const mat = useMemo(() => sunMaterial(tier === 'high' ? 3 : tier === 'mid' ? 2 : 1), [tier])
  const atmo = useMemo(() => atmosphereMaterial('#ffb14d', 2.2, 1.4), [])
  const tex = useMemo(() => coronaTexture(), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    mat.uniforms.uTime.value = t
    if (sun.current) {
      sun.current.rotation.y += dt * 0.04 * (motion ? 1 : 0.2)
      sun.current.rotation.z = THREE.MathUtils.lerp(sun.current.rotation.z, state.pointer.x * 0.08, dt)
    }
    if (glow.current) glow.current.scale.setScalar(1 + Math.sin(t * 0.9) * 0.012)
    if (corona.current) {
      corona.current.material.rotation = t * 0.02
      corona.current.scale.setScalar(13 + Math.sin(t * 0.7) * 0.35)
    }
    if (corona2.current) {
      corona2.current.material.rotation = -t * 0.015
      corona2.current.scale.setScalar(20 + Math.sin(t * 0.5 + 1) * 0.5)
    }
  })

  return (
    <group>
      <mesh ref={sun} material={mat}>
        <sphereGeometry args={[2.6, tier === 'low' ? 32 : 64, tier === 'low' ? 32 : 64]} />
      </mesh>
      <mesh ref={glow} material={atmo}>
        <sphereGeometry args={[2.9, 48, 48]} />
      </mesh>
      <sprite ref={corona} scale={13}>
        <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
      </sprite>
      {motion && (
        <sprite ref={corona2} scale={20}>
          <spriteMaterial map={tex} transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
        </sprite>
      )}
      {/* the star's light */}
      <pointLight color="#ffd9a3" intensity={motion ? 220 : 160} distance={160} decay={1.4} />
    </group>
  )
}
