import { FiCode, FiLayers, FiUsers, FiGlobe } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import Counter from '../components/Counter'
import TiltCard from '../components/TiltCard'
import usePortfolio from '../hooks/usePortfolio'
import { useApp } from '../context/AppContext'

const icons = [FiLayers, FiCode, FiUsers, FiGlobe]

export default function About() {
  const { t, locale } = useApp()
  const { personal, stats } = usePortfolio()
  const highlights = t('about.highlights')

  return (
    <section id="about" className="section">
      <div className="container-x">
        <SectionHeader eyebrow={t('about.eyebrow')} title={t('about.title')} lede={personal.summary} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <TiltCard intensity={6} className="h-full">
                <div className="card relative h-full p-6">
                  <div className="depth-2 text-4xl font-extrabold tracking-tight text-white">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="depth-1 mt-1 text-sm font-medium text-slate-200">{s.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{s.note}</div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {highlights.map((h, i) => {
            const Icon = icons[i] || FiCode
            return (
              <Reveal key={i} delay={0.1 + i * 0.07}>
                <TiltCard intensity={5} className="h-full">
                  <div className="card relative h-full p-6 flex gap-4">
                    <div className="depth-2 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                      <Icon size={20} />
                    </div>
                    <div className="depth-1">
                      <h3 className="font-semibold text-white">{h.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{h.text}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.2} className="mt-6">
          <div className="card p-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-3">
              <img src={personal.avatar} alt={personal.name} className="h-10 w-10 rounded-full border border-white/10" loading="lazy" />
              <div>
                <div className="font-semibold text-white">{personal.name}</div>
                <div className="text-xs text-slate-500">{personal.degreeLine}</div>
              </div>
            </div>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            {personal.languages.map((l) => (
              <div key={l.name} className="text-slate-400">
                <span className="text-slate-200">{l.name}</span> · {l.level}
              </div>
            ))}
            {personal.extras.map((e) => (
              <div key={e.label} className="text-slate-400">
                <span className="text-slate-200">{e.label}</span> · {e.value}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
