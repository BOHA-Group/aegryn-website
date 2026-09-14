'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Lock, SlidersHorizontal, ArrowUpRight, MapPin } from 'lucide-react'
import type { IndexSnapshot } from '@/lib/cifsoIndex'
import { INDEX_CLUSTERS, INDEX_VERTICALS, type IndexLocale } from '@/lib/indexTaxonomy'
import type { ClusterKey } from '@/lib/cifsoValuation'
import WaitlistForm from './WaitlistForm'

/**
 * Étape 2 du parcours /valuation/index : vue Index réelle mais partiellement floutée
 * (mêmes données que /valuation, jamais plus), avec filtres fonctionnels (industrie,
 * vertical) et mise en évidence de la position de l'utilisateur (industrie/grade calculés
 * à l'étape 1). CTA vert pour rejoindre la liste d'attente de l'abonnement complet.
 */
type UserPosition = { industry: ClusterKey; vertical?: string; grade: string; score: number }

function Blurred({ children, locked }: { children: React.ReactNode; locked: boolean }) {
  if (!locked) return <>{children}</>
  return <span className="blur-[5px] select-none pointer-events-none">{children}</span>
}

export default function IndexTestView({ user }: { user: UserPosition }) {
  const t      = useTranslations('valuation.indexTest')
  const locale = (useLocale() as IndexLocale) ?? 'fr'

  const [snap, setSnap] = useState<IndexSnapshot | null>(null)
  const [tab, setTab] = useState(0)
  const [filterIndustry, setFilterIndustry] = useState<ClusterKey>(user.industry)
  const [filterVertical, setFilterVertical] = useState<string>(user.vertical ?? 'all')

  useEffect(() => {
    fetch(`/api/valuation/index?locale=${locale}`).then(r => r.ok ? r.json() : null).then(setSnap).catch(() => setSnap(null))
  }, [locale])

  const tabs = t.raw('tabs') as string[]
  const tabsSubtitle = t.raw('tabsSubtitle') as string[]

  const verticalsForFilter = useMemo(() => INDEX_VERTICALS.filter(v => v.cluster === filterIndustry), [filterIndustry])

  const clusters = snap?.clusters ?? []
  const displayedClusters = clusters.filter(c => c.key === filterIndustry)
  const displayedCluster = displayedClusters[0]
  const displayedVertical = displayedCluster?.verticals.find(v => v.key === filterVertical)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-2 px-5 pt-5 flex-wrap">
        {tabs.map((tab_, i) => (
          <button
            key={tab_}
            type="button"
            onClick={() => setTab(i)}
            className={`rounded-full font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 transition-colors ${i === tab ? 'bg-ag-apex text-ag-navy font-semibold' : 'bg-white/5 text-white/50 border border-white/10 hover:text-white/80'}`}
          >
            {tab_}
          </button>
        ))}
      </div>
      {tabsSubtitle[tab] && <p className="font-sans text-[11px] text-white/40 leading-relaxed px-5 pt-3 max-w-3xl">{tabsSubtitle[tab]}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-0 mt-4">
        {/* Filtres réels */}
        <div className="border-t lg:border-t-0 lg:border-r border-white/10 px-5 py-4 flex flex-col gap-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
            <SlidersHorizontal size={10} /> {t('filtersLabel')}
          </p>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-2">{t('filterIndustry')}</p>
            <div className="flex flex-col gap-1.5">
              {INDEX_CLUSTERS.map(c => (
                <button key={c.key} type="button"
                  onClick={() => { setFilterIndustry(c.key); setFilterVertical('all') }}
                  className={`text-left rounded-lg px-3 py-2 font-sans text-[11px] transition-colors flex items-center gap-1.5 ${filterIndustry === c.key ? 'bg-ag-apex/15 border border-ag-apex/40 text-ag-apex font-semibold' : 'border border-white/10 text-white/70 hover:border-white/30'}`}>
                  {c.key === user.industry && <MapPin size={10} className="shrink-0" />}
                  {c.label[locale]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-2">{t('filterVertical')}</p>
            <select value={filterVertical} onChange={e => setFilterVertical(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 text-white/80 font-sans text-[11px] px-3 py-2 focus:outline-none focus:border-ag-apex/50">
              <option value="all">{t('filterAll')}</option>
              {verticalsForFilter.map(v => <option key={v.key} value={v.key}>{v.label[locale]}</option>)}
            </select>
          </div>
        </div>

        {/* Tableau selon l'onglet */}
        <div className="overflow-x-auto px-1 py-4">
          {!snap && (
            <div className="flex flex-col gap-2 px-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />)}
            </div>
          )}

          {snap && tab === 0 && displayedCluster && (
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {(t.raw('columnsMarket') as string[]).map(col => <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b border-white/5 ${filterIndustry === user.industry && filterVertical === 'all' ? 'bg-ag-apex/10' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-sans text-[12px] font-semibold text-white flex items-center gap-1.5">
                      {filterIndustry === user.industry && <span className="font-mono text-[8px] uppercase tracking-wide text-ag-apex border border-ag-apex/40 rounded-full px-2 py-0.5">{t('youAreHere')}</span>}
                      {displayedVertical ? displayedVertical.label : displayedCluster.label}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-white/70 whitespace-nowrap">
                    <Blurred locked={displayedVertical ? (displayedVertical.arrMultiple?.locked ?? true) : displayedCluster.evRevenue.locked}>
                      {displayedVertical
                        ? (displayedVertical.arrMultiple ? `${displayedVertical.arrMultiple.p25}x · ${displayedVertical.arrMultiple.p50}x · ${displayedVertical.arrMultiple.p75}x` : '—')
                        : `${displayedCluster.evRevenue.p25 ?? '••'}x · ${displayedCluster.evRevenue.p50 ?? '••'}x · ${displayedCluster.evRevenue.p75 ?? '••'}x`}
                    </Blurred>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-white/70">
                    <Blurred locked={displayedCluster.evEbitda.locked}>{displayedCluster.evEbitda.p50 ?? '••'}x</Blurred>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-white/40">
                    n={displayedVertical ? (displayedVertical.arrMultiple?.sampleSize ?? '—') : (displayedCluster.evRevenue.sampleSize ?? '—')}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {snap && tab === 1 && (
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {(t.raw('columnsCifso') as string[]).map(col => <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {snap.dimensions.map(d => (
                  <tr key={d.key} className="border-b border-white/5">
                    <td className="px-4 py-3"><p className="font-sans text-[12px] font-semibold text-white">{d.letter} — {d.label}</p></td>
                    <td className="px-4 py-3 font-mono text-[11px] text-ag-apex font-semibold"><Blurred locked={d.locked}>{d.medianScore ?? '••'}/100</Blurred></td>
                    <td className="px-4 py-3 font-mono text-[11px] text-white/70"><Blurred locked={d.locked}>{d.upliftPct != null ? `+${d.upliftPct}%` : '••%'}</Blurred></td>
                    <td className="px-4 py-3 font-mono text-[11px] text-white/40">n={d.sampleSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {snap && tab === 2 && displayedCluster && (
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {(t.raw('columnsValuation') as string[]).map(col => <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b border-white/5 ${filterIndustry === user.industry ? 'bg-ag-apex/10' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-sans text-[12px] font-semibold text-white flex items-center gap-1.5">
                      {filterIndustry === user.industry && <span className="font-mono text-[8px] uppercase tracking-wide text-ag-apex border border-ag-apex/40 rounded-full px-2 py-0.5">{user.grade}</span>}
                      {displayedCluster.label}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-white/70"><Blurred locked={displayedCluster.evRevenue.locked}>{displayedCluster.evRevenue.p50 ?? '••'}x</Blurred></td>
                  <td className="px-4 py-3 font-mono text-[11px] text-ag-apex font-semibold">
                    <Blurred locked={displayedCluster.coeff.locked}>
                      {displayedCluster.coeff.score60 ?? '••'}x
                    </Blurred>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-white/40">
                    <Blurred locked={displayedCluster.coeff.locked}>
                      {displayedCluster.coeff.score40 ?? '••'}x — {displayedCluster.coeff.score80 ?? '••'}x
                    </Blurred>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CTA vert — liste d'attente abonnement complet */}
      <div className="border-t border-white/10 px-5 py-6 bg-white/[0.02]">
        <div className="flex items-start gap-3 mb-4">
          <Lock size={14} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-sans font-bold text-white text-[13px] mb-1">{t('unlockTitle')}</p>
            <p className="font-sans text-[12px] text-white/50 leading-relaxed">{t('unlockDesc')}</p>
          </div>
        </div>
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-emerald-400 mb-3 flex items-center gap-1.5">
          {t('waitlistCta')} <ArrowUpRight size={11} />
        </p>
        <WaitlistForm variant="green" />
      </div>
    </div>
  )
}
