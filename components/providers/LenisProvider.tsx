'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

type Props = { children: React.ReactNode }

export default function LenisProvider({ children }: Props) {
  const lenisRef = useRef<{ destroy: () => void; scrollTo: (target: number, opts?: object) => void } | null>(null)
  const rafFnRef = useRef<((time: number) => void) | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const initLenis = async () => {
      const { default: Lenis } = await import('lenis')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const { gsap } = await import('gsap')

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })

      lenis.on('scroll', ScrollTrigger.update)
      const rafFn = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(rafFn)
      gsap.ticker.lagSmoothing(0)

      lenisRef.current = lenis
      rafFnRef.current = rafFn
    }

    if (typeof window !== 'undefined') {
      initLenis()
    }

    return () => {
      if (rafFnRef.current) {
        import('gsap').then(({ gsap }) => gsap.ticker.remove(rafFnRef.current!))
      }
      lenisRef.current?.destroy()
    }
  }, [])

  /* Changement de page : retour en haut, ou, si l'adresse porte une ancre (#cadrer, #cinq-cycles…), arrivée sur la
     section demandée. Plusieurs essais : les sections épinglées et les images finissent de se mesurer après l'arrivée. */
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (!hash) {
      lenisRef.current?.scrollTo(0, { immediate: true })
      return
    }
    let cancelled = false
    const cancel = () => { cancelled = true }
    const go = () => {
      if (cancelled) return
      const el = document.getElementById(hash)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)
      if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
    }
    const events = ['wheel', 'touchstart', 'keydown'] as const
    events.forEach(e => window.addEventListener(e, cancel, { passive: true, once: true }))
    const timers = [0, 300, 800, 1600].map(ms => setTimeout(go, ms))
    return () => { timers.forEach(clearTimeout); events.forEach(e => window.removeEventListener(e, cancel)) }
  }, [pathname])

  return <>{children}</>
}
