'use client'

import { useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'

export function BuildStrip() {
  const t        = useTranslations('buildStrip')
  const ref      = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.build-panel', {
        opacity: 0,
        y: 24,
        stagger: 0.15,
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 78%',
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 md:py-6">
        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ag-gray-light mb-8 md:mb-10">
          {t('label')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border-t border-b border-ag-border mb-0">

        {/* Panneau gauche — Actifs propriétaires */}
        <div className="build-panel bg-ag-white px-8 md:px-12 py-12 md:py-16 flex flex-col gap-6">
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ag-gray-light">
            {t('assetsLabel')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.025em] leading-[1.08] whitespace-pre-line"
            style={{ fontSize: 'clamp(22px,2.6vw,36px)' }}
          >
            {t('assetsTitle')}
          </h2>
          <p className="font-sans text-[13px] text-ag-gray leading-relaxed max-w-sm flex-1">
            {t('assetsDesc')}
          </p>
          <Link
            href="/assets"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-ag-navy border border-ag-navy/30 px-5 py-2.5 hover:bg-ag-navy hover:text-white transition-colors self-start"
          >
            {t('assetsCta')} <ArrowUpRight size={11} />
          </Link>
        </div>

        {/* Panneau droit — Asset Engineering */}
        <div className="build-panel bg-ag-navy px-8 md:px-12 py-12 md:py-16 flex flex-col gap-6">
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/50">
            {t('engineeringLabel')}
          </p>
          <h2
            className="font-sans font-bold text-white tracking-[-0.025em] leading-[1.08] whitespace-pre-line"
            style={{ fontSize: 'clamp(22px,2.6vw,36px)' }}
          >
            {t('engineeringTitle')}
          </h2>
          <p className="font-sans text-[13px] text-white/65 leading-relaxed max-w-sm flex-1">
            {t('engineeringDesc')}
          </p>
          <Link
            href="/services/build"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase bg-ag-apex text-ag-navy font-semibold px-5 py-2.5 hover:bg-ag-apex/90 transition-colors self-start"
          >
            {t('engineeringCta')} <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </section>
  )
}
