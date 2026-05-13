import React from 'react'
import { useTime, clamp, Easing, Sprite } from '../../components/animation'

// ── Signature stroke data ─────────────────────────────────────────────────────

const SIGNATURE_STROKES = [
  {
    d: 'M 50,130 C 55,80 75,55 95,75 C 115,95 110,130 95,140 C 80,150 75,120 100,100 C 130,80 145,110 140,135 C 138,150 152,148 165,128 C 175,113 175,90 168,88 C 162,86 158,102 162,125 C 165,143 178,148 195,135 C 215,118 220,90 213,86 C 207,82 200,98 206,128 C 211,150 230,148 242,128 C 252,112 258,90 252,82 C 248,77 240,88 245,110 C 252,140 280,148 295,128 C 308,110 312,90 305,85 C 298,80 290,95 298,118 C 308,148 340,142 360,118 C 378,96 380,80 372,80 C 360,80 360,108 376,128 C 392,148 415,140 430,118',
    length: 1200,
    speedMul: 1.0,
  },
  {
    d: 'M 95,160 C 180,175 320,170 440,155',
    length: 360,
    speedMul: 0.55,
  },
  {
    d: 'M 217,55 L 225,57',
    length: 12,
    speedMul: 0.1,
  },
]

interface Stroke {
  d: string
  length: number
  speedMul: number
  t0: number
  t1: number
}

function getStrokeTimings(): Stroke[] {
  const totalLen = SIGNATURE_STROKES.reduce((s, st) => s + st.length / st.speedMul, 0)
  let acc = 0
  return SIGNATURE_STROKES.map((st) => {
    const cost = st.length / st.speedMul
    const t0 = acc / totalLen
    acc += cost
    const t1 = acc / totalLen
    return { ...st, t0, t1 }
  })
}

// ── Scene timing constants ────────────────────────────────────────────────────

const CANVAS_W = 1920
const CANVAS_H = 1080

const T = {
  cursor_move_start:      2.3,
  cursor_arrive:          3.4,
  firmar_click:           3.7,
  modal_open:             3.85,
  topaz_appear:           4.2,
  connecting_done:        5.0,
  draw_start:             5.6,
  draw_end:               5.6 + 3.4, // ≈ 9.0
  cursor_to_confirm_start: 9.4,
  confirm_arrive:         10.3,
  confirm_click:          10.55,
  modal_close:            10.75,
  doc_signature_start:    11.2,
  doc_signature_end:      12.2,
  stamp_appear:           12.4,
  hold_end:               18.0,
}

const MODAL_POS = { x: 740, y: 280 }
const TOPAZ_POS = { x: 1380, y: 360 }
const FIRMAR_POS_FALLBACK  = { x: 1825, y: 1045 }
const CONFIRM_POS_FALLBACK = { x: 1190, y: 687 }

// ── Camera ────────────────────────────────────────────────────────────────────

interface CameraKf { t: number; x: number; y: number; scale: number }

function useCamera(keyframes: CameraKf[]) {
  const t = useTime()
  let curr = keyframes[0]
  let next = keyframes[keyframes.length - 1]
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (t >= keyframes[i].t && t <= keyframes[i + 1].t) {
      curr = keyframes[i]; next = keyframes[i + 1]; break
    }
    if (t > keyframes[keyframes.length - 1].t) { curr = next = keyframes[keyframes.length - 1] }
  }
  const span  = next.t - curr.t
  const local = span > 0 ? clamp((t - curr.t) / span, 0, 1) : 0
  const e = Easing.easeInOutCubic(local)
  return {
    x:     curr.x     + (next.x     - curr.x)     * e,
    y:     curr.y     + (next.y     - curr.y)     * e,
    scale: curr.scale + (next.scale - curr.scale) * e,
  }
}

function CameraLayer({ keyframes, children }: { keyframes: CameraKf[]; children: React.ReactNode }) {
  const cam = useCamera(keyframes)
  const tx = CANVAS_W / 2 - cam.x * cam.scale
  const ty = CANVAS_H / 2 - cam.y * cam.scale
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      transform: `translate(${tx}px, ${ty}px) scale(${cam.scale})`,
      transformOrigin: '0 0',
      willChange: 'transform',
    }}>
      {children}
    </div>
  )
}

// ── Cursor ────────────────────────────────────────────────────────────────────

interface CursorStop  { t: number; x: number; y: number }
interface ClickEvent  { t: number }

function Cursor({ stops, clicks = [] }: { stops: CursorStop[]; clicks?: ClickEvent[] }) {
  const t = useTime()
  let prev = stops[0], next = stops[stops.length - 1]
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) { prev = stops[i]; next = stops[i + 1]; break }
  }
  if (t >= stops[stops.length - 1].t) { prev = next = stops[stops.length - 1] }
  const span  = next.t - prev.t
  const local = span > 0 ? clamp((t - prev.t) / span, 0, 1) : 0
  const eased = Easing.easeInOutCubic(local)
  const x = prev.x + (next.x - prev.x) * eased
  const y = prev.y + (next.y - prev.y) * eased

  let clickScale = 1, ringOpacity = 0, ringScale = 1
  for (const c of clicks) {
    const dt = t - c.t
    if (dt >= -0.1 && dt < 0.5) {
      if (dt < 0.1)       clickScale = 1 - 0.2 * (dt / 0.1)
      else if (dt < 0.2)  clickScale = 0.8 + 0.2 * ((dt - 0.1) / 0.1)
      else                clickScale = 1
      if (dt >= 0) {
        const rt = dt / 0.5
        ringOpacity = (1 - rt) * 0.6
        ringScale   = 1 + rt * 2.5
      }
    }
  }

  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <div style={{
        position: 'absolute', left: -28, top: -28, width: 56, height: 56, borderRadius: '50%',
        border: '3px solid #2563EB', opacity: ringOpacity, transform: `scale(${ringScale})`,
      }} />
      <svg width="34" height="40" viewBox="0 0 34 40" style={{
        position: 'absolute', left: -2, top: -2,
        transform: `scale(${clickScale})`, transformOrigin: '6px 6px',
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
      }}>
        <path d="M3 2 L3 28 L11 22 L16 32 L20 30 L15 20 L24 19 Z"
          fill="#fff" stroke="#1C1917" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ── Modal backdrop dim ────────────────────────────────────────────────────────

function ModalBackdrop({ opacity }: { opacity: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(2px)',
      opacity, pointerEvents: 'none',
    }} />
  )
}

// ── Signature SVG (progressive stroke draw) ───────────────────────────────────

function SignatureSVG({ progress, color = '#0A2540', strokeWidth = 2.4 }: {
  progress: number; color?: string; strokeWidth?: number
}) {
  const strokes = getStrokeTimings()
  return (
    <svg viewBox="0 0 480 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {strokes.map((s, i) => {
        let localP = 0
        if (progress >= s.t1)      localP = 1
        else if (progress > s.t0)  localP = (progress - s.t0) / (s.t1 - s.t0)
        const drawn = s.length * localP
        return (
          <path key={i} d={s.d} fill="none" stroke={color}
            strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={s.length} strokeDashoffset={s.length - drawn}
          />
        )
      })}
    </svg>
  )
}

// ── Presto UI ────────────────────────────────────────────────────────────────

function PrestoTopBar() {
  return (
    <div style={{
      height: 56, background: '#fff', borderBottom: '1px solid #E4E2DC',
      display: 'flex', alignItems: 'center', padding: '0 28px', gap: 24, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, background: '#1C1917',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FCD34D', fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
          fontWeight: 600, fontSize: 14,
        }}>P</div>
        <div style={{ fontFamily: 'Epilogue', fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', color: '#1C1917' }}>
          Presto
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#736D67', marginLeft: 4 }}>v4.2.1</div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: 'Epilogue', fontSize: 13, color: '#57534E', fontWeight: 500 }}>
        <span>Operaciones</span><span>Clientes</span><span>Reportes</span>
      </div>
      <div style={{ width: 1, height: 22, background: '#E4E2DC' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: '#15803D',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Epilogue', fontWeight: 600, fontSize: 12,
        }}>JR</div>
        <div style={{ fontFamily: 'Epilogue', fontSize: 12, color: '#1C1917', fontWeight: 500 }}>
          Julián R.
          <div style={{ fontSize: 10, color: '#736D67', fontWeight: 400, marginTop: 1 }}>Asesor · Suc. Chapinero</div>
        </div>
      </div>
    </div>
  )
}

function PrestoSidebar() {
  const items = [
    { label: 'Cuentas',        active: true,  icon: '◇' },
    { label: 'Créditos',       active: false, icon: '◆' },
    { label: 'Transferencias', active: false, icon: '⇄' },
    { label: 'CDTs',           active: false, icon: '▣' },
    { label: 'Tarjetas',       active: false, icon: '▤' },
  ]
  return (
    <div style={{
      width: 220, background: '#fff', borderRight: '1px solid #E4E2DC',
      padding: '24px 14px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <div style={{
        fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67',
        letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px 10px',
      }}>OPERACIONES</div>
      {items.map(it => (
        <div key={it.label} style={{
          padding: '9px 12px', borderRadius: 8,
          background: it.active ? '#EFF6FF' : 'transparent',
          color: it.active ? '#2563EB' : '#57534E',
          fontFamily: 'Epilogue', fontSize: 13, fontWeight: it.active ? 600 : 500,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ opacity: 0.7, fontFamily: 'IBM Plex Mono', fontSize: 11 }}>{it.icon}</span>
          {it.label}
        </div>
      ))}
    </div>
  )
}

function OperationHeader() {
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#736D67', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
        OPERACIÓN · APERT-2026-04812
      </div>
      <div style={{ fontFamily: 'Epilogue', fontSize: 32, fontWeight: 600, color: '#1C1917', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        Apertura de cuenta de ahorros
      </div>
      <div style={{ fontFamily: 'Epilogue', fontSize: 14, color: '#736D67', marginTop: 8 }}>
        Cliente: <span style={{ color: '#1C1917', fontWeight: 500 }}>María Fernanda Castaño Ríos</span> · CC 1.018.554.221
      </div>
    </div>
  )
}

function ClientCard() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E4E2DC', borderRadius: 12,
      padding: 22, display: 'flex', gap: 32, alignItems: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 12, background: '#F2F0EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Epilogue', fontWeight: 600, fontSize: 20, color: '#57534E',
      }}>MC</div>
      <div style={{ display: 'flex', gap: 40, flex: 1 }}>
        {[
          { label: 'Tipo de producto', value: 'Ahorro Plus',          mono: false, accent: false },
          { label: 'Monto inicial',    value: '$ 1.500.000',          mono: true,  accent: false },
          { label: 'Sucursal',         value: 'Chapinero · 0048',     mono: false, accent: false },
          { label: 'Estado',           value: '● Listo para firma',   mono: false, accent: true  },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{f.label}</div>
            <div style={{ fontFamily: f.mono ? 'IBM Plex Mono' : 'Epilogue', fontSize: 14, fontWeight: 500, color: f.accent ? '#2563EB' : '#1C1917' }}>{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SignatureLoadingState() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Epilogue', fontSize: 13, color: '#57534E', fontWeight: 500 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ animation: 'topaz-spin 0.9s linear infinite' }}>
          <circle cx="9" cy="9" r="7" stroke="#E4E2DC" strokeWidth="2" fill="none" />
          <path d="M9 2 a7 7 0 0 1 7 7" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        Insertando firma en el documento…
      </div>
      <div style={{ width: '70%', height: 8, borderRadius: 4, overflow: 'hidden', background: '#F2F0EB', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.35) 50%, transparent 100%)',
          backgroundSize: '200% 100%', animation: 'topaz-shimmer 1.2s linear infinite',
        }} />
      </div>
    </div>
  )
}

function SignatureInsertedDisplay({ insertedT }: { insertedT: number }) {
  const popDur = 0.5
  const p = Math.min(1, insertedT / popDur)
  const scale   = 0.92 + 0.08 * Easing.easeOutBack(p)
  const opacity = Math.min(1, insertedT / 0.2)
  const glow    = Math.max(0, 1 - insertedT / 0.9)
  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `scale(${scale})`, transformOrigin: 'center 80%',
      opacity,
      filter: glow > 0 ? `drop-shadow(0 0 ${10 * glow}px rgba(37, 99, 235, ${0.5 * glow}))` : 'none',
      display: 'flex', alignItems: 'flex-end', padding: '0 8px 4px',
    }}>
      <SignatureSVG progress={1} color="#1C1917" />
    </div>
  )
}

function ErpStamp() {
  return (
    <div style={{
      position: 'absolute', top: 18, right: 18,
      display: 'flex', alignItems: 'center', gap: 9,
      background: '#ECFDF5', color: '#15803D', border: '1px solid #BBF7D0',
      padding: '7px 12px 7px 10px', borderRadius: 8,
      fontFamily: 'Epilogue', fontSize: 12, fontWeight: 600,
    }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span>Firma capturada</span>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fontWeight: 400, color: '#15803D', opacity: 0.75, marginTop: 1, letterSpacing: '0.02em' }}>
          ERP · sync 12/05/2026 14:32
        </span>
      </div>
    </div>
  )
}

type SigState = 'pending' | 'inserting' | 'inserted'

function DocumentPreviewCard({ sigState = 'pending', insertedT = 0, finalStamp = false }: {
  sigState?: SigState; insertedT?: number; finalStamp?: boolean
}) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E4E2DC', borderRadius: 12,
      padding: 24, flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            DOCUMENTO · CONTRATO-AH-04812.pdf
          </div>
          <div style={{ fontFamily: 'Epilogue', fontSize: 17, fontWeight: 600, color: '#1C1917' }}>
            Contrato de apertura · Cuenta de ahorros
          </div>
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67', background: '#F2F0EB', padding: '4px 8px', borderRadius: 4, letterSpacing: '0.04em' }}>3 / 3</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4, opacity: 0.85 }}>
        {[100, 95, 88, 92, 96, 80, 70].map((w, i) => (
          <div key={i} style={{ height: 6, width: `${w}%`, background: '#E4E2DC', borderRadius: 3 }} />
        ))}
      </div>

      <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px dashed #E4E2DC' }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
          FIRMA DEL TITULAR
        </div>
        <div style={{
          height: 110, borderBottom: '1.5px solid #1C1917',
          position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 8px 4px',
          background: sigState === 'inserting' ? '#F1F5F9' : 'transparent',
          transition: 'background 240ms ease',
        }}>
          {sigState === 'pending' && (
            <div style={{ position: 'absolute', left: 8, top: 8, fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#A8A29E', letterSpacing: '0.04em' }}>
              [ pendiente de firma ]
            </div>
          )}
          {sigState === 'inserting' && <SignatureLoadingState />}
          {sigState === 'inserted'  && <SignatureInsertedDisplay insertedT={insertedT} />}
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontFamily: 'Epilogue', fontSize: 12, color: '#57534E' }}>
          <span>María F. Castaño R.</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}>CC 1.018.554.221</span>
        </div>
      </div>

      {finalStamp && <ErpStamp />}
    </div>
  )
}

function BottomActions({ firmarHover = false, firmarPressed = false }: { firmarHover?: boolean; firmarPressed?: boolean }) {
  return (
    <div style={{
      borderTop: '1px solid #E4E2DC', background: '#fff',
      padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
    }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#736D67', letterSpacing: '0.04em' }}>
        ● Sesión activa · ERP-BANK · uplink OK
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{
          padding: '11px 20px', borderRadius: 8, border: '1px solid #E4E2DC',
          background: '#fff', color: '#57534E', fontFamily: 'Epilogue', fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}>Cancelar</button>
        <button
          data-firmar-btn
          style={{
            padding: '11px 24px', borderRadius: 8, border: 'none',
            background: firmarPressed ? '#1D4ED8' : firmarHover ? '#1E40AF' : '#2563EB',
            color: '#fff', fontFamily: 'Epilogue', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            transform: firmarPressed ? 'translateY(1px)' : 'translateY(0)',
            boxShadow: firmarHover && !firmarPressed
              ? '0 0 0 4px rgba(37, 99, 235, 0.18), 0 4px 12px rgba(37, 99, 235, 0.25)'
              : '0 1px 2px rgba(0,0,0,0.08)',
            transition: 'box-shadow 120ms, background 120ms, transform 80ms',
          }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 11l7-7 3 3-7 7H2v-3z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          Firmar
        </button>
      </div>
    </div>
  )
}

// ── TOPAZ device ──────────────────────────────────────────────────────────────

function StylusTip({ progress, strokes }: { progress: number; strokes: Stroke[] }) {
  const pathRef = React.useRef<SVGPathElement>(null)
  const [tip, setTip] = React.useState({ x: 0, y: 0 })

  // activeIdx is pure derivation — computed in render
  let activeIdx = 0
  for (let i = 0; i < strokes.length; i++) {
    if (progress >= strokes[i].t0 && progress <= strokes[i].t1) { activeIdx = i; break }
    if (progress > strokes[i].t1) activeIdx = i
  }

  // useLayoutEffect for DOM measurement: runs synchronously after paint, setState here is expected
  React.useLayoutEffect(() => {
    if (!pathRef.current) return
    try {
      const s = strokes[activeIdx]
      let localP = 0
      if (progress >= s.t1)     localP = 1
      else if (progress > s.t0) localP = (progress - s.t0) / (s.t1 - s.t0)
      const total = pathRef.current.getTotalLength()
      const pt    = pathRef.current.getPointAtLength(total * localP)
      setTip({ x: pt.x, y: pt.y })
    } catch { /* SVG not ready */ }
  }, [progress, strokes, activeIdx])

  const activeStroke = strokes[activeIdx]
  return (
    <svg viewBox="0 0 480 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
      <path ref={pathRef} d={activeStroke.d} fill="none" stroke="none" />
      <g transform={`translate(${tip.x}, ${tip.y})`}>
        <circle r="3" fill="#0A1408" />
        <line x1="0" y1="0" x2="38" y2="-58" stroke="#1C1917" strokeWidth="6" strokeLinecap="round" />
        <line x1="36" y1="-56" x2="48" y2="-72" stroke="#736D67" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function TopazPad({ progress = 0, connected = false, awaitingTouch = false }: {
  progress?: number; connected?: boolean; awaitingTouch?: boolean
}) {
  const strokes = getStrokeTimings()
  return (
    <div style={{
      width: 360, height: 240, background: '#1C1917', borderRadius: 18, padding: 14,
      boxShadow: '0 24px 60px -10px rgba(0,0,0,0.55), 0 8px 16px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
      position: 'relative', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute', top: 6, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', padding: '0 18px',
        fontFamily: 'IBM Plex Mono', fontSize: 8, color: '#736D67', letterSpacing: '0.18em',
      }}>
        <span>TOPAZ · SignatureGem LCD 4×3</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: connected ? '#22C55E' : '#FCD34D',
            boxShadow: connected ? '0 0 6px #22C55E' : 'none',
          }} />
          {connected ? 'USB·HID' : 'idle'}
        </span>
      </div>

      <div style={{
        flex: 1, marginTop: 14, background: '#E9F4EC', borderRadius: 8, padding: 10,
        position: 'relative',
        boxShadow: 'inset 0 0 0 1px #0A1408, inset 0 0 14px rgba(10, 20, 8, 0.18)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'IBM Plex Mono', fontSize: 9, color: '#15803D', letterSpacing: '0.05em',
        }}>
          <span>POR FAVOR FIRME EN EL RECUADRO</span>
          <span>{progress > 0.02 ? 'CAPTURANDO…' : 'LISTO'}</span>
        </div>

        <div style={{
          position: 'absolute', left: 16, right: 16, top: 32, bottom: 36,
          borderBottom: '1.2px solid #0A1408',
          display: 'flex', alignItems: 'flex-end', padding: '0 4px 2px',
        }}>
          <svg viewBox="0 0 480 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {strokes.map((s, i) => {
              let localP = 0
              if (progress >= s.t1)     localP = 1
              else if (progress > s.t0) localP = (progress - s.t0) / (s.t1 - s.t0)
              const drawn = s.length * localP
              return (
                <path key={i} d={s.d} fill="none" stroke="#0A1408"
                  strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={s.length} strokeDashoffset={s.length - drawn}
                />
              )
            })}
          </svg>
          {progress > 0.02 && progress < 0.98 && (
            <StylusTip progress={progress} strokes={strokes} />
          )}
        </div>

        {awaitingTouch && progress < 0.05 && (
          <div style={{
            position: 'absolute', left: 30, bottom: 38,
            fontFamily: 'IBM Plex Mono', fontSize: 14, color: '#0A1408', fontWeight: 700,
            animation: 'topaz-blink 1s steps(2, end) infinite',
          }}>×</div>
        )}

        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 6,
          display: 'flex', justifyContent: 'space-around',
          fontFamily: 'IBM Plex Mono', fontSize: 8, color: '#15803D', letterSpacing: '0.08em',
        }}>
          <span>◁ BORRAR</span><span>CANCELAR</span><span>OK ▷</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8, padding: '0 8px' }}>
        {(['◁', '○', '▷'] as const).map((g, i) => (
          <div key={i} style={{
            width: 32, height: 14, borderRadius: 7, background: '#0A0908',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#57534E', fontSize: 9, fontFamily: 'IBM Plex Mono',
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.6)',
          }}>{g}</div>
        ))}
      </div>

      <div style={{
        position: 'absolute', right: -2, top: '50%', width: 14, height: 22, marginTop: -11,
        background: '#0A0908', borderRadius: '2px 6px 6px 2px',
        boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.05)',
      }} />
    </div>
  )
}

function ConnectionBadge({ label, color, pulse }: { label: string; color: string; pulse: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#F2F0EB', padding: '7px 12px', borderRadius: 999,
      fontFamily: 'Epilogue', fontSize: 11, fontWeight: 500, color: '#57534E',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: color,
        animation: pulse ? 'topaz-pulse 0.9s ease-in-out infinite' : 'none',
      }} />
      {label}
    </div>
  )
}

function DataBus({ fromX, fromY, toX, toY }: { fromX: number; fromY: number; toX: number; toY: number }) {
  const dx = toX - fromX, dy = toY - fromY
  const len   = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  return (
    <div style={{
      position: 'absolute', left: fromX, top: fromY,
      width: len, height: 2,
      transform: `rotate(${angle}deg)`, transformOrigin: '0 50%',
      background: 'repeating-linear-gradient(90deg, #2563EB 0 8px, transparent 8px 14px)',
      backgroundSize: '14px 100%', opacity: 0.85,
      animation: 'topaz-dataflow 0.7s linear infinite',
    }} />
  )
}

function SignModal({ progress = 0, connectionStage = 'connecting', confirmEnabled = false, confirmHover = false }: {
  progress?: number; connectionStage?: string; confirmEnabled?: boolean; confirmHover?: boolean
}) {
  const strokes = getStrokeTimings()
  const stageLabel: Record<string, string> = {
    connecting: 'Conectando con TOPAZ LCD…',
    connected:  'Pad conectado · esperando firma del cliente',
    awaiting:   'Esperando firma del cliente',
    capturing:  'Capturando firma en tiempo real…',
    done:       'Firma recibida',
  }
  const stageColor = connectionStage === 'done'      ? '#15803D'
                   : connectionStage === 'capturing' ? '#2563EB'
                   : '#FCD34D'

  return (
    <div style={{
      width: 560, background: '#fff', borderRadius: 16,
      boxShadow: '0 30px 70px -10px rgba(0,0,0,0.35), 0 12px 24px -6px rgba(0,0,0,0.15)',
      border: '1px solid #E4E2DC', overflow: 'hidden',
    }}>
      <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid #E4E2DC' }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          PASO 3 DE 3 · FIRMA DIGITAL
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'Epilogue', fontSize: 22, fontWeight: 600, color: '#1C1917', letterSpacing: '-0.01em' }}>
              Firma del titular
            </div>
            <div style={{ fontFamily: 'Epilogue', fontSize: 13, color: '#57534E', marginTop: 4 }}>
              María F. Castaño R. · CC 1.018.554.221
            </div>
          </div>
          <ConnectionBadge label={stageLabel[connectionStage] ?? ''} color={stageColor} pulse={connectionStage !== 'done'} />
        </div>
      </div>

      <div style={{ padding: 22 }}>
        <div style={{
          position: 'relative', height: 200,
          background: progress > 0.02 ? '#fff' : '#FAFAF9',
          border: `1.5px ${progress > 0.02 ? 'solid' : 'dashed'} ${progress > 0.02 ? '#2563EB' : '#D4D0CA'}`,
          borderRadius: 10, padding: '12px 18px',
          transition: 'border-color 200ms, background 200ms',
        }}>
          {progress < 0.02 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, pointerEvents: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: '#F2F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 14l3 1 8-8-3-3-8 8 0 2z" stroke="#736D67" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontFamily: 'Epilogue', fontSize: 13, color: '#736D67' }}>El cliente está firmando en el pad TOPAZ</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#A8A29E', letterSpacing: '0.04em' }}>CANAL SEGURO · TLS 1.3</div>
            </div>
          )}

          <svg viewBox="0 0 480 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {strokes.map((s, i) => {
              let localP = 0
              if (progress >= s.t1)     localP = 1
              else if (progress > s.t0) localP = (progress - s.t0) / (s.t1 - s.t0)
              const drawn = s.length * localP
              return (
                <path key={i} d={s.d} fill="none" stroke="#2563EB"
                  strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={s.length} strokeDashoffset={s.length - drawn}
                />
              )
            })}
          </svg>

          {progress > 0.02 && progress < 0.98 && (
            <div style={{
              position: 'absolute', bottom: 8, right: 12, display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'IBM Plex Mono', fontSize: 9, color: '#2563EB', letterSpacing: '0.06em',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', animation: 'topaz-pulse 0.7s ease-in-out infinite' }} />
              STREAM · 120pt/s
            </div>
          )}
        </div>

        <div style={{
          marginTop: 12, display: 'flex', justifyContent: 'space-between',
          fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67', letterSpacing: '0.04em',
        }}>
          <span>SHA-256 · {progress >= 1 ? '8f2a…d49c' : '— · — · —'}</span>
          <span>{Math.round(progress * 100)} %</span>
        </div>
      </div>

      <div style={{
        padding: '14px 22px', borderTop: '1px solid #E4E2DC', background: '#FAFAF9',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67' }}>SIGN-ID · 7c1d-04812-MFC</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            padding: '9px 18px', borderRadius: 7, border: '1px solid #E4E2DC',
            background: '#fff', color: '#57534E', fontFamily: 'Epilogue', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>Cancelar</button>
          <button
            data-confirm-btn
            style={{
              padding: '9px 22px', borderRadius: 7, border: 'none',
              background: confirmEnabled ? (confirmHover ? '#166534' : '#15803D') : '#E4E2DC',
              color: confirmEnabled ? '#fff' : '#A8A29E',
              fontFamily: 'Epilogue', fontSize: 13, fontWeight: 600,
              cursor: confirmEnabled ? 'pointer' : 'not-allowed',
              boxShadow: confirmHover && confirmEnabled ? '0 0 0 4px rgba(21,128,61,0.18)' : 'none',
              transition: 'background 120ms, box-shadow 120ms',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            {confirmEnabled && <span>✓</span>}
            Confirmar firma
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Hooks: signature progress & doc state ─────────────────────────────────────

function useSignatureProgress() {
  const t = useTime()
  if (t < T.draw_start) return 0
  if (t >= T.draw_end)  return 1
  return (t - T.draw_start) / (T.draw_end - T.draw_start)
}

function useDocSignatureState(): SigState {
  const t = useTime()
  if (t < T.doc_signature_start) return 'pending'
  if (t < T.doc_signature_end)   return 'inserting'
  return 'inserted'
}

// ── Presto screen layer ───────────────────────────────────────────────────────

function PrestoScreen({ docSigState, insertedT, finalStamp }: {
  docSigState: SigState; insertedT: number; finalStamp: boolean
}) {
  const t = useTime()
  const hover   = t > T.cursor_move_start + 0.6 && t < T.firmar_click + 0.6
  const pressed = t > T.firmar_click && t < T.firmar_click + 0.15

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FAFAF9', display: 'flex', flexDirection: 'column' }}>
      <PrestoTopBar />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <PrestoSidebar />
        <div style={{ flex: 1, padding: '32px 40px 24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <OperationHeader />
          <ClientCard />
          <DocumentPreviewCard sigState={docSigState} insertedT={insertedT} finalStamp={finalStamp} />
        </div>
      </div>
      <BottomActions firmarHover={hover} firmarPressed={pressed} />
    </div>
  )
}

// ── Modal + TOPAZ overlay ─────────────────────────────────────────────────────

function ModalLayer() {
  const t    = useTime()
  const sigP = useSignatureProgress()

  let backdropOpacity = 0
  if (t >= T.modal_open && t < T.modal_close) {
    if      (t < T.modal_open + 0.3)  backdropOpacity = (t - T.modal_open) / 0.3
    else if (t > T.modal_close - 0.3) backdropOpacity = (T.modal_close - t) / 0.3
    else                               backdropOpacity = 1
  } else if (t >= T.modal_close && t < T.modal_close + 0.4) {
    backdropOpacity = 1 - (t - T.modal_close) / 0.4
  }

  const modalVisible = t >= T.modal_open && t < T.modal_close + 0.4
  let modalY = 0, modalOpacity = 1
  if (t < T.modal_open + 0.4) {
    const p = clamp((t - T.modal_open) / 0.4, 0, 1)
    modalY = (1 - Easing.easeOutBack(p)) * 30
    modalOpacity = p
  } else if (t > T.modal_close) {
    const p = clamp((t - T.modal_close) / 0.4, 0, 1)
    modalY = -p * 20
    modalOpacity = 1 - p
  }

  const topazVisible = t >= T.topaz_appear && t < T.modal_close + 0.4
  let topazY = 0, topazOpacity = 1, topazRot = -3
  if (t < T.topaz_appear + 0.6) {
    const p = clamp((t - T.topaz_appear) / 0.6, 0, 1)
    topazY       = (1 - Easing.easeOutCubic(p)) * 120
    topazOpacity = p
    topazRot     = -3 + (1 - Easing.easeOutCubic(p)) * 5
  } else if (t > T.modal_close) {
    const p = clamp((t - T.modal_close) / 0.4, 0, 1)
    topazY       = p * 40
    topazOpacity = 1 - p
  }

  let stage = 'connecting'
  if (t >= T.connecting_done)        stage = 'connected'
  if (t >= T.draw_start - 0.2)      stage = 'awaiting'
  if (sigP > 0.02 && sigP < 0.98)   stage = 'capturing'
  if (sigP >= 0.98)                  stage = 'done'

  const confirmEnabled = sigP >= 0.98
  const confirmHover   = t > T.cursor_to_confirm_start + 0.4 && t < T.confirm_click + 0.5
  const busVisible     = t >= T.draw_start && t < T.draw_end + 0.2

  if (!modalVisible) return null

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <ModalBackdrop opacity={backdropOpacity} />

      <div style={{ position: 'absolute', left: MODAL_POS.x, top: MODAL_POS.y, transform: `translateY(${modalY}px)`, opacity: modalOpacity }}>
        <SignModal progress={sigP} connectionStage={stage} confirmEnabled={confirmEnabled} confirmHover={confirmHover} />
      </div>

      {topazVisible && (
        <div style={{
          position: 'absolute', left: TOPAZ_POS.x, top: TOPAZ_POS.y,
          transform: `translateY(${topazY}px) rotate(${topazRot}deg)`,
          opacity: topazOpacity,
        }}>
          <TopazPad progress={sigP} connected={t >= T.connecting_done} awaitingTouch={stage === 'awaiting'} />
        </div>
      )}

      {busVisible && (
        <DataBus
          fromX={MODAL_POS.x + 540} fromY={MODAL_POS.y + 280}
          toX={TOPAZ_POS.x + 20}    toY={TOPAZ_POS.y + 120}
        />
      )}

      {topazVisible && (
        <div style={{
          position: 'absolute', left: TOPAZ_POS.x + 12, top: TOPAZ_POS.y + 260,
          transform: `translateY(${topazY}px) rotate(${topazRot}deg)`,
          transformOrigin: '0 -140px',
          fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#736D67',
          letterSpacing: '0.08em', opacity: topazOpacity * 0.9,
        }}>
          PAD FÍSICO · SUCURSAL · USB-HID
        </div>
      )}
    </div>
  )
}

// ── Cursor layer ──────────────────────────────────────────────────────────────
// Layout is deterministic (canvas always 1920×1080), so we use fixed positions
// computed from the Presto UI layout rather than DOM measurements.

function CursorLayer() {
  const t = useTime()

  const stops: CursorStop[] = [
    { t: 0,                          x: 1200,                     y: 700                     },
    { t: T.cursor_move_start,        x: 1200,                     y: 700                     },
    { t: T.cursor_arrive,            x: FIRMAR_POS_FALLBACK.x,    y: FIRMAR_POS_FALLBACK.y   },
    { t: T.modal_open,               x: FIRMAR_POS_FALLBACK.x,    y: FIRMAR_POS_FALLBACK.y   },
    { t: T.cursor_to_confirm_start,  x: FIRMAR_POS_FALLBACK.x - 250, y: FIRMAR_POS_FALLBACK.y - 200 },
    { t: T.confirm_arrive,           x: CONFIRM_POS_FALLBACK.x,   y: CONFIRM_POS_FALLBACK.y  },
    { t: T.confirm_click,            x: CONFIRM_POS_FALLBACK.x,   y: CONFIRM_POS_FALLBACK.y  },
    { t: T.modal_close + 0.3,        x: CONFIRM_POS_FALLBACK.x,   y: CONFIRM_POS_FALLBACK.y  },
    { t: T.doc_signature_start,      x: 1100,                     y: 850                     },
    { t: T.hold_end,                 x: 1100,                     y: 850                     },
  ]
  const clicks: ClickEvent[] = [{ t: T.firmar_click }, { t: T.confirm_click }]

  if (t >= T.modal_close + 0.4) return null
  return <Cursor stops={stops} clicks={clicks} />
}

// ── Captions ──────────────────────────────────────────────────────────────────

function Caption({ start, end, text, subtext }: { start: number; end: number; text: string; subtext?: string }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const fadeIn = 0.35, fadeOut = 0.5
        let op = 1
        if (localTime < fadeIn)              op = localTime / fadeIn
        else if (localTime > duration - fadeOut) op = (duration - localTime) / fadeOut
        return (
          <div style={{
            position: 'absolute', left: '50%', bottom: 110,
            transform: `translateX(-50%) translateY(${(1 - op) * 8}px)`,
            opacity: op,
            background: 'rgba(15, 23, 42, 0.92)', color: '#FAFAF9',
            padding: '10px 18px', borderRadius: 999,
            fontFamily: 'Epilogue', fontSize: 16, fontWeight: 500, letterSpacing: '-0.005em',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E', flexShrink: 0 }} />
            <span>{text}</span>
            {subtext && (
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#94A3B8', letterSpacing: '0.05em', marginLeft: 4 }}>
                {subtext}
              </span>
            )}
          </div>
        )
      }}
    </Sprite>
  )
}

// ── Keyframe constants ────────────────────────────────────────────────────────

const CAMERA_KEYS: CameraKf[] = [
  { t: 0,                     x: 960,  y: 540, scale: 1.0  },
  { t: T.cursor_arrive,       x: 1080, y: 600, scale: 1.15 },
  { t: T.modal_open + 0.2,    x: 960,  y: 540, scale: 1.0  },
  { t: T.draw_start - 0.2,    x: 1100, y: 540, scale: 1.04 },
  { t: T.draw_end + 0.2,      x: 1100, y: 540, scale: 1.06 },
  { t: T.confirm_click,       x: 1020, y: 560, scale: 1.05 },
  { t: T.modal_close + 0.6,   x: 960,  y: 540, scale: 1.02 },
  { t: T.stamp_appear + 0.5,  x: 960,  y: 540, scale: 1.04 },
  { t: T.hold_end,            x: 960,  y: 540, scale: 1.04 },
]

// ── Global keyframe styles ────────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes topaz-blink    { 50% { opacity: 0.2; } }
  @keyframes topaz-pulse    { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  @keyframes topaz-spin     { to { transform: rotate(360deg); } }
  @keyframes topaz-shimmer  { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @keyframes topaz-dataflow { to { background-position: 14px 0; } }
`

// ── Main exported scene ───────────────────────────────────────────────────────

export function SceneTopaz() {
  const t          = useTime()
  const docSigState = useDocSignatureState()
  const finalStamp  = t >= T.stamp_appear
  const insertedT   = Math.max(0, t - T.doc_signature_end)

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <CameraLayer keyframes={CAMERA_KEYS}>
          <PrestoScreen docSigState={docSigState} insertedT={insertedT} finalStamp={finalStamp} />
          <ModalLayer />
          <CursorLayer />
        </CameraLayer>

        {/* Captions sit outside the camera layer — unscaled */}
        <Caption start={0.4}  end={3.2}  text="Operación lista para firmar"                subtext="PRESTO · APERT-2026-04812" />
        <Caption start={4.3}  end={6.4}  text="Modal abierto · llamando integración TOPAZ" subtext="PRESTO ⇄ TOPAZ LCD"        />
        <Caption start={6.6}  end={9.2}  text="Firma en pad físico → eco en tiempo real"   subtext="STREAM · WSS · 120 pt/s"   />
        <Caption start={11.4} end={14.0} text="Firma incrustada en el documento"            subtext="SHA-256 · 8f2a…d49c"       />
        <Caption start={14.3} end={17.9} text="Anclada a la operación bancaria en el ERP"  subtext="ERP · sync OK"             />
      </div>
    </>
  )
}
