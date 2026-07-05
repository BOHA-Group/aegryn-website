'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/gsap'

export function WhyUseApps() {
  const t = useTranslations('whyapps')
  const items = t.raw('items') as { num: string; title: string; desc: string }[]
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const splits: SplitText[] = []

    const ctx = gsap.context(() => {

      /* Each column: title clip-reveal + num ScrambleText */
      document.querySelectorAll<HTMLElement>('.why-col').forEach((col, i) => {
        const titleEl = col.querySelector<HTMLElement>('.why-title')
        const numEl   = col.querySelector<HTMLElement>('.why-num')
        const descEl  = col.querySelector<HTMLElement>('.why-desc')

        if (titleEl) {
          const split = new SplitText(titleEl, { type: 'lines', linesClass: 'why-line' })
          splits.push(split)
          split.lines.forEach((line) => {
            const w = document.createElement('span')
            w.style.display = 'block'
            w.style.overflow = 'hidden'
            ;(line as HTMLElement).parentNode?.insertBefore(w, line)
            w.appendChild(line)
          })

          const tl = gsap.timeline({
            scrollTrigger: { trigger: col, start: 'top 82%', once: true },
          })

          if (numEl) {
            tl.fromTo(numEl,
              { opacity: 0, x: -6 },
              { opacity: 1, x: 0, duration: 0.4, ease: 'expo.out', delay: i * 0.07 },
            )
          }

          tl.fromTo(split.lines,
            { yPercent: 110 },
            { yPercent: 0, stagger: 0.08, duration: 0.7, ease: 'expo.out' },
            numEl ? '-=0.2' : '0',
          )

          if (descEl) {
            tl.fromTo(descEl,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
              '-=0.3',
            )
          }
        }
      })

    }, sectionRef)

    return () => {
      ctx.revert()
      splits.forEach((s) => s.revert())
    }
  }, [])

  return (
    <section ref={sectionRef} className="border-t border-ag-border bg-ag-off-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between border-b border-ag-border py-4">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
            / {t('label')}
          </p>
          <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.02em]">
            {t('count')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-ag-border">
          {items.map((item) => (
            <div key={item.num} className="why-col py-14 lg:px-6 first:pl-0 last:pr-0">
              <p className="why-num font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex-ink mb-6" style={{ opacity: 0 }}>
                {item.num}
              </p>
              <h3
                className="why-title font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1] mb-4 overflow-hidden"
                style={{ fontSize: 'clamp(14px,1.15vw,16px)' }}
              >
                {item.title}
              </h3>
              <p className="why-desc font-sans font-normal text-[12px] text-ag-gray leading-[1.7]" style={{ opacity: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
