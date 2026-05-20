import { useSprite, Easing, clamp } from '../../../components/animation'
import { Particles } from './animMocks'

export function Shot8Closing({ techCredits = true }: { techCredits?: boolean }) {
  const { localTime, duration } = useSprite()

  const logoT = clamp(localTime / 0.7, 0, 1)
  const taglineT = clamp((localTime - 0.5) / 0.6, 0, 1)
  const beam = Math.sin(localTime * 0.6) * 0.3 + 0.7

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
        className="beam"
        style={{ left: '25%', top: '-15%', width: 220, height: '120%', opacity: 0.7 * beam, transform: 'rotate(8deg)' }}
      />
      <div
        className="beam"
        style={{ right: '20%', top: '-15%', width: 220, height: '120%', opacity: 0.7 * beam, transform: 'rotate(-10deg)' }}
      />

      <div className="dotgrid" style={{ opacity: 0.4 }} />

      <ClosingLogo progress={logoT} />
      <ClosingTagline progress={taglineT} />

      {techCredits && <TechColumn time={localTime} duration={duration} />}

      <Particles count={26} localTime={localTime} seed={1337} />
      <div className="vignette" />
    </div>
  )
}

function ClosingLogo({ progress }: { progress: number }) {
  const eased = Easing.easeOutBack(progress)
  const scale = 0.7 + eased * 0.3
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '46%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: progress,
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

function ClosingTagline({ progress }: { progress: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '64%',
        textAlign: 'center',
        opacity: progress,
        transform: `translateY(${(1 - progress) * 12}px)`,
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

function TechColumn({ time }: { time: number; duration: number }) {
  const labels = [
    { label: 'React 18 · TypeScript · Vite', start: 0.4 },
    { label: 'Tailwind 4 · Zustand · React Query', start: 1.2 },
    { label: 'Zod · React Hook Form · Framer Motion', start: 2.0 },
    { label: 'Feature-Sliced Design · Credit Template', start: 2.8 },
  ]

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
      {labels.map((l, i) => {
        const entry = clamp((time - l.start) / 0.45, 0, 1)
        const exit = clamp((time - (l.start + 1.8)) / 0.4, 0, 1)
        const op = entry * (1 - exit)
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: op,
              transform: `translateX(${(1 - entry) * -14}px)`,
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
        )
      })}
    </div>
  )
}
