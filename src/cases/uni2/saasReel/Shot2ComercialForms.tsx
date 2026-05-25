import React from 'react'
import { useSpriteEffect, clamp } from '../../../components/animation'
import { AcmeMark, INFO_CREDIT_FIELDS, type InfoCreditField } from './animMocks'

type MaterializationStyle = 'flow' | 'typed' | 'instant'

// ── Timing constants (local time within the shot) ────────────────────────────

const T_HEADER_START   = 0
const T_HEADER_DUR     = 0.55
const T_CODE_START     = 0.1
const T_CODE_DUR       = 0.6
const T_ROW_BASE       = 0.7
const T_ROW_STAGGER    = 0.16
const T_ROW_DUR        = 0.5
const T_PULSE_START    = 1.9
const T_PIPE_A_START   = 1.7
const T_PIPE_B_START   = 2.1
const T_PIPE_C_START   = 2.5
const T_PIPE_DUR       = 0.5
const T_FRAME_START    = 1.6
const T_FRAME_DUR      = 0.6
const T_TYPED_BASE     = 2.6
const T_TYPED_STAGGER  = 0.22
const T_TYPED_DUR      = 0.65
const T_INSTANT_START  = 3.4
const T_INSTANT_DUR    = 0.45
const T_VALID_START    = 4.2
const T_VALID_DUR      = 0.5
const T_FILTER_ENTER   = 4.9
const T_FILTER_BASE    = 5.1
const T_FILTER_STAGGER = 0.18
const T_FILTER_DUR     = 0.5
const T_EXT_ENTER      = 6.2
const T_EXT_BASE       = 6.5
const T_EXT_STAGGER    = 0.22
const T_EXT_DUR        = 0.5

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

// ── Main shot ────────────────────────────────────────────────────────────────

export const Shot2ComercialForms = React.memo(function Shot2ComercialForms({
  materializationStyle = 'typed',
}: { materializationStyle?: MaterializationStyle }) {
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

      <Shot2Header />

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
          <CodeEditor />
        </div>

        <div style={{ flex: '0 0 280px', position: 'relative', height: 540, display: 'flex' }}>
          <PipelineArrows />
        </div>

        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
          <div style={{ flex: '1 1 auto', minHeight: 0 }}>
            <RenderedForm style={materializationStyle} />
          </div>
          <FiltersAndChannelsStrip />
        </div>
      </div>

      {materializationStyle === 'flow' && <FlowTokensLayer />}


      <div className="vignette" />
    </div>
  )
})

// ── Shot2 header ─────────────────────────────────────────────────────────────

function Shot2Header() {
  const divRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const o = clamp((lt - T_HEADER_START) / T_HEADER_DUR, 0, 1)
    if (!divRef.current) return
    divRef.current.style.opacity = String(o)
    divRef.current.style.transform = `translateY(${(1 - o) * 12}px)`
  })

  return (
    <div
      ref={divRef}
      style={{ position: 'absolute', left: 80, top: 110, opacity: 0, transform: 'translateY(12px)', maxWidth: 1100 }}
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
        02 · intake · declarative system
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
        <span style={{ fontStyle: 'italic' }}>Declarative</span> forms.
      </div>
    </div>
  )
}

// ── Code editor ──────────────────────────────────────────────────────────────

const Kw = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#c084fc' }}>{children}</span>
const Va = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#7dd3fc' }}>{children}</span>
const Ty = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#5fd49a' }}>{children}</span>
const Str = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#fbbf24' }}>{children}</span>

function CodeLine({ n, text }: { n: number; text: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'pre', minHeight: 22 }}>
      <span style={{ color: '#3a4561', width: 22, textAlign: 'right', fontSize: 11, flexShrink: 0 }}>{n}</span>
      <span>{text}</span>
    </div>
  )
}

function CodeEditor() {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const rowRefs = React.useRef<(HTMLDivElement | null)[]>(
    Array.from({ length: INFO_CREDIT_FIELDS.length }, () => null),
  )

  useSpriteEffect((lt) => {
    const o = clamp((lt - T_CODE_START) / T_CODE_DUR, 0, 1)
    if (editorRef.current) {
      editorRef.current.style.opacity = String(o)
      editorRef.current.style.transform = `translateX(${(1 - o) * -30}px)`
    }
    rowRefs.current.forEach((el, i) => {
      if (!el) return
      const op = clamp((lt - T_ROW_BASE - i * T_ROW_STAGGER) / T_ROW_DUR, 0, 1)
      el.style.opacity = String(op)
      el.style.transform = `translateX(${(1 - op) * -6}px)`
    })
  })

  return (
    <div
      ref={editorRef}
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #0c1228 0%, #080d1f 100%)',
        border: '1px solid rgba(129,140,248,0.18)',
        borderRadius: 10,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)',
        opacity: 0,
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

        {INFO_CREDIT_FIELDS.map((f, i) => (
          <div
            key={f.name}
            ref={(el) => { rowRefs.current[i] = el }}
            style={{ opacity: 0 }}
          >
            <CodeLine
              n={5 + i * 4 + 0}
              text={
                <>
                  {'    '}
                  {'{'} <Va>name</Va>: <Str>"{f.name}"</Str>, <Va>label</Va>: <Str>"{f.label}"</Str>,
                </>
              }
            />
            <CodeLine
              n={5 + i * 4 + 1}
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
                text={
                  <>
                    {'      '}
                    <Va>url</Va>: <Str>"{f.url}"</Str>,
                  </>
                }
              />
            )}
            <CodeLine n={5 + i * 4 + 3} text={<>{'    '}{'}'},</>} />
          </div>
        ))}
        <CodeLine n={99} text={<>{'  '}],</>} />
        <CodeLine n={100} text={<>{'}'}];</>} />
      </div>
    </div>
  )
}

// ── Pipeline arrows ──────────────────────────────────────────────────────────

function PipelineArrows() {
  const pulseLineRef = React.useRef<HTMLDivElement>(null)
  const chipARef = React.useRef<HTMLDivElement>(null)
  const chipBRef = React.useRef<HTMLDivElement>(null)
  const chipCRef = React.useRef<HTMLDivElement>(null)
  const chipZodRef = React.useRef<HTMLDivElement>(null)
  const chipUseFormRef = React.useRef<HTMLDivElement>(null)
  const chipContainerRef = React.useRef<HTMLDivElement>(null)
  const arrARef = React.useRef<HTMLDivElement>(null)
  const arrBRef = React.useRef<HTMLDivElement>(null)
  const arrCRef = React.useRef<HTMLDivElement>(null)
  const arrDRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const pulse = clamp((lt - T_PULSE_START) / 0.7, 0, 1)
    const a = clamp((lt - T_PIPE_A_START) / T_PIPE_DUR, 0, 1)
    const b = clamp((lt - T_PIPE_B_START) / T_PIPE_DUR, 0, 1)
    const c = clamp((lt - T_PIPE_C_START) / T_PIPE_DUR, 0, 1)

    if (pulseLineRef.current) pulseLineRef.current.style.opacity = String(pulse)

    const applyChip = (el: HTMLDivElement | null, op: number, _highlight: boolean) => {
      if (!el) return
      el.style.opacity = String(op)
      el.style.transform = `translateY(${(1 - op) * -10}px)`
    }
    applyChip(chipARef.current, a, false)
    applyChip(chipBRef.current, b, true)
    applyChip(chipZodRef.current, Math.min(b, 1), false)
    applyChip(chipCRef.current, c, false)
    applyChip(chipUseFormRef.current, c, false)
    applyChip(chipContainerRef.current, c, false)

    const applyArr = (el: HTMLDivElement | null, op: number) => {
      if (!el) return
      el.style.opacity = String(op * 0.9)
    }
    applyArr(arrARef.current, a)
    applyArr(arrBRef.current, b)
    applyArr(arrCRef.current, c)
    applyArr(arrDRef.current, c)
  })

  const chipStyle = (highlight?: boolean): React.CSSProperties => ({
    padding: highlight ? '7px 14px' : '6px 12px',
    background: highlight ? 'rgba(79,70,229,0.18)' : 'rgba(255,255,255,0.04)',
    border: highlight ? '1px solid rgba(129,140,248,0.55)' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 999,
    fontFamily: 'var(--f-mono)',
    fontSize: highlight ? 13 : 12,
    letterSpacing: '0.04em',
    color: highlight ? '#ECECEA' : 'rgba(236,236,234,0.78)',
    fontWeight: highlight ? 600 : 500,
    opacity: 0,
    boxShadow: highlight ? '0 0 22px rgba(129,140,248,0.35)' : 'none',
    whiteSpace: 'nowrap' as const,
  })

  const arrowEl = (ref: React.RefObject<HTMLDivElement | null>) => (
    <div ref={ref} style={{ opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
        <path d="M7 1v18M2 14l5 5 5-5" stroke="rgba(129,140,248,0.7)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )

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
        position: 'relative',
      }}
    >
      <div ref={chipARef} style={chipStyle()}>FormSection[]</div>
      {arrowEl(arrARef)}
      <div ref={chipBRef} style={chipStyle(true)}>buildZodSchema()</div>
      {arrowEl(arrBRef)}
      <div ref={chipZodRef} style={chipStyle()}>zodResolver()</div>
      {arrowEl(arrCRef)}
      <div ref={chipCRef} style={chipStyle()}>useForm()</div>
      {arrowEl(arrDRef)}
      <div ref={chipContainerRef} style={chipStyle()}>{'<FormContainer/>'}</div>

      <div
        ref={pulseLineRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: 30,
          bottom: 30,
          width: 1,
          marginLeft: -0.5,
          background: 'linear-gradient(180deg, rgba(129,140,248,0) 0%, rgba(129,140,248,0.35) 50%, rgba(129,140,248,0) 100%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ── Rendered form ────────────────────────────────────────────────────────────

function RenderedForm({ style }: { style: MaterializationStyle }) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const validRef = React.useRef<HTMLDivElement>(null)

  const fieldStartTimes = React.useMemo(() =>
    INFO_CREDIT_FIELDS.map((_, i) => {
      if (style === 'instant') return T_INSTANT_START
      if (style === 'flow') {
        const TOKEN_BASE = 1.95, TOKEN_STAGGER = 0.32, TOKEN_DUR = 0.72
        return TOKEN_BASE + i * TOKEN_STAGGER + TOKEN_DUR
      }
      return T_TYPED_BASE + i * T_TYPED_STAGGER
    }),
    [style],
  )

  const fieldDurs = React.useMemo(() =>
    INFO_CREDIT_FIELDS.map(() => {
      if (style === 'instant') return T_INSTANT_DUR
      if (style === 'flow') return 0.35
      return T_TYPED_DUR
    }),
    [style],
  )

  useSpriteEffect((lt) => {
    const o = clamp((lt - T_FRAME_START) / T_FRAME_DUR, 0, 1)
    if (frameRef.current) {
      frameRef.current.style.opacity = String(o)
      frameRef.current.style.transform = `translateX(${(1 - o) * 30}px)`
    }
    const v = clamp((lt - T_VALID_START) / T_VALID_DUR, 0, 1)
    if (validRef.current) {
      validRef.current.style.opacity = String(v)
      validRef.current.style.transform = `translateY(${(1 - v) * 8}px)`
    }
  })

  return (
    <div
      ref={frameRef}
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #0e1530 0%, #0a1027 100%)',
        border: '1px solid rgba(129,140,248,0.18)',
        borderRadius: 10,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        opacity: 0,
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
            <RenderedField key={f.name} field={f} startAt={fieldStartTimes[i]} dur={fieldDurs[i]} style={style} />
          ))}
        </div>

        <div
          ref={validRef}
          style={{
            marginTop: 22,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 14px',
            background: 'rgba(95,212,154,0.08)',
            border: '1px solid rgba(95,212,154,0.3)',
            borderRadius: 8,
            opacity: 0,
            transform: 'translateY(8px)',
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
              <path d="M2 5l2 2 4-4" stroke="#06291d" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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

const RenderedField = React.memo(function RenderedField({
  field,
  startAt,
  dur,
  style,
}: {
  field: InfoCreditField
  startAt: number
  dur: number
  style: MaterializationStyle
}) {
  const outerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLDivElement>(null)
  const textRef = React.useRef<HTMLSpanElement>(null)

  useSpriteEffect((lt) => {
    const op = clamp((lt - startAt) / dur, 0, 1)
    const filled = style === 'typed' ? op > 0.05 : op > 0.4
    const slide = style === 'flow' ? 0 : (1 - op) * 4

    if (outerRef.current) {
      outerRef.current.style.transform = `translateY(${slide}px)`
    }

    if (inputRef.current) {
      inputRef.current.style.background = filled ? 'rgba(79,70,229,0.06)' : 'rgba(255,255,255,0.02)'
      inputRef.current.style.border = filled ? '1px solid rgba(129,140,248,0.32)' : '1px solid rgba(255,255,255,0.08)'
      const landGlow = style !== 'typed' ? Math.max(0, 1 - Math.abs(op - 0.5) * 4) * 0.6 : 0
      inputRef.current.style.boxShadow = filled
        ? `0 0 0 3px rgba(79,70,229,0.06)${landGlow ? `, 0 0 ${20 * landGlow}px rgba(129,140,248,${0.45 * landGlow})` : ''}`
        : 'none'
    }

    if (textRef.current) {
      let display = '—'
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
      textRef.current.textContent = display
    }
  })

  return (
    <div ref={outerRef}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.08em', color: '#7a8294', textTransform: 'uppercase' }}>
          {field.label}
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'rgba(129,140,248,0.7)', letterSpacing: '0.04em' }}>
          {field.type}
        </div>
      </div>
      <div
        ref={inputRef}
        style={{
          height: 34,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6,
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: field.type === 'number' ? 'var(--f-mono)' : 'var(--f-ui)',
          fontSize: 13,
          color: '#ECECEA',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span ref={textRef}>—</span>
      </div>
    </div>
  )
})

// ── Filters and channels strip ───────────────────────────────────────────────

function FiltersAndChannelsStrip() {
  const outerRef = React.useRef<HTMLDivElement>(null)
  const externalRef = React.useRef<HTMLDivElement>(null)
  const filterCountRef = React.useRef<HTMLSpanElement>(null)

  useSpriteEffect((lt) => {
    const enter = clamp((lt - T_FILTER_ENTER) / 0.5, 0, 1)
    if (outerRef.current) {
      outerRef.current.style.opacity = String(enter)
      outerRef.current.style.transform = `translateY(${(1 - enter) * 20}px)`
      outerRef.current.style.display = enter <= 0 ? 'none' : 'flex'
    }
    const extEnter = clamp((lt - T_EXT_ENTER) / 0.5, 0, 1)
    if (externalRef.current) {
      externalRef.current.style.opacity = String(extEnter)
      externalRef.current.style.transform = `translateY(${(1 - extEnter) * 14}px)`
    }
    if (filterCountRef.current) {
      const done = FILTER_CHECKS.filter((_, i) => clamp((lt - T_FILTER_BASE - i * T_FILTER_STAGGER) / T_FILTER_DUR, 0, 1) >= 0.95).length
      filterCountRef.current.textContent = `${done}/${FILTER_CHECKS.length}`
    }
  })

  return (
    <div
      ref={outerRef}
      style={{ flex: '0 0 152px', display: 'none', gap: 14, opacity: 0 }}
    >
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
          <span ref={filterCountRef} style={{ color: 'rgba(95,212,154,0.45)', marginLeft: 'auto', fontSize: 9 }}>
            0/{FILTER_CHECKS.length}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {FILTER_CHECKS.map((f, i) => (
            <FilterChip key={f.id} filter={f} startAt={T_FILTER_BASE + i * T_FILTER_STAGGER} />
          ))}
        </div>
      </div>

      <div
        ref={externalRef}
        style={{
          flex: '1 1 40%',
          background: 'linear-gradient(180deg, rgba(129,140,248,0.05) 0%, rgba(129,140,248,0.02) 100%)',
          border: '1px solid rgba(129,140,248,0.18)',
          borderRadius: 10,
          padding: '12px 16px',
          opacity: 0,
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
            <ChannelChip key={c.id} channel={c} startAt={T_EXT_BASE + i * T_EXT_STAGGER} />
          ))}
        </div>
      </div>
    </div>
  )
}

const FilterChip = React.memo(function FilterChip({
  filter,
  startAt,
}: {
  filter: { id: string; label: string; detail: string }
  startAt: number
}) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const iconBgRef = React.useRef<HTMLDivElement>(null)
  const checkPathRef = React.useRef<SVGPathElement>(null)

  useSpriteEffect((lt) => {
    const op = clamp((lt - startAt) / T_FILTER_DUR, 0, 1)
    const done = op >= 0.95
    if (!divRef.current) return
    divRef.current.style.opacity = String(op)
    divRef.current.style.transform = `translateX(${(1 - op) * -8}px)`
    divRef.current.style.background = done ? 'rgba(95,212,154,0.1)' : 'rgba(255,255,255,0.02)'
    divRef.current.style.border = done ? '1px solid rgba(95,212,154,0.4)' : '1px solid rgba(255,255,255,0.06)'
    if (iconBgRef.current) {
      iconBgRef.current.style.background = done ? '#5fd49a' : 'rgba(255,255,255,0.06)'
      iconBgRef.current.style.boxShadow = done ? '0 0 8px rgba(95,212,154,0.5)' : 'none'
    }
    if (checkPathRef.current) {
      checkPathRef.current.style.opacity = String(clamp((op - 0.3) * 2, 0, 1))
      checkPathRef.current.setAttribute('stroke', done ? '#06291d' : '#7a8294')
    }
  })

  return (
    <div
      ref={divRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
        opacity: 0,
      }}
    >
      <div
        ref={iconBgRef}
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="9" height="9" viewBox="0 0 10 10">
          <path
            ref={checkPathRef}
            d="M2 5l2 2 4-4"
            stroke="#7a8294"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0 }}
          />
        </svg>
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
})

const ChannelChip = React.memo(function ChannelChip({
  channel,
  startAt,
}: {
  channel: { id: string; label: string; detail: string; glyph: string }
  startAt: number
}) {
  const divRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const op = clamp((lt - startAt) / T_EXT_DUR, 0, 1)
    if (!divRef.current) return
    divRef.current.style.opacity = String(op)
    divRef.current.style.transform = `translateX(${(1 - op) * 8}px)`
  })

  return (
    <div
      ref={divRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        background: 'rgba(129,140,248,0.06)',
        border: '1px solid rgba(129,140,248,0.25)',
        borderRadius: 6,
        opacity: 0,
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
            <path d="M2 4a1 1 0 011-1h8a1 1 0 011 1v5a1 1 0 01-1 1H6l-3 2v-2H3a1 1 0 01-1-1V4z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 11c1.5-1 2-2 4-2s2.5 2 4 1 2-3 2-3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
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
})

// ── Flow tokens layer (only used with materializationStyle='flow') ───────────

function FlowTokensLayer() {
  const TOKEN_BASE = 1.95
  const TOKEN_STAGGER = 0.32
  const TOKEN_DUR = 0.72

  const tokenRefs = React.useRef<(HTMLDivElement | null)[]>(
    Array.from({ length: INFO_CREDIT_FIELDS.length }, () => null),
  )

  useSpriteEffect((lt) => {
    INFO_CREDIT_FIELDS.forEach((_field, i) => {
      const el = tokenRefs.current[i]
      if (!el) return
      const traj = FLOW_TRAJECTORIES[i]
      if (!traj) return
      const t = clamp((lt - (TOKEN_BASE + i * TOKEN_STAGGER)) / TOKEN_DUR, 0, 1)
      if (t <= 0) {
        el.style.display = 'none'
        return
      }
      el.style.display = ''
      const afterLand = clamp((lt - (TOKEN_BASE + i * TOKEN_STAGGER + TOKEN_DUR)) / 0.18, 0, 1)
      const visible = t < 1 ? t : 1 - afterLand
      if (visible <= 0.02) {
        el.style.opacity = '0'
        return
      }
      const eased = t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      const x = traj.startX + (traj.endX - traj.startX) * eased
      const y = traj.startY + (traj.endY - traj.startY) * eased - 60 * Math.sin(t * Math.PI)
      const scale = 0.85 + eased * 0.15 - afterLand * 0.2
      el.style.opacity = String(visible)
      el.style.left = `${x}px`
      el.style.top = `${y}px`
      el.style.transform = `translate(-50%, -50%) scale(${scale})`
    })
  })

  return (
    <div
      style={{ position: 'absolute', left: 80, right: 80, top: 230, bottom: 220, pointerEvents: 'none', zIndex: 6 }}
    >
      {INFO_CREDIT_FIELDS.map((field, i) => (
        <div
          key={field.name}
          ref={(el) => { tokenRefs.current[i] = el }}
          style={{
            position: 'absolute',
            display: 'none',
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
          }}
        >
          <span style={{ color: 'rgba(129,140,248,0.95)' }}>{field.name}</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ opacity: 0.7 }}>
            <path d="M1 4h9M7 1l3 3-3 3" stroke="#ECECEA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: 600 }}>{field.display}</span>
        </div>
      ))}
    </div>
  )
}
