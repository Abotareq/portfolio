/** @type {import('tailwindcss').Config} */
// The neutral scale is driven by CSS variables (see styles/globals.css) so a
// single `.light` / `.dark` class on <html> flips the whole palette.
const v = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('--bg'),
        surface: v('--surface'),
        white: v('--fg'),
        accent: { DEFAULT: v('--accent'), soft: v('--accent-soft'), dim: v('--accent-dim') },
        slate: {
          100: v('--s100'), 200: v('--s200'), 300: v('--s300'), 400: v('--s400'), 500: v('--s500'),
          600: v('--s600'), 700: v('--s700'), 800: v('--s800'), 900: v('--s900'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgb(var(--accent) / 0.45)',
        'glow-sm': '0 0 18px -6px rgb(var(--accent) / 0.5)',
        card: '0 20px 60px -30px rgb(var(--shadow) / 0.8)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to right, rgb(var(--fg) / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--fg) / 0.04) 1px, transparent 1px)',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
        pulseSoft: { '0%,100%': { opacity: 0.5 }, '50%': { opacity: 1 } },
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
