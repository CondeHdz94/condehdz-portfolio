import { useSprite, clamp } from '../../../components/animation'
import { Particles, BrandPill, StepIcon, REAL_STEPS_BY_ID, TENANT_PRESETS, type Tenant } from './animMocks'

type BrandsPreset = keyof typeof TENANT_PRESETS

export function Shot6Multitenant({ brandsPreset = 'acme-vs-microcredito' as BrandsPreset }) {
  const { localTime } = useSprite()
  const tenants = TENANT_PRESETS[brandsPreset] || TENANT_PRESETS['acme-vs-microcredito']

  const tIn = clamp(localTime / 0.45, 0, 1)
  const hold = clamp((localTime - 0.4) / 0.4, 0, 1)

  const xOffset = (1 - tIn) * -200
  const xOffsetR = (1 - tIn) * 200

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, #0a1428 0%, #050a18 60%, #03060f 100%)',
        overflow: 'hidden',
      }}
    >
      <div className="dotgrid" />

      <Shot6Title progress={hold} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 56,
        }}
      >
        <TenantSurface tenant={tenants[0]} enter={tIn} hold={hold} align="left" xOffset={xOffset} />
        <TenantSurface tenant={tenants[1]} enter={tIn} hold={hold} align="right" xOffset={xOffsetR} />
      </div>

      <Shot6Footer time={localTime} />

      <Particles count={20} localTime={localTime} seed={6611} />
      <div className="vignette" />
    </div>
  )
}

function Shot6Title({ progress }: { progress: number }) {
  const ty = (1 - progress) * 10
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: 130,
        textAlign: 'center',
        opacity: progress,
        transform: `translateY(${ty}px)`,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 13,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#818CF8',
          marginBottom: 6,
        }}
      >
        08 · multi-tenant · white-label
      </div>
      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 48,
          color: '#ECECEA',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
        }}
      >
        Una plataforma. <span style={{ fontStyle: 'italic' }}>Tu marca. Tu proceso.</span>
      </div>
    </div>
  )
}

function Shot6Footer({ time }: { time: number }) {
  const op = clamp((time - 0.6) / 0.6, 0, 1)
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 170, textAlign: 'center', opacity: op }}>
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 12,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(236,236,234,0.5)',
        }}
      >
        mismo motor · distinto branding · distinto subset de steps
      </div>
    </div>
  )
}

function TenantSurface({
  tenant,
  enter,
  hold,
  align,
  xOffset,
}: {
  tenant: Tenant
  enter: number
  hold: number
  align: 'left' | 'right'
  xOffset: number
}) {
  const slide = (1 - enter) * (align === 'left' ? -40 : 40)
  return (
    <div
      style={{
        width: 580,
        height: 560,
        background: 'linear-gradient(180deg, #0c1228 0%, #080d1f 100%)',
        borderRadius: 12,
        border: `1px solid ${tenant.primary}55`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${tenant.primary}25, inset 0 0 0 1px ${tenant.primary}15`,
        opacity: enter,
        transform: `translateX(${xOffset + slide}px)`,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: 36,
          background: 'rgba(0,0,0,0.25)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 8,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#febc2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#28c840' }} />
        <div style={{ marginLeft: 14, fontSize: 11, color: '#7a8294', fontFamily: 'var(--f-mono)' }}>{tenant.id}.uni2.io</div>
      </div>

      <div
        style={{
          padding: '24px 26px 18px',
          borderBottom: `1px solid ${tenant.primary}22`,
          background: `linear-gradient(180deg, ${tenant.primary}10 0%, transparent 100%)`,
        }}
      >
        <BrandPill tenant={tenant} size={24} />
      </div>

      <div style={{ padding: '24px 26px 0' }}>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#5a637a',
            marginBottom: 12,
          }}
        >
          flujo configurado · {tenant.steps.length} steps
        </div>
        <TenantStepsTimeline tenant={tenant} progress={hold} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 26,
          right: 26,
          bottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            padding: '4px 10px',
            background: `${tenant.primary}26`,
            border: `1px solid ${tenant.primary}66`,
            borderRadius: 999,
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            color: tenant.accent,
            letterSpacing: '0.06em',
          }}
        >
          {tenant.id}-theme.ts
        </div>
        <div
          style={{
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999,
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            color: 'rgba(236,236,234,0.65)',
            letterSpacing: '0.06em',
          }}
        >
          credit-template@1
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            color: 'rgba(236,236,234,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          powered by uni2
        </div>
      </div>
    </div>
  )
}

function TenantStepsTimeline({ tenant, progress }: { tenant: Tenant; progress: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {tenant.steps.map((stepId, i) => {
        const step = REAL_STEPS_BY_ID[stepId]
        if (!step) return null
        const entry = clamp((progress * tenant.steps.length - i * 0.7) / 1, 0, 1)
        const ty = (1 - entry) * 6
        return (
          <div
            key={stepId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${tenant.primary}1c`,
              borderRadius: 6,
              opacity: entry,
              transform: `translateX(${(1 - entry) * -8}px) translateY(${ty}px)`,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${tenant.primary} 0%, ${tenant.accent} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--f-mono)',
                fontSize: 10,
                color: '#fff',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <StepIcon id={stepId} size={16} color={tenant.accent} />
            <div
              style={{
                flex: 1,
                fontFamily: 'var(--f-mono)',
                fontSize: 12,
                color: '#ECECEA',
                letterSpacing: '0.02em',
                fontWeight: 500,
              }}
            >
              {step.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 10,
                color: 'rgba(236,236,234,0.45)',
                letterSpacing: '0.06em',
              }}
            >
              {step.short}
            </div>
          </div>
        )
      })}
    </div>
  )
}
