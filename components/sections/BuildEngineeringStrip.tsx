'use client'

import { useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'

export function BuildEngineeringStrip() {
  const t   = useTranslations('buildEngineeringStrip')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.beg-chip', {
        opacity: 0,
        x: -10,
        stagger: 0.08,
        duration: 0.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 82%',
        },
      })
      gsap.from('.beg-title', {
        opacity: 0,
        y: 14,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 82%',
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const chips = [
    t('chip1'),
    t('chip2'),
    t('chip3'),
    t('chip4'),
  ] as const

  return (
    <section ref={ref} className="border-t border-ag-border bg-ag-off-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">

          {/* Left — label + title */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ag-gray-light">
              {t('label')}
            </p>
            <p className="beg-title font-sans font-bold text-ag-black text-[18px] md:text-[22px] tracking-[-0.02em] leading-snug">
              {t('title')}
            </p>
          </div>

          {/* Center — chips */}
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="beg-chip font-mono text-[9px] tracking-[0.14em] uppercase border border-ag-border bg-ag-white text-ag-gray px-3 py-1.5"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Right — CTA */}
          <Link
            href="/services/build"
            className="shrink-0 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase bg-ag-navy text-white px-6 py-3 hover:bg-ag-navy-mid transition-colors"
          >
            {t('cta')} <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </section>
  )
}
