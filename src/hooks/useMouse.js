import { useEffect, useRef } from 'react'

/** Normalised mouse position (-1..1) stored in a ref so it never re-renders React. */
export default function useMouse() {
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return mouse
}
