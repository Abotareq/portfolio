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

## Structure

```
src/
├── components/   Navbar, Footer, TiltCard, Reveal, Counter, SectionHeader, Placeholder
├── sections/     Hero, About, Skills, Projects, Experience, Education, GitHub, Contact
├── three/        HeroScene (hero 3D), TechConstellation (skills 3D)
├── data/         portfolioData.js — single source of truth
├── hooks/        useDeviceTier, useActiveSection, useGitHub, useMouse
└── styles/       globals.css (Tailwind layers + design tokens)
```

The 3D scenes scale automatically: `useDeviceTier` picks `low | mid | high` from viewport width, CPU cores and `prefers-reduced-motion`, and the hero drops particle count, shape count, DPR and glass materials accordingly.

