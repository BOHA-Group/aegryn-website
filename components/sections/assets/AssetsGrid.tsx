'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { Aegryn_ASSETS } from '@/data/assets'
import { FilterPills } from '@/components/ui/FilterPills'

type Category = 'all' | 'ai' | 'lifestyle' | 'transactions'

export function AssetsGrid({ excludeIds = [] }: { excludeIds?: string[] } = {}) {
  const t = useTranslations('assets.page')
  const tStatus = useTranslations('assetStatus')
  const tItems = useTranslations('assets.items')
  const [active, setActive] = useState<Category>('all')
  const gridRef = useRef<HTMLDivElement>(null)

  const visibleAssets = excludeIds.length > 0
    ? Aegryn_ASSETS.filter((a) => !excludeIds.includes(a.id))
    : Aegryn_ASSETS

  const filtered = active === 'all'
    ? visibleAssets
    : visibleAssets.filter((a) => a.category === active)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.asset-card', {
        opacity: 0, y: 24, stagger: 0.08,
        ease: 'expo.out', duration: 0.6,
      })
    }, gridRef)
    return () => ctx.revert()
  }, [active])

  const filters: { key: Category; label: string }[] = [
    { key: 'all',          label: t('filterAll') },
    { key: 'lifestyle',    label: t('filterLifestyle') },
    { key: 'transactions', label: t('filterTransactions') },
  ]

  /* Badges d'avancement masqués pour les statuts internes (dev / non démarré) */
  const statusLabel = (status: string) => {
    if (status === 'live')        return tStatus('live')
    if (status === 'beta')        return tStatus('beta')
    if (status === 'refused')     return tStatus('refused')
    return null
  }

  const statusColor = (status: string) => {
    if (status === 'live')  return 'text-ag-live'
    if (status === 'beta')  return 'text-ag-beta'
    return 'text-ag-gray'
  }

  return (
    <section className="bg-ag-white border-t border-ag-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Filter bar */}
        <div className="flex items-center flex-wrap gap-3 mb-12 border-b border-ag-border pb-6">
          <FilterPills options={filters} active={active} onChange={setActive} />
          <span className="ml-auto font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
            {filtered.length} actif{filtered.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="asset-card bg-ag-white rounded-2xl border border-ag-border overflow-hidden flex flex-col group hover:bg-ag-off-white transition-colors"
            >
              {/* Image illustrative */}
              {asset.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={asset.image}
                    alt={tItems(`${asset.id}.tagline`)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                  />
                </div>
              )}
              <div className="p-8 flex flex-col gap-5 flex-1">
              {/* Titre : nom public, sinon tagline descriptive */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-snug">
                    {asset.namePublic ? asset.name : tItems(`${asset.id}.tagline`)}
                  </h2>
                  {asset.namePublic && (
                    <p className="font-sans text-[13px] text-ag-gray leading-snug">
                      {tItems(`${asset.id}.tagline`)}
                    </p>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-ag-gray border border-ag-border px-2 py-1 rounded-md">
                  {tItems(`${asset.id}.badge`)}
                </span>
                {statusLabel(asset.status) && (
                  <span className={`font-mono text-[10px] tracking-[0.12em] uppercase ${statusColor(asset.status)}`}>
                    {statusLabel(asset.status)}
                  </span>
                )}
                {asset.internalOnly && (
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ag-gray-light border border-ag-border px-2 py-0.5 rounded-md">
                    {t('internalOnly')}
                  </span>
                )}

              </div>

              {/* Description */}
              <p className="font-sans text-[15px] text-ag-gray leading-relaxed flex-1">
                {tItems(`${asset.id}.description`)}
              </p>

              {/* Actions — révélées au survol */}
              <div className="flex items-center gap-4 pt-2 border-t border-ag-border opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {asset.internalOnly ? (
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light cursor-default select-none flex items-center gap-1">
                    {t('confidential')}
                  </span>
                ) : (
                  <Link
                    href={`/assets/${asset.slug}` as never}
                    className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-black hover:text-ag-apex-ink transition-colors flex items-center gap-1"
                  >
                    {t('viewDetails')} <ArrowUpRight size={11} />
                  </Link>
                )}
                {asset.url && (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray hover:text-ag-black transition-colors flex items-center gap-1"
                  >
                    {t('visitSite')} <ExternalLink size={11} />
                  </a>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-10 border-t border-ag-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="font-sans text-[15px] text-ag-gray max-w-md">
            {t('ctaBottom')}
          </p>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/grade/submit"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy-mid transition-colors"
            >
              {t('ctaGrade')} <ArrowUpRight size={11} />
            </Link>
            <Link
              href={{ pathname: '/', hash: 'franchir' }}
              className="rounded-lg inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-ag-black hover:text-ag-black transition-all"
            >
              {t('ctaTransaction')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
