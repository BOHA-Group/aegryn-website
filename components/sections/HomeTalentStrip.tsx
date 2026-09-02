'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function HomeTalentStrip() {
  const t = useTranslations('homeTalent')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ht-body > *',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.75, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 76%', once: true },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="border-t border-ag-border bg-ag-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-start">

          {/* Left — label + title */}
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-6">
              / {t('label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2]"
              style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            >
              {t('title')}
            </h2>
          </div>

          {/* Right — desc + CTAs */}
          <div className="ht-body space-y-8">
            <div className="space-y-4">
              {t('desc').split('\n\n').map((para, i) => (
                <p key={i} className="font-sans font-normal text-[15px] text-ag-gray leading-[1.85]">
                  {para}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={(t('cta1Href') as any)}
                className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-black border border-ag-border px-6 py-3.5 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300"
              >
                {t('cta1')}
              </Link>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={(t('cta2Href') as any)}
                className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-gray border border-ag-border px-6 py-3.5 hover:border-ag-black hover:text-ag-black transition-all duration-300"
              >
                {t('cta2')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
