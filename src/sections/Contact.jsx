import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiPhone, FiGithub, FiLinkedin, FiSend, FiDownload, FiArrowUpRight } from 'react-icons/fi'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import { links, personal } from '../data/portfolioData'

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-accent/50 focus:bg-white/[0.05] focus:shadow-glow-sm'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // No backend is bundled: the form composes a pre-filled email to the address
  // from the resume. Swap this for Formspree / EmailJS / an API route if wanted.
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `${links.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const rows = [
    { icon: FiMail, label: 'Email', value: personal.email, href: links.email },
    { icon: FiPhone, label: 'Phone', value: personal.phone, href: `tel:${personal.phone.replace(/[^+\d]/g, '')}` },
    { icon: FiMapPin, label: 'Location', value: personal.location },
    { icon: FiGithub, label: 'GitHub', value: `github.com/${links.githubUser}`, href: links.github },
    { icon: FiLinkedin, label: 'LinkedIn', value: 'linkedin.com/in/ahmad-tarek', href: links.linkedin },
  ]

  return (
    <section id="contact" className="section">
      <div className="container-x">
        {/* LinkedIn + Resume CTAs */}
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="card relative overflow-hidden p-7 md:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#0A66C2]/25 blur-3xl" />
              <span className="eyebrow">LinkedIn</span>
              <h3 className="mt-3 text-2xl font-bold text-white">Let's Connect</h3>
              <p className="mt-2 text-sm text-slate-400">Open to full-stack roles and collaborations. Reach out on LinkedIn and I'll get back to you.</p>
              <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn-primary mt-6 !bg-[#0A66C2] !text-white hover:!bg-[#0b74dc]">
                <FiLinkedin /> Connect on LinkedIn <FiArrowUpRight />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card relative overflow-hidden p-7 md:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
              <span className="eyebrow">Resume</span>
              <h3 className="mt-3 text-2xl font-bold text-white">Download My Resume</h3>
              <p className="mt-2 text-sm text-slate-400">The full PDF — skills, projects, training and education in one page.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href={links.resume} download="Ahmed_Tarek_Mohamed_Resume.pdf" className="btn-primary">
                  <FiDownload /> Download PDF
                </a>
                <a href={links.resume} target="_blank" rel="noreferrer" className="btn-ghost">
                  Open in browser
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-24">
          <SectionHeader eyebrow="Contact" title="Let's Build Something Together." lede="Have a project, a role, or an idea? Send a message — my inbox is open." align="center" />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="card h-full p-6 md:p-7">
              <h3 className="font-semibold text-white">Contact information</h3>
              <ul className="mt-5 space-y-4">
                {rows.map((r) => (
                  <li key={r.label} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/10 border border-accent/20 text-accent">
                      <r.icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">{r.label}</div>
                      {r.href ? (
                        <a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block truncate text-sm text-slate-200 hover:text-accent">
                          {r.value}
                        </a>
                      ) : (
                        <div className="text-sm text-slate-200">{r.value}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-3">
            <form onSubmit={submit} className="card h-full p-6 md:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">Name</span>
                  <input required value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">Email</span>
                  <input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputCls} />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Message</span>
                <textarea required rows={6} value={form.message} onChange={set('message')} placeholder="Tell me about your project…" className={`${inputCls} resize-none`} />
              </label>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary">
                  <FiSend /> Send message
                </motion.button>
                {sent && <span className="text-xs text-emerald-400">Opening your email client…</span>}
                <span className="ml-auto text-[11px] text-slate-600">Delivers to {personal.email}</span>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
