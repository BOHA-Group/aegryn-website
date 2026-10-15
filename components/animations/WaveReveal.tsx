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
    /* Les sauts de ligne explicites (\n des textes i18n) sont conservés : SplitText les aplatirait en espaces. */
    const original = target.innerHTML
    const text = target.textContent ?? ''
    if (target.children.length === 0 && text.includes('\n')) {
      target.innerHTML = text.split('\n').map(l => l.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('<br>')
    }
    const split = new SplitText(target, { type: 'lines', linesClass: 'wave-line-inner' })
    /* Laisse de la place aux jambages (g, y, p, q, j) sous le masque
       overflow:hidden : +0.18em de padding clip, -0.18em de marge pour
       conserver l'interligne exact. */
    ;(split.lines as HTMLElement[]).forEach(line => {
      line.style.paddingBottom = '0.18em'
      line.style.marginBottom = '-0.18em'
    })
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

    return () => { ctx.revert(); split.revert(); target.innerHTML = original }
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
