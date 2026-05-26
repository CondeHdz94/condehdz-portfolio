import React from 'react'
import { Sprite, SpriteStableContext, useSpriteEffect, Easing } from '../../../components/animation'

type Position = 'top' | 'bottom' | 'center'
type Tone = 'normal' | 'tech'

interface CaptionProps {
  start: number
  end: number
  children: React.ReactNode
  position?: Position
  tone?: Tone
}

export function Caption({ start, end, children, position = 'bottom', tone = 'normal' }: CaptionProps) {
  return (
    <Sprite start={start} end={end}>
      <CaptionInner position={position} tone={tone}>
        {children}
      </CaptionInner>
    </Sprite>
  )
}

function CaptionInner({ position, tone: _tone, children }: { position: Position; tone: Tone; children: React.ReactNode }) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const { duration } = React.useContext(SpriteStableContext)
  const isTop = position === 'top'
  const isCenter = position === 'center'
  const tyBase = isCenter ? -50 : 0

  useSpriteEffect((localTime) => {
    const div = divRef.current
    if (!div) return
    const entryDur = 0.5
    const exitDur = 0.5
    const exitStart = duration - exitDur

    let t = 1
    let ty = 0
    if (localTime < entryDur) {
      const e = Easing.easeOutCubic(localTime / entryDur)
      t = e
      ty = (1 - e) * 18
    } else if (localTime > exitStart) {
      const e = Easing.easeInCubic((localTime - exitStart) / exitDur)
      t = 1 - e
      ty = -e * 10
    }

    div.style.opacity = String(t)
    div.style.transform = `translateY(${tyBase}%) translateY(${ty}px)`
  })

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        bottom: isTop ? 'auto' : isCenter ? 'auto' : 90,
        top: isTop ? 90 : isCenter ? '50%' : 'auto',
        transform: `translateY(${tyBase}%)`,
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {children}
    </div>
  )
}

interface CaptionLineProps {
  kicker?: string
  line: string
  italic?: number[]
  color?: string
  size?: number
}

export function CaptionLine({ kicker, line, italic = [], color = '#ECECEA', size = 72 }: CaptionLineProps) {
  const words = line.split(' ')
  return (
    <div>
      {kicker && (
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 14,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#818CF8',
            marginBottom: 12,
            opacity: 0.85,
          }}
        >
          {kicker}
        </div>
      )}
      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: size,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          color,
          maxWidth: '58%',
          textWrap: 'pretty' as React.CSSProperties['textWrap'],
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ fontStyle: italic.includes(i) ? 'italic' : 'normal' }}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  )
}
