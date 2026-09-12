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
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.15, ease: 'expo.out', duration: 0.8,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="rounded-lg bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14 max-w-3xl">
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

        {/* Timeline visuelle step-by-step */}
        <div className="relative">
          {/* Ligne verticale (cachée sur mobile) */}
          <div className="hidden md:block absolute left-[31px] top-8 bottom-8 w-px bg-ag-border" />

          {/* Steps */}
          <div className="flex flex-col gap-6">
            {steps.map(({ num, title, desc }, i) => {
              const Icon = STEP_ICONS[i] || Upload
              const isLast = i === steps.length - 1
              
              return (
                <div key={num} className="gprocess-step relative">
                  
                  {/* Card */}
                  <div className="flex gap-6 items-start">
                    
                    {/* Numéro + icône */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-2xl bg-ag-apex flex items-center justify-center relative z-10">
                        <Icon size={24} className="text-ag-navy" />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light font-bold">
                        {num}
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 bg-ag-off-white border border-ag-border rounded-2xl p-6 md:p-8">
                      <h3 className="font-sans font-bold text-ag-black text-[17px] leading-snug mb-3">
                        {title}
                      </h3>
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                        {desc}
                      </p>
                    </div>

                  </div>

                  {/* Connecteur mobile (flèche) */}
                  {!isLast && (
                    <div className="md:hidden flex justify-center py-2">
                      <div className="w-px h-6 bg-ag-border" />
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        </div>

        {/* Contestation note */}
        <div className="mt-12 border border-ag-border rounded-2xl p-6 bg-ag-off-white">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-3">
            {t('index.contestLabel')}
          </p>
          <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
            {t('index.contestDesc')}
          </p>
        </div>

      </div>
    </section>
  )
}
