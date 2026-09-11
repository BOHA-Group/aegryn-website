'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ArrowUpRight, Check } from 'lucide-react'
import { gsap } from '@/lib/gsap'

type PricingTier = {
  name: string
  target: string
  price: string
  duration: string
  highlight: boolean
  includes: string[]
}

export function GradePricing() {
  const t      = useTranslations('grade.index')
  const locale = useLocale()
  const ref    = useRef<HTMLElement>(null)
  const tiers  = t.raw('pricingTiers') as PricingTier[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pricing-card',
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, stagger: 0.12,
          ease: 'expo.out', duration: 0.75,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="rounded-lg bg-ag-navy border-t border-white/10 py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex/70 mb-4">
            {t('pricingLabel')}
          </p>
          <h2
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
          >
            {t('pricingTitle')}
          </h2>
          <p className="font-sans text-[15px] text-white/50 leading-relaxed">
            {t('pricingDesc')}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
                tier.highlight
                  ? 'border-ag-apex/40 bg-white shadow-xl shadow-ag-apex/10'
                  : 'border-white/20 bg-white/[0.07] hover:bg-white/[0.12]'
              }`}
            >
              {/* Recommended badge */}
              {tier.highlight && (
                <div className="absolute top-0 left-0 right-0 flex justify-center">
                  <span className="bg-ag-apex text-ag-navy font-mono text-[9px] tracking-[0.2em] uppercase font-bold px-4 py-1 rounded-b-lg">
                    {t('pricingRecommended')}
                  </span>
                </div>
              )}

              <div className={`flex flex-col flex-1 p-8 ${tier.highlight ? 'pt-10' : ''}`}>

                {/* Tier name + target */}
                <div className="mb-8">
                  <p
                    className={`font-mono text-[12px] tracking-[0.18em] uppercase font-bold mb-1.5 ${
                      tier.highlight ? 'text-ag-navy' : 'text-white'
                    }`}
                  >
                    {tier.name}
                  </p>
                  <p
                    className={`font-sans text-[12px] leading-snug ${
                      tier.highlight ? 'text-ag-gray' : 'text-white/50'
                    }`}
                  >
                    {tier.target}
                  </p>
                </div>

                {/* Price */}
                <div className={`mb-8 pb-8 border-b ${tier.highlight ? 'border-ag-border' : 'border-white/10'}`}>
                  <p
                    className={`font-sans font-bold tracking-[-0.03em] leading-none mb-1.5 ${
                      tier.highlight ? 'text-ag-navy' : 'text-white'
                    }`}
                    style={{ fontSize: 'clamp(28px,3.2vw,40px)' }}
                  >
                    {tier.price}
                  </p>
                  <p
                    className={`font-mono text-[10px] tracking-[0.12em] ${
                      tier.highlight ? 'text-ag-gray-light' : 'text-white/40'
                    }`}
                  >
                    {tier.duration}
                  </p>
                </div>

                {/* Includes */}
                <ul className="flex flex-col gap-3.5 mb-10 flex-1">
                  {tier.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        size={13}
                        className={`shrink-0 mt-0.5 ${
                          tier.highlight ? 'text-ag-navy' : 'text-ag-apex'
                        }`}
                      />
                      <p
                        className={`font-sans text-[12px] leading-relaxed ${
                          tier.highlight ? 'text-ag-gray' : 'text-white/65'
                        }`}
                      >
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/${locale}/grade/submit`}
                  className={`inline-flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-4 rounded-xl transition-all ${
                    tier.highlight
                      ? 'bg-ag-navy text-white hover:bg-ag-navy-mid'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                  }`}
                >
                  {t('pricingCta')} <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-white/35 leading-relaxed max-w-lg">
            {t('pricingNote')}
          </p>
          <Link
            href={`/${locale}/grade/grading-system`}
            className="shrink-0 font-mono text-[10px] tracking-[0.14em] uppercase text-white/50 hover:text-white border border-white/15 hover:border-white/40 px-5 py-3 rounded-lg transition-all"
          >
            {t('pricingCtaSecondary')}
          </Link>
        </div>

      </div>
    </section>
  )
}
