import { motion } from 'framer-motion'
import { FiBriefcase, FiMapPin } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import TiltCard from '../components/TiltCard'
import usePortfolio from '../hooks/usePortfolio'
import { useApp } from '../context/AppContext'

export default function Experience() {
  const { t, isRTL } = useApp()
  const { experience } = usePortfolio()
  return (
    <section id="experience" className="section">
      <div className="container-x">
        <SectionHeader eyebrow={t('experience.eyebrow')} title={t('experience.title')} lede={t('experience.lede')} />

        <div className="relative mt-14 ps-6 sm:ps-10">
          {/* animated spine */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute start-2 sm:start-4 top-2 bottom-2 w-px origin-top bg-gradient-to-b from-accent via-accent/40 to-transparent"
          />

          <ol className="space-y-8">
            {experience.map((e, i) => (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <span className="absolute -start-6 sm:-start-10 top-6 grid h-4 w-4 ltr:-translate-x-1/2 rtl:translate-x-1/2 place-items-center">
                  <span className="absolute h-4 w-4 rounded-full bg-accent/30 animate-pulseSoft" />
                  <span className="relative h-2 w-2 rounded-full bg-accent shadow-glow-sm" />
                </span>

                <TiltCard intensity={3}>
                  <div className="card relative p-6 md:p-7">
                    <div className="depth-1 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
                            <FiBriefcase size={14} />
                          </span>
                          <h3 className="text-lg font-bold text-white">{e.title}</h3>
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-300">{e.company}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <FiMapPin /> {e.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="chip font-mono !text-accent !border-accent/30">{e.date}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500">{t('experience.training')}</span>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2">
                      {e.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="depth-2 mt-5 flex flex-wrap gap-1.5 rtl:justify-end" dir="ltr">
                      {e.tech.map((tech) => (
                        <span key={tech} className="chip !text-[11px] !py-0.5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
