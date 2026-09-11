'use client'

import { useEffect, useRef } from 'react'
import Link                  from 'next/link'
import { useTranslations }   from 'next-intl'
import { ArrowUpRight }      from 'lucide-react'
import { gsap }              from '@/lib/gsap'

export function TransactNarrative() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('transactNarrative')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.transact-narr-text > *',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 72%', once: true },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-navy border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="transact-narr-text max-w-3xl">
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
              href="/transact/how-to-sell"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaSell')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/transact/how-to-buy"
              className="rounded-lg inline-flex items-center gap-2 border border-white/25 text-white/70 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/60 hover:text-white transition-all"
            >
              {t('ctaBuy')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
