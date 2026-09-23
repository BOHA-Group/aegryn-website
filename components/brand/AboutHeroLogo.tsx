'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { AegrynLogo } from '@/components/brand/AegrynLogo'

/**
 * Aegryn logo floated right of the About hero title.
 * Zoom-in on mount (above the fold, no scroll dependency).
 */
export function AboutHeroLogo({ onDark = false }: { onDark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { scale: 0.6, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.1 },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      className="hidden lg:flex shrink-0 items-center justify-center will-change-transform"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <AegrynLogo size={160} variant="mark" onDark={onDark} />
    </div>
  )
}
