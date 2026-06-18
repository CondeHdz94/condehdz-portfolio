import React from 'react'
import { Sprite, useSprite, useTimeEffect, Easing, clamp } from '../../../components/animation'
import { useLang } from '../../../i18n/LangContext'
import type { Uni2T } from '../../../i18n/types'
import { Caption, CaptionLine } from './captions'
import { Shot1Chaos } from './Shot1Chaos'
import { AcmeMark, BrandPill, Particles, StepIcon, INFO_CREDIT_FIELDS, TENANT_PRESETS } from './animMocks'

type ReelStrings = Uni2T['reel']

// ── 30.7s "Resumen" reel ──────────────────────────────────────────────────────
// Presenta la idea de Uni2 (originación composable, multi-entidad) y mapea las
// 4 piezas que cada deep-dive profundiza:
//   01 Captura declarativa · 02 Decisión (analista) · 03 Composable por rol ·
//   04 Multi-tenant / white-label.
//
// Arco:
//   00.0–03.9  Gancho · el caos antiguo (reusa Shot1Chaos)
//   03.5–10.2  Tesis · qué es Uni2 + steps reusables
//   09.8–26.8  Cómo funciona · rail de 4 pilares + visual por pieza
//   26.7–30.7  Cierre · logo + tagline
//
// Todo el copy visible vive en i18n (t.cases.uni2.reel). Los identificadores
// neutros (IDs de solicitud, nombres propios, datos de muestra, nombres de
// archivo, códigos de campo) se quedan en el componente — no se traducen.

const OV_PILLAR_ACCENTS = ['#6b8fff', '#7fb8ff', '#a8c2ff', '#5fd49a']
const OV_PILLAR_NUMS = ['01', '02', '03', '04']

const OV_CHAPTERS_START = 9.8
const OV_PILLAR_DUR = 4.0
const OV_CLOSE_START = 26.7

// Steps reusables — iconos (los labels vienen de i18n por índice). Mezcla
// deliberada de actuales + plausibles a futuro para comunicar extensibilidad.
const OV_STEP_ICONS = [
  'pre-approver',
  'info-client',
  'info-credit',
  'info-contact',
  'insurability',
  'data-authorization',
  'documents',
  'insurability',
  'data-authorization',
  'pre-approver',
  'info-credit',
  'info-contact',
  'decision',
  'info-credit',
  'decision',
]

// ── Local fade wrapper ─────────────────────────────────────────────────────────
function OvWrap({
  children,
  fadeInDur = 0.4,
  fadeOutStart,
  fadeOutDur = 0.5,
}: {
  children: React.ReactNode
  fadeInDur?: number
  fadeOutStart?: number
  fadeOutDur?: number
}) {
  const { localTime } = useSprite()
  let o = 1
  if (fadeInDur > 0 && localTime < fadeInDur) {
    o = Easing.easeOutCubic(localTime / fadeInDur)
  } else if (fadeOutStart != null && localTime > fadeOutStart) {
    const t = clamp((localTime - fadeOutStart) / fadeOutDur, 0, 1)
    o = 1 - Easing.easeInCubic(t)
  }
  return <div style={{ position: 'absolute', inset: 0, opacity: o }}>{children}</div>
}

// ────────────────────────────────────────────────────────────────────────────
// REEL ROOT
// ────────────────────────────────────────────────────────────────────────────
export function Uni2SaaSReel() {
  const { t } = useLang()
  const r = t.cases.uni2.reel

  return (
    <div className="uni2-saas-reel" style={{ position: 'absolute', inset: 0, background: '#03060f' }}>
      {/* 01 — Gancho (caos) */}
      <Sprite start={0} end={3.9}>
        <OvWrap fadeInDur={0} fadeOutStart={3.4} fadeOutDur={0.5}>
          <Shot1Chaos />
        </OvWrap>
      </Sprite>

      {/* 02 — Tesis */}
      <Sprite start={3.5} end={10.2}>
        <OvWrap fadeInDur={0.5} fadeOutStart={6.1} fadeOutDur={0.6}>
          <ThesisScene r={r} />
        </OvWrap>
      </Sprite>

      {/* 03 — Cómo funciona (4 pilares) */}
      <Sprite start={OV_CHAPTERS_START} end={OV_CLOSE_START + 0.1}>
        <OvWrap fadeInDur={0.5} fadeOutStart={OV_CLOSE_START - OV_CHAPTERS_START - 0.4} fadeOutDur={0.5}>
          <ChaptersScene r={r} />
        </OvWrap>
      </Sprite>

      {/* 04 — Cierre */}
      <Sprite start={OV_CLOSE_START} end={30.7}>
        <OvWrap fadeInDur={0.6}>
          <ClosingScene r={r} />
        </OvWrap>
      </Sprite>

      {/* Caption — solo el gancho */}
      <Caption start={0.6} end={3.3}>
        <CaptionLine kicker={r.caption.kicker} line={r.caption.line} italic={[3]} size={66} />
      </Caption>

      <OvBrandMark sublabel={r.brandSublabel} />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// THESIS — qué es Uni2
// ────────────────────────────────────────────────────────────────────────────
function ThesisScene({ r }: { r: ReelStrings }) {
  const { localTime } = useSprite()
  const kicker = clamp((localTime - 0.2) / 0.5, 0, 1)
  const title = clamp((localTime - 0.5) / 0.7, 0, 1)
  const sub = clamp((localTime - 1.1) / 0.6, 0, 1)
  const stripEnter = clamp((localTime - 1.7) / 0.5, 0, 1)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 40%, #0e1a3a 0%, #060b1c 60%, #03060f 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="dotgrid" />
      <Particles count={20} seed={2024} />

      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 15,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#6b8fff',
          marginBottom: 22,
          opacity: kicker,
          transform: `translateY(${(1 - kicker) * -10}px)`,
        }}
      >
        {r.thesis.kicker}
      </div>

      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 116,
          color: '#ECECEA',
          lineHeight: 0.98,
          letterSpacing: '-0.03em',
          textAlign: 'center',
          maxWidth: 1500,
          whiteSpace: 'nowrap',
          opacity: title,
          transform: `translateY(${(1 - title) * 16}px)`,
        }}
      >
        {r.thesis.title} <span style={{ fontStyle: 'italic' }}>{r.thesis.titleItalic}</span>
      </div>

      <div
        style={{
          fontFamily: 'var(--f-ui)',
          fontSize: 24,
          color: 'rgba(236,236,234,0.6)',
          marginTop: 22,
          letterSpacing: '0.02em',
          textAlign: 'center',
          opacity: sub,
          transform: `translateY(${(1 - sub) * 10}px)`,
        }}
      >
        {r.thesis.sub}
      </div>

      {/* Reusable steps strip */}
      <div
        style={{
          marginTop: 52,
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 1640,
          opacity: stripEnter,
        }}
      >
        {OV_STEP_ICONS.map((icon, i) => {
          const e = clamp((localTime - 1.9 - i * 0.07) / 0.45, 0, 1)
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '13px 22px',
                background: 'rgba(107,143,255,0.06)',
                border: '1px solid rgba(107,143,255,0.28)',
                borderRadius: 999,
                opacity: e,
                whiteSpace: 'nowrap',
                transform: `translateY(${(1 - e) * 14}px) scale(${0.9 + 0.1 * Easing.easeOutBack(e)})`,
              }}
            >
              <StepIcon id={icon} size={20} color="#a8c2ff" />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 19, color: '#ECECEA', letterSpacing: '0.02em' }}>
                {r.steps[i]}
              </span>
            </div>
          )
        })}
        {/* extensibilidad */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '13px 22px',
            border: '1px dashed rgba(107,143,255,0.45)',
            borderRadius: 999,
            opacity: clamp((localTime - 3.1) / 0.5, 0, 1),
            fontFamily: 'var(--f-mono)',
            fontSize: 19,
            color: 'rgba(168,194,255,0.85)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {r.thesis.addStep}
        </div>
      </div>

      <div className="vignette" />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// CHAPTERS — rail + per-pillar visual
// ────────────────────────────────────────────────────────────────────────────
function ChaptersScene({ r }: { r: ReelStrings }) {
  const { localTime } = useSprite()
  const railEnter = clamp(localTime / 0.7, 0, 1)

  const active = clamp(Math.floor((localTime - 0.9) / OV_PILLAR_DUR), 0, r.pillars.length - 1)
  const pillarLocal = localTime - 0.9 - active * OV_PILLAR_DUR
  // Crossfade suave del visual entre piezas
  const isLastPillar = active === r.pillars.length - 1
  const inEnv = clamp(pillarLocal / 0.45, 0, 1)
  const outEnv = isLastPillar ? 1 : 1 - clamp((pillarLocal - (OV_PILLAR_DUR - 0.5)) / 0.45, 0, 1)
  const visualEnv = Easing.easeOutCubic(inEnv) * outEnv

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 40%, #0e1a3a 0%, #060b1c 65%, #03060f 100%)',
        overflow: 'hidden',
      }}
    >
      <div className="dotgrid" />
      <Particles count={16} seed={777} />

      {/* Section heading */}
      <div style={{ position: 'absolute', left: 80, top: 232, opacity: railEnter, transform: `translateY(${(1 - railEnter) * 10}px)` }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#6b8fff' }}>
          {r.chaptersHeading}
        </div>
      </div>

      {/* Left rail — chapters */}
      <div style={{ position: 'absolute', left: 80, top: 300, width: 620, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {r.pillars.map((p, i) => {
          const accent = OV_PILLAR_ACCENTS[i]
          const e = clamp((localTime - 0.5 - i * 0.12) / 0.5, 0, 1)
          const isActive = i === active
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 18,
                padding: isActive ? '18px 22px' : '14px 22px',
                borderRadius: 12,
                background: isActive ? `${accent}18` : 'rgba(255,255,255,0.02)',
                border: isActive ? `1.5px solid ${accent}` : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isActive ? `0 0 40px ${accent}33, inset 0 0 0 1px ${accent}33` : 'none',
                opacity: e * (isActive ? 1 : 0.5),
                transform: `translateX(${(1 - e) * -20}px)`,
                transition: 'background 320ms ease, border-color 320ms ease, box-shadow 320ms ease, padding 320ms ease, opacity 320ms ease',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: isActive ? 40 : 32,
                  fontStyle: 'italic',
                  lineHeight: 1,
                  color: isActive ? accent : 'rgba(236,236,234,0.5)',
                  minWidth: 56,
                  transition: 'font-size 320ms ease, color 320ms ease',
                }}
              >
                {OV_PILLAR_NUMS[i]}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--f-ui)',
                    fontSize: isActive ? 27 : 23,
                    fontWeight: 600,
                    color: isActive ? '#ECECEA' : 'rgba(236,236,234,0.6)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.15,
                    transition: 'font-size 320ms ease, color 320ms ease',
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--f-ui)',
                    fontSize: 17,
                    color: 'rgba(236,236,234,0.55)',
                    marginTop: 6,
                    lineHeight: 1.3,
                    maxHeight: isActive ? 60 : 0,
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 320ms ease, opacity 320ms ease',
                  }}
                >
                  {p.line}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Right visual */}
      <div style={{ position: 'absolute', left: 720, right: 56, top: 248, bottom: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          key={active}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: visualEnv,
            transform: `translateY(${(1 - inEnv) * 14}px)`,
          }}
        >
          <PillarVisual idx={active} t={pillarLocal} r={r} />
        </div>
      </div>

      <div className="vignette" />
    </div>
  )
}

function PillarVisual({ idx, t, r }: { idx: number; t: number; r: ReelStrings }) {
  if (idx === 0) return <PillarCaptura t={t} r={r} />
  if (idx === 1) return <PillarDecision t={t} r={r} />
  if (idx === 2) return <PillarRoles t={t} r={r} />
  return <PillarTenant t={t} r={r} />
}

// ── Pillar 01 · config → form ───────────────────────────────────────────────────
function PillarCaptura({ t, r }: { t: number; r: ReelStrings }) {
  const fields = INFO_CREDIT_FIELDS.slice(0, 4)
  const intro = clamp(t / 0.5, 0, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: intro, transform: `translateY(${(1 - intro) * 16}px)` }}>
      {/* config card */}
      <div
        style={{
          width: 460,
          background: 'linear-gradient(180deg, #0c1228 0%, #080d1f 100%)',
          border: '1px solid rgba(107,143,255,0.2)',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'var(--f-mono)',
            fontSize: 12,
            color: '#7a8294',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 4, background: '#ff5f57' }} />
          <span style={{ width: 8, height: 8, borderRadius: 4, background: '#febc2e' }} />
          <span style={{ width: 8, height: 8, borderRadius: 4, background: '#28c840' }} />
          <span style={{ marginLeft: 8 }}>fields.config.ts</span>
        </div>
        <div style={{ padding: '20px 22px', fontFamily: 'var(--f-mono)', fontSize: 16, lineHeight: 1.95 }}>
          {fields.map((f, i) => {
            const e = clamp((t - 0.4 - i * 0.18) / 0.4, 0, 1)
            return (
              <div key={f.name} style={{ opacity: e, transform: `translateX(${(1 - e) * -8}px)`, whiteSpace: 'nowrap' }}>
                <span style={{ color: '#3a4561' }}>{'{ '}</span>
                <span style={{ color: '#7dd3fc' }}>name</span>
                <span style={{ color: '#7a8294' }}>:</span>
                <span style={{ color: '#fbbf24' }}> "{f.name}"</span>
                <span style={{ color: '#7a8294' }}>, </span>
                <span style={{ color: '#7dd3fc' }}>type</span>
                <span style={{ color: '#7a8294' }}>:</span>
                <span style={{ color: '#5fd49a' }}> "{f.type}"</span>
                <span style={{ color: '#3a4561' }}> {'}'}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* arrow */}
      <div style={{ opacity: clamp((t - 1.0) / 0.4, 0, 1) }}>
        <svg width="56" height="24" viewBox="0 0 56 24" fill="none">
          <path d="M2 12h48M40 4l10 8-10 8" stroke="#6b8fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* form card */}
      <div
        style={{
          width: 480,
          background: 'linear-gradient(180deg, #0e1530 0%, #0a1027 100%)',
          border: '1px solid rgba(107,143,255,0.2)',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AcmeMark size={16} color="#6b8fff" />
          <span style={{ fontFamily: 'var(--f-ui)', fontSize: 14, color: '#ECECEA', fontWeight: 600 }}>{r.captura.formTitle}</span>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map((f, i) => {
            const e = clamp((t - 1.3 - i * 0.16) / 0.4, 0, 1)
            const filled = e > 0.3
            return (
              <div key={f.name} style={{ opacity: clamp((t - 1.1) / 0.4, 0, 1) }}>
                <div
                  style={{
                    fontFamily: 'var(--f-mono)',
                    fontSize: 12,
                    color: '#7a8294',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  {r.captura.fieldLabels[f.name] ?? f.label}
                </div>
                <div
                  style={{
                    height: 46,
                    borderRadius: 9,
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    background: filled ? 'rgba(58,108,255,0.08)' : 'rgba(255,255,255,0.02)',
                    border: filled ? '1px solid rgba(107,143,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'var(--f-ui)',
                    fontSize: 18,
                    color: '#ECECEA',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'background 220ms, border 220ms',
                  }}
                >
                  {filled ? f.display || '—' : ''}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Pillar 02 · decision snapshot ───────────────────────────────────────────────
function PillarDecision({ t, r }: { t: number; r: ReelStrings }) {
  const e = clamp(t / 0.6, 0, 1)
  const score = Math.round(742 * Easing.easeOutCubic(clamp(t / 1.4, 0, 1)))
  return (
    <div
      style={{
        width: 680,
        background: 'linear-gradient(180deg, #0e1530 0%, #0a1027 100%)',
        border: '1px solid rgba(107,143,255,0.22)',
        borderRadius: 16,
        boxShadow: '0 28px 70px rgba(0,0,0,0.55)',
        overflow: 'hidden',
        opacity: e,
        transform: `translateY(${(1 - e) * 18}px)`,
      }}
    >
      {/* header */}
      <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <AcmeMark size={20} color="#6b8fff" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: '#5a637a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SOL-2026-04781</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 32, color: '#ECECEA', lineHeight: 1.1, marginTop: 2, whiteSpace: 'nowrap' }}>
            Tatiana Avilés Restrepo
          </div>
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 15, color: 'rgba(236,236,234,0.7)', whiteSpace: 'nowrap' }}>$ 28.0M · 36m</div>
      </div>
      {/* body */}
      <div style={{ padding: '26px 28px', display: 'flex', alignItems: 'center', gap: 36 }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: '#5a637a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r.decision.scoreLabel}</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 82, color: '#ECECEA', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{score}</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 16, color: '#6b8fff', marginTop: 4 }}>{r.decision.riskLabel}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {r.decision.rules.map((rule, i) => {
            const re = clamp((t - 0.9 - i * 0.3) / 0.4, 0, 1)
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: re, transform: `translateX(${(1 - re) * 12}px)` }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    background: '#5fd49a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 0 12px rgba(95,212,154,0.5)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 10 10">
                    <path d="M2 5l2 2 4-4" stroke="#06291d" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--f-ui)', fontSize: 19, color: '#ECECEA' }}>{rule}</span>
              </div>
            )
          })}
        </div>
      </div>
      {/* footer */}
      <div style={{ padding: '0 28px 26px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 15, color: '#5fd49a', letterSpacing: '0.04em' }}>{r.decision.rulesCount}</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: '15px 34px',
            borderRadius: 10,
            background: '#3a6cff',
            color: '#fff',
            fontFamily: 'var(--f-ui)',
            fontSize: 19,
            fontWeight: 600,
            boxShadow: `0 10px 28px rgba(58,108,255,0.4), 0 0 0 ${clamp(t - 1.8, 0, 1) * 6}px rgba(107,143,255,0.15)`,
          }}
        >
          {r.decision.approve}
        </div>
      </div>
    </div>
  )
}

// ── Pillar 03 · roles ───────────────────────────────────────────────────────────
const OV_ROLE_LANES = [
  { accent: '#6b8fff', steps: ['pre-approver', 'info-client', 'info-credit', 'documents'] },
  { accent: '#7fb8ff', steps: ['info-client', 'info-credit', 'documents'] },
  { accent: '#a8c2ff', steps: ['info-client', 'info-credit', 'decision'] },
]

function PillarRoles({ t, r }: { t: number; r: ReelStrings }) {
  const e = clamp(t / 0.5, 0, 1)
  return (
    <div style={{ width: '100%', paddingLeft: 48, opacity: e, transform: `translateY(${(1 - e) * 16}px)` }}>
      {/* expediente chip */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 16px',
          marginBottom: 22,
          background: 'linear-gradient(180deg, #101a3a 0%, #0a1227 100%)',
          border: '1px solid rgba(107,143,255,0.5)',
          borderRadius: 999,
          boxShadow: '0 0 28px rgba(107,143,255,0.3)',
          opacity: clamp((t - 0.4) / 0.5, 0, 1),
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 4, background: '#6b8fff', boxShadow: '0 0 8px #6b8fff' }} />
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16, color: '#6b8fff', fontWeight: 600, letterSpacing: '0.06em' }}>SOL-04781</span>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16, color: 'rgba(236,236,234,0.7)' }}>{r.roles.chipSuffix}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {OV_ROLE_LANES.map((lane, li) => {
          const laneCopy = r.roles.lanes[li]
          const le = clamp((t - 0.5 - li * 0.18) / 0.5, 0, 1)
          return (
            <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: le, transform: `translateX(${(1 - le) * -16}px)` }}>
              <div style={{ width: 168, flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 30, fontStyle: 'italic', color: '#ECECEA', lineHeight: 1 }}>{laneCopy.name}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: lane.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 5 }}>
                  {laneCopy.role}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {lane.steps.map((sid, si) => {
                  const ce = clamp((t - 0.7 - li * 0.18 - si * 0.1) / 0.4, 0, 1)
                  return (
                    <React.Fragment key={sid}>
                      {si > 0 && (
                        <svg width="14" height="14" viewBox="0 0 12 12" style={{ opacity: ce, flexShrink: 0 }}>
                          <path d="M3 2l4 4-4 4" stroke={`${lane.accent}99`} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                          padding: '12px 16px',
                          borderRadius: 9,
                          background: `${lane.accent}12`,
                          border: `1px solid ${lane.accent}44`,
                          opacity: ce,
                          transform: `scale(${0.9 + 0.1 * ce})`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <StepIcon id={sid} size={18} color={lane.accent} />
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 16, color: '#ECECEA' }}>{r.stepLabels[sid]}</span>
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Pillar 04 · multi-tenant ────────────────────────────────────────────────────
function PillarTenant({ t, r }: { t: number; r: ReelStrings }) {
  const tenants = TENANT_PRESETS['acme-vs-microcredito']
  const e = clamp(t / 0.6, 0, 1)
  return (
    <div style={{ display: 'flex', gap: 28, opacity: e }}>
      {tenants.map((tn, i) => {
        const te = clamp((t - 0.3 - i * 0.25) / 0.5, 0, 1)
        const tcopy = r.tenants[tn.id]
        const ltn = tcopy ? { ...tn, name: tcopy.name, tagline: tcopy.tagline } : tn
        return (
          <div
            key={tn.id}
            style={{
              width: 346,
              background: 'linear-gradient(180deg, #0c1228 0%, #080d1f 100%)',
              border: `1px solid ${tn.primary}55`,
              borderRadius: 14,
              boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 50px ${tn.primary}22`,
              overflow: 'hidden',
              opacity: te,
              transform: `translateY(${(1 - te) * 20}px)`,
            }}
          >
            <div style={{ padding: '20px 22px 16px', borderBottom: `1px solid ${tn.primary}22`, background: `linear-gradient(180deg, ${tn.primary}12 0%, transparent 100%)` }}>
              <BrandPill tenant={ltn} size={28} />
            </div>
            <div style={{ padding: '18px 22px 22px' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: '#5a637a', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                {r.tenant.flowLabel} · {tn.steps.length} steps
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tn.steps.map((sid, si) => {
                  const se = clamp((t - 0.7 - i * 0.2 - si * 0.08) / 0.4, 0, 1)
                  return (
                    <div
                      key={sid}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 11,
                        padding: '10px 12px',
                        borderRadius: 7,
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${tn.primary}22`,
                        opacity: se,
                        transform: `translateX(${(1 - se) * -8}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 5,
                          background: `linear-gradient(135deg, ${tn.primary}, ${tn.accent})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--f-mono)',
                          fontSize: 12,
                          color: '#fff',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {si + 1}
                      </div>
                      <StepIcon id={sid} size={17} color={tn.accent} />
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 15, color: '#ECECEA' }}>{r.stepLabels[sid]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// CLOSING
// ────────────────────────────────────────────────────────────────────────────
function ClosingScene({ r }: { r: ReelStrings }) {
  const { localTime } = useSprite()
  const logoT = clamp(localTime / 0.7, 0, 1)
  const tagT = clamp((localTime - 0.5) / 0.6, 0, 1)
  const beam = Math.sin(localTime * 0.6) * 0.3 + 0.7
  const logoEased = Easing.easeOutBack(logoT)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, #0e1a3a 0%, #050a18 60%, #02050b 100%)',
        overflow: 'hidden',
      }}
    >
      <div className="beam" style={{ left: '25%', top: '-15%', width: 220, height: '120%', opacity: 0.7 * beam, transform: 'rotate(8deg)' }} />
      <div className="beam" style={{ right: '20%', top: '-15%', width: 220, height: '120%', opacity: 0.7 * beam, transform: 'rotate(-10deg)' }} />
      <div className="dotgrid" style={{ opacity: 0.4 }} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          transform: `translate(-50%, -50%) scale(${0.7 + logoEased * 0.3})`,
          opacity: logoT,
          display: 'flex',
          alignItems: 'center',
          gap: 26,
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6b8fff 0%, #3a6cff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 120px rgba(107,143,255,0.75), 0 30px 80px rgba(58,108,255,0.45)',
          }}
        >
          <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 96, color: '#fff', lineHeight: 1 }}>u</div>
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontStyle: 'italic',
            fontSize: 128,
            color: '#ECECEA',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: '0 0 60px rgba(107,143,255,0.35)',
          }}
        >
          uni2
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: '62%', textAlign: 'center', opacity: tagT, transform: `translateY(${(1 - tagT) * 12}px)` }}>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 42, color: 'rgba(236,236,234,0.9)', lineHeight: 1.0 }}>
          {r.closing.title} <span style={{ fontStyle: 'italic' }}>{r.closing.titleItalic}</span>
        </div>
      </div>

      <Particles count={26} seed={1337} />
      <div className="vignette" />
    </div>
  )
}

// ── Brand mark — bottom-left (imperative, no per-frame root re-render) ───────────
function OvBrandMark({ sublabel }: { sublabel: string }) {
  const divRef = React.useRef<HTMLDivElement>(null)

  useTimeEffect((time) => {
    const div = divRef.current
    if (!div) return
    const fadeIn = clamp((time - 1.0) / 0.8, 0, 1)
    const hide = time >= OV_CLOSE_START - 0.2
    div.style.opacity = String(clamp(fadeIn * (hide ? 0 : 1), 0, 1))
  })

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: 80,
        top: 88,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: 0,
        transition: 'opacity 400ms ease-in-out',
        zIndex: 90,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #6b8fff 0%, #3a6cff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 18px rgba(107,143,255,0.5)',
        }}
      >
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 20, color: '#fff', lineHeight: 1, fontStyle: 'italic' }}>u</div>
      </div>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ECECEA', fontWeight: 500 }}>
        uni2 saas
      </div>
      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(236,236,234,0.55)' }}>
        {sublabel}
      </div>
    </div>
  )
}
