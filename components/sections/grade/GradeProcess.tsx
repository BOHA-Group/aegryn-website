'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function GradeProcess() {
  const t     = useTranslations('grade.process')
  const ref   = useRef<HTMLElement>(null)
  const steps = t.raw('steps') as { num: string; title: string; desc: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gprocess-step', {
        opacity: 0, y: 24, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-14">
          {t('label')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border border border-ag-border">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="gprocess-step bg-ag-white p-8 flex flex-col gap-4">
              <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{num}</span>
              <h3 className="font-sans font-semibold text-ag-black text-[17px] leading-snug">{title}</h3>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
