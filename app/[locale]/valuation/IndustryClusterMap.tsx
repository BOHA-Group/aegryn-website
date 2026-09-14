'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { INDEX_CLUSTERS, type IndexLocale } from '@/lib/indexTaxonomy'
import { clustersByIndustry, verticalsByCluster } from '@/lib/industryClusters'
import type { ClusterKey } from '@/lib/cifsoValuation'

/**
 * Cartographie étendue de l'Index : 5 industries -> 22 clusters (identiques aux pages
 * /industries) -> 200+ verticaux tech-driven. Accordéon pour rester lisible malgré le volume.
 * Les verticaux ne portent pas (encore) de série de multiples dédiée : cartographie de
 * couverture, distincte des multiples réels affichés dans la section précédente.
 */
export default function IndustryClusterMap() {
  const t      = useTranslations('valuation.index')
  const locale = (useLocale() as IndexLocale) ?? 'fr'
  const [openIndustry, setOpenIndustry] = useState<ClusterKey | null>(null)
  const [openCluster,  setOpenCluster]  = useState<string | null>(null)

  return (
    <div className="mt-14">
      <h3 className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1] mb-3" style={{ fontSize: 'clamp(20px,2.4vw,30px)' }}>
        {t('extMapTitle')}
      </h3>
      <p className="font-sans text-[13px] text-ag-gray leading-relaxed max-w-2xl mb-3">{t('extMapDesc')}</p>
      <p className="font-sans text-[12px] text-ag-gray-light italic mb-6">{t('englishOnlyNote')}</p>

      <div className="flex flex-col gap-2">
        {INDEX_CLUSTERS.map(industry => {
          const clusters = clustersByIndustry(industry.key)
          const totalVerticals = clusters.reduce((sum, c) => sum + verticalsByCluster(c.key).length, 0)
          const isOpen = openIndustry === industry.key
          return (
            <div key={industry.key} className="rounded-xl border border-ag-border overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndustry(isOpen ? null : industry.key)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-ag-off-white hover:bg-ag-border/30 transition-colors text-left"
              >
                <span className="font-sans font-bold text-ag-black text-[14px]">{industry.label[locale]}</span>
                <span className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[10px] text-ag-gray-light">
                    {clusters.length} {t('clustersLabel')} · {totalVerticals} {t('techVerticalsLabel')}
                  </span>
                  <ChevronDown size={14} className={`text-ag-gray transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 py-4 flex flex-col gap-2 bg-white">
                  {clusters.map(cluster => {
                    const verticals = verticalsByCluster(cluster.key)
                    const clusterOpen = openCluster === cluster.key
                    return (
                      <div key={cluster.key} className="rounded-lg border border-ag-border">
                        <button
                          type="button"
                          onClick={() => setOpenCluster(clusterOpen ? null : cluster.key)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ag-off-white transition-colors"
                        >
                          <span className="font-sans font-semibold text-ag-black text-[13px]">{cluster.label[locale]}</span>
                          <span className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-[9px] text-ag-gray-light">{verticals.length} {t('techVerticalsLabel')}</span>
                            <ChevronDown size={12} className={`text-ag-gray-light transition-transform ${clusterOpen ? 'rotate-180' : ''}`} />
                          </span>
                        </button>
                        {clusterOpen && (
                          <div className="px-4 pb-4 flex flex-wrap gap-2">
                            {verticals.map(v => (
                              <span key={v.key} className="rounded-full border border-ag-border bg-ag-off-white px-3 py-1 font-sans text-[11px] text-ag-black">
                                {v.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
