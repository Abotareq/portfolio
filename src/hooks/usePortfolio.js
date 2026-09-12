import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import * as en from '../data/portfolioData'
import * as ar from '../data/portfolioData.ar'

/**
 * Returns the portfolio data for the active locale. English is the source of
 * truth; Arabic overrides are merged on top by id so links, tech lists, dates
 * and images are never duplicated.
 */
export default function usePortfolio() {
  const { locale } = useApp()
  return useMemo(() => {
    if (locale !== 'ar') return en
    const mergeById = (list, overrides) => list.map((item) => ({ ...item, ...(overrides[item.id] || {}) }))
    return {
      ...en,
      personal: { ...en.personal, ...ar.personalAr },
      stats: en.stats.map((s, i) => ({ ...s, ...(ar.statsAr[i] || {}) })),
      projects: mergeById(en.projects, ar.projectsAr),
      experience: mergeById(en.experience, ar.experienceAr),
      education: mergeById(en.education, ar.educationAr),
      certifications: ar.certificationsAr,
    }
  }, [locale])
}
