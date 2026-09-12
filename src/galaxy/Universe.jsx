import { Suspense, useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'
import CameraRig from './CameraRig'
import Core from './Core'
import { StarField, Nebulae, DistantGalaxies, Dust, AsteroidBelt } from './Background'
import { AboutSystem, SkillsSystem, ProjectsSystem, ExperienceSystem, EducationSystem, ContactSystem } from './planets/Systems'
import { PLANETS } from './layout'
import { useGalaxy } from './store'

/**
 * Everything inside the Canvas: environment, the core, the six planetary
 * systems, in-between scenery, camera rig and post-processing.
 */
export default function Universe({ tier, portrait, rtl, data, t }) {
  const motion = tier !== 'low'
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.3, 0), [])
  const project = useGalaxy((s) => s.project)

  return (
    <>
      <color attach="background" args={['#05070e']} />
      <fog attach="fog" args={['#05070e', 40, 150]} />

      {/* The sun at the origin is the key light. Planets sit along -Z, so a
          warm directional from the sun's side gives every world a day side; a
          faint cool fill keeps night sides readable. */}
      <ambientLight intensity={0.12} color="#8fb8d8" />
      <directionalLight position={[6, 14, 60]} target-position={[0, 0, -60]} intensity={2.4} color="#ffe2b8" />
      <directionalLight position={[-40, -10, -120]} intensity={0.25} color="#3b82f6" />

      {/* deep space */}
      <StarField tier={tier} />
      <Nebulae tier={tier} />
      <DistantGalaxies tier={tier} />
      {motion && <Dust count={tier === 'high' ? 700 : 350} />}

      {/* the developer core */}
      <Suspense fallback={null}>
        <Core tier={tier} />
      </Suspense>

      {/* planetary systems */}
      <Suspense fallback={null}>
        <AboutSystem tier={tier} name={t('nav.about')} />
        <SkillsSystem tier={tier} name={t('nav.skills')} />
        <ProjectsSystem tier={tier} name={t('nav.projects')} projects={data.projects} t={t} selectedProject={project} />
        <ExperienceSystem tier={tier} name={t('nav.experience')} experience={data.experience} />
        <EducationSystem tier={tier} name={t('nav.education')} education={data.education} />
        <ContactSystem tier={tier} name={t('nav.contact')} />
      </Suspense>

      {/* asteroid belts */}
      {/* asteroid belts — kept out of the camera path, small and sparse */}
      <AsteroidBelt center={PLANETS.projects.pos} radius={15.5} thickness={1.6} count={tier === 'low' ? 40 : 110} tilt={1.25} speed={0.012} />
      <AsteroidBelt center={[-2, -9, -42]} radius={12} thickness={2} count={tier === 'low' ? 30 : 70} tilt={1.4} speed={0.016} color="#3a4f62" />
      {tier !== 'low' && <AsteroidBelt center={[4, 8, -98]} radius={14} thickness={2} count={60} tilt={1.1} speed={-0.01} color="#32485a" />}

      <CameraRig portrait={portrait} rtl={rtl} motion={motion} lookTarget={lookTarget} />

      {tier !== 'low' && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.35} intensity={tier === 'high' ? 0.5 : 0.35} mipmapBlur radius={0.55} />
          {tier === 'high' ? <DepthOfField target={lookTarget} focalLength={0.028} bokehScale={1.1} height={480} /> : null}
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
    </>
  )
}
