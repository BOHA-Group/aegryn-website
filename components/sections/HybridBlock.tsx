'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function HybridBlock() {
  const t = useTranslations('homeHybrid')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hybrid-line',
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0,
          stagger: 0.08, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  const descLines = t('desc').split('\n')

  return (
    <section ref={ref} className="border-t border-ag-border bg-ag-off-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* Left — title */}
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2]"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            dangerouslySetInnerHTML={{ __html: t('title').replace(/\n/g, '<br>') }}
          />

          {/* Right — desc lines */}
          <div className="space-y-2">
            {descLines.map((line, i) => (
              <p
                key={i}
                className={`hybrid-line font-sans leading-relaxed ${
                  line === ''
                    ? 'h-4'
                    : line.startsWith('Aegryn')
                    ? 'font-semibold text-[13px] text-ag-black'
                    : 'font-normal text-[13px] text-ag-gray'
                }`}
                style={{ opacity: 0 }}
              >
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
