import React from 'react'
import { useTime, clamp, Easing, Sprite } from '../../components/animation'

// ── Data ──────────────────────────────────────────────────────────────────────

interface ClientRecord {
  id: string; nombre: string; doc: string
  email: string; tel: string; ciudad: string; producto: string
}

const RECORDS: ClientRecord[] = [
  { id: 'C-0421', nombre: 'María Castaño Ríos',    doc: 'CC 1018554221', email: 'm.castano@acme.co',   tel: '+57 310 522 4881', ciudad: 'Bogotá',        producto: 'Ahorro Plus'     },
  { id: 'C-0422', nombre: 'Andrés Felipe Quintero', doc: 'CC 80254117',   email: 'a.quintero@acme.co',  tel: '+57 312 661 1102', ciudad: 'Medellín',      producto: 'CDT 360'         },
  { id: 'C-0423', nombre: 'Luisa Fernanda Ortega',  doc: 'CC 1022954881', email: 'l.ortega@acme.co',    tel: '+57 318 042 5519', ciudad: 'Cali',           producto: 'Tarjeta Élite'   },
  { id: 'C-0424', nombre: 'Carlos Mauricio Rincón', doc: 'CC 79825041',   email: 'c.rincon@acme.co',    tel: '+57 311 770 3324', ciudad: 'Barranquilla',  producto: 'Ahorro Plus'     },
  { id: 'C-0425', nombre: 'Sara Velásquez Mejía',   doc: 'CC 1098221504', email: 's.velasquez@acme.co', tel: '+57 313 559 4108', ciudad: 'Bucaramanga',   producto: 'Crédito Express' },
  { id: 'C-0426', nombre: 'Tomás Restrepo Hoyos',   doc: 'CC 1037884221', email: 't.restrepo@acme.co',  tel: '+57 314 901 7745', ciudad: 'Pereira',        producto: 'CDT 180'         },
]

const TOTAL_BATCH = 127

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldKey = 'nombre' | 'doc' | 'email' | 'submit'
interface FieldState { focused: boolean; typed: number }
type FieldStates = { [K in FieldKey]: FieldState }
type ScheduleMode = 'detailed' | 'montage' | 'final'
interface RecordSchedule { idx: number; start: number; end: number; mode: ScheduleMode }
interface TerminalLineData { kind: string; text: string; _at: number }

// ── Scene timing ──────────────────────────────────────────────────────────────

const CANVAS_W = 1920
const CANVAS_H = 1080

const T = {
  ide_in: 0,
  cmd_typed: 1.8,
  api_call_highlight: 3.5,
  api_panel_in: 4.2,
  api_records_progress_end: 6.2,
  api_panel_out: 7.0,
  driver_line_highlight: 7.0,
  browser_in: 7.6,
  browser_loaded: 9.0,
  rec1_start: 9.4,  rec1_end: 14.4,
  rec2_start: 14.6, rec2_end: 18.4,
  rec3_start: 18.6, rec3_end: 21.6,
  montage_start: 21.8,
  montage_end: 24.4,
  final_start: 24.6,
  stamp_appear: 25.2,
  hold_end: 28.0,
}

// ── Field order constants ─────────────────────────────────────────────────────

const FIELD_ORDER: FieldKey[] = ['nombre', 'doc', 'email', 'submit']
const FIELD_TO_LINE: Record<FieldKey, number> = { nombre: 13, doc: 14, email: 15, submit: 16 }

// ── Logic helpers ─────────────────────────────────────────────────────────────

function getRecordSchedule(t: number): RecordSchedule | null {
  if (t >= T.rec1_start && t < T.rec1_end) return { idx: 0, start: T.rec1_start, end: T.rec1_end, mode: 'detailed' }
  if (t >= T.rec2_start && t < T.rec2_end) return { idx: 1, start: T.rec2_start, end: T.rec2_end, mode: 'detailed' }
  if (t >= T.rec3_start && t < T.rec3_end) return { idx: 2, start: T.rec3_start, end: T.rec3_end, mode: 'detailed' }
  if (t >= T.montage_start && t < T.montage_end) {
    const cycleDur = 0.18
    const cycleIdx = Math.floor((t - T.montage_start) / cycleDur)
    const recordIdx = 3 + (cycleIdx % (RECORDS.length - 3))
    const start = T.montage_start + cycleIdx * cycleDur
    return { idx: recordIdx, start, end: start + cycleDur, mode: 'montage' }
  }
  if (t >= T.final_start) return { idx: 5, start: T.final_start, end: T.hold_end, mode: 'final' }
  return null
}

function getFieldStates(t: number, schedule: RecordSchedule | null): FieldStates {
  const empty: FieldStates = {} as FieldStates
  FIELD_ORDER.forEach(f => { empty[f] = { focused: false, typed: 0 } })
  if (!schedule) return empty

  const local = t - schedule.start
  const dur = schedule.end - schedule.start

  if (schedule.mode === 'montage' || schedule.mode === 'final') {
    FIELD_ORDER.forEach(f => { empty[f] = { focused: false, typed: 1 } })
    return empty
  }

  const phase = dur / FIELD_ORDER.length
  FIELD_ORDER.forEach((f, i) => {
    const pStart = i * phase, pEnd = (i + 1) * phase
    if (local < pStart) {
      empty[f] = { focused: false, typed: 0 }
    } else if (local < pEnd) {
      const pLocal = (local - pStart) / phase
      if (f === 'submit') {
        empty[f] = { focused: true, typed: pLocal > 0.5 ? 1 : 0 }
      } else {
        const typed = pLocal < 0.15 ? 0 : Math.min(1, (pLocal - 0.15) / 0.55)
        empty[f] = { focused: true, typed }
      }
    } else {
      empty[f] = { focused: false, typed: 1 }
    }
  })
  return empty
}

function getActiveField(schedule: RecordSchedule | null, fieldStates: FieldStates): FieldKey | null {
  if (!schedule || schedule.mode !== 'detailed') return null
  for (const f of FIELD_ORDER) {
    if (fieldStates[f].focused) return f
  }
  return null
}

function getSubmitClicksInRange(schedule: RecordSchedule | null): number[] {
  if (!schedule || schedule.mode !== 'detailed') return []
  const phase = (schedule.end - schedule.start) / FIELD_ORDER.length
  const submitIdx = FIELD_ORDER.indexOf('submit')
  return [schedule.start + submitIdx * phase + 0.5 * phase]
}

function getBatchCount(t: number): number {
  if (t < T.rec1_end) return 0
  if (t < T.rec2_end) return 1
  if (t < T.rec3_end) return 2
  if (t < T.montage_end) {
    const p = (t - T.rec3_end) / (T.montage_end - T.rec3_end)
    return Math.floor(3 + p * 124)
  }
  return TOTAL_BATCH
}

function getTerminalLines(t: number): TerminalLineData[] {
  const lines: TerminalLineData[] = []
  const add = (when: number, kind: string, text: string) => {
    if (t >= when) lines.push({ kind, text, _at: when })
  }

  add(0.6, 'cmd',  'python migrate.py --batch=127')
  add(1.6, 'dim',  'Iniciando Selenium…')
  add(2.6, 'info', 'GET https://api.acme.co/clients/batch?size=127')
  add(3.4, 'ok',   '200 OK · 127 registros recibidos (187 ms)')
  add(5.2, 'info', 'WebDriver Chrome inicializado')
  add(5.8, 'info', 'navegando → crm.acme-client.co/login')
  add(6.4, 'ok',   'login OK · sesión iniciada')

  if (t >= T.rec1_end - 0.1) add(T.rec1_end - 0.1, 'ok', `migrado ${RECORDS[0].id} · ${RECORDS[0].nombre}`)
  if (t >= T.rec2_end - 0.1) add(T.rec2_end - 0.1, 'ok', `migrado ${RECORDS[1].id} · ${RECORDS[1].nombre}`)
  if (t >= T.rec3_end - 0.1) add(T.rec3_end - 0.1, 'ok', `migrado ${RECORDS[2].id} · ${RECORDS[2].nombre}`)

  if (t >= T.montage_start) {
    const elapsed = Math.min(t, T.montage_end) - T.montage_start
    const total   = T.montage_end - T.montage_start
    const linesNeeded = Math.floor((elapsed / total) * 12)
    for (let i = 0; i < linesNeeded; i++) {
      const recIdx = (3 + i) % RECORDS.length
      add(T.montage_start + (i / 12) * total, 'ok', `migrado ${RECORDS[recIdx].id} · …`)
    }
  }
  if (t >= T.final_start) {
    add(T.final_start - 0.05, 'dim', '… 121 líneas omitidas')
    add(T.final_start + 0.1, 'accent', `✓ ${TOTAL_BATCH} / ${TOTAL_BATCH} registros migrados · 02m 14s`)
  }

  return lines.slice(-11)
}

function getHighlightLine(t: number, activeField: FieldKey | null): number | null {
  if (t >= T.api_call_highlight && t < T.api_panel_out) return 5
  if (t >= T.driver_line_highlight && t < T.browser_loaded) return 8
  if (t >= T.browser_loaded && t < T.rec1_start) return 9
  if (activeField) return FIELD_TO_LINE[activeField]
  if (t >= T.rec1_start && t < T.montage_end) return 12
  if (t >= T.final_start) return 17
  return null
}

// ── Python IDE ────────────────────────────────────────────────────────────────

type TokenKind = 'kw' | 'fn' | 'id' | 's' | 'p' | 'c' | 't'
type Token = [TokenKind, string]

const CODE_LINES: { n: number; tokens: Token[] }[] = [
  { n: 1,  tokens: [['kw','import'], ['t',' '], ['id','requests']] },
  { n: 2,  tokens: [['kw','from'], ['t',' '], ['id','selenium'], ['t',' '], ['kw','import'], ['t',' '], ['id','webdriver']] },
  { n: 3,  tokens: [] },
  { n: 4,  tokens: [['c','# 1) Leer lote desde el Web Service']] },
  { n: 5,  tokens: [['id','data'], ['t',' = '], ['id','requests'], ['t','.'], ['fn','get'], ['p','('], ['s','"https://api.acme.co/clients/batch"'], ['p',')'], ['t','.'], ['fn','json'], ['p','()']] },
  { n: 6,  tokens: [] },
  { n: 7,  tokens: [['c','# 2) Abrir plataforma del cliente']] },
  { n: 8,  tokens: [['id','driver'], ['t',' = '], ['id','webdriver'], ['t','.'], ['fn','Chrome'], ['p','()']] },
  { n: 9,  tokens: [['id','driver'], ['t','.'], ['fn','get'], ['p','('], ['s','"https://crm.acme-client.co/new"'], ['p',')']] },
  { n: 10, tokens: [] },
  { n: 11, tokens: [['c','# 3) Por cada registro, diligenciar el formulario']] },
  { n: 12, tokens: [['kw','for'], ['t',' '], ['id','record'], ['t',' '], ['kw','in'], ['t',' '], ['id','data'], ['p','['], ['s','"records"'], ['p',']:']] },
  { n: 13, tokens: [['t','    '], ['id','driver'], ['t','.'], ['fn','find_element'], ['p','('], ['s','"nombre"'], ['p',')'], ['t','.'], ['fn','send_keys'], ['p','('], ['id','record'], ['p','['], ['s','"nombre"'], ['p','])']] },
  { n: 14, tokens: [['t','    '], ['id','driver'], ['t','.'], ['fn','find_element'], ['p','('], ['s','"doc"'], ['p',')'], ['t','.'], ['fn','send_keys'], ['p','('], ['id','record'], ['p','['], ['s','"doc"'], ['p','])']] },
  { n: 15, tokens: [['t','    '], ['id','driver'], ['t','.'], ['fn','find_element'], ['p','('], ['s','"email"'], ['p',')'], ['t','.'], ['fn','send_keys'], ['p','('], ['id','record'], ['p','['], ['s','"email"'], ['p','])']] },
  { n: 16, tokens: [['t','    '], ['id','driver'], ['t','.'], ['fn','find_element'], ['p','('], ['s','"submit"'], ['p',')'], ['t','.'], ['fn','click'], ['p','()']] },
  { n: 17, tokens: [['t','    '], ['fn','print'], ['p','('], ['s','f"✓ {record[\'id\']} migrado"'], ['p',')']] },
]

const TOKEN_COLORS: Record<TokenKind, string> = {
  kw: '#F472B6', fn: '#FCD34D', id: '#E7E5E4',
  s:  '#4ADE80', p:  '#A8A29E', c:  '#6B7280', t: '#E7E5E4',
}

function CodeLine({ tokens, n, highlight }: { tokens: Token[]; n: number; highlight: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: 14, padding: '1px 0', position: 'relative',
      background: highlight ? 'rgba(74, 222, 128, 0.10)' : 'transparent',
      borderLeft: highlight ? '2px solid #4ADE80' : '2px solid transparent',
      paddingLeft: 6, transition: 'background 200ms, border-color 200ms',
    }}>
      <span style={{ color: '#52525B', fontFamily: 'IBM Plex Mono', fontSize: 13, width: 22, textAlign: 'right', userSelect: 'none', flexShrink: 0 }}>{n}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, whiteSpace: 'pre' }}>
        {tokens.map(([kind, text], i) => (
          <span key={i} style={{ color: TOKEN_COLORS[kind] || '#E7E5E4' }}>{text}</span>
        ))}
      </span>
    </div>
  )
}

function TerminalLine({ line }: { line: TerminalLineData }) {
  const colors: Record<string, string> = {
    cmd: '#E7E5E4', ok: '#4ADE80', info: '#FCD34D',
    dim: '#52525B', err: '#F87171', accent: '#22D3EE',
  }
  const prefix: Record<string, string> = {
    cmd: '$', ok: '✓', info: '▸', err: '✗', dim: '·', accent: '▶',
  }
  const c = colors[line.kind] ?? colors.info
  return (
    <div style={{ color: c, display: 'flex', gap: 8 }}>
      <span style={{ color: line.kind === 'cmd' ? '#FCD34D' : c, width: 12, flexShrink: 0 }}>
        {prefix[line.kind] ?? '·'}
      </span>
      <span style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span>
    </div>
  )
}

function ApiResponsePanel({ progress = 0, recordCount = 6 }: { progress?: number; recordCount?: number }) {
  const lines = [
    { t: '{', color: '#A8A29E' },
    { t: '  "batch_id": "B-2026-0481",', color: '#E7E5E4' },
    { t: `  "size": ${TOTAL_BATCH},`, color: '#E7E5E4' },
    { t: '  "source": "core_banking_v3",', color: '#E7E5E4' },
    { t: '  "records": [', color: '#A8A29E' },
    ...RECORDS.slice(0, recordCount).map((r, i) => ({
      t: `    { "id": "${r.id}", "nombre": "${r.nombre}", ... }${i < recordCount - 1 ? ',' : ''}`,
      color: '#4ADE80',
    })),
    { t: `    … +${TOTAL_BATCH - recordCount} más`, color: '#52525B' },
    { t: '  ]', color: '#A8A29E' },
    { t: '}', color: '#A8A29E' },
  ]
  const shown = Math.floor(lines.length * progress)
  return (
    <div style={{
      background: '#06100A', border: '1px solid #1F2A1A', borderRadius: 10,
      padding: '14px 16px', fontFamily: 'IBM Plex Mono', fontSize: 11, lineHeight: 1.55,
      boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
        fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#FCD34D', letterSpacing: '0.06em',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FCD34D' }} />
        GET · /clients/batch · 200 OK
        <span style={{ color: '#52525B', marginLeft: 'auto' }}>187 ms</span>
      </div>
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} style={{ color: l.color, whiteSpace: 'pre' }}>{l.t}</div>
      ))}
    </div>
  )
}

function PythonIDE({ highlightLine, terminalLines }: {
  highlightLine: number | null
  terminalLines: TerminalLineData[]
}) {
  return (
    <div style={{
      background: '#0A1408', border: '1px solid #1F2A1A', borderRadius: 12,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5)', height: '100%', minHeight: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', padding: '8px 12px', gap: 10,
        borderBottom: '1px solid #1F2A1A', background: '#06100A', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#3F3F46' }} />)}
        </div>
        <div style={{
          fontFamily: 'IBM Plex Mono', fontSize: 12, color: '#4ADE80',
          background: 'rgba(74, 222, 128, 0.08)', padding: '4px 10px', borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 1h4l2 2v6H2V1z" stroke="#4ADE80" strokeWidth="1"/>
          </svg>
          migrate.py
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#52525B' }}>
          Python 3.11 · selenium 4.18
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {CODE_LINES.map((line) => (
          <CodeLine key={line.n} n={line.n} tokens={line.tokens} highlight={highlightLine === line.n} />
        ))}
      </div>

      <div style={{
        background: '#040A06', borderTop: '1px solid #1F2A1A',
        padding: '10px 14px', flexShrink: 0, height: 200, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
          fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#52525B',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span>● TERMINAL</span>
          <span style={{ color: '#3F3F46' }}>·</span>
          <span>bash · zsh</span>
        </div>
        <div style={{
          fontFamily: 'IBM Plex Mono', fontSize: 12, lineHeight: 1.5,
          color: '#4ADE80', display: 'flex', flexDirection: 'column-reverse',
          overflow: 'hidden', flex: 1,
        }}>
          <div>
            {terminalLines.map((l, i) => <TerminalLine key={i} line={l} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── CurrentRecordCard ─────────────────────────────────────────────────────────

function CurrentRecordCard({ record, activeField, visible, batchCount }: {
  record: ClientRecord; activeField: FieldKey | null; visible: boolean; batchCount: number
}) {
  if (!visible) return null
  const fields = [
    { key: 'id',     label: 'id',     value: record.id,     mono: true  },
    { key: 'nombre', label: 'nombre', value: record.nombre, mono: false },
    { key: 'doc',    label: 'doc',    value: record.doc,    mono: true  },
    { key: 'email',  label: 'email',  value: record.email,  mono: true  },
  ]
  return (
    <div style={{
      background: '#06100A', border: '1px solid #1F2A1A', borderRadius: 12,
      padding: '14px 18px', fontFamily: 'IBM Plex Mono', fontSize: 12,
      boxShadow: '0 12px 28px -8px rgba(0,0,0,0.55)', color: '#E7E5E4', width: '100%',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 10, fontSize: 10, color: '#FCD34D', letterSpacing: '0.08em',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FCD34D', animation: 'sel-pulse 0.8s ease-in-out infinite' }} />
          RECORD EN PROCESO
        </span>
        <span style={{ color: '#4ADE80' }}>{batchCount + 1} / {TOTAL_BATCH}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {fields.map(f => {
          const isActive = activeField === f.key
          return (
            <div key={f.key} style={{
              display: 'flex', gap: 12, padding: '5px 8px', borderRadius: 5,
              background: isActive ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
              borderLeft: isActive ? '2px solid #4ADE80' : '2px solid transparent',
              transition: 'background 150ms, border-color 150ms', alignItems: 'baseline',
            }}>
              <span style={{ color: '#A8A29E', width: 60, flexShrink: 0 }}>"{f.label}":</span>
              <span style={{ color: isActive ? '#4ADE80' : '#E7E5E4', fontWeight: isActive ? 600 : 400 }}>
                "{f.value}"
              </span>
              {isActive && (
                <span style={{ marginLeft: 'auto', fontSize: 9, color: '#4ADE80', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
                  →&nbsp;FORM
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Browser platform & CRM form ───────────────────────────────────────────────

const BTN_ICON: React.CSSProperties = {
  width: 24, height: 24, borderRadius: 5, background: 'transparent',
  border: 'none', color: '#736D67', fontSize: 14, cursor: 'pointer',
  fontFamily: 'Epilogue',
}

function BrowserWindow({ url, children, loading }: {
  url: string; children: React.ReactNode; loading: boolean
}) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E4E2DC', borderRadius: 12,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: '0 20px 60px -12px rgba(0,0,0,0.25), 0 6px 16px -4px rgba(0,0,0,0.08)', height: '100%',
    }}>
      <div style={{
        background: '#F2F0EB', padding: '10px 14px 0', borderBottom: '1px solid #E4E2DC',
        display: 'flex', alignItems: 'flex-end', gap: 10, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 6, paddingBottom: 8 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FCD34D' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#22C55E' }} />
        </div>
        <div style={{
          background: '#fff', borderRadius: '8px 8px 0 0', padding: '8px 14px',
          fontFamily: 'Epilogue', fontSize: 12, color: '#1C1917', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8, maxWidth: 360,
          borderTop: '1px solid #E4E2DC', borderLeft: '1px solid #E4E2DC', borderRight: '1px solid #E4E2DC',
          marginBottom: -1,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#2563EB' }} />
          <span>CRM · ACME Client</span>
          <span style={{ marginLeft: 6, color: '#A8A29E' }}>×</span>
        </div>
        <div style={{ flex: 1 }} />
      </div>

      <div style={{
        padding: '10px 14px', borderBottom: '1px solid #E4E2DC',
        display: 'flex', alignItems: 'center', gap: 10, background: '#fff', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={BTN_ICON}>‹</button>
          <button style={BTN_ICON}>›</button>
          <button style={BTN_ICON}>⟳</button>
        </div>
        <div style={{
          flex: 1, background: '#F2F0EB', borderRadius: 7, padding: '7px 12px',
          fontFamily: 'IBM Plex Mono', fontSize: 12, color: '#57534E',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: '#15803D' }}>🔒</span>
          <span>{url}</span>
          {loading && <span style={{ marginLeft: 'auto', color: '#2563EB', fontSize: 10 }}>● cargando…</span>}
        </div>
        <div style={{
          fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#A8A29E',
          background: '#FAFAF9', padding: '4px 8px', borderRadius: 4,
        }}>Driven by Selenium</div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#FAFAF9' }}>
        {children}
      </div>
    </div>
  )
}

function BatchProgressBadge({ progress, currentRecordId }: { progress: number; currentRecordId: string }) {
  const done = Math.floor(progress * TOTAL_BATCH)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 12px', borderRadius: 999,
      background: progress >= 1 ? '#ECFDF5' : '#FEF3C7',
      border: `1px solid ${progress >= 1 ? '#BBF7D0' : '#FDE68A'}`,
      fontFamily: 'Epilogue', fontSize: 11, fontWeight: 600,
      color: progress >= 1 ? '#15803D' : '#A16207',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: progress >= 1 ? '#15803D' : '#D97706',
        animation: progress < 1 && progress > 0 ? 'sel-pulse 0.8s ease-in-out infinite' : 'none',
      }} />
      Lote · {done} / {TOTAL_BATCH}
      <span style={{ color: '#A8A29E', fontFamily: 'IBM Plex Mono', fontSize: 10, marginLeft: 4 }}>
        {progress >= 1 ? 'COMPLETO' : currentRecordId}
      </span>
    </div>
  )
}

function CrmShell({ children, batchProgress, currentRecordId }: {
  children: React.ReactNode; batchProgress: number; currentRecordId: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '12px 22px', borderBottom: '1px solid #E4E2DC', background: '#fff',
        display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6, background: '#2563EB',
          color: '#fff', fontFamily: 'Epilogue', fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>A</div>
        <div style={{ fontFamily: 'Epilogue', fontWeight: 600, fontSize: 14, color: '#1C1917' }}>
          ACME Client · CRM
        </div>
        <div style={{ display: 'flex', gap: 18, marginLeft: 16, fontFamily: 'Epilogue', fontSize: 12, color: '#57534E' }}>
          <span>Clientes</span>
          <span style={{ color: '#2563EB', fontWeight: 600 }}>+ Nuevo cliente</span>
          <span>Reportes</span>
        </div>
        <div style={{ flex: 1 }} />
        <BatchProgressBadge progress={batchProgress} currentRecordId={currentRecordId} />
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 22px' }}>
        {children}
      </div>
    </div>
  )
}

function FormField({ label, name, value, typedFraction = 0, focused = false }: {
  label: string; name: string; value: string; typedFraction?: number; focused?: boolean
}) {
  const shown = value.slice(0, Math.floor(value.length * typedFraction))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'Epilogue', fontSize: 11, fontWeight: 500, color: '#57534E', letterSpacing: '0.02em' }}>
        {label}
      </label>
      <div style={{
        background: '#fff', border: `1.5px solid ${focused ? '#2563EB' : '#E4E2DC'}`,
        borderRadius: 7, padding: '9px 12px',
        fontFamily: 'Epilogue', fontSize: 13, color: '#1C1917',
        boxShadow: focused ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none',
        position: 'relative', minHeight: 38, display: 'flex', alignItems: 'center',
        transition: 'border-color 100ms, box-shadow 100ms',
      }}>
        <span data-field={name}>{shown}</span>
        {focused && typedFraction < 1 && (
          <span style={{
            display: 'inline-block', width: 2, height: 16, background: '#2563EB',
            marginLeft: 1, animation: 'sel-caret 0.8s steps(2) infinite',
          }} />
        )}
      </div>
    </div>
  )
}

function ClientForm({ record, fieldStates }: { record: ClientRecord; fieldStates: FieldStates }) {
  const fs = fieldStates
  return (
    <div style={{
      background: '#fff', border: '1px solid #E4E2DC', borderRadius: 12,
      padding: 26, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#736D67', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            FORMULARIO · /clients/new
          </div>
          <div style={{ fontFamily: 'Epilogue', fontSize: 22, fontWeight: 600, color: '#1C1917', letterSpacing: '-0.01em' }}>
            Nuevo cliente
          </div>
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#A8A29E', background: '#FAFAF9', padding: '6px 10px', borderRadius: 5 }}>
          id: <span style={{ color: '#2563EB', fontWeight: 600 }}>{record.id}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
        <FormField label="Nombre completo"       name="nombre" value={record.nombre} typedFraction={fs.nombre.typed} focused={fs.nombre.focused} />
        <FormField label="Documento"              name="doc"    value={record.doc}    typedFraction={fs.doc.typed}    focused={fs.doc.focused}    />
        <FormField label="Correo electrónico"     name="email"  value={record.email}  typedFraction={fs.email.typed}  focused={fs.email.focused}  />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, paddingTop: 18, borderTop: '1px solid #E4E2DC' }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#A8A29E' }}>
          driven by · driver.find_element(...).send_keys(...)
        </div>
        <button data-submit-btn style={{
          padding: '11px 24px', borderRadius: 7, border: 'none',
          background: fs.submit?.focused ? '#1E40AF' : '#2563EB',
          color: '#fff', fontFamily: 'Epilogue', fontSize: 14, fontWeight: 600,
          boxShadow: fs.submit?.focused ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none',
          transition: 'background 100ms, box-shadow 100ms',
        }}>
          Guardar cliente
        </button>
      </div>
    </div>
  )
}

function Toast({ visible, recordId }: { visible: boolean; recordId: string }) {
  if (!visible) return null
  return (
    <div style={{
      position: 'absolute', top: 20, right: 22,
      background: '#15803D', color: '#fff',
      padding: '12px 16px', borderRadius: 8,
      fontFamily: 'Epilogue', fontSize: 13, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 24px -6px rgba(21, 128, 61, 0.4)',
      animation: 'sel-toast 0.3s ease-out',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      Cliente <strong style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{recordId}</strong> creado
    </div>
  )
}

// ── Data flow arrows ──────────────────────────────────────────────────────────

function DataFlowArrows({ from, via, to, active }: {
  from: { x: number; y: number }; via: { x: number; y: number }; to: { x: number; y: number }; active: boolean
}) {
  return (
    <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      <defs>
        <marker id="sel-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#4ADE80" />
        </marker>
      </defs>
      <path
        d={`M ${from.x} ${from.y} Q ${(from.x + via.x) / 2} ${via.y + 80} ${via.x} ${via.y}`}
        fill="none" stroke="#4ADE80" strokeWidth="2"
        strokeDasharray="6 6" opacity={active ? 0.7 : 0}
        markerEnd="url(#sel-arrow)"
        style={{ animation: 'sel-dashflow 0.8s linear infinite' }}
      />
      <path
        d={`M ${via.x} ${via.y} Q ${(via.x + to.x) / 2} ${via.y + 80} ${to.x} ${to.y}`}
        fill="none" stroke="#2563EB" strokeWidth="2"
        strokeDasharray="6 6" opacity={active ? 0.7 : 0}
        markerEnd="url(#sel-arrow)"
        style={{ animation: 'sel-dashflow 0.8s linear infinite' }}
      />
    </svg>
  )
}

// ── Bot cursor ────────────────────────────────────────────────────────────────
// Positions derived from layout math: BrowserWindow left=1130 top=30 w=760 h=1020
// tab~40 + addr~44 + CrmShell header~50 + body-pad 20 + form-pad 26 + title~70 = base 280
const _CURSOR_POS = {
  idle:   { x: 1510, y: 540 },
  nombre: { x: 1510, y: 322 },
  doc:    { x: 1510, y: 403 },
  email:  { x: 1510, y: 484 },
  submit: { x: 1782, y: 983 },
}
const _p1 = (T.rec1_end - T.rec1_start) / FIELD_ORDER.length
const _p2 = (T.rec2_end - T.rec2_start) / FIELD_ORDER.length
const _p3 = (T.rec3_end - T.rec3_start) / FIELD_ORDER.length

const CURSOR_WAYPOINTS: Array<{ t: number; x: number; y: number }> = [
  { t: T.browser_loaded,           ..._CURSOR_POS.idle   },
  { t: T.rec1_start,               ..._CURSOR_POS.nombre },
  { t: T.rec1_start + _p1,         ..._CURSOR_POS.doc    },
  { t: T.rec1_start + _p1 * 2,     ..._CURSOR_POS.email  },
  { t: T.rec1_start + _p1 * 3,     ..._CURSOR_POS.submit },
  { t: T.rec1_end,                 ..._CURSOR_POS.idle   },
  { t: T.rec2_start,               ..._CURSOR_POS.nombre },
  { t: T.rec2_start + _p2,         ..._CURSOR_POS.doc    },
  { t: T.rec2_start + _p2 * 2,     ..._CURSOR_POS.email  },
  { t: T.rec2_start + _p2 * 3,     ..._CURSOR_POS.submit },
  { t: T.rec2_end,                 ..._CURSOR_POS.idle   },
  { t: T.rec3_start,               ..._CURSOR_POS.nombre },
  { t: T.rec3_start + _p3,         ..._CURSOR_POS.doc    },
  { t: T.rec3_start + _p3 * 2,     ..._CURSOR_POS.email  },
  { t: T.rec3_start + _p3 * 3,     ..._CURSOR_POS.submit },
  { t: T.montage_start,            ..._CURSOR_POS.idle   },
]

function BotCursor({ visible, clickPulses }: {
  visible: boolean
  clickPulses: number[]
}) {
  const t = useTime()

  let curr = CURSOR_WAYPOINTS[0], next = CURSOR_WAYPOINTS[CURSOR_WAYPOINTS.length - 1]
  for (let i = 0; i < CURSOR_WAYPOINTS.length - 1; i++) {
    if (t >= CURSOR_WAYPOINTS[i].t && t <= CURSOR_WAYPOINTS[i + 1].t) {
      curr = CURSOR_WAYPOINTS[i]; next = CURSOR_WAYPOINTS[i + 1]; break
    }
  }
  const span  = next.t - curr.t
  const k     = span > 0 ? clamp((t - curr.t) / span, 0, 1) : 0
  const eased = Easing.easeOutCubic(k)
  const pos   = {
    x: curr.x + (next.x - curr.x) * eased,
    y: curr.y + (next.y - curr.y) * eased,
  }

  let clickScale = 1, ringOp = 0, ringSc = 1
  for (const c of clickPulses) {
    const dt = t - c
    if (dt >= -0.05 && dt < 0.4) {
      if (dt < 0.08)       clickScale = 1 - 0.25 * (dt / 0.08)
      else if (dt < 0.18)  clickScale = 0.75 + 0.25 * ((dt - 0.08) / 0.1)
      else                 clickScale = 1
      if (dt >= 0) {
        const rt = dt / 0.4
        ringOp = (1 - rt) * 0.6
        ringSc = 1 + rt * 2.4
      }
    }
  }

  if (!visible) return null
  return (
    <div style={{ position: 'absolute', left: pos.x, top: pos.y, width: 0, height: 0, pointerEvents: 'none', zIndex: 100 }}>
      <div style={{
        position: 'absolute', left: -22, top: -22, width: 44, height: 44,
        borderRadius: '50%', border: '3px solid #2563EB',
        opacity: ringOp, transform: `scale(${ringSc})`,
      }} />
      <svg width="30" height="36" viewBox="0 0 30 36" style={{
        position: 'absolute', left: -2, top: -2,
        transform: `scale(${clickScale})`, transformOrigin: '5px 5px',
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
      }}>
        <path d="M3 2 L3 26 L10 20 L14 30 L18 28 L13 18 L22 17 Z"
          fill="#fff" stroke="#1C1917" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <div style={{
        position: 'absolute', left: 18, top: 18,
        background: '#1C1917', color: '#FCD34D',
        fontFamily: 'IBM Plex Mono', fontSize: 9, fontWeight: 600,
        padding: '2px 6px', borderRadius: 3, letterSpacing: '0.08em',
      }}>BOT</div>
    </div>
  )
}

// ── Camera ────────────────────────────────────────────────────────────────────

interface CameraKf { t: number; x: number; y: number; scale: number }

function useCamera(keyframes: CameraKf[]) {
  const t = useTime()
  let curr = keyframes[0], next = keyframes[keyframes.length - 1]
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
      transformOrigin: '0 0', willChange: 'transform',
    }}>
      {children}
    </div>
  )
}

// ── Caption ───────────────────────────────────────────────────────────────────

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
            position: 'absolute', left: '50%', bottom: 90,
            transform: `translateX(-50%) translateY(${(1 - op) * 8}px)`,
            opacity: op,
            background: 'rgba(15, 23, 42, 0.92)', color: '#FAFAF9',
            padding: '10px 18px', borderRadius: 999,
            fontFamily: 'Epilogue', fontSize: 16, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)', whiteSpace: 'nowrap',
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

// ── Camera keyframes ──────────────────────────────────────────────────────────

const CAMERA_KEYS: CameraKf[] = [
  { t: 0,                     x: 960, y: 540, scale: 1.00 },
  { t: T.browser_loaded,      x: 960, y: 540, scale: 1.00 },
  { t: T.rec1_start + 2,      x: 960, y: 540, scale: 1.02 },
  { t: T.rec3_end,            x: 960, y: 540, scale: 1.02 },
  { t: T.montage_start + 0.5, x: 960, y: 540, scale: 1.00 },
  { t: T.final_start,         x: 960, y: 540, scale: 1.00 },
  { t: T.hold_end,            x: 960, y: 540, scale: 1.03 },
]

// ── Global keyframe styles ────────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes sel-pulse    { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  @keyframes sel-caret    { 50% { opacity: 0.2; } }
  @keyframes sel-toast    { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes sel-dashflow { to { stroke-dashoffset: -24; } }
`

// ── Main exported scene ───────────────────────────────────────────────────────

export function SceneSelenium() {
  const t = useTime()

  const schedule     = getRecordSchedule(t)
  const fieldStates  = getFieldStates(t, schedule)
  const activeField  = getActiveField(schedule, fieldStates)
  const record       = RECORDS[schedule ? schedule.idx : 0]
  const batchCount   = getBatchCount(t)
  const batchProgress = batchCount / TOTAL_BATCH
  const terminalLines = getTerminalLines(t)
  const highlightLine = getHighlightLine(t, activeField)

  const submitClicks = [
    ...getSubmitClicksInRange({ idx: 0, start: T.rec1_start, end: T.rec1_end, mode: 'detailed' }),
    ...getSubmitClicksInRange({ idx: 1, start: T.rec2_start, end: T.rec2_end, mode: 'detailed' }),
    ...getSubmitClicksInRange({ idx: 2, start: T.rec3_start, end: T.rec3_end, mode: 'detailed' }),
  ]

  let toastVisible = false
  let toastRecord  = record
  for (let i = 0; i < submitClicks.length; i++) {
    if (t >= submitClicks[i] && t < submitClicks[i] + 0.7) {
      toastVisible = true; toastRecord = RECORDS[i]; break
    }
  }

  const cursorVisible = t >= T.rec1_start && t < T.montage_start

  // API panel
  const apiVisible = t >= T.api_panel_in && t < T.api_panel_out + 0.4
  let apiProgress = 0, apiOpacity = 1, apiOffsetY = 0
  if (apiVisible) {
    if (t < T.api_panel_in + 0.4) {
      const p = (t - T.api_panel_in) / 0.4
      apiOpacity = p; apiOffsetY = (1 - Easing.easeOutCubic(p)) * 20
    } else if (t > T.api_panel_out) {
      const p = (t - T.api_panel_out) / 0.4
      apiOpacity = 1 - p; apiOffsetY = -p * 16
    }
    apiProgress = clamp((t - T.api_panel_in - 0.3) / (T.api_records_progress_end - T.api_panel_in - 0.3), 0, 1)
  }

  // Browser entry
  let browserOpacity = 0, browserTx = 0, browserScale = 1
  if (t >= T.browser_in) {
    if (t < T.browser_in + 0.55) {
      const p = (t - T.browser_in) / 0.55
      browserOpacity = p
      browserTx      = (1 - Easing.easeOutCubic(p)) * 60
      browserScale   = 0.96 + 0.04 * Easing.easeOutCubic(p)
    } else {
      browserOpacity = 1; browserTx = 0; browserScale = 1
    }
  }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ position: 'absolute', inset: 0, background: '#FAFAF9', overflow: 'hidden' }}>
        <CameraLayer keyframes={CAMERA_KEYS}>
          {/* IDE — left column */}
          <div style={{ position: 'absolute', left: 30, top: 30, width: 760, height: 1020 }}>
            <PythonIDE highlightLine={highlightLine} terminalLines={terminalLines} />
          </div>

          {/* Current record card — center */}
          <div style={{ position: 'absolute', left: 820, top: 30, width: 280 }}>
            <CurrentRecordCard
              record={record}
              activeField={activeField}
              visible={t >= T.browser_loaded && t < T.final_start}
              batchCount={batchCount}
            />
          </div>

          {/* Data flow arrows */}
          {activeField && (
            <DataFlowArrows
              from={{ x: 790, y: 540 }}
              via={{ x: 960, y: 200 }}
              to={{ x: 1110, y: 540 }}
              active
            />
          )}

          {/* API response panel */}
          {apiVisible && (
            <div style={{
              position: 'absolute', left: 820, top: 200, width: 760,
              opacity: apiOpacity, transform: `translateY(${apiOffsetY}px)`, zIndex: 5,
            }}>
              <ApiResponsePanel progress={apiProgress} recordCount={6} />
            </div>
          )}

          {/* Browser — right column */}
          {t >= T.browser_in && (
            <div style={{
              position: 'absolute', left: 1130, top: 30, width: 760, height: 1020,
              opacity: browserOpacity,
              transform: `translateX(${browserTx}px) scale(${browserScale})`,
              transformOrigin: 'left center',
            }}>
              <BrowserWindow url="https://crm.acme-client.co/new" loading={t < T.browser_loaded}>
                <CrmShell batchProgress={batchProgress} currentRecordId={record.id}>
                  <ClientForm record={record} fieldStates={fieldStates} />
                  <Toast visible={toastVisible} recordId={toastRecord.id} />
                </CrmShell>
              </BrowserWindow>
            </div>
          )}

          {/* Bot cursor */}
          <BotCursor
            visible={cursorVisible}
            clickPulses={submitClicks}
          />
        </CameraLayer>

        {/* Captions — outside camera, unscaled */}
        <Caption start={0.8}  end={4.0}  text="Automatización Selenium · lote parametrizado" subtext="PYTHON · MIGRATE.PY"       />
        <Caption start={4.5}  end={7.4}  text="Fuente de datos vía Web Service"               subtext="GET /clients/batch · 200 OK" />
        <Caption start={7.8}  end={11.0} text="Selenium WebDriver toma el control"             subtext="HEADLESS · CHROME"          />
        <Caption start={11.5} end={17.5} text="Diligencia cada formulario campo por campo"     subtext="By.NAME · send_keys"         />
        <Caption start={18.0} end={24.0} text="Procesa el lote completo a ritmo de máquina"   subtext={`× ${TOTAL_BATCH} REGISTROS`} />
        <Caption start={24.5} end={27.9} text="Reemplaza la digitación manual por integración" subtext="0 ERRORES · 02m 14s"         />
      </div>
    </>
  )
}
