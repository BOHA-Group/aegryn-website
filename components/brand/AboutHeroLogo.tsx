'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { AegrynLogo } from '@/components/brand/AegrynLogo'

/**
 * Aegryn logo floated right of the About hero title.
 * Enters with a scroll-triggered zoom-in (scale 0.6→1, opacity 0→1).
 * No blur at any point.
 */
export function AboutHeroLogo() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { scale: 0.6, opacity: 0, y: 20 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      className="hidden lg:flex shrink-0 items-center justify-center self-center will-change-transform"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <AegrynLogo size={200} variant="mark" />
    </div>
  )
}
