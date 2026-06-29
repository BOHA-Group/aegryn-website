'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function AuctionSteps() {
  const t    = useTranslations('auction.index')
  const ref  = useRef<HTMLElement>(null)
  const steps = t.raw('steps') as { num: string; title: string; desc: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.auction-step', {
        opacity: 0, y: 24, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
          {t('howLabel')}
        </p>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-16"
          style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
        >
          Un protocole. Pas un hasard.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-ag-border border border-ag-border">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="auction-step p-8 flex flex-col gap-4">
              <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{num}</span>
              <h3 className="font-sans font-semibold text-ag-black text-[17px] leading-snug">{title}</h3>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
