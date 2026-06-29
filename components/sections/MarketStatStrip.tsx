'use client'

import { useEffect, useRef } from 'react'
import { useTranslations }   from 'next-intl'
import { gsap }              from '@/lib/gsap'

export function MarketStatStrip() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('marketStats')

  const stats = t.raw('stats') as { value: string; label: string; source: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.market-stat', {
        opacity: 0, y: 20, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-20 bg-ag-navy">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-12">
          {t('label')}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="market-stat">
              <p
                className="font-display font-black text-ag-apex tracking-[-0.03em] leading-none mb-2"
                style={{ fontSize: 'clamp(28px,3vw,46px)' }}
              >
                {stat.value}
              </p>
              <p className="text-[12px] text-white/60 leading-snug mb-1.5">
                {stat.label}
              </p>
              <p className="font-mono text-[10px] text-white/30 tracking-wide">
                {stat.source}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
