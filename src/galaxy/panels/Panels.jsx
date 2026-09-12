import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiDownload, FiExternalLink, FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone, FiSend, FiX, FiLayout } from 'react-icons/fi'
import { links, skills } from '../../data/portfolioData'
import usePortfolio from '../../hooks/usePortfolio'
import { useApp } from '../../context/AppContext'
import Counter from '../../components/Counter'
import { galaxy, useGalaxy } from '../store'
import { sectionIndex } from '../layout'

/* Shared bits ------------------------------------------------------- */
const auto = 'pointer-events-auto'
const glass = 'rounded-2xl border border-white/10 bg-[#0b1120]/70 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl'
const btnP = `${auto} inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#06121a] transition hover:bg-cyan-300`
const btnG = `${auto} inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/[0.08]`
const chip = 'inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-slate-300'

export function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300">
      <span className="h-px w-5 bg-cyan-400/70" />
      {children}
    </div>
  )
}

/* HOME ---------------------------------------------------------------- */
export function HomePanel({ portrait }) {
  const { t } = useApp()
  const { personal } = usePortfolio()
  const parts = personal.name.split(' ')
  return (
    <div className={`pointer-events-none flex h-full w-full flex-col ${portrait ? 'items-center justify-end px-5 pb-14 text-center' : 'justify-center ps-44 pe-8 text-start'}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="relative max-w-xl">
        <div className="pointer-events-none absolute -inset-x-16 -inset-y-10 -z-10 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(5,7,14,0.55),rgba(5,7,14,0.25)_55%,transparent_75%)]" />
        <p className="font-mono text-xs tracking-[0.3em] text-cyan-300 uppercase">{t('hero.hi')}</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl [text-shadow:0_0_40px_rgba(34,211,238,0.35)]">
          {parts.slice(0, 2).join(' ')} <span className="text-slate-400">{parts.slice(2).join(' ')}</span>
        </h1>
        <h2 className="mt-3 text-xl font-bold text-cyan-200 sm:text-2xl md:text-3xl">
          {personal.title} <span className="text-slate-500">· </span>
          <span className="inline-block text-slate-400" dir="ltr">
            {t('hero.subtitle')}
          </span>
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300/90 sm:text-base [text-shadow:0_2px_20px_rgba(0,0,0,0.9)]">{personal.intro}</p>
        <div className={`mt-7 flex flex-wrap gap-2.5 ${portrait ? 'justify-center' : ''}`}>
          <button onClick={() => galaxy.get().scrollTo?.(sectionIndex('projects'))} className={btnP}>
            {t('hero.viewProjects')} <FiArrowRight className="rtl:-scale-x-100" />
          </button>
          <a href={links.resume} download="Ahmed_Tarek_Mohamed_Resume.pdf" className={btnG}>
            <FiDownload /> {t('hero.downloadResume')}
          </a>
          <a href={links.github} target="_blank" rel="noreferrer" className={btnG}>
            <FiGithub /> GitHub
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className={btnG}>
            <FiLinkedin /> LinkedIn
          </a>
        </div>
      </motion.div>
    </div>
  )
}

/* ABOUT --------------------------------------------------------------- */
export function AboutPanel() {
  const { t } = useApp()
  const { personal, stats } = usePortfolio()
  return (
    <>
      <Eyebrow>{t('about.eyebrow')}</Eyebrow>
      <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{t('about.title')}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{personal.summary}</p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="text-2xl font-extrabold text-white">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-[11px] text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <FiMapPin className="text-cyan-300" /> {personal.location}
        </span>
        {personal.languages.map((l) => (
          <span key={l.name}>
            <span className="text-slate-200">{l.name}</span> · {l.level}
          </span>
        ))}
      </div>
    </>
  )
}

/* SKILLS -------------------------------------------------------------- */
export function SkillsPanel() {
  const { t } = useApp()
  return (
    <>
      <Eyebrow>{t('skills.eyebrow')}</Eyebrow>
      <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{t('skills.title')}</h2>
      <p className="mt-2 text-xs text-slate-400">{t('galaxy.techNodes')}</p>
      <div className="mt-4 space-y-3">
        {skills.map((g) => (
          <div key={g.category}>
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">{t(`skills.categories.${g.category}`)}</div>
            <div className="flex flex-wrap gap-1.5" dir="ltr">
              {g.items.map((s) => (
                <span key={s} className={chip}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* PROJECTS ------------------------------------------------------------ */
export function ProjectsPanel() {
  const { t } = useApp()
  const { projects } = usePortfolio()
  const hovered = useGalaxy((s) => s.hovered)
  return (
    <>
      <Eyebrow>{t('projects.eyebrow')}</Eyebrow>
      <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{t('projects.title')}</h2>
      <p className="mt-2 text-xs text-slate-400">
        {t('galaxy.moons')} · {t('galaxy.hoverHint')}
      </p>
      <ul className="mt-4 space-y-1.5">
        {projects.map((p) => {
          const active = hovered?.kind === 'moon' && hovered.id === p.id
          return (
            <li key={p.id}>
              <button
                onClick={() => galaxy.set({ project: p.id })}
                className={`${auto} flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-start transition ${
                  active ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/[0.06] bg-white/[0.03] hover:border-cyan-400/30'
                }`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">{p.name}</span>
                  <span className="block truncate text-[11px] text-slate-400">{p.tagline}</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">{p.year}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export function ProjectDetail({ project, portrait, scrollRef }) {
  const { t } = useApp()
  const close = () => galaxy.set({ project: null })
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${glass} ${auto} pointer-events-auto flex w-full flex-col overflow-hidden ${portrait ? 'max-h-[74vh] max-w-full' : 'max-h-[85vh] max-w-xl'}`}
      style={{ boxShadow: `0 40px 120px -40px ${project.accent}55, 0 0 0 1px ${project.accent}33` }}
    >
      {project.image && (
        <div className="relative aspect-[16/8] w-full shrink-0 overflow-hidden" dir="ltr">
          <img src={project.image} alt={project.name} className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent" />
        </div>
      )}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 sm:p-6 [overscroll-behavior:contain]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: project.accent }}>
              {project.type} · {project.year}
            </div>
            <h3 className="mt-1 text-2xl font-bold text-white">{project.name}</h3>
            <p className="text-sm text-slate-400">{project.tagline}</p>
          </div>
          <button onClick={close} aria-label={t('galaxy.close')} className={`${auto} grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.06]`}>
            <FiX />
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">{project.description}</p>
        <p className="mt-2 text-xs text-slate-500">
          <span className="text-slate-400">{t('projects.role')}:</span> {project.role}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5" dir="ltr">
          {project.tech.map((x) => (
            <span key={x} className={chip}>
              {x}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">{t('projects.keyFeatures')}</div>
          <ul className="mt-2 space-y-1.5">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-slate-300">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: project.accent }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className={btnG}>
              <FiGithub /> {project.githubBackend ? t('projects.frontend') : 'GitHub'} →
            </a>
          )}
          {project.githubBackend && (
            <a href={project.githubBackend} target="_blank" rel="noreferrer" className={btnG}>
              <FiGithub /> {t('projects.backend')} →
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className={btnP}>
              <FiExternalLink /> {t('projects.live')} →
            </a>
          )}
          {project.liveAdmin && (
            <a href={project.liveAdmin} target="_blank" rel="noreferrer" className={btnG}>
              <FiLayout /> {t('projects.admin')}
            </a>
          )}
          {!project.github && <span className="inline-flex items-center rounded-lg border border-dashed border-amber-400/40 bg-amber-400/5 px-3 py-2 font-mono text-[11px] text-amber-200/80">{t('projects.noRepo')}</span>}
        </div>
        <button onClick={close} className={`${auto} mt-4 text-xs text-slate-500 hover:text-cyan-300`}>
          ← {t('galaxy.back')}
        </button>
      </div>
    </motion.div>
  )
}

/* EXPERIENCE ---------------------------------------------------------- */
export function ExperiencePanel() {
  const { t } = useApp()
  const { experience } = usePortfolio()
  const progress = useGalaxy((s) => s.progress)
  const active = Math.min(experience.length - 1, Math.floor(((progress + 0.5) % 1) * experience.length))
  return (
    <>
      <Eyebrow>{t('experience.eyebrow')}</Eyebrow>
      <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{t('experience.title')}</h2>
      <p className="mt-2 text-xs text-slate-400">{t('galaxy.stations')}</p>
      <div className="mt-4 space-y-2">
        {experience.map((e, i) => (
          <motion.div key={e.id} animate={{ opacity: active === i ? 1 : 0.55, scale: active === i ? 1 : 0.985 }} className={`rounded-xl border p-3.5 ${active === i ? 'border-cyan-400/40 bg-cyan-400/[0.06]' : 'border-white/[0.06] bg-white/[0.03]'}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-semibold text-white">{e.title}</div>
              <span className="font-mono text-[11px] text-cyan-300">{e.date}</span>
            </div>
            <div className="text-xs text-slate-400">
              {e.company} · {e.location}
            </div>
            {active === i && (
              <ul className="mt-2 space-y-1">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 flex flex-wrap gap-1" dir="ltr">
              {e.tech.map((x) => (
                <span key={x} className={`${chip} !text-[10px] !py-px`}>
                  {x}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

/* EDUCATION ----------------------------------------------------------- */
export function EducationPanel() {
  const { t } = useApp()
  const { education, certifications } = usePortfolio()
  return (
    <>
      <Eyebrow>{t('education.eyebrow')}</Eyebrow>
      <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{t('education.title')}</h2>
      {education.map((ed) => (
        <div key={ed.id} className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="font-semibold text-white">{ed.degree}</div>
            <span className="font-mono text-[11px] text-cyan-300" dir="ltr">
              {ed.date}
            </span>
          </div>
          <div className="mt-1 text-sm text-slate-300">{ed.institution}</div>
          <div className="mt-0.5 text-xs text-slate-500">{ed.location}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ed.details.map((d) => (
              <span key={d} className={chip}>
                {d}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">{t('education.certifications')}</div>
        {certifications.map((c, i) => (
          <div key={i} className="mt-1.5 rounded-lg border border-dashed border-amber-400/40 bg-amber-400/5 px-3 py-2 font-mono text-[11px] text-amber-200/80">
            {c.text}
          </div>
        ))}
      </div>
    </>
  )
}

/* CONTACT ------------------------------------------------------------- */
export function ContactPanel() {
  const { t } = useApp()
  const { personal } = usePortfolio()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`${t('contact.subject')} ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `${links.email}?subject=${subject}&body=${body}`
  }
  const input = `${auto} w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400/50`
  return (
    <>
      <Eyebrow>{t('contact.eyebrow')}</Eyebrow>
      <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{t('contact.title')}</h2>
      <p className="mt-2 text-sm text-slate-400">{t('contact.lede')}</p>
      <div className="mt-4 grid gap-1.5 text-sm">
        <a href={links.email} className={`${auto} flex items-center gap-2 text-slate-200 hover:text-cyan-300`}>
          <FiMail className="text-cyan-300" /> <span dir="ltr">{personal.email}</span>
        </a>
        <a href={`tel:${personal.phone.replace(/[^+\d]/g, '')}`} className={`${auto} flex items-center gap-2 text-slate-200 hover:text-cyan-300`}>
          <FiPhone className="text-cyan-300" /> <span dir="ltr">{personal.phone}</span>
        </a>
        <span className="flex items-center gap-2 text-slate-400">
          <FiMapPin className="text-cyan-300" /> {personal.location}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={links.github} target="_blank" rel="noreferrer" className={btnG}>
          <FiGithub /> GitHub
        </a>
        <a href={links.linkedin} target="_blank" rel="noreferrer" className={`${btnG} !border-[#0A66C2]/40`}>
          <FiLinkedin /> LinkedIn
        </a>
        <a href={links.resume} download="Ahmed_Tarek_Mohamed_Resume.pdf" className={btnG}>
          <FiDownload /> {t('contact.downloadPdf')}
        </a>
      </div>
      <form onSubmit={submit} className="mt-4 grid gap-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <input required value={form.name} onChange={set('name')} placeholder={t('contact.namePh')} className={input} />
          <input required type="email" value={form.email} onChange={set('email')} placeholder={t('contact.emailPh')} className={input} dir="ltr" />
        </div>
        <textarea required rows={3} value={form.message} onChange={set('message')} placeholder={t('contact.messagePh')} className={`${input} resize-none`} />
        <button type="submit" className={`${btnP} justify-center`}>
          <FiSend className="rtl:-scale-x-100" /> {t('galaxy.sendSignal')}
        </button>
      </form>
    </>
  )
}
