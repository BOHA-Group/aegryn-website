'use client'

import { useLayoutEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

export function AboutWhyNarrative() {
  const t = useTranslations('aboutPage.whyAegryn')
  const ref = useRef<HTMLDivElement>(null)
  const opening = t.raw('opening') as string[]
  const reasoning = t.raw('reasoning') as { lead: string; consequence: string }[]

  useLayoutEffect(() => {
    if (!ref.current) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      ref.current?.querySelectorAll('[data-why-row]').forEach(row => {
        gsap.from(row, {
          opacity: 0,
          y: 12,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 90%', once: true },
        })
      })
    }, ref)
    return () => mm.revert()
  }, [])

  return (
    <div ref={ref}>
      <p className="mb-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink">
        <span className="inline-block h-px w-5 bg-ag-apex/50" aria-hidden="true" />
        {t('label')}
      </p>
      <h2 id="why-aegryn-title" className="mb-12 max-w-2xl font-sans font-bold leading-[1.1] tracking-[-0.03em] text-ag-black" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
        {t('title')}
      </h2>

      <div className="max-w-5xl space-y-2 font-sans text-[24px] leading-[1.45] tracking-[-0.02em] text-ag-black lg:text-[28px]">
        {opening.map(sentence => <p key={sentence}>{sentence}</p>)}
      </div>
      <div className="mt-8 max-w-[65ch] text-[16px] leading-relaxed text-ag-gray">
        <p className="mb-3 font-semibold text-ag-black">{t('responseLead')}</p>
        <p>{t.rich('response', { strong: chunks => <strong className="font-semibold text-ag-black">{chunks}</strong> })}</p>
      </div>

      <ul className="mt-14 list-none border-b border-ag-border lg:mt-16">
        {reasoning.map(({ lead, consequence }) => (
          <li key={lead} data-why-row className="border-t border-ag-border py-6 lg:py-7">
            <p className="grid gap-2 font-sans text-[18px] leading-relaxed lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:text-[20px]">
              <strong className="font-semibold text-ag-black">{lead}</strong>
              {' '}
              <span className="text-ag-gray">{consequence}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-14 max-w-4xl lg:mt-20">
        <p className="font-sans text-[24px] font-semibold leading-[1.4] tracking-[-0.02em] text-ag-black lg:text-[28px]">{t('closingLead')}</p>
        <p className="mt-5 max-w-[65ch] text-[16px] leading-relaxed text-ag-gray">{t('closing')}</p>
      </div>
    </div>
  )
}
