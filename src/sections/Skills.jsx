import { lazy, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCode, FiMonitor, FiServer, FiDatabase, FiShield, FiTool, FiBox } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import { skills } from '../data/portfolioData'
import { useApp } from '../context/AppContext'
import useSceneActive from '../three/useSceneActive'

const TechOrbit = lazy(() => import('../three/TechOrbit'))

const icons = {
  Languages: FiCode,
  Frontend: FiMonitor,
  Backend: FiServer,
  Databases: FiDatabase,
  Authentication: FiShield,
  'DevOps / Tools': FiTool,
  'Architecture & Concepts': FiBox,
}

const list = { hidden: {}, show: { transition: { staggerChildren: 0.035 } } }
const chip = { hidden: { opacity: 0, scale: 0.85, y: 6 }, show: { opacity: 1, scale: 1, y: 0 } }

export default function Skills() {
  const { t, theme } = useApp()
  const orbitRef = useRef(null)
  const active = useSceneActive(orbitRef)

  return (
    <section id="skills" className="section">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-60" />
      <div className="container-x relative">
        <SectionHeader eyebrow={t('skills.eyebrow')} title={t('skills.title')} lede={t('skills.lede')} />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div ref={orbitRef} className="card relative h-[420px] lg:h-full min-h-[480px] overflow-hidden">
              <div className="absolute start-4 top-4 z-10 eyebrow !text-[10px]">{t('skills.orbit')}</div>
              <Suspense fallback={null}>
                <TechOrbit theme={theme} active={active} />
              </Suspense>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {skills.map((group, i) => {
              const Icon = icons[group.category] || FiCode
              return (
                <Reveal key={group.category} delay={i * 0.05}>
                  <TiltCard intensity={5} className="h-full">
                    <div className="card relative h-full p-5">
                      <div className="depth-1 flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
                          <Icon size={16} />
                        </span>
                        <h3 className="font-semibold text-white">{t(`skills.categories.${group.category}`)}</h3>
                        <span className="ms-auto font-mono text-xs text-slate-500">{group.items.length}</span>
                      </div>
                      <motion.ul variants={list} initial="hidden" whileInView="show" viewport={{ once: true }} className="depth-2 mt-4 flex flex-wrap gap-2">
                        {group.items.map((s) => (
                          <motion.li key={s} variants={chip} whileHover={{ y: -2, scale: 1.04 }} className="chip hover:border-accent/40 hover:text-white cursor-default" dir="ltr">
                            {s}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </TiltCard>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
