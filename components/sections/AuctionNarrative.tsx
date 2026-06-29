'use client'

import { useEffect, useRef } from 'react'
import Link                  from 'next/link'
import { useTranslations }   from 'next-intl'
import { ArrowUpRight }      from 'lucide-react'
import { gsap }              from '@/lib/gsap'

export function AuctionNarrative() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('auctionNarrative')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.auction-narr-text > *',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 72%', once: true },
        },
      )
      gsap.fromTo('.auction-stat',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          stagger: 0.09, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: '.auction-stats-strip', start: 'top 80%', once: true },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-navy border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-0">
        <div className="auction-narr-text max-w-3xl pb-20">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-5 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h2
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.08] mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(30px,4.5vw,58px)' }}
          >
            {t('title')}
          </h2>
          <p className="font-sans text-[15px] text-white/55 leading-[1.9] mb-12 max-w-2xl whitespace-pre-line">
            {t('desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auction/how-to-sell"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaSell')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/auction/how-to-buy"
              className="inline-flex items-center gap-2 border border-white/25 text-white/70 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/60 hover:text-white transition-all"
            >
              {t('ctaBuy')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="auction-stats-strip border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { val: t('stat1Val'), label: t('stat1Label') },
              { val: t('stat2Val'), label: t('stat2Label') },
              { val: t('stat3Val'), label: t('stat3Label') },
            ].map((s) => (
              <div key={s.label} className="auction-stat py-8 px-6 first:pl-0 last:pr-0" style={{ opacity: 0 }}>
                <p
                  className="font-sans font-bold text-white tracking-[-0.03em] mb-1"
                  style={{ fontSize: 'clamp(26px,2.8vw,38px)' }}
                >
                  {s.val}
                </p>
                <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
