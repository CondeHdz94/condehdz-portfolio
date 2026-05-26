import React from 'react'
import { useSpriteEffect, SpriteStableContext, Easing, clamp } from '../../../components/animation'
import { AnalystApp } from './AnalystApp'

const HANDOFF_START = 9.0

export const Shot4Analyst = React.memo(function Shot4Analyst() {
  const { duration } = React.useContext(SpriteStableContext)
  const cameraRef = React.useRef<HTMLDivElement>(null)
  const cursorRef = React.useRef<HTMLDivElement>(null)
  const cursorPulseRef = React.useRef<HTMLDivElement>(null)
  const [showHandoff, setShowHandoff] = React.useState(false)
  const prevHandoffRef = React.useRef(false)

  useSpriteEffect((lt) => {
    const t = lt / duration
    const camScale = 0.86 + Easing.easeOutCubic(clamp(lt / 2, 0, 1)) * 0.06 + clamp((lt - 8) / 4, 0, 1) * 0.04
    const camX = -8 + t * 24
    const camY = 10 - t * 20
    const appFade = clamp(1 - (lt - HANDOFF_START) / 0.55, 0, 1)

    if (cameraRef.current) {
      cameraRef.current.style.transform = `translate(calc(-50% + ${camX}px), calc(-50% + ${camY}px)) scale(${camScale})`
      cameraRef.current.style.opacity = String(appFade)
    }

    const cursorPos = computeAnalystCursorPos(lt)
    const cursorOpacity = cursorPos.opacity * appFade

    if (cursorRef.current) {
      cursorRef.current.style.left = `${cursorPos.x}px`
      cursorRef.current.style.top = `${cursorPos.y}px`
      cursorRef.current.style.opacity = String(cursorOpacity)
    }

    const events = [2.6, 8.6]
    let clickPulse = -1
    for (const ev of events) {
      const dt = lt - ev
      if (dt > 0 && dt < 0.5) { clickPulse = clamp(dt / 0.5, 0, 1); break }
    }
    if (cursorPulseRef.current) {
      if (clickPulse < 0) {
        cursorPulseRef.current.style.display = 'none'
      } else {
        cursorPulseRef.current.style.display = ''
        cursorPulseRef.current.style.left = `${cursorPos.x}px`
        cursorPulseRef.current.style.top = `${cursorPos.y}px`
        cursorPulseRef.current.style.width = `${24 + clickPulse * 40}px`
        cursorPulseRef.current.style.height = `${24 + clickPulse * 40}px`
        cursorPulseRef.current.style.marginLeft = `${-12 - clickPulse * 20}px`
        cursorPulseRef.current.style.marginTop = `${-12 - clickPulse * 20}px`
        cursorPulseRef.current.style.opacity = String(1 - clickPulse)
      }
    }

    const newShowHandoff = lt >= HANDOFF_START - 0.1
    if (newShowHandoff !== prevHandoffRef.current) {
      prevHandoffRef.current = newShowHandoff
      setShowHandoff(newShowHandoff)
    }
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, #0e1a3a 0%, #060b1c 60%, #03060f 100%)',
        overflow: 'hidden',
      }}
    >
      <div className="dotgrid" />

      <div
        ref={cameraRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(calc(-50% + -8px), calc(-50% + 10px)) scale(0.86)',
          opacity: 1,
          pointerEvents: 'none',
        }}
      >
        <AnalystApp />

        <div
          ref={cursorRef}
          style={{
            position: 'absolute',
            left: -60,
            top: 800,
            opacity: 0,
            pointerEvents: 'none',
            transform: 'translate(-2px, -2px)',
            zIndex: 100,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.55))' }}>
            <path d="M5 3l4 16 3-7 7-3z" fill="#fff" stroke="#0e1530" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </div>

        <div
          ref={cursorPulseRef}
          style={{
            position: 'absolute',
            left: -60,
            top: 800,
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '2px solid rgba(129,140,248,0.7)',
            display: 'none',
            pointerEvents: 'none',
            zIndex: 99,
          }}
        />
      </div>

      {showHandoff && <HandoffScene />}

      <div className="vignette" />
    </div>
  )
})

function HandoffScene() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const titleRef = React.useRef<HTMLDivElement>(null)
  const bigTitleRef = React.useRef<HTMLDivElement>(null)
  const badgesRef = React.useRef<HTMLDivElement>(null)
  const footerRef = React.useRef<HTMLDivElement>(null)
  const progressBarRef = React.useRef<HTMLDivElement>(null)
  const flyingChipRef = React.useRef<HTMLDivElement>(null)
  const rightBadgeRef = React.useRef<HTMLDivElement>(null)

  const [leftActive, setLeftActive] = React.useState(false)
  const [leftDone, setLeftDone] = React.useState(false)
  const [rightActive, setRightActive] = React.useState(false)
  const prevBadgeRef = React.useRef({ la: false, ld: false, ra: false })

  useSpriteEffect((lt) => {
    const localTime = lt - HANDOFF_START
    if (localTime < -0.1) return

    const progress = clamp((lt - (HANDOFF_START + 0.15)) / 0.55, 0, 1)
    const titleEnter = clamp(localTime / 0.5, 0, 1)
    const badgesEnter = clamp((localTime - 0.3) / 0.6, 0, 1)
    const tripT = clamp((localTime - 1.6) / 1.1, 0, 1)
    const eased = Easing.easeInOutCubic(tripT)
    const footerEnter = clamp((localTime - 0.9) / 0.5, 0, 1)

    if (containerRef.current) containerRef.current.style.opacity = String(progress)
    if (titleRef.current) {
      titleRef.current.style.opacity = String(titleEnter)
      titleRef.current.style.transform = `translateY(${(1 - titleEnter) * -10}px)`
    }
    if (bigTitleRef.current) {
      bigTitleRef.current.style.opacity = String(titleEnter)
      bigTitleRef.current.style.transform = `translateY(${(1 - titleEnter) * -12}px)`
    }
    if (badgesRef.current) {
      badgesRef.current.style.opacity = String(badgesEnter)
      badgesRef.current.style.transform = `translateY(${(1 - badgesEnter) * 14}px)`
    }
    if (footerRef.current) {
      footerRef.current.style.opacity = String(footerEnter)
      footerRef.current.style.transform = `translateY(${(1 - footerEnter) * 8}px)`
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${320 * eased}px`
    }

    const flying = tripT > 0 && tripT < 1
    if (flyingChipRef.current) {
      if (!flying) {
        flyingChipRef.current.style.display = 'none'
      } else {
        flyingChipRef.current.style.display = 'flex'
        flyingChipRef.current.style.left = `${10 + 320 * eased}px`
        flyingChipRef.current.style.transform = `translate(-50%, -50%) scale(${0.92 + Math.sin(tripT * Math.PI) * 0.08})`
      }
    }

    const arrivedPulse = clamp((tripT - 0.92) / 0.08, 0, 1) * (1 - clamp((localTime - 2.95) / 0.3, 0, 1))
    if (rightBadgeRef.current) {
      rightBadgeRef.current.style.transform = `scale(${1 + arrivedPulse * 0.06})`
    }

    const newLa = localTime >= 0.9 && tripT < 1
    const newLd = tripT >= 1
    const newRa = tripT >= 1
    const prev = prevBadgeRef.current
    if (newLa !== prev.la || newLd !== prev.ld || newRa !== prev.ra) {
      prevBadgeRef.current = { la: newLa, ld: newLd, ra: newRa }
      setLeftActive(newLa)
      setLeftDone(newLd)
      setRightActive(newRa)
    }
  })

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={titleRef}
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 14,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: '#818CF8',
          opacity: 0,
          transform: 'translateY(-10px)',
        }}
      >
        07 · handoff entre roles
      </div>

      <div
        ref={bigTitleRef}
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 86,
          color: '#ECECEA',
          lineHeight: 1.0,
          letterSpacing: '-0.025em',
          textAlign: 'center',
          opacity: 0,
          transform: 'translateY(-12px)',
        }}
      >
        The file <span style={{ fontStyle: 'italic' }}>moves forward.</span>
      </div>

      <div
        ref={badgesRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 80,
          opacity: 0,
          transform: 'translateY(14px)',
        }}
      >
        <RoleBigBadge label="Role A" examples="committee · approver" active={leftActive} done={leftDone} accent="#A5B4FC" />

        <div style={{ position: 'relative', width: 360, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="360" height="40" viewBox="0 0 360 40" style={{ position: 'absolute', top: '50%', marginTop: -20 }}>
            <defs>
              <linearGradient id="handoff-arrow-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <path
              d="M10 20h320M320 8l20 12-20 12"
              stroke="url(#handoff-arrow-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 6"
              fill="none"
            />
          </svg>

          <div
            ref={progressBarRef}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              marginTop: -2,
              width: 0,
              height: 4,
              background: 'linear-gradient(90deg, rgba(165,180,252,0.9) 0%, rgba(129,140,248,0.95) 100%)',
              borderRadius: 2,
              boxShadow: '0 0 12px rgba(129,140,248,0.8)',
            }}
          />

          <div
            ref={flyingChipRef}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              display: 'none',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              background: 'linear-gradient(180deg, #101a3a 0%, #0a1227 100%)',
              border: '1.5px solid rgba(129,140,248,0.7)',
              borderRadius: 999,
              boxShadow: '0 14px 36px rgba(79,70,229,0.5), 0 0 30px rgba(129,140,248,0.7)',
              fontFamily: 'var(--f-mono)',
              fontSize: 12,
              color: '#ECECEA',
              whiteSpace: 'nowrap',
              willChange: 'transform, left',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 4, background: '#818CF8', boxShadow: '0 0 8px #818CF8', flexShrink: 0 }} />
            <span style={{ color: '#818CF8', letterSpacing: '0.06em', fontWeight: 600 }}>SOL-04781</span>
            <span style={{ color: 'rgba(236,236,234,0.7)' }}>· Tatiana Avilés</span>
          </div>
        </div>

        <div ref={rightBadgeRef} style={{ transform: 'scale(1)', transition: 'none' }}>
          <RoleBigBadge label="Role B" examples="treasury · operations" active={rightActive} done={false} accent="#818CF8" />
        </div>
      </div>

      <div
        ref={footerRef}
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 13,
          letterSpacing: '0.14em',
          color: 'rgba(236,236,234,0.5)',
          textAlign: 'center',
          opacity: 0,
          transform: 'translateY(8px)',
          marginTop: 10,
        }}
      >
        same file · different role · different mode (form / visual)
      </div>
    </div>
  )
}

function RoleBigBadge({
  label,
  examples,
  active,
  done,
  accent,
}: {
  label: string
  examples: string
  active: boolean
  done: boolean
  accent: string
}) {
  const baseOp = active ? 1 : done ? 0.7 : 0.45
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity: baseOp,
        transition: 'opacity 280ms',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 200,
          height: 200,
          borderRadius: 16,
          background: active ? `linear-gradient(180deg, ${accent}33 0%, ${accent}1a 100%)` : 'rgba(255,255,255,0.03)',
          border: active
            ? `2px solid ${accent}`
            : done
              ? '1.5px solid rgba(95,212,154,0.45)'
              : '1.5px solid rgba(255,255,255,0.12)',
          boxShadow: active
            ? `0 0 60px ${accent}80, 0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px ${accent}44`
            : '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 320ms, border 320ms, box-shadow 320ms',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 64,
            color: active ? '#ECECEA' : done ? 'rgba(236,236,234,0.7)' : 'rgba(236,236,234,0.5)',
            fontStyle: 'italic',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            padding: '0 16px',
          }}
        >
          {label}
        </div>
        {done && (
          <div
            style={{
              position: 'absolute',
              right: -12,
              top: -12,
              width: 36,
              height: 36,
              borderRadius: 18,
              background: '#5fd49a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(95,212,154,0.7)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M4 9l3 3 7-7" stroke="#06291d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: active ? accent : 'rgba(236,236,234,0.45)',
            fontWeight: 600,
          }}
        >
          rol
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'rgba(236,236,234,0.4)', fontStyle: 'italic', letterSpacing: '0.02em' }}>
          ej. {examples}
        </div>
      </div>
    </div>
  )
}

function computeAnalystCursorPos(tNow: number) {
  const BTN_X = 1167
  const BTN_Y = 152

  if (tNow < 1.0) {
    return { x: -60, y: 800, opacity: 0 }
  } else if (tNow < 2.4) {
    const p = Easing.easeOutCubic(clamp((tNow - 1.0) / 1.4, 0, 1))
    return { x: -60 + p * 720, y: 800 - p * 470, opacity: clamp((tNow - 1.0) / 0.5, 0, 1) }
  } else if (tNow < 3.2) {
    return { x: 660, y: 330, opacity: 1 }
  } else if (tNow < 6.8) {
    const drift = tNow - 3.2
    return {
      x: 760 + Math.sin(drift * 0.8) * 14,
      y: 380 + Math.cos(drift * 0.6) * 10,
      opacity: clamp(1 - (tNow - 6.4) * 0.6, 0.4, 1),
    }
  } else if (tNow < 8.4) {
    const p = Easing.easeInOutCubic(clamp((tNow - 6.8) / 1.6, 0, 1))
    return {
      x: 760 + (BTN_X - 760) * p,
      y: 380 + (BTN_Y - 380) * p,
      opacity: clamp((tNow - 6.4) / 0.4, 0.4, 1),
    }
  } else if (tNow < 9.0) {
    return { x: BTN_X, y: BTN_Y + Math.sin((tNow - 8.4) * 20) * 2, opacity: 1 }
  }
  return { x: BTN_X, y: BTN_Y, opacity: 1 - clamp((tNow - 9.0) / 0.5, 0, 1) }
}
