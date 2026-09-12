import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { links } from '../data/portfolioData'
import usePortfolio from '../hooks/usePortfolio'
import { useApp } from '../context/AppContext'

const icon = 'grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-accent hover:bg-white/[0.05] transition'

export default function Footer() {
  const { t } = useApp()
  const { personal } = usePortfolio()
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="container-x flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} {personal.name}. {t('footer.built')}
        </p>
        <div className="flex items-center gap-2">
          <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={icon}>
            <FiGithub />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={icon}>
            <FiLinkedin />
          </a>
          <a href={links.email} aria-label="Email" className={icon}>
            <FiMail />
          </a>
        </div>
      </div>
    </footer>
  )
}
