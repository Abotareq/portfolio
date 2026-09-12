# Ahmed Tarek Mohamed — Portfolio

Premium Full Stack Developer portfolio built with React, Three.js (React Three Fiber + Drei), Framer Motion and Tailwind CSS.

All content is generated from the resume (`public/Ahmed_Tarek_Mohamed_Resume.pdf`) and the public GitHub profile — nothing is invented.

## Run locally

```bash
npm install
npm run dev
```

Production build: `npm run build` (output in `dist/`).

## Updating content

Everything lives in **`src/data/portfolioData.js`**:

| Export            | What it drives                                    |
| ----------------- | ------------------------------------------------- |
| `personal`        | Name, title, summary, contact, languages          |
| `links`           | GitHub, LinkedIn, email, resume path              |
| `stats`           | Animated counters in About                        |
| `skills`          | Skill cards (grouped) and `techConstellation`     |
| `projects`        | Project cards (name, features, tech, links, image) |
| `experience`      | Vertical timeline                                 |
| `education`       | Education card                                    |
| `certifications`  | Marked as a placeholder — none in the resume      |
| `githubRepos`     | Featured repos (live stats are fetched at runtime) |
| `seo`             | `<title>` and meta description                    |

Project screenshots live in `public/projects/` and are referenced via each project's `image` field.

### Placeholders to fill in

- `certifications` — the resume lists none.
- `projects[tawreed].github` — no public repository was found for Tawreed; set the URL if it exists.

### Contact form

The form has no backend: it opens the visitor's email client with a pre-filled message to the address in the resume. To send server-side, replace `submit()` in `src/sections/Contact.jsx` with Formspree, EmailJS or an API route.

## The Developer Galaxy (default view)

The site opens as a scroll-driven 3D universe (`src/galaxy/`). The sun at the origin is the developer core; each section is a planet along a spiral path; projects are moons of the Projects gas giant; technologies orbit the Skills world as stars; experience entries are stations on an orbital timeline; education is an icy world with one small moon per program; Contact is a luminous beacon world.

| File | Role |
| --- | --- |
| `Galaxy.jsx` | Canvas + drei `ScrollControls` + the DOM overlay |
| `layout.js` | Planet positions, per-section camera keyframes (portrait/RTL aware) |
| `CameraRig.jsx` | Catmull-Rom camera path, dwell zones, mouse parallax, travel shake, snap-to-section, moon landing |
| `store.js` | Tiny external store shared by the scene and the overlay (section, progress, hovered, selected project) |
| `Core.jsx` / `materials.js` | Animated sun (simplex-noise shader, octaves by device tier), fresnel atmosphere shader |
| `textures.js` | Procedural planet textures (terra / ice / rock / giant / metal / beacon) — no image assets |
| `planets/Planet.jsx` | Realistic planet body: texture, atmosphere, clouds, rings, hover, cursor nudge |
| `planets/Systems.jsx` | The six systems: moons, tech stars, stations, degree moons, labels |
| `Background.jsx` | Three star layers, nebulae, distant galaxies, dust, instanced asteroid belts |
| `Overlay.jsx` / `panels/Panels.jsx` | Nav indicator, hints, per-section glass panels, project detail |

Navigation: wheel/drag travels between planets and snaps to the nearest one; the active panel is read to the end before the journey continues; clicking a planet or a nav dot glides there; clicking a moon lands the camera beside it and opens the project. `Esc` closes a project. The classic scrolling site is still available via the "Classic view" button (and is the default when `prefers-reduced-motion` is set, or with `?view=classic`).

## Theme & language

- **Dark / light** — toggled from the navbar (sun/moon). The whole palette is CSS variables in `src/styles/globals.css` (`:root.dark` / `:root.light`); Tailwind's `white`, `slate-*`, `bg`, `surface` and `accent` colours map to them, and the Three.js scenes read `src/three/palette.js`. The choice persists in `localStorage` and defaults to the OS preference.
- **English / Arabic** — toggled from the navbar (`ع` / `EN`). UI strings live in `src/data/i18n.js`; Arabic content overrides (keyed by project/experience id) live in `src/data/portfolioData.ar.js` and are merged over the English source by `usePortfolio()`. Arabic switches `<html dir="rtl">`, the Tajawal font, and mirrors the 3D compositions.

## 3D layers

| Scene | File | What it does |
| --- | --- | --- |
| Hero | `src/three/HeroScene.jsx` | Layered composition: core, orbiters, abstract shapes with connecting lines, 3D code symbols (`{ }`, `</>`, `<>`…), laptop, database, cloud, server rack, glass panels, background grid, instanced fore/background particles. Cursor proximity pushes objects, camera follows the mouse and scroll. Paused when scrolled away. |
| World | `src/three/WorldScene.jsx` | Fixed full-page canvas behind every section. Objects are anchored to sections (monitor/laptop/keyboard for Projects, server/cloud for Experience, git graph for GitHub, database for Contact…) and the camera travels down as you scroll, so scenery enters, grows, turns and recedes. Only mounted at viewports ≥ 1280px. |
| Tech orbit | `src/three/TechOrbit.jsx` | The resume's technologies orbit a core on three tilted rings, linked by lines that follow them; hover a node to highlight it. |

Shared primitives are in `src/three/objects/` (instanced particles, `Drift` bobbing/cursor-proximity wrapper, `ConnectionLines`, and the developer objects). Quality scales with `useDeviceTier` (particle counts, DPR, object count, glass materials) and respects `prefers-reduced-motion`.

`scripts/shot.mjs` captures desktop screenshots with headless Chrome: `node scripts/shot.mjs <name> <sectionId|0> <w> <h> <dark|light> <en|ar>`.

## Structure

```
src/
├── components/   Navbar, Footer, TiltCard, Reveal, Counter, SectionHeader, Placeholder
├── sections/     Hero, About, Skills, Projects, Experience, Education, GitHub, Contact
├── three/        HeroScene, WorldScene, TechOrbit, palette, objects/
├── context/      AppContext — theme + locale
├── data/         portfolioData.js (source of truth), portfolioData.ar.js, i18n.js
├── hooks/        useDeviceTier, useActiveSection, useGitHub, useMouse, usePortfolio
└── styles/       globals.css (Tailwind layers + design tokens)
```

The 3D scenes scale automatically: `useDeviceTier` picks `low | mid | high` from viewport width, CPU cores and `prefers-reduced-motion`, and the hero drops particle count, shape count, DPR and glass materials accordingly.

