import { useEffect, type RefObject } from 'react'

interface Harmonic {
  n: number; amp: number; phase: number; speed: number
}

interface BlobBlueprint {
  id: string
  rgb: [number, number, number]
  cx: number; cy: number
  ox: number; oy: number
  fx: number; fy: number; phase: number
  r: number
  breatheAmp: number; breatheFreq: number; breathePhase: number
  alphaMin: number; alphaMax: number; alphaFreq: number; alphaPhase: number
  harmonics: readonly Harmonic[]
  mouseForce: number; lerpSpeed: number
}

interface Blob extends BlobBlueprint {
  sx: number; sy: number
  alpha: number; target: number
}

function hex(h: string): [number, number, number] {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
}

// mouseForce: + atraído al cursor, − repelido
// experience y contact viven en la zona del CC (derecha) → pasan naturalmente por detrás
const BLUEPRINTS: readonly BlobBlueprint[] = [
  {
    id: 'about', rgb: hex('#B45309'),
    cx: 0.28, cy: 0.22, ox: 0.18, oy: 0.14, fx: 0.40, fy: 0.31, phase: 0.0,
    r: 0.24,
    breatheAmp: 0.14, breatheFreq: 0.31, breathePhase: 0.0,
    alphaMin: 0.55, alphaMax: 1.0, alphaFreq: 0.19, alphaPhase: 1.5,
    harmonics: [
      { n: 2, amp: 0.18, phase: 0.0, speed: 0.65 },
      { n: 3, amp: 0.10, phase: 1.2, speed: 1.30 },
      { n: 5, amp: 0.05, phase: 3.7, speed: 2.10 },
    ],
    mouseForce: 0.14, lerpSpeed: 0.040,
  },
  {
    id: 'experience', rgb: hex('#2563EB'),
    cx: 0.74, cy: 0.28, ox: 0.20, oy: 0.18, fx: 0.28, fy: 0.45, phase: 1.7,
    r: 0.26,
    breatheAmp: 0.11, breatheFreq: 0.24, breathePhase: 2.1,
    alphaMin: 0.50, alphaMax: 0.95, alphaFreq: 0.27, alphaPhase: 0.3,
    harmonics: [
      { n: 2, amp: 0.12, phase: 2.1, speed: 0.90 },
      { n: 4, amp: 0.09, phase: 0.8, speed: 0.55 },
      { n: 6, amp: 0.04, phase: 5.0, speed: 1.75 },
    ],
    mouseForce: -0.08, lerpSpeed: 0.016,
  },
  {
    id: 'skills', rgb: hex('#15803D'),
    cx: 0.25, cy: 0.75, ox: 0.18, oy: 0.14, fx: 0.47, fy: 0.36, phase: 3.2,
    r: 0.23,
    breatheAmp: 0.16, breatheFreq: 0.38, breathePhase: 4.0,
    alphaMin: 0.60, alphaMax: 1.0, alphaFreq: 0.15, alphaPhase: 2.8,
    harmonics: [
      { n: 3, amp: 0.14, phase: 4.0, speed: 1.10 },
      { n: 5, amp: 0.08, phase: 1.5, speed: 0.80 },
      { n: 7, amp: 0.04, phase: 2.3, speed: 2.40 },
    ],
    mouseForce: 0.11, lerpSpeed: 0.058,
  },
  {
    id: 'contact', rgb: hex('#9333EA'),
    cx: 0.78, cy: 0.72, ox: 0.16, oy: 0.18, fx: 0.33, fy: 0.52, phase: 5.1,
    r: 0.22,
    breatheAmp: 0.13, breatheFreq: 0.20, breathePhase: 1.0,
    alphaMin: 0.45, alphaMax: 0.90, alphaFreq: 0.23, alphaPhase: 4.2,
    harmonics: [
      { n: 2, amp: 0.16, phase: 5.1, speed: 0.75 },
      { n: 3, amp: 0.07, phase: 3.3, speed: 1.50 },
      { n: 4, amp: 0.05, phase: 0.5, speed: 2.80 },
    ],
    mouseForce: -0.06, lerpSpeed: 0.011,
  },
]

function rgba([r, g, b]: [number, number, number], a: number) {
  return `rgba(${r},${g},${b},${a.toFixed(3)})`
}

type ExtCtx = CanvasRenderingContext2D & { letterSpacing?: string }

export function useHeroBlobs(
  blobRef: RefObject<HTMLCanvasElement | null>,
  glassRef: RefObject<HTMLCanvasElement | null>,
  ccRef: RefObject<HTMLSpanElement | null>,
) {
  useEffect(() => {
    const blobCanvas  = blobRef.current
    const glassCanvas = glassRef.current
    const ccSpan      = ccRef.current
    if (!blobCanvas || !glassCanvas || !ccSpan) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const blobCtx  = blobCanvas.getContext('2d')!
    const glassCtx = glassCanvas.getContext('2d')!

    const blobs: Blob[] = BLUEPRINTS.map(b => ({
      ...b,
      harmonics: [...b.harmonics],
      sx: 0.5, sy: 0.35,
      alpha: 0, target: 0,
    }))

    let t = 0
    let lastTime = performance.now()
    let mouseNX = 0.5, mouseNY = 0.35
    let rafId: number
    let isVisible = true

    function resize() {
      const w = blobCanvas.offsetWidth
      const h = blobCanvas.offsetHeight
      blobCanvas.width  = w; blobCanvas.height  = h
      glassCanvas.width = w; glassCanvas.height = h
    }

    // Medido cada frame para seguir el parallax del span
    function getCCBounds() {
      const sr = ccSpan.getBoundingClientRect()
      const cr = blobCanvas.getBoundingClientRect()
      return {
        cx: sr.left + sr.width  / 2 - cr.left,
        cy: sr.top  + sr.height / 2 - cr.top,
        fs: sr.height,
      }
    }

    function clipToCC(ctx: ExtCtx) {
      const { cx, cy, fs } = getCCBounds()
      ctx.font         = `900 ${fs}px system-ui, sans-serif`
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.letterSpacing = `${(fs * -0.08).toFixed(0)}px`
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = 'white'
      ctx.fillText('CC', cx, cy)
      ctx.globalCompositeOperation = 'source-over'
      ctx.letterSpacing = '0px'
    }

    // Cada blob es un path armónico: r(θ) = base + Σ amp·sin(n·θ + phase + t·speed)
    function drawBlobPath(
      ctx: CanvasRenderingContext2D,
      cx: number, cy: number, r: number,
      harmonics: readonly Harmonic[],
    ) {
      const STEPS = 72
      ctx.beginPath()
      for (let i = 0; i <= STEPS; i++) {
        const angle = (i / STEPS) * Math.PI * 2
        let radius  = r
        for (const h of harmonics) {
          radius += r * h.amp * Math.sin(h.n * angle + h.phase + t * h.speed)
        }
        const x = cx + radius * Math.cos(angle)
        const y = cy + radius * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.closePath()
    }

    // blobPos: posición y radio del blob en coordenadas canvas
    function blobPos(b: Blob, W: number, H: number, S: number) {
      const angle   = t + b.phase
      const orbX    = Math.sin(angle * b.fx * Math.PI * 2) * b.ox
      const orbY    = Math.cos(angle * b.fy * Math.PI * 2) * b.oy
      const mDx     = (b.sx - b.cx) * b.mouseForce
      const mDy     = (b.sy - b.cy) * b.mouseForce
      const breathe = 1 + b.breatheAmp * Math.sin(t * b.breatheFreq * Math.PI * 2 + b.breathePhase)
      return {
        x: (b.cx + orbX + mDx) * W,
        y: (b.cy + orbY + mDy) * H,
        r: b.r * S * breathe,
      }
    }

    function blobAlpha(b: Blob, maxAlpha: number) {
      const mod = b.alphaMin + (b.alphaMax - b.alphaMin) *
        (0.5 + 0.5 * Math.sin(t * b.alphaFreq * Math.PI * 2 + b.alphaPhase))
      return b.alpha * mod * maxAlpha
    }

    // Fondo: gradiente radial puro — caída exponencial para evitar bandas visibles
    function drawBlobsAmbient(ctx: CanvasRenderingContext2D, W: number, H: number, maxAlpha: number) {
      const S = Math.min(W, H)
      for (const b of blobs) {
        if (b.alpha < 0.003) continue
        const { x, y, r } = blobPos(b, W, H, S)
        const a  = blobAlpha(b, maxAlpha)
        const gr = r * 3.0  // radio extendido — la caída ocurre antes del borde del rect
        const g  = ctx.createRadialGradient(x, y, 0, x, y, gr)
        g.addColorStop(0,    rgba(b.rgb, a * 0.55))
        g.addColorStop(0.12, rgba(b.rgb, a * 0.42))
        g.addColorStop(0.28, rgba(b.rgb, a * 0.26))
        g.addColorStop(0.48, rgba(b.rgb, a * 0.12))
        g.addColorStop(0.68, rgba(b.rgb, a * 0.04))
        g.addColorStop(0.85, rgba(b.rgb, a * 0.01))
        g.addColorStop(1,    rgba(b.rgb, 0))
        ctx.fillStyle = g
        ctx.fillRect(Math.max(0, x - gr), Math.max(0, y - gr), gr * 2, gr * 2)
      }
    }

    // Glass: usa el path armónico — la forma sí importa dentro de las letras CC
    function drawBlobsGlass(ctx: CanvasRenderingContext2D, W: number, H: number, maxAlpha: number, magnify: number) {
      const S = Math.min(W, H)
      ctx.save()
      if (magnify !== 1) {
        ctx.translate(W / 2, H / 2); ctx.scale(magnify, magnify); ctx.translate(-W / 2, -H / 2)
      }
      for (const b of blobs) {
        if (b.alpha < 0.003) continue
        const { x, y, r } = blobPos(b, W, H, S)
        const a  = blobAlpha(b, maxAlpha)
        drawBlobPath(ctx, x, y, r, b.harmonics)
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8)
        g.addColorStop(0,    rgba(b.rgb, a * 0.80))
        g.addColorStop(0.30, rgba(b.rgb, a * 0.50))
        g.addColorStop(0.65, rgba(b.rgb, a * 0.18))
        g.addColorStop(1,    rgba(b.rgb, 0))
        ctx.fillStyle = g
        ctx.fill()
      }
      ctx.restore()
    }

    function drawGlass() {
      const W = glassCanvas.width, H = glassCanvas.height
      const dark = document.documentElement.classList.contains('dark')
      glassCtx.clearRect(0, 0, W, H)

      // Blobs — tinta del cristal
      drawBlobsGlass(glassCtx as CanvasRenderingContext2D, W, H, dark ? 0.40 : 0.34, 1.18)

      // Blur antes del clip
      ;(glassCtx as ExtCtx).filter = 'blur(16px) saturate(1.1)'
      glassCtx.drawImage(glassCanvas, 0, 0)
      ;(glassCtx as ExtCtx).filter = 'none'

      // Clip a la forma CC
      clipToCC(glassCtx as ExtCtx)

      // Tratamiento de cristal — source-atop: solo afecta donde hay blob, nunca crea silueta propia
      // El blob por dentro del CC se ve diferente al de afuera:
      // dark → ligeramente más claro y más saturado (el cristal "levanta" el color)
      // light → frosted (blanqueado, difuminado)
      glassCtx.globalCompositeOperation = 'source-atop'
      glassCtx.fillStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.28)'
      glassCtx.fillRect(0, 0, W, H)

      // Sheen especular animado
      const sheenX = W * (0.58 + 0.07 * Math.sin(t * 0.5))
      const sheen  = glassCtx.createLinearGradient(sheenX, 0, sheenX - W * 0.28, H * 0.65)
      sheen.addColorStop(0,    `rgba(255,255,255,${dark ? 0.12 : 0.28})`)
      sheen.addColorStop(0.45, `rgba(255,255,255,${dark ? 0.03 : 0.08})`)
      sheen.addColorStop(1,    'rgba(255,255,255,0)')
      glassCtx.fillStyle = sheen
      glassCtx.fillRect(0, 0, W, H)
      glassCtx.globalCompositeOperation = 'source-over'
    }

    function draw(now: number) {
      rafId = requestAnimationFrame(draw)
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      t += dt * 0.078

      for (const b of blobs) {
        b.sx    += (mouseNX - b.sx) * b.lerpSpeed
        b.sy    += (mouseNY - b.sy) * b.lerpSpeed
        b.alpha += (b.target - b.alpha) * 0.012
      }

      const dark = document.documentElement.classList.contains('dark')
      const W = blobCanvas.width, H = blobCanvas.height
      blobCtx.clearRect(0, 0, W, H)
      drawBlobsAmbient(blobCtx, W, H, dark ? 0.53 : 0.50)

      const maxBlobAlpha = Math.max(...blobs.map(b => b.alpha))
      glassCanvas.style.opacity = Math.min(1, maxBlobAlpha * 2.2).toFixed(3)
      if (maxBlobAlpha > 0.001) drawGlass()
      else glassCtx.clearRect(0, 0, glassCanvas.width, glassCanvas.height)
    }

    const heroSection = blobCanvas.closest('[data-section="hero"]')
    const onMouseMove = (e: MouseEvent) => {
      const cr = blobCanvas.getBoundingClientRect()
      mouseNX = (e.clientX - cr.left) / cr.width
      mouseNY = (e.clientY - cr.top)  / cr.height
    }
    heroSection?.addEventListener('mousemove', onMouseMove as EventListener, { passive: true })

    const ro = new ResizeObserver(() => resize())
    ro.observe(blobCanvas)

    const unlocked = new Set<string>()
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        const id = e.target.id
        if (!unlocked.has(id) && e.intersectionRatio >= 0.35) {
          unlocked.add(id)
          const b = blobs.find(x => x.id === id)
          if (b) b.target = 1
        }
      }
    }, { threshold: [0, 0.35, 0.7] })

    for (const id of ['about', 'experience', 'skills', 'contact']) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }

    const canvasIO = new IntersectionObserver(entries => {
      const wasVisible = isVisible
      isVisible = entries[0].isIntersecting
      if (isVisible && !wasVisible) {
        lastTime = performance.now()
        rafId = requestAnimationFrame(draw)
      } else if (!isVisible) {
        cancelAnimationFrame(rafId)
      }
    }, { threshold: 0 })
    canvasIO.observe(blobCanvas)

    resize()
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      io.disconnect()
      canvasIO.disconnect()
      heroSection?.removeEventListener('mousemove', onMouseMove as EventListener)
    }
  }, [blobRef, glassRef, ccRef])
}
