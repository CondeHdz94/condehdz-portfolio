import React from 'react'
import { Easing, clamp } from '../../../components/animation'
import { AcmeMark } from './animMocks'

interface AnalystAppProps {
  time?: number
  cursorRef?: React.RefObject<HTMLDivElement | null>
}

export function AnalystApp({ time = 0, cursorRef }: AnalystAppProps) {
  const t = time

  const inboxItemEntry = clamp((t - 0.5) / 0.9, 0, 1)
  const rowSelected = t > 2.0 ? 1 : 0
  const detailOpen = clamp((t - 2.4) / 1.2, 0, 1)
  const dataPopulate = clamp((t - 3.0) / 1.8, 0, 1)
  const scoreAnim = clamp((t - 4.2) / 1.6, 0, 1)
  const rulesProgress = clamp((t - 5.4) / 1.4, 0, 1)
  const timelineAnim = clamp((t - 6.4) / 1.0, 0, 1)
  const approveGlow = clamp((t - 7.0) / 1.0, 0, 1)
  const approveClick = clamp((t - 8.6) / 0.4, 0, 1)

  const scoreVal = Math.round(742 * Easing.easeOutCubic(scoreAnim))
  const dtiVal = Math.round(28 * Easing.easeOutCubic(scoreAnim))
  const ltvVal = (0.62 * Easing.easeOutCubic(scoreAnim)).toFixed(2)

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
      {/* macOS-style window chrome */}
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
        <div style={{ marginLeft: 20, fontSize: 12, color: '#5a637a', fontFamily: 'var(--f-mono)' }}>
          acme.uni2.io / originación{detailOpen > 0.5 ? ' / SOL-2026-04781' : ''}
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100% - 40px)' }}>
        <Sidebar inboxCount={Math.round(6 + inboxItemEntry)} highlightInbox={rowSelected > 0} />

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Inbox — fades out as detail opens */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 1 - detailOpen,
              transform: `scale(${1 - detailOpen * 0.03})`,
              transformOrigin: 'center',
              pointerEvents: detailOpen > 0.5 ? 'none' : 'auto',
            }}
          >
            <InboxView newRowEntry={inboxItemEntry} rowSelected={rowSelected} cursorRef={cursorRef} />
          </div>

          {/* Detail panel slides from right */}
          {detailOpen > 0.01 && (
            <DetailPanel
              open={detailOpen}
              dataPopulate={dataPopulate}
              scoreVal={scoreVal}
              dtiVal={dtiVal}
              ltvVal={ltvVal}
              rulesProgress={rulesProgress}
              timelineAnim={timelineAnim}
              approveGlow={approveGlow}
              approveClick={approveClick}
              cursorRef={cursorRef}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Sidebar({ inboxCount, highlightInbox }: { inboxCount: number; highlightInbox: boolean }) {
  const items = [
    { label: 'Bandeja', count: inboxCount, active: !highlightInbox },
    { label: 'Asignados', count: 4 },
    { label: 'En revisión', count: 3, active: highlightInbox },
    { label: 'Comité', count: 2 },
    { label: 'Histórico' },
  ] as Array<{ label: string; count?: number; active?: boolean }>
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
          {it.count != null && (
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--f-mono)',
                color: it.active ? '#818CF8' : '#5a637a',
                background: it.active ? 'rgba(129,140,248,0.18)' : 'transparent',
                padding: it.active ? '1px 6px' : 0,
                borderRadius: 4,
              }}
            >
              {it.count}
            </span>
          )}
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

function InboxView({
  newRowEntry,
  rowSelected,
  cursorRef,
}: {
  newRowEntry: number
  rowSelected: number
  cursorRef?: React.RefObject<HTMLDivElement | null>
}) {
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
        <div style={{ fontSize: 12, color: '#7a8294', fontFamily: 'var(--f-mono)' }}>
          {rows.length + Math.round(newRowEntry)} solicitudes
        </div>
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
        <InboxRowItem row={newRow} entry={newRowEntry} isNew selected={rowSelected > 0} cursorRef={cursorRef} />
        {rows.map((r) => (
          <InboxRowItem key={r.id} row={r} entry={1} />
        ))}
      </div>
    </div>
  )
}

function InboxRowItem({
  row,
  entry,
  isNew = false,
  selected = false,
  cursorRef,
}: {
  row: InboxRow
  entry: number
  isNew?: boolean
  selected?: boolean
  cursorRef?: React.RefObject<HTMLDivElement | null>
}) {
  const newGlow = isNew ? (1 - clamp((entry - 1) * 0.5, 0, 1)) * Math.max(0, entry) : 0
  const slideY = (1 - entry) * -20
  const opacity = entry

  const ref = isNew && cursorRef ? cursorRef : undefined

  const statusColor =
    ({
      nueva: '#818CF8',
      aprobado: '#5fd49a',
      revisión: '#ffb060',
      pendiente: '#7a8294',
      rechazado: '#ff6a6a',
    } as Record<string, string>)[row.status] || '#7a8294'

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1.6fr 1fr 0.8fr 1fr 30px',
        gap: 12,
        padding: '14px 14px',
        borderRadius: 8,
        background: selected ? 'rgba(79,70,229,0.14)' : isNew ? `rgba(79,70,229,${0.05 + newGlow * 0.05})` : 'transparent',
        border: selected
          ? '1px solid rgba(129,140,248,0.5)'
          : isNew
            ? `1px solid rgba(129,140,248,${0.2 + newGlow * 0.3})`
            : '1px solid transparent',
        boxShadow: isNew ? `0 0 ${10 + newGlow * 24}px rgba(129,140,248,${0.18 + newGlow * 0.3})` : 'none',
        transform: `translateY(${slideY}px)`,
        opacity,
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
        <span
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 11,
            color: statusColor,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {row.status}
        </span>
      </span>
      <span style={{ color: '#5a637a', fontFamily: 'var(--f-mono)', fontSize: 14 }}>›</span>
    </div>
  )
}

function DetailPanel({
  open,
  dataPopulate,
  scoreVal,
  dtiVal,
  ltvVal,
  rulesProgress,
  timelineAnim,
  approveGlow,
  approveClick,
  cursorRef,
}: {
  open: number
  dataPopulate: number
  scoreVal: number
  dtiVal: number
  ltvVal: string
  rulesProgress: number
  timelineAnim: number
  approveGlow: number
  approveClick: number
  cursorRef?: React.RefObject<HTMLDivElement | null>
}) {
  const eased = Easing.easeOutCubic(open)
  const slideX = (1 - eased) * 180
  const settleScale = 0.985 + eased * 0.015
  const panelOpacity = clamp(open * 1.4, 0, 1)
  const approved = approveClick > 0.5

  const rowOpacity = (idx: number) => {
    const stagger = idx * 0.08
    return clamp((dataPopulate - stagger) * 4, 0, 1)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0e1530',
        transform: `translateX(${slideX}px) scale(${settleScale})`,
        transformOrigin: 'right center',
        opacity: panelOpacity,
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
          <div
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 32,
              color: '#ECECEA',
              marginTop: 4,
              fontWeight: 400,
              lineHeight: 1.05,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Tatiana Avilés Restrepo
          </div>
          <div style={{ fontSize: 13, color: '#7a8294', marginTop: 6, fontFamily: 'var(--f-mono)', whiteSpace: 'nowrap' }}>
            cc 1.024.578.331 · $ 28.000.000 a 36 meses
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ApproveButton glow={approveGlow} clicked={approveClick} approved={approved} cursorRef={cursorRef} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 16 }}>
        <Panel title="DATOS DEL SOLICITANTE">
          <AnimRow visible={rowOpacity(0)} k="Cédula" v="1.024.578.331" />
          <AnimRow visible={rowOpacity(1)} k="Ingreso mensual" v="$ 4.250.000" highlight />
          <AnimRow visible={rowOpacity(2)} k="Empresa" v="Industrias Avilés S.A.S." />
          <AnimRow visible={rowOpacity(3)} k="Antigüedad" v="4 años · 2 meses" />
          <AnimRow visible={rowOpacity(4)} k="Vinculación" v="Empleado" />
          <AnimRow visible={rowOpacity(5)} k="Documento" v="cédula + huella · verificado" mono />
        </Panel>

        <Panel title="EVALUACIÓN">
          <ScoreGauge value={scoreVal} maxVal={850} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <MetricBlock k="DTI" v={`${dtiVal}%`} />
            <MetricBlock k="LTV" v={ltvVal} />
            <MetricBlock k="Riesgo" v="A−" highlight />
          </div>
        </Panel>
      </div>

      <Panel title="REGLAS DE CRÉDITO · 6/6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { code: '01', label: 'Identidad verificada' },
            { code: '02', label: 'Ingresos consistentes' },
            { code: '03', label: 'Sin reportes negativos' },
            { code: '04', label: 'Ingreso verificable' },
            { code: '05', label: 'Capacidad de pago' },
            { code: '06', label: 'Score mínimo (≥ 680)' },
          ].map((rule, i) => (
            <RuleCheck key={rule.code} code={rule.code} label={rule.label} progress={clamp(rulesProgress * 6 - i, 0, 1)} />
          ))}
        </div>
      </Panel>

      <div style={{ marginTop: 12 }}>
        <Panel title="ACTIVIDAD" tight>
          <div style={{ display: 'flex', gap: 22, fontSize: 11, fontFamily: 'var(--f-mono)' }}>
            {(
              [
                ['10:41', 'link enviado', 0, false],
                ['10:43', 'cliente · identidad', 0.15, false],
                ['10:44', 'cliente · documentos', 0.3, false],
                ['10:45', 'sistema · score', 0.5, false],
                ['10:46', 'analista · revisión', 0.85, true],
              ] as Array<[string, string, number, boolean]>
            ).map(([when, ev, delay, current], i) => {
              const op = clamp((timelineAnim - delay) * 3, 0, 1)
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    opacity: op,
                    transform: `translateY(${(1 - op) * 6}px)`,
                  }}
                >
                  <span style={{ color: current ? '#818CF8' : '#5a637a' }}>{when}</span>
                  <span style={{ color: current ? '#ECECEA' : '#7a8294' }}>{ev}</span>
                </div>
              )
            })}
          </div>
        </Panel>
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

function AnimRow({ visible, k, v, highlight, mono }: { visible: number; k: string; v: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 12,
        opacity: visible,
        transform: `translateY(${(1 - visible) * 6}px)`,
      }}
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

function ScoreGauge({ value, maxVal = 850 }: { value: number; maxVal?: number }) {
  const pct = value / maxVal
  const r = 32
  const c = 2 * Math.PI * r
  const dash = pct * c
  const grade = value >= 720 ? 'A−' : value >= 660 ? 'B+' : value >= 600 ? 'B' : 'C'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} stroke="#1a2240" strokeWidth="5" fill="none" />
        <circle
          cx="42"
          cy="42"
          r={r}
          stroke="url(#scoreGrad)"
          strokeWidth="5"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
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
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 38,
            color: '#ECECEA',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            marginTop: 2,
          }}
        >
          {value}
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: '#818CF8', marginTop: 2 }}>
          {grade} · {Math.round(pct * 100)} percentil
        </div>
      </div>
    </div>
  )
}

function RuleCheck({ code, label, progress }: { code: string; label: string; progress: number }) {
  const checkOpacity = progress
  const tickEntry = Easing.easeOutBack(progress)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        background: progress > 0.95 ? 'rgba(95,212,154,0.08)' : 'rgba(255,255,255,0.02)',
        border: progress > 0.95 ? '1px solid rgba(95,212,154,0.2)' : '1px solid rgba(255,255,255,0.05)',
        borderRadius: 6,
        transition: 'background 240ms, border 240ms',
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          background: progress > 0.95 ? '#5fd49a' : 'rgba(255,255,255,0.04)',
          border: progress > 0.95 ? '1px solid #5fd49a' : '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: progress > 0.95 ? '0 0 10px rgba(95,212,154,0.5)' : 'none',
        }}
      >
        {progress > 0.05 && (
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: checkOpacity, transform: `scale(${tickEntry})` }}>
            <path
              d="M2 5l2 2 4-4"
              stroke={progress > 0.95 ? '#0e1530' : '#7a8294'}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: '#5a637a', letterSpacing: '0.08em' }}>regla {code}</div>
        <div style={{ fontSize: 12, color: progress > 0.95 ? '#ECECEA' : '#7a8294', marginTop: 1 }}>{label}</div>
      </div>
    </div>
  )
}

function ApproveButton({
  glow,
  clicked,
  approved,
  cursorRef,
}: {
  glow: number
  clicked: number
  approved: boolean
  cursorRef?: React.RefObject<HTMLDivElement | null>
}) {
  const pulse = 0.4 + Math.abs(Math.sin(glow * 8)) * 0.6
  const scale = 1 - clicked * 0.04
  const ref = glow > 0.3 ? cursorRef : undefined
  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
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
        style={{
          padding: '12px 28px',
          background: approved ? '#5fd49a' : '#4F46E5',
          borderRadius: 8,
          fontSize: 14,
          color: approved ? '#06291d' : '#fff',
          fontWeight: 600,
          boxShadow: approved
            ? '0 8px 24px rgba(95,212,154,0.4), 0 0 0 4px rgba(95,212,154,0.15)'
            : `0 8px 24px rgba(79,70,229,${0.3 + glow * 0.3}), 0 0 0 ${glow * 6}px rgba(129,140,248,${pulse * 0.18})`,
          transform: `scale(${scale})`,
          transition: 'background 180ms, box-shadow 180ms, color 180ms',
          fontFamily: 'var(--f-ui)',
          letterSpacing: '0.02em',
        }}
      >
        {approved ? '✓ Aprobado' : 'Aprobar crédito'}
      </div>
    </div>
  )
}
