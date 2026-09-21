import { useEffect } from 'react'
import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

function clearOverflowLock() {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

export function scrollToSection(target: string | HTMLElement) {
  // Always unlock first — mobile menu stops Lenis while open
  if (lenisInstance) {
    lenisInstance.start()
    clearOverflowLock()
    requestAnimationFrame(() => {
      lenisInstance?.scrollTo(target, {
        offset: -72,
        duration: 1.8,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      })
    })
    return
  }
  clearOverflowLock()
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth' })
}

export function setPageScrollLocked(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop()
    else lenisInstance.start()
  }

  if (locked) {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  } else {
    clearOverflowLock()
  }
}

/** Window-scoped smooth scroll — same lerp/feel as win-portfolio. */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.068,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.05,
      autoRaf: false,
    })
    lenisInstance = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}
