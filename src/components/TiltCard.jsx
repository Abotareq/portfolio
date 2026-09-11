import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * A card with a subtle 3D tilt that follows the cursor and a spotlight that
 * tracks it. Touch pointers are ignored so mobile stays flat.
 */
export default function TiltCard({ children, className = '', intensity = 8, glow = '#22D3EE' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 20 })

  const onMove = (e) => {
    if (e.pointerType === 'touch' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    x.set(px - 0.5)
    y.set(py - 0.5)
    mx.set(px * 100)
    my.set(py * 100)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const spotlight = useTransform([mx, my], ([a, b]) => `radial-gradient(360px circle at ${a}% ${b}%, ${glow}1f, transparent 60%)`)

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative group ${className}`}
    >
      <motion.div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 z-[1] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </motion.div>
  )
}
