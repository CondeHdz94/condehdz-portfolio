export interface CaseEntry {
  path:   string
  title:  string
}

export const CASES: CaseEntry[] = [
  { path: '/case/taylor-johnson', title: 'Taylor & Johnson' },
  { path: '/case/sistel',         title: 'Sistel'           },
]

export function getCaseNav(currentPath: string) {
  const idx  = CASES.findIndex(c => c.path === currentPath)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0                  ? CASES[idx - 1] : null,
    next: idx < CASES.length - 1  ? CASES[idx + 1] : null,
  }
}
