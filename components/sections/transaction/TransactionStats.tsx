'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function TransactionStats() {
  const t   = useTranslations('transaction.index')
  const ref = useRef<HTMLElement>(null)
  const stats = t.raw('stats') as { value: string; label: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.transaction-stat', {
        opacity: 0, y: 20, stagger: 0.1,
        ease: 'expo.out', duration: 0.65,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-navy border-t border-white/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/30 mb-10">
          {t('statsLabel')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="transaction-stat">
              <p className="font-sans font-bold text-white tracking-[-0.03em] leading-none mb-2"
                style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}>
                {value}
              </p>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
