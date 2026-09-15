'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Lock, SlidersHorizontal, ArrowUpRight, MapPin } from 'lucide-react'
import type { IndexSnapshot } from '@/lib/cifsoIndex'
import { INDEX_CLUSTERS, INDEX_VERTICALS, type IndexLocale } from '@/lib/indexTaxonomy'
import type { ClusterKey } from '@/lib/cifsoValuation'
import WaitlistForm from './WaitlistForm'
import { flushContributionQueue } from '@/lib/contributeQueue'

/**
 * Étape 2 du parcours /valuation/index : vue Index réelle mais partiellement floutée
 * (mêmes données que /valuation, jamais plus), avec filtres fonctionnels (industrie,
 * vertical) et mise en évidence de la position de l'utilisateur (industrie/grade calculés
 * à l'étape 1). CTA vert pour rejoindre la liste d'attente de l'abonnement complet.
 *
 * Chaque tableau affiche systématiquement toutes les lignes disponibles (5 industries, ou
 * tous les verticaux d'une industrie) — les filtres servent à mettre en évidence une ligne,
 * pas à réduire le tableau à une seule ligne, pour donner un vrai aperçu de la richesse de
 * l'Index sans tout dévoiler.
 */
type UserPosition = { industry: ClusterKey; vertical?: string; grade: string; score: number }

function Blurred({ children, locked }: { children: React.ReactNode; locked: boolean }) {
  if (!locked) return <>{children}</>
  return <span className="blur-[5px] select-none pointer-events-none">{children}</span>
}

/** n= toujours informatif : distingue "verrouillé mais échantillon réel" de "pas encore de donnée". */
function SampleTag({ n, buildingLabel }: { n: number | null | undefined; buildingLabel: string }) {
  if (n == null) return <span className="font-mono text-[10px] text-white/30">—</span>
  if (n === 0) return <span className="font-mono text-[9px] uppercase tracking-wide text-white/30">{buildingLabel}</span>
  return <span className="font-mono text-[11px] text-white/40">n={n}</span>
}

/** Multiple ajusté = ev_revenue médian × coefficient CIFSO (le coefficient n'est PAS un multiple en soi). */
function adjustedMultiple(evP50: number | null, coeff: number | null): number | null {
  if (evP50 == null || coeff == null) return null
  return Math.round(evP50 * coeff * 100) / 100
}

export default function IndexTestView({ user }: { user: UserPosition }) {
  const t      = useTranslations('valuation.indexTest')
  const locale = (useLocale() as IndexLocale) ?? 'fr'

  const [snap, setSnap] = useState<IndexSnapshot | null>(null)
  const [tab, setTab] = useState(0)
  const [filterIndustry, setFilterIndustry] = useState<ClusterKey>(user.industry)
  const [filterVertical, setFilterVertical] = useState<string>('all')

  useEffect(() => {
    fetch(`/api/valuation/index?locale=${locale}`).then(r => r.ok ? r.json() : null).then(setSnap).catch(() => setSnap(null))
  }, [locale])

  /* Retente les contributions anonymes qui auraient échoué à l'étape 1 (échec réseau) */
  useEffect(() => { flushContributionQueue() }, [])

  const tabs = t.raw('tabs') as string[]
  const tabsSubtitle = t.raw('tabsSubtitle') as string[]
  const userIndustryLabel = INDEX_CLUSTERS.find(c => c.key === user.industry)?.label[locale] ?? user.industry
  const userVerticalLabel = user.vertical ? INDEX_VERTICALS.find(v => v.key === user.vertical)?.label[locale] : undefined

  const verticalsForFilter = useMemo(() => INDEX_VERTICALS.filter(v => v.cluster === filterIndustry), [filterIndustry])
  const clusterByKey = useMemo(() => new Map((snap?.clusters ?? []).map(c => [c.key, c])), [snap])
  const displayedCluster = clusterByKey.get(filterIndustry)
  const verticalsToShow = filterVertical === 'all' ? displayedCluster?.verticals ?? [] : (displayedCluster?.verticals ?? []).filter(v => v.key === filterVertical)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {/* Carte profil — persistante, ne se perd jamais en changeant d'onglet ou de filtre */}
      <div className="flex flex-wrap items-center gap-3 px-5 pt-5 pb-4 border-b border-white/10">
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">{t('yourProfileLabel')}</span>
        <span className="font-sans text-[12px] font-semibold text-white">{userIndustryLabel}{userVerticalLabel ? ` · ${userVerticalLabel}` : ''}</span>
        <span className="font-mono text-[11px] uppercase tracking-wide text-ag-apex-ink border border-ag-apex/40 rounded-full px-2.5 py-0.5">{user.grade}</span>
        <span className="font-mono text-[11px] text-white/50">{user.score}/100</span>
      </div>

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
        {/* Filtres réels — mettent en évidence une ligne, ne réduisent jamais le tableau à une seule */}
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
                  className={`text-left rounded-lg px-3 py-2 font-sans text-[11px] transition-colors flex items-center gap-1.5 ${filterIndustry === c.key ? 'bg-ag-apex/15 border border-ag-apex/40 text-ag-apex-ink font-semibold' : 'border border-white/10 text-white/70 hover:border-white/30'}`}>
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

        {/* Tableau selon l'onglet — toutes les lignes disponibles, jamais une seule */}
        <div className="overflow-x-auto px-1 py-4">
          {!snap && (
            <div className="flex flex-col gap-2 px-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />)}
            </div>
          )}

          {snap && tab === 0 && (
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {(t.raw('columnsMarket') as string[]).map(col => <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {filterVertical === 'all' ? (
                  snap.clusters.map(c => (
                    <MarketRow key={c.key} label={c.label} highlighted={c.key === user.industry} range={c.evRevenue} evEbitda={c.evEbitda} t={t} />
                  ))
                ) : (
                  verticalsToShow.map(v => (
                    <MarketRow key={v.key} label={v.label} highlighted={v.key === user.vertical} range={v.arrMultiple} evEbitda={null} t={t} />
                  ))
                )}
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
                    <td className="px-4 py-3 font-mono text-[11px] text-ag-apex-ink font-semibold"><Blurred locked={d.locked}>{d.medianScore ?? '••'}/100</Blurred></td>
                    <td className="px-4 py-3 font-mono text-[11px] text-white/70"><Blurred locked={d.locked}>{d.upliftPct != null ? `+${d.upliftPct}%` : '••%'}</Blurred></td>
                    <td className="px-4 py-3"><SampleTag n={d.sampleSize} buildingLabel={t('sampleBuilding')} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {snap && tab === 2 && (
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {(t.raw('columnsValuation') as string[]).map(col => <th key={col} className="font-mono text-[9px] uppercase tracking-widest text-white/40 px-4 py-3 whitespace-nowrap">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {snap.clusters.map(c => {
                  const locked = c.evRevenue.locked || c.coeff.locked
                  const adj60 = adjustedMultiple(c.evRevenue.p50, c.coeff.score60)
                  const adj40 = adjustedMultiple(c.evRevenue.p50, c.coeff.score40)
                  const adj80 = adjustedMultiple(c.evRevenue.p50, c.coeff.score80)
                  return (
                    <tr key={c.key} className={`border-b border-white/5 ${c.key === user.industry ? 'bg-ag-apex/10' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="font-sans text-[12px] font-semibold text-white flex items-center gap-1.5">
                          {c.key === user.industry && <span className="font-mono text-[8px] uppercase tracking-wide text-ag-apex-ink border border-ag-apex/40 rounded-full px-2 py-0.5">{user.grade}</span>}
                          {c.label}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-white/70"><Blurred locked={c.evRevenue.locked}>{c.evRevenue.p50 ?? '••'}x</Blurred></td>
                      <td className="px-4 py-3 font-mono text-[11px] text-ag-apex-ink font-semibold"><Blurred locked={locked}>{adj60 ?? '••'}x</Blurred></td>
                      <td className="px-4 py-3 font-mono text-[11px] text-white/40"><Blurred locked={locked}>{adj40 ?? '••'}x — {adj80 ?? '••'}x</Blurred></td>
                    </tr>
                  )
                })}
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

/* Ligne du tableau "Multiples de marché" : industrie (evRevenue+evEbitda) ou vertical (arrMultiple seul). */
function MarketRow({ label, highlighted, range, evEbitda, t }: {
  label: string; highlighted: boolean
  range: { p25: number | null; p50: number | null; p75: number | null; locked: boolean; sampleSize?: number | null } | null
  evEbitda: { p50: number | null; locked: boolean; sampleSize?: number | null } | null
  t: ReturnType<typeof useTranslations>
}) {
  if (!range) return null
  return (
    <tr className={`border-b border-white/5 ${highlighted ? 'bg-ag-apex/10' : ''}`}>
      <td className="px-4 py-3">
        <p className="font-sans text-[12px] font-semibold text-white flex items-center gap-1.5">
          {highlighted && <span className="font-mono text-[8px] uppercase tracking-wide text-ag-apex-ink border border-ag-apex/40 rounded-full px-2 py-0.5">{t('youAreHere')}</span>}
          {label}
        </p>
      </td>
      <td className="px-4 py-3 font-mono text-[11px] text-white/70 whitespace-nowrap">
        <Blurred locked={range.locked}>{range.p25 ?? '••'}x · {range.p50 ?? '••'}x · {range.p75 ?? '••'}x</Blurred>
      </td>
      <td className="px-4 py-3 font-mono text-[11px] text-white/70">
        {evEbitda ? <Blurred locked={evEbitda.locked}>{evEbitda.p50 ?? '••'}x</Blurred> : <span className="text-white/30">—</span>}
      </td>
      <td className="px-4 py-3"><SampleTag n={range.sampleSize} buildingLabel={t('sampleBuilding')} /></td>
    </tr>
  )
}
