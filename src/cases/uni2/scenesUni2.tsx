import React from 'react'
import { Sprite, useTime, clamp, Easing } from '../../components/animation'

// ── Palette ───────────────────────────────────────────────────────────────────

const INDIGO        = '#4F46E5'
const INDIGO_BG     = 'rgba(79, 70, 229, 0.10)'
const INDIGO_BD     = 'rgba(79, 70, 229, 0.38)'
const INDIGO_GLOW   = '0 0 24px rgba(79, 70, 229, 0.22)'
const GREEN         = '#16A34A'
const GREEN_BG      = 'rgba(22, 163, 74, 0.10)'
const GREEN_BD      = 'rgba(22, 163, 74, 0.38)'
const GREEN_GLOW    = '0 0 24px rgba(22, 163, 74, 0.22)'
const BG            = '#0B0D14'
const TEXT          = '#E2E8F0'
const MUTED         = '#64748B'
const DIM           = '#1E2330'
const SANS          = "'Epilogue', system-ui, sans-serif"
const MONO          = "'IBM Plex Mono', ui-monospace, monospace"

const CANVAS_W = 1920
const CANVAS_H = 1080

// ── Block dimensions ─────────────────────────────────────────────────────────

const BW  = 198  // block width  — full process
const BH  = 70   // block height
const BWE = 240  // block width  — express process

// ── Step definitions ──────────────────────────────────────────────────────────

interface BlockDef {
  label:     string
  loose:     { x: number; y: number }
  assembled: { x: number; y: number }
  express:   { x: number; y: number }
  inExpress: boolean
}

// Assembled row (7 blocks): total width = 7*198 + 6*18 = 1386+108 = 1494 → startX = 213
// Center Y = 510
const AY = 510

// Express row (3 blocks: 1,2,5): total width = 3*240 + 2*44 = 720+88 = 808 → startX = 556
// Express center Y = 510

const BLOCKS: BlockDef[] = [
  {
    label:     'pre-aprobación',
    loose:     { x: 210,  y: 170 },
    assembled: { x: 312,  y: AY  },
    express:   { x: -160, y: 200 },
    inExpress: false,
  },
  {
    label:     'cliente',
    loose:     { x: 1610, y: 165 },
    assembled: { x: 528,  y: AY  },
    express:   { x: 676,  y: AY  },
    inExpress: true,
  },
  {
    label:     'crédito',
    loose:     { x: 960,  y: 100 },
    assembled: { x: 744,  y: AY  },
    express:   { x: 960,  y: AY  },
    inExpress: true,
  },
  {
    label:     'contacto',
    loose:     { x: 310,  y: 720 },
    assembled: { x: 960,  y: AY  },
    express:   { x: -160, y: 720 },
    inExpress: false,
  },
  {
    label:     'asegurabilidad',
    loose:     { x: 1720, y: 640 },
    assembled: { x: 1176, y: AY  },
    express:   { x: 2080, y: 300 },
    inExpress: false,
  },
  {
    label:     'firma OTP',
    loose:     { x: 650,  y: 890 },
    assembled: { x: 1392, y: AY  },
    express:   { x: 1244, y: AY  },
    inExpress: true,
  },
  {
    label:     'documentos',
    loose:     { x: 1380, y: 860 },
    assembled: { x: 1608, y: AY  },
    express:   { x: 2080, y: 760 },
    inExpress: false,
  },
]

// ── Timing ───────────────────────────────────────────────────────────────────

const T = {
  // Phase 1 — loose blocks
  appear_first:   0.40,
  appear_last:    2.20,

  // Phase 2 — assembly into full process
  assemble_start: 3.60,
  assemble_end:   7.20,   // last block lands ~6.7
  full_label_in:  7.50,
  full_label_out: 9.60,

  // Phase 3 — reconfig into express
  reconfig_start: 9.80,
  reconfig_end:  13.20,
  expr_label_in: 13.50,
  expr_label_out:16.60,

  // Phase 4 — dual mode reveal
  dual_in:       17.20,
  dual_switch:   19.20,
  dual_done:     20.50,

  // Phase 5 — final caption hold
  final:         22.00,
  end:           28.00,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function enter(t: number, start: number, dur = 0.5): number {
  return Easing.easeOutCubic(clamp((t - start) / dur, 0, 1))
}

function getAppearOpacity(blockIdx: number, t: number): number {
  const start = T.appear_first + blockIdx * 0.27
  return enter(t, start, 0.55)
}

function getFloatOffset(blockIdx: number, t: number): number {
  const freq  = 0.65 + blockIdx * 0.08
  const phase = blockIdx * 0.85
  // Taper float to 0 as assembly starts
  const taper = 1 - clamp((t - T.assemble_start + 0.6) / 0.8, 0, 1)
  return Math.sin(t * freq + phase) * 11 * taper
}

function getBlockPos(bi: number, t: number): { x: number; y: number } {
  const b = BLOCKS[bi]

  // Phase 1 → 2: loose → assembled
  const assembleDelay  = bi * 0.13
  const assembleStart  = T.assemble_start + assembleDelay
  const assembleEnd    = assembleStart + 1.35
  const aP = Easing.easeOutCubic(clamp((t - assembleStart) / (assembleEnd - assembleStart), 0, 1))

  // Phase 3: assembled → express target
  const reconfigDelay = bi * 0.10
  const reconfigStart = T.reconfig_start + reconfigDelay
  const reconfigEnd   = reconfigStart + 1.4
  const rP = Easing.easeInOutCubic(clamp((t - reconfigStart) / (reconfigEnd - reconfigStart), 0, 1))

  if (t < T.assemble_start) {
    return { x: b.loose.x, y: b.loose.y + getFloatOffset(bi, t) }
  }
  if (t < T.reconfig_start) {
    return {
      x: lerp(b.loose.x, b.assembled.x, aP),
      y: lerp(b.loose.y, b.assembled.y, aP),
    }
  }
  return {
    x: lerp(b.assembled.x, b.express.x, rP),
    y: lerp(b.assembled.y, b.express.y, rP),
  }
}

function getBlockOpacity(bi: number, t: number): number {
  const appear = getAppearOpacity(bi, t)

  // Non-express blocks fade out during reconfig
  if (!BLOCKS[bi].inExpress) {
    const reconfigDelay = bi * 0.10
    const fadeStart = T.reconfig_start + reconfigDelay + 0.4
    const fadeOut   = 1 - clamp((t - fadeStart) / 0.6, 0, 1)
    if (t >= T.reconfig_start) return appear * fadeOut
  }

  // During dual-mode phase, all blocks dim
  if (t >= T.dual_in) {
    const dim = 1 - clamp((t - T.dual_in) / 0.6, 0, 1) * 0.75
    return appear * dim
  }

  return appear
}

// ── Block component ───────────────────────────────────────────────────────────

function Block({ bi, t }: { bi: number; t: number }) {
  const pos     = getBlockPos(bi, t)
  const op      = getBlockOpacity(bi, t)
  const b       = BLOCKS[bi]
  const isGreen = b.inExpress && t >= T.reconfig_start

  const w    = (isGreen && t >= T.reconfig_end) ? BWE : BW
  const bg   = isGreen ? GREEN_BG   : INDIGO_BG
  const bd   = isGreen ? GREEN_BD   : INDIGO_BD
  const glow = isGreen ? GREEN_GLOW : INDIGO_GLOW
  const col  = isGreen ? GREEN      : INDIGO

  return (
    <div style={{
      position: 'absolute',
      left: pos.x - w / 2,
      top:  pos.y - BH / 2,
      width: w, height: BH,
      borderRadius: 12,
      background: bg,
      border: `1.5px solid ${bd}`,
      boxShadow: glow,
      opacity: op,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 4,
    }}>
      <span style={{
        fontFamily: MONO, fontSize: 11.5, fontWeight: 700,
        color: col, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {b.label}
      </span>
    </div>
  )
}

// ── Connection lines ──────────────────────────────────────────────────────────

function ConnLines({ positions, opacity, color }: {
  positions: { x: number; y: number }[]
  opacity: number
  color: string
}) {
  if (opacity <= 0) return null
  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      width={CANVAS_W} height={CANVAS_H}
    >
      {positions.slice(0, -1).map((p, i) => (
        <line
          key={i}
          x1={p.x + BW / 2 + 2} y1={AY}
          x2={positions[i + 1].x - BW / 2 - 2} y2={AY}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          opacity={opacity}
        />
      ))}
    </svg>
  )
}

// ── Process label ─────────────────────────────────────────────────────────────

function ProcessLabel({ text, badge, x, y, opacity }: {
  text: string; badge: string; x: number; y: number; opacity: number
}) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: 'translateX(-50%) translateY(-50%)',
      opacity, textAlign: 'center', pointerEvents: 'none',
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, fontWeight: 600,
        color: MUTED, letterSpacing: '0.14em', textTransform: 'uppercase',
        marginBottom: 8,
      }}>{badge}</div>
      <div style={{
        fontFamily: SANS, fontSize: 28, fontWeight: 700,
        color: TEXT, letterSpacing: '-0.03em', lineHeight: 1,
      }}>{text}</div>
    </div>
  )
}

// ── Dual-mode card ────────────────────────────────────────────────────────────

function DualModeCard({ opacity, isConsult }: { opacity: number; isConsult: boolean }) {
  if (opacity <= 0) return null

  const fieldStyle = (readOnly: boolean): React.CSSProperties => ({
    background: readOnly ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
    border: `1px solid ${readOnly ? 'rgba(255,255,255,0.08)' : 'rgba(79,70,229,0.3)'}`,
    borderRadius: 8,
    padding: '10px 14px',
    fontFamily: SANS, fontSize: 13,
    color: readOnly ? MUTED : TEXT,
    transition: 'all 0.5s ease',
  })

  const badgeStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '7px 14px', borderRadius: 999,
    background: active ? 'rgba(79,70,229,0.12)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? INDIGO_BD : 'rgba(255,255,255,0.1)'}`,
    fontFamily: MONO, fontSize: 11, fontWeight: 700,
    color: active ? INDIGO : MUTED,
    letterSpacing: '0.06em',
    transition: 'all 0.5s ease',
  })

  return (
    <div style={{
      position: 'absolute',
      left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)',
      opacity,
      display: 'flex', gap: 60, alignItems: 'flex-start',
    }}>

      {/* Cliente / process mode */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 380 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            cliente · diligencia
          </span>
          <div style={badgeStyle(!isConsult)}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: !isConsult ? INDIGO : MUTED }} />
            EDICIÓN
          </div>
        </div>
        {['Nombre completo', 'Monto solicitado', 'Plazo'].map(f => (
          <div key={f} style={fieldStyle(isConsult && false)}>
            <div style={{ fontFamily: SANS, fontSize: 10, color: MUTED, marginBottom: 4 }}>{f}</div>
            <div style={{ color: TEXT, fontSize: 13 }}>{
              f === 'Nombre completo' ? 'María A. Ospina Ruiz' :
              f === 'Monto solicitado' ? '$ 3.500.000' : '18 meses'
            }</div>
          </div>
        ))}
        <div style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.08em', opacity: 0.7 }}>
          mode={'\'process\''}
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        display: 'flex', alignItems: 'center',
        marginTop: 60,
        opacity: isConsult ? 1 : 0.35,
        transition: 'opacity 0.5s ease',
      }}>
        <svg width="64" height="24" viewBox="0 0 64 24" fill="none">
          <path d="M0 12h52M44 4l12 8-12 8" stroke={INDIGO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={isConsult ? 1 : 0.4} />
        </svg>
      </div>

      {/* Analista / visual mode */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 380 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            analista · revisa
          </span>
          <div style={badgeStyle(isConsult)}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: isConsult ? INDIGO : MUTED }} />
            CONSULTA
          </div>
        </div>
        {['Nombre completo', 'Monto solicitado', 'Plazo'].map(f => (
          <div key={f} style={fieldStyle(true)}>
            <div style={{ fontFamily: SANS, fontSize: 10, color: MUTED, marginBottom: 4 }}>{f}</div>
            <div style={{ color: isConsult ? TEXT : MUTED, fontSize: 13, transition: 'color 0.5s ease' }}>{
              f === 'Nombre completo' ? 'María A. Ospina Ruiz' :
              f === 'Monto solicitado' ? '$ 3.500.000' : '18 meses'
            }</div>
          </div>
        ))}
        <div style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.08em', opacity: 0.7 }}>
          mode={'\'visual\''}
        </div>
      </div>
    </div>
  )
}

// ── Caption ───────────────────────────────────────────────────────────────────

function Caption({ start, end, text, sub }: {
  start: number; end: number; text: string; sub?: string
}) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const fi = 0.35, fo = 0.4
        const op = localTime < fi
          ? localTime / fi
          : localTime > duration - fo
            ? (duration - localTime) / fo
            : 1
        return (
          <div style={{
            position: 'absolute', left: '50%', bottom: 52,
            transform: `translateX(-50%) translateY(${(1 - op) * 8}px)`,
            opacity: op,
            background: 'rgba(15,23,42,0.92)', color: '#F8FAFC',
            padding: '10px 20px', borderRadius: 999,
            fontFamily: SANS, fontSize: 16, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 8px 28px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: INDIGO, boxShadow: `0 0 8px ${INDIGO}`, flexShrink: 0,
            }} />
            {text}
            {sub && (
              <span style={{
                fontFamily: MONO, fontSize: 11, color: '#94A3B8',
                letterSpacing: '0.05em', marginLeft: 2,
              }}>{sub}</span>
            )}
          </div>
        )
      }}
    </Sprite>
  )
}

// ── Main scene ────────────────────────────────────────────────────────────────

export function SceneUni2() {
  const t = useTime()

  // Connection lines: show between assembled_start and reconfig_start
  const linesFullOp  = clamp((t - (T.assemble_end - 0.5)) / 0.8, 0, 1) *
                       (1 - clamp((t - T.reconfig_start) / 0.4, 0, 1))
  const linesExprOp  = BLOCKS.filter(b => b.inExpress).length > 0
    ? clamp((t - (T.reconfig_end - 0.3)) / 0.7, 0, 1) *
      (1 - clamp((t - T.dual_in) / 0.5, 0, 1))
    : 0

  // Process labels
  const fullLabelOp = clamp((t - T.full_label_in) / 0.5, 0, 1) *
                      (1 - clamp((t - T.full_label_out) / 0.4, 0, 1))
  const exprLabelOp = clamp((t - T.expr_label_in) / 0.5, 0, 1) *
                      (1 - clamp((t - T.expr_label_out) / 0.4, 0, 1))

  // Dual-mode card
  const dualOp     = enter(t, T.dual_in, 0.6)
  const isConsult  = t >= T.dual_switch

  // Assembled positions for line drawing
  const fullPositions = BLOCKS.map(b => b.assembled)
  const exprPositions = BLOCKS.filter(b => b.inExpress).map(b => b.express)

  // Background grid pattern opacity
  const gridOp = clamp((t - 0.1) / 1.5, 0, 1) * 0.18

  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>

      {/* Subtle grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: gridOp,
        backgroundImage:
          `linear-gradient(${DIM} 1px, transparent 1px),` +
          `linear-gradient(90deg, ${DIM} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Connection lines (SVG overlay, below blocks) */}
      <ConnLines
        positions={fullPositions}
        opacity={linesFullOp}
        color={`rgba(79,70,229,0.4)`}
      />
      <ConnLines
        positions={exprPositions}
        opacity={linesExprOp}
        color={`rgba(22,163,74,0.45)`}
      />

      {/* Blocks */}
      {BLOCKS.map((_, bi) => (
        <Block key={bi} bi={bi} t={t} />
      ))}

      {/* Process labels */}
      <ProcessLabel
        text="Proceso completo"
        badge="7 pasos · todos en orden"
        x={CANVAS_W / 2}
        y={320}
        opacity={fullLabelOp}
      />
      <ProcessLabel
        text="Microcrédito express"
        badge="3 pasos · misma base · nueva config"
        x={CANVAS_W / 2}
        y={320}
        opacity={exprLabelOp}
      />

      {/* Dual-mode card */}
      <DualModeCard opacity={dualOp} isConsult={isConsult} />

      {/* Captions */}
      <Caption start={0.40}  end={3.50}  text="7 steps · construidos independientemente"  sub="FEATURE-SLICED DESIGN"           />
      <Caption start={4.00}  end={9.50}  text="Se ensamblan en un proceso completo"        sub="CREDIT ORIGINATION FLOW"        />
      <Caption start={10.50} end={16.50} text="Los mismos steps · proceso distinto"        sub="NUEVA CONFIG · NO UN REWRITE"   />
      <Caption start={17.30} end={21.80} text="Un flujo · dos roles · prop mode"           sub="CERO DUPLICACIÓN DE CÓDIGO"     />
      <Caption start={22.20} end={27.50} text="Un proceso nuevo = un archivo de config"    sub="UNI2LITE · 2025"               />
    </div>
  )
}
