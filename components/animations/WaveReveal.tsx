'use client'

import { useEffect, useRef } from 'react'
import { gsap, SplitText } from '@/lib/gsap'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}

/**
 * Reveal « vague » par lignes — même grammaire que StatementStrip /
 * EcosystemDomains : SplitText lignes montant depuis leur masque.
 * Amplitude en % de la hauteur de ligne : naturellement proportionnée
 * au corps de la fonte, identique desktop et mobile.
 * prefers-reduced-motion : rendu statique direct.
 */
export function WaveReveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = (el.firstElementChild as HTMLElement) ?? el
    const split = new SplitText(target, { type: 'lines', linesClass: 'wave-line-inner' })
    gsap.set(split.lines, { overflow: 'hidden' })

    const ctx = gsap.context(() => {
      gsap.fromTo(split.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.08,
          duration: 0.9,
          delay,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      )
    }, ref)

    return () => { ctx.revert(); split.revert() }
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
