import { useSyncExternalStore } from 'react'

/**
 * Tiny external store shared between the R3F scene (which drives it every
 * frame) and the DOM overlay (which reads it). Avoids React re-renders in the
 * render loop: `set` only notifies when a value actually changes.
 */
const state = {
  section: 0, // active section index
  progress: 0, // 0..1 within the active section
  offset: 0, // 0..1 across the whole journey
  hovered: null, // { kind: 'planet' | 'moon', id }
  project: null, // selected project id (opens the detail panel)
  ready: false, // scene has mounted
  scrollTo: null, // function(index) registered by the scene
}

const listeners = new Set()

export const galaxy = {
  /** id → Object3D for project moons, so the camera can fly to one. */
  moons: new Map(),
  get: () => state,
  set(patch) {
    let changed = false
    for (const k in patch) {
      if (state[k] !== patch[k]) {
        state[k] = patch[k]
        changed = true
      }
    }
    if (changed) listeners.forEach((l) => l())
  },
  subscribe(l) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export function useGalaxy(selector = (s) => s) {
  return useSyncExternalStore(galaxy.subscribe, () => selector(state), () => selector(state))
}

// Dev-only handle for inspecting the store from the console.
if (import.meta.env.DEV && typeof window !== 'undefined') window.__galaxy = galaxy
