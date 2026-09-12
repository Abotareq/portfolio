import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { galaxy } from '../store'
import { planetTexture, cloudTexture } from '../textures'
import { atmosphereMaterial } from '../materials'

/**
 * A realistic planet: procedurally textured body, fresnel atmosphere, optional
 * cloud layer and ring system. Lit by the sun at the origin (no emissive
 * cheats), so every world has a day side and a night side. Hover brightens the
 * atmosphere and nudges the scale; the body drifts slightly toward the cursor.
 *
 * kind: terra | ice | rock | giant | metal | beacon
 */
const KIND = {
  terra: { atmo: '#5cc8ff', atmoPower: 3.2, atmoIntensity: 0.85, clouds: true, rough: 0.7, metal: 0.05, rings: false },
  metal: { atmo: '#7fb3ff', atmoPower: 3.2, atmoIntensity: 0.7, clouds: false, rough: 0.35, metal: 0.55, rings: true },
  giant: { atmo: '#67E8F9', atmoPower: 2.4, atmoIntensity: 0.9, clouds: false, rough: 0.9, metal: 0.0, rings: true },
  rock: { atmo: '#ff9d6b', atmoPower: 4.0, atmoIntensity: 0.45, clouds: false, rough: 0.95, metal: 0.0, rings: false },
  ice: { atmo: '#bfeaff', atmoPower: 2.8, atmoIntensity: 0.9, clouds: true, rough: 0.5, metal: 0.1, rings: true },
  beacon: { atmo: '#9be7ff', atmoPower: 1.8, atmoIntensity: 1.6, clouds: true, rough: 0.6, metal: 0.05, rings: false },
}

export default function Planet({ id, radius = 1.5, kind = 'terra', seed = 1, tilt = 0.3, onClick, children, motion = true }) {
  const cfg = KIND[kind] || KIND.terra
  const group = useRef()
  const body = useRef()
  const clouds = useRef()
  const ringRef = useRef()
  const [hover, setHover] = useState(false)

  const map = useMemo(() => planetTexture(kind, seed), [kind, seed])
  const cloudMap = useMemo(() => (cfg.clouds ? cloudTexture(seed + 11) : null), [cfg.clouds, seed])
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ map, roughness: cfg.rough, metalness: cfg.metal, emissive: kind === 'beacon' ? '#7dd3fc' : '#000000', emissiveIntensity: kind === 'beacon' ? 0.35 : 0 }),
    [map, cfg, kind]
  )
  const atmo = useMemo(() => atmosphereMaterial(cfg.atmo, cfg.atmoPower, cfg.atmoIntensity), [cfg])

  useFrame((state, dt) => {
    const k = motion ? 1 : 0.15
    if (body.current) {
      body.current.rotation.y += dt * 0.05 * k
      const target = hover ? 1.04 : 1
      body.current.scale.setScalar(THREE.MathUtils.lerp(body.current.scale.x, target, dt * 6))
    }
    if (clouds.current) clouds.current.rotation.y += dt * 0.07 * k
    if (ringRef.current) ringRef.current.rotation.z += dt * 0.01 * k
    atmo.uniforms.uIntensity.value = THREE.MathUtils.lerp(atmo.uniforms.uIntensity.value, hover ? cfg.atmoIntensity * 1.8 : cfg.atmoIntensity, dt * 6)
    if (group.current) {
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.pointer.x * 0.22 * k, dt * 2)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, state.pointer.y * 0.16 * k + Math.sin(state.clock.elapsedTime * 0.4) * 0.06 * k, dt * 2)
    }
  })

  const over = (e) => {
    e.stopPropagation()
    setHover(true)
    galaxy.set({ hovered: { kind: 'planet', id } })
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    setHover(false)
    const h = galaxy.get().hovered
    if (h && h.kind === 'planet' && h.id === id) galaxy.set({ hovered: null })
    document.body.style.cursor = ''
  }

  return (
    <group ref={group}>
      <group rotation={[tilt, 0, 0]}>
        <mesh
          ref={body}
          material={mat}
          onPointerOver={over}
          onPointerOut={out}
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          <sphereGeometry args={[radius, 64, 64]} />
        </mesh>
        {cloudMap && (
          <mesh ref={clouds}>
            <sphereGeometry args={[radius * 1.012, 48, 48]} />
            <meshStandardMaterial map={cloudMap} transparent opacity={0.6} depthWrite={false} roughness={1} />
          </mesh>
        )}
        <mesh material={atmo}>
          <sphereGeometry args={[radius * 1.08, 48, 48]} />
        </mesh>
        {cfg.rings && (
          <group ref={ringRef} rotation={[Math.PI / 2 + (kind === 'giant' ? 0.12 : 0.25), 0, 0]}>
            <mesh>
              <ringGeometry args={[radius * (kind === 'giant' ? 1.4 : 1.55), radius * (kind === 'giant' ? 2.35 : 1.95), 128]} />
              <meshStandardMaterial color={kind === 'giant' ? '#c9b48a' : '#a9c8dd'} transparent opacity={kind === 'giant' ? 0.55 : 0.35} side={THREE.DoubleSide} roughness={0.9} depthWrite={false} />
            </mesh>
            {kind === 'giant' && (
              <mesh>
                <ringGeometry args={[radius * 2.42, radius * 2.7, 128]} />
                <meshStandardMaterial color="#8fb1c9" transparent opacity={0.28} side={THREE.DoubleSide} roughness={0.9} depthWrite={false} />
              </mesh>
            )}
          </group>
        )}
      </group>
      {children}
    </group>
  )
}
