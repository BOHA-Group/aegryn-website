'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Lock, ChevronDown, Check } from 'lucide-react'
import type { IndexSnapshot, IndexCluster } from '@/lib/cifsoIndex'
import { INDEX_METRICS, INDEX_CLUSTER_SLUGS } from '@/lib/indexTaxonomy'
import IndustryClusterMap from './IndustryClusterMap'

/**
 * Visuels du moteur de benchmarks du CIFSO Valuation Index (mode aperçu) :
 * chiffres clés, barres de multiples par cluster, couverture par vertical,
 * métriques couvertes et questions fréquentes. Source affichée : Aegryn CIFSO Valuation Index.
 */
export default function IndexBenchmarks() {
  const t      = useTranslations('valuation.index')
  const locale = useLocale()
  const [snap, setSnap] = useState<IndexSnapshot | null>(null)

  useEffect(() => {
    fetch(`/api/valuation/index?locale=${locale}`).then(r => r.ok ? r.json() : null).then(setSnap).catch(() => setSnap(null))
  }, [locale])

  const clusters = snap?.clusters ?? []
  const maxX = Math.max(6, ...clusters.map(c => c.evRevenue.p75 ?? 0)) * 1.1

  return (
    <>
      {/* ── Moteur : chiffres clés + barres ── */}
      <section className="py-24 px-6 border-t border-white/10 bg-ag-navy text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-4">{t('label')}</p>
              <h2 className="font-sans font-bold tracking-[-0.03em] leading-[1.05] mb-5 whitespace-pre-line" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{t('title')}</h2>
              <p className="font-sans text-[14px] text-white/60 leading-relaxed max-w-xl mb-8">{t('desc')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  [snap?.coverage.clusters ?? 5, t('kpis.clusters')],
                  [snap?.coverage.verticals ?? 204, t('kpis.verticals')],
                  [snap?.coverage.metrics ?? 9, t('kpis.metrics')],
                  [snap?.period ?? '·', t('kpis.period')],
                ].map(([v, l]) => (
                  <div key={String(l)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="font-sans font-bold text-ag-apex-ink text-[26px] leading-none">{v}</p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/50 mt-2">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white text-ag-black p-6 md:p-8">
              <p className="font-sans font-bold text-[15px] mb-1">{t('barsTitle')}</p>
              <p className="font-sans text-[12px] text-ag-gray mb-6">{t('barsDesc')}</p>
              <div className="flex flex-col gap-4">
                {(clusters.length ? clusters : Array.from({ length: 5 }, () => null)).map((c, i) => (
                  <ClusterBar key={c?.key ?? i} c={c} maxX={maxX} lockedLabel={t('lockedShort')} />
                ))}
              </div>
              <div className="flex items-center gap-5 mt-6 font-mono text-[9px] uppercase tracking-widest text-ag-gray-light">
                <span className="inline-flex items-center gap-1.5"><span className="w-6 h-1.5 rounded-full bg-ag-navy/20 inline-block" /> {t('p25')} · {t('p75')}</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-ag-apex inline-block" /> {t('p50')}</span>
              </div>
              <p className="font-sans text-[11px] text-ag-gray leading-relaxed mt-3">{t('percentilesNote')}</p>
              <p className="font-mono text-[9px] text-ag-gray-light mt-4">{t('sourceNote')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Métriques couvertes : section dédiée ── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-navy text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-4">{t('metricsLabel')}</p>
            <h2 className="font-sans font-bold tracking-[-0.03em] leading-[1.05] mb-4" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>{t('metricsTitle')}</h2>
            <p className="font-sans text-[14px] text-white/60 leading-relaxed">{t('metricsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {INDEX_METRICS.map(m => (
              <div key={m.key} className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-sans font-bold text-[14px]">{t(`metrics.${m.key}`)}</p>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest ${m.locked ? 'text-white/40' : 'text-ag-apex-ink'}`}>
                    {m.locked ? <Lock size={10} /> : <Check size={11} />}
                    {m.locked ? t('lockedShort') : t('openShort')}
                  </span>
                </div>
                <p className="font-sans text-[12px] text-white/60 leading-relaxed">{t(`metricsDetail.${m.key}`)}</p>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">{t('unitLabel')} : {m.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Couverture par cluster et vertical ── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>{t('coverageTitle')}</h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t('coverageDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clusters.map(c => (
              <Link
                key={c.key}
                href={`/${locale}/industries/${INDEX_CLUSTER_SLUGS[c.key] ?? ''}`}
                className="rounded-xl border border-ag-border bg-ag-off-white p-6 hover:border-ag-apex/50 hover:bg-white transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <p className="font-sans font-bold text-ag-black text-[15px]">{c.label}</p>
                  <span className="shrink-0 font-mono text-[10px] text-ag-gray-light">{c.verticals.length} {t('kpis.verticals')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.verticals.map(v => {
                    const open = v.arrMultiple && !v.arrMultiple.locked && v.arrMultiple.p50 != null
                    const hasSeries = v.arrMultiple !== null
                    return (
                      <span key={v.key} title={open ? `${t('arrLabel')} : ${v.arrMultiple!.p50}x` : undefined}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[11px] ${open ? 'border-ag-apex bg-ag-apex/15 text-ag-navy font-semibold' : hasSeries ? 'border-ag-apex/40 bg-white text-ag-black' : 'border-ag-border bg-white text-ag-gray'}`}>
                        {v.label}
                        {open && <span className="font-mono text-[10px]">{v.arrMultiple!.p50}x</span>}
                        {hasSeries && !open && <Lock size={9} className="text-ag-gray-light" />}
                      </span>
                    )
                  })}
                </div>
              </Link>
            ))}
          </div>

          <IndustryClusterMap />
        </div>
      </section>

    </>
  )
}

function ClusterBar({ c, maxX, lockedLabel }: { c: IndexCluster | null; maxX: number; lockedLabel: string }) {
  if (!c) return <div className="h-9 rounded-lg bg-ag-off-white animate-pulse" />
  const r = c.evRevenue
  const pct = (v: number) => `${Math.min(100, (v / maxX) * 100)}%`
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="font-sans text-[12px] font-semibold text-ag-black">{c.label}</p>
        {r.locked
          ? <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-ag-gray-light"><Lock size={9} /> {lockedLabel}</span>
          : <span className="font-mono text-[11px] text-ag-navy">{r.p25}x · <strong>{r.p50}x</strong> · {r.p75}x</span>}
      </div>
      <div className="relative h-3 rounded-full bg-ag-off-white overflow-hidden">
        {r.locked ? (
          <div className="absolute top-0 h-full rounded-full bg-ag-navy/15 blur-[2px]" style={{ left: '18%', width: '38%' }} />
        ) : (
          <>
            <div className="absolute top-0 h-full rounded-full bg-ag-navy/20" style={{ left: pct(r.p25 ?? 0), width: `calc(${pct(r.p75 ?? 0)} - ${pct(r.p25 ?? 0)})` }} />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-ag-apex ring-2 ring-white" style={{ left: pct(r.p50 ?? 0) }} />
          </>
        )}
      </div>
    </div>
  )
}

/** Questions fréquentes de l'Index (rendu séparément, avant l'appel final) */
export function IndexFaq() {
  const t = useTranslations('valuation.index')
  return (
      <section className="py-24 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-10" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>{t('faqTitle')}</h2>
          <div className="flex flex-col gap-2">
            {(t.raw('faq') as { q: string; a: string }[]).map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-ag-border bg-white">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-sans font-semibold text-ag-black text-[14px]">{q}</span>
        <ChevronDown size={16} className={`shrink-0 text-ag-gray transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-5 font-sans text-[13px] text-ag-gray leading-relaxed">{a}</p>}
    </div>
  )
}
