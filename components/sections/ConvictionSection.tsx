'use client'

import { useEffect, useRef } from 'react'
import { useTranslations }   from 'next-intl'
import { gsap }              from '@/lib/gsap'

export function ConvictionSection() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('conviction')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.conviction-col', {
        opacity: 0, y: 28, stagger: 0.12,
        ease: 'expo.out', duration: 0.8,
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const cols = [
    { key: 'col1', border: 'border-ag-grade-aaa/60' },
    { key: 'col2', border: 'border-ag-apex/60' },
    { key: 'col3', border: 'border-ag-grade-aa/60' },
  ] as const

  return (
    <section ref={ref} className="py-28 bg-ag-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="mb-16 max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-4">
            {t('label')}
          </p>
          <h2
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[1.05]"
            style={{ fontSize: 'clamp(26px,3vw,42px)' }}
          >
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-ag-border">
          {cols.map(({ key }) => (
            <div key={key} className={`conviction-col py-10 md:py-0 md:px-10 first:pl-0 last:pr-0`}>
              <p className={`font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-5`}>
                {t(`${key}.label` as Parameters<typeof t>[0])}
              </p>
              <h3
                className="font-sans font-bold text-ag-black leading-[1.15] mb-4"
                style={{ fontSize: 'clamp(17px,1.6vw,22px)' }}
              >
                {t(`${key}.title` as Parameters<typeof t>[0])}
              </h3>
              <p className="text-[14px] text-ag-gray leading-relaxed">
                {t(`${key}.desc` as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
