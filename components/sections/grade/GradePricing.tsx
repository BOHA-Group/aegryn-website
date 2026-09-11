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
      gsap.from('.pricing-card', {
        opacity: 0, y: 32, stagger: 0.12,
        ease: 'expo.out', duration: 0.75,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="rounded-lg bg-ag-off-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('pricingLabel')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
          >
            {t('pricingTitle')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
            {t('pricingDesc')}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border rounded-2xl overflow-hidden">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card flex flex-col p-8 ${
                tier.highlight ? 'bg-ag-navy' : 'bg-ag-white'
              }`}
            >
              {/* Tier name */}
              <div className="mb-6">
                {tier.highlight && (
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-2">
                    Most common
                  </p>
                )}
                <p
                  className={`font-mono text-[11px] tracking-[0.18em] uppercase font-bold mb-1 ${
                    tier.highlight ? 'text-white' : 'text-ag-black'
                  }`}
                >
                  {tier.name}
                </p>
                <p
                  className={`font-sans text-[12px] leading-snug ${
                    tier.highlight ? 'text-white/60' : 'text-ag-gray'
                  }`}
                >
                  {tier.target}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-ag-border/40">
                <p
                  className={`font-sans font-bold tracking-[-0.03em] leading-none mb-1 ${
                    tier.highlight ? 'text-white' : 'text-ag-black'
                  }`}
                  style={{ fontSize: 'clamp(26px,3vw,36px)' }}
                >
                  {tier.price}
                </p>
                <p
                  className={`font-mono text-[10px] tracking-[0.12em] ${
                    tier.highlight ? 'text-white/60' : 'text-ag-gray-light'
                  }`}
                >
                  {tier.duration}
                </p>
              </div>

              {/* Includes */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {tier.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      size={12}
                      className={`shrink-0 mt-1 ${
                        tier.highlight ? 'text-ag-apex' : 'text-ag-black'
                      }`}
                    />
                    <p
                      className={`font-sans text-[12px] leading-relaxed ${
                        tier.highlight ? 'text-white/75' : 'text-ag-gray'
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
                className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-4 transition-all ${
                  tier.highlight
                    ? 'bg-ag-apex text-ag-navy hover:bg-ag-apex/90'
                    : 'bg-ag-navy text-white hover:bg-ag-navy-mid'
                }`}
              >
                {t('pricingCta')} <ArrowUpRight size={12} />
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-ag-gray-light leading-relaxed max-w-lg">
            {t('pricingNote')}
          </p>
          <Link
            href={`/${locale}/grade/grading-system`}
            className="shrink-0 font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray hover:text-ag-black border border-ag-border hover:border-ag-black px-5 py-3 rounded-lg transition-all"
          >
            {t('pricingCtaSecondary')}
          </Link>
        </div>

      </div>
    </section>
  )
}
