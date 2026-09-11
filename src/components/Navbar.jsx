import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { links, navLinks, personal } from '../data/portfolioData'
import useActiveSection from '../hooks/useActiveSection'

const ids = navLinks.map((l) => l.id)
const initials = personal.shortName
  .split(' ')
  .map((s) => s[0])
  .join('')

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(ids)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}
      >
        <div className="container-x">
          <nav
            className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 transition-all duration-500 ${
              scrolled ? 'glass-strong shadow-card' : 'border border-transparent bg-transparent'
            }`}
          >
            <a href="#home" onClick={go('home')} className="flex items-center gap-2.5 group">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 border border-accent/30 font-mono text-sm font-bold text-accent shadow-glow-sm">
                {initials}
              </span>
              <span className="text-sm font-semibold text-white/90 group-hover:text-white">{personal.shortName}</span>
            </a>

            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <li key={l.id} className="relative">
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className={`relative block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      active === l.id ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden md:flex items-center gap-2">
              <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition">
                <FiGithub />
              </a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition">
                <FiLinkedin />
              </a>
              <a href={links.resume} target="_blank" rel="noreferrer" className="btn-primary !py-2 !px-4 !rounded-lg">
                Resume
              </a>
            </div>

            <button onClick={() => setOpen(true)} className="md:hidden grid h-10 w-10 place-items-center rounded-lg text-white hover:bg-white/[0.06]" aria-label="Open menu">
              <HiMenuAlt3 size={22} />
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-bg/85 backdrop-blur-xl md:hidden">
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex h-full flex-col p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{personal.shortName}</span>
                <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg text-white hover:bg-white/[0.06]" aria-label="Close menu">
                  <HiX size={22} />
                </button>
              </div>
              <ul className="mt-10 space-y-2">
                {navLinks.map((l, i) => (
                  <motion.li key={l.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <a href={`#${l.id}`} onClick={go(l.id)} className={`block rounded-xl px-4 py-3 text-2xl font-semibold ${active === l.id ? 'text-accent bg-white/[0.05]' : 'text-slate-200'}`}>
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex gap-3">
                <a href={links.github} target="_blank" rel="noreferrer" className="btn-ghost flex-1">
                  <FiGithub /> GitHub
                </a>
                <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost flex-1">
                  <FiLinkedin /> LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
