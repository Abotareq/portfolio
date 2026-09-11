import { motion } from 'framer-motion'
import { FiCode, FiLayers, FiUsers, FiGlobe } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import Counter from '../components/Counter'
import TiltCard from '../components/TiltCard'
import { personal, stats } from '../data/portfolioData'

const highlights = [
  {
    icon: FiLayers,
    title: '.NET backends, done properly',
    text: 'Clean Architecture, DDD and CQRS on ASP.NET Core with EF Core and SQL Server — from Tawreed to a SignalR-powered support system.',
  },
  {
    icon: FiCode,
    title: 'React & MERN in production',
    text: 'Shipped a live Arabic RTL e-commerce platform with React, Node and MongoDB, managing state with Redux Toolkit and TanStack Query.',
  },
  {
    icon: FiUsers,
    title: 'Leads and reviews',
    text: 'Formally assigned team lead on Herfy: assigned tasks, reviewed pull requests and made the architecture decisions for a 4-person team.',
  },
  {
    icon: FiGlobe,
    title: 'Auth & authorization',
    text: 'JWT with refresh-token rotation, ASP.NET Identity, and role-based plus resource-level access control across every project.',
  },
]

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <SectionHeader eyebrow="About" title="Comfortable across the whole stack." lede={personal.summary} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="card card-hover p-6">
                <div className="text-4xl font-extrabold tracking-tight text-white">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-sm font-medium text-slate-200">{s.label}</div>
                <div className="mt-1 text-xs text-slate-500">{s.note}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={0.1 + i * 0.07}>
              <TiltCard intensity={5} className="h-full">
                <div className="card card-hover relative h-full p-6 flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                    <h.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{h.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{h.text}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-6">
          <motion.div className="card p-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
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
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
