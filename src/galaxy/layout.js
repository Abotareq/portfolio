import * as THREE from 'three'

/**
 * The journey. Sections are laid out along -Z in a loose spiral so travelling
 * between planets always crosses open space. Each entry defines the planet's
 * position and which side of the screen the HTML panel occupies (the camera
 * frames the planet on the opposite side).
 */
export const SECTIONS = ['home', 'about', 'skills', 'projects', 'experience', 'education', 'contact']

export const PLANETS = {
  home: { pos: [0, 0, 0], side: 'center' },
  about: { pos: [9, 1.2, -14], side: 'left', radius: 1.6, system: 3.6 },
  skills: { pos: [-11, -1.5, -30], side: 'right', radius: 1.9, system: 5.6 },
  projects: { pos: [12, 2.5, -50], side: 'left', radius: 3.2, system: 10.6 },
  experience: { pos: [-10, -2, -70], side: 'right', radius: 1.7, system: 6 },
  education: { pos: [8, 1.5, -88], side: 'left', radius: 1.5, system: 5.4 },
  contact: { pos: [-3, 0.5, -106], side: 'right', radius: 1.8, system: 5.6 },
}

/**
 * Camera keyframe for a section: where the camera sits and what it looks at.
 * `lateral` shifts the look target so the planet sits beside the panel.
 * `portrait` (phones) frames from further back and keeps the planet centred
 * high so the bottom sheet does not cover it.
 */
export function keyframe(id, portrait = false, rtl = false) {
  const p = PLANETS[id]
  const pos = new THREE.Vector3(...p.pos)
  const r = p.radius || 1.5
  if (id === 'home') {
    // the sun sits beside the introduction (above it on phones)
    const sx = rtl ? -4.6 : 4.6
    return {
      position: new THREE.Vector3(portrait ? 0 : -sx * 0.25, 1.0, portrait ? 24 : 15),
      target: new THREE.Vector3(portrait ? 0 : -sx, portrait ? -8 : 0.4, 0),
    }
  }
  // The panel covers one side of the screen, so the look target is shifted
  // toward the panel: the planet then sits in the open half.
  let side = p.side === 'left' ? 1 : -1
  if (rtl) side *= -1
  const sys = p.system || r * 2
  const dist = portrait ? sys * 2.4 + 5 : sys * 1.75 + 4
  const lateral = portrait ? 0 : sys * 0.5 + 1.2
  const lift = portrait ? sys * 0.55 + 1.2 : 0.2
  return {
    position: new THREE.Vector3(pos.x + side * 1.5, pos.y + 1.6 + (portrait ? 1.5 : 0), pos.z + dist),
    target: new THREE.Vector3(pos.x - side * lateral, pos.y - lift, pos.z),
  }
}

export const sectionIndex = (id) => SECTIONS.indexOf(id)
