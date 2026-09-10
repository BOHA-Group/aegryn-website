'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

type UseCase = {
  num: string
  tag: string
  title: string
  audience: string
  desc: string
  signal: string
}

export function GradeUseCases() {
  const t     = useTranslations('grade.index')
  const ref   = useRef<HTMLElement>(null)
  const cases = t.raw('useCases') as UseCase[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.usecase-item', {
        opacity: 0, y: 28, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('useCasesLabel')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
          >
            {t('useCasesTitle')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl">
            {t('useCasesDesc')}
          </p>
        </div>

        {/* Use cases */}
        <div className="flex flex-col gap-px bg-ag-border border border-ag-border">
          {cases.map((uc) => (
            <div
              key={uc.num}
              className="usecase-item bg-ag-white p-8 md:p-10 grid grid-cols-1 md:grid-cols-[80px_1fr_320px] gap-6 md:gap-10 items-start hover:bg-ag-off-white transition-colors"
            >
              {/* Number */}
              <div className="flex items-center md:items-start">
                <span className="font-mono text-[11px] tracking-[0.2em] text-ag-apex font-bold">
                  {uc.num}
                </span>
              </div>

              {/* Main content */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light mb-2">
                  {uc.tag}
                </p>
                <h3 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-snug mb-4">
                  {uc.title}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed max-w-xl">
                  {uc.desc}
                </p>
              </div>

              {/* Audience + signal */}
              <div className="flex flex-col gap-4">
                <div className="border border-ag-border p-4">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray-light mb-2">
                    Audience
                  </p>
                  <p className="font-sans text-[12px] text-ag-black leading-snug">
                    {uc.audience}
                  </p>
                </div>
                <div className="bg-ag-navy px-4 py-3">
                  <p className="font-mono text-[10px] leading-relaxed text-ag-apex/80">
                    {uc.signal}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
