import React from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

export type EasingFn = (t: number) => number

export interface TimelineContextValue {
  time: number
  duration: number
  playing: boolean
  setTime: (t: number) => void
  setPlaying: (p: boolean | ((prev: boolean) => boolean)) => void
}

export interface SpriteContextValue {
  localTime: number
  progress: number
  duration: number
  visible: boolean
}

// ── Easing ───────────────────────────────────────────────────────────────────

export const Easing: Record<string, EasingFn> = {
  linear: (t) => t,

  easeInQuad:    (t) => t * t,
  easeOutQuad:   (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  easeInCubic:    (t) => t * t * t,
  easeOutCubic:   (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  easeInQuart:    (t) => t * t * t * t,
  easeOutQuart:   (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),

  easeInExpo:  (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0
    if (t === 1) return 1
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10)
    return 1 - 0.5 * Math.pow(2, -20 * t + 10)
  },

  easeInSine:    (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1
    return c3 * t * t * t - c1 * t * t
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158, c2 = c1 * 1.525
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
  },

  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3
    if (t === 0) return 0
    if (t === 1) return 1
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v))

export function interpolate(
  input: number[],
  output: number[],
  ease: EasingFn | EasingFn[] = Easing.linear,
): (t: number) => number {
  return (t) => {
    if (t <= input[0]) return output[0]
    if (t >= input[input.length - 1]) return output[output.length - 1]
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i]
        const local = span === 0 ? 0 : (t - input[i]) / span
        const easeFn = Array.isArray(ease) ? (ease[i] ?? Easing.linear) : ease
        const eased = easeFn(local)
        return output[i] + (output[i + 1] - output[i]) * eased
      }
    }
    return output[output.length - 1]
  }
}

export function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic,
}: {
  from?: number
  to?: number
  start?: number
  end?: number
  ease?: EasingFn
}): (t: number) => number {
  return (t) => {
    if (t <= start) return from
    if (t >= end) return to
    const local = (t - start) / (end - start)
    return from + (to - from) * ease(local)
  }
}

// ── Timeline context ─────────────────────────────────────────────────────────

export const TimelineContext = React.createContext<TimelineContextValue>({
  time: 0,
  duration: 10,
  playing: false,
  setTime: () => {},
  setPlaying: () => {},
})

export const useTime = () => React.useContext(TimelineContext).time
export const useTimeline = () => React.useContext(TimelineContext)

// ── Sprite ───────────────────────────────────────────────────────────────────

export const SpriteContext = React.createContext<SpriteContextValue>({
  localTime: 0,
  progress: 0,
  duration: 0,
  visible: false,
})

export const useSprite = () => React.useContext(SpriteContext)

interface SpriteProps {
  start?: number
  end?: number
  children: React.ReactNode | ((ctx: SpriteContextValue) => React.ReactNode)
  keepMounted?: boolean
}

export function Sprite({ start = 0, end = Infinity, children, keepMounted = false }: SpriteProps) {
  const { time } = useTimeline()
  const visible = time >= start && time <= end
  if (!visible && !keepMounted) return null

  const dur = end - start
  const localTime = Math.max(0, time - start)
  const progress = dur > 0 && isFinite(dur) ? clamp(localTime / dur, 0, 1) : 0
  const value: SpriteContextValue = { localTime, progress, duration: dur, visible }

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  )
}

// ── TextSprite ───────────────────────────────────────────────────────────────

interface TextSpriteProps {
  text: string
  x?: number
  y?: number
  size?: number
  color?: string
  font?: string
  weight?: number
  entryDur?: number
  exitDur?: number
  entryEase?: EasingFn
  exitEase?: EasingFn
  align?: 'left' | 'center' | 'right'
  letterSpacing?: string
}

export function TextSprite({
  text,
  x = 0, y = 0,
  size = 48,
  color = '#111',
  font = 'Inter, system-ui, sans-serif',
  weight = 600,
  entryDur = 0.45,
  exitDur = 0.35,
  entryEase = Easing.easeOutBack,
  exitEase = Easing.easeInCubic,
  align = 'left',
  letterSpacing = '-0.01em',
}: TextSpriteProps) {
  const { localTime, duration } = useSprite()
  const exitStart = Math.max(0, duration - exitDur)

  let opacity = 1
  let ty = 0

  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1))
    opacity = t
    ty = (1 - t) * 16
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1))
    opacity = 1 - t
    ty = -t * 8
  }

  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0'

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing,
      whiteSpace: 'pre',
      lineHeight: 1.1,
      willChange: 'transform, opacity',
    }}>
      {text}
    </div>
  )
}

// ── ImageSprite ──────────────────────────────────────────────────────────────

interface ImageSpriteProps {
  src?: string
  x?: number
  y?: number
  width?: number
  height?: number
  entryDur?: number
  exitDur?: number
  kenBurns?: boolean
  kenBurnsScale?: number
  radius?: number
  fit?: 'cover' | 'contain' | 'fill'
  placeholder?: { label?: string } | null
}

export function ImageSprite({
  src,
  x = 0, y = 0,
  width = 400, height = 300,
  entryDur = 0.6,
  exitDur = 0.4,
  kenBurns = false,
  kenBurnsScale = 1.08,
  radius = 12,
  fit = 'cover',
  placeholder = null,
}: ImageSpriteProps) {
  const { localTime, duration } = useSprite()
  const exitStart = Math.max(0, duration - exitDur)

  let opacity = 1
  let scale = 1

  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1))
    opacity = t
    scale = 0.96 + 0.04 * t
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1))
    opacity = 1 - t
    scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur
    const holdT = holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0
    scale = 1 + (kenBurnsScale - 1) * holdT
  }

  const content = placeholder ? (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
      color: '#6b6458',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 13,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      {placeholder.label ?? 'image'}
    </div>
  ) : (
    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
  )

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      borderRadius: radius,
      overflow: 'hidden',
      willChange: 'transform, opacity',
    }}>
      {content}
    </div>
  )
}

// ── RectSprite ───────────────────────────────────────────────────────────────

interface RectSpriteProps {
  x?: number
  y?: number
  width?: number
  height?: number
  color?: string
  radius?: number
  entryDur?: number
  exitDur?: number
  render?: (ctx: SpriteContextValue) => React.CSSProperties
}

export function RectSprite({
  x = 0, y = 0,
  width = 100, height = 100,
  color = '#111',
  radius = 8,
  entryDur = 0.4,
  exitDur = 0.3,
  render,
}: RectSpriteProps) {
  const spriteCtx = useSprite()
  const { localTime, duration } = spriteCtx
  const exitStart = Math.max(0, duration - exitDur)

  let opacity = 1
  let scale = 1

  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1))
    opacity = clamp(localTime / entryDur, 0, 1)
    scale = 0.4 + 0.6 * t
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1))
    opacity = 1 - t
    scale = 1 - 0.15 * t
  }

  const overrides = render ? render(spriteCtx) : {}

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      background: color,
      borderRadius: radius,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform, opacity',
      ...overrides,
    }} />
  )
}

// ── IconButton ───────────────────────────────────────────────────────────────

interface IconButtonProps {
  children: React.ReactNode
  onClick: () => void
  title?: string
}

function IconButton({ children, onClick, title }: IconButtonProps) {
  const [hover, setHover] = React.useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: '#f6f4ef',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  )
}

// ── PlaybackBar ──────────────────────────────────────────────────────────────

interface PlaybackBarProps {
  time: number
  duration: number
  playing: boolean
  isFullscreen: boolean
  onPlayPause: () => void
  onReset: () => void
  onSeek: (t: number) => void
  onHover: (t: number | null) => void
  onFullscreen: () => void
}

function PlaybackBar({ time, duration, playing, isFullscreen, onPlayPause, onReset, onSeek, onHover, onFullscreen }: PlaybackBarProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = React.useState(false)

  const timeFromEvent = React.useCallback((e: MouseEvent) => {
    if (!trackRef.current) return 0
    const rect = trackRef.current.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    return x * duration
  }, [duration])

  const onTrackMove = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const t = x * duration
    if (dragging) onSeek(t)
    else onHover(t)
  }

  const onTrackDown = (e: React.MouseEvent) => {
    setDragging(true)
    const rect = trackRef.current!.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    onSeek(x * duration)
    onHover(null)
  }

  React.useEffect(() => {
    if (!dragging) return
    const onUp = () => setDragging(false)
    const onMove = (e: MouseEvent) => {
      const t = timeFromEvent(e)
      onSeek(t)
    }
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mousemove', onMove)
    }
  }, [dragging, timeFromEvent, onSeek])

  const pct = duration > 0 ? (time / duration) * 100 : 0
  const fmt = (t: number) => {
    const total = Math.max(0, t)
    const m = Math.floor(total / 60)
    const s = Math.floor(total % 60)
    const cs = Math.floor((total * 100) % 100)
    return `${String(m)}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }

  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 16px',
      background: 'rgba(20,20,20,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
      borderRadius: 8,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0,
    }}>
      <IconButton onClick={onReset} title="Return to start (0)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </IconButton>
      <IconButton onClick={onPlayPause} title="Play/pause (space)">
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor"/>
            <rect x="8" y="2" width="3" height="10" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor"/>
          </svg>
        )}
      </IconButton>

      <div style={{
        fontFamily: mono, fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        width: 64, textAlign: 'right',
        color: '#f6f4ef',
      }}>
        {fmt(time)}
      </div>

      <div
        ref={trackRef}
        onMouseMove={onTrackMove}
        onMouseLeave={() => { if (!dragging) onHover(null) }}
        onMouseDown={onTrackDown}
        style={{
          flex: 1, height: 22,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 4,
          background: 'rgba(255,255,255,0.12)', borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute', left: 0, width: `${pct}%`, height: 4,
          background: 'oklch(72% 0.12 250)', borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute', left: `${pct}%`, top: '50%',
          width: 12, height: 12, marginLeft: -6, marginTop: -6,
          background: '#fff', borderRadius: 6,
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}/>
      </div>

      <div style={{
        fontFamily: mono, fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        width: 64, textAlign: 'left',
        color: 'rgba(246,244,239,0.55)',
      }}>
        {fmt(duration)}
      </div>

      <IconButton onClick={onFullscreen} title={isFullscreen ? 'Exit fullscreen (f)' : 'Fullscreen (f)'}>
        {isFullscreen ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2v3H2M9 2v3h3M5 12v-3H2M9 12v-3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 5V2h3M9 2h3v3M2 9v3h3M12 9v3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </IconButton>
    </div>
  )
}

// ── Stage ────────────────────────────────────────────────────────────────────

interface StageProps {
  width?: number
  height?: number
  duration?: number
  background?: string
  loop?: boolean
  autoplay?: boolean
  persistKey?: string
  initialTime?: number
  children?: React.ReactNode
}

export function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  initialTime,
  children,
}: StageProps) {
  const [time, setTime] = React.useState(() => {
    if (initialTime !== undefined) return clamp(initialTime, 0, duration)
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') ?? '0')
      return isFinite(v) ? clamp(v, 0, duration) : 0
    } catch { return 0 }
  })
  const [playing, setPlaying] = React.useState(autoplay)
  const [hoverTime, setHoverTime] = React.useState<number | null>(null)
  const [scale, setScale] = React.useState(1)
  const [nativeFull, setNativeFull] = React.useState(false)
  const [fakeFull, setFakeFull] = React.useState(false)
  const isFullscreen = nativeFull || fakeFull

  const stageRef = React.useRef<HTMLDivElement>(null)
  const rafRef = React.useRef<number>(0)
  const lastTsRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    try { localStorage.setItem(persistKey + ':t', String(time)) } catch {}
  }, [time, persistKey])

  React.useEffect(() => {
    const onChange = () => setNativeFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const handleFullscreen = React.useCallback(async () => {
    if (isFullscreen) {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        setFakeFull(false)
      }
      return
    }
    try {
      await stageRef.current?.requestFullscreen()
    } catch {
      setFakeFull(true)
    }
  }, [isFullscreen])

  React.useLayoutEffect(() => {
    if (!stageRef.current) return
    const el = stageRef.current
    const measure = () => {
      const barH = 44
      const s = Math.min(el.clientWidth / width, (el.clientHeight - barH) / height)
      setScale(Math.max(0.05, s + 5e-5))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [width, height])

  React.useEffect(() => {
    if (!playing) { lastTsRef.current = null; return }
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      setTime((t) => {
        let next = t + dt
        if (next >= duration) {
          if (loop) next = next % duration
          else { next = duration; setPlaying(false) }
        }
        return next
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(rafRef.current); lastTsRef.current = null }
  }, [playing, duration, loop])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.code === 'Space') {
        e.preventDefault()
        setPlaying((p) => !p)
      } else if (e.code === 'ArrowLeft') {
        setTime((t) => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration))
      } else if (e.code === 'ArrowRight') {
        setTime((t) => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration))
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0)
      } else if (e.key === 'f' || e.key === 'F') {
        handleFullscreen()
      } else if (e.code === 'Escape') {
        setFakeFull(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [duration, handleFullscreen])

  const displayTime = hoverTime != null ? hoverTime : time

  const ctxValue = React.useMemo<TimelineContextValue>(
    () => ({ time: displayTime, duration, playing, setTime, setPlaying }),
    [displayTime, duration, playing],
  )

  return (
    <div
      ref={stageRef}
      style={{
        position: fakeFull ? 'fixed' : 'absolute',
        inset: 0,
        zIndex: fakeFull ? 9999 : undefined,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{
        flex: 1, width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', minHeight: 0,
        background,
      }}>
        <div style={{
          width, height,
          background,
          position: 'relative',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          flexShrink: 0,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}>
          <TimelineContext.Provider value={ctxValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>

      <PlaybackBar
        time={displayTime}
        duration={duration}
        playing={playing}
        isFullscreen={isFullscreen}
        onPlayPause={() => setPlaying((p) => !p)}
        onReset={() => setTime(0)}
        onSeek={(t) => setTime(t)}
        onHover={(t) => setHoverTime(t)}
        onFullscreen={handleFullscreen}
      />
    </div>
  )
}
