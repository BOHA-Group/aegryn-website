'use client'

import { useEffect, useRef } from 'react'
import Link                  from 'next/link'
import { useTranslations }   from 'next-intl'
import { gsap }              from '@/lib/gsap'

export function AuctionNarrative() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('auctionNarrative')

  const steps = t.raw('steps') as { num: string; label: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.auction-step', {
        opacity: 0, x: -16, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-28 bg-ag-navy">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/40 mb-5">
              {t('label')}
            </p>
            <h2
              className="font-display font-black text-white tracking-[-0.03em] leading-[1.05] mb-8 whitespace-pre-line"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              {t('title')}
            </h2>
            <p className="text-[15px] text-white/60 leading-relaxed mb-10 max-w-md">
              {t('desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auction"
                className="inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
              >
                {t('ctaPrimary')} →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/70 font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-white/50 hover:text-white transition-all"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Right — steps */}
          <div className="flex flex-col gap-0 border-t border-white/10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="auction-step flex items-center gap-6 py-5 border-b border-white/10"
              >
                <span className="font-mono text-[11px] text-white/30 tracking-[0.1em] shrink-0 w-8">
                  {step.num}
                </span>
                <span className="text-[14px] text-white/70 leading-snug">
                  {step.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
