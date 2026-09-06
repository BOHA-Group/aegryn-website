'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

function DimBadge({ code, dark = false }: { code: string; dark?: boolean }) {
  return (
    <div
      className="w-9 h-9 flex items-center justify-center shrink-0"
      style={{ background: dark ? '#5ADDA4' : '#0D1F3C' }}
    >
      <span className="font-sans font-bold text-[13px]" style={{ color: dark ? '#0D1F3C' : '#5ADDA4' }}>
        {code}
      </span>
    </div>
  )
}

export function GradeDimensions() {
  const t     = useTranslations('grade.dimensions')
  const ref   = useRef<HTMLElement>(null)
  const items = t.raw('items') as { code: string; name: string; desc: string }[]

  const corners = items.slice(0, 4)  // C I F S
  const center  = items[4]           // O

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

        {/* Grille 2×2 — C I F S */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: '#e2e6ea', border: '1px solid #e2e6ea' }}>
          {corners.map(({ code, name, desc }) => (
            <div key={code} className="dim-item bg-ag-white p-8 md:p-10 flex gap-5">
              <DimBadge code={code} />
              <div>
                <p className="font-sans font-semibold text-ag-black text-[15px] mb-1.5">{name}</p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* O — ligne centrée seule, visuellement distincte */}
        {center && (
          <div className="mt-px flex justify-center" style={{ background: '#e2e6ea' }}>
            <div
              className="dim-item w-full md:w-1/2 p-8 md:p-10 flex gap-5"
              style={{ background: '#0D1F3C', borderTop: '2px solid rgba(90,221,164,0.6)' }}
            >
              <DimBadge code={center.code} dark />
              <div>
                <p className="font-sans font-semibold text-white text-[15px] mb-1.5">{center.name}</p>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{center.desc}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
