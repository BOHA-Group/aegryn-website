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
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-14">
        <p ref={labelRef} className="font-sans font-semibold text-[11px] tracking-[0.24em] uppercase text-ag-gray-light mb-6">
          {t('sectionLabel')}
        </p>
        <h2
          ref={h2Ref}
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.0] whitespace-pre-line overflow-hidden"
          style={{ fontSize: 'clamp(42px,5.5vw,80px)' }}
        >
          {t('sectionTitle')}
        </h2>
      </div>

      {/* Grille hexa-style — bordures nettes, pas de divide pour contrôle précis */}
      <div ref={wrapRef} className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-ag-border">
          {AEGRYN_ASSETS.map((asset, i) => {
            const isKryv       = asset.id === KRYV_ID
            const isNotStarted = NOT_STARTED_IDS.includes(asset.id)
            const isLive       = asset.status === 'live'
            const isFeatured   = asset.featured && !isKryv && !isNotStarted
            const isDisabled   = isKryv || isNotStarted
            const href         = '/what-we-build'

            /* Bordure droite sur les deux premières colonnes */
            const borderRight = i % 3 !== 2 ? 'lg:border-r border-ag-border' : ''
            /* Bordure droite sur colonne 1 (tablette 2 col) */
            const borderRightSm = i % 2 !== 1 ? 'sm:border-r border-ag-border' : ''
            /* Bordure basse sur toutes les lignes sauf la dernière */
            const borderBottom = i < AEGRYN_ASSETS.length - (AEGRYN_ASSETS.length % 3 || 3)
              ? 'border-b border-ag-border'
              : ''

            const chip = (
              <div
                className={`asset-row-${i} group relative flex flex-col items-center justify-between
                  text-center p-8 transition-all duration-300
                  ${borderRight} ${borderRightSm} ${borderBottom}
                  ${isFeatured
                    ? 'bg-ag-navy cursor-pointer'
                    : isDisabled
                      ? 'bg-ag-white cursor-default'
                      : 'bg-ag-white cursor-pointer hover:bg-ag-off-white'
                  }`}
                style={{ minHeight: '200px' }}
              >
                {/* Top — badge catégorie */}
                <div className="w-full flex items-center justify-between mb-6">
                  <span className={`font-sans font-semibold text-[10px] tracking-[0.18em] uppercase ${
                    isFeatured ? 'text-white/50' : isDisabled ? 'text-ag-gray-light/30' : 'text-ag-gray-light'
                  }`}>
                    {asset.badge}
                  </span>

                  {/* Status */}
                  {isKryv && (
                    <span className="inline-flex items-center gap-1 font-sans font-semibold text-[9px] tracking-[0.1em] uppercase text-ag-gray-light/50">
                      <Lock size={7} /> Restricted
                    </span>
                  )}
                  {!isKryv && isNotStarted && (
                    <span className="font-sans font-semibold text-[9px] tracking-[0.1em] uppercase text-ag-gray-light/40">
                      {t('notStarted')}
                    </span>
                  )}
                  {!isKryv && !isNotStarted && isLive && (
                    <span className="inline-flex items-center gap-1 font-sans font-semibold text-[9px] tracking-[0.1em] uppercase text-emerald-500">
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
                      </span>
                      {tStatus('live')}
                    </span>
                  )}
                  {!isKryv && !isNotStarted && !isLive && (
                    <span className="inline-flex items-center gap-1 font-sans font-semibold text-[9px] tracking-[0.1em] uppercase text-orange-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                      {tStatus('building')}
                    </span>
                  )}
                </div>

                {/* Centre — nom */}
                <h3
                  className={`font-sans font-bold tracking-[-0.03em] leading-[1.0] mb-3 transition-colors duration-300 ${
                    isFeatured
                      ? 'text-white'
                      : isDisabled
                        ? 'text-ag-gray-light/50'
                        : 'text-ag-black group-hover:text-ag-navy'
                  }`}
                  style={{ fontSize: 'clamp(22px,2.2vw,32px)' }}
                >
                  {asset.name}
                </h3>

                {/* Tagline */}
                <p className={`font-sans font-normal text-[12px] leading-relaxed ${
                  isFeatured ? 'text-white/70' : isDisabled ? 'text-ag-gray-light/30' : 'text-ag-gray'
                }`}>
                  {asset.tagline}
                </p>

                {/* Flèche featured */}
                {isFeatured && (
                  <div className="mt-6">
                    <ArrowUpRight size={16} className="text-white/70" />
                  </div>
                )}
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
