'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'

const GRADE_COLORS: Record<string, string> = {
  '★':  'bg-ag-grade-star text-ag-navy',
  'AAA':'bg-ag-grade-aaa text-white',
  'AA': 'bg-ag-grade-aa text-white',
  'A':  'bg-ag-grade-a text-white',
  'B':  'bg-ag-grade-b text-white',
}

export function GradeStrip() {
  const t      = useTranslations('gradeStrip')
  const grades = (t.raw('grades') as { grade: string; label: string; desc: string }[]) || []
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.grade-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          stagger: 0.08, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: '.grade-cards-row', start: 'top 78%', once: true },
        },
      )
      gsap.fromTo('.grade-strip-text > *',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: '.grade-strip-text', start: 'top 78%', once: true },
        },
      )
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className="bg-ag-off-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">

        <div className="grade-strip-text text-center mb-16 space-y-5">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex flex items-center justify-center gap-3">
            <span className="w-5 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] whitespace-pre-line mx-auto"
            style={{ fontSize: 'clamp(32px,4.5vw,60px)', maxWidth: '700px' }}
          >
            {t('title')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed mx-auto" style={{ maxWidth: '560px' }}>
            {t('desc')}
          </p>
        </div>

        <div className="grade-cards-row grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-ag-border mb-14">
          {grades.map((g) => (
            <div
              key={g.grade}
              className="grade-card bg-ag-white p-4 sm:p-8 flex flex-col gap-4"
              style={{ opacity: 0 }}
            >
              <span className={`inline-flex items-center justify-center w-10 h-10 font-sans font-bold text-[18px] ${GRADE_COLORS[g.grade]}`}>
                {g.grade}
              </span>
              <p className="font-sans font-semibold text-[12px] tracking-[0.12em] uppercase text-ag-black">
                {g.label}
              </p>
              <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                {g.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-ag-border pt-10 flex justify-end">
          <Link
            href="/grade"
            className="shrink-0 inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-6 py-3 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300"
          >
            {t('cta')} <ArrowUpRight size={12} />
          </Link>
        </div>

      </div>
    </section>
  )
}
