import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * A card that tilts in 3D toward the cursor, with a tracking spotlight, a
 * glow that intensifies on hover, and `preserve-3d` so children using the
 * `.depth-1 / .depth-2 / .depth-3` classes float above the surface.
 * Touch pointers are ignored so mobile stays flat.
 */
export default function TiltCard({ children, className = '', intensity = 8, glow = '#22D3EE', lift = 1.015 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const hover = useMotionValue(0)
  const spring = { stiffness: 220, damping: 22, mass: 0.6 }
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), spring)
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), spring)
  const scale = useSpring(useTransform(hover, [0, 1], [1, lift]), spring)

  const onMove = (e) => {
    if (e.pointerType === 'touch' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    x.set(px - 0.5)
    y.set(py - 0.5)
    mx.set(px * 100)
    my.set(py * 100)
    hover.set(1)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
    hover.set(0)
  }

  const spotlight = useTransform([mx, my], ([a, b]) => `radial-gradient(420px circle at ${a}% ${b}%, ${glow}22, transparent 60%)`)
  const edge = useTransform([mx, my], ([a, b]) => `radial-gradient(300px circle at ${a}% ${b}%, ${glow}66, transparent 70%)`)
  const shadow = useTransform(hover, [0, 1], [`0 20px 60px -30px rgba(0,0,0,0.6)`, `0 30px 70px -25px ${glow}40, 0 0 0 1px ${glow}33`])

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, scale, transformStyle: 'preserve-3d', perspective: 1200 }}
      className={`relative group [transform-style:preserve-3d] ${className}`}
    >
      {/* glow shadow that follows the tilt */}
      <motion.div style={{ boxShadow: shadow }} className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500" />
      {/* spotlight fill */}
      <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0 z-[1] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {/* glowing edge (masked to a 1px ring) */}
      <motion.div
        style={{ background: edge, WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: 1 }}
        className="pointer-events-none absolute inset-0 z-[2] rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </motion.div>
  )
}
