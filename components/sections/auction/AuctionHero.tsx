'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/gsap'

export function AuctionHero() {
  const t          = useTranslations('auction.index')
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef    = useRef<HTMLParagraphElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headingRef.current) return
    const split = new SplitText(headingRef.current, { type: 'chars,words' })
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from(labelRef.current,  { opacity: 0, y: 10, duration: 0.6, delay: 0.1 })
        .from(split.chars, { opacity: 0, yPercent: 110, rotationX: -90, stagger: 0.02, duration: 0.8 }, '-=0.3')
        .from(descRef.current,   { opacity: 0, y: 14, duration: 0.6 }, '-=0.4')
        .from(ctaRef.current,    { opacity: 0, y: 10, duration: 0.5 }, '-=0.3')
    }, sectionRef)
    return () => { ctx.revert(); split.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="bg-ag-navy pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <p ref={labelRef} className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
          <span className="w-6 h-px bg-ag-apex/50 inline-block" />
          {t('label')}
        </p>
        <h1
          ref={headingRef}
          className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
          style={{ fontSize: 'clamp(36px,5vw,76px)' }}
        >
          {t('title')}
        </h1>
        <p ref={descRef} className="font-sans text-[16px] text-white/55 leading-relaxed max-w-xl mb-10">
          {t('desc')}
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/auction/catalog"
            className="inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('ctaCatalog')} →
          </Link>
          <Link
            href="/auction"
            className="inline-flex items-center justify-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
          >
            {t('ctaSession')}
          </Link>
        </div>
      </div>
    </section>
  )
}
