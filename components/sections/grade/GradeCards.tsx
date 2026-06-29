'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

const COLOR_MAP: Record<string, string> = {
  'grade-star': '#5ADDA4',
  'grade-aaa':  '#C9A84C',
  'grade-aa':   '#9BA8B0',
  'grade-a':    '#4A90D9',
  'grade-b':    '#D4820A',
}

export function GradeCards() {
  const t      = useTranslations('grade')
  const ref    = useRef<HTMLElement>(null)
  const grades = t.raw('grades') as { code: string; name: string; color: string; desc: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.grade-card', {
        opacity: 0, y: 28, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ag-border border border-ag-border">
          {grades.map(({ code, name, color, desc }) => (
            <div key={code} className="grade-card bg-ag-white p-8 flex flex-col gap-4">
              <span
                className="font-mono text-[13px] tracking-[0.12em] font-semibold"
                style={{ color: COLOR_MAP[color] ?? '#6B6B6B' }}
              >
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
