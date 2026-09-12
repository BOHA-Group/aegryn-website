'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'
import { Upload, Search, FileCheck, Award } from 'lucide-react'

type ProcessStep = {
  num: string
  title: string
  desc: string
}

const STEP_ICONS = [Upload, Search, FileCheck, Award]

export function GradeProcess() {
  const t     = useTranslations('grade')
  const ref   = useRef<HTMLElement>(null)
  const steps = t.raw('process') as ProcessStep[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gprocess-step',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.12, ease: 'expo.out', duration: 0.7,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('index.processLabel')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('index.processTitle')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
            {t('index.processDuration')}
          </p>
        </div>

        {/* Timeline horizontale — 4 étapes sur une ligne */}
        <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          {/* Ligne de liaison (desktop) */}
          <div aria-hidden className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-ag-border" />

          {steps.map(({ num, title, desc }, i) => {
            const Icon = STEP_ICONS[i] ?? Upload
            return (
              <li key={num} className="gprocess-step relative flex md:flex-col gap-5 md:gap-0 md:items-center md:text-center">
                <div className="relative z-10 shrink-0 w-16 h-16 rounded-2xl bg-ag-apex flex items-center justify-center ring-8 ring-ag-white">
                  <Icon size={24} className="text-ag-navy" />
                </div>
                <div className="md:mt-6">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light font-bold">
                    {num}
                  </span>
                  <h3 className="font-sans font-bold text-ag-black text-[17px] leading-snug mt-1.5 mb-2.5">
                    {title}
                  </h3>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed md:max-w-[260px] md:mx-auto">
                    {desc}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

      </div>
    </section>
  )
}
