import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiFileText, FiGrid } from 'react-icons/fi'
import { SECTIONS, PLANETS } from './layout'
import { galaxy, useGalaxy } from './store'
import { useApp } from '../context/AppContext'
import usePortfolio from '../hooks/usePortfolio'
import { links } from '../data/portfolioData'
import { HomePanel, AboutPanel, SkillsPanel, ProjectsPanel, ProjectDetail, ExperiencePanel, EducationPanel, ContactPanel } from './panels/Panels'

const PANEL = { about: AboutPanel, skills: SkillsPanel, projects: ProjectsPanel, experience: ExperiencePanel, education: EducationPanel, contact: ContactPanel }
const auto = 'pointer-events-auto'
const iconBtn = `${auto} grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur transition hover:border-cyan-400/40 hover:text-white`

/**
 * Minimal HTML layer over the galaxy: brand, nav indicator, hints, the active
 * section's glass panel and the project detail. Everything is
 * pointer-events:none except controls, so wheel/touch reach the 3D scroll.
 */
export default function Overlay({ portrait, tier }) {
  const { t, locale, toggleLocale, setView, isRTL } = useApp()
  const { personal, projects } = usePortfolio()
  const section = useGalaxy((s) => s.section)
  const projectId = useGalaxy((s) => s.project)
  const ready = useGalaxy((s) => s.ready)
  const [moved, setMoved] = useState(false)
  const panelRef = useRef(null)
  const detailRef = useRef(null)
  const lastSection = useRef(section)

  // Read-before-travel: wheel input scrolls the active panel until it has been
  // read to the end (or back to the top); only then does the journey move on.
  // While a project is open the journey is frozen entirely.
  useEffect(() => {
    const onWheel = (e) => {
      if (e.ctrlKey) return
      const el = projectId ? detailRef.current : panelRef.current
      if (!el) return
      const canScroll = el.scrollHeight > el.clientHeight + 1
      const atTop = el.scrollTop <= 0
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
      if (projectId) {
        e.preventDefault()
        if (canScroll) el.scrollTop += e.deltaY
        return
      }
      if (!canScroll) return
      if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
        e.preventDefault()
        el.scrollTop += e.deltaY
      }
    }
    document.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => document.removeEventListener('wheel', onWheel, { capture: true })
  }, [projectId])

  // Arriving from below starts the panel at its end, so scrolling up reads it
  // backwards naturally.
  useEffect(() => {
    const el = panelRef.current
    if (el && section < lastSection.current) el.scrollTop = el.scrollHeight
    lastSection.current = section
  }, [section])

  useEffect(() => {
    const unsub = galaxy.subscribe(() => {
      if (galaxy.get().offset > 0.02) setMoved(true)
    })
    return unsub
  }, [])

  const id = SECTIONS[section] || 'home'
  const Panel = PANEL[id]
  const project = projectId ? projects.find((p) => p.id === projectId) : null
  const side = PLANETS[id]?.side || 'center'
  // panel sits on `side`; RTL mirrors the layout
  const onStart = (side === 'left') !== isRTL
  const initials = personal.shortName
    .split(' ')
    .map((s) => s[0])
    .join('')

  return (
    <div className="pointer-events-none absolute inset-0 z-50 select-none">
      {/* subtle vignette frame (behind everything else in the overlay) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />

      {/* top bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
        <button onClick={() => galaxy.get().scrollTo?.(0)} className={`${auto} flex items-center gap-2.5`}>
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 font-mono text-sm font-bold text-cyan-300 shadow-[0_0_18px_-6px_rgba(34,211,238,0.6)]">{initials}</span>
          <span className="hidden text-sm font-semibold text-white/90 sm:block">{personal.shortName}</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={toggleLocale} className={`${iconBtn} font-mono text-xs font-semibold`} aria-label={t('nav.language')}>
            {locale === 'en' ? 'ع' : 'EN'}
          </button>
          <a href={links.github} target="_blank" rel="noreferrer" className={iconBtn} aria-label="GitHub">
            <FiGithub />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className={iconBtn} aria-label="LinkedIn">
            <FiLinkedin />
          </a>
          <a href={links.resume} target="_blank" rel="noreferrer" className={`${iconBtn} !w-auto gap-2 px-3 text-xs font-semibold`}>
            <FiFileText /> <span className="hidden sm:inline">{t('nav.resume')}</span>
          </a>
          <button onClick={() => setView('classic')} className={`${iconBtn} !w-auto gap-2 px-3 text-xs`} title={t('galaxy.classic')}>
            <FiGrid /> <span className="hidden md:inline">{t('galaxy.classic')}</span>
          </button>
        </div>
      </div>

      {/* nav indicator */}
      {portrait ? (
        <div className="absolute inset-x-0 top-16 flex justify-center gap-2 px-4">
          {SECTIONS.map((s, i) => (
            <button key={s} onClick={() => galaxy.get().scrollTo?.(i)} aria-label={t(`nav.${s}`)} className={`${auto} h-1.5 rounded-full transition-all ${section === i ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/25'}`} />
          ))}
        </div>
      ) : (
        <nav className="absolute top-1/2 -translate-y-1/2 start-6 flex flex-col gap-3">
          {SECTIONS.map((s, i) => {
            const active = section === i
            return (
              <button key={s} onClick={() => galaxy.get().scrollTo?.(i)} className={`${auto} group flex items-center gap-3 text-start`}>
                <span className={`relative grid h-3 w-3 place-items-center`}>
                  <span className={`h-1.5 w-1.5 rounded-full transition-all ${active ? 'bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]' : 'bg-white/30 group-hover:bg-white/60'}`} />
                  <span className={`absolute inset-0 rounded-full border transition ${active ? 'border-cyan-300/70' : 'border-transparent'}`} />
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.3em] transition ${active ? 'text-cyan-200' : 'text-slate-500 group-hover:text-slate-300'}`}>{t(`nav.${s}`)}</span>
              </button>
            )
          })}
        </nav>
      )}

      {/* hints */}
      <AnimatePresence>
        {ready && !moved && !project && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.2 }} className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            <span className="relative h-8 w-5 rounded-full border border-white/20">
              <motion.span animate={{ y: [3, 14, 3], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute left-1/2 top-0 h-1.5 w-1 -translate-x-1/2 rounded-full bg-cyan-400" />
            </span>
            <span>{portrait ? t('galaxy.drag') : t('galaxy.scroll')}</span>
            {!portrait && <span className="text-slate-600">{t('galaxy.move')}</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* section counter */}
      {!portrait && (
        <div className="absolute bottom-6 end-6 font-mono text-[11px] tracking-widest text-slate-500" dir="ltr">
          <span className="text-cyan-300">{String(section + 1).padStart(2, '0')}</span> / {String(SECTIONS.length).padStart(2, '0')}
        </div>
      )}

      {/* home hero (centred over the core) */}
      <AnimatePresence>{id === 'home' && !project && <motion.div key="home" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}><HomePanel portrait={portrait} /></motion.div>}</AnimatePresence>

      {/* section panel */}
      <AnimatePresence mode="wait">
        {Panel && !project && (
          <div key={id} className={portrait ? 'absolute inset-x-3 bottom-3' : `absolute top-1/2 -translate-y-1/2 w-[min(440px,34vw)] ${onStart ? 'start-44' : 'end-8'}`}>
            <motion.aside
              initial={{ opacity: 0, x: portrait ? 0 : onStart ? -40 : 40, y: portrait ? 40 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: portrait ? 0 : onStart ? -30 : 30, y: portrait ? 30 : 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-2xl border border-white/10 bg-[#0b1120]/70 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ${portrait ? 'p-4' : 'p-6'}`}
            >
              <div ref={panelRef} className={`${auto} ${portrait ? 'max-h-[46vh] overflow-y-auto' : 'max-h-[68vh] overflow-y-auto pe-1'} [scrollbar-width:thin] [overscroll-behavior:contain]`}>
                <Panel />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* project detail */}
      <AnimatePresence>
        {project && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 flex ${portrait ? 'items-end p-3' : `items-center ${onStart ? 'justify-start ps-44' : 'justify-end pe-8'}`}`}>
            <ProjectDetail project={project} portrait={portrait} scrollRef={detailRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
