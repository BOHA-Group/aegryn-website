'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, ShieldCheck, Brain, Compass } from 'lucide-react'
import { gsap } from '@/lib/gsap'

const ICONS = [ShieldCheck, Brain, Compass]

export function AdvisoryTechStrip() {
  const t        = useTranslations('advisory')
  const ref      = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headRef  = useRef<HTMLHeadingElement>(null)

  const services = t.raw('services') as Record<string, { title: string; desc: string; items: string[] }>
  const serviceKeys = Object.keys(services)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [labelRef.current, headRef.current],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true } },
      )
      gsap.fromTo('.adv-service-card',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 72%', once: true } },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">

        {/* Header */}
        <div className="flex items-start justify-between gap-8 mb-16 flex-wrap">
          <div className="max-w-xl">
            <p ref={labelRef} className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex-ink mb-4 flex items-center gap-3">
              <span className="w-5 h-px bg-ag-apex/50 inline-block" />
              {t('label')}
            </p>
            <h2
              ref={headRef}
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15]"
              style={{ fontSize: 'clamp(26px,3.2vw,44px)' }}
              dangerouslySetInnerHTML={{ __html: t('hero.title').replace(/\n/g, '<br>') }}
            />
          </div>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-sm self-end">
            {t('hero.desc')}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border border border-ag-border">
          {serviceKeys.map((key, i) => {
            const svc  = services[key]
            const Icon = ICONS[i] ?? ShieldCheck
            return (
              <div
                key={key}
                className="adv-service-card p-8 md:p-10 flex flex-col gap-5"
                style={{ opacity: 0 }}
              >
                <Icon size={18} className="text-ag-apex-ink shrink-0" strokeWidth={1.5} />
                <h3
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.2]"
                  style={{ fontSize: 'clamp(15px,1.3vw,18px)' }}
                >
                  {svc.title}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                  {svc.desc}
                </p>
                <ul className="space-y-1.5">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-sans text-[12px] text-ag-gray-light">
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
            href="/advisory"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase bg-ag-navy text-white px-6 py-3 hover:bg-ag-black transition-colors"
          >
            {t('cta')} <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  )
}
