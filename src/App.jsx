import { lazy, Suspense, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Education from './sections/Education'
import GitHub from './sections/GitHub'
import Contact from './sections/Contact'
import { seo } from './data/portfolioData'
import { useApp } from './context/AppContext'

// The page-wide 3D world is lazy so the first paint is not blocked by three.js.
const WorldScene = lazy(() => import('./three/WorldScene'))
// The Developer Galaxy — the default, scroll-driven 3D universe.
const Galaxy = lazy(() => import('./galaxy/Galaxy'))

export default function App() {
  const { theme, isRTL, view, t } = useApp()

  // SEO metadata generated from the resume data.
  useEffect(() => {
    document.title = seo.title
    const set = (sel, attr, val) => {
      let el = document.querySelector(sel)
      if (!el) {
        el = document.createElement('meta')
        const [k, v] = sel.match(/\[(.+?)="(.+?)"\]/).slice(1)
        el.setAttribute(k, v)
        document.head.appendChild(el)
      }
      el.setAttribute(attr, val)
    }
    set('meta[name="description"]', 'content', seo.description)
    set('meta[property="og:title"]', 'content', seo.title)
    set('meta[property="og:description"]', 'content', seo.description)
    set('meta[name="twitter:title"]', 'content', seo.title)
    set('meta[name="twitter:description"]', 'content', seo.description)
  }, [])

  if (view === 'galaxy') {
    return (
      <Suspense
        fallback={
          <div className="fixed inset-0 grid place-items-center bg-[#05070e] font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
            <span className="animate-pulseSoft">{t('galaxy.loading')}</span>
          </div>
        }
      >
        <Galaxy />
      </Suspense>
    )
  }

  return (
    <div className="relative">
      {/* ambient background glows (under the 3D world) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      {/* scroll-driven 3D scenery behind every section */}
      <Suspense fallback={null}>
        <WorldScene theme={theme} isRTL={isRTL} />
      </Suspense>

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <GitHub />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
