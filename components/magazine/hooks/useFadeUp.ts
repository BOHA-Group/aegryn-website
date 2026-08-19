'use client'

import { useEffect, type RefObject } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * Scroll-reveal hook — fades elements up when they enter the viewport.
 * Extracted from editions/2027/shared.tsx for reuse across all issues.
 */
export function useFadeUp(
  selector: string,
  triggerEl: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!triggerEl.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: triggerEl.current, start: 'top 80%', once: true },
        },
      )
    }, triggerEl)
    return () => ctx.revert()
  }, [selector, triggerEl])
}
