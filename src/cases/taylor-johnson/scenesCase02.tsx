import React from 'react'
import { useTime, clamp, Easing } from '../../components/animation'
import { PDF_PARAMS, PDF_PAGE, PLAN_PAGOS } from './dataCase02'
import type { PdfParam, PlanRow } from './dataCase02'

// ── Color palette ─────────────────────────────────────────────────────────────

const C = {
  bg: '#FAFAF9', surface: '#F2F0EB', border: '#E4E2DC',
  text: '#1C1917', body: '#57534E', muted: '#736D67',
  accent: '#2563EB',
  crtBg: '#0A1408', crtGreen: '#4ADE80', crtGreenDim: '#22C55E',
  crtAmber: '#FCD34D',
} as const

const CRTGlow = (alpha = 0.85) =>
  `0 0 6px rgba(74,222,128,${alpha}), 0 0 14px rgba(74,222,128,${alpha * 0.5}), 0 0 28px rgba(74,222,128,${alpha * 0.2})`
const AmberGlow = `0 0 6px rgba(252,211,77,0.9), 0 0 14px rgba(252,211,77,0.5), 0 0 28px rgba(252,211,77,0.2)`
const fmtMoney = (n: number) => '$' + n.toLocaleString('es-CO')

// ── Modal timing constants ────────────────────────────────────────────────────

const MODAL_RENDER_START = 0.9
const MODAL_RENDER_END   = 9.6

// ── Scanlines ─────────────────────────────────────────────────────────────────

function Scanlines({ intensity = 0.4 }: { intensity?: number }) {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,${0.2 * intensity * 2}) 3px, transparent 4px)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
      }} />
    </>
  )
}

// ── Phase label pill ──────────────────────────────────────────────────────────

function PhaseLabel({ title, subtitle, op }: { title: string; subtitle?: string; op: number }) {
  if (op < 0.005) return null
  return (
    <div style={{
      position: 'absolute', top: 16, left: '50%', opacity: op,
      transform: `translate(-50%, ${(1 - op) * -8}px)`, zIndex: 70,
      fontFamily: '"Epilogue", system-ui, sans-serif',
      padding: '8px 16px',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(10px)',
      borderRadius: 999,
      border: `1px solid ${C.border}`,
      boxShadow: '0 6px 20px -8px rgba(0,0,0,0.18)',
      display: 'inline-flex', alignItems: 'center', gap: 12,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em', color: C.text }}>
        {title}
      </span>
      {subtitle && (
        <>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(15,23,42,0.25)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: C.muted, fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.04em' }}>
            {subtitle}
          </span>
        </>
      )}
    </div>
  )
}

// ── Dynamic crossfading phase labels ─────────────────────────────────────────

function DynamicLabel({ globalT }: { globalT: number }) {
  const t = globalT + 0.4
  const FADE = 0.5
  const phases = [
    { start: 0,    end: 3.3,  title: 'Lo que ve el usuario',            subtitle: 'banca.presto.com / creditos / 0140-2384' },
    { start: 3.3,  end: 16.1, title: 'En segundo plano se arma el PDF', subtitle: 'AS400PDFRenderer · jsPDF' },
    { start: 16.1, end: 99,   title: 'Se descarga el PDF',              subtitle: 'plan-pagos.pdf · 148 KB' },
  ]
  return (
    <>
      {phases.map((p, i) => {
        const fadeIn  = clamp((t - p.start) / FADE, 0, 1)
        const fadeOut = 1 - clamp((t - (p.end - FADE)) / FADE, 0, 1)
        const op = Easing.easeInOutCubic(fadeIn) * Easing.easeInOutCubic(fadeOut)
        if (op < 0.005) return null
        return <PhaseLabel key={i} title={p.title} subtitle={p.subtitle} op={op} />
      })}
    </>
  )
}

// ── Modern Plan de Pagos UI ───────────────────────────────────────────────────

interface ModernUIProps {
  localTime: number
  buttonState?: 'idle' | 'press'
  shineT?: number
}

function ModernUI({ localTime, buttonState = 'idle', shineT = 0 }: ModernUIProps) {
  const p = PLAN_PAGOS
  const rows = p.rows.slice(0, 12)
  const E = Easing.easeOutCubic

  const tHead  = clamp(localTime / 0.5, 0, 1)
  const tCards = clamp((localTime - 0.3) / 0.5, 0, 1)
  const tTable = clamp((localTime - 0.7) / 0.6, 0, 1)
  const tBtn   = clamp((localTime - 0.45) / 0.4, 0, 1)

  const btnBg = buttonState === 'press' ? '#1D4ED8' : shineT > 0.05 ? '#1E40AF' : C.accent
  const pulse  = 0.5 + 0.5 * Math.sin(localTime * Math.PI * 2.4)
  const rippleSpeed = 0.8
  const ripples = [0, 0.5].map((phase) => {
    const c = (localTime * rippleSpeed + phase) % 1.0
    return { scale: 1 + c * 0.9, opacity: shineT * (1 - c) * 0.6 }
  })

  const btnShadow = buttonState === 'press'
    ? '0 1px 2px rgba(37,99,235,0.4)'
    : shineT > 0.05
    ? `0 0 ${36 + pulse * 32}px ${6 + pulse * 8}px rgba(59,130,246,${(0.7 * shineT).toFixed(2)}), 0 0 0 ${3 + pulse * 2}px rgba(147,197,253,${(0.6 * shineT).toFixed(2)}), 0 6px 18px -6px rgba(37,99,235,0.5)`
    : '0 6px 18px -6px rgba(37,99,235,0.5)'

  const cards = [
    { label: 'Monto del crédito', value: fmtMoney(p.monto),     mono: true,  accent: false },
    { label: 'Cuota fija',        value: fmtMoney(p.cuotaFija), mono: true,  accent: true  },
    { label: 'Tasa',              value: p.tasa,                mono: false, accent: false },
    { label: 'Plazo',             value: p.plazo,               mono: false, accent: false },
  ]

  return (
    <div style={{
      position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden',
      fontFamily: '"Epilogue", system-ui, sans-serif', color: C.text, fontWeight: 500,
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 100, left: 80, right: 80,
        opacity: tHead, transform: `translateY(${(1 - tHead) * 12}px)`,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
            Crédito · {p.credito}
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, marginTop: 8, letterSpacing: '-0.025em', color: C.text }}>
            Plan de pagos
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>
            {p.cliente.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')} · {p.plazo}
          </div>
        </div>

        {/* Download button */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
          opacity: tBtn, transform: `translateY(${(1 - E(tBtn)) * 14}px)`,
          position: 'relative',
        }}>
          {shineT > 0.05 && (
            <div style={{
              position: 'absolute', top: -56, right: 24,
              transform: `translateY(${Math.sin(localTime * Math.PI * 2.4) * 6}px)`,
              opacity: shineT, pointerEvents: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <div style={{
                background: '#1D4ED8', color: '#fff', padding: '4px 10px', borderRadius: 6,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                fontFamily: '"IBM Plex Mono", monospace', boxShadow: '0 4px 12px rgba(29,78,216,0.4)',
                whiteSpace: 'nowrap',
              }}>Generar PDF</div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1D4ED8" style={{ marginTop: -2 }}>
                <path d="M12 21 L3 9 L21 9 Z" />
              </svg>
            </div>
          )}
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: btnBg, color: '#fff', border: 'none', cursor: 'pointer',
            padding: '14px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            letterSpacing: '0.01em', fontFamily: 'inherit', position: 'relative',
            transform: buttonState === 'press' ? 'scale(0.96)' : 'scale(1)',
            transition: 'background 140ms, transform 100ms',
            boxShadow: btnShadow,
          }}>
            {shineT > 0.05 && ripples.map((r, i) => (
              <span key={i} style={{
                position: 'absolute', inset: 0, borderRadius: 10,
                border: '2px solid rgba(96,165,250,1)',
                opacity: r.opacity, transform: `scale(${r.scale})`,
                pointerEvents: 'none',
              }} />
            ))}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Descargar PDF
          </button>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: '"IBM Plex Mono", monospace' }}>PDF · 1 pág · A4</div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{
        position: 'absolute', top: 220, left: 80, right: 80,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
        opacity: tCards, transform: `translateY(${(1 - E(tCards)) * 14}px)`,
      }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            background: card.accent ? C.accent : '#fff',
            color: card.accent ? '#fff' : C.text,
            borderRadius: 12, padding: '18px 20px',
            border: card.accent ? 'none' : `1px solid ${C.border}`,
            boxShadow: card.accent ? '0 10px 28px -12px rgba(37,99,235,0.45)' : '0 1px 0 rgba(28,25,23,0.02)',
          }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: card.accent ? 'rgba(255,255,255,0.78)' : C.muted }}>
              {card.label}
            </div>
            <div style={{
              fontSize: 24, fontWeight: 700, marginTop: 8, letterSpacing: '-0.02em',
              fontFamily: card.mono ? '"IBM Plex Mono", monospace' : 'inherit',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Installment table */}
      <div style={{
        position: 'absolute', top: 350, left: 80, right: 80, bottom: 60,
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
        overflow: 'hidden',
        opacity: tTable, transform: `translateY(${(1 - E(tTable)) * 18}px)`,
        boxShadow: '0 1px 0 rgba(28,25,23,0.02)',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 140px 1fr 1fr 1fr 1.1fr',
          padding: '14px 24px', fontSize: 11, color: C.muted,
          textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700,
          background: C.surface, borderBottom: `1px solid ${C.border}`,
        }}>
          <div>Cuota</div><div>Fecha</div>
          <div style={{ textAlign: 'right' }}>Capital</div>
          <div style={{ textAlign: 'right' }}>Interés</div>
          <div style={{ textAlign: 'right' }}>Valor cuota</div>
          <div style={{ textAlign: 'right' }}>Saldo</div>
        </div>
        <div style={{ maxHeight: 'calc(100% - 47px)', overflow: 'hidden' }}>
          {rows.map((r, ri) => {
            const rT = clamp((localTime - 0.9 - ri * 0.04) / 0.4, 0, 1)
            return (
              <div key={r.n} style={{
                display: 'grid', gridTemplateColumns: '60px 140px 1fr 1fr 1fr 1.1fr',
                padding: '14px 24px', fontSize: 14, color: C.text,
                borderBottom: ri < rows.length - 1 ? `1px solid ${C.border}` : 'none',
                fontFamily: '"IBM Plex Mono", monospace', fontVariantNumeric: 'tabular-nums',
                alignItems: 'center',
                opacity: rT, transform: `translateY(${(1 - E(rT)) * 6}px)`,
              }}>
                <div style={{ fontWeight: 600 }}>{String(r.n).padStart(2, '0')}</div>
                <div style={{ color: C.body }}>{r.fecha}</div>
                <div style={{ textAlign: 'right' }}>{fmtMoney(r.capital)}</div>
                <div style={{ textAlign: 'right', color: C.muted }}>{fmtMoney(r.interes)}</div>
                <div style={{ textAlign: 'right', fontWeight: 600 }}>{fmtMoney(r.cuota)}</div>
                <div style={{ textAlign: 'right', color: C.body }}>{fmtMoney(r.saldo)}</div>
              </div>
            )
          })}
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), #fff)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}

// ── PDF preview: element-by-element build ─────────────────────────────────────

interface PdfTableRowsProps { scale: number; animT?: number }

function PdfTableRows({ scale, animT = 1 }: PdfTableRowsProps) {
  const rows = PLAN_PAGOS.rows.slice(0, 12)
  interface ColDef { x: number; align: 'L' | 'R'; key: keyof PlanRow; bold: boolean; money?: boolean }
  const cols: ColDef[] = [
    { x: 19,  align: 'L', key: 'n',       bold: false },
    { x: 32,  align: 'L', key: 'fecha',   bold: false },
    { x: 85,  align: 'R', key: 'dias',    bold: false },
    { x: 135, align: 'R', key: 'capital', bold: false, money: true },
    { x: 180, align: 'R', key: 'interes', bold: false, money: true },
    { x: 222, align: 'R', key: 'cuota',   bold: true,  money: true },
    { x: 278, align: 'R', key: 'saldo',   bold: false, money: true },
  ]
  return (
    <>
      {rows.map((r, i) => {
        const yMM  = 105 + i * 7
        const rowT = clamp(animT * 1.6 - i * 0.04, 0, 1)
        if (rowT <= 0) return null
        const zebra = i % 2 === 1
        return (
          <React.Fragment key={i}>
            {zebra && (
              <div style={{
                position: 'absolute', left: 15 * scale, top: (yMM - 5) * scale,
                width: 267 * scale, height: 7 * scale,
                background: '#F8FAFC', opacity: rowT,
              }} />
            )}
            {cols.map((c, j) => {
              const raw = r[c.key]
              let val: string
              if (c.key === 'n') val = String(raw).padStart(2, '0')
              else if (c.money) val = fmtMoney(raw as number).replace('$', '').trim()
              else val = String(raw)
              return (
                <div key={j} style={{
                  position: 'absolute',
                  left: c.x * scale, top: (yMM - 3.5) * scale,
                  fontSize: 5 * scale, color: '#1C1917',
                  fontWeight: c.bold ? 700 : 400,
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  whiteSpace: 'nowrap',
                  transform: c.align === 'R' ? 'translateX(-100%)' : 'none',
                  opacity: rowT,
                }}>{val}</div>
              )
            })}
          </React.Fragment>
        )
      })}
    </>
  )
}

interface PdfPreviewProps {
  localTime: number
  renderIdx: number
  inRender: boolean
  opacity: number
}

function PdfPreview({ localTime, renderIdx, inRender, opacity }: PdfPreviewProps) {
  const params = PDF_PARAMS
  const PAGE   = PDF_PAGE
  const x = 630, y = 490
  const w = 1230
  const h = w * PAGE.h / PAGE.w
  const scale = w / PAGE.w

  const drawCount = inRender
    ? renderIdx + 1
    : localTime >= MODAL_RENDER_END ? params.length
    : (localTime > 0.5 ? Math.min(2, params.length) : 0)

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      background: '#fff', borderRadius: 6,
      boxShadow: '0 30px 80px -10px rgba(0,0,0,0.55), 0 0 0 1px #E2E8F0',
      opacity, overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -22, left: 0,
        fontSize: 11, color: '#CBD5E1',
        fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.06em',
      }}>plan-pagos.pdf · A4 landscape · 1/1</div>

      {params.slice(0, drawCount).map((pp: PdfParam, i: number) => {
        const color = `rgb(${pp.r}, ${pp.g}, ${pp.b})`
        const justDrawn = inRender && i === renderIdx
        if (pp.type === 'TEXT') {
          return (
            <div key={i} style={{
              position: 'absolute',
              left: pp.x * scale,
              top: (pp.y - pp.size * 0.32) * scale,
              fontSize: pp.size * scale * 0.42,
              color, fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: pp.size >= 16 ? 700 : pp.size >= 11 ? 600 : 500,
              whiteSpace: 'nowrap',
              transform: pp.align === 'R' ? 'translateX(-100%)' : 'none',
              textShadow: justDrawn ? '0 0 8px rgba(252,211,77,0.9)' : 'none',
            }}>
              {pp.text === '-' ? '' : pp.text}
              {justDrawn && (
                <span style={{
                  position: 'absolute', right: -6, top: 2, bottom: 2,
                  width: 2, background: '#2563EB',
                  animation: 'pdfCaret 0.5s steps(2) infinite',
                }} />
              )}
            </div>
          )
        }
        if (pp.type === 'RECT') {
          const rectW = ((pp.w ?? (PAGE.w - 2 * pp.x))) * scale
          return (
            <div key={i} style={{
              position: 'absolute',
              left: pp.x * scale, top: pp.y * scale,
              width: rectW, height: pp.size * scale,
              background: color,
              boxShadow: justDrawn ? '0 0 12px rgba(252,211,77,0.7)' : 'none',
            }} />
          )
        }
        if (pp.type === 'LINE') {
          const lineW = (pp.w ?? pp.size) * scale
          return (
            <div key={i} style={{
              position: 'absolute',
              left: pp.x * scale, top: pp.y * scale,
              width: lineW, height: Math.max(1, 0.4 * scale),
              background: color,
              boxShadow: justDrawn ? '0 0 8px rgba(252,211,77,0.6)' : 'none',
            }} />
          )
        }
        return null
      })}

      {drawCount >= params.length && (
        <PdfTableRows
          scale={scale}
          animT={clamp((localTime - MODAL_RENDER_END + 0.4) / 0.8, 0, 1)}
        />
      )}
    </div>
  )
}

// ── Modal overlay (AS/400 read + code panel + PDF preview) ────────────────────

function MomentoThreeContent({ localTime }: { localTime: number }) {
  const params = PDF_PARAMS

  const tIn = clamp(localTime / 0.6, 0, 1)
  const renderDur  = MODAL_RENDER_END - MODAL_RENDER_START
  const perParam   = renderDur / params.length
  const renderIdx  = Math.floor(clamp((localTime - MODAL_RENDER_START) / perParam, 0, params.length - 0.0001))
  const inRender   = localTime >= MODAL_RENDER_START && localTime <= MODAL_RENDER_END
  const tFinal = clamp((localTime - MODAL_RENDER_END) / 0.7, 0, 1)

  // Progress bar width synced to actual drawn params count
  const drawn = inRender ? Math.min(renderIdx + 1, params.length) : (localTime >= MODAL_RENDER_END ? params.length : 0)
  const barPct = (drawn / params.length) * 100

  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: tIn, transform: `scale(${0.96 + 0.04 * tIn})`, transformOrigin: 'center',
      fontFamily: '"Epilogue", system-ui, sans-serif', pointerEvents: 'none',
    }}>
      {/* Modal header strip */}
      <div style={{
        position: 'absolute', top: 36, left: 60, right: 60,
        display: 'flex', alignItems: 'center', gap: 16,
        color: '#F8FAFC', fontFamily: '"IBM Plex Mono", monospace',
      }}>
        <div style={{
          padding: '4px 10px', borderRadius: 4,
          background: 'rgba(252,211,77,0.16)', color: C.crtAmber,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        }}>EN PROCESO</div>
        <div style={{ fontSize: 14, color: '#94A3B8', letterSpacing: '0.04em' }}>
          generando plan-pagos.pdf — consultando AS/400…
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: '#64748B' }}>
          {Math.min(renderIdx + 1, params.length)} / {params.length} parámetros
        </div>
      </div>

      {/* ── Terminal panel (left) ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: 60, top: 100, width: 540, height: 900,
        background: C.crtBg, borderRadius: 16,
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px #1a2818',
        overflow: 'hidden',
        transform: `translateX(${(1 - tIn) * -40}px)`,
      }}>
        <Scanlines intensity={0.4} />
        <div style={{
          padding: '20px 28px 12px', color: C.crtAmber, textShadow: AmberGlow,
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, letterSpacing: '0.06em',
          display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap',
        }}>
          <div>PDFP001 · LECTURA</div>
          <div>AS/400</div>
        </div>
        <div style={{ borderBottom: `1px solid ${C.crtGreen}`, boxShadow: CRTGlow(0.4), margin: '0 28px 10px' }} />
        <div style={{ padding: '0 18px', fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, color: C.crtGreen, textShadow: CRTGlow(0.7), lineHeight: 1.5 }}>
          {params.map((pp, i) => {
            const isFocus = inRender && renderIdx === i
            const isDone  = (localTime - MODAL_RENDER_START) / perParam > i + 1
            return (
              <div key={i} style={{
                display: 'flex', gap: 5, alignItems: 'center', padding: '1px 5px',
                background: isFocus ? 'rgba(252,211,77,0.20)' : 'transparent',
                borderLeft: isFocus ? `3px solid ${C.crtAmber}` : '3px solid transparent',
                color: isFocus ? '#fff' : (isDone ? C.crtGreenDim : C.crtGreen),
                textShadow: isFocus ? '0 0 10px rgba(255,255,255,1), 0 0 22px rgba(252,211,77,0.9)' : CRTGlow(isDone ? 0.5 : 0.8),
                fontWeight: isFocus ? 600 : 400,
              }}>
                <span style={{ width: 20, color: C.crtAmber, opacity: 0.6 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ width: 38 }}>{pp.type}</span>
                <span style={{ width: 26, textAlign: 'right' }}>{pp.x}</span>
                <span style={{ width: 26, textAlign: 'right' }}>{pp.y}</span>
                <span style={{ width: 18 }}>{pp.align}</span>
                <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>"{pp.text}"</span>
                <span style={{ width: 20, textAlign: 'right' }}>{pp.size}</span>
                <span style={{ width: 26, textAlign: 'right', color: '#fca5a5' }}>{pp.r}</span>
                <span style={{ width: 26, textAlign: 'right', color: '#86efac' }}>{pp.g}</span>
                <span style={{ width: 26, textAlign: 'right', color: '#93c5fd' }}>{pp.b}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Code panel (top-right) ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: 630, top: 100, width: 560, height: 360,
        background: '#0F1729', borderRadius: 14, border: '1px solid #1E293B',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)', overflow: 'hidden',
        fontFamily: '"IBM Plex Mono", monospace',
        transform: `translateY(${(1 - tIn) * 24}px)`,
      }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: 8, color: '#94A3B8', fontSize: 12, letterSpacing: '0.04em' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: '#EF4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: '#F59E0B' }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: '#10B981' }} />
          </div>
          <span style={{ marginLeft: 8 }}>AS400PDFRenderer.js</span>
        </div>
        <div style={{ padding: '14px 20px', fontSize: 12.5, lineHeight: 1.65, color: '#E2E8F0' }}>
          <div><span style={{ color: '#C084FC' }}>class</span> <span style={{ color: '#FDE047' }}>AS400PDFRenderer</span> {'{'}</div>
          <div style={{ paddingLeft: 18 }}><span style={{ color: '#7DD3FC' }}>render</span>(<span style={{ color: '#FCA5A5' }}>params</span>) {'{'}</div>
          <div style={{ paddingLeft: 36 }}>
            <span style={{ color: '#C084FC' }}>const</span>{' pdf = '}
            <span style={{ color: '#C084FC' }}>new</span>{' '}
            <span style={{ color: '#FDE047' }}>jsPDF</span>
            {'({ orientation: '}
            <span style={{ color: '#86EFAC' }}>"landscape"</span>
            {', format: '}
            <span style={{ color: '#86EFAC' }}>"a4"</span>
            {' });'}
          </div>
          <div style={{ paddingLeft: 36 }}>
            <span style={{ color: '#C084FC' }}>for</span>
            {' ('}
            <span style={{ color: '#C084FC' }}>const</span>
            {' p '}
            <span style={{ color: '#C084FC' }}>of</span>
            {' params) {'}
          </div>
          {(() => {
            const cur = inRender ? params[renderIdx] : null
            return (
              <React.Fragment>
                <div style={{ paddingLeft: 54 }}>
                  {'pdf.setFontSize('}
                  <span style={{ color: '#FDE047' }}>{cur ? cur.size : '…'}</span>
                  {');'}
                </div>
                <div style={{ paddingLeft: 54 }}>
                  {'pdf.setTextColor('}
                  <span style={{ color: '#FCA5A5' }}>{cur ? cur.r : '…'}</span>
                  {','}
                  <span style={{ color: '#86EFAC' }}> {cur ? cur.g : '…'}</span>
                  {','}
                  <span style={{ color: '#93C5FD' }}> {cur ? cur.b : '…'}</span>
                  {');'}
                </div>
                <div style={{ paddingLeft: 54 }}>
                  {'pdf.'}
                  <span style={{ color: '#7DD3FC' }}>
                    {cur ? (cur.type === 'TEXT' ? 'text' : cur.type === 'RECT' ? 'rect' : 'line') : 'text'}
                  </span>
                  {'('}
                  <span style={{ color: '#FDE047' }}>{cur ? cur.x : '…'}</span>
                  {', '}
                  <span style={{ color: '#FDE047' }}>{cur ? cur.y : '…'}</span>
                  {cur?.type === 'TEXT' ? (
                    <React.Fragment>
                      {', '}
                      <span style={{ color: '#86EFAC' }}>
                        "{cur.text.length > 24 ? cur.text.slice(0, 24) + '…' : cur.text}"
                      </span>
                    </React.Fragment>
                  ) : null}
                  {');'}
                </div>
              </React.Fragment>
            )
          })()}
          <div style={{ paddingLeft: 36 }}>{'}'}</div>
          <div style={{ paddingLeft: 36 }}>
            {'pdf.'}
            <span style={{ color: '#7DD3FC' }}>autoTable</span>
            {'({ body: scheduleRows });'}
          </div>
          <div style={{ paddingLeft: 36 }}>
            <span style={{ color: '#C084FC' }}>return</span>
            {' pdf.'}
            <span style={{ color: '#7DD3FC' }}>save</span>
            {'('}
            <span style={{ color: '#86EFAC' }}>"plan-pagos.pdf"</span>
            {');'}
          </div>
          <div style={{ paddingLeft: 18 }}>{'}'}</div>
          <div>{'}'}</div>
        </div>
      </div>

      {/* ── Progress / metadata strip (top-right, beside code) ──────── */}
      <div style={{
        position: 'absolute', left: 1220, top: 100, width: 640, height: 360,
        background: 'rgba(15,23,41,0.7)', borderRadius: 14,
        border: '1px solid #1E293B', padding: '22px 26px',
        color: '#E2E8F0', fontFamily: '"IBM Plex Mono", monospace',
        transform: `translateY(${(1 - tIn) * 30}px)`,
      }}>
        <div style={{ fontSize: 11, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
          Progreso · jsPDF
        </div>
        <div style={{ marginTop: 16, height: 8, background: '#1E293B', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${barPct}%`,
            background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
            transition: `width ${Math.round(perParam * 1000 * 1.6)}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }} />
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: '#CBD5E1', display: 'flex', justifyContent: 'space-between' }}>
          <span>
            {inRender
              ? `Renderizando parámetro ${renderIdx + 1} de ${params.length}`
              : tFinal > 0
              ? 'PDF compilado · firma digital aplicada'
              : 'Inicializando jsPDF landscape…'}
          </span>
          <span>{Math.floor(barPct)}%</span>
        </div>

        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
          {([
            ['Documento',   'plan-pagos.pdf'],
            ['Formato',     'A4 · Landscape'],
            ['Páginas',     '1'],
            ['Tamaño',      inRender ? `${Math.floor((renderIdx + 1) * 0.6)} KB` : '26 KB'],
            ['Firmado por', 'Banco Presto S.A.'],
            ['Hash SHA-256', inRender ? '...calculando' : 'a8f3e9...c712d4'],
          ] as [string, string][]).map(([k, v], i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</div>
              <div style={{ fontSize: 13, color: '#F8FAFC', marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PDF preview (bottom-right, A4 landscape) ─────────────────── */}
      <PdfPreview
        localTime={localTime}
        renderIdx={renderIdx}
        inRender={inRender}
        opacity={tIn}
      />
    </div>
  )
}

// ── Browser-style download bar ────────────────────────────────────────────────

function DownloadBar({ inT, fillT, done }: { inT: number; fillT: number; done: boolean }) {
  const E = Easing.easeOutCubic
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: 64,
      background: '#1F2937', borderTop: '1px solid #111827',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12,
      opacity: inT, transform: `translateY(${(1 - E(inT)) * 60}px)`,
      fontFamily: '"Epilogue", system-ui, sans-serif', color: '#F8FAFC',
      boxShadow: '0 -10px 30px -10px rgba(0,0,0,0.4)', zIndex: 60,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8, background: '#DC2626',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: 11, letterSpacing: '0.04em',
        fontFamily: '"IBM Plex Mono", monospace',
        boxShadow: '0 4px 12px -4px rgba(220,38,38,0.5)',
        flexShrink: 0,
      }}>PDF</div>

      <div style={{ flex: '0 0 380px', minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          plan-pagos.pdf
          <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 500 }}>
            {done ? '· 26 KB' : `· ${Math.floor(fillT * 26)} / 26 KB`}
          </span>
        </div>
        <div style={{ marginTop: 6, height: 4, background: '#374151', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${fillT * 100}%`,
            background: done ? '#16A34A' : 'linear-gradient(90deg, #2563EB, #60A5FA)',
            transition: 'background 200ms',
          }} />
        </div>
        <div style={{ marginTop: 4, fontSize: 11, color: done ? '#86EFAC' : '#94A3B8', fontFamily: '"IBM Plex Mono", monospace' }}>
          {done ? 'Descarga completa · firmado por Banco Presto' : 'Descargando desde AS/400…'}
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <button style={{
        background: done ? '#2563EB' : 'transparent', color: '#fff',
        border: done ? 'none' : '1px solid #374151',
        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
        fontFamily: 'inherit', cursor: 'pointer',
        opacity: done ? 1 : 0.5, transition: 'background 200ms, opacity 200ms',
      }}>Abrir</button>
      <button style={{
        background: 'transparent', color: '#94A3B8', border: '1px solid #374151',
        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
        fontFamily: 'inherit', cursor: 'pointer',
      }}>Mostrar en carpeta</button>
      <button style={{
        background: 'transparent', color: '#94A3B8', border: 'none',
        fontSize: 18, cursor: 'pointer', padding: '4px 10px',
      }}>×</button>
    </div>
  )
}

// ── SchemaAS400 — static AS/400 operator parameter screen ────────────────────
// Canvas 960×540 — scale ≈ 0.80 at the 764px case section container
// Removes bgR/bgG/bgB columns; keeps the 10 structurally essential columns.

interface SchemaRow {
  type: string; x: number; y: number; align: string; text: string
  size: number; r: number; g: number; b: number
}

const SCHEMA_ROWS: SchemaRow[] = [
  { type:'RECT', x:0,   y:0,   align:'-', text:'[BANDA SUPERIOR ANCHO 297mm]',   size:34, r:37,  g:99,  b:235 },
  { type:'TEXT', x:15,  y:14,  align:'L', text:'BANCO PRESTO S.A.',               size:8,  r:191, g:219, b:254 },
  { type:'TEXT', x:15,  y:24,  align:'L', text:'PLAN DE PAGOS',                   size:18, r:255, g:255, b:255 },
  { type:'TEXT', x:282, y:12,  align:'R', text:'REF: PDFP001-2026-082347',        size:7,  r:191, g:219, b:254 },
  { type:'TEXT', x:282, y:26,  align:'R', text:'Credito de Consumo - Libre Inv.', size:9,  r:255, g:255, b:255 },
  { type:'TEXT', x:15,  y:46,  align:'L', text:'INFORMACION DEL DEUDOR',          size:7,  r:100, g:116, b:139 },
  { type:'LINE', x:15,  y:48,  align:'-', text:'[LINEA DIVISORIA 130mm]',         size:130,r:226, g:232, b:240 },
  { type:'TEXT', x:15,  y:56,  align:'L', text:'Cliente',                         size:7,  r:115, g:109, b:103 },
  { type:'TEXT', x:15,  y:63,  align:'L', text:'&CLIENTE_NOMBRE',                 size:11, r:28,  g:25,  b:23  },
  { type:'TEXT', x:80,  y:56,  align:'L', text:'Identificacion',                  size:7,  r:115, g:109, b:103 },
  { type:'TEXT', x:80,  y:63,  align:'L', text:'&CLIENTE_DOC',                    size:11, r:28,  g:25,  b:23  },
  { type:'TEXT', x:15,  y:72,  align:'L', text:'Producto',                        size:7,  r:115, g:109, b:103 },
  { type:'TEXT', x:15,  y:79,  align:'L', text:'&PRODUCTO_DESC',                  size:11, r:28,  g:25,  b:23  },
  { type:'TEXT', x:80,  y:72,  align:'L', text:'No. de obligacion',               size:7,  r:115, g:109, b:103 },
  { type:'TEXT', x:80,  y:79,  align:'L', text:'&OBLIGACION_NUM',                 size:11, r:28,  g:25,  b:23  },
  { type:'RECT', x:15,  y:92,  align:'-', text:'[BANDA TABLA ANCHO 267mm]',       size:8,  r:37,  g:99,  b:235 },
]

const SCHEMA_FOCUS = 8 // &CLIENTE_NOMBRE — cursor row

export function SchemaAS400() {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  React.useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setScale(el.getBoundingClientRect().width / 960)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [])

  const green = C.crtGreen
  const dim   = '#2D7A45'
  const amber = C.crtAmber
  const glowG = '0 0 5px rgba(74,222,128,0.6),0 0 12px rgba(74,222,128,0.22)'
  const glowA = '0 0 5px rgba(252,211,77,0.9),0 0 14px rgba(252,211,77,0.4)'

  return (
    <div ref={wrapRef} style={{ position:'relative', width:'100%', paddingBottom:'56.25%', background:'#000', overflow:'hidden' }}>
      <style>{`
        @keyframes schema-flicker{0%,100%{opacity:.5}50%{opacity:1}72%{opacity:.7}}
        @keyframes schema-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}
      `}</style>

      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{
          width:960, height:540, background:C.crtBg, position:'relative', overflow:'hidden',
          flexShrink:0,
          transformOrigin:'center', transform:`scale(${scale})`,
          fontFamily:'"IBM Plex Mono","Courier New",monospace', color:green,
        }}>
          {/* CRT scanlines */}
          <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:2,backgroundImage:'repeating-linear-gradient(to bottom,rgba(74,222,128,.04) 0px,rgba(74,222,128,.04) 1px,transparent 1px,transparent 3px)' }} />
          {/* Flicker */}
          <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:2,background:'rgba(74,222,128,0.012)',animation:'schema-flicker 4s infinite' }} />
          {/* Vignette */}
          <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:3,background:'radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%)' }} />

          {/* Top bar */}
          <div style={{ position:'absolute',top:26,left:50,right:50,display:'flex',justifyContent:'space-between',fontSize:20,letterSpacing:'0.04em',color:amber,textShadow:glowA }}>
            <div>PDFP001&nbsp;&nbsp;PARAMETROS DE IMPRESION</div>
            <div>OBJ: PLANPAG&nbsp;&nbsp;PAG 01/02</div>
          </div>
          <div style={{ position:'absolute',top:50,left:50,right:50,borderBottom:`1px solid ${green}`,boxShadow:'0 0 5px rgba(74,222,128,.5)' }} />

          {/* Object meta */}
          <div style={{ position:'absolute',top:62,left:50,right:50,display:'flex',gap:28,fontSize:14,letterSpacing:'0.04em',textShadow:glowG }}>
            <div>OBJETO . : PLANPAG</div>
            <div>BIBLIOT . : PRTOBJ</div>
            <div>USUARIO . : OPER01</div>
            <div>FECHA . : 22/05/2026</div>
          </div>

          {/* Column headers */}
          <div style={{ position:'absolute',top:88,left:50,right:50,display:'flex',color:amber,textShadow:glowA,fontSize:16,fontWeight:600,letterSpacing:'0.04em' }}>
            <div style={{ width:42,paddingRight:8 }}>SEQ</div>
            <div style={{ width:58,paddingRight:8 }}>TYPE</div>
            <div style={{ width:40,paddingRight:8,textAlign:'right' }}>X</div>
            <div style={{ width:40,paddingRight:8,textAlign:'right' }}>Y</div>
            <div style={{ width:50,paddingRight:8 }}>ALIGN</div>
            <div style={{ flex:1,paddingRight:8 }}>TEXT</div>
            <div style={{ width:48,paddingRight:8,textAlign:'right' }}>SIZE</div>
            <div style={{ width:36,paddingRight:8,textAlign:'right' }}>R</div>
            <div style={{ width:36,paddingRight:8,textAlign:'right' }}>G</div>
            <div style={{ width:36,paddingRight:8,textAlign:'right' }}>B</div>
          </div>
          <div style={{ position:'absolute',top:108,left:50,right:50,borderBottom:'1px dashed rgba(74,222,128,.4)' }} />

          {/* Data rows */}
          {SCHEMA_ROWS.map((row, i) => {
            const focus = i === SCHEMA_FOCUS
            return (
              <div key={i} style={{ position:'absolute',top:120+i*20,left:50,right:50,display:'flex',fontSize:15,letterSpacing:'0.04em',lineHeight:1,textShadow:glowG }}>
                <div style={{ width:42,paddingRight:8,color:dim }}>{String(i+1).padStart(3,'0')}</div>
                <div style={{ width:58,paddingRight:8 }}>{row.type}</div>
                <div style={{ width:40,paddingRight:8,textAlign:'right' }}>{row.x}</div>
                <div style={{ width:40,paddingRight:8,textAlign:'right' }}>{row.y}</div>
                <div style={{ width:50,paddingRight:8 }}>{row.align}</div>
                <div style={{ flex:1,paddingRight:8,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:focus?amber:undefined,textShadow:focus?glowA:undefined }}>
                  {row.text}
                  {focus && <span style={{ display:'inline-block',width:11,height:16,background:amber,boxShadow:'0 0 7px rgba(252,211,77,.9)',verticalAlign:'middle',marginLeft:3,animation:'schema-blink 1.05s steps(1) infinite' }} />}
                </div>
                <div style={{ width:48,paddingRight:8,textAlign:'right' }}>{row.size}</div>
                <div style={{ width:36,paddingRight:8,textAlign:'right' }}>{row.r}</div>
                <div style={{ width:36,paddingRight:8,textAlign:'right' }}>{row.g}</div>
                <div style={{ width:36,paddingRight:8,textAlign:'right' }}>{row.b}</div>
              </div>
            )
          })}

          {/* Status bar */}
          <div style={{ position:'absolute',bottom:38,left:50,right:50,display:'flex',justifyContent:'space-between',fontSize:13,letterSpacing:'0.06em',color:amber,textShadow:glowA,paddingTop:8,borderTop:`1px solid ${dim}` }}>
            <div>F3=SALIR &nbsp; F5=REFRESCAR &nbsp; F6=A&Ntilde;ADIR &nbsp; F9=COPIAR &nbsp; F12=CANCELAR &nbsp; F23=BORRAR</div>
            <div>MW &nbsp; 22:14:32 &nbsp; SYSTEM/AS400PRESTO</div>
          </div>

          {/* PF keys */}
          <div style={{ position:'absolute',bottom:18,left:50,right:50,display:'flex',gap:20,fontSize:12,letterSpacing:'0.06em',color:dim }}>
            {['F3=SALIR','F5=REFRESCAR','F6=NUEVO','F9=COPIAR','F12=CANCELAR'].map(k => {
              const eq = k.indexOf('=')
              return (
                <span key={k}>
                  <b style={{ color:amber,marginRight:3,fontWeight:600 }}>{k.slice(0,eq)}</b>
                  {k.slice(eq+1)}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main exported scene ───────────────────────────────────────────────────────

export function SceneAS400toPDF() {
  const globalT = useTime()
  const E = Easing.easeOutCubic
  const t = globalT + 0.4  // small offset so ModernUI fades in at the very start

  const tShine    = clamp((t - 1.0) / 1.8, 0, 1)
  const tClick    = clamp((t - 2.8) / 0.25, 0, 1)
  const tModalIn  = clamp((t - 3.1) / 0.6, 0, 1)
  const tModalOut = clamp((t - 14.6) / 0.6, 0, 1)
  const modalT    = E(tModalIn) - E(tModalOut)        // 0 → 1 → 0
  const modalLocalT = clamp(t - 3.1, 0, 11.7)

  const tBarIn       = clamp((t - 15.2) / 0.5, 0, 1)
  const tDownloadFill = clamp((t - 15.6) / 2.2, 0, 1)
  const tBarDone     = t > 17.9

  const buttonState = tClick > 0 && tClick < 1 ? 'press' : 'idle'
  const shineT = tShine * clamp(1 - (tModalIn - 0.1) * 1.5, 0, 1)

  return (
    <>
      <style>{`@keyframes pdfCaret { from { opacity: 1 } to { opacity: 0 } }`}</style>

      {/* Modern bank UI — blurs/scales slightly when modal is open */}
      <div style={{
        position: 'absolute', inset: 0,
        filter: modalT > 0.01 ? `blur(${modalT * 2}px)` : 'none',
        transform: `scale(${1 - modalT * 0.02})`,
        transformOrigin: 'center',
      }}>
        <ModernUI localTime={t} buttonState={buttonState} shineT={shineT} />
      </div>

      {/* Dark scrim behind modal */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(8, 12, 24, 0.78)',
        opacity: modalT, pointerEvents: 'none',
      }} />

      {/* Modal overlay — AS/400 reading params + code + PDF preview */}
      {modalT > 0.001 && (
        <div style={{ position: 'absolute', inset: 0, opacity: modalT, pointerEvents: 'none' }}>
          <MomentoThreeContent localTime={modalLocalT} />
        </div>
      )}

      {/* Browser-style download bar */}
      {tBarIn > 0 && (
        <DownloadBar inT={tBarIn} fillT={tDownloadFill} done={tBarDone} />
      )}

      {/* Phase labels at top of canvas */}
      <DynamicLabel globalT={globalT} />
    </>
  )
}
