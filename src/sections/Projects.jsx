import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiExternalLink, FiGithub, FiChevronDown, FiLayout } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import { projects } from '../data/portfolioData'

/**
 * Preview: real screenshot when `image` is set, otherwise a generated
 * browser-frame preview so the card never shows a stock illustration.
 */
function Preview({ p }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl border-b border-white/[0.06]">
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at 20% 0%, ${p.accent}33, transparent 60%), linear-gradient(160deg, #0d1424 0%, #070a12 100%)` }} />
      {/* browser chrome */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 h-3.5 flex-1 rounded bg-white/[0.05] font-mono text-[9px] text-slate-500 px-2 leading-[14px] truncate">
          {p.live ? p.live.replace(/^https?:\/\//, '') : p.github ? p.github.replace(/^https?:\/\//, '') : ''}
        </span>
      </div>
      {p.image ? (
        <img src={p.image} alt={`${p.name} preview`} loading="lazy" className="absolute inset-x-0 bottom-0 top-7 w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
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
              <span key={i} className="h-5 w-8 rounded-sm" style={{ background: i % 4 === 0 ? p.accent : 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
    </div>
  )
}

function ProjectCard({ p, index }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={(index % 2) * 0.1}>
      <TiltCard intensity={5} glow={p.accent} className="h-full">
        <article className="card card-hover relative flex h-full flex-col overflow-hidden">
          <Preview p={p} />
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${p.accent}22`, color: p.accent }}>
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-slate-400">{p.tagline}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-slate-500">{p.year}</span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">{p.description}</p>
            <p className="mt-2 text-xs font-medium text-slate-500">
              <span className="text-slate-400">Role:</span> {p.role}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span key={t} className="chip !text-[11px] !py-0.5">
                  {t}
                </span>
              ))}
            </div>

            <button onClick={() => setOpen((v) => !v)} className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-semibold text-accent hover:text-accent-soft" aria-expanded={open}>
              Key features
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <FiChevronDown />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  {p.features.map((f) => (
                    <li key={f} className="mt-2 flex gap-2 text-sm text-slate-400">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: p.accent }} />
                      {f}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 !rounded-lg text-xs">
                  <FiGithub /> {p.githubBackend ? 'Frontend' : 'GitHub'}
                </a>
              )}
              {p.githubBackend && (
                <a href={p.githubBackend} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 !rounded-lg text-xs">
                  <FiGithub /> Backend
                </a>
              )}
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary !px-4 !py-2 !rounded-lg text-xs">
                  <FiExternalLink /> Live Demo
                </a>
              )}
              {p.liveAdmin && (
                <a href={p.liveAdmin} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 !rounded-lg text-xs">
                  <FiLayout /> Admin
                </a>
              )}
              {!p.github && (
                <span className="placeholder inline-flex items-center rounded-lg px-3 py-2 text-[11px] font-mono" title="Repository not found in resume or public GitHub profile">
                  repo: private / not provided
                </span>
              )}
            </div>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container-x">
        <SectionHeader eyebrow="Projects" title="Things I've built." lede="Real projects from my resume and GitHub — from B2B platforms and e-commerce to DDD backends." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
