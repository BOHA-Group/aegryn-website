'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

const PILLAR_ICONS: Record<string, string> = {
  build:   'B',
  grade:   'G',
  auction: 'A',
}

export function PillarsSection() {
  const t   = useTranslations('pillars')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pillar-item',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          stagger: 0.12, duration: 0.75, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  const pillars = ['build', 'grade', 'auction'] as const

  return (
    <section ref={ref} className="bg-ag-navy border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          {pillars.map((key) => (
            <div
              key={key}
              className="pillar-item flex items-start gap-6 py-10 md:py-0 md:px-10 first:pl-0 last:pr-0"
              style={{ opacity: 0 }}
            >
              <span className="shrink-0 w-10 h-10 flex items-center justify-center border border-ag-apex/40 font-sans font-bold text-[13px] tracking-[0.08em] text-ag-apex">
                {PILLAR_ICONS[key]}
              </span>
              <div className="space-y-2">
                <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/50">
                  {t(`${key}.label`)}
                </p>
                <p className="font-sans text-[15px] text-white/80 leading-relaxed">
                  {t(`${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
