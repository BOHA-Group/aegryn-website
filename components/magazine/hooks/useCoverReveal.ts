'use client'

import { useEffect, type RefObject } from 'react'
import { gsap, SplitText } from '@/lib/gsap'

/**
 * Cover title reveal hook — splits title into lines and animates them in.
 * Extracted from editions/2027/shared.tsx for reuse across all issues.
 */
export function useCoverReveal(
  sectionRef: RefObject<HTMLElement | null>,
  titleRef: RefObject<HTMLHeadingElement | null>,
) {
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return
    const split = new SplitText(titleRef.current, { type: 'lines', linesClass: 'cover-line' })
    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.lines,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.15 },
      )
      gsap.fromTo('.cover-meta',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.85 },
      )
    }, sectionRef)
    return () => { split.revert(); ctx.revert() }
  }, [sectionRef, titleRef])
}
