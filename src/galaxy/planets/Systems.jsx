import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import Planet from './Planet'
import { galaxy, useGalaxy } from '../store'
import { PLANETS, sectionIndex } from '../layout'
import { techConstellation } from '../../data/portfolioData'
import { planetTexture } from '../textures'
import { atmosphereMaterial } from '../materials'

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const ACCENT = '#22D3EE'

/** Thin orbit path. */
function OrbitRing({ radius, tilt = [0.3, 0, 0], opacity = 0.14, color = ACCENT }) {
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.005, 4, 160]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

const label = 'pointer-events-none select-none whitespace-nowrap rounded-md border border-white/10 bg-[#070A12]/70 px-2 py-0.5 font-mono text-[10px] tracking-wider text-cyan-100 backdrop-blur'

/** HTML label that only exists while the camera is at (or next to) its section. */
function Label({ section, position, children, near = 1 }) {
  const active = useGalaxy((s) => s.section)
  if (Math.abs(active - sectionIndex(section)) > near) return null
  return (
    <Billboard position={position}>
      <Html center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        {children}
      </Html>
    </Billboard>
  )
}

function goTo(id) {
  galaxy.get().scrollTo?.(sectionIndex(id))
}

/* ------------------------------------------------------------------ */
/* About — a living world                                              */
/* ------------------------------------------------------------------ */
export function AboutSystem({ tier, name }) {
  const motion = tier !== 'low'
  const P = PLANETS.about
  return (
    <group position={P.pos}>
      <Planet id="about" radius={P.radius} kind="terra" seed={3} tilt={0.35} motion={motion} onClick={() => goTo('about')}>
        <Label section="about" position={[0, P.radius + 1.1, 0]}>
          <div className={label}>{name}</div>
        </Label>
      </Planet>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Skills — technologies orbit as stars on three rings                 */
/* ------------------------------------------------------------------ */
function TechNode({ text, ring, index, count, motion }) {
  const g = useRef()
  const [hover, setHover] = useState(false)
  const phase = (index / count) * Math.PI * 2
  useFrame((state) => {
    if (!g.current) return
    const a = phase + (motion ? state.clock.elapsedTime * ring.speed : 0)
    g.current.position.set(Math.cos(a) * ring.radius, Math.sin(a * 2.1) * 0.06, Math.sin(a) * ring.radius)
  })
  return (
    <group ref={g}>
      <mesh
        scale={hover ? 1.7 : 1}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color={hover ? '#ffffff' : '#a5f3fc'} toneMapped={false} />
      </mesh>
      <Billboard>
        <Text position={[0, 0.2, 0]} fontSize={0.19} color={hover ? '#ffffff' : '#dff8ff'} anchorX="center" anchorY="bottom" fillOpacity={hover ? 1 : 0.8} outlineWidth={0.005} outlineColor="#05070e">
          {text}
        </Text>
      </Billboard>
    </group>
  )
}

export function SkillsSystem({ tier, name }) {
  const motion = tier !== 'low'
  const P = PLANETS.skills
  const labels = tier === 'low' ? techConstellation.slice(0, 12) : techConstellation
  const rings = useMemo(
    () => [
      { radius: 3.4, speed: 0.14, tilt: [0.5, 0.1, 0] },
      { radius: 4.4, speed: -0.1, tilt: [-0.35, 0.5, 0.25] },
      { radius: 5.4, speed: 0.07, tilt: [0.2, -0.3, -0.45] },
    ],
    []
  )
  const assignment = useMemo(() => {
    const sizes = [Math.min(7, labels.length), Math.min(8, Math.max(0, labels.length - 7)), Math.max(0, labels.length - 15)]
    const out = []
    let idx = 0
    sizes.forEach((n, r) => {
      for (let i = 0; i < n; i++) out.push({ label: labels[idx++], ring: r, index: i, count: n })
    })
    return out
  }, [labels])

  return (
    <group position={P.pos}>
      <Planet id="skills" radius={P.radius} kind="metal" seed={11} tilt={0.2} motion={motion} onClick={() => goTo('skills')}>
        {rings.map((r, i) => (
          <OrbitRing key={i} radius={r.radius} tilt={r.tilt} opacity={0.12} />
        ))}
        {assignment.map((a) => (
          <group key={a.label} rotation={rings[a.ring].tilt}>
            <TechNode text={a.label} ring={rings[a.ring]} index={a.index} count={a.count} motion={motion} />
          </group>
        ))}
        <Label section="skills" position={[0, P.radius + 1.1, 0]}>
          <div className={label}>{name}</div>
        </Label>
      </Planet>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Projects — the largest system; each project is a moon               */
/* ------------------------------------------------------------------ */
const MOON_STYLES = [
  { radius: 5.2, speed: 0.1, tilt: [0.3, 0, 0.1], size: 0.62, kind: 'terra', ring: false },
  { radius: 6.6, speed: -0.08, tilt: [-0.2, 0.4, 0], size: 0.72, kind: 'rock', ring: true },
  { radius: 7.9, speed: 0.065, tilt: [0.15, -0.5, -0.2], size: 0.55, kind: 'ice', ring: false },
  { radius: 9.1, speed: -0.05, tilt: [0.4, 0.2, 0.3], size: 0.5, kind: 'rock', ring: false },
  { radius: 10.3, speed: 0.042, tilt: [-0.35, -0.2, 0.15], size: 0.6, kind: 'metal', ring: true },
]

function Moon({ project, style, index, motion, t, selected, anySelected }) {
  const g = useRef()
  const body = useRef()
  const [hover, setHover] = useState(false)
  const angle = useRef((index / MOON_STYLES.length) * Math.PI * 2 + index)
  const map = useMemo(() => planetTexture(style.kind, 40 + index * 7, 512, 256), [style.kind, index])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map, roughness: 0.85, metalness: 0.05 }), [map])
  const atmo = useMemo(() => atmosphereMaterial(project.accent, 2.6, 0.7), [project.accent])

  useEffect(() => {
    galaxy.moons.set(project.id, g.current)
    return () => galaxy.moons.delete(project.id)
  }, [project.id])

  useFrame((state, dt) => {
    if (!g.current) return
    // orbits pause while a project is open so the camera can settle on it
    if (motion && !anySelected) angle.current += dt * style.speed
    g.current.position.set(Math.cos(angle.current) * style.radius, 0, Math.sin(angle.current) * style.radius)
    if (body.current) {
      body.current.rotation.y += dt * 0.25
      const target = selected ? 1.2 : hover ? 1.12 : 1
      body.current.scale.setScalar(THREE.MathUtils.lerp(body.current.scale.x, target, dt * 6))
    }
    atmo.uniforms.uIntensity.value = THREE.MathUtils.lerp(atmo.uniforms.uIntensity.value, hover || selected ? 2.2 : 0.7, dt * 6)
  })

  return (
    <group rotation={style.tilt}>
      <group ref={g}>
        <mesh
          ref={body}
          material={mat}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHover(true)
            galaxy.set({ hovered: { kind: 'moon', id: project.id } })
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHover(false)
            const h = galaxy.get().hovered
            if (h && h.id === project.id) galaxy.set({ hovered: null })
            document.body.style.cursor = ''
          }}
          onClick={(e) => {
            e.stopPropagation()
            galaxy.set({ project: project.id })
          }}
        >
          <sphereGeometry args={[style.size, 40, 40]} />
        </mesh>
        <mesh material={atmo}>
          <sphereGeometry args={[style.size * 1.12, 32, 32]} />
        </mesh>
        {style.ring && (
          <mesh rotation={[Math.PI / 2 + 0.35, 0.2, 0]}>
            <ringGeometry args={[style.size * 1.5, style.size * 2, 64]} />
            <meshStandardMaterial color="#9fb7c9" transparent opacity={0.35} side={THREE.DoubleSide} roughness={0.9} depthWrite={false} />
          </mesh>
        )}

        {/* label: always the name; expands to a card on hover */}
        <Label section="projects" position={[0, style.size + 0.55, 0]} near={0}>
          <div className={`transition-all duration-300 ${hover && !selected ? 'w-56' : ''}`}>
            <div className={`${label} !text-[11px] ${hover || selected ? '!border-cyan-400/40 !text-white' : ''}`}>{project.name}</div>
            {hover && !selected && (
              <div className="mt-1 w-56 whitespace-normal rounded-lg border border-white/10 bg-[#070A12]/85 p-2.5 text-[11px] leading-snug text-slate-300 backdrop-blur">
                <div>{project.tagline}</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {project.tech.slice(0, 5).map((x) => (
                    <span key={x} className="rounded border border-white/10 px-1 py-px font-mono text-[9px] text-cyan-200/80">
                      {x}
                    </span>
                  ))}
                </div>
                <div className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-cyan-300/70">{t('galaxy.openProject')} →</div>
              </div>
            )}
          </div>
        </Label>
      </group>
    </group>
  )
}

export function ProjectsSystem({ tier, name, projects, t, selectedProject }) {
  const motion = tier !== 'low'
  const P = PLANETS.projects
  return (
    <group position={P.pos}>
      <Planet id="projects" radius={P.radius} kind="giant" seed={21} tilt={0.25} motion={motion} onClick={() => goTo('projects')}>
        {MOON_STYLES.map((s, i) => (
          <OrbitRing key={i} radius={s.radius} tilt={s.tilt} opacity={0.08} />
        ))}
        {projects.map((pr, i) => (
          <Moon key={pr.id} project={pr} style={MOON_STYLES[i % MOON_STYLES.length]} index={i} motion={motion} t={t} selected={selectedProject === pr.id} anySelected={!!selectedProject} />
        ))}
        <Label section="projects" position={[0, P.radius + 1.4, 0]}>
          <div className={label}>{name}</div>
        </Label>
      </Planet>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Experience — stations on an orbital timeline                        */
/* ------------------------------------------------------------------ */
function Station({ entry, index, count, active, motion, tilt }) {
  const g = useRef()
  const phase = (index / count) * Math.PI * 2
  const radius = 3.6
  useFrame((state, dt) => {
    if (!g.current) return
    const a = phase + (motion ? state.clock.elapsedTime * 0.1 : 0)
    g.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius)
    g.current.rotation.y += dt * 0.35
    g.current.scale.setScalar(THREE.MathUtils.lerp(g.current.scale.x, active ? 1.25 : 1, dt * 5))
  })
  return (
    <group rotation={tilt}>
      <group ref={g}>
        {/* station: hub, solar panels, beacon */}
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.5, 12]} />
          <meshStandardMaterial color="#c7d3dd" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0.55, 0, 0]}>
          <boxGeometry args={[0.7, 0.02, 0.3]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.55, 0, 0]}>
          <boxGeometry args={[0.7, 0.02, 0.3]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color={active ? '#ffffff' : ACCENT} toneMapped={false} />
        </mesh>
        <Label section="experience" position={[0, 0.75, 0]} near={0}>
          <div className={`${label} ${active ? '!border-cyan-400/50 !text-white' : ''}`}>
            {entry.date} · {entry.company}
          </div>
        </Label>
      </group>
    </group>
  )
}

export function ExperienceSystem({ tier, name, experience }) {
  const motion = tier !== 'low'
  const P = PLANETS.experience
  const tilt = [0.55, 0, 0.15]
  // Scrolling through the section walks the timeline: the active station is
  // derived from scroll progress inside the frame loop (no React churn).
  const [activeIndex, setActiveIndex] = useState(-1)
  useFrame(() => {
    const { section, progress } = galaxy.get()
    const next = section === sectionIndex('experience') ? Math.min(experience.length - 1, Math.floor(((progress + 0.5) % 1) * experience.length)) : -1
    if (next !== activeIndex) setActiveIndex(next)
  })
  return (
    <group position={P.pos}>
      <Planet id="experience" radius={P.radius} kind="rock" seed={31} tilt={0.4} motion={motion} onClick={() => goTo('experience')}>
        <OrbitRing radius={3.6} tilt={tilt} opacity={0.28} />
        {experience.map((e, i) => (
          <Station key={e.id} entry={e} index={i} count={experience.length} active={activeIndex === i} motion={motion} tilt={tilt} />
        ))}
        <Label section="experience" position={[0, P.radius + 1.1, 0]}>
          <div className={label}>{name}</div>
        </Label>
      </Planet>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Education — an icy world with a small moon per program              */
/* ------------------------------------------------------------------ */
function DegreeMoon({ entry, index, motion }) {
  const g = useRef()
  const map = useMemo(() => planetTexture('ice', 90 + index, 256, 128), [index])
  useFrame((state) => {
    if (!g.current) return
    const a = index * 2 + (motion ? state.clock.elapsedTime * 0.16 : 0)
    g.current.position.set(Math.cos(a) * (3.4 + index), 0, Math.sin(a) * (3.4 + index))
  })
  return (
    <group rotation={[0.35, 0.2, 0]}>
      <group ref={g}>
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial map={map} roughness={0.7} />
        </mesh>
        <Label section="education" position={[0, 0.75, 0]} near={0}>
          <div className={label}>{entry.date}</div>
        </Label>
      </group>
    </group>
  )
}

export function EducationSystem({ tier, name, education }) {
  const motion = tier !== 'low'
  const P = PLANETS.education
  return (
    <group position={P.pos}>
      <Planet id="education" radius={P.radius} kind="ice" seed={41} tilt={0.3} motion={motion} onClick={() => goTo('education')}>
        {education.map((ed, i) => (
          <DegreeMoon key={ed.id} entry={ed} index={i} motion={motion} />
        ))}
        <OrbitRing radius={3.4} tilt={[0.35, 0.2, 0]} />
        <Label section="education" position={[0, P.radius + 1.1, 0]}>
          <div className={label}>{name}</div>
        </Label>
      </Planet>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Contact — a luminous beacon world                                   */
/* ------------------------------------------------------------------ */
export function ContactSystem({ tier, name }) {
  const motion = tier !== 'low'
  const P = PLANETS.contact
  return (
    <group position={P.pos}>
      <Planet id="contact" radius={P.radius} kind="beacon" seed={51} tilt={0.2} motion={motion} onClick={() => goTo('contact')}>
        <pointLight color="#9be7ff" intensity={30} distance={40} decay={2} />
        <Label section="contact" position={[0, P.radius + 1.2, 0]}>
          <div className={label}>{name}</div>
        </Label>
      </Planet>
    </group>
  )
}
