import { useEffect, useState } from 'react'

/**
 * Tracks whether an element is on screen (with margin) so a Canvas can switch
 * its frameloop to "never" and cost nothing while scrolled away.
 */
export default function useSceneActive(ref, margin = '200px') {
  const [active, setActive] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    const onVis = () => setActive(!document.hidden && active)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, margin])
  return active
}
