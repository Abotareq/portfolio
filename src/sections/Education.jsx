import { FiAward, FiBookOpen, FiMapPin } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import Placeholder from '../components/Placeholder'
import { education, certifications } from '../data/portfolioData'

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container-x">
        <SectionHeader eyebrow="Education" title="Academic background." />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {education.map((ed, i) => (
            <Reveal key={ed.id} delay={i * 0.1} className="lg:col-span-2">
              <TiltCard intensity={4}>
                <div className="card card-hover relative p-7 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                      <FiBookOpen size={20} />
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-white">{ed.degree}</h3>
                        <span className="chip font-mono !text-accent !border-accent/30">{ed.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{ed.institution}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <FiMapPin /> {ed.location}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {ed.details.map((d) => (
                          <span key={d} className="chip">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}

          <Reveal delay={0.15}>
            <div className="card h-full p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
                  <FiAward size={16} />
                </span>
                <h3 className="font-semibold text-white">Certifications</h3>
              </div>
              <div className="mt-4 space-y-3">
                {certifications.map((c, i) =>
                  c.placeholder ? (
                    <Placeholder key={i}>{c.text}</Placeholder>
                  ) : (
                    <div key={i} className="text-sm text-slate-300">
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        {c.issuer} · {c.date}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
