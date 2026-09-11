'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import {
  ArrowUpRight, Clock, CheckCircle2, TrendingUp, Building2,
  Landmark, Users, AlertCircle, ChevronRight,
} from 'lucide-react'
import { CifsoChart } from './CifsoChart'

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
const PROFILE_ICON: Record<string, React.ReactNode> = {
  trending: <TrendingUp size={20} className="text-ag-apex" />,
  building: <Building2 size={20} className="text-ag-apex" />,
  landmark: <Landmark size={20} className="text-ag-apex" />,
  users:    <Users size={20} className="text-ag-apex" />,
}

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
        <div className="flex items-center gap-2 text-ag-apex font-mono text-[12px]">
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
            className="flex-1 min-w-0 border border-white/20 bg-white/[0.06] text-white placeholder:text-white/35 px-4 py-3 font-sans text-[13px] focus:outline-none focus:border-ag-apex transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 bg-ag-apex text-ag-navy font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-3 hover:bg-ag-apex/90 transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? '...' : t('ctaSubmit')}
          </button>
        </>
      )}
      {status === 'err' && (
        <p className="text-red-400 font-sans text-[11px] flex items-center gap-1.5">
          <AlertCircle size={12} /> {t('ctaError')}
        </p>
      )}
    </form>
  )
}

/* ─── Market table ────────────────────────────────────────── */
function MarketTable({ rows, locale }: { rows: MarketRow[]; locale: string }) {
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
    <div className="overflow-x-auto">
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
            } hover:bg-ag-apex/5 transition-colors`}
          >
            <div className="px-5 py-4 border-r border-ag-border">
              <p className="font-sans font-semibold text-ag-black text-[13px]">
                {row.cluster_label?.[locale] ?? row.cluster_label?.['fr'] ?? row.cluster_key}
              </p>
            </div>
            <div className="px-5 py-4 border-r border-ag-border">
              <p className="font-mono font-bold text-ag-apex text-[13px]">
                {row.ev_revenue_low}x – {row.ev_revenue_high}x
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="font-mono text-ag-black text-[13px]">
                {row.ev_ebitda_low}x – {row.ev_ebitda_high}x
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

      {/* ── COMING SOON BANNER ────────────────────────── */}
      <section className="bg-ag-navy border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border border-ag-apex/30 rounded-2xl bg-ag-apex/5 p-8 md:p-10 flex flex-col gap-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 border border-ag-apex/40 bg-ag-apex/10 rounded-full px-4 py-1.5 mb-4">
                  <Clock size={11} className="text-ag-apex" />
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex">
                    {comingSoon.label}
                  </span>
                </div>
                <h2
                  className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] whitespace-pre-line"
                  style={{ fontSize: 'clamp(20px,2.5vw,32px)' }}
                >
                  {comingSoon.title}
                </h2>
                <p className="font-sans text-[14px] text-white/55 leading-relaxed max-w-xl mt-3">
                  {comingSoon.desc}
                </p>
              </div>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comingSoon.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ChevronRight size={13} className="text-ag-apex shrink-0 mt-0.5" />
                  <span className="font-sans text-[13px] text-white/70 leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Waitlist form */}
            <div className="border-t border-white/10 pt-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex/70 mb-4">
                {comingSoon.ctaLabel}
              </p>
              <WaitlistForm />
            </div>
          </div>
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
                    href="/grade/submit"
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

          <MarketTable rows={marketRows} locale={locale} />

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

      {/* ── POUR LES INVESTISSEURS ───────────────────── */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {investors.label}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(24px,3vw,40px)' }}
            >
              {investors.title}
            </h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
              {investors.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {investors.profiles.map((p) => (
              <div
                key={p.title}
                className="border border-ag-border p-6 flex flex-col gap-4 hover:border-ag-navy hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-ag-navy flex items-center justify-center shrink-0">
                  {PROFILE_ICON[p.icon] ?? <Users size={20} className="text-ag-apex" />}
                </div>
                <div>
                  <p className="font-sans font-bold text-ag-black text-[14px] tracking-[-0.01em] mb-2">{p.title}</p>
                  <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={investors.ctaHref}
            className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-4 hover:bg-ag-navy-mid transition-colors"
          >
            {investors.cta} <ArrowUpRight size={12} />
          </Link>
        </div>
      </section>

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
