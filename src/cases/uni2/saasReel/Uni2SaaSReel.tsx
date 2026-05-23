import React from 'react'
import { Sprite, useSprite, useTime, useTimeline, Easing, clamp } from '../../../components/animation'
import { Caption, CaptionLine } from './captions'
import { Shot1Chaos } from './Shot1Chaos'
import { Shot2ComercialForms } from './Shot2ComercialForms'
import { Shot4Analyst } from './Shot4Analyst'
import { Shot5Roles } from './Shot5Roles'
import { Shot6Multitenant } from './Shot6Multitenant'
import { Shot7Compose } from './Shot7Compose'
import { Shot8Closing } from './Shot8Closing'

// ── 45s timeline ─────────────────────────────────────────────────────────────
//   00–05  Shot 1 · Caos
//   05–13  Shot 2 · Comercial · forms + filtros + canales externos
//   13–25  Shot 4 · Analista decide + handoff
//   25–32  Shot 5 · Roles configurables
//   32–35  Shot 6 · Multi-tenant split
//   35–41  Shot 7 · Compose
//   41–45  Shot 8 · Cierre

export function Uni2SaaSReel() {
  const time = useTime()

  return (
    <div className="uni2-saas-reel" style={{ position: 'absolute', inset: 0, background: '#03060f' }}>
      <Sprite start={0} end={5.4}>
        <ShotWrap fadeOutStart={4.9} fadeOutDur={0.5}>
          <Shot1Chaos />
        </ShotWrap>
      </Sprite>

      <Sprite start={5} end={13.2}>
        <ShotWrap fadeInDur={0.4} fadeOutStart={12.7} fadeOutDur={0.5}>
          <Shot2ComercialForms materializationStyle="typed" />
        </ShotWrap>
      </Sprite>

      <Sprite start={13} end={25.2}>
        <ShotWrap fadeInDur={0.4} fadeOutStart={24.7} fadeOutDur={0.5}>
          <Shot4Analyst />
        </ShotWrap>
      </Sprite>

      <Sprite start={25} end={32.2}>
        <ShotWrap fadeInDur={0.5} fadeOutStart={31.7} fadeOutDur={0.5}>
          <Shot5Roles />
        </ShotWrap>
      </Sprite>

      <Sprite start={32} end={35.3}>
        <ShotWrap fadeInDur={0.4} fadeOutStart={34.9} fadeOutDur={0.4}>
          <Shot6Multitenant brandsPreset="acme-vs-microcredito" />
        </ShotWrap>
      </Sprite>

      <Sprite start={35} end={41.2}>
        <ShotWrap fadeInDur={0.4} fadeOutStart={40.7} fadeOutDur={0.5}>
          <Shot7Compose composeOrder="linear" />
        </ShotWrap>
      </Sprite>

      <Sprite start={41} end={45}>
        <ShotWrap fadeInDur={0.5}>
          <Shot8Closing techCredits />
        </ShotWrap>
      </Sprite>

      {/* Captions */}
      <Caption start={0.6} end={4.7}>
        <CaptionLine kicker="01 · the problem" line="Credit origination was always chaos." italic={[3, 4]} />
      </Caption>

      <Caption start={5.8} end={9.4}>
        <CaptionLine kicker="02 · intake" line="Every form is born from config. Not from code." italic={[6, 9]} size={56} />
      </Caption>

      <Caption start={9.7} end={12.9}>
        <CaptionLine kicker="03 · validation" line="Automatic filters. External channels." italic={[1, 3]} size={56} />
      </Caption>

      <Caption start={14.0} end={17.0}>
        <CaptionLine kicker="04 · queue" line="The application lands in the general pool." italic={[6, 7]} size={60} />
      </Caption>

      <Caption start={17.3} end={19.4}>
        <CaptionLine kicker="05 · analysis" line="Identity, score and rules — one screen." italic={[4]} size={60} />
      </Caption>

      <Caption start={19.7} end={21.7}>
        <CaptionLine kicker="06 · decision" line="And you decide, with everything in view." italic={[2, 3]} size={64} />
      </Caption>

      <Caption start={22.2} end={24.9}>
        <CaptionLine kicker="07 · handoff" line="Same file. Different role." italic={[1, 4]} size={56} />
      </Caption>

      <Caption start={26.0} end={30.5}>
        <CaptionLine kicker="08 · roles" line="Every role sees exactly their surface." italic={[4, 5, 6]} size={56} />
      </Caption>

      <Caption start={32.4} end={34.8}>
        <CaptionLine kicker="09 · entity" line="One engine. Multiple brands." italic={[2, 3]} size={64} />
      </Caption>

      <Caption start={35.4} end={38.4}>
        <CaptionLine kicker="10 · compose your process" line="Without touching code." italic={[3]} size={68} />
      </Caption>

      <Caption start={38.7} end={40.9}>
        <CaptionLine kicker="11 · outcome" line="Hours, not sprints." italic={[2, 3]} size={68} />
      </Caption>

      {/* Brand mark — bottom-left throughout */}
      <BrandMark time={time} />

      {/* Progress bar + chapter dots */}
      <ReelProgress />
    </div>
  )
}

function BrandMark({ time }: { time: number }) {
  const shot6 = time >= 32 && time <= 35.3
  const shot8 = time >= 40.8
  const fadeIn = clamp((time - 1.0) / 0.8, 0, 1)
  const targetVis = shot6 || shot8 ? 0 : 1
  const opacity = fadeIn * targetVis
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: 88,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: clamp(opacity, 0, 1),
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
          background: 'linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 18px rgba(129,140,248,0.5)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 20,
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1,
            fontStyle: 'italic',
          }}
        >
          u
        </div>
      </div>
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 13,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#ECECEA',
          fontWeight: 500,
        }}
      >
        uni2 saas
      </div>
      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(236,236,234,0.55)',
        }}
      >
        origination · multi-entity
      </div>
    </div>
  )
}

const CHAPTERS = [
  { t: 0,  label: '01' },
  { t: 5,  label: '02' },
  { t: 13, label: '04' },
  { t: 25, label: '05' },
  { t: 32, label: '06' },
  { t: 35, label: '07' },
  { t: 41, label: '08' },
] as const

function ReelProgress() {
  const { time, duration, setTime } = useTimeline()
  const progress = duration > 0 ? clamp(time / duration, 0, 1) : 0

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        zIndex: 95,
        pointerEvents: 'none',
      }}
    >
      {/* 1px track */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'rgba(255,255,255,0.12)',
        }}
      />
      {/* fill */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${progress * 100}%`,
          height: 1,
          background: 'rgba(129,140,248,0.7)',
          transition: 'width 0.1s linear',
        }}
      />
      {/* chapter dots */}
      {CHAPTERS.map(({ t, label }) => {
        const pct = duration > 0 ? (t / duration) * 100 : 0
        const active = time >= t && (CHAPTERS.find(c => c.t > t) ? time < (CHAPTERS.find(c => c.t > t)!.t) : true)
        return (
          <button
            key={t}
            aria-label={`Jump to chapter ${label}`}
            onClick={() => setTime(t)}
            style={{
              position: 'absolute',
              bottom: -4,
              left: `${pct}%`,
              transform: 'translateX(-50%)',
              width: 9,
              height: 9,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'all',
              background: active ? '#818CF8' : 'rgba(255,255,255,0.25)',
              boxShadow: active ? '0 0 8px rgba(129,140,248,0.6)' : 'none',
              transition: 'background 0.25s ease, box-shadow 0.25s ease',
              padding: 0,
            }}
          />
        )
      })}
    </div>
  )
}

function ShotWrap({
  children,
  fadeInDur = 0,
  fadeOutStart,
  fadeOutDur = 0,
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
