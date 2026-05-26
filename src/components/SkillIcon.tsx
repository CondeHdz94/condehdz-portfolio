import type { ReactNode } from 'react'

const s = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.35,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

interface MarkProps {
  children: ReactNode
  dx?: number
  dy?: number
  w?: 'normal' | 'bold'
}

function Mark({ children, dx = 0, dy = 0, w = 'normal' }: MarkProps) {
  return (
    <>
      <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="3.5" {...s} />
      <text
        x={8 + dx} y={11.4 + dy}
        textAnchor="middle"
        fontFamily="Epilogue, system-ui, sans-serif"
        fontSize="7.4"
        fontWeight={w === 'bold' ? 700 : 600}
        letterSpacing="-0.04em"
        fill="currentColor"
      >{children}</text>
    </>
  )
}

const ICONS: Record<string, ReactNode> = {
  // ── Foundations ──────────────────────────────────────────
  react: (
    <>
      <circle cx="8" cy="8" r="1.4" fill="currentColor" />
      <ellipse cx="8" cy="8" rx="6.5" ry="2.4" {...s} />
      <ellipse cx="8" cy="8" rx="6.5" ry="2.4" {...s} transform="rotate(60 8 8)" />
      <ellipse cx="8" cy="8" rx="6.5" ry="2.4" {...s} transform="rotate(-60 8 8)" />
    </>
  ),
  ts:   <Mark>TS</Mark>,
  js:   <Mark>JS</Mark>,
  css:  <Mark dy={-0.2}>CSS</Mark>,
  html: (
    <>
      <path d="M4.5 4.5 L2 8 L4.5 11.5" {...s} />
      <path d="M11.5 4.5 L14 8 L11.5 11.5" {...s} />
      <path d="M9.4 3.8 L6.6 12.2" {...s} />
    </>
  ),
  tailwind: (
    <>
      <path d="M2.3 7.2 C 3.6 4.4, 5.3 4.4, 6.7 5.6 C 8 6.8, 9.4 6.8, 10.7 5.6" {...s} />
      <path d="M5.3 10.4 C 6.7 7.6, 8.3 7.6, 9.7 8.8 C 11.1 10.0, 12.4 10.0, 13.7 8.8" {...s} />
    </>
  ),
  vite: (
    <>
      <path d="M8 1.4 L13.7 4.6 L8 14.6 L2.3 4.6 Z" {...s} />
      <path d="M8 4.4 L8 10.6" {...s} />
    </>
  ),
  router: (
    <>
      <path d="M2.4 8 L13.6 8" {...s} />
      <path d="M10 5 L13.6 8 L10 11" {...s} />
      <circle cx="3.8" cy="8" r="1.4" {...s} />
    </>
  ),
  svelte: <Mark>Sv</Mark>,
  astro:  <Mark>As</Mark>,

  // ── Forms & State ─────────────────────────────────────────
  zod: <Mark>Z</Mark>,
  rhf: (
    <>
      <rect x="2.5" y="3.5" width="11" height="2.2" rx="1.1" {...s} />
      <rect x="2.5" y="6.9" width="11" height="2.2" rx="1.1" {...s} />
      <rect x="2.5" y="10.3" width="6.5" height="2.2" rx="1.1" {...s} />
    </>
  ),
  imask: (
    <>
      <rect x="2" y="5.4" width="12" height="5.2" rx="1" {...s} />
      <path d="M4.5 8 L7 8 M8.5 8 L11 8" {...s} />
      <path d="M12.5 4.6 L12.5 11.4" {...s} strokeWidth="1.6" />
    </>
  ),
  rquery:  <Mark dy={-0.1}>Q</Mark>,
  redux: (
    <>
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
      <path d="M4.5 4.7 C 7.2 3.0, 11.5 3.8, 12.5 6.5" {...s} />
      <path d="M11.7 11.6 C 9.0 13.4, 4.7 12.6, 3.7 9.8" {...s} />
      <path d="M5.6 13.0 C 4.2 12.0, 3.3 10.4, 3.4 8.6" {...s} />
    </>
  ),
  zustand: <Mark>Zu</Mark>,

  // ── Motion & Visual ───────────────────────────────────────
  framer: (
    <>
      <path d="M3.5 2.5 H12.5 V6 H8 L12.5 9.5 H8 V13.5 L3.5 9.5 V6 V2.5 Z" {...s} />
    </>
  ),
  ae:      <Mark dy={-0.05}>Ae</Mark>,
  premiere: <Mark dy={-0.05}>Pr</Mark>,
  figma: (
    <>
      <circle cx="6"  cy="3.6"  r="2.1" {...s} />
      <circle cx="10" cy="3.6"  r="2.1" {...s} />
      <circle cx="6"  cy="7.9"  r="2.1" {...s} />
      <circle cx="10" cy="7.9"  r="2.1" {...s} />
      <circle cx="6"  cy="12.2" r="2.1" {...s} />
    </>
  ),
  ai: <Mark dy={-0.05}>Ai</Mark>,
  ps: <Mark dy={-0.05}>Ps</Mark>,
  id: <Mark dy={-0.05}>Id</Mark>,

  // ── Systems & Hygiene ─────────────────────────────────────
  ds: (
    <>
      <rect x="2"   y="2"   width="5.5" height="5.5" rx="0.8" {...s} />
      <rect x="8.5" y="2"   width="5.5" height="5.5" rx="0.8" {...s} />
      <rect x="2"   y="8.5" width="5.5" height="5.5" rx="0.8" {...s} />
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="0.8" {...s} />
    </>
  ),
  a11y: (
    <>
      <circle cx="8" cy="3.2" r="1.4" {...s} />
      <path d="M3 6.2 H13" {...s} />
      <path d="M6 6.4 L6 9.6 L4.6 13.6" {...s} />
      <path d="M10 6.4 L10 9.6 L11.4 13.6" {...s} />
    </>
  ),
  fsd: (
    <>
      <path d="M2 4.2 L8 1.6 L14 4.2 L8 6.8 Z" {...s} />
      <path d="M2 8 L8 5.4 L14 8 L8 10.6 Z" {...s} />
      <path d="M2 11.8 L8 9.2 L14 11.8 L8 14.4 Z" {...s} />
    </>
  ),
  git: (
    <>
      <circle cx="4"  cy="3.6"  r="1.4" {...s} />
      <circle cx="12" cy="3.6"  r="1.4" {...s} />
      <circle cx="4"  cy="12.4" r="1.4" {...s} />
      <path d="M4 5 L4 11" {...s} />
      <path d="M12 5 L12 8.2 C 12 9.6, 10.9 10.8, 9.5 10.8 L 6 10.8" {...s} />
    </>
  ),
  jest: <Mark>J</Mark>,
  rtl: (
    <>
      <path d="M6.5 2 L6.5 6.2 L3.5 12.4 C 3 13.4, 3.7 14.4, 4.8 14.4 L11.2 14.4 C 12.3 14.4, 13 13.4, 12.5 12.4 L9.5 6.2 L9.5 2" {...s} />
      <path d="M5.5 2 L10.5 2" {...s} />
      <path d="M4.7 10.2 L11.3 10.2" {...s} />
    </>
  ),
  cypress: (
    <>
      <circle cx="8" cy="8" r="6.2" {...s} />
      <path d="M5.5 5.5 C 4.5 6.6, 4.5 9.4, 5.5 10.5" {...s} />
      <path d="M10.5 11 L10.5 12.6" {...s} />
    </>
  ),
}

interface SkillIconProps {
  name: string
  size?: number
}

export function SkillIcon({ name, size = 16 }: SkillIconProps) {
  const inner = ICONS[name]
  if (!inner) return null
  return (
    <svg className="skill-icon" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      {inner}
    </svg>
  )
}
