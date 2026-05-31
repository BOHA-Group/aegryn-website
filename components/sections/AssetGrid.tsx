'use client'

import { useEffect, useRef }  from 'react'
import Link                    from 'next/link'
import { ArrowUpRight, Lock }  from 'lucide-react'
import { useTranslations }     from 'next-intl'
import { gsap }                from '@/lib/gsap'
import { AEGRYN_ASSETS }       from '@/data/assets'

/* ── Inactive assets — greyed badge ── */
const NOT_STARTED_IDS = ['movtoo', 'primiom', 'hobconnect']
const KRYV_ID = 'kryv'

export function AssetGrid() {
  const t       = useTranslations('assetGrid')
  const tStatus = useTranslations('build.status')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      AEGRYN_ASSETS.forEach((_, i) => {
        gsap.fromTo(`.asset-row-${i}`,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'expo.out',
            scrollTrigger: {
              trigger: `.asset-row-${i}`,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-ag-white border-t border-ag-border">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
        <p className="font-sans font-semibold text-[11px] tracking-[0.24em] uppercase text-ag-gray-light mb-5">
          {t('sectionLabel')}
        </p>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[0.93] whitespace-pre-line"
          style={{ fontSize: 'clamp(42px,5.5vw,80px)' }}
        >
          {t('sectionTitle')}
        </h2>
      </div>

      {/* Asset rows — full-width Hexa style */}
      <div ref={wrapRef} className="border-t border-ag-border">
        {AEGRYN_ASSETS.map((asset, i) => {
          const isKryv       = asset.id === KRYV_ID
          const isNotStarted = NOT_STARTED_IDS.includes(asset.id)
          const isLive       = asset.status === 'live'
          const href         = asset.url ?? `/assets/${asset.slug}`
          const isExternal   = !!asset.url

          const inner = (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-10">

              {/* Left — index + name + tagline */}
              <div className="flex items-start gap-6 min-w-0 flex-1">
                <span className="font-sans font-semibold text-[11px] tracking-[0.16em] text-ag-gray-light shrink-0 pt-1 w-7">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3
                      className={`font-sans font-bold tracking-[-0.03em] leading-none transition-colors duration-300 ${
                        isKryv || isNotStarted
                          ? 'text-ag-gray-light'
                          : 'text-ag-black group-hover:text-ag-navy'
                      }`}
                      style={{ fontSize: 'clamp(22px,2.5vw,34px)' }}
                    >
                      {asset.name}
                    </h3>
                    {/* Status badge */}
                    {isKryv && (
                      <span className="inline-flex items-center gap-1.5 border border-ag-border px-2.5 py-0.5 font-sans font-semibold text-[9px] tracking-[0.14em] uppercase text-ag-gray-light">
                        <Lock size={8} />
                        Restricted
                      </span>
                    )}
                    {!isKryv && isNotStarted && (
                      <span className="inline-flex items-center gap-1.5 border border-ag-border/60 px-2.5 py-0.5 font-sans font-semibold text-[9px] tracking-[0.14em] uppercase text-ag-gray-light/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-ag-gray-light/40 inline-block" />
                        {t('notStarted')}
                      </span>
                    )}
                    {!isKryv && !isNotStarted && isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-sans font-semibold text-[9px] tracking-[0.14em] uppercase text-emerald-600">
                        <span className="relative flex w-2 h-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                          <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
                        </span>
                        Live
                      </span>
                    )}
                    {!isKryv && !isNotStarted && !isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-sans font-semibold text-[9px] tracking-[0.14em] uppercase text-orange-500">
                        <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                        {tStatus('building')}
                      </span>
                    )}
                  </div>
                  <p className={`font-sans font-normal text-[13px] leading-relaxed max-w-lg ${
                    isKryv || isNotStarted ? 'text-ag-gray-light/50' : 'text-ag-gray'
                  }`}>
                    {asset.tagline}
                  </p>
                </div>
              </div>

              {/* Right — category + arrow */}
              <div className="flex items-center gap-6 shrink-0 pl-13 md:pl-0">
                <span className={`font-sans font-semibold text-[10px] tracking-[0.18em] uppercase ${
                  isKryv || isNotStarted ? 'text-ag-gray-light/40' : 'text-ag-gray-light'
                }`}>
                  {asset.badge}
                </span>
                {!isKryv && !isNotStarted && (
                  <span className="w-9 h-9 border border-ag-border flex items-center justify-center text-ag-gray group-hover:border-ag-black group-hover:bg-ag-black group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                    <ArrowUpRight size={14} />
                  </span>
                )}
              </div>
            </div>
          )

          const rowClass = `group asset-row-${i} border-b border-ag-border transition-colors duration-300 ${
            isKryv || isNotStarted
              ? 'bg-ag-off-white/60 cursor-default opacity-60'
              : 'bg-ag-white hover:bg-ag-off-white cursor-pointer'
          }`

          if (isKryv || isNotStarted) {
            return <div key={asset.id} className={rowClass}>{inner}</div>
          }

          return (
            <Link
              key={asset.id}
              href={href}
              className={rowClass}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
