import React from 'react'
import { useSpriteEffect, Easing, clamp } from '../../../components/animation'
import { AcmeMark } from './animMocks'

export const AnalystApp = React.memo(function AnalystApp() {
  const urlRef = React.useRef<HTMLSpanElement>(null)
  const inboxPaneRef = React.useRef<HTMLDivElement>(null)

  const [rowSelected, setRowSelected] = React.useState(false)
  const [showDetail, setShowDetail] = React.useState(false)
  const [approved, setApproved] = React.useState(false)

  const prevRef = React.useRef({ rs: false, sd: false, ap: false, urlShown: false })

  useSpriteEffect((lt) => {
    const detailOpen = clamp((lt - 2.4) / 1.2, 0, 1)
    const eased = Easing.easeOutCubic(detailOpen)

    if (inboxPaneRef.current) {
      inboxPaneRef.current.style.opacity = String(1 - detailOpen)
      inboxPaneRef.current.style.transform = `scale(${1 - detailOpen * 0.03})`
      inboxPaneRef.current.style.pointerEvents = detailOpen > 0.5 ? 'none' : 'auto'
    }

    const newRs = lt > 2.0
    const newSd = lt > 2.4
    const newAp = clamp((lt - 8.6) / 0.4, 0, 1) > 0.5
    const newUrlShown = lt > 3.0
    const prev = prevRef.current

    if (newRs !== prev.rs || newSd !== prev.sd || newAp !== prev.ap) {
      prevRef.current = { ...prev, rs: newRs, sd: newSd, ap: newAp }
      setRowSelected(newRs)
      setShowDetail(newSd)
      setApproved(newAp)
    }

    if (newUrlShown !== prev.urlShown) {
      prevRef.current = { ...prevRef.current, urlShown: newUrlShown }
      if (urlRef.current) {
        urlRef.current.textContent = newUrlShown
          ? 'acme.uni2.io / originación / SOL-2026-04781'
          : 'acme.uni2.io / originación'
      }
    }

    void eased
  })

  return (
    <div
      style={{
        width: 1280,
        height: 760,
        background: '#0e1530',
        borderRadius: 14,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), 0 60px 160px rgba(0,0,0,0.7), 0 0 100px rgba(129,140,248,0.15)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--f-ui)',
      }}
    >
      <div
        style={{
          height: 40,
          background: '#080d1f',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 8,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ff5f57' }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: '#febc2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: '#28c840' }} />
        <span ref={urlRef} style={{ marginLeft: 20, fontSize: 12, color: '#5a637a', fontFamily: 'var(--f-mono)' }}>
          acme.uni2.io / originación
        </span>
      </div>

      <div style={{ display: 'flex', height: 'calc(100% - 40px)' }}>
        <Sidebar rowSelected={rowSelected} />

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div
            ref={inboxPaneRef}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 1,
              transform: 'scale(1)',
              transformOrigin: 'center',
              pointerEvents: 'auto',
            }}
          >
            <InboxView rowSelected={rowSelected} />
          </div>

          {showDetail && <DetailPanel approved={approved} />}
        </div>
      </div>
    </div>
  )
})

function Sidebar({ rowSelected }: { rowSelected: boolean }) {
  const badgeRef = React.useRef<HTMLSpanElement>(null)

  useSpriteEffect((lt) => {
    const entry = clamp((lt - 0.5) / 0.9, 0, 1)
    const count = Math.round(6 + entry)
    if (badgeRef.current) badgeRef.current.textContent = String(count)
  })

  const items = [
    { label: 'Bandeja', hasBadge: true, active: !rowSelected },
    { label: 'Asignados', count: 4 },
    { label: 'En revisión', count: 3, active: rowSelected },
    { label: 'Comité', count: 2 },
    { label: 'Histórico' },
  ] as Array<{ label: string; hasBadge?: boolean; count?: number; active?: boolean }>

  return (
    <div
      style={{
        width: 220,
        background: '#080d1f',
        padding: '20px 14px',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 26 }}>
        <AcmeMark size={16} color="#818CF8" />
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', color: '#ECECEA' }}>ACME · Originación</span>
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            padding: '9px 12px',
            borderRadius: 6,
            fontSize: 13,
            color: it.active ? '#fff' : '#7a8294',
            background: it.active ? 'rgba(79,70,229,0.18)' : 'transparent',
            marginBottom: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'background 220ms, color 220ms',
          }}
        >
          <span>{it.label}</span>
          {it.hasBadge ? (
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--f-mono)',
                color: it.active ? '#818CF8' : '#5a637a',
                background: it.active ? 'rgba(129,140,248,0.18)' : 'transparent',
                padding: it.active ? '1px 6px' : '0',
                borderRadius: 4,
              }}
            >
              <span ref={badgeRef}>6</span>
            </span>
          ) : it.count != null ? (
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--f-mono)',
                color: it.active ? '#818CF8' : '#5a637a',
                background: it.active ? 'rgba(129,140,248,0.18)' : 'transparent',
                padding: it.active ? '1px 6px' : '0',
                borderRadius: 4,
              }}
            >
              {it.count}
            </span>
          ) : null}
        </div>
      ))}

      <div
        style={{
          position: 'absolute',
          bottom: 22,
          left: 28,
          fontFamily: 'var(--f-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          color: 'rgba(122,130,148,0.6)',
          textTransform: 'uppercase',
        }}
      >
        powered by uni2
      </div>
    </div>
  )
}

interface InboxRow {
  id: string
  name: string
  amount: string
  when: string
  status: string
}

function InboxView({ rowSelected }: { rowSelected: boolean }) {
  const countRef = React.useRef<HTMLSpanElement>(null)

  useSpriteEffect((lt) => {
    const entry = clamp((lt - 0.5) / 0.9, 0, 1)
    const count = 5 + Math.round(entry)
    if (countRef.current) countRef.current.textContent = `${count} solicitudes`
  })

  const rows: InboxRow[] = [
    { id: 'SOL-2026-04774', name: 'Carlos M. Quintero', amount: '$ 12.5M', when: 'hace 2h', status: 'aprobado' },
    { id: 'SOL-2026-04775', name: 'Marta L. Pineda', amount: '$ 8.2M', when: 'hace 3h', status: 'pendiente' },
    { id: 'SOL-2026-04776', name: 'David O. Restrepo', amount: '$ 24.0M', when: 'hace 4h', status: 'revisión' },
    { id: 'SOL-2026-04777', name: 'Lina K. Mejía', amount: '$ 6.8M', when: 'hace 5h', status: 'aprobado' },
    { id: 'SOL-2026-04778', name: 'Andrés F. Villa', amount: '$ 18.4M', when: 'hace 7h', status: 'rechazado' },
  ]
  const newRow: InboxRow = { id: 'SOL-2026-04781', name: 'Tatiana Avilés Restrepo', amount: '$ 28.0M', when: 'ahora', status: 'nueva' }

  return (
    <div style={{ padding: 26, color: '#ECECEA' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--f-mono)', letterSpacing: '0.16em', color: '#5a637a', textTransform: 'uppercase' }}>
            Hoy · 25 sep 2026
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 32, marginTop: 2, fontWeight: 400 }}>Bandeja</div>
        </div>
        <span ref={countRef} style={{ fontSize: 12, color: '#7a8294', fontFamily: 'var(--f-mono)' }}>5 solicitudes</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '160px 1.6fr 1fr 0.8fr 1fr 30px',
          gap: 12,
          padding: '6px 14px',
          fontFamily: 'var(--f-mono)',
          fontSize: 10,
          letterSpacing: '0.12em',
          color: '#5a637a',
          textTransform: 'uppercase',
        }}
      >
        <span>Solicitud</span>
        <span>Solicitante</span>
        <span>Monto</span>
        <span>Tiempo</span>
        <span>Estado</span>
        <span></span>
      </div>

      <div style={{ marginTop: 4 }}>
        <NewInboxRow row={newRow} selected={rowSelected} />
        {rows.map((r) => (
          <StaticInboxRow key={r.id} row={r} />
        ))}
      </div>
    </div>
  )
}

function NewInboxRow({ row, selected }: { row: InboxRow; selected: boolean }) {
  const outerRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const el = outerRef.current
    if (!el) return
    const entry = clamp((lt - 0.5) / 0.9, 0, 1)
    el.style.opacity = String(entry)
    el.style.transform = `translateY(${(1 - entry) * -20}px)`
    if (entry < 1) {
      el.style.background = `rgba(79,70,229,${0.05 + entry * 0.05})`
      el.style.borderColor = `rgba(129,140,248,${0.2 + entry * 0.3})`
      el.style.boxShadow = `0 0 ${10 + entry * 24}px rgba(129,140,248,${0.18 + entry * 0.3})`
    }
  })

  const statusColor = '#818CF8'

  return (
    <div
      ref={outerRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1.6fr 1fr 0.8fr 1fr 30px',
        gap: 12,
        padding: '14px 14px',
        borderRadius: 8,
        background: selected ? 'rgba(79,70,229,0.14)' : 'rgba(79,70,229,0.05)',
        border: selected ? '1px solid rgba(129,140,248,0.5)' : '1px solid rgba(129,140,248,0.2)',
        boxShadow: selected ? 'none' : '0 0 10px rgba(129,140,248,0.18)',
        transform: 'translateY(-20px)',
        opacity: 0,
        alignItems: 'center',
        fontSize: 13,
        transition: 'background 220ms, border 220ms',
      }}
    >
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#7a8294' }}>{row.id}</span>
      <span style={{ color: '#ECECEA', fontWeight: 500 }}>{row.name}</span>
      <span style={{ fontFamily: 'var(--f-mono)', color: '#ECECEA', fontVariantNumeric: 'tabular-nums' }}>{row.amount}</span>
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#7a8294' }}>{row.when}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: statusColor }} />
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {row.status}
        </span>
      </span>
      <span style={{ color: '#5a637a', fontFamily: 'var(--f-mono)', fontSize: 14 }}>›</span>
    </div>
  )
}

function StaticInboxRow({ row }: { row: InboxRow }) {
  const statusColor =
    ({ aprobado: '#5fd49a', revisión: '#ffb060', pendiente: '#7a8294', rechazado: '#ff6a6a' } as Record<string, string>)[
      row.status
    ] || '#7a8294'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1.6fr 1fr 0.8fr 1fr 30px',
        gap: 12,
        padding: '14px 14px',
        borderRadius: 8,
        background: 'transparent',
        border: '1px solid transparent',
        alignItems: 'center',
        fontSize: 13,
      }}
    >
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#7a8294' }}>{row.id}</span>
      <span style={{ color: '#ECECEA', fontWeight: 500 }}>{row.name}</span>
      <span style={{ fontFamily: 'var(--f-mono)', color: '#ECECEA', fontVariantNumeric: 'tabular-nums' }}>{row.amount}</span>
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#7a8294' }}>{row.when}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: statusColor }} />
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {row.status}
        </span>
      </span>
      <span style={{ color: '#5a637a', fontFamily: 'var(--f-mono)', fontSize: 14 }}>›</span>
    </div>
  )
}

function DetailPanel({ approved }: { approved: boolean }) {
  const panelRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const open = clamp((lt - 2.4) / 1.2, 0, 1)
    const eased = Easing.easeOutCubic(open)
    const slideX = (1 - eased) * 180
    const settleScale = 0.985 + eased * 0.015
    const panelOpacity = clamp(open * 1.4, 0, 1)
    if (panelRef.current) {
      panelRef.current.style.transform = `translateX(${slideX}px) scale(${settleScale})`
      panelRef.current.style.opacity = String(panelOpacity)
    }
  })

  const DATA_ROWS = [
    { k: 'Cédula', v: '1.024.578.331', highlight: false, mono: false },
    { k: 'Ingreso mensual', v: '$ 4.250.000', highlight: true, mono: false },
    { k: 'Empresa', v: 'Industrias Avilés S.A.S.', highlight: false, mono: false },
    { k: 'Antigüedad', v: '4 años · 2 meses', highlight: false, mono: false },
    { k: 'Vinculación', v: 'Empleado', highlight: false, mono: false },
    { k: 'Documento', v: 'cédula + huella · verificado', highlight: false, mono: true },
  ]

  const RULES = [
    { code: '01', label: 'Identidad verificada' },
    { code: '02', label: 'Ingresos consistentes' },
    { code: '03', label: 'Sin reportes negativos' },
    { code: '04', label: 'Ingreso verificable' },
    { code: '05', label: 'Capacidad de pago' },
    { code: '06', label: 'Score mínimo (≥ 680)' },
  ]

  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0e1530',
        transform: 'translateX(180px) scale(0.985)',
        transformOrigin: 'right center',
        opacity: 0,
        padding: 26,
        overflow: 'hidden',
        boxShadow: '-40px 0 80px rgba(0,0,0,0.5)',
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--f-mono)',
          fontSize: 11,
          color: '#5a637a',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 14,
        }}
      >
        ‹ Bandeja / Tatiana Avilés
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 22 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--f-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a637a' }}>
            Solicitud · SOL-2026-04781
          </div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 32, color: '#ECECEA', marginTop: 4, fontWeight: 400, lineHeight: 1.05, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Tatiana Avilés Restrepo
          </div>
          <div style={{ fontSize: 13, color: '#7a8294', marginTop: 6, fontFamily: 'var(--f-mono)', whiteSpace: 'nowrap' }}>
            cc 1.024.578.331 · $ 28.000.000 a 36 meses
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ApproveButton approved={approved} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 16 }}>
        <Panel title="DATOS DEL SOLICITANTE">
          {DATA_ROWS.map((row, i) => (
            <AnimRow key={row.k} k={row.k} v={row.v} startAt={3.0 + i * 0.144} highlight={row.highlight} mono={row.mono} />
          ))}
        </Panel>

        <Panel title="EVALUACIÓN">
          <ScoreGauge />
          <MetricsRow />
        </Panel>
      </div>

      <Panel title="REGLAS DE CRÉDITO · 6/6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {RULES.map((rule, i) => (
            <RuleCheck key={rule.code} code={rule.code} label={rule.label} startAt={5.4 + i * 0.2333} />
          ))}
        </div>
      </Panel>

      <div style={{ marginTop: 12 }}>
        <Panel title="ACTIVIDAD" tight>
          <ActivityTimeline />
        </Panel>
      </div>
    </div>
  )
}

function AnimRow({ k, v, startAt, highlight, mono }: { k: string; v: string; startAt: number; highlight?: boolean; mono?: boolean }) {
  const outerRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const vis = clamp((lt - startAt) / 0.45, 0, 1)
    if (outerRef.current) {
      outerRef.current.style.opacity = String(vis)
      outerRef.current.style.transform = `translateY(${(1 - vis) * 6}px)`
    }
  })

  return (
    <div
      ref={outerRef}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, opacity: 0 }}
    >
      <span style={{ fontSize: 11, color: '#7a8294', fontFamily: 'var(--f-mono)', letterSpacing: '0.04em' }}>{k}</span>
      <span
        style={{
          fontSize: 13,
          fontFamily: mono ? 'var(--f-mono)' : 'var(--f-ui)',
          color: highlight ? '#818CF8' : '#ECECEA',
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {v}
      </span>
    </div>
  )
}

function ScoreGauge() {
  const circleRef = React.useRef<SVGCircleElement>(null)
  const scoreNumRef = React.useRef<HTMLDivElement>(null)
  const gradeRef = React.useRef<HTMLDivElement>(null)

  const r = 32
  const c = 2 * Math.PI * r

  useSpriteEffect((lt) => {
    const scoreAnim = clamp((lt - 4.2) / 1.6, 0, 1)
    const value = Math.round(742 * Easing.easeOutCubic(scoreAnim))
    const pct = value / 850
    const dash = pct * c
    if (circleRef.current) circleRef.current.setAttribute('stroke-dasharray', `${dash} ${c}`)
    if (scoreNumRef.current) scoreNumRef.current.textContent = String(value)
    const grade = value >= 720 ? 'A−' : value >= 660 ? 'B+' : value >= 600 ? 'B' : 'C'
    if (gradeRef.current) gradeRef.current.textContent = `${grade} · ${Math.round(pct * 100)} percentil`
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} stroke="#1a2240" strokeWidth="5" fill="none" />
        <circle
          ref={circleRef}
          cx="42"
          cy="42"
          r={r}
          stroke="url(#scoreGrad)"
          strokeWidth="5"
          fill="none"
          strokeDasharray={`0 ${c}`}
          strokeLinecap="round"
          transform="rotate(-90 42 42)"
          style={{ filter: 'drop-shadow(0 0 8px rgba(129,140,248,0.7))' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <div style={{ fontSize: 10, fontFamily: 'var(--f-mono)', letterSpacing: '0.12em', color: '#5a637a', textTransform: 'uppercase' }}>
          Score crediticio
        </div>
        <div
          ref={scoreNumRef}
          style={{ fontFamily: 'var(--f-display)', fontSize: 38, color: '#ECECEA', lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}
        >
          0
        </div>
        <div ref={gradeRef} style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#818CF8', marginTop: 2 }}></div>
      </div>
    </div>
  )
}

function MetricsRow() {
  const dtiRef = React.useRef<HTMLDivElement>(null)
  const ltvRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const scoreAnim = clamp((lt - 4.2) / 1.6, 0, 1)
    const dti = Math.round(28 * Easing.easeOutCubic(scoreAnim))
    const ltv = (0.62 * Easing.easeOutCubic(scoreAnim)).toFixed(2)
    if (dtiRef.current) dtiRef.current.textContent = `${dti}%`
    if (ltvRef.current) ltvRef.current.textContent = ltv
  })

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--f-mono)', letterSpacing: '0.1em', color: '#5a637a', textTransform: 'uppercase' }}>DTI</div>
        <div ref={dtiRef} style={{ fontFamily: 'var(--f-mono)', fontSize: 18, color: '#ECECEA', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>0%</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--f-mono)', letterSpacing: '0.1em', color: '#5a637a', textTransform: 'uppercase' }}>LTV</div>
        <div ref={ltvRef} style={{ fontFamily: 'var(--f-mono)', fontSize: 18, color: '#ECECEA', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>0.00</div>
      </div>
      <MetricBlock k="Riesgo" v="A−" highlight />
    </div>
  )
}

function RuleCheck({ code, label, startAt }: { code: string; label: string; startAt: number }) {
  const DUR = 0.2333
  const boxRef = React.useRef<HTMLDivElement>(null)
  const circleRef = React.useRef<HTMLDivElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const svgPathRef = React.useRef<SVGPathElement>(null)
  const labelRef = React.useRef<HTMLDivElement>(null)
  const prevDoneRef = React.useRef(false)

  useSpriteEffect((lt) => {
    const progress = clamp((lt - startAt) / DUR, 0, 1)
    if (svgRef.current) {
      svgRef.current.style.opacity = String(progress)
      svgRef.current.style.transform = `scale(${Easing.easeOutBack(progress)})`
    }
    const done = progress > 0.95
    if (done !== prevDoneRef.current) {
      prevDoneRef.current = done
      if (boxRef.current) {
        boxRef.current.style.background = done ? 'rgba(95,212,154,0.08)' : 'rgba(255,255,255,0.02)'
        boxRef.current.style.borderColor = done ? 'rgba(95,212,154,0.2)' : 'rgba(255,255,255,0.05)'
      }
      if (circleRef.current) {
        circleRef.current.style.background = done ? '#5fd49a' : 'rgba(255,255,255,0.04)'
        circleRef.current.style.borderColor = done ? '#5fd49a' : 'rgba(255,255,255,0.1)'
        circleRef.current.style.boxShadow = done ? '0 0 10px rgba(95,212,154,0.5)' : 'none'
      }
      if (svgPathRef.current) svgPathRef.current.setAttribute('stroke', done ? '#0e1530' : '#7a8294')
      if (labelRef.current) labelRef.current.style.color = done ? '#ECECEA' : '#7a8294'
    }
  })

  return (
    <div
      ref={boxRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 6,
      }}
    >
      <div
        ref={circleRef}
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg ref={svgRef} width="10" height="10" viewBox="0 0 10 10" style={{ opacity: 0, transform: 'scale(0)' }}>
          <path
            ref={svgPathRef}
            d="M2 5l2 2 4-4"
            stroke="#7a8294"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#5a637a', letterSpacing: '0.08em' }}>regla {code}</div>
        <div ref={labelRef} style={{ fontSize: 12, color: '#7a8294', marginTop: 1 }}>{label}</div>
      </div>
    </div>
  )
}

function ActivityTimeline() {
  const r0 = React.useRef<HTMLDivElement>(null)
  const r1 = React.useRef<HTMLDivElement>(null)
  const r2 = React.useRef<HTMLDivElement>(null)
  const r3 = React.useRef<HTMLDivElement>(null)
  const r4 = React.useRef<HTMLDivElement>(null)

  const ITEMS = [
    { when: '10:41', ev: 'link enviado', delay: 0, current: false },
    { when: '10:43', ev: 'cliente · identidad', delay: 0.15, current: false },
    { when: '10:44', ev: 'cliente · documentos', delay: 0.3, current: false },
    { when: '10:45', ev: 'sistema · score', delay: 0.5, current: false },
    { when: '10:46', ev: 'analista · revisión', delay: 0.85, current: true },
  ]
  const refs = [r0, r1, r2, r3, r4]

  useSpriteEffect((lt) => {
    refs.forEach((ref, i) => {
      if (!ref.current) return
      const startAt = 6.4 + ITEMS[i].delay
      const op = clamp((lt - startAt) / 0.333, 0, 1)
      ref.current.style.opacity = String(op)
      ref.current.style.transform = `translateY(${(1 - op) * 6}px)`
    })
  })

  return (
    <div style={{ display: 'flex', gap: 22, fontSize: 11, fontFamily: 'var(--f-mono)' }}>
      {ITEMS.map((item, i) => (
        <div key={i} ref={refs[i]} style={{ display: 'flex', flexDirection: 'column', gap: 3, opacity: 0 }}>
          <span style={{ color: item.current ? '#818CF8' : '#5a637a' }}>{item.when}</span>
          <span style={{ color: item.current ? '#ECECEA' : '#7a8294' }}>{item.ev}</span>
        </div>
      ))}
    </div>
  )
}

function ApproveButton({ approved }: { approved: boolean }) {
  const buttonRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const glow = clamp((lt - 7.0) / 1.0, 0, 1)
    const clicked = clamp((lt - 8.6) / 0.4, 0, 1)
    const pulse = 0.4 + Math.abs(Math.sin(glow * 8)) * 0.6
    const scale = 1 - clicked * 0.04
    if (buttonRef.current && !approved) {
      buttonRef.current.style.boxShadow = `0 8px 24px rgba(79,70,229,${0.3 + glow * 0.3}), 0 0 0 ${glow * 6}px rgba(129,140,248,${pulse * 0.18})`
      buttonRef.current.style.transform = `scale(${scale})`
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          background: approved ? 'rgba(95,212,154,0.18)' : 'rgba(79,70,229,0.12)',
          border: approved ? '1px solid rgba(95,212,154,0.4)' : '1px solid rgba(129,140,248,0.3)',
          borderRadius: 999,
          fontSize: 11,
          color: approved ? '#5fd49a' : '#818CF8',
          fontFamily: 'var(--f-mono)',
          transition: 'background 180ms, border 180ms, color 180ms',
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            background: approved ? '#5fd49a' : '#818CF8',
            boxShadow: `0 0 8px ${approved ? '#5fd49a' : '#818CF8'}`,
          }}
        />
        {approved ? 'aprobado · sincronizado' : 'sincronizado en vivo'}
      </div>
      <div
        ref={buttonRef}
        style={{
          padding: '12px 28px',
          background: approved ? '#5fd49a' : '#4F46E5',
          borderRadius: 8,
          fontSize: 14,
          color: approved ? '#06291d' : '#fff',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
          transform: 'scale(1)',
          transition: 'background 180ms, color 180ms',
          fontFamily: 'var(--f-ui)',
          letterSpacing: '0.02em',
        }}
      >
        {approved ? '✓ Aprobado' : 'Aprobar crédito'}
      </div>
    </div>
  )
}

function Panel({ title, children, tight }: { title: string; children: React.ReactNode; tight?: boolean }) {
  return (
    <div
      style={{
        background: '#080d1f',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: 8,
        padding: tight ? '12px 14px' : '14px 16px',
      }}
    >
      <div style={{ fontSize: 10, fontFamily: 'var(--f-mono)', letterSpacing: '0.14em', color: '#5a637a', marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}

function MetricBlock({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div style={{ flex: 1, textAlign: 'left' }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--f-mono)', letterSpacing: '0.1em', color: '#5a637a', textTransform: 'uppercase' }}>
        {k}
      </div>
      <div
        style={{
          fontFamily: highlight ? 'var(--f-display)' : 'var(--f-mono)',
          fontSize: highlight ? 22 : 18,
          color: highlight ? '#5fd49a' : '#ECECEA',
          fontVariantNumeric: 'tabular-nums',
          marginTop: 2,
        }}
      >
        {v}
      </div>
    </div>
  )
}
