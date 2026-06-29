'use client'

import { useEffect, useRef } from 'react'
import Link                  from 'next/link'
import { useTranslations }   from 'next-intl'
import { gsap }              from '@/lib/gsap'

export function AcquisitionSupportHook() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('acquisitionSupport')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.acq-content', {
        opacity: 0, y: 24,
        ease: 'expo.out', duration: 0.8,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-28 bg-ag-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="acq-content max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-5">
            {t('label')}
          </p>
          <h2
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[1.05] mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed mb-10 max-w-xl">
            {t('desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link
              href="/services/acquisition-support"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy-mid transition-colors"
            >
              {t('cta')} →
            </Link>
            <p className="text-[11px] text-ag-gray-light leading-relaxed max-w-sm">
              {t('legal')}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
