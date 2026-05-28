'use client'

import { useEffect, useRef } from 'react'

type Props = { children: React.ReactNode }

export default function LenisProvider({ children }: Props) {
  const lenisRef = useRef<{ destroy: () => void } | null>(null)

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
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      lenisRef.current = lenis
    }

    if (typeof window !== 'undefined') {
      initLenis()
    }

    return () => {
      lenisRef.current?.destroy()
    }
  }, [])

  return <>{children}</>
}
