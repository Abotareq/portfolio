import { useEffect } from 'react'
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

export default function App() {
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

  return (
    <div className="relative">
      {/* ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <GitHub />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
