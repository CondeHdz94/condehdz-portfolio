export type Tier = 'core' | 'working' | 'exploring'

export interface Skill {
  id:   string
  name: string
  cat:  'foundations' | 'forms' | 'motion' | 'systems'
  tier: Tier
  years: number
  icon: string
}

export interface SkillCategory {
  id: Skill['cat']
}

const TIER_ORDER: Record<Tier, number> = { core: 0, working: 1, exploring: 2 }

export const CATEGORIES: SkillCategory[] = [
  { id: 'foundations' },
  { id: 'forms'       },
  { id: 'motion'      },
  { id: 'systems'     },
]

export const SKILLS: Skill[] = ([
  // ── Foundations ──────────────────────────────────────────
  { id: 'react',      name: 'React',         cat: 'foundations', tier: 'core',      years: 5, icon: 'react'    },
  { id: 'typescript', name: 'TypeScript',    cat: 'foundations', tier: 'core',      years: 3, icon: 'ts'       },
  { id: 'javascript', name: 'JavaScript',    cat: 'foundations', tier: 'core',      years: 7, icon: 'js'       },
  { id: 'css',        name: 'CSS / SASS',    cat: 'foundations', tier: 'core',      years: 7, icon: 'css'      },
  { id: 'tailwind',   name: 'Tailwind',      cat: 'foundations', tier: 'core',      years: 3, icon: 'tailwind' },
  { id: 'svelte',     name: 'Svelte',        cat: 'foundations', tier: 'exploring', years: 1, icon: 'svelte'   },
  { id: 'astro',      name: 'Astro',         cat: 'foundations', tier: 'exploring', years: 1, icon: 'astro'    },

  // ── Forms & State ─────────────────────────────────────────
  { id: 'zod',     name: 'Zod',             cat: 'forms', tier: 'core',    years: 3, icon: 'zod'     },
  { id: 'rhf',     name: 'React Hook Form', cat: 'forms', tier: 'core',    years: 5, icon: 'rhf'     },
  { id: 'rquery',  name: 'React Query',     cat: 'forms', tier: 'core',    years: 3, icon: 'rquery'  },
  { id: 'zustand', name: 'Zustand',         cat: 'forms', tier: 'core',    years: 3, icon: 'zustand' },
  { id: 'redux',   name: 'Redux',           cat: 'forms', tier: 'working', years: 5, icon: 'redux'   },

  // ── Motion & Visual ───────────────────────────────────────
  { id: 'figma',       name: 'Figma',         cat: 'motion', tier: 'core',      years: 6, icon: 'figma'  },
  { id: 'framer',      name: 'Framer Motion', cat: 'motion', tier: 'exploring', years: 3, icon: 'framer' },
  { id: 'illustrator', name: 'Illustrator',   cat: 'motion', tier: 'working',   years: 3, icon: 'ai'     },
  { id: 'photoshop',   name: 'Photoshop',     cat: 'motion', tier: 'working',   years: 3, icon: 'ps'     },

  // ── Systems & Hygiene ─────────────────────────────────────
  { id: 'ds',      name: 'Design Systems',        cat: 'systems', tier: 'core',      years: 4, icon: 'ds'      },
  { id: 'fsd',     name: 'Feature-Sliced Design', cat: 'systems', tier: 'core',      years: 2, icon: 'fsd'     },
  { id: 'git',     name: 'Git',                   cat: 'systems', tier: 'core',      years: 5, icon: 'git'     },
  { id: 'a11y',    name: 'Accessibility',         cat: 'systems', tier: 'working',   years: 5, icon: 'a11y'    },
  { id: 'jest',    name: 'Jest',                  cat: 'systems', tier: 'exploring', years: 2, icon: 'jest'    },
  { id: 'rtl',     name: 'Testing Library',       cat: 'systems', tier: 'exploring', years: 2, icon: 'rtl'     },
  { id: 'cypress', name: 'Cypress',               cat: 'systems', tier: 'exploring', years: 1, icon: 'cypress' },
] as Skill[]).sort((a, b) => {
  if (a.cat !== b.cat) return 0
  return TIER_ORDER[a.tier] - TIER_ORDER[b.tier]
})
