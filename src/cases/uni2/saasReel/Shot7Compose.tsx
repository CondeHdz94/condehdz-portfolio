import React from 'react'
import { useSpriteEffect, Easing, clamp } from '../../../components/animation'
import { Particles, StepIcon, REAL_STEPS_BY_ID } from './animMocks'

interface ComposeStep { id: string; mode: 'form' | 'visual' }
interface ComposeBranch { from: number; steps: ComposeStep[] }
interface ComposeRole {
  id: string
  name: string
  subtitle: string
  accent: string
  examples: string
  steps: ComposeStep[]
  branch: ComposeBranch | null
}

const COMPOSE_ROLES: Record<'linear' | 'branching', ComposeRole[]> = {
  linear: [
    {
      id: 'rol-a',
      name: 'Rol A',
      subtitle: 'captura',
      accent: '#818CF8',
      examples: 'comercial · ejecutivo · aliado',
      steps: [
        { id: 'pre-approver', mode: 'form' },
        { id: 'info-client', mode: 'form' },
        { id: 'info-credit', mode: 'form' },
        { id: 'info-contact', mode: 'form' },
        { id: 'documents', mode: 'form' },
      ],
      branch: null,
    },
    {
      id: 'rol-b',
      name: 'Rol B',
      subtitle: 'documenta',
      accent: '#6366F1',
      examples: 'mesa de ayuda · soporte · tesorería',
      steps: [
        { id: 'info-client', mode: 'visual' },
        { id: 'info-credit', mode: 'visual' },
        { id: 'documents', mode: 'form' },
      ],
      branch: null,
    },
    {
      id: 'rol-c',
      name: 'Rol C',
      subtitle: 'decide',
      accent: '#A5B4FC',
      examples: 'analista · aprobador · comité',
      steps: [
        { id: 'info-client', mode: 'visual' },
        { id: 'info-credit', mode: 'visual' },
        { id: 'insurability', mode: 'visual' },
        { id: 'decision', mode: 'form' },
      ],
      branch: null,
    },
  ],
  branching: [
    {
      id: 'rol-a',
      name: 'Rol A',
      subtitle: 'captura',
      accent: '#818CF8',
      examples: 'comercial · ejecutivo · aliado',
      steps: [
        { id: 'pre-approver', mode: 'form' },
        { id: 'info-client', mode: 'form' },
        { id: 'info-credit', mode: 'form' },
        { id: 'documents', mode: 'form' },
      ],
      branch: {
        from: 1,
        steps: [
          { id: 'insurability', mode: 'form' },
          { id: 'data-authorization', mode: 'form' },
        ],
      },
    },
    {
      id: 'rol-b',
      name: 'Rol B',
      subtitle: 'documenta',
      accent: '#6366F1',
      examples: 'mesa de ayuda · soporte · tesorería',
      steps: [
        { id: 'info-client', mode: 'visual' },
        { id: 'documents', mode: 'form' },
      ],
      branch: null,
    },
    {
      id: 'rol-c',
      name: 'Rol C',
      subtitle: 'decide',
      accent: '#A5B4FC',
      examples: 'analista · aprobador · comité',
      steps: [
        { id: 'info-client', mode: 'visual' },
        { id: 'info-credit', mode: 'visual' },
        { id: 'decision', mode: 'form' },
      ],
      branch: null,
    },
  ],
}

const INVENTORY_LIST = [
  'pre-approver',
  'info-client',
  'info-credit',
  'info-contact',
  'insurability',
  'data-authorization',
  'documents',
  'decision',
]

const CARD_W = 150
const CARD_H = 90
const CARD_GAP = 8
const TRACK_GAP = 28
const TRACK_LABEL_H = 24
const TRACK_H = TRACK_LABEL_H + CARD_H

const INVENTORY_WIDTH = 260
const INVENTORY_SPACING = 44
const TRACK_ORIGIN_X = INVENTORY_WIDTH + 60

const WAVE_START = 0.85
const WAVE_STAGGER = 0.36
const DROP_DUR = 0.55

type ComposeOrder = 'linear' | 'branching'

interface Drop {
  role: ComposeRole
  roleIdx: number
  step: ComposeStep
  stepIdx: number
  wave: number
  lane: 'trunk' | 'branch'
  branchPosition?: number
}

export const Shot7Compose = React.memo(function Shot7Compose({ composeOrder = 'linear' }: { composeOrder?: ComposeOrder }) {
  const roles = COMPOSE_ROLES[composeOrder] || COMPOSE_ROLES.linear

  const drops: Drop[] = []
  roles.forEach((role, roleIdx) => {
    role.steps.forEach((step, stepIdx) => {
      drops.push({ role, roleIdx, step, stepIdx, wave: stepIdx, lane: 'trunk' })
    })
    if (role.branch) {
      role.branch.steps.forEach((step, bIdx) => {
        drops.push({
          role,
          roleIdx,
          step,
          stepIdx: role.branch!.from + bIdx + 1,
          wave: role.branch!.from + bIdx + 1,
          lane: 'branch',
          branchPosition: bIdx,
        })
      })
    }
  })

  const maxWave = drops.reduce((m, d) => Math.max(m, d.wave), 0)
  const lastDropEnd = WAVE_START + maxWave * WAVE_STAGGER + DROP_DUR

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

      <Shot7Title />

      <ComposeStage roles={roles} drops={drops} lastDropEnd={lastDropEnd} />

      <Particles count={16} seed={9081} />
      <div className="vignette" />
    </div>
  )
})

function Shot7Title() {
  const divRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const progress = clamp(lt / 0.5, 0, 1)
    if (!divRef.current) return
    divRef.current.style.opacity = String(progress)
    divRef.current.style.transform = `translateY(${(1 - progress) * 10}px)`
  })

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: 80,
        top: 130,
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
          marginBottom: 8,
        }}
      >
        08 · arma tu proceso · por rol
      </div>
      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 50,
          color: '#ECECEA',
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
        }}
      >
        Same inventory. <span style={{ fontStyle: 'italic' }}>Three paths.</span>
      </div>
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 13,
          color: 'rgba(236,236,234,0.55)',
          marginTop: 10,
          letterSpacing: '0.04em',
        }}
      >
        cada rol elige · ordena · escoge modo · sin tocar código
      </div>
    </div>
  )
}

function ComposeStage({
  roles,
  drops,
  lastDropEnd,
}: {
  roles: ComposeRole[]
  drops: Drop[]
  lastDropEnd: number
}) {
  const trackContainerRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const enter = clamp((lt - 0.4) / 0.5, 0, 1)
    if (trackContainerRef.current) {
      trackContainerRef.current.style.opacity = String(enter)
      trackContainerRef.current.style.transform = `translateY(${(1 - enter) * 12}px)`
    }
  })

  const roleTrackY = roles.map((_, i) => i * (TRACK_H + TRACK_GAP))

  const slotForDrop = (drop: Drop) => {
    const baseY = roleTrackY[drop.roleIdx] + TRACK_LABEL_H
    if (drop.lane === 'trunk') {
      return { x: TRACK_ORIGIN_X + drop.stepIdx * (CARD_W + CARD_GAP), y: baseY }
    }
    return {
      x: TRACK_ORIGIN_X + (drop.role.branch!.from + 1 + (drop.branchPosition ?? 0)) * (CARD_W + CARD_GAP),
      y: baseY - (CARD_H + 24),
    }
  }

  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top: 350, bottom: 130 }}>
      <ComposeInventory drops={drops} />

      <div
        ref={trackContainerRef}
        style={{
          position: 'absolute',
          left: TRACK_ORIGIN_X,
          top: 0,
          right: 0,
          opacity: 0,
          transform: 'translateY(12px)',
        }}
      >
        {roles.map((role, roleIdx) => (
          <TrackFrame key={role.id} role={role} y={roleTrackY[roleIdx]} lastDropEnd={lastDropEnd} />
        ))}

        {drops.map((drop) => {
          const slot = slotForDrop(drop)
          const inventoryIdx = INVENTORY_LIST.indexOf(drop.step.id)
          const startX = -TRACK_ORIGIN_X + 16
          const startY = inventoryIdx * INVENTORY_SPACING + 8
          const startAt = WAVE_START + drop.wave * WAVE_STAGGER

          return (
            <FlyingRoleChip
              key={`${drop.role.id}-${drop.lane}-${drop.stepIdx}`}
              step={drop.step}
              accent={drop.role.accent}
              startAt={startAt}
              slotX={slot.x}
              slotY={slot.y}
              startX={startX}
              startY={startY}
              wave={drop.wave}
              lastDropEnd={lastDropEnd}
            />
          )
        })}
      </div>
    </div>
  )
}

function ComposeInventory({ drops }: { drops: Drop[] }) {
  const outerRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const enter = clamp((lt - 0.3) / 0.5, 0, 1)
    if (outerRef.current) {
      outerRef.current.style.opacity = String(enter)
      outerRef.current.style.transform = `translateX(${(1 - enter) * -16}px)`
    }
  })

  return (
    <div
      ref={outerRef}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: INVENTORY_WIDTH,
        opacity: 0,
        transform: 'translateX(-16px)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--f-mono)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#5a637a',
          marginBottom: 12,
        }}
      >
        inventario · 7 steps reusables
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {INVENTORY_LIST.map((stepId) => {
          const uses = drops.filter((d) => d.step.id === stepId)
          const activationTimes = uses.map((d) => WAVE_START + d.wave * WAVE_STAGGER + 0.1 * DROP_DUR)
          const useCount = uses.length
          const step = REAL_STEPS_BY_ID[stepId]
          if (!step) return null
          return (
            <InventoryChip
              key={stepId}
              step={step}
              useCount={useCount}
              activationTimes={activationTimes}
            />
          )
        })}
      </div>
    </div>
  )
}

const InventoryChip = React.memo(function InventoryChip({
  step,
  useCount,
  activationTimes,
}: {
  step: { id: string; label: string }
  useCount: number
  activationTimes: number[]
}) {
  const [inUse, setInUse] = React.useState(false)
  const prevRef = React.useRef(false)

  useSpriteEffect((lt) => {
    const newInUse = activationTimes.some((t) => lt >= t)
    if (newInUse !== prevRef.current) {
      prevRef.current = newInUse
      setInUse(newInUse)
    }
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        background: inUse ? 'rgba(129,140,248,0.05)' : 'rgba(255,255,255,0.03)',
        border: inUse ? '1px dashed rgba(129,140,248,0.32)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
        opacity: inUse ? 0.55 : 1,
        transition: 'opacity 200ms, background 200ms, border 200ms',
      }}
    >
      <StepIcon id={step.id} size={14} color={inUse ? 'rgba(236,236,234,0.5)' : '#ECECEA'} />
      <div
        style={{
          flex: 1,
          fontFamily: 'var(--f-mono)',
          fontSize: 11.5,
          color: inUse ? 'rgba(236,236,234,0.55)' : '#ECECEA',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {step.label}
      </div>
      {useCount > 0 && (
        <span
          style={{
            padding: '1px 6px',
            background: inUse ? 'rgba(129,140,248,0.18)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 999,
            fontFamily: 'var(--f-mono)',
            fontSize: 8.5,
            color: 'rgba(129,140,248,0.85)',
            letterSpacing: '0.08em',
          }}
        >
          ×{useCount}
        </span>
      )}
    </div>
  )
})

const TrackFrame = React.memo(function TrackFrame({
  role,
  y,
  lastDropEnd,
}: {
  role: ComposeRole
  y: number
  lastDropEnd: number
}) {
  const glowBarRef = React.useRef<HTMLDivElement>(null)

  useSpriteEffect((lt) => {
    const glowProgress = clamp((lt - lastDropEnd + 0.1) / 0.9, 0, 1)
    if (glowBarRef.current) {
      glowBarRef.current.style.width = `${glowProgress * 100}%`
      glowBarRef.current.style.opacity = String(glowProgress > 0 ? 1 : 0)
    }
  })

  return (
    <div style={{ position: 'absolute', left: 0, top: y, right: 0, height: TRACK_H }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          marginBottom: 4,
          flexWrap: 'nowrap',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: `linear-gradient(135deg, ${role.accent} 0%, ${role.accent}aa 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--f-mono)',
            fontSize: 11,
            fontWeight: 700,
            color: '#0e1530',
            flexShrink: 0,
            alignSelf: 'center',
          }}
        >
          {role.id.slice(-1).toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 19,
            color: '#ECECEA',
            fontStyle: 'italic',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {role.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            color: role.accent,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          · {role.subtitle}
        </div>
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9,
            color: 'rgba(236,236,234,0.35)',
            fontStyle: 'italic',
            letterSpacing: '0.04em',
            marginLeft: 6,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
            minWidth: 0,
          }}
        >
          ej. {role.examples}
        </div>
      </div>

      <div style={{ position: 'relative', height: CARD_H }}>
        <div
          ref={glowBarRef}
          style={{
            position: 'absolute',
            left: 0,
            top: CARD_H - 8,
            width: '0%',
            height: 6,
            background: `linear-gradient(90deg, rgba(129,140,248,0) 0%, ${role.accent}cc 70%, #fff 100%)`,
            filter: 'blur(4px)',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />

        {role.steps.map((_, i) => (
          <EmptySlot key={`trunk-${i}`} x={i * (CARD_W + CARD_GAP)} y={0} accent={role.accent} index={i + 1} />
        ))}
        {role.branch &&
          role.branch.steps.map((_, i) => (
            <EmptySlot
              key={`branch-${i}`}
              x={(role.branch!.from + 1 + i) * (CARD_W + CARD_GAP)}
              y={-(CARD_H + 24)}
              accent={role.accent}
              index={i + 1}
              branch
            />
          ))}

        {role.branch && (
          <svg style={{ position: 'absolute', left: 0, top: -CARD_H - 24, width: '100%', height: CARD_H + 30, pointerEvents: 'none' }}>
            <path
              d={`M ${(role.branch.from + 0.5) * (CARD_W + CARD_GAP)} ${CARD_H + 8} Q ${(role.branch.from + 0.5) * (CARD_W + CARD_GAP)} ${(CARD_H + 8) / 2}, ${(role.branch.from + 1) * (CARD_W + CARD_GAP)} ${CARD_H / 2}`}
              stroke={`${role.accent}55`}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  )
})

const EmptySlot = React.memo(function EmptySlot({
  x,
  y,
  index,
  branch,
  accent,
}: {
  x: number
  y: number
  index: number
  branch?: boolean
  accent: string
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 6,
        border: `1px dashed ${accent}30`,
        background: `${accent}06`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--f-mono)',
        fontSize: 9,
        color: 'rgba(122,130,148,0.5)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}
    >
      {branch ? `branch · ${index}` : `slot · ${index}`}
    </div>
  )
})

const FlyingRoleChip = React.memo(function FlyingRoleChip({
  step,
  accent,
  startAt,
  slotX,
  slotY,
  startX,
  startY,
  wave,
  lastDropEnd,
}: {
  step: ComposeStep
  accent: string
  startAt: number
  slotX: number
  slotY: number
  startX: number
  startY: number
  wave: number
  lastDropEnd: number
}) {
  const divRef = React.useRef<HTMLDivElement>(null)
  const isForm = step.mode === 'form'

  useSpriteEffect((lt) => {
    const el = divRef.current
    if (!el) return
    if (lt < startAt) {
      el.style.display = 'none'
      return
    }
    el.style.display = 'flex'

    const dropT = clamp((lt - startAt) / DROP_DUR, 0, 1)
    const settled = dropT >= 1
    const eased = Easing.easeInOutCubic(dropT)
    const arcLift = -36 * Math.sin(dropT * Math.PI)
    const x = startX + (slotX - startX) * eased
    const y = startY + (slotY - startY) * eased + arcLift
    const scale = 0.92 + eased * 0.08

    el.style.left = `${x}px`
    el.style.top = `${y}px`
    el.style.opacity = String(dropT)
    el.style.transform = `scale(${scale})`

    const glowProgress = clamp((lt - lastDropEnd + 0.1) / 0.9, 0, 1)
    const glowPulse = settled
      ? clamp((glowProgress - wave / 6) * 5, 0, 1) - clamp((glowProgress - wave / 6 - 0.18) * 5, 0, 1)
      : 0

    if (settled) {
      el.style.background = isForm
        ? 'linear-gradient(180deg, #101a3a 0%, #0c1330 100%)'
        : '#080d1f'
      el.style.borderColor = isForm ? `${accent}66` : 'rgba(255,255,255,0.1)'
      const base = isForm
        ? `0 6px 16px ${accent}33, inset 0 0 0 1px ${accent}22`
        : '0 4px 10px rgba(0,0,0,0.3)'
      el.style.boxShadow = glowPulse > 0
        ? `${base}, 0 0 ${(isForm ? 24 : 18) * glowPulse}px ${isForm ? accent : accent + 'aa'}`
        : base
    } else {
      el.style.background = `linear-gradient(180deg, ${accent}40 0%, ${accent}22 100%)`
      el.style.borderColor = `${accent}cc`
      el.style.boxShadow = `0 14px 36px ${accent}66, 0 0 32px ${accent}80`
    }
  })

  const fullStep = REAL_STEPS_BY_ID[step.id]
  if (!fullStep) return null

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 6,
        background: `linear-gradient(180deg, ${accent}40 0%, ${accent}22 100%)`,
        border: `1px solid ${accent}cc`,
        boxShadow: `0 14px 36px ${accent}66, 0 0 32px ${accent}80`,
        transform: 'scale(0.92)',
        opacity: 0,
        display: 'none',
        padding: '8px 10px',
        flexDirection: 'column',
        gap: 5,
        willChange: 'transform, opacity',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <StepIcon id={step.id} size={12} color={isForm ? '#ECECEA' : 'rgba(236,236,234,0.7)'} />
        <div
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 9.5,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: isForm ? '#ECECEA' : 'rgba(236,236,234,0.78)',
            fontWeight: 600,
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {fullStep.label}
        </div>
        <ChipModeBadge mode={step.mode} accent={accent} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, opacity: 0.85 }}>
        {isForm ? (
          <>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}22`, borderRadius: 1, width: '85%' }} />
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}22`, borderRadius: 1, width: '70%' }} />
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}22`, borderRadius: 1, width: '55%' }} />
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 1, width: '35%' }} />
              <div style={{ height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 1, width: '35%' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 1, width: '30%' }} />
              <div style={{ height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 1, width: '40%' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 1, width: '25%' }} />
              <div style={{ height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 1, width: '38%' }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
})

const ChipModeBadge = React.memo(function ChipModeBadge({ mode, accent }: { mode: 'form' | 'visual'; accent: string }) {
  const isForm = mode === 'form'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        padding: '1px 5px',
        borderRadius: 3,
        background: isForm ? `${accent}26` : 'rgba(255,255,255,0.05)',
        border: isForm ? `1px solid ${accent}80` : '1px solid rgba(255,255,255,0.12)',
        fontFamily: 'var(--f-mono)',
        fontSize: 7.5,
        color: isForm ? accent : 'rgba(236,236,234,0.55)',
        letterSpacing: '0.06em',
        flexShrink: 0,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: 2,
          background: isForm ? accent : 'rgba(236,236,234,0.55)',
          boxShadow: isForm ? `0 0 4px ${accent}` : 'none',
        }}
      />
      <span>{mode}</span>
    </div>
  )
})
