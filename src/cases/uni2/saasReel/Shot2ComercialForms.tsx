import React from 'react'
import { useSprite, Easing, clamp } from '../../../components/animation'
import { Particles, AcmeMark, INFO_CREDIT_FIELDS, type InfoCreditField } from './animMocks'

const TOKEN_BASE = 1.95
const TOKEN_STAGGER = 0.32
const TOKEN_DUR = 0.72

const FLOW_TRAJECTORIES = [
  { startX: 320, startY: 245, endX: 1130, endY: 130 },
  { startX: 320, startY: 325, endX: 1525, endY: 130 },
  { startX: 320, startY: 405, endX: 1130, endY: 202 },
  { startX: 320, startY: 470, endX: 1525, endY: 202 },
  { startX: 320, startY: 530, endX: 1130, endY: 274 },
]

const FILTER_CHECKS = [
  { id: 'pre-approver', label: 'pre-aprobador', detail: 'política · listas' },
  { id: 'verifik', label: 'verifik', detail: 'identidad · biom.' },
  { id: 'simit', label: 'simit', detail: 'comparendos' },
  { id: 'listas', label: 'listas', detail: 'ofac · pep · clinton' },
]

const EXTERNAL_CHANNELS = [
  { id: 'sms-wsp', label: 'sms · whatsapp', detail: 'otp · códigos · confirmación', glyph: 'chat' },
  { id: 'firma', label: 'plataforma aliada', detail: 'firma digital · autorización', glyph: 'sign' },
]

type MaterializationStyle = 'flow' | 'typed' | 'instant'

export function Shot2ComercialForms({ materializationStyle = 'typed' as MaterializationStyle }) {
  const { localTime } = useSprite()

  const codeEnter = clamp((localTime - 0.1) / 0.6, 0, 1)
  const configRows = INFO_CREDIT_FIELDS.map((_, i) => clamp((localTime - 0.7 - i * 0.16) / 0.5, 0, 1))
  const pipelinePulse = clamp((localTime - 1.9) / 0.7, 0, 1)
  const formFrame = clamp((localTime - 1.6) / 0.6, 0, 1)

  let formFields: number[]
  if (materializationStyle === 'instant') {
    const allFill = clamp((localTime - 3.4) / 0.45, 0, 1)
    formFields = INFO_CREDIT_FIELDS.map(() => allFill)
  } else if (materializationStyle === 'flow') {
    formFields = INFO_CREDIT_FIELDS.map((_, i) => {
      const landTime = TOKEN_BASE + i * TOKEN_STAGGER + TOKEN_DUR
      return clamp((localTime - landTime) / 0.35, 0, 1)
    })
  } else {
    formFields = INFO_CREDIT_FIELDS.map((_, i) => clamp((localTime - 2.6 - i * 0.22) / 0.65, 0, 1))
  }

  const validationStamp = clamp((localTime - 4.2) / 0.5, 0, 1)
  const headerEnter = clamp(localTime / 0.55, 0, 1)

  const filterStripEnter = clamp((localTime - 4.9) / 0.5, 0, 1)
  const filterChips = FILTER_CHECKS.map((_, i) => clamp((localTime - 5.1 - i * 0.18) / 0.5, 0, 1))
  const externalEnter = clamp((localTime - 6.2) / 0.5, 0, 1)
  const externalChips = EXTERNAL_CHANNELS.map((_, i) => clamp((localTime - 6.5 - i * 0.22) / 0.5, 0, 1))

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, #0e1a3a 0%, #060b1c 60%, #03060f 100%)',
        overflow: 'hidden',
      }}
    >
      <div className="dotgrid" />

      <Shot2Header progress={headerEnter} />

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 230,
          bottom: 220,
          display: 'flex',
          alignItems: 'center',
          gap: 0,
        }}
      >
        <div style={{ flex: '0 0 640px', position: 'relative' }}>
          <CodeEditor enter={codeEnter} rows={configRows} />
        </div>

        <div style={{ flex: '0 0 280px', position: 'relative', height: 540, display: 'flex' }}>
          <PipelineArrows pulse={pipelinePulse} time={localTime} />
        </div>

        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
          <div style={{ flex: '1 1 auto', minHeight: 0 }}>
            <RenderedForm frame={formFrame} fields={formFields} style={materializationStyle} validation={validationStamp} />
          </div>
          <FiltersAndChannelsStrip
            enter={filterStripEnter}
            filterChips={filterChips}
            externalEnter={externalEnter}
            externalChips={externalChips}
          />
        </div>
      </div>

      {materializationStyle === 'flow' && <FlowTokensLayer time={localTime} />}

      <Particles count={18} localTime={localTime} seed={4221} />
      <div className="vignette" />
    </div>
  )
}

function Shot2Header({ progress }: { progress: number }) {
  const o = progress
  const ty = (1 - o) * 12
  return (
    <div style={{ position: 'absolute', left: 80, top: 110, opacity: o, transform: `translateY(${ty}px)`, maxWidth: 1100 }}>
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
        02 · captura · sistema declarativo
      </div>
      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 56,
          color: '#ECECEA',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
        }}
      >
        Forms <span style={{ fontStyle: 'italic' }}>declarativos.</span>
      </div>
    </div>
  )
}

const Kw = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#c084fc' }}>{children}</span>
const Va = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#7dd3fc' }}>{children}</span>
const Ty = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#5fd49a' }}>{children}</span>
const Str = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#fbbf24' }}>{children}</span>

function CodeLine({ n, opacity = 1, text }: { n: number; opacity?: number; text: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, opacity, whiteSpace: 'pre', minHeight: 22 }}>
      <span style={{ color: '#3a4561', width: 22, textAlign: 'right', fontSize: 11, flexShrink: 0 }}>{n}</span>
      <span>{text}</span>
    </div>
  )
}

function CodeEditor({ enter, rows }: { enter: number; rows: number[] }) {
  const o = enter
  const tx = (1 - o) * -30

  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #0c1228 0%, #080d1f 100%)',
        border: '1px solid rgba(129,140,248,0.18)',
        borderRadius: 10,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)',
        opacity: o,
        transform: `translateX(${tx}px)`,
        overflow: 'hidden',
        fontFamily: 'var(--f-mono)',
        fontSize: 13.5,
        lineHeight: 1.55,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: 5, background: '#ff5f57' }} />
        <div style={{ width: 9, height: 9, borderRadius: 5, background: '#febc2e' }} />
        <div style={{ width: 9, height: 9, borderRadius: 5, background: '#28c840' }} />
        <div style={{ marginLeft: 14, fontSize: 11, letterSpacing: '0.04em', color: '#7a8294' }}>
          src/steps/info-credit/config/fields.InfoCreditForm.ts
        </div>
      </div>

      <div style={{ padding: '16px 18px 18px', color: '#d3d8e6', minHeight: 460 }}>
        <CodeLine n={1} text={<><Kw>import</Kw> {'{ '}<Ty>FormSection</Ty>{' }'} <Kw>from</Kw> <Str>"@/types/types.fields"</Str>;</>} />
        <CodeLine n={2} text={<>&nbsp;</>} />
        <CodeLine n={3} text={<><Kw>export const</Kw> <Va>infoCreditFields</Va>: <Ty>FormSection</Ty>[] = [{'{'}</>} />
        <CodeLine n={4} text={<>{'  '}<Va>fields</Va>: [</>} />

        {INFO_CREDIT_FIELDS.map((f, i) => {
          const op = rows[i]
          const slide = (1 - op) * -6
          return (
            <div key={f.name} style={{ opacity: op, transform: `translateX(${slide}px)`, transition: 'none' }}>
              <CodeLine
                n={5 + i * 4 + 0}
                opacity={op}
                text={
                  <>
                    {'    '}
                    {'{'} <Va>name</Va>: <Str>"{f.name}"</Str>, <Va>label</Va>: <Str>"{f.label}"</Str>,
                  </>
                }
              />
              <CodeLine
                n={5 + i * 4 + 1}
                opacity={op}
                text={
                  <>
                    {'      '}
                    <Va>type</Va>: <Str>"{f.type}"</Str>
                    {f.validation ? (
                      <>
                        , <Va>validation</Va>: {'{'} <Va>required</Va>: <Str>"{f.validation.required}"</Str> {'}'}
                      </>
                    ) : null}
                    {f.url ? <>,</> : null}
                  </>
                }
              />
              {f.url && (
                <CodeLine
                  n={5 + i * 4 + 2}
                  opacity={op}
                  text={
                    <>
                      {'      '}
                      <Va>url</Va>: <Str>"{f.url}"</Str>,
                    </>
                  }
                />
              )}
              <CodeLine n={5 + i * 4 + 3} opacity={op} text={<>{'    '}{'}'},</>} />
            </div>
          )
        })}
        <CodeLine n={99} text={<>{'  '}],</>} />
        <CodeLine n={100} text={<>{'}'}];</>} />
      </div>
    </div>
  )
}

function PipelineArrows({ pulse, time }: { pulse: number; time: number }) {
  const chip = (delay: number) => clamp((time - 1.7 - delay) / 0.5, 0, 1)
  const a = chip(0.0)
  const b = chip(0.4)
  const c = chip(0.8)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '20px 0',
      }}
    >
      <PipelineChip label="FormSection[]" op={a} mono />
      <PipelineArrow op={a} />
      <PipelineChip label="buildZodSchema()" op={b} highlight />
      <PipelineArrow op={b} />
      <PipelineChip label="zodResolver()" op={Math.min(b, 1)} />
      <PipelineArrow op={c} />
      <PipelineChip label="useForm()" op={c} />
      <PipelineArrow op={c} />
      <PipelineChip label="<FormContainer/>" op={c} mono />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 30,
          bottom: 30,
          width: 1,
          marginLeft: -0.5,
          background:
            'linear-gradient(180deg, rgba(129,140,248,0) 0%, rgba(129,140,248,0.35) 50%, rgba(129,140,248,0) 100%)',
          opacity: pulse,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function PipelineChip({ label, op, mono = true, highlight }: { label: string; op: number; mono?: boolean; highlight?: boolean }) {
  const slide = (1 - op) * -10
  return (
    <div
      style={{
        padding: highlight ? '7px 14px' : '6px 12px',
        background: highlight ? 'rgba(79,70,229,0.18)' : 'rgba(255,255,255,0.04)',
        border: highlight ? '1px solid rgba(129,140,248,0.55)' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: 999,
        fontFamily: mono ? 'var(--f-mono)' : 'var(--f-ui)',
        fontSize: highlight ? 13 : 12,
        letterSpacing: '0.04em',
        color: highlight ? '#ECECEA' : 'rgba(236,236,234,0.78)',
        fontWeight: highlight ? 600 : 500,
        opacity: op,
        transform: `translateY(${slide}px)`,
        boxShadow: highlight ? '0 0 22px rgba(129,140,248,0.35)' : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  )
}

function PipelineArrow({ op }: { op: number }) {
  return (
    <div style={{ opacity: op * 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
        <path
          d="M7 1v18M2 14l5 5 5-5"
          stroke="rgba(129,140,248,0.7)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function RenderedForm({
  frame,
  fields,
  style,
  validation,
}: {
  frame: number
  fields: number[]
  style: MaterializationStyle
  validation: number
}) {
  const o = frame
  const tx = (1 - o) * 30

  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #0e1530 0%, #0a1027 100%)',
        border: '1px solid rgba(129,140,248,0.18)',
        borderRadius: 10,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        opacity: o,
        transform: `translateX(${tx}px)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        <AcmeMark size={14} color="#818CF8" />
        <div style={{ fontSize: 11, letterSpacing: '0.08em', color: '#ECECEA', fontWeight: 600 }}>
          ACME · originación / info crédito
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 10, color: '#7a8294', fontFamily: 'var(--f-mono)' }}>
          paso 3 · borrador
        </div>
      </div>

      <div style={{ padding: '22px 26px 26px' }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            color: '#5a637a',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          info crédito · sección
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 26,
            color: '#ECECEA',
            fontWeight: 400,
            lineHeight: 1.0,
            marginBottom: 22,
          }}
        >
          Datos del vehículo
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 20px' }}>
          {INFO_CREDIT_FIELDS.map((f, i) => (
            <RenderedField key={f.name} field={f} op={fields[i]} style={style} />
          ))}
        </div>

        <div
          style={{
            marginTop: 22,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 14px',
            background: 'rgba(95,212,154,0.08)',
            border: '1px solid rgba(95,212,154,0.3)',
            borderRadius: 8,
            opacity: validation,
            transform: `translateY(${(1 - validation) * 8}px)`,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: '#5fd49a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path
                d="M2 5l2 2 4-4"
                stroke="#06291d"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--f-mono)', fontSize: 11, color: '#ECECEA', letterSpacing: '0.04em' }}>
            <span style={{ color: '#5fd49a' }}>zod</span>
            <span style={{ color: '#7a8294' }}>
              {' '}
              · validación en línea · spanish error map · {INFO_CREDIT_FIELDS.length}/5 campos
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RenderedField({
  field,
  op,
  style,
}: {
  field: InfoCreditField
  op: number
  style: MaterializationStyle
}) {
  let display: string = '—'
  if (op > 0.05) {
    if (style === 'typed') {
      const target = field.display || ''
      const charsVisible = Math.floor(target.length * clamp(op * 1.25, 0, 1))
      display = target.slice(0, charsVisible) + (charsVisible < target.length ? '|' : '')
    } else if (style === 'flow') {
      display = field.display || '—'
    } else {
      display = op > 0.3 ? field.display || '—' : '—'
    }
  }

  const filled = style === 'typed' ? op > 0.05 : op > 0.4
  const slide = style === 'flow' ? 0 : (1 - op) * 4
  const landGlow = style !== 'typed' ? Math.max(0, 1 - Math.abs(op - 0.5) * 4) * 0.6 : 0

  return (
    <div style={{ opacity: 1, transform: `translateY(${slide}px)` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            color: '#7a8294',
            textTransform: 'uppercase',
          }}
        >
          {field.label}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            color: 'rgba(129,140,248,0.7)',
            letterSpacing: '0.04em',
          }}
        >
          {field.type}
        </div>
      </div>
      <div
        style={{
          height: 34,
          background: filled ? 'rgba(79,70,229,0.06)' : 'rgba(255,255,255,0.02)',
          border: filled ? '1px solid rgba(129,140,248,0.32)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6,
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: field.type === 'number' ? 'var(--f-mono)' : 'var(--f-ui)',
          fontSize: 13,
          color: '#ECECEA',
          fontVariantNumeric: 'tabular-nums',
          boxShadow: filled
            ? `0 0 0 3px rgba(79,70,229,0.06)${landGlow ? `, 0 0 ${20 * landGlow}px rgba(129,140,248,${0.45 * landGlow})` : ''}`
            : 'none',
          transition: 'border 220ms, background 220ms',
        }}
      >
        {display}
      </div>
    </div>
  )
}

function FlowTokensLayer({ time }: { time: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: 230,
        bottom: 220,
        pointerEvents: 'none',
        zIndex: 6,
      }}
    >
      {INFO_CREDIT_FIELDS.map((field, i) => {
        const traj = FLOW_TRAJECTORIES[i]
        if (!traj) return null
        const t = clamp((time - (TOKEN_BASE + i * TOKEN_STAGGER)) / TOKEN_DUR, 0, 1)
        if (t <= 0) return null
        const afterLand = clamp((time - (TOKEN_BASE + i * TOKEN_STAGGER + TOKEN_DUR)) / 0.18, 0, 1)
        const visible = t < 1 ? t * 1.0 : 1 - afterLand
        if (visible <= 0.02) return null

        const eased = Easing.easeInOutCubic(t)
        const x = traj.startX + (traj.endX - traj.startX) * eased
        const y = traj.startY + (traj.endY - traj.startY) * eased - 60 * Math.sin(t * Math.PI)
        const scale = 0.85 + eased * 0.15 - afterLand * 0.2

        return <FlowToken key={field.name} field={field} x={x} y={y} scale={scale} opacity={visible} />
      })}
    </div>
  )
}

function FlowToken({
  field,
  x,
  y,
  scale,
  opacity,
}: {
  field: InfoCreditField
  x: number
  y: number
  scale: number
  opacity: number
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: 'linear-gradient(180deg, rgba(79,70,229,0.35) 0%, rgba(20,40,100,0.5) 100%)',
        border: '1px solid rgba(129,140,248,0.85)',
        borderRadius: 999,
        boxShadow: '0 12px 28px rgba(79,70,229,0.45), 0 0 24px rgba(129,140,248,0.7)',
        fontFamily: 'var(--f-mono)',
        fontSize: 11,
        color: '#ECECEA',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        willChange: 'transform, opacity',
      }}
    >
      <span style={{ color: 'rgba(129,140,248,0.95)' }}>{field.name}</span>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ opacity: 0.7 }}>
        <path d="M1 4h9M7 1l3 3-3 3" stroke="#ECECEA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontWeight: 600 }}>{field.display}</span>
    </div>
  )
}

function FiltersAndChannelsStrip({
  enter,
  filterChips,
  externalEnter,
  externalChips,
}: {
  enter: number
  filterChips: number[]
  externalEnter: number
  externalChips: number[]
}) {
  if (enter <= 0) return null
  const tx = (1 - enter) * 20
  return (
    <div style={{ flex: '0 0 152px', display: 'flex', gap: 14, opacity: enter, transform: `translateY(${tx}px)` }}>
      <div
        style={{
          flex: '1 1 60%',
          background: 'linear-gradient(180deg, rgba(95,212,154,0.05) 0%, rgba(95,212,154,0.02) 100%)',
          border: '1px solid rgba(95,212,154,0.18)',
          borderRadius: 10,
          padding: '12px 16px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(95,212,154,0.9)',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: '#5fd49a',
              boxShadow: '0 0 6px rgba(95,212,154,0.8)',
              display: 'inline-block',
            }}
          />
          filtros automáticos
          <span style={{ color: 'rgba(95,212,154,0.45)', marginLeft: 'auto', fontSize: 9 }}>
            {filterChips.filter((c) => c >= 0.95).length}/{FILTER_CHECKS.length}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {FILTER_CHECKS.map((f, i) => (
            <FilterChip key={f.id} filter={f} op={filterChips[i]} />
          ))}
        </div>
      </div>

      <div
        style={{
          flex: '1 1 40%',
          background: 'linear-gradient(180deg, rgba(129,140,248,0.05) 0%, rgba(129,140,248,0.02) 100%)',
          border: '1px solid rgba(129,140,248,0.18)',
          borderRadius: 10,
          padding: '12px 16px',
          opacity: externalEnter,
          transform: `translateY(${(1 - externalEnter) * 14}px)`,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(129,140,248,0.9)',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M5.5 1.5l-3 3M5.5 1.5l3 3M5.5 1.5v9"
              stroke="#818CF8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="rotate(45 6 6)"
            />
          </svg>
          canales externos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {EXTERNAL_CHANNELS.map((c, i) => (
            <ChannelChip key={c.id} channel={c} op={externalChips[i]} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterChip({ filter, op }: { filter: { id: string; label: string; detail: string }; op: number }) {
  const done = op >= 0.95
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        background: done ? 'rgba(95,212,154,0.1)' : 'rgba(255,255,255,0.02)',
        border: done ? '1px solid rgba(95,212,154,0.4)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
        opacity: op,
        transform: `translateX(${(1 - op) * -8}px)`,
        transition: 'background 200ms, border 200ms',
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: done ? '#5fd49a' : 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: done ? '0 0 8px rgba(95,212,154,0.5)' : 'none',
        }}
      >
        {op > 0.15 && (
          <svg width="9" height="9" viewBox="0 0 10 10" style={{ opacity: clamp((op - 0.3) * 2, 0, 1) }}>
            <path
              d="M2 5l2 2 4-4"
              stroke={done ? '#06291d' : '#7a8294'}
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 11,
            color: done ? '#ECECEA' : 'rgba(236,236,234,0.65)',
            letterSpacing: '0.04em',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {filter.label}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            color: 'rgba(122,130,148,0.85)',
            letterSpacing: '0.04em',
            marginTop: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {filter.detail}
        </div>
      </div>
    </div>
  )
}

function ChannelChip({
  channel,
  op,
}: {
  channel: { id: string; label: string; detail: string; glyph: string }
  op: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        background: 'rgba(129,140,248,0.06)',
        border: '1px solid rgba(129,140,248,0.25)',
        borderRadius: 6,
        opacity: op,
        transform: `translateX(${(1 - op) * 8}px)`,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 5,
          background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 10px rgba(129,140,248,0.4)',
        }}
      >
        {channel.glyph === 'chat' ? (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 4a1 1 0 011-1h8a1 1 0 011 1v5a1 1 0 01-1 1H6l-3 2v-2H3a1 1 0 01-1-1V4z"
              stroke="#fff"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 11c1.5-1 2-2 4-2s2.5 2 4 1 2-3 2-3"
              stroke="#fff"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M2 13h10" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 11,
            color: '#ECECEA',
            letterSpacing: '0.04em',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {channel.label}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            color: 'rgba(122,130,148,0.85)',
            letterSpacing: '0.04em',
            marginTop: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {channel.detail}
        </div>
      </div>
    </div>
  )
}
