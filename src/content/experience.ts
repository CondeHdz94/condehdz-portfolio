export interface CaseStudy {
  href: string
  label: string
  meta: string
  badge?: string
}

export interface ExperienceEntry {
  company: string
  role: string
  period: string
  tags: string[]
  desc: string
  caseStudy: CaseStudy
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: 'UNI2',
    role: 'Sr. Frontend Lead · Design Engineer',
    period: '2021 – Present',
    tags: ['React', 'TypeScript', 'Redux', 'Zustand', 'React Query', 'Zod', 'RHF', 'Tailwind', 'Figma'],
    desc: "Four years contributing to a 30-role banking platform (React + Redux) — currently as Sr. Frontend Lead and Founding Engineer on Uni2 Lite: FSD architecture, declarative form engine over Zod + RHF, decoupled stepper with dual edit/consult modes.",
    caseStudy: {
      href: '/case/uni2',
      label: 'Uni2 Lite — Credit orchestrator',
      meta: 'FSD · Zod + RHF · +470K lines',
      badge: 'current',
    },
  },
  {
    company: 'Taylor & Johnson',
    role: 'Multimedia Engineer',
    period: '2018 – 2021',
    tags: ['JavaScript', 'JsPDF', 'Python', 'Selenium'],
    desc: 'Modernized a COBOL banking core from legacy 5250 green-screen to web via Fresche Presto. Parametric document generation, digital signature with TOPAZ, and process automation with Python + Selenium.',
    caseStudy: {
      href: '/case/taylor-johnson',
      label: 'Taylor & Johnson — COBOL modernization',
      meta: 'Presto · JsPDF · TOPAZ · Selenium · 4 scenes',
    },
  },
  {
    company: 'Sistel',
    role: 'Web Course Developer',
    period: '2017 – 2018',
    tags: ['HTML5', 'CSS', 'Articulate', 'UX Design'],
    desc: 'Designed and built interactive e-learning experiences in HTML5 and Articulate, combining interactivity, ludic design and andragogy to drive engagement across corporate training programs.',
    caseStudy: {
      href: '/case/sistel',
      label: 'Sistel — E-learning design',
      meta: 'Visual identity · interactive authoring · LMS',
    },
  },
]
