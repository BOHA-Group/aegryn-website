'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { AEGRYN_ASSETS, ASSET_CATEGORIES } from '@/data/assets'

type Category = 'all' | 'ai' | 'lifestyle' | 'transactions'

const GRADE_COLORS: Record<string, string> = {
  star:    '#5ADDA4',
  aaa:     '#C9A84C',
  aa:      '#9BA8B0',
  a:       '#4A90D9',
  b:       '#D4820A',
  pending: '#6B6B6B',
  refused: '#C0392B',
}

const GRADE_LABELS: Record<string, string> = {
  star:    'AEG ★',
  aaa:     'AAA',
  aa:      'AA',
  a:       'A',
  b:       'B',
  pending: '—',
}

export function AssetsGrid() {
  const t = useTranslations('assets.page')
  const tStatus = useTranslations('assetStatus')
  const [active, setActive] = useState<Category>('all')
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = active === 'all'
    ? AEGRYN_ASSETS
    : AEGRYN_ASSETS.filter((a) => a.category === active)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.asset-card', {
        opacity: 0, y: 24, stagger: 0.08,
        ease: 'expo.out', duration: 0.6,
      })
    }, gridRef)
    return () => ctx.revert()
  }, [active])

  const filters: { key: Category; label: string }[] = [
    { key: 'all',          label: t('filterAll') },
    { key: 'ai',           label: t('filterAI') },
    { key: 'lifestyle',    label: t('filterLifestyle') },
    { key: 'transactions', label: t('filterTransactions') },
  ]

  const statusLabel = (status: string) => {
    if (status === 'live')        return tStatus('live')
    if (status === 'beta')        return tStatus('beta')
    if (status === 'dev')         return tStatus('dev')
    if (status === 'not_started') return tStatus('notStarted')
    if (status === 'refused')     return tStatus('refused')
    return tStatus('dev')
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
        <div className="flex items-center gap-1 flex-wrap mb-12 border-b border-ag-border pb-6">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors ${
                active === key
                  ? 'border-ag-black bg-ag-black text-white'
                  : 'border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black'
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
            {filtered.length} actif{filtered.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="asset-card bg-ag-white p-8 flex flex-col gap-5 group hover:bg-ag-off-white transition-colors"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light mb-1">
                    {ASSET_CATEGORIES[asset.category as keyof typeof ASSET_CATEGORIES]?.label}
                  </p>
                  <h2 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">
                    {asset.name}
                  </h2>
                </div>
                {/* Grade badge */}
                <span
                  className="font-mono text-[11px] tracking-[0.1em] font-semibold shrink-0 mt-0.5"
                  style={{ color: GRADE_COLORS[asset.grade] ?? '#6B6B6B' }}
                >
                  {asset.grade === 'pending'
                    ? (asset.id === 'subblink' ? t('gradePending') : null)
                    : asset.grade === 'refused'
                      ? tStatus('refused')
                      : GRADE_LABELS[asset.grade]}
                </span>
              </div>

              {/* Badge + status */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-ag-gray border border-ag-border px-2 py-1">
                  {asset.badge}
                </span>
                <span className={`font-mono text-[10px] tracking-[0.12em] uppercase ${statusColor(asset.status)}`}>
                  {statusLabel(asset.status)}
                </span>
                {asset.internalOnly && (
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ag-gray-light border border-ag-border px-2 py-0.5">
                    {t('internalOnly')}
                  </span>
                )}
                {asset.auctionEligible && (
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ag-navy bg-ag-apex/15 border border-ag-apex/30 px-2 py-0.5">
                    {t('auctionEligible')}
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="font-sans font-semibold text-ag-black text-[14px] leading-snug">
                {asset.tagline}
              </p>

              {/* Description */}
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                {asset.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-ag-border">
                <Link
                  href={`/assets/${asset.slug}`}
                  className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-black hover:text-ag-apex transition-colors flex items-center gap-1"
                >
                  {t('viewDetails')} <ArrowUpRight size={11} />
                </Link>
                {asset.url && (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray hover:text-ag-black transition-colors flex items-center gap-1"
                  >
                    {t('visitSite')} <ExternalLink size={11} />
                  </a>
                )}
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
              href="/grade/submit"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy-mid transition-colors"
            >
              {t('ctaGrade')} <ArrowUpRight size={11} />
            </Link>
            <Link
              href="/auction"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-ag-black hover:text-ag-black transition-all"
            >
              {t('ctaAuction')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
