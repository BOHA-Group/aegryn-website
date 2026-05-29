'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  stagger?: number
  /** If true, animates direct children individually with stagger */
  staggerChildren?: boolean
}

/**
 * Reusable scroll-reveal wrapper.
 * Wraps any content and fades/slides it in when it enters the viewport.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 20,
  stagger = 0,
  staggerChildren = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = staggerChildren ? Array.from(el.children) : [el]

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.7,
        delay,
        stagger: stagger || (staggerChildren ? 0.08 : 0),
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      })
    })
    return () => ctx.revert()
  }, [y, delay, stagger, staggerChildren])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
