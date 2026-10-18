'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { Aegryn_ASSETS, type AegrynAsset } from '@/data/assets'
import { ProjectCard } from '@/components/sections/assets/ProjectCard'
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
  const th = useTranslations('harmony')
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

  return (
    <section className="bg-ag-white border-t border-ag-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Filter bar */}
        <div className="flex items-center flex-wrap gap-3 mb-12 pb-6">
          <FilterPills options={filters} active={active} onChange={setActive} />
          <span className="ml-auto font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
            {th('projectCount', { count: filtered.length })}
          </span>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map((asset) => (
            <ProjectCard key={asset.id} asset={asset} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
          </div>
        </div>
      </div>
    </section>
  )
}
