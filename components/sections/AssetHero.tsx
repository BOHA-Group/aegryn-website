'use client'

import { useLayoutEffect, useRef } from 'react'
import Image                  from 'next/image'
import { gsap, SplitText }    from '@/lib/gsap'

/**
 * AssetHero : page actifs. Hero au gabarit standard (620 px), image fixe, texte révélé ligne par ligne au chargement.
 */
interface AssetHeroProps {
  label?: string
  title?: string
  sub?:   string
}

export function AssetHero({ label, title, sub }: AssetHeroProps = {}) {
  const wrapRef    = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const heading = headingRef.current
    if (!wrap || !heading) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([labelRef.current, subRef.current], { opacity: 1 })
      return
    }
    const split = new SplitText(heading, { type: 'lines', linesClass: 'ahb-line' })
    ;(split.lines as HTMLElement[]).forEach(line => { line.style.paddingBottom = '0.18em'; line.style.marginBottom = '-0.18em' })
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(labelRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.2)
        .fromTo(split.lines, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.35)
        .fromTo(subRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.75)
    }, wrap)
    return () => { ctx.revert(); split.revert() }
  }, [])

  return (
    <section
      ref={wrapRef}
      className="relative overflow-hidden bg-ag-navy pt-36 pb-24 px-6 md:px-12"
      style={{ minHeight: 'clamp(460px,50vw,620px)' }}
    >
      <Image
        src="/images/assets/assets-intro.webp"
        alt="Aegryn | Nos actifs numériques"
        fill
        priority
        fetchPriority="high"
        unoptimized
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/70 via-ag-navy/60 to-ag-navy/95 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p
          ref={labelRef}
          className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex"
          style={{ opacity: 0 }}
        >
          <span className="inline-block h-px w-5 bg-ag-apex/50" />
          {label ?? 'Aegryn, notre écosystème'}
        </p>
        <h1
          ref={headingRef}
          translate="no"
          className="mb-6 max-w-4xl font-sans font-bold leading-[1.05] tracking-[-0.03em] text-white [&_.ahb-line]:overflow-hidden"
          style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          dangerouslySetInnerHTML={{ __html: (title ?? 'Ce que nous\nconstruisons.').replace(/\n/g, '<br>') }}
        />
        <p
          ref={subRef}
          className="max-w-xl text-[16px] leading-relaxed text-white/70"
          style={{ opacity: 0 }}
        >
          {sub ?? '6 actifs · 3 catégories · Suisse & Europe'}
        </p>
      </div>
    </section>
  )
}
