export type ExperienceKey = 'uni2' | 'tj' | 'sistel'

export interface CaseStudy {
  href:   string
  badge?: string
}

export interface ExperienceEntry {
  company: string
  role:    string
  period:  string
  tags:    string[]
  key:     ExperienceKey
  caseStudy: CaseStudy
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: 'UNI2',
    role:    'Sr. Frontend Lead · Design Engineer',
    period:  '2021 – Present',
    tags:    ['React', 'TypeScript', 'Redux', 'Zustand', 'React Query', 'Zod', 'RHF', 'Tailwind', 'Figma'],
    key:     'uni2',
    caseStudy: { href: '/case/uni2', badge: 'current' },
  },
  {
    company: 'Taylor & Johnson',
    role:    'Multimedia Engineer',
    period:  '2018 – 2021',
    tags:    ['JavaScript', 'JsPDF', 'Python', 'Selenium'],
    key:     'tj',
    caseStudy: { href: '/case/taylor-johnson' },
  },
  {
    company: 'Sistel',
    role:    'Web Course Developer',
    period:  '2017 – 2018',
    tags:    ['HTML5', 'CSS', 'Articulate', 'UX Design'],
    key:     'sistel',
    caseStudy: { href: '/case/sistel' },
  },
]
