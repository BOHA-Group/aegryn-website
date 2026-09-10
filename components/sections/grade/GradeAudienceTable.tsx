'use client'

import { useEffect, useRef, useState } from 'react'
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

const GRADE_CONFIG: Record<Grade, { color: string; bg: string; ring: string; label: string }> = {
  '★': { color: '#0D1F3C', bg: '#5ADDA4',  ring: '#5ADDA4',  label: 'Exceptional' },
  'AAA': { color: '#0D1F3C', bg: '#C9A84C',  ring: '#C9A84C',  label: 'Excellent'  },
  'AA':  { color: '#0D1F3C', bg: '#9BA8B0',  ring: '#9BA8B0',  label: 'Solid'      },
  'A':   { color: '#fff',    bg: '#4A90D9',  ring: '#4A90D9',  label: 'Developing' },
  'B':   { color: '#fff',    bg: '#D4820A',  ring: '#D4820A',  label: 'Emerging'   },
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
  const headers = t.raw('audienceGradeHeaders') as string[]
  const [active, setActive] = useState<number>(1) // default AAA

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.audience-card', {
        opacity: 0, y: 20, stagger: 0.07,
        ease: 'expo.out', duration: 0.65,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const activeGrade = GRADES[active]
  const cfg = GRADE_CONFIG[activeGrade]

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

        {/* Grade pill selector */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {GRADES.map((g, i) => {
            const c = GRADE_CONFIG[g]
            const isActive = i === active
            return (
              <button
                key={g}
                onClick={() => setActive(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.1em] font-semibold transition-all duration-200"
                style={
                  isActive
                    ? { background: c.bg, color: c.color, boxShadow: `0 0 0 2px ${c.ring}` }
                    : { background: 'white', color: '#888', border: '1px solid #E5E5E0' }
                }
              >
                <span className="text-[13px]">{g}</span>
                <span className="font-sans font-normal text-[10px] opacity-80">{c.label}</span>
              </button>
            )
          })}
        </div>

        {/* Cards grid — one card per profile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((row, ri) => {
            const Icon = PROFILE_ICONS[row.icon] ?? Users
            return (
              <div
                key={row.profile}
                className="audience-card bg-white border border-ag-border flex flex-col rounded-2xl overflow-hidden"
              >
                {/* Card header */}
                <div
                  className="px-5 py-4 flex items-center gap-3"
                  style={{ background: `${cfg.bg}18` }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: cfg.bg }}
                  >
                    <Icon size={14} style={{ color: cfg.color }} />
                  </div>
                  <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug">
                    {row.profile}
                  </p>
                </div>

                {/* Active grade reading */}
                <div className="px-5 py-5 flex-1 flex flex-col gap-3">
                  {/* Grade badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {activeGrade}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-ag-gray-light">
                      {headers[active]}
                    </span>
                  </div>

                  <p className="font-sans text-[13px] text-ag-black leading-relaxed flex-1">
                    {row.readings[active]}
                  </p>
                </div>

                {/* All grades mini-strip */}
                <div className="px-5 pb-4">
                  <div className="flex gap-1">
                    {GRADES.map((g, gi) => (
                      <button
                        key={g}
                        onClick={() => setActive(gi)}
                        title={GRADE_CONFIG[g].label}
                        className="flex-1 h-1 rounded-full transition-all duration-200"
                        style={{
                          background: GRADE_CONFIG[g].bg,
                          opacity: gi === active ? 1 : 0.25,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop — expandable full matrix toggle */}
        <details className="mt-6 group">
          <summary className="cursor-pointer list-none flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light hover:text-ag-black transition-colors select-none">
            <span className="group-open:hidden">Show full matrix ↓</span>
            <span className="hidden group-open:inline">Collapse ↑</span>
          </summary>

          <div className="mt-4 overflow-x-auto border border-ag-border rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ag-navy">
                  <th className="px-5 py-4">
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40">Profile</span>
                  </th>
                  {GRADES.map((g, gi) => {
                    const c = GRADE_CONFIG[g]
                    return (
                      <th
                        key={g}
                        className={`px-4 py-4 text-center ${gi === GRADES.length - 1 ? '' : ''}`}
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
                      <td className={`px-5 py-4 border-r border-ag-border ${ri === rows.length - 1 ? '' : ''}`}>
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
                          className={`px-4 py-4 border-r border-ag-border last:border-0 align-top ${
                            gi === active ? 'bg-ag-apex/5' : ''
                          } ${ri === rows.length - 1 && gi === GRADES.length - 1 ? '' : ''}`}
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
        </details>

      </div>
    </section>
  )
}
