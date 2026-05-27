import { useEffect } from 'react'

export function useBloomFollow() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const hoverMq = window.matchMedia('(hover: none)')

    let targetX = 0.65
    let targetY = 0.36
    let currentX = 0.65
    let currentY = 0.36
    let rafId: number
    let running = false

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const EPS = 0.0008

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.05)
      currentY = lerp(currentY, targetY, 0.05)
      document.documentElement.style.setProperty('--bloom-x', `${currentX * window.innerWidth}px`)
      document.documentElement.style.setProperty('--bloom-y', `${currentY * window.innerHeight}px`)
      if (Math.abs(currentX - targetX) < EPS && Math.abs(currentY - targetY) < EPS) {
        running = false
      } else {
        rafId = requestAnimationFrame(tick)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth
      targetY = e.clientY / window.innerHeight
      if (!running) {
        running = true
        rafId = requestAnimationFrame(tick)
      }
    }

    const start = () => {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    const stop = () => {
      cancelAnimationFrame(rafId)
      running = false
      window.removeEventListener('mousemove', onMouseMove)
    }

    const onHoverChange = (e: MediaQueryListEvent) => {
      if (e.matches) stop(); else start()
    }

    if (!hoverMq.matches) start()

    hoverMq.addEventListener('change', onHoverChange)

    return () => {
      stop()
      hoverMq.removeEventListener('change', onHoverChange)
    }
  }, [])
}
