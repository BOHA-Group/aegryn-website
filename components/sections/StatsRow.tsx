'use client'

import { useEffect, useRef } from 'react'
import { useTranslations }   from 'next-intl'
import { gsap } from '@/lib/gsap'

export function StatsRow() {
  const t     = useTranslations('statsRow')
  const items = t.raw('items') as { num: string; label: string }[]
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Stagger fade-up for each stat item */
      gsap.fromTo('.stat-item',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          stagger: 0.11, duration: 0.75, ease: 'expo.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 82%', once: true },
        },
      )

      /* ScrambleText on each stat number when in view */
      document.querySelectorAll<HTMLElement>('.stat-scramble').forEach((el, i) => {
        const original = el.textContent ?? ''
        gsap.fromTo(el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.01,
            delay: i * 0.11,
            scrollTrigger: { trigger: rowRef.current, start: 'top 82%', once: true },
            onComplete() {
              gsap.to(el, {
                duration: 0.9,
                scrambleText: {
                  text: original,
                  chars: '0123456789ABCH.',
                  revealDelay: 0.1,
                  speed: 0.5,
                },
                ease: 'none',
              })
            },
          },
        )
      })

    }, rowRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-ag-white border-t border-ag-border py-20">
      <div
        ref={rowRef}
        className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-ag-border"
      >
        {items.map(({ num, label }) => (
          <div
            key={label}
            className="stat-item flex-1 py-10 md:py-0 md:px-16 first:pl-0 last:pr-0 flex flex-col gap-2"
            style={{ opacity: 0 }}
          >
            <span
              className="stat-scramble font-sans font-bold text-ag-black tracking-[-0.04em] leading-none"
              style={{ fontSize: '48px' }}
            >
              {num}
            </span>
            <span className="font-sans font-semibold text-[11px] tracking-[0.18em] uppercase text-ag-gray-light">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
