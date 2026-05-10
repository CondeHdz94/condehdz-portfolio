import React from 'react'
import { useTime, clamp } from '../../components/animation'
import { BANK_DATA } from './data'
import { C, lerp, ease, CRTLines, SceneFrame, SegBadge, StatBadge } from './shared'

// ── Animation phases (seconds) ───────────────────────────────────────────────

const PHASE = {
  typeStart: 0.4,
  zoomStart: 2.5,
  zoomEnd:   4.0,
  slideStart: 3.4,
  slideEnd:   4.4,
  mapStart:  4.6,
  mapEnd:    7.5,
  fadeStart: 7.8,
  fadeEnd:   9.0,
}

// ── Shared animation helpers ─────────────────────────────────────────────────

const useZoomT  = (t: number) => ease(clamp((t - PHASE.zoomStart)  / (PHASE.zoomEnd   - PHASE.zoomStart),  0, 1))
const useSlideT = (t: number) => ease(clamp((t - PHASE.slideStart) / (PHASE.slideEnd  - PHASE.slideStart), 0, 1))
const useFadeT  = (t: number) => ease(clamp((t - PHASE.fadeStart)  / (PHASE.fadeEnd   - PHASE.fadeStart),  0, 1))

function terminalRect(zoomT: number) {
  return {
    left:   lerp(160, 100, zoomT),
    top:    lerp(160, 200, zoomT),
    width:  lerp(1600, 840, zoomT),
    height: lerp(800, 720, zoomT),
  }
}

function modernRect(slideT: number, fadeT: number) {
  const finalW = 1520
  const finalL = (1920 - finalW) / 2
  return {
    left:    lerp(lerp(1920, 980, slideT), finalL, fadeT),
    top:     200,
    width:   lerp(840, finalW, fadeT),
    height:  720,
    opacity: slideT,
  }
}

// ── Shared terminal chrome ────────────────────────────────────────────────────

const tGlow  = `0 0 6px rgba(74,222,128,0.85), 0 0 14px rgba(74,222,128,0.45), 0 0 28px rgba(74,222,128,0.18)`
const tAmber = `0 0 6px rgba(252,211,77,0.9), 0 0 14px rgba(252,211,77,0.5), 0 0 28px rgba(252,211,77,0.2)`
const tSep   = (fontSize: number) => (
  <div style={{ height: fontSize * 1.2, display: 'flex', alignItems: 'center', marginRight: fontSize * 0.5 }}>
    <div style={{ flex: 1, height: 0, borderBottom: `1px solid ${C.tg}`, boxShadow: `0 0 6px rgba(74,222,128,0.7), 0 0 12px rgba(74,222,128,0.35)` }} />
  </div>
)

// ── M1 — FORM (CLNT100) ──────────────────────────────────────────────────────

export function SceneM1() {
  const time = useTime()
  const s = BANK_DATA.selected
  const zoomT  = useZoomT(time)
  const slideT = useSlideT(time)
  const fadeT  = useFadeT(time)
  const tRect  = terminalRect(zoomT)
  const mRect  = modernRect(slideT, fadeT)

  const FIELDS = [
    { key: 'id',      label: 'IDENTIFICACION', mLabel: 'Identificación', val: `${s.idType} ${s.id}`,     mono: true  },
    { key: 'name',    label: 'NOMBRE',         mLabel: 'Nombre',         val: s.name                                 },
    { key: 'address', label: 'DIRECCION',      mLabel: 'Dirección',      val: s.address                             },
    { key: 'city',    label: 'CIUDAD',         mLabel: 'Ciudad',         val: s.city                                },
    { key: 'phone',   label: 'TELEFONO',       mLabel: 'Teléfono',       val: s.phone,                  mono: true  },
    { key: 'segment', label: 'SEGMENTO',       mLabel: 'Segmento',       val: `${s.segment}=${s.segmentLabel}`, isSegment: true },
    { key: 'status',  label: 'ESTADO',         mLabel: 'Estado',         val: `${s.status}=${s.statusLabel}`,  isStatus: true  },
  ]

  const mapDur  = PHASE.mapEnd - PHASE.mapStart
  const stepDur = mapDur / FIELDS.length
  const stepIdx = Math.floor(clamp((time - PHASE.mapStart) / stepDur, 0, FIELDS.length - 0.001))
  const inMap   = time >= PHASE.mapStart && time <= PHASE.mapEnd

  const tFont = lerp(28, 20, zoomT)
  const tPad  = lerp(48, 32, zoomT)

  const caption = zoomT < 0.5 ? 'CLNT100 · COBOL/CICS' : fadeT > 0.5 ? 'MISMA SEMÁNTICA · MEJOR EXPERIENCIA' : 'MAPEO 1:1'

  return (
    <SceneFrame title="Mantenimiento de clientes" caption={caption}>
      <div style={{ position: 'absolute', inset: 0 }}>

        {/* Green terminal */}
        <div style={{
          position: 'absolute',
          left: tRect.left, top: tRect.top, width: tRect.width, height: tRect.height,
          background: C.tbg, borderRadius: 16, boxSizing: 'border-box', overflow: 'hidden',
          boxShadow: '0 30px 80px -20px rgba(28,25,23,0.35), 0 0 0 1px #1a2818',
          opacity: 1 - fadeT,
        }}>
          <CRTLines intensity={0.4} />
          <div style={{
            position: 'absolute', inset: tPad,
            fontFamily: '"IBM Plex Mono", monospace', fontSize: tFont,
            color: C.tg, textShadow: tGlow,
            lineHeight: 1.2, letterSpacing: '0.02em', whiteSpace: 'pre',
          }}>
            <div style={{ color: C.tamber, textShadow: tAmber }}>
              CLNT100   MANTENIMIENTO DE CLIENTES        [ MOD ]
            </div>
            {tSep(tFont)}
            <div>&nbsp;</div>
            {FIELDS.map((f, i) => {
              const tStart = PHASE.typeStart + i * 0.18
              const t = clamp((time - tStart) / 0.25, 0, 1)
              const visible = f.val.slice(0, Math.floor(f.val.length * t))
              const padded = (visible + (t > 0 && t < 1 ? '_' : ' ')).padEnd(28).slice(0, 28)
              const isFocus = inMap && stepIdx === i
              return (
                <div key={f.key} style={{
                  opacity: clamp(t * 1.5, 0, 1),
                  color: C.tg,
                  textShadow: isFocus
                    ? '0 0 10px rgba(74,222,128,1), 0 0 22px rgba(74,222,128,0.7), 0 0 36px rgba(74,222,128,0.3)'
                    : tGlow,
                  fontWeight: isFocus ? 600 : 400,
                }}>
                  {' ' + f.label.padEnd(16, '.') + ' : [' + padded + ']'}
                </div>
              )
            })}
            {tSep(tFont)}
            <div> F3=SALIR  F5=NUEVO  F6=GUARDAR  F12=CANCELAR</div>
          </div>
        </div>

        {/* Modern panel */}
        <div style={{
          position: 'absolute',
          left: mRect.left, top: mRect.top, width: mRect.width, height: mRect.height,
          background: C.neutralBg, borderRadius: 16, boxSizing: 'border-box', overflow: 'hidden',
          boxShadow: '0 30px 80px -30px rgba(28,25,23,0.18)', border: `1px solid ${C.neutralBorder}`,
          padding: lerp(32, 44, fadeT), opacity: mRect.opacity,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 11, color: C.neutralMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Cliente · {s.idType} {s.id}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.neutralText, marginTop: 4 }}>{s.name}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <SegBadge code={s.segment} /><StatBadge code={s.status} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: lerp(24, 56, fadeT), rowGap: 0 }}>
            {FIELDS.map((f, i) => {
              const fStart = PHASE.mapStart + i * stepDur - 0.05
              const t = clamp((time - fStart) / 0.25, 0, 1)
              const eased = ease(t)
              const displayVal = f.isSegment
                ? s.segmentLabel.charAt(0) + s.segmentLabel.slice(1).toLowerCase()
                : f.isStatus
                ? s.statusLabel.charAt(0) + s.statusLabel.slice(1).toLowerCase()
                : f.val
              return (
                <div key={f.key} style={{
                  opacity: eased,
                  transform: `translateY(${(1 - eased) * 14}px)`,
                  gridColumn: f.key === 'address' ? 'span 2' : 'span 1',
                  marginBottom: lerp(14, 22, fadeT),
                }}>
                  <div style={{ fontSize: 11, color: C.neutralMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>
                    {f.mLabel}
                  </div>
                  <div style={{
                    border: `1px solid ${C.neutralBorder}`, borderRadius: 8,
                    padding: '10px 14px', fontSize: 14, color: C.neutralText, fontWeight: 500,
                    fontFamily: f.mono ? '"IBM Plex Mono", monospace' : 'inherit',
                    background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, minHeight: 22,
                  }}>
                    {displayVal}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </SceneFrame>
  )
}

// ── M2 — TABLE (CLNT200) ─────────────────────────────────────────────────────

export function SceneM2() {
  const time = useTime()
  const rows = BANK_DATA.rows
  const zoomT  = useZoomT(time)
  const slideT = useSlideT(time)
  const fadeT  = useFadeT(time)
  const tRect  = terminalRect(zoomT)
  const mRect  = modernRect(slideT, fadeT)

  const COLS = [
    { key: 'id',  label: 'IDENTIF.', mLabel: 'Identificación' },
    { key: 'nm',  label: 'NOMBRE',   mLabel: 'Nombre'         },
    { key: 'seg', label: 'SEG',      mLabel: 'Segmento'       },
    { key: 'est', label: 'EST',      mLabel: 'Estado'         },
    { key: 'cty', label: 'CIUDAD',   mLabel: 'Ciudad'         },
    { key: 'prd', label: 'PRD',      mLabel: 'Productos'      },
  ]

  const mapDur  = PHASE.mapEnd - PHASE.mapStart
  const stepDur = mapDur / COLS.length
  const tFont   = lerp(24, 18, zoomT)
  const tPad    = lerp(48, 28, zoomT)

  const caption = zoomT < 0.5 ? 'CLNT200 · SUBFILE' : fadeT > 0.5 ? 'MISMA DATA · LECTURA HUMANA' : 'CADA COLUMNA, SU TIPO'

  const colGrid = `${tFont * 1.8}px ${tFont * 5.4}px 1fr ${tFont * 1.8}px ${tFont * 1.8}px ${tFont * 5.4}px ${tFont * 2}px`

  return (
    <SceneFrame title="Lista de clientes" caption={caption}>
      <div style={{ position: 'absolute', inset: 0 }}>

        {/* Terminal */}
        <div style={{
          position: 'absolute',
          left: tRect.left, top: tRect.top, width: tRect.width, height: tRect.height,
          background: C.tbg, borderRadius: 16, boxSizing: 'border-box', overflow: 'hidden',
          boxShadow: '0 30px 80px -20px rgba(28,25,23,0.35), 0 0 0 1px #1a2818',
          opacity: 1 - fadeT,
        }}>
          <CRTLines intensity={0.4} />
          <div style={{
            position: 'absolute', inset: tPad,
            fontFamily: '"IBM Plex Mono", monospace', fontSize: tFont,
            color: C.tg, textShadow: tGlow,
            lineHeight: 1.2, letterSpacing: '0.02em',
          }}>
            <div style={{ color: C.tamber, textShadow: tAmber, whiteSpace: 'pre' }}>
              CLNT200   BROWSE - CLIENTES                  PAG 01/87
            </div>
            {tSep(tFont)}
            <div style={{ display: 'grid', gridTemplateColumns: colGrid, gap: tFont * 0.4, padding: '0 4px' }}>
              <div>SEL</div>
              {COLS.map((c) => (
                <div key={c.key} style={{ textAlign: c.key === 'prd' ? 'right' : 'left' }}>{c.label}</div>
              ))}
            </div>
            {tSep(tFont)}
            {rows.map((r, i) => {
              const t = clamp((time - PHASE.typeStart - i * 0.16) / 0.25, 0, 1)
              return (
                <div key={r.id} style={{
                  display: 'grid', gridTemplateColumns: colGrid, gap: tFont * 0.4, padding: '0 4px',
                  opacity: clamp(t * 1.5, 0, 1),
                  color: C.tg,
                  textShadow: r.selected
                    ? '0 0 10px rgba(74,222,128,1), 0 0 22px rgba(74,222,128,0.7), 0 0 36px rgba(74,222,128,0.3)'
                    : tGlow,
                  fontWeight: r.selected ? 600 : 400,
                }}>
                  <div>{r.selected ? '>>' : ''}</div>
                  <div>{r.id.slice(0, Math.ceil(r.id.length * t))}</div>
                  <div>{r.name.slice(0, Math.ceil(r.name.length * t))}</div>
                  <div>{t > 0.6 ? r.segment : ''}</div>
                  <div>{t > 0.6 ? r.status : ''}</div>
                  <div>{r.city.slice(0, Math.ceil(r.city.length * t))}</div>
                  <div style={{ textAlign: 'right' }}>{t > 0.7 ? r.prod : ''}</div>
                </div>
              )
            })}
            {tSep(tFont)}
            <div> OPCION ===&gt; _</div>
            <div> F3=SALIR  F7=ANT  F8=SIG  F12=CANCELAR</div>
          </div>
        </div>

        {/* Modern panel */}
        <div style={{
          position: 'absolute',
          left: mRect.left, top: mRect.top, width: mRect.width, height: mRect.height,
          background: C.neutralBg, borderRadius: 16, boxSizing: 'border-box', overflow: 'hidden',
          boxShadow: '0 30px 80px -30px rgba(28,25,23,0.18)', border: `1px solid ${C.neutralBorder}`,
          opacity: mRect.opacity,
        }}>
          <div style={{
            padding: '20px 24px', borderBottom: `1px solid ${C.neutralBorder}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.neutralText }}>Clientes</div>
            <div style={{ fontSize: 12, color: C.neutralMuted, fontFamily: '"IBM Plex Mono", monospace' }}>87 páginas</div>
            <div style={{ flex: 1 }} />
            <div style={{
              border: `1px solid ${C.neutralBorder}`, borderRadius: 8,
              padding: '6px 12px', fontSize: 13, color: C.neutralMuted,
              display: 'flex', alignItems: 'center', gap: 8, minWidth: 220,
            }}>⌕ <span>Buscar cliente…</span></div>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 110px 130px 150px 80px',
            padding: '12px 24px',
            fontSize: 11, color: C.neutralMuted,
            textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
            background: C.surface, borderBottom: `1px solid ${C.neutralBorder}`,
          }}>
            {COLS.map((c) => (
              <div key={c.key} style={{ textAlign: c.key === 'prd' ? 'right' : 'left' }}>{c.mLabel}</div>
            ))}
          </div>

          <div>
            {rows.map((r, ri) => (
              <div key={r.id} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr 110px 130px 150px 80px',
                padding: '14px 24px', fontSize: 14, color: C.neutralText,
                background: r.selected ? C.accentBg : 'transparent',
                borderBottom: `1px solid ${C.neutralBorder}`,
                fontWeight: r.selected ? 600 : 500, alignItems: 'center',
              }}>
                {COLS.map((c, ci) => {
                  const fStart = PHASE.mapStart + ci * stepDur - 0.05
                  const t = clamp((time - fStart - ri * 0.025) / 0.25, 0, 1)
                  const eased = ease(t)
                  const cellStyle: React.CSSProperties = { opacity: eased, transform: `translateY(${(1 - eased) * 8}px)` }

                  let content: React.ReactNode = null
                  switch (c.key) {
                    case 'id':  content = <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, color: r.selected ? C.accent : C.neutralMuted }}>{r.id}</span>; break
                    case 'nm':  content = r.name; break
                    case 'seg': content = <SegBadge code={r.segment} />; break
                    case 'est': content = <StatBadge code={r.status} />; break
                    case 'cty': content = <span style={{ color: C.neutralMuted, fontSize: 13 }}>{r.city}</span>; break
                    case 'prd': content = <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, textAlign: 'right', display: 'block' }}>{r.prod}</span>; break
                  }
                  return <div key={c.key} style={cellStyle}>{content}</div>
                })}
              </div>
            ))}
          </div>
        </div>

      </div>
    </SceneFrame>
  )
}

// ── M3 — DETAIL (CTAS150) ────────────────────────────────────────────────────

export function SceneM3() {
  const time = useTime()
  const a = BANK_DATA.account
  const zoomT  = useZoomT(time)
  const slideT = useSlideT(time)
  const fadeT  = useFadeT(time)
  const tRect  = terminalRect(zoomT)
  const mRect  = modernRect(slideT, fadeT)

  const fmt = (n: number) => n.toLocaleString('es-CO')

  const FOCI = [
    { key: 'number'    },
    { key: 'status'    },
    { key: 'balance'   },
    { key: 'available' },
    { key: 'movements' },
  ]
  const mapDur  = PHASE.mapEnd - PHASE.mapStart
  const stepDur = mapDur / FOCI.length

  const tFont = lerp(24, 17, zoomT)
  const tPad  = lerp(40, 22, zoomT)

  const greenLines = [
    { k: 'CUENTA . . . . . :', v: `${a.number}  TIPO ${a.type}` },
    { k: 'TITULAR  . . . . :', v: a.holder                      },
    { k: 'IDENTIFICACION . :', v: a.holderId                    },
    { k: 'OFICINA  . . . . :', v: a.branch                      },
    { k: 'F.APERTURA . . . :', v: a.openDate                    },
    { k: 'ESTADO . . . . . :', v: `${a.status} = ${a.statusLabel}` },
  ]

  const caption = zoomT < 0.5 ? 'CTAS150 · SALDOS Y MOVIMIENTOS' : fadeT > 0.5 ? 'MISMOS DATOS · MEJOR JERARQUÍA' : 'DATO A DATO'

  const tBal = clamp((time - PHASE.typeStart - 0.9) / 0.4, 0, 1)
  const eH   = ease(clamp((time - PHASE.mapStart + 0.05) / 0.5, 0, 1))
  const eS   = ease(clamp((time - PHASE.mapStart - stepDur + 0.05) / 0.5, 0, 1))
  const eBal = ease(clamp((time - PHASE.mapStart - 2 * stepDur + 0.05) / 0.5, 0, 1))
  const eMov = ease(clamp((time - PHASE.mapStart - 4 * stepDur + 0.05) / 0.5, 0, 1))

  return (
    <SceneFrame title="Detalle de cuenta" caption={caption}>
      <div style={{ position: 'absolute', inset: 0 }}>

        {/* Terminal */}
        <div style={{
          position: 'absolute',
          left: tRect.left, top: tRect.top, width: tRect.width, height: tRect.height,
          background: C.tbg, borderRadius: 16, boxSizing: 'border-box', overflow: 'hidden',
          boxShadow: '0 30px 80px -20px rgba(28,25,23,0.35), 0 0 0 1px #1a2818',
          opacity: 1 - fadeT,
        }}>
          <CRTLines intensity={0.4} />
          <div style={{
            position: 'absolute', inset: tPad,
            fontFamily: '"IBM Plex Mono", monospace', fontSize: tFont,
            color: C.tg, textShadow: tGlow,
            lineHeight: 1.2, letterSpacing: '0.02em', whiteSpace: 'pre',
          }}>
            <div style={{ color: C.tamber, textShadow: tAmber }}>
              CTAS150   CONSULTA DE CUENTA                 USR: OPER01
            </div>
            {tSep(tFont)}
            {greenLines.map((l, i) => {
              const t = clamp((time - PHASE.typeStart - i * 0.13) / 0.25, 0, 1)
              return (
                <div key={i} style={{ opacity: clamp(t * 1.5, 0, 1) }}>
                  {' ' + l.k + ' ' + l.v.slice(0, Math.floor(l.v.length * t))}
                </div>
              )
            })}
            {tSep(tFont)}
            <div style={{ opacity: tBal }}>
              {' SALDO TOTAL . . :'}<span style={{ fontWeight: 700 }}> ${fmt(a.balance)} {a.currency}</span>
            </div>
            <div style={{ opacity: tBal }}>
              {' SALDO DISPONIBLE:'} ${fmt(a.available)} {a.currency}
            </div>
            <div style={{ opacity: tBal }}>
              {' RETENIDO . . . . :'} ${fmt(a.held)} {a.currency}
            </div>
            {tSep(tFont)}
            <div> ULTIMOS MOVIMIENTOS:</div>
            {a.movements.slice(0, 4).map((m, i) => {
              const t = clamp((time - PHASE.typeStart - 1.3 - i * 0.12) / 0.25, 0, 1)
              const line = ` ${m.date} ${m.desc.padEnd(22)} ${m.ref}  ${m.sign}${fmt(Math.abs(m.amount)).padStart(11)}`
              return (
                <div key={i} style={{ opacity: t, color: C.tg }}>
                  {line.slice(0, Math.floor(line.length * t))}
                </div>
              )
            })}
            <div> F3=SALIR  F8=MAS  F12=CANCELAR</div>
          </div>
        </div>

        {/* Modern panel */}
        <div style={{
          position: 'absolute',
          left: mRect.left, top: mRect.top, width: mRect.width, height: mRect.height,
          background: C.neutralBg, borderRadius: 16, boxSizing: 'border-box', overflow: 'hidden',
          boxShadow: '0 30px 80px -30px rgba(28,25,23,0.18)', border: `1px solid ${C.neutralBorder}`,
          opacity: mRect.opacity, padding: lerp(22, 32, fadeT),
        }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ opacity: eH, transform: `translateY(${(1 - eH) * 12}px)` }}>
              <div style={{ fontSize: 11, color: C.neutralMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Cuenta {a.typeLabel.toLowerCase()}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.neutralText, marginTop: 4, fontFamily: '"IBM Plex Mono", monospace' }}>
                {a.number}
              </div>
              <div style={{ fontSize: 12, color: C.neutralMuted, marginTop: 4 }}>{a.holder} · {a.holderId}</div>
              <div style={{ fontSize: 12, color: C.neutralMuted, marginTop: 2 }}>{a.branch} · Apertura {a.openDate}</div>
            </div>
            <div style={{ opacity: eS, transform: `translateY(${(1 - eS) * 12}px)` }}>
              <StatBadge code={a.status} scale={1.1} />
            </div>
          </div>

          {/* Balance card */}
          <div style={{
            background: C.accent, color: '#fff', borderRadius: 12, padding: '18px 22px', marginBottom: 14,
            opacity: eBal, transform: `translateY(${(1 - eBal) * 12}px)`,
            boxShadow: '0 12px 32px -12px rgba(37,99,235,0.45)',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Saldo total
            </div>
            <div style={{ fontSize: 36, fontWeight: 600, marginTop: 4, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              ${fmt(a.balance)} <span style={{ fontSize: 15, opacity: 0.7, fontWeight: 500 }}>{a.currency}</span>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 12, fontSize: 12 }}>
              <div>
                <div style={{ opacity: 0.7 }}>Disponible</div>
                <div style={{ fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace', marginTop: 2 }}>${fmt(a.available)}</div>
              </div>
              <div>
                <div style={{ opacity: 0.7 }}>Retenido</div>
                <div style={{ fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace', marginTop: 2 }}>${fmt(a.held)}</div>
              </div>
            </div>
          </div>

          {/* Movements */}
          <div style={{ opacity: eMov, transform: `translateY(${(1 - eMov) * 12}px)` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.neutralText, marginBottom: 8 }}>Últimos movimientos</div>
            <div style={{ border: `1px solid ${C.neutralBorder}`, borderRadius: 10, overflow: 'hidden' }}>
              {a.movements.slice(0, 4).map((m, i) => {
                const isPos = m.sign === '+'
                return (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr auto',
                    alignItems: 'center', gap: 14, padding: '10px 14px',
                    borderBottom: i < 3 ? `1px solid ${C.neutralBorder}` : 'none',
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 15,
                      background: isPos ? 'rgba(21,128,61,0.1)' : C.surface,
                      color: isPos ? C.activeGreen : C.neutralMuted,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                    }}>
                      {isPos ? '+' : '−'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: C.neutralText, fontWeight: 500 }}>
                        {m.desc.split(' ').map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                      </div>
                      <div style={{ fontSize: 11, color: C.neutralMuted, fontFamily: '"IBM Plex Mono", monospace', marginTop: 2 }}>
                        {m.date} · {m.ref}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: isPos ? C.activeGreen : C.neutralText,
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {isPos ? '+' : '−'}${fmt(Math.abs(m.amount))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </SceneFrame>
  )
}
