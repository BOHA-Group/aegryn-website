'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function FounderQuoteStrip() {
  const t = useTranslations('founderQuote')
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fq-text',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="border-t border-ag-border bg-ag-black py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <blockquote className="fq-text" style={{ opacity: 0 }}>
          <p
            className="font-sans font-normal italic text-white/80 leading-[1.6] mb-8"
            style={{ fontSize: 'clamp(18px,2.2vw,28px)' }}
          >
            &ldquo;{t('text')}&rdquo;
          </p>
          <footer>
            <div className="inline-flex items-center gap-3">
              <div className="w-6 h-px bg-ag-apex" />
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink">
                {t('author')}
              </p>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
