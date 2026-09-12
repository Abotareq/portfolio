import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { SECTIONS, keyframe } from './layout'
import { galaxy, useGalaxy } from './store'

/**
 * Scroll → camera journey. Keyframes (one per planet) are joined by a
 * Catmull-Rom spline so travelling between worlds sweeps through open space.
 * Scroll offset is remapped with a dwell zone so the camera rests on each
 * planet before departing. Mouse adds parallax; fast travel adds a faint
 * shake; a selected project moon overrides everything and the camera lands
 * beside it.
 */
const _pos = new THREE.Vector3()
const _tgt = new THREE.Vector3()
const _moon = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _shake = new THREE.Vector3()

function dwell(f) {
  // hold for the first/last 12% of each leg, ease through the middle
  const x = THREE.MathUtils.clamp((f - 0.12) / 0.76, 0, 1)
  return x * x * (3 - 2 * x)
}

export default function CameraRig({ portrait, rtl, motion, lookTarget }) {
  const scroll = useScroll()
  const { camera } = useThree()
  const project = useGalaxy((s) => s.project)
  const last = useRef({ offset: 0, section: -1 })
  const shakeAmp = useRef(0)

  const frames = useMemo(() => SECTIONS.map((id) => keyframe(id, portrait, rtl)), [portrait, rtl])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(frames.map((f) => f.position), false, 'centripetal', 0.35), [frames])

  // Programmatic travel (nav dots, planet clicks, snapping). While a glide is
  // in flight, scroll events are ignored so a slow frame can't trigger a snap
  // back to where we came from.
  useEffect(() => {
    const el = scroll.el
    if (!el) return
    const legs = SECTIONS.length - 1
    let glideTarget = null
    let glideUntil = 0
    let idleTimer

    const glide = (top) => {
      glideTarget = top
      glideUntil = performance.now() + 1800
      el.scrollTo({ top, behavior: 'smooth' })
    }
    const toSection = (index) => {
      const max = el.scrollHeight - el.clientHeight
      glide((THREE.MathUtils.clamp(index, 0, legs) / legs) * max)
    }
    galaxy.set({ scrollTo: toSection, ready: true })

    const onScroll = () => {
      if (glideTarget !== null) {
        if (Math.abs(el.scrollTop - glideTarget) < 2 || performance.now() > glideUntil) glideTarget = null
        return
      }
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        // user stopped between planets → settle on the nearest one
        const max = el.scrollHeight - el.clientHeight
        const s = (el.scrollTop / max) * legs
        const nearest = Math.round(s)
        if (Math.abs(s - nearest) > 0.015) toSection(nearest)
      }, 420)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(idleTimer)
    }
  }, [scroll])

  useFrame((state, dt) => {
    const offset = scroll.offset
    const legs = SECTIONS.length - 1
    const s = offset * legs
    const i = Math.min(legs - 1, Math.floor(s))
    const f = s - i
    const e = dwell(f)
    const u = (i + e) / legs

    // store updates (cheap; only notifies on change)
    const section = Math.round(s)
    const progress = f
    galaxy.set({ section, progress: Math.round(progress * 100) / 100, offset: Math.round(offset * 1000) / 1000 })

    // travel speed → shake
    const vel = Math.abs(offset - last.current.offset) / Math.max(dt, 1e-3)
    last.current.offset = offset
    shakeAmp.current = THREE.MathUtils.lerp(shakeAmp.current, Math.min(0.09, vel * 0.5), dt * 4)

    const px = motion ? state.pointer.x : 0
    const py = motion ? state.pointer.y : 0

    if (project && galaxy.moons.get(project)) {
      // land beside the selected moon
      galaxy.moons.get(project).getWorldPosition(_moon)
      _dir.copy(camera.position).sub(_moon).normalize()
      if (_dir.lengthSq() < 0.001) _dir.set(0, 0.3, 1)
      _pos.copy(_moon).addScaledVector(_dir, 3.4).add(new THREE.Vector3(px * 0.3, 0.7 + py * 0.2, 0))
      _tgt.copy(_moon)
      if (!portrait) _tgt.x += rtl ? -1.1 : 1.1
      else _tgt.y -= 1.4
    } else {
      curve.getPoint(u, _pos)
      _tgt.copy(frames[i].target).lerp(frames[i + 1].target, e)
      _pos.x += px * 0.7
      _pos.y += py * 0.45
      _tgt.x += px * 0.35
      _tgt.y += py * 0.25
    }

    // cinematic smoothing
    const k = project ? 2.2 : 3
    camera.position.lerp(_pos, Math.min(1, dt * k))
    lookTarget.lerp(_tgt, Math.min(1, dt * k))

    if (motion && shakeAmp.current > 0.002) {
      const t = state.clock.elapsedTime * 22
      _shake.set(Math.sin(t) * 0.6, Math.cos(t * 1.3), Math.sin(t * 0.7)).multiplyScalar(shakeAmp.current)
      camera.position.add(_shake)
    }
    camera.lookAt(lookTarget)
  })

  return null
}
