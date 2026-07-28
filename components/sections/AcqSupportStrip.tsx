'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'

export function AcqSupportStrip() {
  const t   = useTranslations('acqStrip')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.acq-strip-content > *',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-off-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">
        <div className="acq-strip-content grid md:grid-cols-[1fr_auto] gap-12 items-center">

          <div className="space-y-5 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex-ink flex items-center gap-3">
              <span className="w-5 h-px bg-ag-apex/50 inline-block" />
              {t('label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15]"
              style={{ fontSize: 'clamp(26px,3.5vw,46px)' }}
            >
              {t('title')}
            </h2>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
              {t('desc')}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {[t('chip1'), t('chip2'), t('chip3')].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center font-sans font-semibold text-[11px] tracking-[0.1em] uppercase text-ag-black border border-ag-border px-4 py-2"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/contact?subject=acquisition"
            className="shrink-0 inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:bg-ag-black transition-colors"
          >
            {t('cta')} <ArrowUpRight size={13} />
          </Link>

        </div>
      </div>
    </section>
  )
}
