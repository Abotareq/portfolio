import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiStar, FiGitBranch, FiExternalLink, FiUsers, FiBook } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import useGitHub from '../hooks/useGitHub'
import { githubRepos, links } from '../data/portfolioData'
import usePortfolio from '../hooks/usePortfolio'
import { useApp } from '../context/AppContext'

const LANG_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
}

function timeAgo(iso, t) {
  if (!iso) return null
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (days < 1) return t('github.today')
  if (days < 30) return `${days}${t('github.d')}`
  if (days < 365) return `${Math.floor(days / 30)}${t('github.mo')}`
  return `${Math.floor(days / 365)}${t('github.y')}`
}

/** Language distribution across the featured repos (real API data or snapshot). */
function LanguageBar({ repos }) {
  const dist = useMemo(() => {
    const counts = {}
    repos.forEach((r) => r.language && (counts[r.language] = (counts[r.language] || 0) + 1))
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, n]) => ({ lang, pct: (n / total) * 100 }))
  }, [repos])
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        {dist.map((d, i) => (
          <motion.span
            key={d.lang}
            initial={{ width: 0 }}
            whileInView={{ width: `${d.pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
            style={{ background: LANG_COLORS[d.lang] || '#22D3EE' }}
            className="h-full"
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-400">
        {dist.map((d) => (
          <span key={d.lang} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[d.lang] || '#22D3EE' }} />
            {d.lang} <span className="text-slate-600">{Math.round(d.pct)}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Recent-activity strip: one animated cell per featured repo, ordered by last push. */
function ActivityStrip({ repos }) {
  const { t } = useApp()
  const ordered = useMemo(() => [...repos].filter((r) => r.pushedAt).sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt)), [repos])
  if (!ordered.length) return null
  return (
    <div className="mt-6">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('github.recent')}</div>
      <div className="flex flex-wrap gap-2">
        {ordered.map((r, i) => {
          const days = Math.floor((Date.now() - new Date(r.pushedAt)) / 86400000)
          const heat = days < 7 ? 1 : days < 30 ? 0.7 : days < 120 ? 0.45 : 0.25
          return (
            <motion.a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300 hover:border-accent/40"
            >
              <span className="h-3 w-3 rounded-sm" style={{ background: `rgba(34,211,238,${heat})` }} />
              <span className="font-mono">{r.name}</span>
              <span className="text-slate-600">{timeAgo(r.pushedAt, t)}</span>
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}

export default function GitHub() {
  const { profile, repos, live } = useGitHub(links.githubUser, githubRepos)
  const { t } = useApp()
  const { personal } = usePortfolio()

  return (
    <section id="github" className="section">
      <div className="container-x">
        <SectionHeader eyebrow={t('github.eyebrow')} title={t('github.title')} lede={t('github.lede')} />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* profile card */}
          <Reveal>
            <div className="card h-full p-6" dir="ltr">
              <div className="flex items-center gap-4">
                <img src={profile?.avatar_url || personal.avatar} alt={personal.name} className="h-16 w-16 rounded-2xl border border-white/10" loading="lazy" />
                <div>
                  <div className="font-bold text-white">{profile?.name || personal.shortName}</div>
                  <a href={links.github} target="_blank" rel="noreferrer" className="font-mono text-sm text-accent hover:underline">
                    @{links.githubUser}
                  </a>
                  {profile?.bio && <div className="mt-0.5 text-xs text-slate-500">{profile.bio}</div>}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: FiBook, label: t('github.repos'), value: profile?.public_repos ?? 18 },
                  { icon: FiUsers, label: t('github.followers'), value: profile?.followers ?? 2 },
                  { icon: FiStar, label: t('github.stars'), value: repos.reduce((a, r) => a + (r.stars || 0), 0) },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                    <s.icon className="mx-auto text-accent" />
                    <div className="mt-1 text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">{t('github.languages')}</div>
                <LanguageBar repos={repos} />
              </div>
              <ActivityStrip repos={repos} />

              <a href={links.github} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full">
                <FiGithub /> {t('github.viewProfile')}
              </a>
              <div className="mt-3 text-center font-mono text-[10px] text-slate-600">{live ? t('github.live') : t('github.snapshot')}</div>
            </div>
          </Reveal>

          {/* repo grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {repos.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.06}>
                <TiltCard intensity={5} className="h-full">
                  <a href={r.url} target="_blank" rel="noreferrer" className="card relative flex h-full flex-col p-5" dir="ltr">
                    <div className="depth-1 flex items-center gap-2">
                      <FiGitBranch className="text-accent" />
                      <span className="truncate font-mono text-sm font-semibold text-white">{r.name}</span>
                      <FiExternalLink className="ml-auto shrink-0 text-slate-600 transition group-hover:text-accent" size={14} />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{r.description || t('github.noDescription')}</p>
                    <div className="depth-2 mt-4 flex items-center gap-4 text-xs text-slate-500">
                      {r.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[r.language] || '#22D3EE' }} />
                          {r.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiStar /> {r.stars ?? 0}
                      </span>
                      {r.pushedAt && <span className="ml-auto font-mono">{timeAgo(r.pushedAt, t)}</span>}
                    </div>
                    {r.homepage && (
                      <span className="mt-3 inline-flex items-center gap-1 text-xs text-accent">
                        <FiExternalLink size={12} /> {r.homepage.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}
                      </span>
                    )}
                  </a>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
