'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'
import { Building2, Landmark, TrendingUp, Users, Target, type LucideProps } from 'lucide-react'
import type { FC } from 'react'

type AudienceRow = {
  profile: string
  icon: string
  readings: string[]
}

const GRADES = ['★', 'AAA', 'AA', 'A', 'B'] as const
type Grade = (typeof GRADES)[number]

const GRADE_CONFIG: Record<Grade, { color: string; bg: string; ring: string }> = {
  '★': { color: '#0D1F3C', bg: '#5ADDA4',  ring: '#5ADDA4' },
  'AAA': { color: '#0D1F3C', bg: '#C9A84C',  ring: '#C9A84C' },
  'AA':  { color: '#0D1F3C', bg: '#9BA8B0',  ring: '#9BA8B0' },
  'A':   { color: '#fff',    bg: '#4A90D9',  ring: '#4A90D9' },
  'B':   { color: '#fff',    bg: '#D4820A',  ring: '#D4820A' },
}

const PROFILE_ICONS: Record<string, FC<LucideProps>> = {
  building:  Building2,
  landmark:  Landmark,
  trending:  TrendingUp,
  users:     Users,
  target:    Target,
}

export function GradeAudienceTable() {
  const t       = useTranslations('grade.index')
  const ref     = useRef<HTMLElement>(null)
  const rows    = t.raw('audienceRows') as AudienceRow[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.audience-table-wrapper',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'expo.out', duration: 0.7,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="rounded-lg border-t border-ag-border py-24 px-6">
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

        {/* Tableau complet — scrollable sur mobile */}
        <div className="audience-table-wrapper overflow-x-auto border border-ag-border rounded-2xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-ag-navy">
                <th className="px-5 py-4 sticky left-0 bg-ag-navy z-10">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">{t('audienceColProfile')}</span>
                </th>
                {GRADES.map((g) => {
                  const c = GRADE_CONFIG[g]
                  return (
                    <th
                      key={g}
                      className="px-4 py-4 text-center"
                    >
                      <span
                        className="inline-block font-mono text-[12px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: c.bg, color: c.color }}
                      >
                        {g}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const Icon = PROFILE_ICONS[row.icon] ?? Users
                return (
                  <tr
                    key={row.profile}
                    className={`border-t border-ag-border ${ri % 2 === 0 ? 'bg-white' : 'bg-ag-off-white'}`}
                  >
                    <td className="px-5 py-4 border-r border-ag-border sticky left-0 z-10 bg-inherit">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Icon size={13} className="text-ag-gray-light shrink-0" />
                        <p className="font-sans font-semibold text-ag-black text-[12px]">
                          {row.profile}
                        </p>
                      </div>
                    </td>
                    {row.readings.map((reading, gi) => (
                      <td
                        key={gi}
                        className="px-4 py-4 border-r border-ag-border last:border-0 align-top"
                      >
                        <p className="font-sans text-[11px] text-ag-gray leading-relaxed min-w-[120px]">
                          {reading}
                        </p>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  )
}
