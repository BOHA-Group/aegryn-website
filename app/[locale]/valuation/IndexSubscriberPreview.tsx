'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { SlidersHorizontal, Lock } from 'lucide-react'
import { INDEX_CLUSTERS, INDEX_VERTICALS, type IndexLocale } from '@/lib/indexTaxonomy'

/**
 * Aperçu illustratif de l'espace abonné du CIFSO Valuation Index : trois niveaux de lecture
 * dans un même espace (multiples de marché, score CIFSO organisationnel, valorisation
 * ajustée), inspiré de l'ergonomie des bases de comparables boursiers (onglets + filtres +
 * tableau) mais contextualisé au modèle Aegryn : jamais de société ou de transaction nommée,
 * uniquement des benchmarks agrégés par industrie, vertical et grade CIFSO. Purement
 * illustratif : aucune de ces valeurs n'est réelle.
 */

/* Onglet 1 — Multiples de marché : une ligne par cluster, sur un vertical représentatif. */
const MARKET_ROWS: { verticalKey: string; evRevenue: [number, number, number]; evEbitda: number | null; arr: number | null; score: number; sample: number }[] = [
  { verticalKey: 'saas_vertical',    evRevenue: [4.2, 6.1, 8.9], evEbitda: 11.4, arr: 5.8, score: 74, sample: 38 },
  { verticalKey: 'fintech',          evRevenue: [3.1, 4.8, 7.0], evEbitda: 9.2,  arr: 4.9, score: 71, sample: 22 },
  { verticalKey: 'healthtech',       evRevenue: [3.8, 5.5, 7.8], evEbitda: 10.1, arr: 5.2, score: 69, sample: 17 },
  { verticalKey: 'energy_climate',   evRevenue: [2.4, 3.6, 5.1], evEbitda: 7.8,  arr: null, score: 66, sample: 14 },
  { verticalKey: 'ecommerce_retail', evRevenue: [2.0, 3.0, 4.4], evEbitda: 6.9,  arr: 3.1, score: 62, sample: 26 },
]

/* Onglet 2 — Score CIFSO organisationnel : une ligne par dimension C/I/F/S/O. */
const CIFSO_ROWS: { letter: string; label: string; medianScore: number; uplift: number; n: number }[] = [
  { letter: 'C', label: 'Code & Architecture',            medianScore: 68, uplift: 34, n: 41 },
  { letter: 'I', label: 'IP & Droits',                    medianScore: 61, uplift: 28, n: 41 },
  { letter: 'F', label: 'Finances & Métriques',           medianScore: 72, uplift: 41, n: 41 },
  { letter: 'S', label: 'Sécurité & Souveraineté',        medianScore: 58, uplift: 22, n: 41 },
  { letter: 'O', label: 'Organisation & Talent',          medianScore: 64, uplift: 30, n: 41 },
]

/* Onglet 3 — Valorisation ajustée : une ligne par cluster, multiple médian marché vs ajusté au grade. */
const VALUATION_ROWS: { clusterKey: string; grade: string; marketMultiple: number; adjustedMultiple: number }[] = [
  { clusterKey: 'tech_innovation',   grade: 'AAA', marketMultiple: 6.1, adjustedMultiple: 7.4 },
  { clusterKey: 'finance_capital',   grade: 'AA',  marketMultiple: 4.8, adjustedMultiple: 5.3 },
  { clusterKey: 'sante_sciences',    grade: 'AAA', marketMultiple: 5.5, adjustedMultiple: 6.6 },
  { clusterKey: 'industrie_infra',   grade: 'A',   marketMultiple: 3.6, adjustedMultiple: 3.2 },
  { clusterKey: 'commerce_services', grade: 'AA',  marketMultiple: 3.0, adjustedMultiple: 3.3 },
]

export default function IndexSubscriberPreview() {
  const t      = useTranslations('valuation.freemium.subscriberPreview')
  const locale = (useLocale() as IndexLocale) ?? 'fr'
  const tabs         = t.raw('tabs') as string[]
  const tabsSubtitle = t.raw('tabsSubtitle') as string[]
  const filters      = t.raw('filters') as string[]
  const columnsMarket    = t.raw('columnsMarket') as string[]
  const columnsCifso     = t.raw('columnsCifso') as string[]
  const columnsValuation = t.raw('columnsValuation') as string[]

  const [active, setActive] = useState(0)

  const marketRows = MARKET_ROWS.map(r => {
    const v = INDEX_VERTICALS.find(x => x.key === r.verticalKey)!
    const c = INDEX_CLUSTERS.find(x => x.key === v.cluster)!
    return { ...r, verticalLabel: v.label[locale], clusterLabel: c.label[locale] }
  })
  const valuationRows = VALUATION_ROWS.map(r => ({ ...r, clusterLabel: INDEX_CLUSTERS.find(c => c.key === r.clusterKey)!.label[locale] }))

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
            <button
              key={tab}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 transition-colors ${i === active ? 'bg-ag-apex text-ag-navy font-semibold' : 'bg-white/5 text-white/50 border border-white/10 hover:text-white/80'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {tabsSubtitle[active] && (
          <p className="font-sans text-[11px] text-white/40 leading-relaxed px-4 pt-3 max-w-3xl">{tabsSubtitle[active]}</p>
        )}

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

          {/* Tableau : shape dépendant de l'onglet actif */}
          <div className="overflow-x-auto">
            {active === 0 && (
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    {columnsMarket.map(col => <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {marketRows.map(r => (
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
            )}

            {active === 1 && (
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    {columnsCifso.map(col => <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {CIFSO_ROWS.map(r => (
                    <tr key={r.letter} className="border-b border-white/5">
                      <td className="px-4 py-3">
                        <p className="font-sans text-[12px] font-semibold text-white">{r.letter} — {r.label}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-ag-apex font-semibold">{r.medianScore}/100</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-white/70">+{r.uplift}%</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-white/40">n={r.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {active === 2 && (
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    {columnsValuation.map(col => <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {valuationRows.map(r => {
                    const delta = Math.round(((r.adjustedMultiple / r.marketMultiple) - 1) * 100)
                    return (
                      <tr key={r.clusterKey} className="border-b border-white/5">
                        <td className="px-4 py-3"><p className="font-sans text-[12px] font-semibold text-white">{r.clusterLabel}</p></td>
                        <td className="px-4 py-3 font-mono text-[11px] text-white/70">{r.grade}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-white/70">{r.marketMultiple}x</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-ag-apex font-semibold">{r.adjustedMultiple}x</td>
                        <td className={`px-4 py-3 font-mono text-[11px] ${delta >= 0 ? 'text-ag-apex' : 'text-white/50'}`}>{delta >= 0 ? '+' : ''}{delta}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
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
