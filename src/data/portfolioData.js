/**
 * portfolioData — the single source of truth for the whole site.
 *
 * Everything here was extracted from the resume (Full_Stack.pdf) and the
 * public GitHub profile (github.com/Abotareq). Edit this file to update the
 * portfolio; no section hardcodes any personal information.
 *
 * Anything marked `placeholder: true` was NOT found in the resume or links and
 * needs to be filled in by you.
 */

export const personal = {
  name: 'Ahmed Tarek Mohamed',
  shortName: 'Ahmed Tarek',
  title: 'Full Stack Developer',
  location: 'Giza, Egypt',
  email: '2hmadtareq@gmail.com',
  phone: '+20-01112968759',
  degreeLine: 'Bachelor of Science in Computer Science',
  // Verbatim professional summary from the resume.
  summary:
    'Full-stack developer working mainly in .NET and React, with hands-on backend and frontend experience across SQL Server, EF Core, React, and Angular. Contributed to the architecture and backend of Tawreed, a B2B group purchasing platform for small businesses, working with Clean Architecture, ASP.NET Core, JWT authentication, and role-based access control. Also work across the MERN stack and have shipped a live Arabic RTL e-commerce platform with React and Node. Comfortable working across the stack from database schema to UI.',
  // Short intro for the hero (condensed from the summary above).
  intro:
    'I build production-grade web applications across .NET and React — from Clean Architecture backends with ASP.NET Core and SQL Server to polished, responsive front ends. Comfortable owning the full stack, from database schema to UI.',
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Very Good' },
  ],
  extras: [
    { label: 'Nationality', value: 'Egyptian' },
    { label: 'Military Service', value: 'Exempt' },
  ],
  avatar: 'https://avatars.githubusercontent.com/u/96955833?v=4',
};

export const links = {
  github: 'https://github.com/Abotareq',
  githubUser: 'Abotareq',
  linkedin: 'https://www.linkedin.com/in/ahmad-tarek-0587a31b0',
  email: 'mailto:2hmadtareq@gmail.com',
  // The resume PDF is served from /public.
  resume: '/Ahmed_Tarek_Mohamed_Resume.pdf',
};

// Stats derived strictly from facts in the resume / GitHub profile.
export const stats = [
  { value: 5, suffix: '', label: 'Projects shipped', note: '3 in resume + 2 on GitHub' },
  { value: 4, suffix: '', label: 'Team members led', note: 'Herfy — formally assigned team lead' },
  { value: 2, suffix: '', label: 'Engineering trainee programs', note: 'Next Technology · ITI' },
  { value: 18, suffix: '', label: 'Public repositories', note: 'github.com/Abotareq' },
];

export const skills = [
  {
    category: 'Languages',
    items: ['JavaScript', 'TypeScript', 'C#', 'C++', 'Python', 'SQL'],
  },
  {
    category: 'Frontend',
    items: ['React.js', 'Next.js', 'Angular', 'Tailwind CSS', 'Bootstrap', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'ASP.NET Core Web API', 'Entity Framework Core', 'GraphQL'],
  },
  {
    category: 'Databases',
    items: ['MongoDB', 'Mongoose', 'SQL Server', 'Prisma ORM'],
  },
  {
    category: 'Authentication',
    items: ['JWT', 'ASP.NET Identity', 'Role-Based Access Control'],
  },
  {
    category: 'DevOps / Tools',
    items: ['Git', 'GitHub', 'Postman', 'VS Code', 'Docker (Basic)'],
  },
  {
    category: 'Architecture & Concepts',
    items: [
      'REST APIs',
      'OOP',
      'Design Patterns',
      'Clean Architecture',
      'DDD',
      'Agile Methodology',
      'Team Leadership',
    ],
  },
];

// Flat list used by the 3D constellation.
export const techConstellation = [
  'React', 'Next.js', 'Angular', 'TypeScript', 'JavaScript', 'C#', 'Python', 'C++',
  'ASP.NET Core', 'EF Core', 'Node.js', 'Express', 'GraphQL', 'SQL Server', 'MongoDB',
  'Mongoose', 'Prisma', 'JWT', 'Tailwind', 'Docker', 'Git', 'Clean Arch', 'DDD', 'CQRS',
];

export const projects = [
  {
    id: 'tawreed',
    name: 'Tawreed',
    tagline: 'Group Purchasing Platform for Small Businesses',
    role: 'Contributor – Architecture & Backend Development',
    year: '2026',
    type: 'B2B Platform',
    description:
      'A B2B platform connecting small business buyers with suppliers for bulk ordering. Small businesses pool orders to access supplier pricing normally reserved for bulk buyers.',
    features: [
      'Contributed to system architecture and backend design for the group purchasing platform',
      'Backend implemented with ASP.NET Core Web API, C#, EF Core, SQL Server and ASP.NET Identity, applying Clean Architecture',
      'Authentication and role-based authorization logic with JWT and FluentValidation',
      'Repository Pattern, Service Layer, dependency injection and DTO mapping in assigned modules',
    ],
    tech: ['ASP.NET Core', 'C#', 'Entity Framework Core', 'SQL Server', 'ASP.NET Identity', 'JWT', 'FluentValidation', 'Clean Architecture'],
    live: 'https://tawreed-frontend.vercel.app/',
    image: '/projects/tawreed.webp', // screenshot of the live site
    github: null, // Not found in resume links or public GitHub profile — add repo URL if public.
    featured: true,
    accent: '#22D3EE',
  },
  {
    id: 'herfy',
    name: 'Herfy',
    tagline: 'Arabic RTL E-commerce Platform for Handicrafts',
    role: 'Team Lead – 4-person team',
    year: '2025',
    type: 'E-commerce · MERN',
    description:
      'Full-stack Arabic e-commerce platform with RTL support and a multi-vendor marketplace: vendors run their own stores while customers browse, review and order handcrafted products.',
    features: [
      'Led a 4-person team as formally assigned team lead: assigned tasks, reviewed pull requests and made architecture decisions',
      'Role-based authorization, JWT authentication, cart management, checkout workflows and order management',
      'Application state managed with Redux Toolkit, Context API and TanStack Query',
      'Multi-vendor stores, product variants, reviews, coupons, Stripe payments and Cloudinary uploads (backend README)',
    ],
    tech: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'TanStack Query', 'Stripe'],
    live: 'https://herfey-client-side.vercel.app/en',
    image: '/projects/herfy.webp', // screenshot of the live site
    liveAdmin: 'https://herafy-admin.vercel.app',
    github: 'https://github.com/Abotareq/herfey-client-side',
    githubBackend: 'https://github.com/Abotareq/herfy',
    featured: true,
    accent: '#F59E0B',
  },
  {
    id: 'helpdesk-lite',
    name: 'HelpDesk Lite',
    tagline: 'Internal Support Ticketing Workspace',
    role: 'Solo – Full-stack (TypeScript monorepo)',
    year: '2026',
    type: 'Internal Tool · MERN',
    description:
      'A lightweight internal ticketing workspace: employees submit requests, support staff claim and work them, and managers see what is open. One npm-workspace repo with a typed Express + MongoDB API and a React 19 + Vite client.',
    features: [
      'Five-state request workflow with a reopen path, single ownership with claim and reassignment, and full per-request history',
      'Three roles (employee, agent, manager) with route gating, a manager queue, dashboard counts and account administration',
      'Layered backend where the domain never imports Mongoose; repository interfaces are the seam for Jest unit tests with enforced coverage thresholds',
      'Micro-component React UI with TanStack Query, React Router and strict TypeScript; build typechecks before it bundles',
    ],
    tech: ['TypeScript', 'React 19', 'Vite', 'Tailwind CSS', 'TanStack Query', 'React Router', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Zod', 'Jest'],
    live: 'https://helpdesk-lite-abotareqs-projects.vercel.app/sign-in',
    image: '/projects/helpdesk-lite.webp', // screenshot of the live site
    github: 'https://github.com/Abotareq/Help_Desk_Lite',
    featured: true,
    accent: '#A78BFA',
  },
  {
    id: 'customer-service',
    name: 'Customer Support Request Management',
    tagline: 'DDD / Clean Architecture Backend System',
    role: 'Solo – Backend',
    year: '2026',
    type: 'Backend API · .NET',
    description:
      'A backend for receiving, tracking and resolving customer support requests, built on ASP.NET Core with Clean Architecture, Domain-Driven Design and CQRS via MediatR.',
    features: [
      'Clean Architecture with DDD and CQRS (MediatR) covering request submission, assignment, status changes and customer–agent messaging',
      'JWT authentication with refresh-token rotation, email verification and forgot/reset password flows using ASP.NET Identity',
      'Real-time message delivery with SignalR, broadcasting updates per request to connected customers and agents',
      'Role-based and resource-level authorization so customers, agents and managers only see the requests they should',
    ],
    tech: ['.NET 10', 'ASP.NET Core', 'Entity Framework Core', 'SQL Server', 'MediatR', 'FluentValidation', 'ErrorOr', 'SignalR', 'JWT', 'Swagger'],
    live: null,
    github: 'https://github.com/Abotareq/customer-service',
    featured: false,
    accent: '#34D399',
  },
  {
    id: 'inventory',
    name: 'Fulfillment & Inventory Management Platform',
    tagline: 'Warehouse Inventory & Order Processing API',
    role: 'Solo – Backend',
    year: '2026',
    type: 'Backend API · .NET',
    description:
      'A backend API for managing product catalogs, multi-warehouse inventory and customer orders, keeping stock accurate as orders move through their lifecycle with a full audit trail.',
    features: [
      'Two-phase stock reservation model (physical vs. reserved) with an order lifecycle Draft → Submitted → Processing → Completed',
      'Optimistic concurrency on Stock and Order plus idempotent order creation via client-supplied keys',
      'Field-level audit log across every aggregate, driven by domain events dispatched from a SaveChanges interceptor',
      'Four roles (Administrator, Warehouse Operator, Sales Agent, Manager) with JWT auth via ASP.NET Identity',
    ],
    tech: ['.NET 10', 'ASP.NET Core', 'Entity Framework Core', 'MediatR', 'FluentValidation', 'ASP.NET Identity', 'JWT', 'Clean Architecture'],
    live: null,
    github: 'https://github.com/Abotareq/Inventory-Management-Platform',
    featured: false,
    accent: '#FB7185',
  },
];

export const experience = [
  {
    id: 'next',
    title: 'Software Full-Stack Engineer Trainee',
    company: 'Next for Technology Development',
    location: 'Cairo, Egypt',
    date: '2026',
    kind: 'Training',
    bullets: [
      'Built and deployed full-stack features end to end: ASP.NET Core Web APIs backed by SQL Server and EF Core, paired with React front ends',
      'Implemented JWT authentication and role-based authorization across a layered architecture',
      'Used Git branching and pull request workflows in a team setting',
    ],
    tech: ['ASP.NET Core', 'SQL Server', 'EF Core', 'React', 'JWT', 'Git'],
  },
  {
    id: 'iti',
    title: 'MEARN Stack Trainee',
    company: 'Information Technology Institute (ITI)',
    location: 'Egypt',
    date: '2025',
    kind: 'Training',
    bullets: [
      'Built full-stack applications on the MERN stack: Express and Node APIs, MongoDB schemas, React and Angular front ends',
      'Built and integrated RESTful APIs between frontend and backend layers',
      'Worked in a team using Git version control and Agile sprints',
    ],
    tech: ['Node.js', 'Express', 'MongoDB', 'React', 'Angular', 'REST', 'Git', 'Agile'],
  },
];

export const education = [
  {
    id: 'bsc',
    degree: 'Bachelor of Science (BS) in Computer Science',
    institution: 'University of Greenwich & October University for Modern Sciences & Arts (MSA)',
    location: 'Egypt',
    date: '2019 – 2024',
    details: ['Dual-accredited program', 'Grade: Good'],
  },
];

// Not present in the resume — shown as a clearly marked placeholder.
export const certifications = [
  {
    placeholder: true,
    text: 'No certifications were listed in the resume. Add them here in src/data/portfolioData.js → certifications.',
  },
];

// Repositories to feature in the "Explore My Code" section. Live data
// (stars, language, last push) is fetched from the GitHub API at runtime and
// falls back to these snapshot values if the request fails.
export const githubRepos = [
  {
    name: 'Help_Desk_Lite',
    url: 'https://github.com/Abotareq/Help_Desk_Lite',
    description: 'Internal support ticketing workspace — Express + MongoDB API and React 19 client in one TypeScript monorepo.',
    language: 'TypeScript',
    homepage: 'https://helpdesk-lite-abotareqs-projects.vercel.app/sign-in',
    stars: 0,
  },
  {
    name: 'customer-service',
    url: 'https://github.com/Abotareq/customer-service',
    description: 'Customer Support Request Management API — Clean Architecture, DDD and CQRS on ASP.NET Core with SignalR.',
    language: 'C#',
    homepage: null,
    stars: 0,
  },
  {
    name: 'Inventory-Management-Platform',
    url: 'https://github.com/Abotareq/Inventory-Management-Platform',
    description: 'Fulfillment & inventory API — multi-warehouse stock, order lifecycle, audit trail and concurrency control.',
    language: 'C#',
    homepage: null,
    stars: 0,
  },
  {
    name: 'herfey-client-side',
    url: 'https://github.com/Abotareq/herfey-client-side',
    description: 'Herfy storefront — Next.js Arabic RTL e-commerce client.',
    language: 'JavaScript',
    homepage: 'https://herfey-client-side.vercel.app',
    stars: 2,
  },
  {
    name: 'herfy',
    url: 'https://github.com/Abotareq/herfy',
    description: 'Herfy backend — multi-vendor e-commerce API for handicrafts (Node, Express, MongoDB, Stripe).',
    language: 'JavaScript',
    homepage: 'https://herfy-xi.vercel.app',
    stars: 2,
  },
  {
    name: 'imDb',
    url: 'https://github.com/Abotareq/imDb',
    description: 'Movie database app.',
    language: 'JavaScript',
    homepage: null,
    stars: 0,
  },
];

export const seo = {
  title: `${personal.name} | ${personal.title}`,
  description: `${personal.name} — ${personal.title} based in ${personal.location}. .NET and React full-stack developer with experience in ASP.NET Core, SQL Server, EF Core, React, Angular and the MERN stack.`,
};

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export default { personal, links, stats, skills, techConstellation, projects, experience, education, certifications, githubRepos, seo, navLinks };
