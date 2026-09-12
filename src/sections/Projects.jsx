import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiExternalLink, FiGithub, FiChevronDown, FiLayout } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import usePortfolio from '../hooks/usePortfolio'
import { useApp } from '../context/AppContext'

/**
 * Preview: real screenshot when `image` is set, otherwise a generated
 * browser-frame preview so the card never shows a stock illustration.
 */
function Preview({ p }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl border-b border-white/[0.06]" dir="ltr">
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at 20% 0%, ${p.accent}33, transparent 60%), linear-gradient(160deg, rgb(var(--surface)) 0%, rgb(var(--bg)) 100%)` }} />
      <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 h-3.5 flex-1 rounded bg-white/[0.05] font-mono text-[9px] text-slate-500 px-2 leading-[14px] truncate">
          {p.live ? p.live.replace(/^https?:\/\//, '') : p.github ? p.github.replace(/^https?:\/\//, '') : ''}
        </span>
      </div>
      {p.image ? (
        <img src={p.image} alt={`${p.name} preview`} loading="lazy" className="absolute inset-x-0 bottom-0 top-7 w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
      ) : (
        <div className="absolute inset-0 flex items-end p-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: p.accent }}>
              {p.type}
            </div>
            <div className="mt-1 text-3xl font-extrabold tracking-tight text-white/90">{p.name}</div>
          </div>
          <div className="absolute right-5 top-10 grid grid-cols-3 gap-1.5 opacity-40">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="h-5 w-8 rounded-sm" style={{ background: i % 4 === 0 ? p.accent : 'rgb(var(--fg) / 0.08)' }} />
            ))}
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
    </div>
  )
}

const chipList = { rest: {}, hover: { transition: { staggerChildren: 0.03 } } }
const chipItem = { rest: { y: 0, scale: 1 }, hover: { y: -3, scale: 1.05 } }

function ProjectCard({ p, index }) {
  const [open, setOpen] = useState(false)
  const { t } = useApp()
  return (
    <Reveal delay={(index % 2) * 0.1}>
      <TiltCard intensity={6} glow={p.accent} className="h-full">
        <motion.article initial="rest" whileHover="hover" animate="rest" className="card relative flex h-full flex-col overflow-hidden">
          <div className="depth-1">
            <Preview p={p} />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="depth-2 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${p.accent}22`, color: p.accent }}>
                      {t('projects.featured')}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-slate-400">{p.tagline}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-slate-500">{p.year}</span>
            </div>

            <p className="depth-1 mt-3 text-sm leading-relaxed text-slate-300">{p.description}</p>
            <p className="mt-2 text-xs font-medium text-slate-500">
              <span className="text-slate-400">{t('projects.role')}:</span> {p.role}
            </p>

            <motion.div variants={chipList} className="depth-2 mt-4 flex flex-wrap gap-1.5 rtl:justify-end" dir="ltr">
              {p.tech.map((tech) => (
                <motion.span key={tech} variants={chipItem} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="chip !text-[11px] !py-0.5 group-hover:border-accent/30">
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            <button onClick={() => setOpen((v) => !v)} className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-semibold text-accent hover:text-accent-soft" aria-expanded={open}>
              {t('projects.keyFeatures')}
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <FiChevronDown />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  {p.features.map((f) => (
                    <li key={f} className="mt-2 flex gap-2 text-sm text-slate-400">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: p.accent }} />
                      {f}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="depth-3 mt-auto flex flex-wrap gap-2 pt-6">
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 !rounded-lg text-xs">
                  <FiGithub /> {p.githubBackend ? t('projects.frontend') : t('projects.github')}
                </a>
              )}
              {p.githubBackend && (
                <a href={p.githubBackend} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 !rounded-lg text-xs">
                  <FiGithub /> {t('projects.backend')}
                </a>
              )}
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary !px-4 !py-2 !rounded-lg text-xs">
                  <FiExternalLink /> {t('projects.live')}
                </a>
              )}
              {p.liveAdmin && (
                <a href={p.liveAdmin} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 !rounded-lg text-xs">
                  <FiLayout /> {t('projects.admin')}
                </a>
              )}
              {!p.github && (
                <span className="placeholder inline-flex items-center rounded-lg px-3 py-2 text-[11px] font-mono" title={t('projects.noRepoTitle')}>
                  {t('projects.noRepo')}
                </span>
              )}
            </div>
          </div>
        </motion.article>
      </TiltCard>
    </Reveal>
  )
}

export default function Projects() {
  const { t } = useApp()
  const { projects } = usePortfolio()
  return (
    <section id="projects" className="section">
      <div className="container-x">
        <SectionHeader eyebrow={t('projects.eyebrow')} title={t('projects.title')} lede={t('projects.lede')} />
        <div className="mt-14 grid gap-6 md:grid-cols-2" style={{ perspective: 1400 }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
