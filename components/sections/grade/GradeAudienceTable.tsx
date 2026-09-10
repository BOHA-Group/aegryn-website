'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

type AudienceRow = {
  profile: string
  icon: string
  readings: string[]
}

const GRADE_COLORS: Record<string, string> = {
  '★':   '#5ADDA4',
  'AAA': '#C9A84C',
  'AA':  '#9BA8B0',
  'A':   '#4A90D9',
  'B':   '#D4820A',
}

export function GradeAudienceTable() {
  const t       = useTranslations('grade.index')
  const ref     = useRef<HTMLElement>(null)
  const rows    = t.raw('audienceRows') as AudienceRow[]
  const headers = t.raw('audienceGradeHeaders') as string[]
  const grades  = ['★', 'AAA', 'AA', 'A', 'B']

  const [activeGrade, setActiveGrade] = useState(1) // default AAA

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.audience-row', {
        opacity: 0, x: -16, stagger: 0.07,
        ease: 'expo.out', duration: 0.6,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-off-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('audienceLabel')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('audienceTitle')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
            {t('audienceDesc')}
          </p>
        </div>

        {/* Grade selector — mobile */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 md:hidden">
          {grades.map((g, i) => (
            <button
              key={g}
              onClick={() => setActiveGrade(i)}
              className="shrink-0 font-mono text-[11px] tracking-[0.12em] font-semibold px-4 py-2 border transition-all"
              style={
                activeGrade === i
                  ? { color: '#0D1F3C', borderColor: GRADE_COLORS[g], background: GRADE_COLORS[g] }
                  : { color: GRADE_COLORS[g], borderColor: `${GRADE_COLORS[g]}40`, background: 'white' }
              }
            >
              {g}
            </button>
          ))}
        </div>

        {/* Desktop — full table */}
        <div className="hidden md:block border border-ag-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[200px_repeat(5,1fr)] bg-ag-navy">
            <div className="px-6 py-4" />
            {grades.map((g, i) => (
              <div key={g} className="px-4 py-4 border-l border-white/10 text-center">
                <p
                  className="font-mono text-[12px] tracking-[0.14em] font-bold"
                  style={{ color: GRADE_COLORS[g] }}
                >
                  {g}
                </p>
                <p className="font-mono text-[9px] tracking-[0.12em] text-white/40 mt-0.5">
                  {headers[i]}
                </p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row) => (
            <div
              key={row.profile}
              className="audience-row grid grid-cols-[200px_repeat(5,1fr)] border-t border-ag-border"
            >
              {/* Profile label */}
              <div className="px-6 py-5 bg-ag-white border-r border-ag-border flex items-start">
                <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug">
                  {row.profile}
                </p>
              </div>

              {/* Readings per grade */}
              {row.readings.map((reading, i) => (
                <div
                  key={i}
                  className="px-4 py-5 bg-ag-white border-l border-ag-border"
                  style={{
                    borderTopColor: i === activeGrade
                      ? GRADE_COLORS[grades[i]]
                      : undefined,
                    borderTopWidth: 2,
                  }}
                >
                  <p className="font-sans text-[11px] text-ag-gray leading-relaxed">
                    {reading}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile — single column per selected grade */}
        <div className="md:hidden border border-ag-border overflow-hidden">
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ background: GRADE_COLORS[grades[activeGrade]] }}
          >
            <span className="font-mono text-[13px] font-bold text-ag-navy">
              {grades[activeGrade]}
            </span>
            <span className="font-mono text-[10px] text-ag-navy/70 tracking-[0.12em]">
              {headers[activeGrade]}
            </span>
          </div>
          {rows.map((row) => (
            <div key={row.profile} className="border-t border-ag-border p-5 bg-ag-white">
              <p className="font-sans font-semibold text-ag-black text-[13px] mb-2">
                {row.profile}
              </p>
              <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                {row.readings[activeGrade]}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
