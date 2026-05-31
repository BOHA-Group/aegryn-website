'use client'

import { useEffect, useRef }  from 'react'
import Link                    from 'next/link'
import { ArrowUpRight, Lock }  from 'lucide-react'
import { useTranslations }     from 'next-intl'
import { gsap, SplitText }     from '@/lib/gsap'
import { AEGRYN_ASSETS }       from '@/data/assets'

/* ── Inactive assets — greyed badge ── */
const NOT_STARTED_IDS = ['movtoo', 'primiom', 'hobconnect']
const KRYV_ID = 'kryv'

export function AssetGrid() {
  const t       = useTranslations('assetGrid')
  const tStatus = useTranslations('build.status')
  const wrapRef    = useRef<HTMLDivElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const h2Ref      = useRef<HTMLHeadingElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const h2 = h2Ref.current
    if (!h2) return

    /* SplitText H2 — lines clip-reveal */
    const split = new SplitText(h2, { type: 'lines', linesClass: 'ag-line-inner' })
    split.lines.forEach((line) => {
      const w = document.createElement('div')
      w.style.overflow = 'hidden'
      ;(line as HTMLElement).parentNode?.insertBefore(w, line)
      w.appendChild(line)
    })

    const ctx = gsap.context(() => {

      /* Label ScrambleText */
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.5,
            scrollTrigger: { trigger: headerRef.current, start: 'top 82%', once: true },
          },
        )
      }

      /* H2 lines clip reveal */
      gsap.fromTo(split.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%', once: true },
        },
      )

      /* Asset chips stagger */
      AEGRYN_ASSETS.forEach((asset, i) => {
        const isDisabled = [...NOT_STARTED_IDS, KRYV_ID].includes(asset.id)
        gsap.fromTo(`.asset-row-${i}`,
          { opacity: 0, y: 20 },
          {
            opacity: isDisabled ? 0.45 : 1,
            y: 0, duration: 0.7, ease: 'expo.out',
            delay: (i % 3) * 0.05,
            scrollTrigger: {
              trigger: wrapRef.current,
              start: 'top 85%',
              once: true,
            },
          },
        )
      })
    }, wrapRef)

    return () => { ctx.revert(); split.revert() }
  }, [])

  return (
    <section className="bg-ag-white border-t border-ag-border">

      {/* Header */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
        <p ref={labelRef} className="font-sans font-semibold text-[11px] tracking-[0.24em] uppercase text-ag-gray-light mb-5">
          {t('sectionLabel')}
        </p>
        <h2
          ref={h2Ref}
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[0.93] whitespace-pre-line overflow-hidden"
          style={{ fontSize: 'clamp(42px,5.5vw,80px)' }}
        >
          {t('sectionTitle')}
        </h2>
      </div>

      {/* 6 chips condensés — style hexa.com */}
      <div ref={wrapRef} className="border-t border-ag-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-ag-border">
          {AEGRYN_ASSETS.map((asset, i) => {
            const isKryv       = asset.id === KRYV_ID
            const isNotStarted = NOT_STARTED_IDS.includes(asset.id)
            const isLive       = asset.status === 'live'
            const isDisabled   = isKryv || isNotStarted
            const href         = '/what-we-build'

            const chip = (
              <div className={`asset-row-${i} group relative flex flex-col justify-between h-full p-5 border-ag-border transition-colors duration-300
                ${i % 3 !== 2 ? 'lg:border-r' : ''}
                ${i < 3 ? 'sm:border-b' : ''}
                ${isDisabled ? 'cursor-default' : 'cursor-pointer hover:bg-ag-off-white'}`}
                style={{ minHeight: '160px' }}
              >
                {/* Top — index + status */}
                <div className="flex items-start justify-between mb-6">
                  <span className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Status indicator */}
                  {isKryv && (
                    <span className="inline-flex items-center gap-1.5 border border-ag-border px-2 py-0.5 font-sans font-semibold text-[9px] tracking-[0.12em] uppercase text-ag-gray-light">
                      <Lock size={7} />
                      Restricted
                    </span>
                  )}
                  {!isKryv && isNotStarted && (
                    <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[9px] tracking-[0.12em] uppercase text-ag-gray-light/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-ag-gray-light/30 inline-block" />
                      {t('notStarted')}
                    </span>
                  )}
                  {!isKryv && !isNotStarted && isLive && (
                    <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[9px] tracking-[0.12em] uppercase text-emerald-600">
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
                      </span>
                      {tStatus('live')}
                    </span>
                  )}
                  {!isKryv && !isNotStarted && !isLive && (
                    <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[9px] tracking-[0.12em] uppercase text-orange-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                      {tStatus('building')}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3
                  className={`font-sans font-bold tracking-[-0.03em] leading-none mb-2 transition-colors duration-300 ${
                    isDisabled ? 'text-ag-gray-light' : 'text-ag-black group-hover:text-ag-navy'
                  }`}
                  style={{ fontSize: 'clamp(20px,2vw,28px)' }}
                >
                  {asset.name}
                </h3>

                {/* Tagline */}
                <p className={`font-sans font-normal text-[11px] leading-relaxed mb-4 ${
                  isDisabled ? 'text-ag-gray-light/40' : 'text-ag-gray'
                }`}>
                  {asset.tagline}
                </p>

                {/* Bottom — badge + arrow */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-ag-border">
                  <span className={`font-sans font-semibold text-[9px] tracking-[0.14em] uppercase ${
                    isDisabled ? 'text-ag-gray-light/30' : 'text-ag-gray-light'
                  }`}>
                    {asset.badge}
                  </span>
                  {!isDisabled && (
                    <span className="w-6 h-6 border border-ag-border flex items-center justify-center text-ag-gray-light group-hover:border-ag-black group-hover:bg-ag-black group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                      <ArrowUpRight size={10} />
                    </span>
                  )}
                </div>
              </div>
            )

            if (isDisabled) {
              return <div key={asset.id}>{chip}</div>
            }

            return (
              <Link key={asset.id} href={href}>
                {chip}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
