'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function SegmentsSection() {
  const t = useTranslations('homeSegments')
  const ref = useRef<HTMLElement>(null)

  const cards = t.raw('cards') as { key: string; title: string; desc: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.seg-card',
        { opacity: 0, y: 24 },
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
        <div className="flex items-center justify-between border-b border-ag-border pb-4 mb-12">
          <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
            / {t('label')}
          </span>
        </div>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2] mb-14"
          style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
        >
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-ag-border">
          {cards.map((card) => (
            <div
              key={card.key}
              className="seg-card bg-ag-white p-8 hover:bg-ag-off-white transition-colors duration-300"
              style={{ opacity: 0 }}
            >
              <h3
                className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4"
                style={{ fontSize: 'clamp(14px,1.1vw,16px)' }}
              >
                {card.title}
              </h3>
              <p className="font-sans font-normal text-[13px] text-ag-gray leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
