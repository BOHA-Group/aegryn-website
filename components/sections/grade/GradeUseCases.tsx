'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import {
  FileText,
  Landmark,
  BarChart2,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Globe,
} from 'lucide-react'

type UseCase = {
  num: string
  tag: string
  title: string
  audience: string
  desc: string
  signal: string
}

// Per use-case config: image, audience chips with Lucide icon
const UC_META = [
  {
    image: '/images/grade-usecases/uc-annual-report.jpg',
    imageAlt: 'Board meeting — investor communication',
    chips: [
      { label: 'Growing SMEs', Icon: Building2 },
      { label: 'ETIs', Icon: Briefcase },
      { label: 'Investors', Icon: BarChart2 },
      { label: 'Shareholders', Icon: Users },
    ],
  },
  {
    image: '/images/grade-usecases/uc-bank-financing.jpg',
    imageAlt: 'Bank financing — lenders',
    chips: [
      { label: 'SMEs & ETIs', Icon: Building2 },
      { label: 'CFOs', Icon: BarChart2 },
      { label: 'Banks', Icon: Landmark },
      { label: 'Lenders', Icon: Globe },
    ],
  },
  {
    image: '/images/grade-usecases/uc-due-diligence.jpg',
    imageAlt: 'Investment committee due diligence',
    chips: [
      { label: 'PE Funds', Icon: TrendingUp },
      { label: 'Venture Capital', Icon: TrendingUp },
      { label: 'Family Offices', Icon: Users },
      { label: 'Investment Committees', Icon: Briefcase },
    ],
  },
  {
    image: '/images/grade-usecases/uc-fundraising.jpg',
    imageAlt: 'Fundraising pitch — startups',
    chips: [
      { label: 'Startups', Icon: TrendingUp },
      { label: 'Scale-ups', Icon: BarChart2 },
      { label: 'Founders', Icon: Users },
      { label: 'Investors', Icon: Landmark },
    ],
  },
  {
    image: '/images/grade-usecases/uc-succession.jpg',
    imageAlt: 'Family succession — business transfer',
    chips: [
      { label: 'Founders', Icon: Users },
      { label: 'Family Businesses', Icon: Building2 },
      { label: 'Heirs', Icon: FileText },
      { label: 'M&A Advisors', Icon: Briefcase },
    ],
  },
]

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
        <div className="flex flex-col gap-px bg-ag-border border border-ag-border rounded-2xl overflow-hidden">
          {cases.map((uc, idx) => {
            const meta = UC_META[idx]
            return (
              <div
                key={uc.num}
                className="usecase-item bg-ag-white hover:bg-ag-off-white transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[56px_1fr_260px] gap-0">

                  {/* Number */}
                  <div className="hidden lg:flex items-start justify-center pt-10 border-r border-ag-border">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-ag-apex font-bold">
                      {uc.num}
                    </span>
                  </div>

                  {/* Main content */}
                  <div className="p-8 lg:p-10">
                    {/* Tag — mono small */}
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light mb-3">
                      {uc.tag}
                    </p>

                    {/* Title — BOLD, large */}
                    <h3 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em] leading-snug mb-4">
                      {uc.title}
                    </h3>

                    {/* Description — normal weight */}
                    <p className="font-sans font-normal text-[13px] text-ag-gray leading-relaxed max-w-xl mb-6">
                      {uc.desc}
                    </p>

                    {/* Audience chips */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {meta.chips.map(({ label, Icon }) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-3 py-1.5 rounded-full bg-ag-white hover:border-ag-black transition-colors"
                        >
                          <Icon size={10} className="text-ag-apex shrink-0" />
                          {label}
                        </span>
                      ))}
                    </div>

                    {/* Signal */}
                    <div className="inline-block bg-ag-navy px-4 py-2.5 rounded-md">
                      <p className="font-mono text-[10px] leading-relaxed text-ag-apex/80">
                        {uc.signal}
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="hidden lg:block relative border-l border-ag-border overflow-hidden" style={{ minHeight: 240 }}>
                    <Image
                      src={meta.image}
                      alt={meta.imageAlt}
                      fill
                      sizes="260px"
                      className="object-cover grayscale opacity-70 hover:opacity-90 hover:grayscale-0 transition-all duration-500"
                    />
                    {/* Overlay with num */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ag-navy/60 to-transparent flex items-end p-4">
                      <span className="font-mono text-[22px] font-bold text-white/40">
                        {uc.num}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
