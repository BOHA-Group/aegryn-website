'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { CountUp } from '@/components/animations/CountUp'

const STATS = [
  { num: '6.8B', label: 'Total mobile devices' },
  { num: '5.6B', label: 'Global smartphone connections' },
  { num: '4h12', label: 'Daily screen time' },
  { num: 'CH',   label: 'Engineered in Switzerland' },
]

export function StatsRow() {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        opacity: 0, y: 20,
        stagger: 0.1, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: rowRef.current, start: 'top 82%', once: true },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-ag-off-white border-t border-ag-border py-20">
      <div
        ref={rowRef}
        className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-ag-border"
      >
        {STATS.map(({ num, label }) => (
          <div
            key={label}
            className="stat-item flex-1 py-10 md:py-0 md:px-16 first:pl-0 last:pr-0 flex flex-col gap-2"
          >
            <CountUp
              value={num}
              className="font-display font-black text-ag-black tracking-[-0.04em] leading-none text-[48px]"
            />
            <span className="font-sans font-semibold text-[11px] tracking-[0.18em] uppercase text-ag-gray-light">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
