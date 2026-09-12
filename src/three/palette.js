/** Theme-aware colours for every Three.js scene. */
export const PALETTES = {
  dark: {
    bg: '#070A12',
    fog: '#070A12',
    accent: '#22D3EE',
    accentSoft: '#67E8F9',
    mesh: '#1f4560',
    meshDark: '#10263a',
    screen: '#0b2a36',
    glass: '#9ff5ff',
    text: '#e2f7fb',
    particle: '#22D3EE',
    wireOpacity: 0.35,
    glowIntensity: 0.35,
    ambient: 0.35,
  },
  light: {
    bg: '#F4F6FB',
    fog: '#F4F6FB',
    accent: '#0E7490',
    accentSoft: '#0891B2',
    mesh: '#dbe4f0',
    meshDark: '#c5d2e3',
    screen: '#d8f1f7',
    glass: '#cfeef6',
    text: '#0b1220',
    particle: '#0E7490',
    wireOpacity: 0.28,
    glowIntensity: 0.12,
    ambient: 1.1,
  },
}

export const getPalette = (theme) => PALETTES[theme] || PALETTES.dark
