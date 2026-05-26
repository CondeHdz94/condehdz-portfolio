import React from 'react'
import { clamp, useSpriteEffect } from '../../../components/animation'

// ── Brand mark ───────────────────────────────────────────────────────────────

export function AcmeMark({ size = 18, color = '#4F46E5' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path d="M4 20 L12 4 L20 20 L15 20 L12 13 L9 20 Z" fill={color} />
      <rect x="10.5" y="16" width="3" height="2" fill={color} opacity="0.5" />
    </svg>
  )
}

// ── Real product data ────────────────────────────────────────────────────────

export interface RealStep { id: string; label: string; short: string }

export const REAL_STEPS: RealStep[] = [
  { id: 'pre-approver',       label: 'Pre-aprobación',      short: 'pre-approver'      },
  { id: 'info-client',        label: 'Info cliente',        short: 'info-client'       },
  { id: 'info-credit',        label: 'Info crédito',        short: 'info-credit'       },
  { id: 'info-contact',       label: 'Info contacto',       short: 'info-contact'      },
  { id: 'insurability',       label: 'Asegurabilidad',      short: 'insurability'      },
  { id: 'data-authorization', label: 'Autorización habeas', short: 'data-authorization'},
  { id: 'documents',          label: 'Documentos',          short: 'documents'         },
  { id: 'decision',           label: 'Decisión',            short: 'decision'          },
]

export const REAL_STEPS_BY_ID: Record<string, RealStep> = Object.fromEntries(
  REAL_STEPS.map((s) => [s.id, s]),
)

// ── Multi-tenant data ────────────────────────────────────────────────────────

export interface Tenant {
  id: string
  name: string
  tagline: string
  primary: string
  accent: string
  ink: string
  monogram: string
  steps: string[]
}

export const TENANT_PRESETS: Record<string, Tenant[]> = {
  'acme-vs-microcredito': [
    {
      id: 'acme-bank',
      name: 'ACME Bank',
      tagline: 'Banca · Crédito Vehicular',
      primary: '#4F46E5',
      accent: '#818CF8',
      ink: '#ECECEA',
      monogram: 'A',
      steps: ['pre-approver', 'info-client', 'info-credit', 'info-contact', 'insurability', 'documents'],
    },
    {
      id: 'solidaridad-microcredito',
      name: 'Solidaridad Microcrédito',
      tagline: 'Microcrédito · Productivo',
      primary: '#15803d',
      accent: '#4ade80',
      ink: '#ECECEA',
      monogram: 'S',
      steps: ['info-client', 'info-credit', 'documents'],
    },
  ],
}

// ── FieldConfig sample (Apéndice A) ──────────────────────────────────────────

export interface InfoCreditField {
  name: string
  label: string
  type: string
  validation?: { required: string }
  url?: string
  dependencies?: string[]
  placeholder?: string
  display?: string
}

export const INFO_CREDIT_FIELDS: InfoCreditField[] = [
  { name: 'channel_partner', label: 'Almacén', type: 'select',       validation: { required: 'Almacén es requerido' }, url: '/business-partners/selector/channel-partners/', placeholder: 'Selecciona', display: 'Distri-motos Medellín' },
  { name: 'vehicle_brand',   label: 'Marca',   type: 'autocomplete', validation: { required: 'Marca es requerido' },   url: '/base/vehicle-brands/',                          display: 'Toyota' },
  { name: 'vehicle_line',    label: 'Línea',   type: 'autocomplete', validation: { required: 'Línea es requerido' },   url: '/base/vehicle-lines/',  dependencies: ['vehicle_brand'], display: 'Corolla XSE' },
  { name: 'model_year',      label: 'Modelo',  type: 'number',       display: '2026' },
  { name: 'license_plate',   label: 'Placa',   type: 'text',         display: 'GVD-481' },
]

// ── Shared atmospheric primitives ────────────────────────────────────────────

export function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Particles draws imperatively via useSpriteEffect — no per-frame React re-renders.
export function Particles({
  count = 24,
  seed = 8412,
  color = '#b0caff',
  glowColor = 'rgba(129,140,248,0.8)',
}: {
  count?: number
  seed?: number
  color?: string
  glowColor?: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const particles = React.useMemo(() => {
    const rng = mulberry32(seed)
    return Array.from({ length: count }, () => ({
      x: rng() * 100,
      baseY: rng() * 100,
      phase: rng() * Math.PI * 2,
      size: 1 + rng() * 2,
      speed: 0.2 + rng() * 0.4,
      opacity: 0.2 + rng() * 0.4,
    }))
  }, [count, seed])

  useSpriteEffect((localTime) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)
    for (const p of particles) {
      const y = ((p.baseY + Math.sin(localTime * p.speed + p.phase) * 4) % 100 + 100) % 100
      const px = (p.x / 100) * w
      const py = (y / 100) * h
      ctx.beginPath()
      ctx.arc(px, py, p.size * 3.5, 0, Math.PI * 2)
      ctx.fillStyle = glowColor
      ctx.globalAlpha = p.opacity * 0.22
      ctx.fill()
      ctx.beginPath()
      ctx.arc(px, py, p.size, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = p.opacity
      ctx.fill()
    }
    ctx.globalAlpha = 1
  })

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

// ── Step icons ───────────────────────────────────────────────────────────────

export function StepIcon({ id, size = 18, color = '#ECECEA' }: { id: string; size?: number; color?: string }) {
  const sw = 1.5
  const s: React.CSSProperties = { width: size, height: size, display: 'block', flexShrink: 0 }
  switch (id) {
    case 'pre-approver':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <path d="M5 12l4 4 10-10" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={sw} opacity="0.45" />
        </svg>
      )
    case 'info-client':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth={sw} />
          <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      )
    case 'info-credit':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <rect x="3" y="7" width="18" height="11" rx="1.5" stroke={color} strokeWidth={sw} />
          <circle cx="12" cy="12.5" r="2.5" stroke={color} strokeWidth={sw} />
        </svg>
      )
    case 'info-contact':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <path d="M5 5h6l1.5 4-2 2a12 12 0 005.5 5.5l2-2 4 1.5V21a13 13 0 01-17-17z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      )
    case 'insurability':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M12 9v6M9 12h6" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      )
    case 'data-authorization':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <rect x="5" y="4" width="14" height="16" rx="1.5" stroke={color} strokeWidth={sw} />
          <path d="M8 10h8M8 13h8M8 16h5" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      )
    case 'documents':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <path d="M6 3h8l4 4v14H6V3z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M14 3v4h4" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      )
    case 'decision':
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <path d="M12 3l9 6-9 12L3 9l9-6z" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M9 11l2 2 4-4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" style={s} fill="none">
          <rect x="5" y="5" width="14" height="14" rx="2" stroke={color} strokeWidth={sw} />
        </svg>
      )
  }
}

// ── Brand pill ───────────────────────────────────────────────────────────────

export function BrandPill({ tenant, size = 22 }: { tenant: Tenant; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size + 4,
          height: size + 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${tenant.primary} 0%, ${tenant.accent} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--f-display)',
          fontStyle: 'italic',
          fontSize: size * 0.7,
          lineHeight: 1,
          boxShadow: `0 0 14px ${tenant.primary}80`,
        }}
      >
        {tenant.monogram}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'var(--f-ui)', fontSize: 13, fontWeight: 600, color: tenant.ink, letterSpacing: '0.02em' }}>
          {tenant.name}
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'rgba(236,236,234,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>
          {tenant.tagline}
        </div>
      </div>
    </div>
  )
}

// helper re-export for shots that need it
export { clamp }
