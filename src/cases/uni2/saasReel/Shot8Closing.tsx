import React from 'react'
import { useSpriteEffect, Easing, clamp } from '../../../components/animation'
import { Particles } from './animMocks'

export const Shot8Closing = React.memo(function Shot8Closing({ techCredits = true }: { techCredits?: boolean }) {
  const beam1Ref = React.useRef<HTMLDivElement>(null)
  const beam2Ref = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((localTime) => {
    const beam = Math.sin(localTime * 0.6) * 0.3 + 0.7
    if (beam1Ref.current) beam1Ref.current.style.opacity = String(0.7 * beam)
    if (beam2Ref.current) beam2Ref.current.style.opacity = String(0.7 * beam)
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, #0e1a3a 0%, #050a18 60%, #02050b 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        ref={beam1Ref}
        className="beam"
        style={{ left: '25%', top: '-15%', width: 220, height: '120%', opacity: 0, transform: 'rotate(8deg)' }}
      />
      <div
        ref={beam2Ref}
        className="beam"
        style={{ right: '20%', top: '-15%', width: 220, height: '120%', opacity: 0, transform: 'rotate(-10deg)' }}
      />

      <div className="dotgrid" style={{ opacity: 0.4 }} />

      <ClosingLogo />
      <ClosingTagline />

      {techCredits && <TechColumn />}

      <Particles count={26} seed={1337} />
      <div className="vignette" />
    </div>
  )
})

function ClosingLogo() {
  const divRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const progress = clamp(lt / 0.7, 0, 1)
    const eased = Easing.easeOutBack(progress)
    const scale = 0.7 + eased * 0.3
    if (!divRef.current) return
    divRef.current.style.opacity = String(progress)
    divRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`
  })

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: '50%',
        top: '46%',
        transform: 'translate(-50%, -50%) scale(0.7)',
        opacity: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 132,
          height: 132,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 120px rgba(129,140,248,0.75), 0 30px 80px rgba(79,70,229,0.45)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontStyle: 'italic',
            fontSize: 96,
            color: '#fff',
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          u
        </div>
      </div>
      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontStyle: 'italic',
          fontSize: 128,
          color: '#ECECEA',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          textShadow: '0 0 60px rgba(129,140,248,0.35)',
        }}
      >
        uni2
      </div>
    </div>
  )
}

function ClosingTagline() {
  const divRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const progress = clamp((lt - 0.5) / 0.6, 0, 1)
    if (!divRef.current) return
    divRef.current.style.opacity = String(progress)
    divRef.current.style.transform = `translateY(${(1 - progress) * 12}px)`
  })

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '64%',
        textAlign: 'center',
        opacity: 0,
        transform: 'translateY(12px)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 13,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(129,140,248,0.85)',
          marginBottom: 18,
        }}
      >
        originación composable
      </div>
      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 38,
          color: 'rgba(236,236,234,0.85)',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          fontStyle: 'italic',
        }}
      >
        SaaS multi-entidad · steps composables.
      </div>
    </div>
  )
}

const TECH_LABELS = [
  { label: 'React 18 · TypeScript · Vite', start: 0.4 },
  { label: 'Tailwind 4 · Zustand · React Query', start: 1.2 },
  { label: 'Zod · React Hook Form · Framer Motion', start: 2.0 },
  { label: 'Feature-Sliced Design · Credit Template', start: 2.8 },
]

function TechColumn() {
  const r0 = React.useRef<HTMLDivElement>(null)
  const r1 = React.useRef<HTMLDivElement>(null)
  const r2 = React.useRef<HTMLDivElement>(null)
  const r3 = React.useRef<HTMLDivElement>(null)
  const refs = [r0, r1, r2, r3]

  useSpriteEffect((time) => {
    refs.forEach((ref, i) => {
      if (!ref.current) return
      const l = TECH_LABELS[i]
      const entry = clamp((time - l.start) / 0.45, 0, 1)
      const exit = clamp((time - (l.start + 1.8)) / 0.4, 0, 1)
      const op = entry * (1 - exit)
      ref.current.style.opacity = String(op)
      ref.current.style.transform = `translateX(${(1 - entry) * -14}px)`
    })
  })

  return (
    <div
      style={{
        position: 'absolute',
        right: 80,
        top: 130,
        bottom: 130,
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 14,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(129,140,248,0.85)',
          marginBottom: 4,
        }}
      >
        stack
      </div>
      {TECH_LABELS.map((l, i) => (
        <div
          key={i}
          ref={refs[i]}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            opacity: 0,
          }}
        >
          <div
            style={{
              width: 28,
              height: 1,
              background: '#818CF8',
              boxShadow: '0 0 6px #818CF8',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 14,
              letterSpacing: '0.06em',
              color: '#ECECEA',
              lineHeight: 1.35,
            }}
          >
            {l.label}
          </div>
        </div>
      ))}
    </div>
  )
}
