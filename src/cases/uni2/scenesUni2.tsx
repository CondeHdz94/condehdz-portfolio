import React from 'react'
import { Sprite, useTime, clamp, Easing } from '../../components/animation'

// ── Palette ──────────────────────────────────────────────────────────────────

const INDIGO     = '#4F46E5'
const INDIGO_LT  = 'rgba(79, 70, 229, 0.09)'
const INDIGO_BD  = 'rgba(79, 70, 229, 0.22)'
const SIDEBAR_BG = '#1E1B4B'
const SIDEBAR_AC = '#312E81'
const SIDEBAR_TX = '#C7D2FE'
const SIDEBAR_MT = '#818CF8'
const CANVAS_BG  = '#F0EEE8'
const WHITE      = '#FFFFFF'
const BORDER     = '#E4E2DC'
const TEXT       = '#1C1917'
const MUTED      = '#78716C'
const GREEN      = '#16A34A'
const SANS       = "'Epilogue', system-ui, sans-serif"
const MONO       = "'IBM Plex Mono', ui-monospace, monospace"

// ── Timing ───────────────────────────────────────────────────────────────────

const T = {
  sidebar_in: 0.20,
  main_in:    0.50,
  nav_active: 0.90,
  stepper_in: 1.30,
  card_in:    1.70,

  // Step 1 — Client info
  f1s: 2.50, f1e: 4.00,
  f2s: 4.30, f2e: 5.70,
  f3s: 6.00, f3e: 7.10,

  next1:  7.80,   // next button click
  s2_in:  8.60,   // step 2 card enters

  // Step 2 — Credit info
  f4s:  9.20, f4e: 10.70,
  f5s: 11.00, f5e: 12.10,
  f6s: 12.40, f6e: 13.40,

  // Mode switch
  mode_start: 15.00,
  mode_done:  16.20,

  end: 28.00,
}

// ── Step labels ───────────────────────────────────────────────────────────────

const STEPS = ['Cliente', 'Crédito', 'Contacto', 'Documentos', 'Revisión']

// ── Field data ────────────────────────────────────────────────────────────────

const S1 = [
  { label: 'Nombre completo',        value: 'María Alejandra Ospina Ruiz' },
  { label: 'Documento de identidad', value: 'CC  1018 554 221' },
  { label: 'Fecha de nacimiento',    value: '12 / 04 / 1985' },
]

const S2 = [
  { label: 'Monto solicitado', value: '$ 3.500.000' },
  { label: 'Plazo',            value: '18 meses' },
  { label: 'Producto',         value: 'Microcrédito Rural' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function typedFrac(t: number, s: number, e: number): number {
  if (t <= s) return 0
  if (t >= e) return 1
  const p = (t - s) / (e - s)
  return p < 0.18 ? 0 : clamp((p - 0.18) / 0.65, 0, 1)
}

function isFocused(t: number, s: number, e: number): boolean {
  return t >= s && t < e
}

function enter(t: number, start: number, dur = 0.45): number {
  return Easing.easeOutCubic(clamp((t - start) / dur, 0, 1))
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Sidebar({ op, navActive }: { op: number; navActive: boolean }) {
  const items = [
    { lbl: 'Inicio',          active: false, sub: false },
    { lbl: 'Solicitudes',     active: true,  sub: false },
    { lbl: 'Nueva solicitud', active: navActive, sub: true },
    { lbl: 'En proceso',      active: false, sub: true },
    { lbl: 'Aprobadas',       active: false, sub: true },
    { lbl: 'Usuarios',        active: false, sub: false },
    { lbl: 'Reportes',        active: false, sub: false },
  ]

  return (
    <div style={{
      position: 'absolute', left: 30, top: 30,
      width: 264, height: 1020,
      background: SIDEBAR_BG, borderRadius: 14,
      opacity: op, display: 'flex', flexDirection: 'column',
      boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 22px 22px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: INDIGO,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: SANS, fontWeight: 800, fontSize: 15, color: WHITE,
          flexShrink: 0,
        }}>U2</div>
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 14, color: WHITE }}>Uni2Lite</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: SIDEBAR_MT, marginTop: 1 }}>Services · v1.0</div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '18px 10px' }}>
        {items.map(item => (
          <div key={item.lbl} style={{
            padding: item.sub ? '7px 10px 7px 28px' : '10px 12px',
            marginBottom: 2, borderRadius: 8,
            background: item.active ? SIDEBAR_AC : 'transparent',
            fontFamily: SANS,
            fontSize: item.sub ? 12 : 13,
            fontWeight: item.active ? 600 : 400,
            color: item.active ? WHITE : (item.sub ? SIDEBAR_MT : SIDEBAR_TX),
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {item.sub && (
              <span style={{
                width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                background: item.active ? INDIGO : 'rgba(255,255,255,0.18)',
              }} />
            )}
            {item.lbl}
          </div>
        ))}
      </div>

      {/* User */}
      <div style={{
        padding: '16px 18px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#4338CA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: SANS, fontWeight: 700, fontSize: 13, color: WHITE, flexShrink: 0,
        }}>A</div>
        <div>
          <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: WHITE }}>Analista 01</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: SIDEBAR_MT }}>ejecutivo</div>
        </div>
      </div>
    </div>
  )
}

function AppHeader({ isConsult }: { isConsult: boolean }) {
  return (
    <div style={{
      height: 60, display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 28px',
      background: WHITE, borderBottom: `1px solid ${BORDER}`,
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: SANS, fontSize: 13, color: MUTED }}>Solicitudes</span>
      <span style={{ color: BORDER, fontSize: 18, lineHeight: 1 }}>›</span>
      <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: TEXT }}>Nueva solicitud</span>
      <div style={{ flex: 1 }} />
      {/* Mode badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '7px 14px', borderRadius: 999,
        background: isConsult ? 'rgba(0,0,0,0.03)' : INDIGO_LT,
        border: `1px solid ${isConsult ? BORDER : INDIGO_BD}`,
        fontFamily: MONO, fontSize: 11, fontWeight: 700,
        color: isConsult ? MUTED : INDIGO,
        letterSpacing: '0.05em',
        transition: 'background 0.5s ease, border-color 0.5s ease, color 0.5s ease',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: isConsult ? MUTED : INDIGO,
          transition: 'background 0.5s ease',
          flexShrink: 0,
        }} />
        {isConsult ? 'CONSULTA' : 'EDICIÓN'}
      </div>
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: '#E0E7FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: SANS, fontWeight: 700, fontSize: 14, color: INDIGO,
      }}>A</div>
    </div>
  )
}

function StepBar({ op, activeStep }: { op: number; activeStep: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '18px 28px', borderBottom: `1px solid ${BORDER}`,
      background: WHITE, opacity: op, flexShrink: 0,
    }}>
      {STEPS.map((s, i) => {
        const done   = i < activeStep
        const active = i === activeStep
        const last   = i === STEPS.length - 1
        return (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done ? GREEN : (active ? INDIGO : 'transparent'),
                border: `2px solid ${done ? GREEN : (active ? INDIGO : BORDER)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: MONO, fontSize: 11, fontWeight: 700,
                color: (done || active) ? WHITE : MUTED,
                transition: 'background 0.4s ease, border-color 0.4s ease',
                flexShrink: 0,
              }}>
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2.5 6.5l3 3 5-5" stroke={WHITE} strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : String(i + 1).padStart(2, '0')}
              </div>
              <span style={{
                fontFamily: SANS, fontSize: 12,
                fontWeight: active ? 600 : 400,
                color: done ? GREEN : (active ? TEXT : MUTED),
                whiteSpace: 'nowrap',
                transition: 'color 0.4s ease',
              }}>{s}</span>
            </div>
            {!last && (
              <div style={{
                flex: 1, height: 1.5, minWidth: 24,
                background: done ? GREEN : BORDER,
                margin: '0 10px',
                transition: 'background 0.4s ease',
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function FormField({ label, value, typed = 0, focused = false, readOnly = false }: {
  label: string; value: string; typed?: number; focused?: boolean; readOnly?: boolean
}) {
  const shown = readOnly ? value : value.slice(0, Math.floor(value.length * typed))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{
        fontFamily: SANS, fontSize: 12, fontWeight: 500,
        color: readOnly ? '#A8A29E' : MUTED, letterSpacing: '0.01em',
      }}>
        {label}
        {!readOnly && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
      </label>
      <div style={{
        background: readOnly ? '#F9F7F5' : WHITE,
        border: `1.5px solid ${focused ? INDIGO : (readOnly ? 'transparent' : BORDER)}`,
        borderRadius: 9,
        padding: '12px 15px',
        fontFamily: SANS, fontSize: 14, color: readOnly ? MUTED : TEXT,
        minHeight: 46, display: 'flex', alignItems: 'center',
        boxShadow: focused ? `0 0 0 3px ${INDIGO_LT}` : 'none',
        transition: 'border-color 150ms, box-shadow 150ms, background 350ms, color 350ms',
      }}>
        <span>{shown}</span>
        {focused && typed < 1 && (
          <span style={{
            display: 'inline-block', width: 2, height: 16,
            background: INDIGO, marginLeft: 2,
            animation: 'u2caret 0.8s steps(2) infinite',
          }} />
        )}
      </div>
    </div>
  )
}

function FormCard({
  op, tx, step, fields, typedArr, focusedArr, isConsult, showNext, nextClicking,
}: {
  op: number; tx: number; step: number
  fields: { label: string; value: string }[]
  typedArr: number[]; focusedArr: boolean[]
  isConsult: boolean; showNext: boolean; nextClicking: boolean
}) {
  const titles = ['Información del cliente', 'Información del crédito', 'Contacto']

  return (
    <div style={{ padding: '28px 240px', opacity: op, transform: `translateX(${tx}px)` }}>
      <div style={{
        background: WHITE, borderRadius: 14,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{
          padding: '22px 28px 18px', borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 10, color: MUTED,
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5,
            }}>
              paso {String(step + 1).padStart(2, '0')} de {STEPS.length}
            </div>
            <h2 style={{
              fontFamily: SANS, fontSize: 22, fontWeight: 700,
              color: TEXT, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2,
            }}>
              {titles[step] ?? 'Información'}
            </h2>
          </div>
          {isConsult && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 7,
              background: '#FEFCE8', border: '1px solid #FEF08A',
              fontFamily: MONO, fontSize: 10, fontWeight: 700,
              color: '#854D0E', letterSpacing: '0.04em',
              flexShrink: 0, marginTop: 4,
            }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1.5" y="5" width="8" height="5.5" rx="1.2" fill="#854D0E" opacity="0.22" />
                <path d="M3.5 5V4a2 2 0 014 0v1" stroke="#854D0E" strokeWidth="1.4"
                  fill="none" strokeLinecap="round" />
              </svg>
              SOLO LECTURA
            </div>
          )}
        </div>

        {/* Fields */}
        <div style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {fields.map((f, i) => (
            <FormField
              key={f.label}
              label={f.label}
              value={f.value}
              typed={typedArr[i] ?? 0}
              focused={focusedArr[i] ?? false}
              readOnly={isConsult}
            />
          ))}
        </div>

        {/* Actions */}
        {!isConsult && (
          <div style={{
            padding: '14px 28px 24px',
            borderTop: `1px solid ${BORDER}`,
            display: 'flex', justifyContent: 'flex-end', gap: 10,
          }}>
            <button style={{
              padding: '11px 22px', borderRadius: 8,
              border: `1px solid ${BORDER}`, background: WHITE,
              fontFamily: SANS, fontSize: 13, fontWeight: 500,
              color: MUTED, cursor: 'default',
            }}>Anterior</button>
            <button style={{
              padding: '11px 26px', borderRadius: 8, border: 'none',
              background: showNext ? INDIGO : '#C7D2FE',
              color: WHITE, fontFamily: SANS, fontSize: 13, fontWeight: 600,
              cursor: 'default',
              boxShadow: showNext ? '0 4px 16px rgba(79, 70, 229, 0.35)' : 'none',
              transform: nextClicking ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.12s ease, background 0.3s ease, box-shadow 0.3s ease',
            }}>Siguiente →</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Caption({ start, end, text, sub }: {
  start: number; end: number; text: string; sub?: string
}) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const fi = 0.35, fo = 0.45
        const op = localTime < fi
          ? localTime / fi
          : localTime > duration - fo
            ? (duration - localTime) / fo
            : 1
        return (
          <div style={{
            position: 'absolute', left: '50%', bottom: 56,
            transform: `translateX(-50%) translateY(${(1 - op) * 8}px)`,
            opacity: op,
            background: 'rgba(15,23,42,0.90)', color: '#F8FAFC',
            padding: '10px 20px', borderRadius: 999,
            fontFamily: SANS, fontSize: 16, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 8px 28px rgba(0,0,0,0.25)', whiteSpace: 'nowrap',
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

// ── Keyframes ─────────────────────────────────────────────────────────────────

const CSS = `@keyframes u2caret { 50% { opacity: 0; } }`

// ── Main scene ────────────────────────────────────────────────────────────────

export function SceneUni2() {
  const t = useTime()

  // Shell entrance
  const sidebarOp = enter(t, T.sidebar_in, 0.5)
  const mainOp    = enter(t, T.main_in, 0.5)
  const navActive = t >= T.nav_active
  const stepperOp = enter(t, T.stepper_in, 0.4)

  // Step logic
  const activeStep = t < T.next1 ? 0 : 1
  const isStep2    = t >= T.s2_in

  // Card entrance / exit
  let cardOp: number, cardTx: number
  if (!isStep2) {
    const fadeIn  = enter(t, T.card_in, 0.5)
    const fadeOut = t >= T.next1 ? 1 - clamp((t - T.next1) / 0.45, 0, 1) : 1
    cardOp = fadeIn * fadeOut
    cardTx = 0
  } else {
    const p = enter(t, T.s2_in, 0.5)
    cardOp  = p
    cardTx  = (1 - p) * 44
  }

  // Field state
  const typedArr:   number[]  = []
  const focusedArr: boolean[] = []

  if (!isStep2) {
    typedArr[0]   = typedFrac(t, T.f1s, T.f1e)
    typedArr[1]   = typedFrac(t, T.f2s, T.f2e)
    typedArr[2]   = typedFrac(t, T.f3s, T.f3e)
    focusedArr[0] = isFocused(t, T.f1s, T.f1e)
    focusedArr[1] = isFocused(t, T.f2s, T.f2e)
    focusedArr[2] = isFocused(t, T.f3s, T.f3e)
  } else {
    typedArr[0]   = typedFrac(t, T.f4s, T.f4e)
    typedArr[1]   = typedFrac(t, T.f5s, T.f5e)
    typedArr[2]   = typedFrac(t, T.f6s, T.f6e)
    focusedArr[0] = isFocused(t, T.f4s, T.f4e)
    focusedArr[1] = isFocused(t, T.f5s, T.f5e)
    focusedArr[2] = isFocused(t, T.f6s, T.f6e)
  }

  const showNext    = isStep2 ? t >= T.f6e : (t >= T.f3e && t < T.next1)
  const nextClicking = t >= T.next1 && t < T.next1 + 0.3
  const isConsult   = t >= T.mode_done

  return (
    <>
      <style>{CSS}</style>
      <div style={{ position: 'absolute', inset: 0, background: CANVAS_BG, fontFamily: SANS }}>

        <Sidebar op={sidebarOp} navActive={navActive} />

        {/* Main app window */}
        <div style={{
          position: 'absolute',
          left: 326, top: 30, right: 30, bottom: 30,
          background: WHITE, borderRadius: 14,
          border: `1px solid ${BORDER}`,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          opacity: mainOp,
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>
          <AppHeader isConsult={isConsult} />
          <StepBar op={stepperOp} activeStep={activeStep} />

          {/* Form area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
            <FormCard
              op={cardOp}
              tx={cardTx}
              step={isStep2 ? 1 : 0}
              fields={isStep2 ? S2 : S1}
              typedArr={typedArr}
              focusedArr={focusedArr}
              isConsult={isConsult}
              showNext={showNext}
              nextClicking={nextClicking}
            />
          </div>
        </div>

        {/* Captions */}
        <Caption start={0.50} end={2.40}  text="Uni2Lite · plataforma de crédito"         sub="REACT 18 · VITE · TYPESCRIPT"    />
        <Caption start={2.60} end={7.70}  text="Paso 01 — información del cliente"         sub="REACT HOOK FORM · ZOD"           />
        <Caption start={7.90} end={10.40} text="Validación por paso, avance controlado"    sub="ZUSTAND STEPPER STORE"          />
        <Caption start={10.60} end={14.20} text="Paso 02 — información del crédito"        sub="FIELDCONFIG[] · DECLARATIVO"    />
        <Caption start={15.00} end={20.00} text="Modo consulta — mismo flujo, prop mode"   sub="MODE='CONSULT'"                 />
        <Caption start={20.50} end={27.50} text="Cero duplicación de árbol de componentes" sub="UNI2LITE · 2025"               />
      </div>
    </>
  )
}
