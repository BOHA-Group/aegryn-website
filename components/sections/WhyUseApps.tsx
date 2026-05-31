'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function WhyUseApps() {
  const t = useTranslations('whyapps')
  const items = t.raw('items') as { num: string; title: string; desc: string }[]
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.why-col', {
        opacity: 0, y: 24, stagger: 0.09,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    })
    return () => ctx.revert()
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
              <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex mb-6">
                {item.num}
              </p>
              <h3
                className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1] mb-4"
                style={{ fontSize: 'clamp(14px,1.15vw,16px)' }}
              >
                {item.title}
              </h3>
              <p className="font-sans font-normal text-[12px] text-ag-gray leading-[1.7]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
