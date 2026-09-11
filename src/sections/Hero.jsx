import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiMapPin } from 'react-icons/fi'
import { links, personal } from '../data/portfolioData'

const HeroScene = lazy(() => import('../three/HeroScene'))

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } }
const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }

export default function Hero() {
  const ref = useRef(null)
  const scrollRef = useRef(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Feed scroll progress to the 3D camera rig without re-rendering React.
  useEffect(() => scrollYProgress.on('change', (v) => (scrollRef.current = v)), [scrollYProgress])

  const go = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" ref={ref} className="relative min-h-[100svh] overflow-hidden flex items-center noise">
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <HeroScene scrollRef={scrollRef} />
        </Suspense>
      </div>
      {/* readability gradient over the canvas */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x relative z-10 pt-28 pb-20">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to full-stack opportunities
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <FiMapPin className="text-accent" /> {personal.location}
            </span>
          </motion.div>

          <motion.p variants={item} className="mt-8 font-mono text-sm text-accent">
            Hi, my name is
          </motion.p>
          <motion.h1 variants={item} className="mt-3 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
            {personal.name.split(' ').slice(0, 2).join(' ')}
            <span className="block text-slate-500">{personal.name.split(' ').slice(2).join(' ')}</span>
          </motion.h1>
          <motion.h2 variants={item} className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            <span className="gradient-text">{personal.title}</span>
            <span className="text-slate-500"> · .NET &amp; React</span>
          </motion.h2>

          <motion.p variants={item} className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-400">
            {personal.intro}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" onClick={go('projects')} className="btn-primary group">
              View Projects <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href={links.resume} download="Ahmed_Tarek_Mohamed_Resume.pdf" className="btn-ghost">
              <FiDownload /> Download Resume
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" className="btn-ghost" aria-label="GitHub">
              <FiGithub /> GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost" aria-label="LinkedIn">
              <FiLinkedin /> LinkedIn
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-12 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-slate-500">
            {['ASP.NET Core', 'React', 'SQL Server', 'Node.js', 'MongoDB', 'TypeScript'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent/70" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        onClick={go('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500 hover:text-accent transition"
        aria-label="Scroll to about"
      >
        Scroll
        <span className="relative h-9 w-5 rounded-full border border-white/20">
          <motion.span
            animate={{ y: [4, 16, 4], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-0 h-2 w-1 -translate-x-1/2 rounded-full bg-accent"
          />
        </span>
      </motion.a>
    </section>
  )
}
