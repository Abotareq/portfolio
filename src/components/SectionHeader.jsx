import { motion } from 'framer-motion'

export default function SectionHeader({ eyebrow, title, lede, align = 'left' }) {
  const center = align === 'center'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={center ? 'text-center flex flex-col items-center' : ''}
    >
      <span className="eyebrow">
        <span className="h-px w-6 bg-accent/70" />
        {eyebrow}
      </span>
      <h2 className="h2">{title}</h2>
      {lede && <p className={`lede ${center ? 'mx-auto' : ''}`}>{lede}</p>}
    </motion.div>
  )
}
