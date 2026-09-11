import { useEffect, useState } from 'react'

/**
 * Returns a coarse device tier used to scale down the 3D scene automatically.
 * 'low'  → phones / reduced-motion / few cores
 * 'mid'  → tablets & small laptops
 * 'high' → desktop
 */
export default function useDeviceTier() {
  const [tier, setTier] = useState(() => detect())
  useEffect(() => {
    const onResize = () => setTier(detect())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return tier
}

function detect() {
  if (typeof window === 'undefined') return 'high'
  const w = window.innerWidth
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const cores = navigator.hardwareConcurrency || 4
  const mobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (reduced || w < 640 || (mobileUA && cores <= 4)) return 'low'
  if (w < 1024 || mobileUA) return 'mid'
  return 'high'
}
