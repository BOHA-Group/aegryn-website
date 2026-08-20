'use client'

import { useEffect, useRef }  from 'react'
import Link                    from 'next/link'
import { ArrowUpRight }        from 'lucide-react'
import { useTranslations }     from 'next-intl'
import { gsap, SplitText }     from '@/lib/gsap'
import { Aegryn_ASSETS }       from '@/data/assets'

const NOT_STARTED_IDS = ['movtoo', 'primiom', 'hobconnect']

const GRADE_BADGE: Record<string, string> = {
  star:    'bg-ag-grade-star text-ag-navy',
  aaa:     'bg-ag-grade-aaa text-white',
  aa:      'bg-ag-grade-aa text-white',
  a:       'bg-ag-grade-a text-white',
  b:       'bg-ag-grade-b text-white',
  refused: 'bg-ag-grade-refused text-white',
  pending: 'bg-ag-border text-ag-gray',
}

const GRADE_LABEL: Record<string, string> = {
  star: '★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B', refused: '✕', pending: '—',
}

export function AssetGrid() {
  const t       = useTranslations('assetGrid')
  const tStatus = useTranslations('build.status')
  const tItems  = useTranslations('assets.items')
  const wrapRef    = useRef<HTMLDivElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)

  const visibleAssets = Aegryn_ASSETS.filter((a) => a.showOnHomepage !== false)
  const tier1 = visibleAssets.filter((a) => a.tier === 1)
  const tier2 = visibleAssets.filter((a) => a.tier === 2)

  useEffect(() => {
    const h2 = h2Ref.current
    if (!h2) return

    const split = new SplitText(h2, { type: 'lines', linesClass: 'ag-line-inner' })

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, scrollTrigger: { trigger: headerRef.current, start: 'top 82%', once: true } },
        )
      }
      gsap.fromTo(split.lines,
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', scrollTrigger: { trigger: headerRef.current, start: 'top 80%', once: true } },
      )
      visibleAssets.forEach((_asset, i) => {
        gsap.fromTo(`.asset-row-${i}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', delay: (i % 3) * 0.05,
            scrollTrigger: { trigger: wrapRef.current, start: 'top 85%', once: true } },
        )
      })
    }, wrapRef)

    return () => { split.revert(); ctx.revert() }
  }, [])

  const AssetCard = ({ asset, i }: { asset: typeof Aegryn_ASSETS[0]; i: number }) => {
    const isNotStarted = NOT_STARTED_IDS.includes(asset.id)
    const isLive       = asset.status === 'live'
    const borderRight   = i % 3 !== 2 ? 'lg:border-r border-ag-border' : ''
    const borderRightSm = i % 2 !== 1 ? 'sm:border-r border-ag-border' : ''
    return (
      <Link key={asset.id} href="/what-we-build">
        <div
          className={`asset-row-${i} group relative flex flex-col items-center justify-between
            text-center p-8 transition-all duration-500 cursor-pointer
            bg-ag-white hover:bg-ag-navy border-b border-ag-border
            ${borderRight} ${borderRightSm}`}
          style={{ minHeight: '200px', opacity: 0 }}
        >
          <div className="w-full flex items-center justify-between mb-6">
            <span className="font-sans font-semibold text-[10px] tracking-[0.18em] uppercase text-ag-gray-light group-hover:text-white/50 transition-colors duration-500">
              {tItems(`${asset.id}.badge`)}
            </span>
            <span className={`inline-flex items-center justify-center w-7 h-7 font-sans font-bold text-[11px] transition-opacity duration-500 ${GRADE_BADGE[asset.grade]}`}>
              {GRADE_LABEL[asset.grade]}
            </span>
          </div>

          {isNotStarted && (
            <span className="font-sans font-semibold text-[9px] tracking-[0.1em] uppercase text-ag-gray-light/60 group-hover:text-white/40 transition-colors duration-500 mb-1">
              {t('notStarted')}
            </span>
          )}
          {!isNotStarted && isLive && (
            <span className="inline-flex items-center gap-1 font-sans font-semibold text-[9px] tracking-[0.1em] uppercase text-emerald-500 group-hover:text-emerald-300 transition-colors duration-500 mb-1">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
              </span>
              {tStatus('live')}
            </span>
          )}
          {!isNotStarted && !isLive && (
            <span className="inline-flex items-center gap-1 font-sans font-semibold text-[9px] tracking-[0.1em] uppercase text-orange-400 group-hover:text-orange-300 transition-colors duration-500 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
              {tStatus('building')}
            </span>
          )}

          <h3
            className="font-sans font-bold tracking-[-0.03em] leading-[1.0] mb-3 text-ag-black group-hover:text-white transition-colors duration-500"
            style={{ fontSize: 'clamp(22px,2.2vw,32px)' }}
          >
            {asset.name}
          </h3>
          <p className="font-sans font-normal text-[12px] leading-relaxed text-ag-gray group-hover:text-white/70 transition-colors duration-500">
            {tItems(`${asset.id}.tagline`)}
          </p>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <ArrowUpRight size={14} className="text-white/60" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <section className="bg-ag-white border-t border-ag-border">
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-14">
        <p ref={labelRef} className="font-sans font-semibold text-[11px] tracking-[0.24em] uppercase text-ag-gray-light mb-6">
          {t('sectionLabel')}
        </p>
        <h2
          ref={h2Ref}
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2] overflow-hidden"
          style={{ fontSize: 'clamp(42px,5.5vw,80px)' }}
          dangerouslySetInnerHTML={{ __html: t('sectionTitle').replace(/\n/g, '<br>') }}
        />
      </div>

      <div ref={wrapRef} className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        {/* Tier 1 */}
        <p className="font-sans font-semibold text-[10px] tracking-[0.24em] uppercase text-ag-apex mb-4">
          {t('tier1Label')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-ag-border mb-10">
          {tier1.map((asset, i) => <AssetCard key={asset.id} asset={asset} i={i} />)}
        </div>

        {/* Tier 2 */}
        <p className="font-sans font-semibold text-[10px] tracking-[0.24em] uppercase text-ag-gray-light mb-4">
          {t('tier2Label')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-ag-border mb-10">
          {tier2.map((asset, i) => <AssetCard key={asset.id} asset={asset} i={tier1.length + i} />)}
        </div>

        {/* CTA */}
        <div className="border-t border-ag-border pt-8 flex items-center justify-end">
          <Link
            href="/transact/how-to-sell"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-6 py-3 hover:bg-ag-black hover:text-white hover:border-ag-black transition-all duration-300"
          >
            {t('cta')} <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}
