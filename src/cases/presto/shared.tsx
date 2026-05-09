import React from 'react'
import { useTime, clamp, Easing } from '../../components/animation'

// ── Colors ───────────────────────────────────────────────────────────────────

export const C = {
  accent:        '#2563EB',
  accentLight:   '#3B82F6',
  accentBg:      'rgba(37, 99, 235, 0.08)',
  tg:            '#4ADE80',
  tgDim:         '#22C55E',
  tgFade:        'rgba(74, 222, 128, 0.35)',
  tbg:           '#0A1408',
  tamber:        '#FCD34D',
  neutralBg:     '#FAFAF9',
  surface:       '#F2F0EB',
  neutralText:   '#1C1917',
  neutralBody:   '#57534E',
  neutralMuted:  '#736D67',
  neutralBorder: '#E4E2DC',
  activeGreen:   '#15803D',
} as const

// ── Lerp / easing shortcuts ──────────────────────────────────────────────────

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const ease = Easing.easeOutCubic

// ── CRT scanline overlay ─────────────────────────────────────────────────────

export function CRTLines({ intensity = 0.45 }: { intensity?: number }) {
  return (
    <React.Fragment>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,${0.18 * (intensity * 2)}) 3px, transparent 4px)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
      }} />
    </React.Fragment>
  )
}

// ── Scene chrome ─────────────────────────────────────────────────────────────

interface SceneFrameProps {
  title: string
  caption?: string
  children: React.ReactNode
  bg?: string
}

export function SceneFrame({ title, caption, children, bg = C.neutralBg }: SceneFrameProps) {
  const time = useTime()
  const tIn = clamp(time / 0.6, 0, 1)

  return (
    <div style={{
      position: 'absolute', inset: 0, background: bg,
      fontFamily: '"Epilogue", system-ui, sans-serif',
      color: C.neutralText, fontWeight: 500,
    }}>
      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0, textAlign: 'center',
        opacity: tIn, transform: `translateY(${(1 - tIn) * 8}px)`,
      }}>
        <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.neutralMuted, fontWeight: 600 }}>
          Presto by Fresche
        </div>
        <div style={{ fontSize: 38, fontWeight: 600, marginTop: 8, letterSpacing: '-0.02em', color: C.neutralText }}>
          {title}
        </div>
      </div>

      {children}

      {caption && (
        <div style={{
          position: 'absolute', bottom: 56, left: 0, right: 0, textAlign: 'center',
          fontSize: 13, color: C.neutralMuted, fontFamily: '"IBM Plex Mono", monospace',
          letterSpacing: '0.04em',
          opacity: clamp((time - 1) / 0.6, 0, 1),
        }}>
          {caption}
        </div>
      )}
    </div>
  )
}

// ── Badges ───────────────────────────────────────────────────────────────────

const SEG_MAP: Record<string, [string, string]> = {
  P: ['Premium', '#1C1917'],
  M: ['Masivo',  '#736D67'],
  E: ['Empresa', '#1C1917'],
}

const STAT_MAP: Record<string, [string, string]> = {
  A: ['Activo',    '#15803D'],
  I: ['Inactivo',  '#736D67'],
  B: ['Bloqueado', '#B91C1C'],
}

export function SegBadge({ code, scale = 1 }: { code: string; scale?: number }) {
  const [label, fg] = SEG_MAP[code] ?? SEG_MAP['M']
  return (
    <span style={{
      background: 'transparent', color: fg,
      border: `1px solid ${C.neutralBorder}`,
      padding: `${3 * scale}px ${10 * scale}px`, borderRadius: 999,
      fontSize: 11 * scale, fontWeight: 600, letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  )
}

export function StatBadge({ code, scale = 1 }: { code: string; scale?: number }) {
  const [label, fg] = STAT_MAP[code] ?? STAT_MAP['A']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6 * scale,
      background: 'transparent', color: fg,
      padding: `${3 * scale}px ${4 * scale}px`,
      fontSize: 11 * scale, fontWeight: 600, letterSpacing: '0.02em',
    }}>
      <span style={{ width: 7 * scale, height: 7 * scale, borderRadius: 4 * scale, background: fg }} />
      {label}
    </span>
  )
}
