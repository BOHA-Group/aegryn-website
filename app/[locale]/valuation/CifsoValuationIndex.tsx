'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import {
  ArrowUpRight, CheckCircle2, TrendingUp, Building2,
  Landmark, Users, AlertCircle, Lock, Check,
} from 'lucide-react'
import { CifsoChart } from './CifsoChart'
import ValuationCalculator from './ValuationCalculator'
import IndexBenchmarks, { IndexFaq } from './IndexBenchmarks'
import IndexSubscriberPreview from './IndexSubscriberPreview'

type Plan = { key: string; name: string; price: string; badge: string; desc: string; features: string[]; cta: string; href: string }
type Freemium = {
  estimateLabel: string; estimateTitle: string; estimateDesc: string; estimateNote: string
  lockedTitle: string; lockedDesc: string; lockedCta: string
  plansLabel: string; plansTitle: string; plans: Plan[]
  dimLabel: string; dimTitle: string; dimDesc: string; dims: { letter: string; label: string; teaser: string }[]; dimLockedCells: string[]
  segLabel: string; segTitle: string; segDesc: string; segments: { title: string; desc: string }[]
  marketTeaser: string
  comingSoonLabel: string; comingSoonDesc: string
  illustrativeLabel: string; illustrativeNote: string
}

/* Aperçu verrouillé : contenu flouté + cadenas, CTA liste d'attente */
function LockedOverlay({ title, desc, cta, soon }: { title: string; desc: string; cta: string; soon?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
      <div className="rounded-xl bg-ag-navy/95 text-white border border-white/10 px-6 py-5 max-w-sm text-center shadow-xl">
        <Lock size={16} className="mx-auto text-ag-apex mb-2" />
        {soon && <p className="inline-flex rounded-full bg-ag-apex/15 border border-ag-apex/40 text-ag-apex font-mono text-[9px] uppercase tracking-widest px-3 py-1 mb-2">{soon}</p>}
        <p className="font-sans font-bold text-[14px] mb-1">{title}</p>
        <p className="font-sans text-[12px] text-white/60 leading-relaxed mb-4">{desc}</p>
        <a href="#waitlist" className="rounded-lg inline-flex items-center gap-1.5 bg-ag-apex text-ag-navy font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-ag-apex/90 transition-colors">
          {cta} <ArrowUpRight size={11} />
        </a>
      </div>
    </div>
  )
}

/* ─── Types ───────────────────────────────────────────────── */
type MarketRow = {
  cluster_key: string
  cluster_label: Record<string, string>
  ev_revenue_low: number
  ev_revenue_high: number
  ev_ebitda_low: number
  ev_ebitda_high: number
  reference_period: string
}

type InvestorProfile = {
  icon: string
  title: string
  desc: string
}

type ExampleDim = {
  code: string
  label: string
  score: string
}

/* ─── Icon map ────────────────────────────────────────────── */

const DIM_COLORS: Record<string, string> = {
  C: '#4A90D9', I: '#9B59B6', F: '#2ECC71', S: '#E74C3C', O: '#F39C12',
}

/* ─── Waitlist form ───────────────────────────────────────── */
function WaitlistForm() {
  const t      = useTranslations('valuation.comingSoonBanner')
  const locale = useLocale()
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle'|'loading'|'ok'|'err'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/valuation/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          org_type: 'unknown',
          locale,
          source_url: window.location.href,
        }),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-2">
      {status === 'ok' ? (
        <div className="flex items-center gap-2 text-emerald-700 font-mono text-[12px]">
          <CheckCircle2 size={14} />
          {t('ctaSuccess')}
        </div>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('ctaPlaceholder')}
            className="flex-1 min-w-0 rounded-lg border border-ag-border bg-ag-off-white text-ag-black placeholder:text-ag-gray-light px-4 py-3 font-sans text-[13px] focus:outline-none focus:border-ag-navy transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 rounded-lg bg-ag-navy text-white font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-3 hover:bg-ag-navy/90 transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? '...' : t('ctaSubmit')}
          </button>
        </>
      )}
      {status === 'err' && (
        <p className="text-red-600 font-sans text-[11px] flex items-center gap-1.5">
          <AlertCircle size={12} /> {t('ctaError')}
        </p>
      )}
    </form>
  )
}

/* ─── Market table ────────────────────────────────────────── */
function MarketTable({ rows, locale, locked }: { rows: MarketRow[]; locale: string; locked?: { title: string; desc: string; cta: string; soon?: string } }) {
  const t = useTranslations('valuation.marketData')

  if (!rows.length) {
    return (
      <div className="border border-ag-border rounded-xl overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-3 border-b border-ag-border last:border-0 p-4 gap-4 animate-pulse">
            <div className="h-4 bg-ag-border rounded w-3/4" />
            <div className="h-4 bg-ag-border rounded w-1/2" />
            <div className="h-4 bg-ag-border rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto relative">
      {locked && <LockedOverlay {...locked} />}
      <div style={{ minWidth: 480 }}>
        {/* Header */}
        <div className="grid grid-cols-3 bg-ag-navy rounded-t-xl">
          <div className="px-5 py-4">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">{t('colCluster')}</p>
          </div>
          <div className="px-5 py-4 border-l border-white/10">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">{t('colEvRevenue')}</p>
          </div>
          <div className="px-5 py-4 border-l border-white/10">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">{t('colEvEbitda')}</p>
          </div>
        </div>
        {/* Rows */}
        {rows.map((row, i) => (
          <div
            key={row.cluster_key}
            className={`grid grid-cols-3 border-x border-b border-ag-border last:rounded-b-xl ${
              i % 2 === 0 ? 'bg-ag-white' : 'bg-ag-off-white'
            } hover:bg-ag-apex/5 transition-colors ${locked && i > 0 ? '[&>div:not(:first-child)]:blur-sm [&>div:not(:first-child)]:select-none' : ''}`}
          >
            <div className="px-5 py-4 border-r border-ag-border">
              <p className="font-sans font-semibold text-ag-black text-[13px]">
                {row.cluster_label?.[locale] ?? row.cluster_label?.['fr'] ?? row.cluster_key}
              </p>
            </div>
            <div className="px-5 py-4 border-r border-ag-border">
              <p className="font-mono font-bold text-ag-apex text-[13px]">
                {row.ev_revenue_low}x à {row.ev_revenue_high}x
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="font-mono text-ag-black text-[13px]">
                {row.ev_ebitda_low}x à {row.ev_ebitda_high}x
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function CifsoValuationIndex() {
  const t      = useTranslations('valuation')
  const locale = useLocale()

  const [marketRows, setMarketRows] = useState<MarketRow[]>([])
  const [marketLoaded, setMarketLoaded] = useState(false)

  const fm           = t.raw('freemium') as Freemium
  const comingSoon   = t.raw('comingSoonBanner') as {
    label: string; title: string; desc: string; features: string[]
    ctaLabel: string; ctaPlaceholder: string; ctaSubmit: string
    ctaSuccess: string; ctaError: string
  }
  const example      = t.raw('example') as {
    label: string; title: string; desc: string
    badgeOrg: string; badgeRevenue: string; badgeSector: string
    scoreLabel: string; scoreValue: string
    gradeLabel: string; gradeValue: string
    gapLabel: string; gapValue: string
    rangeLabel: string; rangeValue: string
    multipleLabel: string; multipleValue: string
    dims: ExampleDim[]
    leversLabel: string; levers: string[]
    cta: string
  }
  const investors    = t.raw('investors') as {
    label: string; title: string; desc: string
    profiles: InvestorProfile[]
    cta: string; ctaHref: string
  }

  useEffect(() => {
    fetch('/api/valuation/multiples')
      .then(r => r.json())
      .then((data: MarketRow[]) => { setMarketRows(data); setMarketLoaded(true) })
      .catch(() => setMarketLoaded(true))
  }, [])

  return (
    <main className="bg-ag-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.035em] max-w-2xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* ── ACCÈS À L'INDEX : trois niveaux (freemium) ── */}
      <section id="plans" className="bg-ag-navy border-t border-white/10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-4">{fm.plansLabel}</p>
          <h2 className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] mb-12 whitespace-pre-line" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{fm.plansTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fm.plans.map(pl => {
              const featured = pl.key === 'index'
              return (
                <div key={pl.key} className={`relative rounded-2xl border p-8 flex flex-col gap-5 ${featured ? 'bg-white text-ag-black border-ag-apex ring-4 ring-ag-apex/20' : 'bg-white/5 text-white border-white/10'}`}>
                  {featured && (
                    <div className="absolute -top-3 left-6 rounded-full bg-ag-apex text-ag-navy font-mono text-[9px] uppercase tracking-widest px-3 py-1 shadow">
                      {fm.comingSoonLabel}
                    </div>
                  )}
                  {!featured && pl.badge && (
                    <div className={`absolute -top-3 left-6 rounded-full font-mono text-[9px] uppercase tracking-widest px-3 py-1 shadow border ${pl.key === 'free' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-ag-apex/15 text-ag-navy border-ag-apex/40'}`}>
                      {pl.badge}
                    </div>
                  )}
                  <div>
                    <p className={`font-mono text-[10px] tracking-[0.22em] uppercase mb-2 ${featured ? 'text-ag-gray-light' : 'text-white/50'}`}>{pl.name}</p>
                    <p className="font-sans font-bold text-[24px] tracking-[-0.02em] leading-tight">{pl.price}</p>
                    <p className={`font-sans text-[13px] leading-relaxed mt-3 ${featured ? 'text-ag-gray' : 'text-white/60'}`}>{pl.desc}</p>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {pl.features.map(f => (
                      <li key={f} className="flex items-start gap-2 font-sans text-[13px] leading-snug">
                        <Check size={13} className="text-ag-apex shrink-0 mt-0.5" /> <span className={featured ? 'text-ag-black' : 'text-white/80'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {pl.key === 'index' ? (
                    <div id="waitlist" className="pt-2">
                      <div className="rounded-lg bg-ag-navy/5 border border-ag-navy/15 px-4 py-3 mb-4">
                        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-navy mb-1">{fm.comingSoonLabel}</p>
                        <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{fm.comingSoonDesc}</p>
                      </div>
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray-light mb-3">{comingSoon.ctaLabel}</p>
                      <WaitlistForm />
                    </div>
                  ) : (
                    <Link href={pl.href.startsWith('#') ? pl.href : `/${locale}${pl.href}`}
                      className={`rounded-lg inline-flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 font-semibold transition-colors ${featured ? 'bg-ag-navy text-white hover:bg-ag-navy/90' : 'bg-ag-apex text-ag-navy hover:bg-ag-apex/90'}`}>
                      {pl.cta} <ArrowUpRight size={12} />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>

          <IndexSubscriberPreview />
        </div>
      </section>

      {/* ── MOTEUR DE BENCHMARKS : chiffres clés, barres par cluster, couverture, métriques, FAQ ── */}
      <IndexBenchmarks />

      {/* ── ESTIMATION LIBRE : fourchette large, benchmarks partiels ── */}
      <section id="estimation" className="py-24 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light">{fm.estimateLabel}</p>
              <span className="rounded-full border border-amber-300 bg-amber-50 text-amber-800 font-mono text-[9px] uppercase tracking-widest px-3 py-1">{fm.illustrativeLabel}</span>
            </div>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4 whitespace-pre-line" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>{fm.estimateTitle}</h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{fm.estimateDesc}</p>
          </div>
          <ValuationCalculator freemiumNote={fm.estimateNote} illustrative={fm.illustrativeNote} locked={{ title: fm.lockedTitle, desc: fm.lockedDesc, cta: fm.lockedCta, soon: fm.comingSoonLabel }} />
        </div>
      </section>

      {/* ── GRAPHIQUE CIFSO SCORE × MULTIPLE ─────────── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-center">

            {/* Text */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex/70 mb-4">
                {t('chart.label')}
              </p>
              <h2
                className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] mb-5 whitespace-pre-line"
                style={{ fontSize: 'clamp(24px,3vw,40px)' }}
              >
                {t('chart.title')}
              </h2>
              <p className="font-sans text-[14px] text-white/55 leading-relaxed">
                {t('chart.desc')}
              </p>
              <p className="font-sans text-[10px] text-white/30 leading-relaxed mt-6 border-t border-white/10 pt-4 italic">
                {t('chart.disclaimer')}
              </p>
            </div>

            {/* Chart */}
            <div>
              <CifsoChart />
            </div>
          </div>
        </div>
      </section>

      {/* ── EXEMPLE DE RÉSULTAT ──────────────────────── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {example.label}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(24px,3vw,40px)' }}
            >
              {example.title}
            </h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl">
              {example.desc}
            </p>
          </div>

          {/* Card exemple */}
          <div className="border border-ag-border rounded-2xl overflow-hidden">

            {/* Header carte */}
            <div className="bg-ag-off-white border-b border-ag-border px-8 py-5 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.14em] text-ag-black bg-ag-border px-3 py-1 rounded">
                {example.badgeOrg}
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-ag-gray-light bg-ag-border px-3 py-1 rounded">
                {example.badgeRevenue}
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-ag-gray-light bg-ag-border px-3 py-1 rounded">
                {example.badgeSector}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] divide-y lg:divide-y-0 lg:divide-x divide-ag-border">

              {/* Left — Score global + dimensions */}
              <div className="p-8 flex flex-col gap-6">

                {/* Score + grade */}
                <div className="flex flex-wrap items-start gap-8">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-1">{example.scoreLabel}</p>
                    <p className="font-sans font-bold text-ag-black text-[36px] tracking-tight leading-none">{example.scoreValue}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-1">{example.gradeLabel}</p>
                    <div className="inline-flex items-center justify-center border-2 border-[#4A90D9] text-[#4A90D9] w-14 h-14 font-sans font-bold text-[22px]">
                      {example.gradeValue}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-1">{example.gapLabel}</p>
                    <p className="font-sans font-bold text-ag-apex text-[22px]">{example.gapValue}</p>
                  </div>
                </div>

                {/* Dimensions breakdown */}
                <div className="flex flex-col gap-3 border-t border-ag-border pt-5">
                  {example.dims.map(({ code, label, score }) => (
                    <div key={code} className="flex items-center gap-3">
                      <span
                        className="font-mono text-[12px] font-bold w-5 shrink-0"
                        style={{ color: DIM_COLORS[code] ?? '#888' }}
                      >
                        {code}
                      </span>
                      <span className="font-sans text-[12px] text-ag-gray flex-1 leading-snug">{label}</span>
                      <span className="font-mono text-[11px] font-bold text-ag-black shrink-0">{score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Valorisation + leviers */}
              <div className="p-8 flex flex-col gap-6">

                {/* Valorisation */}
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-1">{example.rangeLabel}</p>
                  <p className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] leading-tight">{example.rangeValue}</p>
                  <p className="font-sans text-[11px] text-ag-gray-light mt-1">
                    {example.multipleLabel} : <span className="font-semibold text-ag-black">{example.multipleValue}</span>
                  </p>
                </div>

                {/* Leviers */}
                <div className="border-t border-ag-border pt-5 flex flex-col gap-3">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">{example.leversLabel}</p>
                  {example.levers.map((l, i) => (
                    <div key={i} className="flex items-start gap-3 border-l-2 border-ag-apex/30 pl-4">
                      <span className="font-sans text-[12px] text-ag-gray leading-snug">{l}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="border-t border-ag-border pt-5 mt-auto">
                  <Link
                    href="#estimation"
                    className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 hover:bg-ag-apex/90 transition-colors"
                  >
                    {example.cta} <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DONNÉES DE MARCHÉ ─────────────────────────── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('marketData.label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4 whitespace-pre-line"
              style={{ fontSize: 'clamp(24px,3vw,40px)' }}
            >
              {t('marketData.title')}
            </h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl">
              {t('marketData.desc')}
            </p>
          </div>

          <MarketTable rows={marketRows} locale={locale} locked={{ title: fm.lockedTitle, desc: fm.lockedDesc, cta: fm.lockedCta, soon: fm.comingSoonLabel }} />
          <p className="font-mono text-[10px] tracking-[0.12em] text-ag-gray-light mt-3">{fm.marketTeaser}</p>

          {marketLoaded && marketRows[0]?.reference_period && (
            <p className="font-mono text-[10px] tracking-[0.12em] text-ag-gray-light mt-3">
              {t('marketData.updatedLabel')} : {marketRows[0].reference_period}
            </p>
          )}

          <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed max-w-2xl mt-6 italic">
            {t('marketData.note')}
          </p>
        </div>
      </section>

      {/* ── BENCHMARKS PAR DIMENSION (aperçu verrouillé) ── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">{fm.dimLabel}</p>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4 whitespace-pre-line" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>{fm.dimTitle}</h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{fm.dimDesc}</p>
          </div>
          <div className="relative overflow-x-auto rounded-xl border border-ag-border">
            <LockedOverlay title={fm.lockedTitle} desc={fm.lockedDesc} cta={fm.lockedCta} soon={fm.comingSoonLabel} />
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[220px_repeat(4,1fr)] bg-ag-navy">
                <div className="px-5 py-4"><p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">Dimension</p></div>
                {fm.dimLockedCells.map(c => <div key={c} className="px-5 py-4 border-l border-white/10"><p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">{c}</p></div>)}
              </div>
              {fm.dims.map((d, i) => (
                <div key={d.letter} className={`grid grid-cols-[220px_repeat(4,1fr)] border-t border-ag-border ${i % 2 ? 'bg-ag-off-white' : 'bg-ag-white'}`}>
                  <div className="px-5 py-4 flex items-center gap-3">
                    <span className="font-sans font-bold text-ag-navy text-[16px] w-5">{d.letter}</span>
                    <div><p className="font-sans font-semibold text-ag-black text-[13px]">{d.label}</p><p className="font-mono text-[10px] text-ag-gray-light">{d.teaser}</p></div>
                  </div>
                  {[0, 1, 2, 3].map(k => (
                    <div key={k} className="px-5 py-4 border-l border-ag-border blur-sm select-none">
                      <p className="font-mono text-[13px] text-ag-black">{['14,2 / 20', '+1,8x', '+420 k€', '▲ 3 %'][k]}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POUR QUI : tous les segments ── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">{fm.segLabel}</p>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4 whitespace-pre-line" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>{fm.segTitle}</h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{fm.segDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {fm.segments.map((sg, i) => (
              <div key={sg.title} className="rounded-xl bg-ag-white border border-ag-border p-6 flex flex-col gap-4 hover:border-ag-navy transition-colors">
                <div className="w-10 h-10 rounded-lg bg-ag-navy flex items-center justify-center shrink-0">
                  {[<Users key="u" size={20} className="text-ag-apex" />, <TrendingUp key="t" size={20} className="text-ag-apex" />, <Landmark key="l" size={20} className="text-ag-apex" />, <Building2 key="b" size={20} className="text-ag-apex" />, <CheckCircle2 key="c" size={20} className="text-ag-apex" />, <Users key="f" size={20} className="text-ag-apex" />][i % 6]}
                </div>
                <div>
                  <p className="font-sans font-bold text-ag-black text-[14px] tracking-[-0.01em] mb-2">{sg.title}</p>
                  <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{sg.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href={investors.ctaHref} className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-4 hover:bg-ag-navy/90 transition-colors">
            {investors.cta} <ArrowUpRight size={12} />
          </Link>
        </div>
      </section>

      <IndexFaq />

      {/* ── CTA PRE-SCREEN ───────────────────────────── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex/70 mb-4">
              {t('prescreenCta.label')}
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] mb-4 whitespace-pre-line"
              style={{ fontSize: 'clamp(24px,3vw,40px)' }}
            >
              {t('prescreenCta.title')}
            </h2>
            <p className="font-sans text-[14px] text-white/55 leading-relaxed">
              {t('prescreenCta.desc')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/grade/submit"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-4 hover:bg-ag-apex/90 transition-colors"
            >
              {t('prescreenCta.cta')} <ArrowUpRight size={12} />
            </Link>
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 border border-white/25 text-white/70 font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-4 hover:border-white/50 hover:text-white transition-all"
            >
              {t('prescreenCta.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
