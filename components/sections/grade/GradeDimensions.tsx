'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function GradeDimensions() {
  const t     = useTranslations('grade.dimensions')
  const ref   = useRef<HTMLElement>(null)
  const items = t.raw('items') as { code: string; name: string; desc: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dim-item', {
        opacity: 0, y: 20,
        stagger: 0.08, ease: 'expo.out', duration: 0.75,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="rounded-lg bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
          {t('label')}
        </p>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-14"
          style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
        >
          {t('title')}
        </h2>

        {/* 5 cartes sur une ligne — scroll horizontal mobile, grille desktop */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:overflow-x-auto sm:pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map(({ code, name, desc }) => (
            <div
              key={code}
              className="dim-item group relative overflow-hidden rounded-xl border border-ag-border bg-ag-white
                shrink-0 sm:w-[220px] lg:w-auto
                flex flex-col justify-between
                p-6 hover:border-ag-navy hover:shadow-sm transition-all duration-300"
              style={{
                minHeight: 'clamp(220px, 20vw, 280px)',
                scrollSnapAlign: 'start',
              }}
            >
              {/* Lettre discrète en filigrane */}
              <span
                className="pointer-events-none select-none absolute right-4 bottom-3
                  font-sans font-black text-ag-navy/[0.05] leading-none"
                style={{ fontSize: 'clamp(64px, 8vw, 96px)' }}
              >
                {code}
              </span>

              {/* Badge lettre — haut gauche */}
              <div className="w-8 h-8 rounded-lg bg-ag-navy flex items-center justify-center shrink-0 mb-auto">
                <span className="font-sans font-bold text-[12px] text-ag-apex">{code}</span>
              </div>

              {/* Texte — bas */}
              <div className="relative z-10 mt-6">
                <p className="font-sans font-semibold text-ag-black text-[13px] mb-1.5 leading-snug">
                  {name}
                </p>
                <p className="font-sans text-[11px] leading-relaxed text-ag-gray">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
