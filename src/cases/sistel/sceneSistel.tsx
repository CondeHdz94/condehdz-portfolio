import React from 'react'
import { Sprite, useTime, clamp, Easing } from '../../components/animation'

// ── Brand ─────────────────────────────────────────────────────────────────────

const ACME = {
  primary:  '#E63946',
  accent:   '#1D3557',
  cream:    '#F8F4EC',
}

// ── Font stacks ───────────────────────────────────────────────────────────────

const F_DISPLAY = "'Fraunces', Georgia, 'Times New Roman', serif"
const F_UI      = "'Geist', 'Epilogue', 'Helvetica Neue', system-ui, sans-serif"
const F_MONO    = "'JetBrains Mono', ui-monospace, monospace"
const F_PPT     = "'Calibri', 'Carlito', 'Trebuchet MS', sans-serif"

// ── Grain overlay ─────────────────────────────────────────────────────────────

const GRAIN_STYLE: React.CSSProperties = {
  position: 'absolute', inset: 0, pointerEvents: 'none',
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
    "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>" +
    "<feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter>" +
    "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
  opacity: 0.06,
  mixBlendMode: 'multiply',
  zIndex: 2,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexAlpha(hex: string, a: number): string {
  const h = hex.replace('#', '')
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

// ── Static data ───────────────────────────────────────────────────────────────

const THUMBS = [
  { angle: 200, dist: 720, rot: -10, delay: 0.00 },
  { angle: 215, dist: 640, rot: -16, delay: 0.06 },
  { angle: 232, dist: 760, rot: -22, delay: 0.12 },
  { angle: 308, dist: 760, rot:  18, delay: 0.04 },
  { angle: 325, dist: 640, rot:  10, delay: 0.10 },
  { angle: 340, dist: 720, rot:  22, delay: 0.16 },
]

const CAPTIONS = [
  { t: 0.6,  end: 4.0,  kicker: '01 · Llega',       text: 'Un guión PowerPoint.' },
  { t: 4.5,  end: 7.5,  kicker: '02 · Realidad',    text: 'Plano. Denso. Sin alma.' },
  { t: 8.5,  end: 11.0, kicker: '03 · Transforma',  text: 'Articulate Storyline 360.' },
  { t: 11.5, end: 16.0, kicker: '04 · Construir',   text: 'Capas, disparadores, ritmo.' },
  { t: 16.5, end: 20.5, kicker: '05 · Publicar',    text: 'Hola, Acme Corp.' },
  { t: 20.5, end: 25.0, kicker: '06 · Interactivo', text: 'Quiz · Drag · Escenarios · Certificado.' },
  { t: 25.0, end: 28.0, kicker: 'Sistel',           text: 'De guión a experiencia.' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Primitive visual components
// ─────────────────────────────────────────────────────────────────────────────

function AcmeLogo({ size = 28, color = ACME.primary }: { size?: number; color?: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: size * 0.32,
      fontFamily: F_DISPLAY, fontWeight: 600,
      fontSize: size, color: '#161310', letterSpacing: '-0.02em', lineHeight: 1,
    }}>
      <svg width={size * 1.05} height={size * 1.05} viewBox="0 0 32 32" fill="none">
        <path d="M16 3 L28 27 L4 27 Z" fill={color} />
        <path d="M16 11 L22 23 L10 23 Z" fill="#fff" />
        <circle cx="16" cy="19" r="1.6" fill={color} />
      </svg>
      <span>Acme<span style={{ color, fontStyle: 'italic' }}>Corp</span></span>
    </div>
  )
}

interface PptSlideProps {
  width?: number
  height?: number
  title?: string
  bullets?: string[]
  slideNum?: number
  totalSlides?: number
  shadow?: boolean
  shake?: number
}

function PptSlide({
  width = 880, height = 560,
  title = 'MÓDULO 1 — BIENVENIDA A ACME CORP',
  bullets = [
    'Acme Corp fue fundada en 1985 con el objetivo de ser líder en logística.',
    'Contamos con más de 5.000 colaboradores en 12 países de Latinoamérica.',
    'Nuestros valores son: integridad, innovación, servicio al cliente y trabajo en equipo.',
    'El proceso de inducción tiene una duración estimada de 2 horas y 30 minutos.',
    'Al finalizar deberá completar la evaluación con un mínimo del 80% para aprobar.',
  ],
  slideNum = 3, totalSlides = 47,
  shadow = true,
  shake = 0,
}: PptSlideProps) {
  const sx = shake > 0
    ? `translate(${(Math.random() - 0.5) * shake * 6}px,${(Math.random() - 0.5) * shake * 6}px) rotate(${(Math.random() - 0.5) * shake * 1.5}deg)`
    : undefined
  return (
    <div style={{
      width, height, background: '#FFFFFF',
      border: '1px solid #C9C2B2',
      boxShadow: shadow ? '0 24px 60px rgba(0,0,0,0.18),0 4px 14px rgba(0,0,0,0.08)' : 'none',
      fontFamily: F_PPT, color: '#262626',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      transform: sx,
    }}>
      <div style={{
        background: 'linear-gradient(180deg,#1F4E79 0%,#174063 100%)',
        color: 'white', padding: '22px 38px',
        fontSize: 30, fontWeight: 700, letterSpacing: '-0.005em',
        borderBottom: '4px solid #4472C4',
      }}>
        {title}
      </div>
      <div style={{ flex: 1, padding: '34px 44px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 22, lineHeight: 1.35 }}>
            <span style={{ color: '#4472C4', fontSize: 22, lineHeight: 1.2, fontWeight: 700 }}>•</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 38px', borderTop: '1px solid #E0DACA',
        fontSize: 13, color: '#8C857A',
      }}>
        <span style={{ letterSpacing: '0.05em' }}>ACME CORP — CONFIDENCIAL</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{slideNum} / {totalSlides}</span>
      </div>
    </div>
  )
}

function PptThumbnail({ width = 220, height = 140 }: { width?: number; height?: number }) {
  return (
    <div style={{
      width, height, background: '#fff', border: '1px solid #C9C2B2',
      boxShadow: '0 6px 16px rgba(0,0,0,0.10)', fontFamily: F_PPT,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ height: 22, background: '#1F4E79', padding: '4px 10px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '60%', height: 6, background: '#fff', opacity: 0.85, borderRadius: 1 }} />
      </div>
      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 4, height: 4, background: '#4472C4', borderRadius: 1 }} />
            <div style={{ height: 5, background: '#D4CEC0', borderRadius: 1, width: `${60 + ((i * 13) % 30)}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Debris({ x, y, rot = 0, w = 60, h = 8, color = '#4472C4', opacity = 1 }: {
  x: number; y: number; rot?: number; w?: number; h?: number; color?: string; opacity?: number
}) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: w, height: h, background: color,
      transform: `rotate(${rot}deg)`,
      opacity, borderRadius: 1,
      boxShadow: '0 2px 4px rgba(0,0,0,0.10)',
    }} />
  )
}

function Caption({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <div style={{ fontFamily: F_UI, color: '#161310' }}>
      {kicker && (
        <div style={{
          fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#8E867A', marginBottom: 6, fontWeight: 600,
        }}>
          {kicker}
        </div>
      )}
      <div style={{
        fontFamily: F_DISPLAY, fontSize: 22, lineHeight: 1.15,
        fontWeight: 400, letterSpacing: '-0.02em',
      }}>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Storyline editor chrome
// ─────────────────────────────────────────────────────────────────────────────

interface StorylineEditorProps {
  width?: number
  height?: number
  build?: number
  children?: React.ReactNode
}

function StorylineEditor({ width = 1520, height = 900, build = 1, children }: StorylineEditorProps) {
  const ribbonOp  = Math.min(1, build * 1.4)
  const leftOp    = Math.max(0, Math.min(1, (build - 0.20) * 1.4))
  const rightOp   = Math.max(0, Math.min(1, (build - 0.35) * 1.4))
  const timelineOp = Math.max(0, Math.min(1, (build - 0.55) * 1.4))

  return (
    <div style={{
      width, height, background: '#F3F1ED',
      border: '1px solid #C9C2B2',
      boxShadow: '0 30px 80px rgba(0,0,0,0.22),0 8px 20px rgba(0,0,0,0.10)',
      borderRadius: 6, overflow: 'hidden',
      fontFamily: F_UI, color: '#161310',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Title bar */}
      <div style={{
        height: 30, background: '#26303A', color: '#E4E1DA',
        display: 'flex', alignItems: 'center', padding: '0 14px',
        fontSize: 12, fontWeight: 500, gap: 10,
        opacity: ribbonOp,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#EE5D52', '#F4BE3A', '#54C247'].map((c, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: F_UI, fontSize: 11.5, color: '#9AA0A6' }}>
          Articulate Storyline 360 · Induccion_AcmeCorp.story
        </div>
      </div>

      {/* Ribbon */}
      <div style={{
        height: 78, background: '#FAF8F3', borderBottom: '1px solid #D6D0BF',
        display: 'flex', padding: '8px 16px', gap: 22,
        opacity: ribbonOp,
      }}>
        {[
          { tab: 'Inicio',   items: ['Diapositiva','Texto','Botón','Forma','Imagen','Video'] },
          { tab: 'Insertar', items: ['Personaje','Animación','Disparador','Variable','Layer'] },
          { tab: 'Diseño',   items: ['Tema','Fondo','Color'] },
        ].map((group) => (
          <div key={group.tab} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              {group.items.map((it) => (
                <div key={it} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '2px 6px', borderRadius: 4 }}>
                  <div style={{
                    width: 28, height: 28, background: '#FFFFFF',
                    border: '1px solid #DBD4C2', borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#2E3FFF', fontSize: 13, fontWeight: 700,
                  }}>
                    {it[0]}
                  </div>
                  <div style={{ fontSize: 9.5, color: '#5C564B', letterSpacing: '0.01em' }}>{it}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: '#9A9384', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'center' }}>
              {group.tab}
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Scene list */}
        <div style={{
          width: 200, background: '#EEEAE0', borderRight: '1px solid #D6D0BF',
          padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8,
          opacity: leftOp,
        }}>
          <div style={{ fontSize: 10, color: '#7A7263', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Escenas
          </div>
          {[
            { label: 'Bienvenida', active: true },
            { label: 'Misión y valores', active: false },
            { label: 'Quiz · valores', active: false },
            { label: 'Procesos', active: false },
            { label: 'Drag & drop', active: false },
            { label: 'Escenario', active: false },
            { label: 'Certificado', active: false },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '6px 8px', borderRadius: 4,
              background: s.active ? '#2E3FFF' : 'transparent',
              color: s.active ? '#fff' : '#3A342A',
              fontSize: 11, fontWeight: s.active ? 600 : 400,
              border: s.active ? 'none' : '1px solid transparent',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>{i + 1}. {s.label}</span>
              {s.active && <span style={{ fontSize: 9, opacity: 0.8 }}>●</span>}
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div style={{
          flex: 1, background: '#D8D2C2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {children}
        </div>

        {/* Triggers panel */}
        <div style={{
          width: 240, background: '#EEEAE0', borderLeft: '1px solid #D6D0BF',
          padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 10,
          opacity: rightOp,
        }}>
          <div style={{ fontSize: 10, color: '#7A7263', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Disparadores
          </div>
          {[
            ['Al hacer clic',  'Botón_Inicio',  'Mostrar capa "Intro"'],
            ['Cuando inicia',  'Diapositiva',   'Reproducir animación'],
            ['Al soltar',      'Pieza_Valor',   'Verificar zona'],
            ['Al responder',   'Quiz',          'Mostrar feedback'],
          ].map((t, i) => (
            <div key={i} style={{
              background: '#FFFFFF', border: '1px solid #DBD4C2', borderRadius: 4,
              padding: '8px 10px', fontSize: 10.5, lineHeight: 1.35, fontFamily: F_UI,
            }}>
              <div style={{ color: '#2E3FFF', fontWeight: 600, marginBottom: 2 }}>{t[0]}</div>
              <div style={{ color: '#3A342A' }}>{t[1]}</div>
              <div style={{ color: '#7A7263', marginTop: 2 }}>→ {t[2]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        height: 88, background: '#FAF8F3', borderTop: '1px solid #D6D0BF',
        padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 6,
        opacity: timelineOp,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#7A7263', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <span>Línea de tiempo</span>
          <span style={{ fontFamily: F_MONO }}>00:00 / 00:08</span>
        </div>
        {[
          { label: 'Título',    color: '#2E3FFF', x: 0,    w: 0.55 },
          { label: 'Personaje', color: '#FF6033', x: 0.15, w: 0.65 },
          { label: 'Texto',     color: '#6B46E5', x: 0.25, w: 0.50 },
          { label: 'Botón',     color: '#00B894', x: 0.60, w: 0.30 },
        ].map((tr) => (
          <div key={tr.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 60, fontSize: 9.5, color: '#5C564B', textAlign: 'right' }}>{tr.label}</div>
            <div style={{ flex: 1, height: 8, background: '#EBE5D4', borderRadius: 2, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: `${tr.x * 100}%`, width: `${tr.w * 100}%`,
                top: 0, bottom: 0, background: tr.color, borderRadius: 2,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Canvas content inside Storyline editor ────────────────────────────────────

interface CanvasContentProps {
  build: number
  titleEntry: number
  charEntry: number
  textEntry: number
  btnEntry: number
}

function StorylineCanvasContent({ build, titleEntry, charEntry, textEntry, btnEntry }: CanvasContentProps) {
  return (
    <div style={{
      width: 920, height: 520, background: ACME.cream,
      borderRadius: 4, position: 'relative', overflow: 'hidden',
      boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      border: '1px solid rgba(0,0,0,0.06)',
    }}>
      {/* Brand bar */}
      <div style={{
        height: 50, background: 'rgba(255,255,255,0.7)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        opacity: titleEntry,
      }}>
        <AcmeLogo size={16} color={ACME.primary} />
        <div style={{ width: 100, height: 4, background: ACME.primary, opacity: 0.9, borderRadius: 2 }} />
      </div>

      {/* Body */}
      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, height: 'calc(100% - 50px)', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ opacity: titleEntry, transform: `translateY(${(1 - titleEntry) * 14}px)` }}>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACME.accent, fontWeight: 600, marginBottom: 6, fontFamily: F_UI }}>
              Bienvenida
            </div>
            <div style={{ fontFamily: F_DISPLAY, fontSize: 46, lineHeight: 1.02, color: ACME.accent, fontWeight: 500, letterSpacing: '-0.02em' }}>
              Bienvenido a{' '}
              <span style={{ fontStyle: 'italic', color: ACME.primary }}>Acme Corp</span>.
            </div>
          </div>
          <div style={{
            opacity: textEntry, transform: `translateY(${(1 - textEntry) * 12}px)`,
            fontSize: 15, color: '#34495E', lineHeight: 1.4, maxWidth: 380, fontFamily: F_UI,
          }}>
            Una experiencia interactiva diseñada para acompañarte en tu primer día.
          </div>
          <div style={{
            opacity: btnEntry,
            transform: `translateY(${(1 - btnEntry) * 10}px) scale(${0.94 + 0.06 * btnEntry})`,
            display: 'flex', gap: 10, marginTop: 6,
          }}>
            <div style={{
              padding: '10px 18px', background: ACME.primary, color: '#fff',
              borderRadius: 999, fontSize: 12, fontWeight: 600, fontFamily: F_UI,
              boxShadow: '0 6px 14px rgba(230,57,70,0.25)',
            }}>Comenzar →</div>
            <div style={{
              padding: '10px 16px', background: 'transparent', color: ACME.accent,
              border: '1.2px solid rgba(29,53,87,0.25)', borderRadius: 999,
              fontSize: 12, fontWeight: 500, fontFamily: F_UI,
            }}>Ver contenido</div>
          </div>
        </div>

        <div style={{
          opacity: charEntry,
          transform: `translateY(${(1 - charEntry) * 20}px) scale(${0.9 + 0.1 * charEntry})`,
          display: 'flex', justifyContent: 'center',
        }}>
          <GuideGeometric size={190} primary={ACME.primary} accent={ACME.accent} />
        </div>
      </div>

      {/* Design-mode selection handles */}
      {build > 0.1 && build < 0.95 && (
        <div style={{
          position: 'absolute', left: 30, top: 70, right: 30, bottom: 30,
          border: '1px dashed rgba(46,63,255,0.5)',
          pointerEvents: 'none',
        }}>
          {[[-4,-4],[undefined,-4],[-4,undefined],[undefined,undefined]].map(([l,r], i) => (
            <div key={i} style={{
              position: 'absolute',
              left: l !== undefined ? -4 : undefined,
              right: r !== undefined ? undefined : -4,
              top: i < 2 ? -4 : undefined,
              bottom: i >= 2 ? -4 : undefined,
              width: 8, height: 8, background: '#2E3FFF', borderRadius: 1,
            }} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Published slide ───────────────────────────────────────────────────────────

interface PublishedSlideProps {
  width?: number
  height?: number
  subtitle?: string
  progress?: number
  primary?: string
  accent?: string
  titleEntry?: number
  characterEntry?: number
  ctaEntry?: number
}

function PublishedSlide({
  width = 1280, height = 720,
  subtitle = 'Una experiencia interactiva para tu inducción.',
  progress = 0.18,
  primary = ACME.primary,
  accent  = ACME.accent,
  titleEntry     = 1,
  characterEntry = 1,
  ctaEntry       = 1,
}: PublishedSlideProps) {
  const HEADER_H = 78
  return (
    <div style={{
      width, height, background: ACME.cream,
      borderRadius: 14, overflow: 'hidden', position: 'relative',
      boxShadow: '0 30px 80px rgba(0,0,0,0.25),0 8px 20px rgba(0,0,0,0.10)',
      fontFamily: F_UI, color: '#1A1714',
    }}>
      {/* Top bar */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: HEADER_H,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 36px', borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: 'rgba(255,255,255,0.55)',
      }}>
        <AcmeLogo size={22} color={primary} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 12, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Módulo 1 / 7
          </div>
          <div style={{ width: 160, height: 6, background: 'rgba(29,53,87,0.12)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', background: primary }} />
          </div>
        </div>
      </div>

      {/* Text block */}
      <div style={{
        position: 'absolute', left: 56, top: HEADER_H + 90, width: 640,
        opacity: titleEntry,
        transform: `translateY(${(1 - titleEntry) * 24}px)`,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: accent, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 18 }}>
          <span style={{ width: 28, height: 2, background: primary, display: 'inline-block' }} />
          <span>Bienvenida</span>
        </div>
        <h1 style={{
          margin: 0, fontFamily: F_DISPLAY,
          fontSize: 66, lineHeight: 1.05, color: accent,
          fontWeight: 500, letterSpacing: '-0.025em',
        }}>
          Bienvenido a{' '}
          <span style={{ fontStyle: 'italic', color: primary }}>Acme Corp</span>.
        </h1>
        <p style={{ margin: '22px 0 0 0', fontSize: 21, lineHeight: 1.4, color: '#34495E', maxWidth: 520 }}>{subtitle}</p>
        <div style={{
          display: 'flex', gap: 12, marginTop: 28,
          opacity: ctaEntry, transform: `translateY(${(1 - ctaEntry) * 16}px)`,
        }}>
          <div style={{ padding: '14px 26px', background: primary, color: '#fff', borderRadius: 999, fontSize: 16, fontWeight: 600, boxShadow: '0 8px 20px rgba(230,57,70,0.28)' }}>
            Comenzar inducción →
          </div>
          <div style={{ padding: '14px 22px', background: 'transparent', color: accent, border: '1.5px solid rgba(29,53,87,0.25)', borderRadius: 999, fontSize: 16, fontWeight: 500 }}>
            Ver contenido
          </div>
        </div>
      </div>

      {/* Character */}
      <div style={{
        position: 'absolute', right: 80, top: HEADER_H + 40,
        width: 360, height: height - HEADER_H - 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: characterEntry,
        transform: `scale(${0.92 + 0.08 * characterEntry})`,
        transformOrigin: 'center',
      }}>
        <div style={{ position: 'relative' }}>
          <GuideGeometric size={340} primary={primary} accent={accent} />
          <div style={{
            position: 'absolute', top: 10, left: -30,
            background: '#fff', padding: '12px 18px', borderRadius: 16,
            fontSize: 14, color: accent, fontWeight: 500, maxWidth: 210,
            boxShadow: '0 8px 22px rgba(0,0,0,0.10)', lineHeight: 1.35,
          }}>
            ¡Hola! Soy Sofía, tu guía.
            <div style={{
              position: 'absolute', bottom: -6, left: 28,
              width: 12, height: 12, background: '#fff', transform: 'rotate(45deg)',
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Character avatar — geometric style
// ─────────────────────────────────────────────────────────────────────────────

function GuideGeometric({ size, primary, accent }: { size: number; primary: string; accent: string }) {
  return (
    <svg
      width={size}
      height={size * (300 / 260)}
      viewBox="0 0 260 300"
      style={{ filter: 'drop-shadow(0 22px 34px rgba(0,0,0,0.18))', overflow: 'visible' }}
    >
      <circle cx="130" cy="150" r="118" fill={primary} opacity="0.10" />
      <circle cx="130" cy="150" r="98"  fill={primary} opacity="0.06" />
      <path d="M 30 300 C 36 246, 64 222, 92 218 L 168 218 C 196 222, 224 246, 230 300 Z" fill={accent} />
      <path d="M 92 218 C 70 226, 50 250, 42 290 L 60 300 L 30 300 C 36 246, 64 222, 92 218 Z" fill="#fff" opacity="0.07" />
      <path d="M 100 218 Q 130 240, 160 218" stroke={primary} strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="118" y="178" width="24" height="42" rx="6" fill="#D9A87A" />
      <ellipse cx="130" cy="132" rx="48" ry="54" fill="#EDC09A" />
      <path d="M 82 124 C 78 86, 102 64, 132 62 C 168 60, 184 82, 184 110 C 184 126, 178 134, 178 134 L 168 110 C 156 118, 124 122, 110 116 L 98 138 Q 86 130, 82 124 Z" fill={accent} />
      <path d="M 108 70 Q 100 90, 96 116" stroke={primary} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
      <ellipse cx="82"  cy="140" rx="5" ry="9" fill="#D9A87A" />
      <ellipse cx="178" cy="140" rx="5" ry="9" fill="#D9A87A" />
      <circle cx="178" cy="152" r="3" fill={primary} />
      <path d="M 113 130 Q 119 134, 125 130" stroke="#1A1714" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M 137 130 Q 143 134, 149 130" stroke="#1A1714" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="150" r="6" fill={primary} opacity="0.28" />
      <circle cx="160" cy="150" r="6" fill={primary} opacity="0.28" />
      <path d="M 116 158 Q 131 172, 146 158" stroke="#1A1714" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="86"  cy="244" r="6"   fill={primary} />
      <circle cx="86"  cy="244" r="2.4" fill="#fff" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature card components (BeatFeatureMontage)
// ─────────────────────────────────────────────────────────────────────────────

function Rosette({ x, y, size, color, opacity = 0.08 }: {
  x: number; y: number; size: number; color: string; opacity?: number
}) {
  const teeth = 18
  const r1 = size / 2
  const r2 = r1 * 0.86
  const points: string[] = []
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2
    const r = i % 2 === 0 ? r1 : r2
    points.push(`${Math.cos(a) * r},${Math.sin(a) * r}`)
  }
  return (
    <svg style={{ position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none' }}
      width={size} height={size} viewBox={`${-r1} ${-r1} ${size} ${size}`}>
      <polygon points={points.join(' ')} fill={color} />
      <circle r={r1 * 0.62} fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 5" />
      <circle r={r1 * 0.42} fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 5" />
    </svg>
  )
}

function Confetti({ x, y, color, angle = 0, size = 14 }: {
  x: number; y: number; color: string; angle?: number; size?: number
}) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size * 0.32, background: color,
      transform: `rotate(${angle}deg)`, borderRadius: 1,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }} />
  )
}

function CertSeal({ primary, accent }: { primary: string; accent: string }) {
  const teeth = 28
  const cx = 160, cy = 160
  const rOuter = 150, rInner = 138
  const pts: string[] = []
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? rOuter : rInner
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`)
  }
  return (
    <svg width="320" height="320" viewBox="0 0 320 320" style={{ filter: `drop-shadow(0 24px 36px ${hexAlpha(primary, 0.22)})` }}>
      <defs>
        <linearGradient id="sealGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={primary} />
          <stop offset="100%" stopColor={primary} stopOpacity="0.78" />
        </linearGradient>
      </defs>
      <polygon points={pts.join(' ')} fill="url(#sealGrad)" />
      <circle cx={cx} cy={cy} r="118" fill="#FFFBF1" stroke={primary} strokeWidth="2" />
      <circle cx={cx} cy={cy} r="104" fill="none" stroke={primary} strokeWidth="1.5" strokeDasharray="2 6" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2
        const sx = cx + Math.cos(a) * 90
        const sy = cy + Math.sin(a) * 90
        return (
          <path key={i} d={`M ${sx} ${sy - 5} L ${sx + 1.5} ${sy - 1.5} L ${sx + 5} ${sy} L ${sx + 1.5} ${sy + 1.5} L ${sx} ${sy + 5} L ${sx - 1.5} ${sy + 1.5} L ${sx - 5} ${sy} L ${sx - 1.5} ${sy - 1.5} Z`} fill={primary} opacity="0.5" />
        )
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fontFamily={F_DISPLAY} fontStyle="italic" fontSize="86" fontWeight="500" fill={accent} letterSpacing="-3">
        100
      </text>
      <text x={cx} y={cy + 32} textAnchor="middle" fontFamily={F_UI} fontSize="11" letterSpacing="0.32em" fontWeight="700" fill={primary}>
        APROBADO
      </text>
      <path d={`M ${cx - 36} ${cy + 142} L ${cx - 22} ${cy + 188} L ${cx - 8} ${cy + 168} L ${cx + 8} ${cy + 168} L ${cx + 22} ${cy + 188} L ${cx + 36} ${cy + 142} Z`} fill={primary} opacity="0.9" />
      <path d={`M ${cx - 36} ${cy + 142} L ${cx - 22} ${cy + 188} L ${cx - 14} ${cy + 168} L ${cx - 8} ${cy + 142} Z`} fill={primary} />
      <path d={`M ${cx + 36} ${cy + 142} L ${cx + 22} ${cy + 188} L ${cx + 14} ${cy + 168} L ${cx + 8} ${cy + 142} Z`} fill={primary} />
    </svg>
  )
}

function FeatureHeader({ label, tag }: { label: string; tag: string }) {
  return (
    <div style={{
      padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.7)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <AcmeLogo size={16} color={ACME.primary} />
        <span style={{ fontSize: 13, color: ACME.accent, fontWeight: 500, fontFamily: F_UI }}>{label}</span>
      </div>
      <div style={{
        padding: '6px 12px', background: 'rgba(46,63,255,0.1)', color: '#2E3FFF',
        borderRadius: 999, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', fontFamily: F_UI,
      }}>
        {tag}
      </div>
    </div>
  )
}

const CARD_BASE: React.CSSProperties = {
  width: 1100, height: 640, background: '#fff', borderRadius: 18,
  boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
  fontFamily: F_UI, overflow: 'hidden', position: 'relative',
}

function FeatureCard({ kind }: { kind: 'quiz' | 'drag' | 'branch' | 'cert' }) {
  if (kind === 'quiz') return (
    <div style={CARD_BASE}>
      <FeatureHeader label="Quiz · Pregunta 3 / 8" tag="Interactivo" />
      <div style={{ padding: '48px 60px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <h2 style={{ margin: 0, fontFamily: F_DISPLAY, fontSize: 40, color: ACME.accent, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          ¿Cuál es <span style={{ fontStyle: 'italic', color: ACME.primary }}>uno</span> de los valores de Acme Corp?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { t: 'Innovación', correct: true },
            { t: 'Velocidad' },
            { t: 'Exclusividad' },
            { t: 'Sigilo' },
          ].map((o, i) => (
            <div key={i} style={{
              padding: '18px 22px', borderRadius: 12,
              border: o.correct ? `2px solid ${ACME.primary}` : '1.5px solid rgba(0,0,0,0.10)',
              background: o.correct ? 'rgba(230,57,70,0.06)' : '#FAF8F3',
              fontSize: 18, color: ACME.accent, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>{o.t}</span>
              {o.correct && (
                <span style={{
                  width: 26, height: 26, background: ACME.primary, color: '#fff',
                  borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                }}>✓</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 18px', background: 'rgba(0,184,148,0.10)', borderLeft: `3px solid ${ACME.primary}`, borderRadius: 6, fontSize: 14, color: ACME.accent }}>
          <strong>¡Correcto!</strong> La innovación es uno de los cuatro pilares de Acme.
        </div>
      </div>
    </div>
  )

  if (kind === 'drag') return (
    <div style={CARD_BASE}>
      <FeatureHeader label="Arrastra y suelta" tag="Drag & Drop" />
      <div style={{ position: 'absolute', left: 60, right: 60, top: 110 }}>
        <div style={{ fontFamily: F_DISPLAY, fontSize: 30, color: ACME.accent, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 28 }}>
          Arrastra cada valor a su definición.
        </div>
        <div style={{ display: 'flex', gap: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 240 }}>
            {['Integridad', 'Innovación', 'Servicio'].map((p, i) => (
              <div key={i} style={{
                padding: '14px 20px', background: '#fff',
                border: `1.5px solid ${i === 1 ? ACME.primary : 'rgba(0,0,0,0.10)'}`,
                borderRadius: 10, fontSize: 16, fontWeight: 600, color: ACME.accent,
                boxShadow: i === 1 ? '0 12px 24px rgba(230,57,70,0.25)' : '0 2px 6px rgba(0,0,0,0.06)',
                transform: i === 1 ? 'rotate(-3deg) translateX(20px) scale(1.04)' : 'none',
                position: 'relative', zIndex: i === 1 ? 2 : 1,
              }}>
                <span style={{ color: ACME.primary, marginRight: 8 }}>⋮⋮</span>{p}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Buscar siempre nuevas formas de hacer mejor las cosas.', filled: true },
              { label: 'Actuar con coherencia entre lo que decimos y hacemos.' },
              { label: 'Anticipar las necesidades del cliente.' },
            ].map((tg, i) => (
              <div key={i} style={{
                padding: '14px 20px',
                border: `2px dashed ${tg.filled ? ACME.primary : 'rgba(0,0,0,0.20)'}`,
                borderRadius: 10, fontSize: 14, color: '#34495E', minHeight: 50,
                display: 'flex', alignItems: 'center',
                background: tg.filled ? 'rgba(230,57,70,0.06)' : 'transparent',
              }}>
                {tg.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (kind === 'branch') return (
    <div style={CARD_BASE}>
      <FeatureHeader label="Escenario · Decisión 2" tag="Ramificación" />
      <div style={{ position: 'absolute', left: 56, top: 100, width: 380 }}>
        <GuideGeometric size={200} primary={ACME.primary} accent={ACME.accent} />
        <div style={{
          marginTop: 16, background: ACME.cream, padding: '14px 18px', borderRadius: 14,
          fontSize: 14, color: ACME.accent, lineHeight: 1.4, border: '1px solid rgba(0,0,0,0.05)',
        }}>
          <strong>Un cliente llama enojado.</strong> Es tu primer día. ¿Qué haces?
        </div>
      </div>
      <div style={{ position: 'absolute', right: 56, top: 116, width: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { t: 'Lo escucho con calma y tomo nota.', good: true, letter: 'A' },
          { t: 'Le digo que llame mañana.',            letter: 'B' },
          { t: 'Transfiero la llamada de inmediato.',  letter: 'C' },
        ].map((opt, i) => (
          <div key={i} style={{
            padding: '16px 22px', background: '#fff',
            border: opt.good ? `2px solid ${ACME.primary}` : '1.5px solid rgba(0,0,0,0.12)',
            borderRadius: 12, fontSize: 16, color: ACME.accent,
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: opt.good ? '0 8px 18px rgba(230,57,70,0.18)' : 'none',
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 13,
              background: opt.good ? ACME.primary : 'transparent',
              border: opt.good ? 'none' : '1.5px solid rgba(0,0,0,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: opt.good ? '#fff' : ACME.accent, fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>{opt.letter}</div>
            <span>{opt.t}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, display: 'flex', gap: 16, alignItems: 'center', fontSize: 11, color: '#7A7263', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>Camino →</span>
          <svg width="120" height="20">
            <path d="M0 10 Q 30 10, 50 4 T 120 10" stroke={ACME.primary} strokeWidth="2" fill="none"/>
            <circle cx="120" cy="10" r="3.5" fill={ACME.primary}/>
          </svg>
          <span style={{ color: ACME.primary, fontWeight: 600 }}>Resolución exitosa</span>
        </div>
      </div>
    </div>
  )

  if (kind === 'cert') return (
    <div style={{ ...CARD_BASE, background: `radial-gradient(120% 80% at 20% 0%,${ACME.cream} 0%,#FFFFFF 60%,#FFFFFF 100%)` }}>
      <FeatureHeader label="Certificación" tag="100% completado" />
      <Rosette x={-60} y={-60} size={220} color={ACME.primary} opacity={0.06} />
      <Rosette x={920} y={420} size={260} color={ACME.accent}  opacity={0.05} />
      <div style={{
        position: 'absolute', left: -20, top: 220, width: 360, height: 10,
        background: `linear-gradient(90deg,${ACME.primary} 0%,transparent 100%)`,
        opacity: 0.18, transform: 'rotate(-8deg)', transformOrigin: 'left center',
      }} />
      <div style={{ position: 'absolute', left: 80, top: 140, width: 320, height: 320 }}>
        <CertSeal primary={ACME.primary} accent={ACME.accent} />
        <Confetti x={-20}  y={-10}  color={ACME.primary} angle={-18} />
        <Confetti x={280}  y={20}   color="#F4B400"      angle={24}  />
        <Confetti x={310}  y={280}  color="#00B894"      angle={-12} />
        <Confetti x={-30}  y={300}  color={ACME.accent}  angle={42}  size={10} />
      </div>
      <div style={{ position: 'absolute', left: 480, top: 130, right: 56 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACME.primary, fontWeight: 700, marginBottom: 12, fontFamily: F_UI }}>
          Acme Corp · {new Date().getFullYear()}
        </div>
        <h2 style={{ margin: 0, fontFamily: F_DISPLAY, fontSize: 56, lineHeight: 1.0, color: ACME.accent, fontWeight: 400, letterSpacing: '-0.03em' }}>
          Inducción <span style={{ fontStyle: 'italic', color: ACME.primary }}>completada</span>.
        </h2>
        <div style={{ fontSize: 16, color: '#475569', lineHeight: 1.5, marginTop: 18, maxWidth: 460, fontFamily: F_UI }}>
          Felicitaciones. Has finalizado el módulo con una nota sobresaliente.
        </div>
        <div style={{ display: 'flex', gap: 0, marginTop: 24, borderTop: `1px solid rgba(29,53,87,0.12)`, borderBottom: `1px solid rgba(29,53,87,0.12)`, padding: '14px 0' }}>
          {[
            { k: 'Participante', v: 'María Restrepo' },
            { k: 'Duración',     v: '2h 38m' },
            { k: 'Puntuación',   v: '96 / 100' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1,
              paddingLeft: i === 0 ? 0 : 20,
              borderLeft: i === 0 ? 'none' : '1px solid rgba(29,53,87,0.10)',
            }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8E867A', fontWeight: 600, marginBottom: 4, fontFamily: F_UI }}>{s.k}</div>
              <div style={{ fontFamily: F_DISPLAY, fontSize: 20, color: ACME.accent, fontWeight: 500, letterSpacing: '-0.01em' }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
          <div style={{
            padding: '13px 22px', background: ACME.primary, color: '#fff',
            borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: F_UI,
            boxShadow: `0 10px 22px ${hexAlpha(ACME.primary, 0.28)}`,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 1v9M4 6l4 4 4-4M2 14h12" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Descargar certificado
          </div>
          <div style={{
            padding: '13px 22px', background: 'transparent', color: ACME.accent,
            border: '1.5px solid rgba(29,53,87,0.22)', borderRadius: 999,
            fontSize: 14, fontWeight: 500, fontFamily: F_UI,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16"><circle cx="4" cy="8" r="2" stroke={ACME.accent} strokeWidth="1.5" fill="none"/><circle cx="12" cy="3" r="2" stroke={ACME.accent} strokeWidth="1.5" fill="none"/><circle cx="12" cy="13" r="2" stroke={ACME.accent} strokeWidth="1.5" fill="none"/><path d="M5.5 7L10.5 4M5.5 9L10.5 12" stroke={ACME.accent} strokeWidth="1.5"/></svg>
            Compartir
          </div>
        </div>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: '#8E867A', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, fontFamily: F_UI }}>
          <div style={{ width: 24, height: 1.5, background: 'rgba(29,53,87,0.25)' }} />
          <span>Emitido por Acme Corp · Sistel e-Learning</span>
        </div>
      </div>
    </div>
  )

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Beat components
// ─────────────────────────────────────────────────────────────────────────────

function BgSequential() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(120% 80% at 50% 40%,#F8F3E6 0%,#EDE6D4 100%)',
    }}>
      <div style={GRAIN_STYLE} />
    </div>
  )
}

// 0–8.4s: PPT slide arrives, fan of thumbnails, zoom-in, crack/exit
function BeatPptArrives() {
  return (
    <Sprite start={0} end={8.4}>
      {({ localTime }) => {
        const entryE = Easing.easeOutCubic(clamp(localTime / 1.4, 0, 1))
        const absorb = clamp((localTime - 2.5) / 1.3, 0, 1)
        const absorbE = Easing.easeInOutCubic(absorb)
        const zoom = clamp((localTime - 3.8) / 2.6, 0, 1)
        const zoomE = Easing.easeInOutCubic(zoom)
        const cracking = clamp((localTime - 7.0) / 1.0, 0, 1)
        const exit = clamp((localTime - 8.0) / 0.4, 0, 1)
        const exitE = Easing.easeInQuad(exit)

        const settledScale = 0.92 + 0.08 * entryE
        const absorbBump   = 0.03 * Math.sin(absorbE * Math.PI)
        const zoomGain     = 0.30 * zoomE
        const scale = (settledScale + absorbBump + zoomGain) * (1 - exitE * 0.05)
        const ty = (1 - entryE) * 60

        const glow = Math.max(0, Math.sin(absorbE * Math.PI) * 0.8)

        const CX = 960, CY = 540
        const conv  = clamp((localTime - 2.5) / 1.3, 0, 1)
        const convE = Easing.easeInCubic(conv)

        return (
          <>
            {localTime < 4.0 && THUMBS.map((th, i) => {
              const local = clamp((localTime - 0.4 - th.delay) / 1.2, 0, 1)
              const e = Easing.easeOutBack(local)
              const rad = th.angle * Math.PI / 180
              const outX = CX + Math.cos(rad) * th.dist
              const outY = CY + Math.sin(rad) * th.dist
              const x = outX + (CX - outX) * convE
              const y = outY + (CY - outY) * convE
              const sFan    = 0.5 + 0.5 * e
              const sShrink = 1 - 0.85 * convE
              const rot     = th.rot * e * (1 - convE)
              const opacity = e * (1 - Math.pow(convE, 3) * 0.95)
              return (
                <div key={i} style={{
                  position: 'absolute', left: x, top: y,
                  transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sFan * sShrink})`,
                  opacity, transition: 'none',
                }}>
                  <PptThumbnail />
                </div>
              )
            })}

            <div style={{
              position: 'absolute', left: CX, top: CY,
              transform: `translate(-50%,-50%) translateY(${ty}px) scale(${scale})`,
              opacity: entryE * (1 - exitE),
              filter: [
                glow > 0.01 ? `drop-shadow(0 0 ${glow * 30}px rgba(68,114,196,${glow * 0.45}))` : '',
                cracking > 0.5 ? `hue-rotate(${cracking * 4}deg) brightness(${1 - cracking * 0.06})` : '',
              ].filter(Boolean).join(' ') || 'none',
            }}>
              <PptSlide />
              {cracking > 0.2 && (
                <div style={{
                  position: 'absolute', left: -16, top: 200,
                  width: 8, height: 320, background: '#FF6033',
                  opacity: cracking, borderRadius: 4,
                }} />
              )}
            </div>
          </>
        )
      }}
    </Sprite>
  )
}

// 7.8–11.2s: Slide fragments arc toward right side
function BeatTransform() {
  const pieces = React.useMemo(() =>
    Array.from({ length: 36 }).map((_, i) => {
      const rng = (s: number) => {
        const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453
        return v - Math.floor(v)
      }
      return {
        startX: 880 + rng(1) * 160,
        startY: 380 + rng(2) * 320,
        endX:   1380 + rng(3) * 200,
        endY:   460  + rng(4) * 200,
        rot0:   (rng(5) - 0.5) * 40,
        rot1:   (rng(5) - 0.5) * 720,
        w:      30 + rng(6) * 80,
        h:      6  + rng(7) * 6,
        color:  ['#4472C4','#1F4E79','#262626','#FF6033'][Math.floor(rng(8) * 4)],
        delay:  rng(9) * 0.6,
      }
    })
  , [])

  return (
    <Sprite start={7.8} end={11.2}>
      {({ localTime }) => (
        <>
          {pieces.map((p, i) => {
            const t  = clamp((localTime - p.delay) / 1.6, 0, 1)
            const e  = Easing.easeInOutCubic(t)
            const x  = p.startX + (p.endX - p.startX) * e
            const y  = p.startY + (p.endY - p.startY) * e - Math.sin(e * Math.PI) * 120
            const rot = p.rot0 + (p.rot1 - p.rot0) * e
            const fadeIn  = clamp(t * 6, 0, 1)
            const fadeOut = clamp(1 - (localTime - 1.8) / 1.0, 0, 1)
            return <Debris key={i} x={x} y={y} w={p.w} h={p.h} rot={rot} color={p.color} opacity={fadeIn * fadeOut} />
          })}
          <div style={{
            position: 'absolute', left: 0, top: '50%', right: 0,
            height: 1,
            background: 'linear-gradient(90deg,transparent 30%,#FF6033 50%,transparent 70%)',
            opacity: clamp(Math.sin(localTime * 2.5) * 0.6, 0, 0.6),
            transform: 'translateY(-50%)',
          }} />
        </>
      )}
    </Sprite>
  )
}

// 8.5–16.05s: Storyline editor assembles and populates
function BeatStorylineAssemble() {
  return (
    <Sprite start={8.5} end={16.05}>
      {({ localTime }) => {
        const entry  = clamp(localTime / 0.7, 0, 1)
        const entryE = Easing.easeOutCubic(entry)
        const build  = clamp((localTime - 0.4) / 2.6, 0, 1)
        const buildE = Easing.easeOutCubic(build)

        const canvasBuild = clamp((localTime - 2.8) / 3.0, 0, 1)
        const cTitle = clamp((localTime - 3.0) / 0.6, 0, 1)
        const cChar  = clamp((localTime - 3.8) / 0.7, 0, 1)
        const cText  = clamp((localTime - 4.6) / 0.5, 0, 1)
        const cBtn   = clamp((localTime - 5.4) / 0.5, 0, 1)

        const drift = Math.sin(localTime * 0.4) * 6
        const exit  = clamp((localTime - 6.8) / 0.7, 0, 1)
        const exitE = Easing.easeInQuad(exit)

        return (
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: `translate(-50%,-50%) translate(${drift}px,${-drift * 0.3}px) scale(${(0.86 + 0.12 * entryE) * (1 - exitE * 0.05)})`,
            opacity: entryE * (1 - exitE),
          }}>
            <StorylineEditor build={buildE}>
              <StorylineCanvasContent
                build={canvasBuild}
                titleEntry={Easing.easeOutBack(cTitle)}
                charEntry={Easing.easeOutCubic(cChar)}
                textEntry={Easing.easeOutCubic(cText)}
                btnEntry={Easing.easeOutBack(cBtn)}
              />
            </StorylineEditor>
          </div>
        )
      }}
    </Sprite>
  )
}

// 15.5–20.6s: Flash transition → published slide reveal
function BeatPublishedReveal() {
  return (
    <Sprite start={15.5} end={20.6}>
      {({ localTime }) => {
        const flash = Math.min(
          clamp(localTime / 0.4, 0, 1),
          Math.max(0, 1 - clamp((localTime - 0.8) / 0.4, 0, 1))
        )
        const flashE = Easing.easeInOutCubic(flash)

        const entry  = clamp((localTime - 0.6) / 0.8, 0, 1)
        const entryE = Easing.easeOutCubic(entry)
        const titleE = Easing.easeOutCubic(clamp((localTime - 1.2) / 0.6, 0, 1))
        const charE  = Easing.easeOutBack(clamp((localTime - 1.6) / 0.6, 0, 1))
        const ctaE   = Easing.easeOutBack(clamp((localTime - 2.2) / 0.5, 0, 1))
        const exit   = clamp((localTime - 4.5) / 0.5, 0, 1)
        const exitE  = Easing.easeInCubic(exit)
        const kb     = 1 + 0.04 * Easing.easeOutCubic(clamp(localTime / 5.0, 0, 1))

        return (
          <>
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: `translate(-50%,-50%) scale(${(0.95 + 0.05 * entryE) * kb * (1 - exitE * 0.04)})`,
              opacity: entryE * (1 - exitE),
            }}>
              <PublishedSlide
                titleEntry={titleE}
                characterEntry={charE}
                ctaEntry={ctaE}
                progress={0.12 + 0.06 * entryE}
              />
            </div>
            <div style={{
              position: 'absolute', inset: 0, background: '#fff',
              opacity: flashE, pointerEvents: 'none', zIndex: 40,
            }} />
          </>
        )
      }}
    </Sprite>
  )
}

// 20.4–25.0s: Feature montage — quiz, drag, branch, cert
function BeatFeatureMontage() {
  const SLOTS = [
    { t0: 0.0, t1: 1.1, kind: 'quiz'   as const },
    { t0: 1.0, t1: 2.1, kind: 'drag'   as const },
    { t0: 2.0, t1: 3.1, kind: 'branch' as const },
    { t0: 3.0, t1: 4.6, kind: 'cert'   as const },
  ]

  return (
    <Sprite start={20.4} end={25.0}>
      {({ localTime }) => (
        <>
          {SLOTS.map((s, i) => {
            const t   = localTime - s.t0
            const dur = s.t1 - s.t0
            if (t < -0.2 || t > dur + 0.2) return null
            const inE  = Easing.easeOutCubic(clamp(t / 0.35, 0, 1))
            const outE = Easing.easeInCubic(clamp((t - (dur - 0.35)) / 0.35, 0, 1))
            const op   = Math.min(inE, 1 - outE)
            return (
              <div key={i} style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: `translate(-50%,-50%) translateY(${(1 - inE) * 30 - outE * 20}px) scale(${0.95 + 0.05 * inE})`,
                opacity: op,
              }}>
                <FeatureCard kind={s.kind} />
              </div>
            )
          })}
        </>
      )}
    </Sprite>
  )
}

// 24.7–28s: Final dark hero frame
function BeatFinal() {
  return (
    <Sprite start={24.7} end={28}>
      {({ localTime }) => {
        const entry = clamp(localTime / 0.6, 0, 1)
        const e  = Easing.easeOutCubic(entry)
        const kb = 1 + 0.04 * Easing.easeOutCubic(clamp(localTime / 3.0, 0, 1))
        return (
          <div style={{ position: 'absolute', inset: 0, background: '#0E1322', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={GRAIN_STYLE} />
            <div style={{
              position: 'relative', textAlign: 'center',
              opacity: e, transform: `scale(${0.97 + 0.03 * e * kb})`,
              maxWidth: 1500,
            }}>
              <div style={{
                fontSize: 13, letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontWeight: 600, fontFamily: F_UI,
              }}>
                Articulate Storyline 360 · Sistel
              </div>
              <div style={{
                fontFamily: F_DISPLAY, fontSize: 130, color: '#FFFFFF',
                fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1.0,
                whiteSpace: 'nowrap',
              }}>
                De guión,{' '}
                <span style={{ fontStyle: 'italic', color: '#FF6033' }}>a experiencia</span>.
              </div>
              <div style={{
                marginTop: 44, fontSize: 22, color: 'rgba(255,255,255,0.7)',
                fontFamily: F_UI, letterSpacing: '0.01em',
              }}>
                Inducciones y proyectos e-learning estilizados, interactivos, hechos a tu medida.
              </div>
            </div>
          </div>
        )
      }}
    </Sprite>
  )
}

// ── Progress captions (bottom-left) ──────────────────────────────────────────

function ProgressCaption() {
  const time = useTime()
  const c = CAPTIONS.find(c => time >= c.t && time <= c.end)
  if (!c) return null
  const localIn  = clamp((time - c.t) / 0.4, 0, 1)
  const localOut = clamp((c.end - time) / 0.4, 0, 1)
  const op = Math.min(localIn, localOut)
  return (
    <div style={{
      position: 'absolute', left: 80, bottom: 70,
      opacity: op,
      transform: `translateY(${(1 - localIn) * 8}px)`,
    }}>
      <Caption kicker={c.kicker}>{c.text}</Caption>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export function SceneSistel() {
  return (
    <>
      <BgSequential />
      <BeatPptArrives />
      <BeatTransform />
      <BeatStorylineAssemble />
      <BeatPublishedReveal />
      <BeatFeatureMontage />
      <BeatFinal />
      <ProgressCaption />
    </>
  )
}
