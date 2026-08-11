'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Banknote, Search, Users } from 'lucide-react'
import { gsap } from '@/lib/gsap'

const ICONS = [Banknote, Search, Users]

type Domain = { title: string; items: string[] }

export function AcqSupportStrip() {
  const t   = useTranslations('acqStrip')
  const ref = useRef<HTMLElement>(null)
  const domains = t.raw('domains') as Domain[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.acq-header > *',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } },
      )
      gsap.fromTo('.acq-domain-card',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 72%', once: true } },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-off-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">

        {/* Header */}
        <div className="acq-header flex items-start justify-between gap-8 mb-16 flex-wrap">
          <div className="max-w-xl">
            <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex-ink mb-4 flex items-center gap-3">
              <span className="w-5 h-px bg-ag-apex/50 inline-block" />
              {t('sublabel')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15]"
              style={{ fontSize: 'clamp(26px,3.2vw,44px)' }}
              dangerouslySetInnerHTML={{ __html: t('title').replace(/\n/g, '<br>') }}
            />
          </div>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-sm self-end">
            {t('desc')}
          </p>
        </div>

        {/* Domains grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border border border-ag-border">
          {domains.map((domain, i) => {
            const Icon = ICONS[i] ?? Banknote
            return (
              <div
                key={domain.title}
                className="acq-domain-card p-8 md:p-10 flex flex-col gap-5 bg-white"
                style={{ opacity: 0 }}
              >
                <Icon size={18} className="text-ag-apex-ink shrink-0" strokeWidth={1.5} />
                <h3
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.2]"
                  style={{ fontSize: 'clamp(14px,1.2vw,17px)' }}
                >
                  {domain.title}
                </h3>
                <ul className="space-y-2 flex-1">
                  {domain.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-sans text-[12.5px] text-ag-gray leading-snug">
                      <span className="mt-[5px] w-1 h-1 rounded-full bg-ag-apex shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-end">
          <Link
            href={"/contact?subject=acquisition" as never}
            className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-black transition-colors"
          >
            {t('cta')} <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  )
}
