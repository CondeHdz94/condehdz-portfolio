export type Tier = 'core' | 'working' | 'exploring'

export interface Skill {
  id: string
  name: string
  cat: 'foundations' | 'forms' | 'motion' | 'systems'
  tier: Tier
  years: number
  icon: string
  note: string
}

export interface SkillCategory {
  id: Skill['cat']
  title: string
  hint: string
}

export const CATEGORIES: SkillCategory[] = [
  { id: 'foundations', title: 'Foundations',       hint: 'Interfaces that survive their second team.' },
  { id: 'forms',       title: 'Forms & State',     hint: "The hard parts other people don't want to write." },
  { id: 'motion',      title: 'Motion & Visual',   hint: 'Where the design language is rehearsed.' },
  { id: 'systems',     title: 'Systems & Hygiene', hint: 'Architecture, tests, accessibility.' },
]

const TIER_ORDER: Record<Tier, number> = { core: 0, working: 1, exploring: 2 }

export const SKILLS: Skill[] = ([
  // ── Foundations ──────────────────────────────────────────
  { id: 'react',      name: 'React',         cat: 'foundations', tier: 'core',      years: 5, icon: 'react',    note: 'Daily. Architecting Uni2 Lite on hooks + suspense patterns.' },
  { id: 'typescript', name: 'TypeScript',    cat: 'foundations', tier: 'core',      years: 3, icon: 'ts',       note: 'Strict mode by default. Generics over comments.' },
  { id: 'javascript', name: 'JavaScript',    cat: 'foundations', tier: 'core',      years: 7, icon: 'js',       note: 'The substrate.' },
  { id: 'css',        name: 'CSS / SASS',    cat: 'foundations', tier: 'core',      years: 7, icon: 'css',      note: 'CSS variables, container queries, the new stuff.' },
  { id: 'tailwind',   name: 'Tailwind',      cat: 'foundations', tier: 'working',   years: 3, icon: 'tailwind', note: 'With tokens, never with magic numbers.' },

  // ── Forms & State ─────────────────────────────────────────
  { id: 'zod',     name: 'Zod',             cat: 'forms', tier: 'core',    years: 3, icon: 'zod',     note: 'Schemas as the source of truth — types, runtime, forms.' },
  { id: 'rhf',     name: 'React Hook Form', cat: 'forms', tier: 'core',    years: 5, icon: 'rhf',     note: 'Wired with Zod. The form engine on Uni2.' },
  { id: 'rquery',  name: 'React Query',     cat: 'forms', tier: 'core',    years: 3, icon: 'rquery',  note: 'Server state, cached. The right boundary.' },
  { id: 'zustand', name: 'Zustand',         cat: 'forms', tier: 'core',    years: 3, icon: 'zustand', note: 'When Redux is overkill but useState is underkill.' },
  { id: 'redux',   name: 'Redux',           cat: 'forms', tier: 'working', years: 5, icon: 'redux',   note: 'Toolkit-era. Slices, RTK Query.' },

  // ── Motion & Visual ───────────────────────────────────────
  { id: 'figma',       name: 'Figma',         cat: 'motion', tier: 'core',      years: 6, icon: 'figma',    note: 'Tokens, variants, a real handoff.' },
  { id: 'framer',      name: 'Framer Motion', cat: 'motion', tier: 'exploring', years: 3, icon: 'framer',   note: 'Layout animations, gesture-driven UI.' },
  { id: 'illustrator', name: 'Illustrator',   cat: 'motion', tier: 'working',   years: 3, icon: 'ai',       note: 'Vector. Logo work, icon systems.' },
  { id: 'photoshop',   name: 'Photoshop',     cat: 'motion', tier: 'working',   years: 3, icon: 'ps',       note: 'Composites. Color grading. Mockups.' },

  // ── Systems & Hygiene ─────────────────────────────────────
  { id: 'ds',   name: 'Design Systems',        cat: 'systems', tier: 'core',      years: 4, icon: 'ds',   note: 'Tokens, primitives, contracts. The kind that survive.' },
  { id: 'fsd',  name: 'Feature-Sliced Design', cat: 'systems', tier: 'core',      years: 2, icon: 'fsd',  note: 'Architecture for codebases that outlive features.' },
  { id: 'git',  name: 'Git',                   cat: 'systems', tier: 'core',      years: 5, icon: 'git',  note: 'Trunk-based, clean history.' },
  { id: 'a11y', name: 'Accessibility',         cat: 'systems', tier: 'working',   years: 5, icon: 'a11y', note: 'WCAG, focus rings, prefers-reduced-motion.' },
  { id: 'jest', name: 'Jest',                  cat: 'systems', tier: 'exploring', years: 2, icon: 'jest', note: 'Unit, snapshot, the boring reliable layer.' },
  { id: 'rtl',  name: 'Testing Library',       cat: 'systems', tier: 'exploring', years: 2, icon: 'rtl',  note: 'Tests that read like specs.' },
] as Skill[]).sort((a, b) => {
  if (a.cat !== b.cat) return 0
  return TIER_ORDER[a.tier] - TIER_ORDER[b.tier]
})
