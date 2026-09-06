'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function GradeDimensions() {
  const t     = useTranslations('grade.dimensions')
  const ref   = useRef<HTMLElement>(null)
  const items = t.raw('items') as { code: string; name: string; desc: string }[]

  const corners = items.slice(0, 4)  // C I F S
  const center  = items[4]           // O

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dim-corner', {
        opacity: 0, scale: 0.94,
        stagger: 0.1, ease: 'expo.out', duration: 0.75,
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      })
      gsap.from('.dim-center', {
        opacity: 0, scale: 0.88, y: 12,
        ease: 'expo.out', duration: 0.8, delay: 0.35,
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-5xl mx-auto">

        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
          {t('label')}
        </p>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-16"
          style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
        >
          {t('title')}
        </h2>

        {/* Layout Mahjong — desktop */}
        <div className="hidden md:block relative" style={{ paddingBottom: '8rem' }}>

          {/* Grille 2x2 des 4 coins */}
          <div className="grid grid-cols-2 gap-px bg-ag-border border border-ag-border">
            {corners.map(({ code, name, desc }) => (
              <div key={code} className="dim-corner bg-ag-white p-10 flex gap-5" style={{ opacity: 0 }}>
                <div className="w-9 h-9 bg-ag-navy flex items-center justify-center shrink-0">
                  <span className="font-sans font-bold text-ag-apex text-[13px]">{code}</span>
                </div>
                <div>
                  <p className="font-sans font-semibold text-ag-black text-[16px] mb-1.5">{name}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* O — carte centrale superposée */}
          {center && (
            <div
              className="dim-center absolute left-1/2 -translate-x-1/2 -bottom-14 z-10"
              style={{ opacity: 0, width: 'min(400px, 70%)' }}
            >
              <div className="bg-ag-navy border-2 border-ag-apex/60 shadow-2xl p-8 flex gap-5">
                <div className="w-9 h-9 bg-ag-apex flex items-center justify-center shrink-0">
                  <span className="font-sans font-bold text-ag-navy text-[13px]">{center.code}</span>
                </div>
                <div>
                  <p className="font-sans font-semibold text-white text-[16px] mb-1.5">{center.name}</p>
                  <p className="font-sans text-[13px] text-white/65 leading-relaxed">{center.desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Layout mobile — liste simple */}
        <div className="md:hidden grid grid-cols-1 gap-px bg-ag-border border border-ag-border">
          {corners.map(({ code, name, desc }) => (
            <div key={code} className="dim-corner bg-ag-white p-8 flex gap-5" style={{ opacity: 0 }}>
              <div className="w-9 h-9 bg-ag-navy flex items-center justify-center shrink-0">
                <span className="font-sans font-bold text-ag-apex text-[13px]">{code}</span>
              </div>
              <div>
                <p className="font-sans font-semibold text-ag-black text-[16px] mb-1.5">{name}</p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
          {center && (
            <div className="dim-center bg-ag-navy border-t-2 border-ag-apex p-8 flex gap-5" style={{ opacity: 0 }}>
              <div className="w-9 h-9 bg-ag-apex flex items-center justify-center shrink-0">
                <span className="font-sans font-bold text-ag-navy text-[13px]">{center.code}</span>
              </div>
              <div>
                <p className="font-sans font-semibold text-white text-[16px] mb-1.5">{center.name}</p>
                <p className="font-sans text-[13px] text-white/65 leading-relaxed">{center.desc}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
