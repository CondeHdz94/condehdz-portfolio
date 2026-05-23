import React from 'react'
import { useSprite, Easing, clamp } from '../../../components/animation'
import { StepIcon } from './animMocks'

interface RoleStep {
  id: string
  label: string
  mode: 'form' | 'visual'
}
interface RoleConfig {
  id: string
  name: string
  subtitle: string
  examples: string
  accent: string
  steps: RoleStep[]
}

const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: 'rol-a',
    name: 'Role A',
    subtitle: 'intake · fills everything',
    examples: 'commercial · executive · partner',
    accent: '#818CF8',
    steps: [
      { id: 'pre-approver', label: 'Pre-approval', mode: 'form' },
      { id: 'info-client', label: 'Client info', mode: 'form' },
      { id: 'info-credit', label: 'Credit info', mode: 'form' },
      { id: 'info-contact', label: 'Contact info', mode: 'form' },
      { id: 'insurability', label: 'Insurability', mode: 'form' },
      { id: 'documents', label: 'Documents', mode: 'form' },
    ],
  },
  {
    id: 'rol-b',
    name: 'Role B',
    subtitle: 'documents · uploads files',
    examples: 'help desk · support · treasury',
    accent: '#6366F1',
    steps: [
      { id: 'info-client', label: 'Client info', mode: 'visual' },
      { id: 'info-credit', label: 'Credit info', mode: 'visual' },
      { id: 'documents', label: 'Documents', mode: 'form' },
    ],
  },
  {
    id: 'rol-c',
    name: 'Role C',
    subtitle: 'reviews · decides only',
    examples: 'analyst · approver · committee',
    accent: '#A5B4FC',
    steps: [
      { id: 'pre-approver', label: 'Pre-approval', mode: 'visual' },
      { id: 'info-client', label: 'Client info', mode: 'visual' },
      { id: 'info-credit', label: 'Credit info', mode: 'visual' },
      { id: 'insurability', label: 'Insurability', mode: 'visual' },
      { id: 'documents', label: 'Documents', mode: 'visual' },
      { id: 'decision', label: 'Decision', mode: 'form' },
    ],
  },
]

interface ContentRow { label: string; value: string }
const MODULE_CONTENT: Record<string, { form: ContentRow[]; visual: ContentRow[] }> = {
  'pre-approver': {
    form: [
      { label: 'Documento', value: '1.024.578.331' },
      { label: 'Score básico', value: 'consultando…' },
      { label: 'Listas', value: 'verifik · ofac' },
    ],
    visual: [
      { label: 'Pre-score', value: '720 · ok' },
      { label: 'Listas', value: '✓ limpio' },
      { label: 'Verifik', value: '✓' },
    ],
  },
  'info-client': {
    form: [
      { label: 'Cédula', value: '1.024.578.331' },
      { label: 'Nombre', value: 'Tatiana Avilés' },
      { label: 'Nacida', value: '14·06·1991' },
    ],
    visual: [
      { label: 'Cédula', value: '1.024.578.331' },
      { label: 'Nombre', value: 'Tatiana A.' },
      { label: 'Edad', value: '34 años' },
    ],
  },
  'info-credit': {
    form: [
      { label: 'Monto', value: '$ 28.000.000' },
      { label: 'Plazo', value: '36 meses' },
      { label: 'Marca', value: 'Toyota' },
    ],
    visual: [
      { label: 'Monto', value: '$ 28.0M' },
      { label: 'Plazo', value: '36 m' },
      { label: 'Cuota', value: '$ 1.04M' },
    ],
  },
  'info-contact': {
    form: [
      { label: 'Celular', value: '+57 312 478··' },
      { label: 'Email', value: 'tati@indu…' },
      { label: 'Ciudad', value: 'Medellín' },
    ],
    visual: [
      { label: 'Celular', value: '312 478··' },
      { label: 'Email', value: 'tati@…' },
      { label: 'Ciudad', value: 'Medellín' },
    ],
  },
  insurability: {
    form: [
      { label: 'PPI', value: 'declara ▾' },
      { label: 'Cuota', value: '$ 38.400 / mes' },
      { label: 'Salud', value: 'declara ▾' },
    ],
    visual: [
      { label: 'PPI', value: '✓ acepta' },
      { label: 'Salud', value: 'sin reservas' },
      { label: 'Cuota', value: '$ 38.4k' },
    ],
  },
  'data-authorization': {
    form: [
      { label: 'Habeas', value: 'leer ▾' },
      { label: 'Firma', value: 'pendiente' },
      { label: 'Token', value: '—' },
    ],
    visual: [
      { label: 'Habeas', value: '✓ aceptado' },
      { label: 'Firma', value: '✓ firmada' },
      { label: 'Token', value: 'fxk-93' },
    ],
  },
  documents: {
    form: [
      { label: 'CC frente', value: 'subir ↑' },
      { label: 'CC rev.', value: 'subir ↑' },
      { label: 'Desprend.', value: 'subir ↑' },
    ],
    visual: [
      { label: 'Cédula', value: '✓ verificado' },
      { label: 'Desprend.', value: '✓ 2 meses' },
      { label: 'RUT', value: '✓ vigente' },
    ],
  },
  decision: {
    form: [
      { label: 'Resultado', value: 'Aprobado ▾' },
      { label: 'Monto fin.', value: '$ 28.0M' },
      { label: 'Comentario', value: '—' },
    ],
    visual: [
      { label: 'Score', value: '742 · A−' },
      { label: 'Reglas', value: '6/6' },
      { label: 'Sugerencia', value: 'aprobar' },
    ],
  },
  default: {
    form: [
      { label: 'Campo 1', value: '—' },
      { label: 'Campo 2', value: '—' },
      { label: 'Campo 3', value: '—' },
    ],
    visual: [
      { label: 'Dato 1', value: '—' },
      { label: 'Dato 2', value: '—' },
      { label: 'Dato 3', value: '—' },
    ],
  },
}

type CardState = 'pending' | 'active' | 'done'

const EXPEDIENTE = {
  id: 'SOL-04781',
  name: 'Tatiana Avilés Restrepo',
  amount: '$ 28.0M',
  product: 'vehicle credit',
}

const LANE_TOP = 318
const LANE_GAP = 22
const CONTAINER_LEFT = 80

export function Shot5Roles() {
  const { localTime } = useSprite()
  const camScale = 0.97 + Easing.easeOutCubic(clamp(localTime / 1.5, 0, 1)) * 0.03
  const titleEntry = clamp((localTime - 0.2) / 0.6, 0, 1)

  const baseDelay = 0.5
  const laneStagger = 0.2

  const flatSteps: Array<{ roleIdx: number; stepIdx: number; step: RoleStep }> = []
  ROLE_CONFIGS.forEach((r, ri) => {
    r.steps.forEach((s, si) => flatSteps.push({ roleIdx: ri, stepIdx: si, step: s }))
  })
  const TOTAL_STEPS = flatSteps.length

  const TRAVEL_START = 2.5
  const STEP_DUR = 0.25
  const cursorReal = (localTime - TRAVEL_START) / STEP_DUR
  const cursorIdx = Math.floor(cursorReal)
  const completed = cursorIdx >= TOTAL_STEPS

  const cardStates: CardState[][] = ROLE_CONFIGS.map((r) => r.steps.map(() => 'pending' as CardState))
  for (let g = 0; g <= Math.min(TOTAL_STEPS - 1, cursorIdx); g++) {
    const { roleIdx, stepIdx } = flatSteps[g]
    cardStates[roleIdx][stepIdx] = g === cursorIdx ? 'active' : 'done'
  }
  if (completed) {
    cardStates.forEach((arr) => arr.forEach((_, i) => (arr[i] = 'done')))
  }

  const laneStatuses: Array<'waiting' | 'active' | 'done'> = ROLE_CONFIGS.map((_, ri) => {
    if (completed) return 'done'
    if (cursorIdx < 0) return 'waiting'
    const activeStep = flatSteps[Math.min(cursorIdx, TOTAL_STEPS - 1)]
    if (activeStep.roleIdx === ri) return 'active'
    const lastIdxForRole = flatSteps
      .map((s, i) => (s.roleIdx === ri ? i : -1))
      .filter((i) => i >= 0)
      .pop()
    if (lastIdxForRole != null && cursorIdx > lastIdxForRole) return 'done'
    return 'waiting'
  })

  const tickMinute = 41 + (cursorIdx < 0 ? 0 : cursorIdx)
  const tickerStr = formatTicker(tickMinute)
  const activeRoleTicker = !completed && cursorIdx >= 0 && cursorIdx < TOTAL_STEPS ? tickerStr : null

  const cursorEnter = clamp((localTime - 1.6) / 0.6, 0, 1)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 35%, #0e1a3a 0%, #060b1c 70%, #03060f 100%)',
        overflow: 'hidden',
      }}
    >
      <div className="dotgrid" />

      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 130,
          opacity: titleEntry,
          transform: `translateY(${(1 - titleEntry) * 10}px)`,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#818CF8',
            marginBottom: 8,
          }}
        >
          07 · una solicitud · tres roles · una ruta
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 50,
            color: '#ECECEA',
            lineHeight: 1.0,
            maxWidth: 1700,
            letterSpacing: '-0.02em',
          }}
        >
          Same file. <span style={{ fontStyle: 'italic' }}>Every role.</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 13,
            color: 'rgba(236,236,234,0.55)',
            marginTop: 12,
            letterSpacing: '0.04em',
          }}
        >
          rutas visibles en paralelo · baton-pass entre roles · <span style={{ color: '#818CF8' }}>form</span> = captura ·{' '}
          <span style={{ color: 'rgba(236,236,234,0.78)' }}>visual</span> = revisión
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: CONTAINER_LEFT,
          right: 80,
          top: LANE_TOP,
          transform: `scale(${camScale})`,
          transformOrigin: 'top center',
          display: 'flex',
          flexDirection: 'column',
          gap: LANE_GAP,
        }}
      >
        {ROLE_CONFIGS.map((role, i) => (
          <JourneyLane
            key={role.id}
            role={role}
            time={localTime}
            startDelay={baseDelay + i * laneStagger}
            cardStates={cardStates[i]}
            laneStatus={laneStatuses[i]}
            ticker={laneStatuses[i] === 'active' ? activeRoleTicker : null}
          />
        ))}
      </div>

      <ExpedienteIdentityChip enter={cursorEnter} ticker={tickerStr} completed={completed} />

      {completed && <AprobadoSeal time={localTime} completedAt={TRAVEL_START + TOTAL_STEPS * STEP_DUR} />}

      <div className="vignette" />
    </div>
  )
}

function formatTicker(minute: number) {
  const h = 10 + Math.floor(minute / 60)
  const m = minute % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

function JourneyLane({
  role,
  time,
  startDelay,
  cardStates,
  laneStatus,
  ticker,
}: {
  role: RoleConfig
  time: number
  startDelay: number
  cardStates: CardState[]
  laneStatus: 'waiting' | 'active' | 'done'
  ticker: string | null
}) {
  const lanePresent = clamp((time - startDelay) / 0.5, 0, 1)
  const cardStagger = 0.1
  const cardDur = 0.4

  return (
    <div style={{ position: 'relative', opacity: lanePresent }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: role.accent,
            opacity: 0.9,
            fontWeight: 600,
          }}
        >
          Rol
        </div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, color: '#ECECEA', lineHeight: 1, fontStyle: 'italic' }}>
          {role.name}
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(236,236,234,0.5)', marginLeft: 2, letterSpacing: '0.02em' }}>
          · {role.subtitle}
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'rgba(236,236,234,0.32)', marginLeft: 10, letterSpacing: '0.06em', fontStyle: 'italic' }}>
          ej. {role.examples}
        </div>
        <div style={{ flex: 1 }} />
        <LaneStatusBadge status={laneStatus} accent={role.accent} ticker={ticker} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {role.steps.map((step, i) => {
          const entry = clamp((time - startDelay - i * cardStagger) / cardDur, 0, 1)
          const cardState = cardStates[i] || 'pending'
          return (
            <React.Fragment key={i}>
              <RoleModuleCard step={step} entryProgress={entry} accent={role.accent} state={cardState} highlight={cardState === 'active'} />
              {i < role.steps.length - 1 && (
                <ChevronConnect entry={entry} active={cardState === 'done'} accent={role.accent} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

function RoleModuleCard({
  step,
  entryProgress,
  accent = '#818CF8',
  highlight = false,
  state = 'pending',
}: {
  step: RoleStep
  entryProgress: number
  accent?: string
  highlight?: boolean
  state?: CardState
}) {
  const opacity = clamp(entryProgress, 0, 1)
  const ty = (1 - opacity) * -14
  const scale = 0.92 + 0.08 * Easing.easeOutBack(opacity)

  const isForm = step.mode === 'form'
  const content = MODULE_CONTENT[step.id] || MODULE_CONTENT.default
  const isDone = state === 'done'
  const isActive = state === 'active' || highlight

  return (
    <div
      style={{
        width: 168,
        height: 116,
        background: isForm ? 'linear-gradient(180deg, #101a3a 0%, #0c1330 100%)' : '#080d1f',
        border: isActive
          ? `1.5px solid ${accent}`
          : isDone
            ? '1px solid rgba(95,212,154,0.32)'
            : isForm
              ? `1px solid ${accent}66`
              : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '10px 12px',
        opacity,
        transform: `translateY(${ty}px) scale(${scale})`,
        transformOrigin: 'center',
        boxShadow: isActive
          ? `0 0 28px ${accent}cc, 0 6px 18px ${accent}55, inset 0 0 0 1px ${accent}55`
          : isDone
            ? '0 4px 10px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(95,212,154,0.12)'
            : isForm
              ? `0 6px 18px rgba(79,70,229,0.22), inset 0 0 0 1px ${accent}22`
              : '0 4px 10px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        flexShrink: 0,
        willChange: 'transform, opacity',
        position: 'relative',
        transition: 'border 220ms, box-shadow 220ms, opacity 220ms',
        filter: isDone ? 'saturate(0.8)' : 'none',
      }}
    >
      {isDone && (
        <div
          style={{
            position: 'absolute',
            right: -6,
            top: -6,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: '#5fd49a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(95,212,154,0.6), 0 2px 6px rgba(0,0,0,0.3)',
            zIndex: 4,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 5l2 2 4-4" stroke="#06291d" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: 11,
          border: `1.5px solid ${accent}aa`,
          pointerEvents: 'none',
          opacity: isActive ? 1 : 0,
          transition: 'opacity 320ms ease-out',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <StepIcon id={step.id} size={14} color={isForm ? '#ECECEA' : 'rgba(236,236,234,0.7)'} />
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isForm ? '#ECECEA' : 'rgba(236,236,234,0.78)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
          }}
        >
          {step.label}
        </div>
        <ModeBadge mode={step.mode} accent={accent} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {isForm ? <FormBody fields={content.form} /> : <VisualBody rows={content.visual} />}
      </div>
    </div>
  )
}

function ModeBadge({ mode, accent }: { mode: 'form' | 'visual'; accent: string }) {
  const isForm = mode === 'form'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 6px',
        borderRadius: 3,
        background: isForm ? `${accent}26` : 'rgba(255,255,255,0.05)',
        border: isForm ? `1px solid ${accent}80` : '1px solid rgba(255,255,255,0.12)',
        fontFamily: 'var(--f-mono)',
        fontSize: 8.5,
        color: isForm ? accent : 'rgba(236,236,234,0.55)',
        letterSpacing: '0.06em',
        flexShrink: 0,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          background: isForm ? accent : 'rgba(236,236,234,0.55)',
          boxShadow: isForm ? `0 0 5px ${accent}` : 'none',
        }}
      />
      <span>{isForm ? 'form' : 'visual'}</span>
    </div>
  )
}

function FormBody({ fields }: { fields: ContentRow[] }) {
  return (
    <>
      {fields.map((f, i) => (
        <div key={i}>
          <div
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 7.5,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(122,130,148,0.85)',
              marginBottom: 2,
            }}
          >
            {f.label}
          </div>
          <div
            style={{
              height: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 3,
              padding: '0 5px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 9,
              color: 'rgba(236,236,234,0.88)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {f.value}
          </div>
        </div>
      ))}
    </>
  )
}

function VisualBody({ rows }: { rows: ContentRow[] }) {
  return (
    <>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 7.5,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(122,130,148,0.85)',
              flexShrink: 0,
            }}
          >
            {r.label}
          </span>
          <span
            style={{
              fontSize: 9.5,
              color: '#ECECEA',
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
              textAlign: 'right',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {r.value}
          </span>
        </div>
      ))}
    </>
  )
}

function LaneStatusBadge({
  status,
  accent,
  ticker,
}: {
  status: 'waiting' | 'active' | 'done'
  accent: string
  ticker: string | null
}) {
  const isActive = status === 'active'
  const isDone = status === 'done'
  const dotColor = isActive ? accent : isDone ? '#5fd49a' : 'rgba(236,236,234,0.4)'
  const label = isActive ? `gestionando · ${ticker || 'ahora'}` : isDone ? 'completado' : 'esperando turno'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 11px',
        background: isActive ? `${accent}22` : isDone ? 'rgba(95,212,154,0.12)' : 'rgba(255,255,255,0.03)',
        border: isActive
          ? `1px solid ${accent}80`
          : isDone
            ? '1px solid rgba(95,212,154,0.4)'
            : '1px solid rgba(255,255,255,0.1)',
        borderRadius: 999,
        fontFamily: 'var(--f-mono)',
        fontSize: 10,
        color: isActive ? accent : isDone ? '#5fd49a' : 'rgba(236,236,234,0.55)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
        transition: 'background 320ms, border 320ms, color 320ms',
        minHeight: 22,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          background: dotColor,
          boxShadow: isActive || isDone ? `0 0 8px ${dotColor}` : 'none',
          transition: 'background 320ms, box-shadow 320ms',
        }}
      />
      {label}
    </div>
  )
}

function ChevronConnect({ entry, active, accent }: { entry: number; active: boolean; accent: string }) {
  return (
    <div
      style={{
        width: 22,
        height: 116,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: clamp((entry - 0.3) * 2, 0, 1),
        flexShrink: 0,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M3 2l4 4-4 4"
          stroke={active ? `${accent}cc` : 'rgba(129,140,248,0.6)'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function ExpedienteIdentityChip({ enter, ticker, completed }: { enter: number; ticker: string; completed: boolean }) {
  if (enter <= 0) return null
  const tx = (1 - enter) * 24
  return (
    <div
      style={{
        position: 'absolute',
        right: 80,
        top: 140,
        opacity: enter,
        transform: `translateX(${tx}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 20px',
        background: 'linear-gradient(180deg, #101a3a 0%, #0a1227 100%)',
        border: completed ? '1px solid rgba(95,212,154,0.5)' : '1px solid rgba(129,140,248,0.55)',
        borderRadius: 10,
        boxShadow: completed
          ? '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(95,212,154,0.3)'
          : '0 20px 50px rgba(0,0,0,0.5), 0 0 36px rgba(129,140,248,0.35)',
        zIndex: 60,
        pointerEvents: 'none',
        transition: 'border 250ms, box-shadow 250ms',
      }}
    >
      <div
        style={{
          padding: '4px 10px',
          background: completed ? 'rgba(95,212,154,0.2)' : 'rgba(79,70,229,0.2)',
          border: completed ? '1px solid rgba(95,212,154,0.5)' : '1px solid rgba(129,140,248,0.5)',
          borderRadius: 999,
          fontFamily: 'var(--f-mono)',
          fontSize: 10,
          color: completed ? '#5fd49a' : '#818CF8',
          letterSpacing: '0.08em',
          fontWeight: 600,
        }}
      >
        file
      </div>
      <div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'rgba(236,236,234,0.55)', letterSpacing: '0.06em' }}>
          {EXPEDIENTE.id}
        </div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 19, color: '#ECECEA', lineHeight: 1.1, marginTop: 2, fontStyle: 'italic' }}>
          {EXPEDIENTE.name}
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'rgba(236,236,234,0.5)', letterSpacing: '0.04em', marginTop: 2 }}>
          {EXPEDIENTE.amount} · {EXPEDIENTE.product}
        </div>
      </div>
      <div style={{ width: 1, height: 38, background: 'rgba(255,255,255,0.1)' }} />
      <div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(236,236,234,0.45)',
          }}
        >
          {completed ? 'completado' : 'hora'}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 16,
            color: completed ? '#5fd49a' : '#818CF8',
            fontVariantNumeric: 'tabular-nums',
            marginTop: 2,
            fontWeight: 600,
          }}
        >
          {ticker}
        </div>
      </div>
    </div>
  )
}

function AprobadoSeal({ time, completedAt = 6.25 }: { time: number; completedAt?: number }) {
  const t = clamp((time - completedAt) / 0.45, 0, 1)
  const scale = 0.6 + Easing.easeOutBack(t) * 0.4
  return (
    <div
      style={{
        position: 'absolute',
        right: 80,
        bottom: 140,
        transform: `scale(${scale})`,
        opacity: t,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 24px',
        background: 'rgba(95,212,154,0.15)',
        border: '1.5px solid rgba(95,212,154,0.55)',
        borderRadius: 8,
        boxShadow: '0 16px 50px rgba(95,212,154,0.3), 0 0 50px rgba(95,212,154,0.4)',
        pointerEvents: 'none',
        zIndex: 70,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          background: '#5fd49a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 18 18">
          <path d="M3 9l4 4 8-8" stroke="#06291d" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(95,212,154,0.75)',
          }}
        >
          decisión
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 28,
            color: '#ECECEA',
            lineHeight: 1,
            marginTop: 2,
            fontStyle: 'italic',
          }}
        >
          Aprobado
        </div>
      </div>
    </div>
  )
}
