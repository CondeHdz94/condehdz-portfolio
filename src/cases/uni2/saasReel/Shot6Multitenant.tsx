import React from 'react'
import { useSpriteEffect, clamp } from '../../../components/animation'
import { Particles, BrandPill, StepIcon, REAL_STEPS_BY_ID, TENANT_PRESETS, type Tenant } from './animMocks'

type BrandsPreset = keyof typeof TENANT_PRESETS

export const Shot6Multitenant = React.memo(function Shot6Multitenant({ brandsPreset = 'acme-vs-microcredito' }: { brandsPreset?: BrandsPreset }) {
  const tenants = TENANT_PRESETS[brandsPreset] || TENANT_PRESETS['acme-vs-microcredito']

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

      <Shot6Title />

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
        <TenantSurface tenant={tenants[0]} align="left" />
        <TenantSurface tenant={tenants[1]} align="right" />
      </div>

      <Shot6Footer />

      <Particles count={20} seed={6611} />
      <div className="vignette" />
    </div>
  )
})

function Shot6Title() {
  const divRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const hold = clamp((lt - 0.4) / 0.4, 0, 1)
    if (!divRef.current) return
    divRef.current.style.opacity = String(hold)
    divRef.current.style.transform = `translateY(${(1 - hold) * 10}px)`
  })

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: 130,
        textAlign: 'center',
        opacity: 0,
        transform: 'translateY(10px)',
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

function Shot6Footer() {
  const divRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const op = clamp((lt - 0.6) / 0.6, 0, 1)
    if (divRef.current) divRef.current.style.opacity = String(op)
  })

  return (
    <div
      ref={divRef}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 170, textAlign: 'center', opacity: 0 }}
    >
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

function TenantSurface({ tenant, align }: { tenant: Tenant; align: 'left' | 'right' }) {
  const divRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const tIn = clamp(lt / 0.45, 0, 1)
    const slide = (1 - tIn) * (align === 'left' ? -40 : 40)
    const xOffset = (1 - tIn) * (align === 'left' ? -200 : 200)
    if (!divRef.current) return
    divRef.current.style.opacity = String(tIn)
    divRef.current.style.transform = `translateX(${xOffset + slide}px)`
  })

  return (
    <div
      ref={divRef}
      style={{
        width: 580,
        height: 560,
        background: 'linear-gradient(180deg, #0c1228 0%, #080d1f 100%)',
        borderRadius: 12,
        border: `1px solid ${tenant.primary}55`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${tenant.primary}25, inset 0 0 0 1px ${tenant.primary}15`,
        opacity: 0,
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
        <TenantStepsTimeline tenant={tenant} />
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

function TenantStepsTimeline({ tenant }: { tenant: Tenant }) {
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>(
    Array.from({ length: tenant.steps.length }, () => null),
  )

  useSpriteEffect((lt) => {
    const hold = clamp((lt - 0.4) / 0.4, 0, 1)
    stepRefs.current.forEach((el, i) => {
      if (!el) return
      const entry = clamp((hold * tenant.steps.length - i * 0.7) / 1, 0, 1)
      const ty = (1 - entry) * 6
      el.style.opacity = String(entry)
      el.style.transform = `translateX(${(1 - entry) * -8}px) translateY(${ty}px)`
    })
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {tenant.steps.map((stepId, i) => {
        const step = REAL_STEPS_BY_ID[stepId]
        if (!step) return null
        return (
          <div
            key={stepId}
            ref={(el) => { stepRefs.current[i] = el }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${tenant.primary}1c`,
              borderRadius: 6,
              opacity: 0,
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
