'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function GradeDimensions() {
  const t    = useTranslations('grade.dimensions')
  const ref  = useRef<HTMLElement>(null)
  const items = t.raw('items') as { code: string; name: string; desc: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dim-item', {
        opacity: 0, x: -20, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-off-white border-t border-ag-border py-24 px-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
          {items.map(({ code, name, desc }) => (
            <div key={code} className="dim-item bg-ag-white p-10 flex gap-6">
              <div className="w-10 h-10 bg-ag-navy flex items-center justify-center shrink-0">
                <span className="font-sans font-bold text-ag-apex text-[14px]">{code}</span>
              </div>
              <div>
                <p className="font-sans font-semibold text-ag-black text-[17px] mb-2">{name}</p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
