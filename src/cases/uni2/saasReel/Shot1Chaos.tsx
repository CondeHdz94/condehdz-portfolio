import React from 'react'
import { useSprite } from '../../../components/animation'
import { Particles, mulberry32 } from './animMocks'

export function Shot1Chaos() {
  const { localTime, progress } = useSprite()

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 30% 35%, #2a1a0e 0%, #110a06 50%, #060304 100%)',
        overflow: 'hidden',
      }}
    >
      <div className="flare" style={{ top: `${28 + Math.sin(localTime * 0.6) * 1.2}%` }} />
      <StackVariant localTime={localTime} progress={progress} />
      <div className="grain" />
      <div className="vignette" />
    </div>
  )
}

function StackVariant({ localTime, progress }: { localTime: number; progress: number }) {
  const stackHeight = Math.min(30, Math.floor(progress * 36))
  const days = Math.floor(progress * 47) + 1

  const layers = React.useMemo(() => {
    const rng = mulberry32(7711)
    return Array.from({ length: 36 }, () => ({
      rot: (rng() - 0.5) * 7,
      ox: (rng() - 0.5) * 28,
      shade: 0.85 + rng() * 0.15,
    }))
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 110,
          fontFamily: 'var(--f-mono)',
          color: 'rgba(255,176,96,0.9)',
          fontSize: 14,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          textShadow: '0 0 18px rgba(255,140,58,0.5)',
        }}
      >
        Tiempo transcurrido
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 132,
          fontFamily: 'var(--f-display)',
          color: '#ffce98',
          fontSize: 220,
          fontWeight: 400,
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          fontStyle: 'italic',
          textShadow: '0 0 60px rgba(255,140,58,0.4)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(days).padStart(2, '0')}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 360,
          fontFamily: 'var(--f-mono)',
          color: 'rgba(255,176,96,0.7)',
          fontSize: 18,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        días
      </div>

      <div style={{ position: 'absolute', right: 200, bottom: 30 }}>
        {layers.slice(0, stackHeight).map((l, i) => {
          const yOff = i * -14
          const baseW = 380
          const baseH = 480
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                right: 0,
                bottom: yOff,
                width: baseW,
                height: baseH,
                transform: `translateX(${l.ox}px) rotate(${l.rot}deg)`,
                transformOrigin: 'bottom center',
                background: `linear-gradient(165deg, rgba(244,237,224,${l.shade}) 0%, rgba(220,202,170,${l.shade * 0.92}) 100%)`,
                boxShadow: '0 12px 30px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.1) inset',
                borderRadius: 2,
                padding: '18px 22px',
                fontFamily: 'var(--f-mono)',
                fontSize: 8,
                color: '#7a6240',
                borderTop: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <div style={{ fontSize: 7, letterSpacing: '0.1em', marginBottom: 8 }}>
                FORM-{String(i + 1).padStart(3, '0')} · ACME
              </div>
              {[...Array(6)].map((_, k) => (
                <div
                  key={k}
                  style={{
                    height: 4,
                    background: '#c8b894',
                    opacity: 0.4,
                    marginBottom: 8,
                    width: `${50 + ((k * 13) % 40)}%`,
                  }}
                />
              ))}
            </div>
          )
        })}
      </div>

      <Particles count={20} localTime={localTime} />
    </div>
  )
}
