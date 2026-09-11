'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

type ISORow = {
  dimension: string
  existing: string
  cifso: string
}

const DIMENSION_COLORS: Record<string, string> = {
  C: '#4A90D9',
  I: '#9B59B6',
  F: '#2ECC71',
  S: '#E74C3C',
  O: '#F39C12',
}

function getDimensionCode(dimension: string): string {
  return dimension.charAt(0)
}

export function GradeISOMapping() {
  const t    = useTranslations('grade.index')
  const ref  = useRef<HTMLElement>(null)
  const rows = t.raw('isoRows') as ISORow[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.iso-row', {
        opacity: 0, y: 20, stagger: 0.1,
        ease: 'expo.out', duration: 0.65,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="rounded-lg bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('isoLabel')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3vw,42px)' }}
          >
            {t('isoTitle')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-6">
            {t('isoDesc')}
          </p>
          {/* Key statement */}
          <div className="border-l-2 border-ag-apex pl-5 py-1">
            <p className="font-sans font-semibold text-ag-black text-[15px] leading-snug italic">
              {t('isoStatement')}
            </p>
          </div>
        </div>

        {/* Comparison table */}
        <div className="border border-ag-border overflow-hidden rounded-2xl">

          {/* Column headers */}
          <div className="grid grid-cols-[180px_1fr_1fr] md:grid-cols-[200px_1fr_1fr] bg-ag-navy">
            <div className="px-6 py-4">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60">
                Dimension CIFSO 5000
              </p>
            </div>
            <div className="px-6 py-4 border-l border-white/10">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60">
                Existing standards
              </p>
            </div>
            <div className="px-6 py-4 border-l border-white/10">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-apex/70">
                Certification CIFSO 5000
              </p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row) => {
            const code  = getDimensionCode(row.dimension)
            const color = DIMENSION_COLORS[code] ?? '#888'
            return (
              <div
                key={row.dimension}
                className="iso-row grid grid-cols-[180px_1fr_1fr] md:grid-cols-[200px_1fr_1fr] border-t border-ag-border"
              >
                {/* Dimension */}
                <div className="rounded-lg px-6 py-5 bg-ag-off-white border-r border-ag-border flex items-start">
                  <div className="flex items-start gap-3">
                    <span
                      className="font-mono text-[13px] font-bold shrink-0 mt-0.5"
                      style={{ color }}
                    >
                      {code}
                    </span>
                    <p className="font-sans text-[12px] text-ag-black font-semibold leading-snug">
                      {row.dimension.slice(code.length).replace(/^\s*[·—–-]?\s*/, '')}
                    </p>
                  </div>
                </div>

                {/* Existing standards */}
                <div className="rounded-lg px-6 py-5 bg-ag-white border-r border-ag-border">
                  <div className="flex items-start gap-2">
                    <span className="text-ag-gray-light text-[11px] mt-0.5 shrink-0">–</span>
                    <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                      {row.existing}
                    </p>
                  </div>
                </div>

                {/* CIFSO 5000 */}
                <div className="rounded-lg px-6 py-5 bg-ag-white" style={{ borderLeft: `2px solid ${color}20` }}>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[11px] mt-0.5 shrink-0" style={{ color }}>
                      ✓
                    </span>
                    <p className="font-sans text-[12px] text-ag-black leading-relaxed">
                      {row.cifso}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

        </div>

        {/* Disclaimer */}
        <p className="mt-6 font-mono text-[10px] text-ag-gray-light leading-relaxed max-w-2xl">
          Certification CIFSO 5000 is an independent organisational assessment protocol developed by Aegryn. It is not an accreditation under a national or international accreditation body, and does not replace existing certification standards. It is designed to operate alongside them.
        </p>

      </div>
    </section>
  )
}
