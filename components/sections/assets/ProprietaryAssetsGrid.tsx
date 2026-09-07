'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, ExternalLink, Info, Lock } from 'lucide-react'
import { gsap } from '@/lib/gsap'

type PropCategory = 'all' | 'ai' | 'transactions' | 'compliance' | 'identity'

interface PropAsset {
  id:       string
  name:     string
  url:      string | null
  badgeKey: string
  taglineKey: string
  descKey:  string
  category: PropCategory
  status:   'live' | 'beta' | 'dev'
  ownership: 'core' | 'domain'
  internalOnly?: boolean
  publisherReady?: boolean
  slug?:    string
  visitPageHref?: string
}

const PROP_ASSETS: PropAsset[] = [
  {
    id:          'subblink',
    name:        'Intelligence contractuelle IA',
    url:         'https://subblink.com',
    badgeKey:    'subblink.badge',
    taglineKey:  'subblink.tagline',
    descKey:     'subblink.description',
    category:    'ai',
    status:      'live',
    ownership:   'core',
    slug:        'subblink',
    publisherReady: true,
  },
  {
    id:          'kryv',
    name:        'Intégrité du code IA',
    url:         null,
    badgeKey:    'kryv.badge',
    taglineKey:  'kryv.tagline',
    descKey:     'kryv.description',
    category:    'ai',
    status:      'beta',
    ownership:   'core',
    internalOnly: true,
    publisherReady: true,
  },
  {
    id:          'dataroom',
    name:        'Data Room',
    url:         null,
    badgeKey:    'dataroom.badge',
    taglineKey:  'dataroom.tagline',
    descKey:     'dataroom.description',
    category:    'transactions',
    status:      'live',
    ownership:   'domain',
    publisherReady: true,
    visitPageHref: '/transact/how-to-sell',
  },
  {
    id:          'cifso',
    name:        'CIFSO Protocol',
    url:         null,
    badgeKey:    'cifso.badge',
    taglineKey:  'cifso.tagline',
    descKey:     'cifso.description',
    category:    'ai',
    status:      'live',
    ownership:   'domain',
    publisherReady: true,
    visitPageHref: '/grade',
  },
  {
    id:          'compliance',
    name:        'Compliance Engine',
    url:         null,
    badgeKey:    'compliance.badge',
    taglineKey:  'compliance.tagline',
    descKey:     'compliance.description',
    category:    'compliance',
    status:      'dev',
    ownership:   'domain',
    publisherReady: true,
  },
  {
    id:          'kyb',
    name:        'KYB/KYC Engine',
    url:         null,
    badgeKey:    'kyb.badge',
    taglineKey:  'kyb.tagline',
    descKey:     'kyb.description',
    category:    'identity',
    status:      'live',
    ownership:   'domain',
    publisherReady: true,
    visitPageHref: '/client/login',
  },
]

const STATUS_COLOR: Record<string, string> = {
  live: 'text-ag-live',
  beta: 'text-ag-beta',
  dev:  'text-ag-gray',
}

export function ProprietaryAssetsGrid() {
  const t      = useTranslations('assets.page')
  const tItems = useTranslations('assets.items')
  const [active, setActive] = useState<PropCategory>('all')
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = active === 'all'
    ? PROP_ASSETS
    : PROP_ASSETS.filter((a) => a.category === active)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.prop-asset-card', {
        opacity: 0, y: 24, stagger: 0.07,
        ease: 'expo.out', duration: 0.55,
      })
    }, gridRef)
    return () => ctx.revert()
  }, [active])

  const filters: { key: PropCategory; label: string }[] = [
    { key: 'all',         label: t('filterAll') },
    { key: 'ai',          label: t('filterAI') },
    { key: 'transactions',label: t('filterTransactions') },
    { key: 'compliance',  label: t('filterCompliance') },
    { key: 'identity',    label: t('filterIdentity') },
  ]

  const statusLabel = (s: string) => {
    if (s === 'live') return t('statusLive')
    if (s === 'beta') return t('statusBeta')
    return t('statusDev')
  }

  return (
    <section className="bg-ag-white border-t border-ag-border py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Publisher note */}
        <div className="mb-8 flex items-start gap-3 border border-ag-apex/20 bg-ag-apex/5 px-5 py-4">
          <Info size={14} className="text-ag-apex-ink mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
              {t('publisherNote')}
            </p>
            <p className="font-sans text-[12px] text-ag-gray-light leading-relaxed">
              {t('ownedNote')}
            </p>
          </div>
        </div>

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
              className="prop-asset-card bg-ag-white p-8 flex flex-col gap-5 group hover:bg-ag-off-white transition-colors"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light">
                      {tItems(asset.badgeKey)}
                    </p>
                  </div>
                  <h2 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">
                    {asset.name}
                  </h2>
                </div>
                {/* Publisher badge */}
                {asset.publisherReady && (
                  <span className="font-mono text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 border border-ag-apex/30 bg-ag-apex/5 text-ag-apex-ink shrink-0">
                    LICENCIABLE
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`font-mono text-[10px] tracking-[0.12em] uppercase ${STATUS_COLOR[asset.status] ?? 'text-ag-gray'}`}>
                  {statusLabel(asset.status)}
                </span>
                {asset.internalOnly && (
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ag-gray-light border border-ag-border px-2 py-0.5 flex items-center gap-1">
                    <Lock size={9} />
                    {t('internalOnly')}
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="font-sans font-semibold text-ag-black text-[14px] leading-snug">
                {tItems(asset.taglineKey)}
              </p>

              {/* Description */}
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                {tItems(asset.descKey)}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-ag-border">
                {asset.internalOnly ? (
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light cursor-default select-none">
                    {t('confidential')}
                  </span>
                ) : asset.slug ? (
                  <a
                    href={`/assets/${asset.slug}`}
                    className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-black hover:text-ag-apex transition-colors flex items-center gap-1"
                  >
                    {t('viewDetails')} <ArrowUpRight size={11} />
                  </a>
                ) : asset.visitPageHref ? (
                  <a
                    href={asset.visitPageHref}
                    className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-black hover:text-ag-apex transition-colors flex items-center gap-1"
                  >
                    {t('visitPage')} <ArrowUpRight size={11} />
                  </a>
                ) : (
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
                    {asset.status === 'dev' ? t('comingSoon') : t('visitSite')}
                  </span>
                )}
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
      </div>
    </section>
  )
}
