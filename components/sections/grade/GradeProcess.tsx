'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'
import { ChevronDown } from 'lucide-react'

type ProcessStep = {
  num: string
  title: string
  desc: string
  detail: string
  data: string
}

export function GradeProcess() {
  const t     = useTranslations('grade.process')
  const ref   = useRef<HTMLElement>(null)
  const steps = t.raw('steps') as ProcessStep[]
  const [open, setOpen] = useState<number | null>(null)

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

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light">
            {t('label')}
          </p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-ag-gray-light">
            {t('duration')}
          </p>
        </div>

        {/* Steps — accordion on mobile, expanded list on desktop */}
        <div className="flex flex-col gap-px bg-ag-border border border-ag-border rounded-2xl overflow-hidden">
          {steps.map(({ num, title, desc, detail, data }, i) => (
            <div key={num} className="gprocess-step bg-ag-white">

              {/* Always visible row */}
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left grid grid-cols-[64px_1fr_auto] gap-6 px-6 py-7 hover:bg-ag-off-white transition-colors"
              >
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex font-bold">
                  {num}
                </span>
                <div>
                  <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-snug mb-1">
                    {title}
                  </h3>
                  <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                    {desc}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 mt-1 text-ag-gray-light transition-transform duration-200 ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expandable detail */}
              {open === i && (
                <div className="px-6 pb-8 pt-2 border-t border-ag-border bg-ag-off-white grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray-light mb-2">
                      Detail
                    </p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                      {detail}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray-light mb-2">
                      Required data
                    </p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                      {data}
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Contestation note */}
        <div className="mt-10 border border-ag-border rounded-2xl p-6 bg-ag-off-white grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray-light mb-2">
              {t('contestLabel')}
            </p>
          </div>
          <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
            {t('contestDesc')}
          </p>
        </div>

      </div>
    </section>
  )
}
