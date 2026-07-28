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

  /* Reset scroll position on route change — kill stale ScrollTriggers first */
  useEffect(() => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.getAll().forEach(st => st.kill())
      ScrollTrigger.clearScrollMemory()
    })
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
  }, [pathname])

  return <>{children}</>
}
