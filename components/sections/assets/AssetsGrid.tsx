'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { Aegryn_ASSETS, type AegrynAsset } from '@/data/assets'
import { INDUSTRIES, getLocaleText } from '@/data/industries'
import { FilterPills } from '@/components/ui/FilterPills'

type Category = string

/* Résout le sous-secteur /industries rattaché à un actif */
function sectorOf(asset: AegrynAsset) {
  const ref = asset.industrySector
  if (!ref) return null
  const industry = INDUSTRIES.find((i) => i.slug === ref.industry)
  return industry?.sectors[ref.sectorIndex] ?? null
}

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
    : visibleAssets.filter((a) => a.industrySector && `${a.industrySector.industry}:${a.industrySector.sectorIndex}` === active)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.asset-card', {
        opacity: 0, y: 24, stagger: 0.08,
        ease: 'expo.out', duration: 0.6,
      })
    }, gridRef)
    return () => ctx.revert()
  }, [active])

  /* Filtres = sous-secteurs /industries des actifs visibles */
  const locale = useLocale()
  const sectorKeys = Array.from(new Set(
    visibleAssets.map((a) => a.industrySector && `${a.industrySector.industry}:${a.industrySector.sectorIndex}`)
      .filter((k): k is string => !!k)
  ))
  const filters: { key: Category; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    ...sectorKeys.map((key) => {
      const asset = visibleAssets.find((a) => a.industrySector && `${a.industrySector.industry}:${a.industrySector.sectorIndex}` === key)
      const sector = asset ? sectorOf(asset) : null
      return { key, label: sector ? getLocaleText(sector.name, locale) : key }
    }),
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
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="asset-card bg-ag-white rounded-2xl border border-ag-border overflow-hidden flex flex-col group hover:bg-ag-off-white transition-colors"
            >
              {/* Image dominante cliquable + badge en haut à droite */}
              {asset.image && (
                <Link href={`/assets/${asset.slug}` as never} className="relative aspect-[4/3] overflow-hidden block">
                  <Image
                    src={asset.image}
                    alt={tItems(`${asset.id}.tagline`)}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                  />
                  <span className="absolute top-3 right-3 font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 bg-black/40 backdrop-blur-sm border border-white/15 text-white/70 rounded-md whitespace-nowrap">
                    {tItems(`${asset.id}.badge`)}
                  </span>
                </Link>
              )}
              <div className="p-5 flex flex-col gap-3 flex-1">
              {/* Titre : capacité démontrée */}
              <h2 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.02em] leading-snug">
                {tItems(`${asset.id}.capability`)}
              </h2>

              {/* Badges statut */}
              {(statusLabel(asset.status) || asset.internalOnly) && (
                <div className="flex items-center gap-3 flex-wrap">
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
              )}

              {/* Détails pliés — dépliés au survol */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                <div className="min-h-0 min-w-0 overflow-hidden">
                  <p className="font-sans font-semibold text-[13px] text-ag-dark leading-snug">
                    {tItems(`${asset.id}.tagline`)}
                    {asset.namePublic && (
                      <span className="font-normal text-ag-gray"> ({t('publicNameSuffix')} : {asset.name})</span>
                    )}
                  </p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed pt-2 pb-2">
                    {tItems(`${asset.id}.description`)}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.08em] text-ag-gray-light leading-relaxed pb-1">
                    {tItems(`${asset.id}.keywords`)}
                  </p>
                  {asset.internalOnly && (
                    <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light pt-3 border-t border-ag-border">
                      {t('confidential')}
                    </p>
                  )}
                </div>
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
              href="/contact"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy-mid transition-colors"
            >
              {t('ctaDiscuss')} <ArrowUpRight size={11} />
            </Link>
            <Link
              href={"/assets" as never}
              className="rounded-lg inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-ag-black hover:text-ag-black transition-all"
            >
              {t('ctaTools')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
