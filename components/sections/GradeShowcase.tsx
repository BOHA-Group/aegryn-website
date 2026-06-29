'use client'

import { useEffect, useRef } from 'react'
import Link                  from 'next/link'
import { useTranslations }   from 'next-intl'
import { ArrowRight }        from 'lucide-react'
import { gsap }              from '@/lib/gsap'

const GRADES = [
  { key: 'star',    color: 'bg-ag-grade-star',    text: 'text-ag-navy',  ring: 'ring-ag-grade-star/30' },
  { key: 'aaa',     color: 'bg-ag-grade-aaa',     text: 'text-ag-navy',  ring: 'ring-ag-grade-aaa/30' },
  { key: 'aa',      color: 'bg-ag-grade-aa',      text: 'text-ag-navy',  ring: 'ring-ag-grade-aa/30' },
  { key: 'a',       color: 'bg-ag-grade-a',       text: 'text-white',    ring: 'ring-ag-grade-a/30' },
  { key: 'b',       color: 'bg-ag-grade-b',       text: 'text-white',    ring: 'ring-ag-grade-b/30' },
] as const

export function GradeShowcase() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('gradeShowcase')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.grade-badge', {
        opacity: 0, scale: 0.85, y: 16, stagger: 0.08,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-28 bg-ag-off-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-4">
              {t('label')}
            </p>
            <h2
              className="font-display font-black text-ag-black tracking-[-0.03em] leading-[1.05] mb-6 whitespace-pre-line"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              {t('title')}
            </h2>
            <p className="text-[15px] text-ag-gray leading-relaxed mb-8 max-w-md">
              {t('desc')}
            </p>
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-black px-5 py-2.5 hover:bg-ag-black hover:text-white transition-all duration-200"
            >
              {t('cta')}
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Right — grade badges */}
          <div className="flex flex-col gap-3">
            {GRADES.map(({ key, color, text, ring }) => (
              <div
                key={key}
                className={`grade-badge flex items-center gap-5 p-4 bg-ag-white border border-ag-border hover:border-ag-border-h transition-colors ring-2 ${ring}`}
              >
                <span className={`shrink-0 inline-flex items-center justify-center w-16 h-10 font-mono font-bold text-[13px] tracking-wider ${color} ${text}`}>
                  {t(`grades.${key}.label` as Parameters<typeof t>[0])}
                </span>
                <span className="text-[13px] text-ag-gray">
                  {t(`grades.${key}.desc` as Parameters<typeof t>[0])}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
