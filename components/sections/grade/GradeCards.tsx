'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

const GRADE_COLORS: Record<string, string> = {
  'grade-star': 'bg-ag-grade-star text-ag-navy',
  'grade-aaa':  'bg-ag-grade-aaa text-ag-navy',
  'grade-aa':   'bg-ag-grade-aa text-ag-navy',
  'grade-a':    'bg-ag-grade-a text-white',
  'grade-b':    'bg-ag-grade-b text-white',
}

export function GradeCards() {
  const t      = useTranslations('grade')
  const ref    = useRef<HTMLElement>(null)
  const grades = t.raw('grades') as { code: string; name: string; color: string; desc: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.grade-card',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, stagger: 0.1, ease: 'expo.out', duration: 0.7,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ag-border border border-ag-border rounded-2xl overflow-hidden">
          {grades.map(({ code, name, color, desc }) => (
            <div key={code} className="grade-card bg-ag-white p-8 flex flex-col gap-4">
              <span className={`self-start inline-flex items-center font-mono text-[12px] font-bold px-2.5 py-1 rounded-full ${GRADE_COLORS[color] ?? 'bg-ag-border text-ag-navy'}`}>
                {code}
              </span>
              <p className="font-sans font-semibold text-ag-black text-[16px] leading-snug">{name}</p>
              <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
