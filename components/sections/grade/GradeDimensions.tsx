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

        {/* Layout Mahjong — desktop : grille 3×3, coins + centre */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            gridAutoRows: '1fr',
            gap: '1px',
            background: 'var(--color-ag-border, #e2e6ea)',
            border: '1px solid var(--color-ag-border, #e2e6ea)',
            minHeight: '520px',
          }}
        >
          {/* C — haut gauche */}
          <div className="dim-corner bg-ag-white p-8 flex gap-5 col-start-1 row-start-1">
            <div className="w-9 h-9 bg-ag-navy flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-ag-apex text-[13px]">{corners[0].code}</span>
            </div>
            <div>
              <p className="font-sans font-semibold text-ag-black text-[15px] mb-1.5">{corners[0].name}</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{corners[0].desc}</p>
            </div>
          </div>

          {/* vide haut centre */}
          <div className="bg-ag-white col-start-2 row-start-1" />

          {/* I — haut droit */}
          <div className="dim-corner bg-ag-white p-8 flex gap-5 col-start-3 row-start-1">
            <div className="w-9 h-9 bg-ag-navy flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-ag-apex text-[13px]">{corners[1].code}</span>
            </div>
            <div>
              <p className="font-sans font-semibold text-ag-black text-[15px] mb-1.5">{corners[1].name}</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{corners[1].desc}</p>
            </div>
          </div>

          {/* vide milieu gauche */}
          <div className="bg-ag-white col-start-1 row-start-2" />

          {/* O — centre */}
          {center && (
            <div className="dim-center bg-ag-navy p-8 flex gap-5 col-start-2 row-start-2 z-10 shadow-2xl" style={{ outline: '2px solid rgba(90,221,164,0.5)', outlineOffset: '-2px' }}>
              <div className="w-9 h-9 bg-ag-apex flex items-center justify-center shrink-0">
                <span className="font-sans font-bold text-ag-navy text-[13px]">{center.code}</span>
              </div>
              <div>
                <p className="font-sans font-semibold text-white text-[15px] mb-1.5">{center.name}</p>
                <p className="font-sans text-[13px] text-white/65 leading-relaxed">{center.desc}</p>
              </div>
            </div>
          )}

          {/* vide milieu droit */}
          <div className="bg-ag-white col-start-3 row-start-2" />

          {/* F — bas gauche */}
          <div className="dim-corner bg-ag-white p-8 flex gap-5 col-start-1 row-start-3">
            <div className="w-9 h-9 bg-ag-navy flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-ag-apex text-[13px]">{corners[2].code}</span>
            </div>
            <div>
              <p className="font-sans font-semibold text-ag-black text-[15px] mb-1.5">{corners[2].name}</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{corners[2].desc}</p>
            </div>
          </div>

          {/* vide bas centre */}
          <div className="bg-ag-white col-start-2 row-start-3" />

          {/* S — bas droit */}
          <div className="dim-corner bg-ag-white p-8 flex gap-5 col-start-3 row-start-3">
            <div className="w-9 h-9 bg-ag-navy flex items-center justify-center shrink-0">
              <span className="font-sans font-bold text-ag-apex text-[13px]">{corners[3].code}</span>
            </div>
            <div>
              <p className="font-sans font-semibold text-ag-black text-[15px] mb-1.5">{corners[3].name}</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{corners[3].desc}</p>
            </div>
          </div>
        </div>

        {/* Layout mobile — liste simple */}
        <div className="md:hidden grid grid-cols-1 gap-px bg-ag-border border border-ag-border">
          {corners.map(({ code, name, desc }) => (
            <div key={code} className="dim-corner bg-ag-white p-8 flex gap-5">
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
            <div className="dim-center bg-ag-navy border-t-2 border-ag-apex p-8 flex gap-5">
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
