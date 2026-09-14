'use client'

import { useTranslations, useLocale } from 'next-intl'
import { SlidersHorizontal, Lock } from 'lucide-react'
import { INDEX_CLUSTERS, INDEX_VERTICALS, type IndexLocale } from '@/lib/indexTaxonomy'

/**
 * Aperçu illustratif de l'espace abonné du CIFSO Valuation Index — inspiré de l'ergonomie
 * des bases de comparables boursiers (filtres + tableau), mais contextualisé au modèle Aegryn :
 * pas de société nommée, uniquement des benchmarks agrégés par industrie et vertical, jamais
 * de transaction identifiable. Purement illustratif : aucune de ces valeurs n'est réelle.
 */

/* Une ligne par cluster, sur un vertical représentatif déjà présent dans la taxonomie. */
const PREVIEW_ROWS: { verticalKey: string; evRevenue: [number, number, number]; evEbitda: number | null; arr: number | null; score: number; sample: number }[] = [
  { verticalKey: 'saas_vertical',    evRevenue: [4.2, 6.1, 8.9], evEbitda: 11.4, arr: 5.8, score: 74, sample: 38 },
  { verticalKey: 'fintech',          evRevenue: [3.1, 4.8, 7.0], evEbitda: 9.2,  arr: 4.9, score: 71, sample: 22 },
  { verticalKey: 'healthtech',       evRevenue: [3.8, 5.5, 7.8], evEbitda: 10.1, arr: 5.2, score: 69, sample: 17 },
  { verticalKey: 'energy_climate',   evRevenue: [2.4, 3.6, 5.1], evEbitda: 7.8,  arr: null, score: 66, sample: 14 },
  { verticalKey: 'ecommerce_retail', evRevenue: [2.0, 3.0, 4.4], evEbitda: 6.9,  arr: 3.1, score: 62, sample: 26 },
]

export default function IndexSubscriberPreview() {
  const t      = useTranslations('valuation.freemium.subscriberPreview')
  const locale = (useLocale() as IndexLocale) ?? 'fr'
  const tabs    = t.raw('tabs') as string[]
  const filters = t.raw('filters') as string[]
  const columns = t.raw('columns') as string[]

  const rows = PREVIEW_ROWS.map(r => {
    const v = INDEX_VERTICALS.find(x => x.key === r.verticalKey)!
    const c = INDEX_CLUSTERS.find(x => x.key === v.cluster)!
    return { ...r, verticalLabel: v.label[locale], clusterLabel: c.label[locale] }
  })

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="rounded-full border border-amber-300 bg-amber-50 text-amber-800 font-mono text-[9px] uppercase tracking-widest px-3 py-1">{t('label')}</span>
      </div>
      <h3 className="font-sans font-bold text-white text-[20px] tracking-[-0.02em] mb-2">{t('title')}</h3>
      <p className="font-sans text-[13px] text-white/60 leading-relaxed max-w-2xl mb-6">{t('desc')}</p>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 pt-4 flex-wrap">
          {tabs.map((tab, i) => (
            <span key={tab} className={`rounded-full font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 ${i === 0 ? 'bg-ag-apex text-ag-navy font-semibold' : 'bg-white/5 text-white/50 border border-white/10'}`}>
              {tab}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-0 mt-4">
          {/* Filtres */}
          <div className="border-t lg:border-t-0 lg:border-r border-white/10 px-4 py-4 flex flex-col gap-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
              <SlidersHorizontal size={10} /> {t('filtersLabel')}
            </p>
            {filters.map(f => (
              <div key={f} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <p className="font-sans text-[11px] text-white/70">{f}</p>
              </div>
            ))}
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {columns.map(col => (
                    <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.verticalKey} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <p className="font-sans text-[12px] font-semibold text-white">{r.verticalLabel}</p>
                      <p className="font-mono text-[9px] uppercase tracking-wide text-white/40">{r.clusterLabel}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-white/70 whitespace-nowrap">
                      {r.evRevenue[0]}x · <strong className="text-ag-apex">{r.evRevenue[1]}x</strong> · {r.evRevenue[2]}x
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-white/70">{r.evEbitda ? `${r.evEbitda}x` : '—'}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-white/70">{r.arr ? `${r.arr}x` : '—'}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-ag-apex font-semibold">{r.score}/100</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-white/40">n={r.sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
          <Lock size={10} className="text-white/30 shrink-0" />
          <p className="font-mono text-[9px] text-white/30 leading-relaxed">{t('footnote')}</p>
        </div>
      </div>
    </div>
  )
}
