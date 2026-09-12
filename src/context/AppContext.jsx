import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ui } from '../data/i18n'

/**
 * App-wide theme (dark | light) and locale (en | ar) state.
 * Both persist to localStorage and are reflected on <html> so CSS
 * (`.dark` / `.light`, `dir="rtl"`) and the 3D scenes can react.
 */
const AppContext = createContext(null)

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function initialTheme() {
  const saved = read('theme', null)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function initialView() {
  const q = new URLSearchParams(window.location.search).get('view')
  if (q === 'classic' || q === 'galaxy') return q
  const saved = read('view', null)
  if (saved === 'classic' || saved === 'galaxy') return saved
  // reduced-motion users get the calm scrolling site by default
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'classic' : 'galaxy'
}

function initialLocale() {
  const saved = read('locale', null)
  if (saved === 'en' || saved === 'ar') return saved
  return navigator.language?.startsWith('ar') ? 'ar' : 'en'
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)
  const [locale, setLocale] = useState(initialLocale)
  const [view, setView] = useState(initialView)

  // The galaxy is deep space: it always renders with the dark palette.
  useEffect(() => {
    const root = document.documentElement
    const effective = view === 'galaxy' ? 'dark' : theme
    root.classList.remove('dark', 'light')
    root.classList.add(effective)
    root.style.colorScheme = effective
    try {
      localStorage.setItem('theme', theme)
      localStorage.setItem('view', view)
    } catch {}
  }, [theme, view])

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = locale === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem('locale', locale)
    } catch {}
  }, [locale])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  const toggleLocale = useCallback(() => setLocale((l) => (l === 'en' ? 'ar' : 'en')), [])

  // t('a.b.c') → string for the active locale, falling back to English.
  const t = useCallback(
    (path) => {
      const pick = (dict) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict)
      const v = pick(ui[locale])
      return v ?? pick(ui.en) ?? path
    },
    [locale]
  )

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, locale, setLocale, toggleLocale, t, isRTL: locale === 'ar', isDark: theme === 'dark', view, setView }),
    [theme, toggleTheme, locale, toggleLocale, t, view]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
