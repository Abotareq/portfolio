import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import Universe from './Universe'
import Overlay from './Overlay'
import { SECTIONS } from './layout'
import { galaxy } from './store'
import useDeviceTier from '../hooks/useDeviceTier'
import usePortfolio from '../hooks/usePortfolio'
import { useApp } from '../context/AppContext'

const DPR = { low: [1, 1], mid: [1, 1.5], high: [1, 1.75] }

/**
 * The Developer Galaxy — a single connected 3D world. Scrolling drives the
 * camera between planets; the DOM overlay shows the active section's content.
 */
export default function Galaxy() {
  const tier = useDeviceTier()
  const { t, isRTL } = useApp()
  const data = usePortfolio()
  const [portrait, setPortrait] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setPortrait(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // reset transient state when unmounting (switching to the classic view)
  useEffect(() => () => galaxy.set({ project: null, hovered: null, ready: false, section: 0 }), [])

  // Escape closes an open project
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && galaxy.set({ project: null })
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#05070e] text-slate-200" dir={isRTL ? 'rtl' : 'ltr'}>
      <Canvas
        dpr={DPR[tier]}
        camera={{ position: [0, 1.0, 14.5], fov: portrait ? 60 : 50, near: 0.1, far: 220 }}
        gl={{ antialias: tier !== 'low', powerPreference: 'high-performance', alpha: false }}
        shadows={false}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={SECTIONS.length} damping={0.12} distance={0.9}>
            <Universe tier={tier} portrait={portrait} rtl={isRTL} data={data} t={t} />
          </ScrollControls>
        </Suspense>
      </Canvas>
      <Overlay portrait={portrait} tier={tier} />
    </div>
  )
}
