import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'What We Build',
    description: "Six actifs numériques propriétaires d'Aegryn — de l'IA aux réseaux sociaux, de l'immobilier à la logistique.",
    path: '/what-we-build',
    locale,
  })
}

const assets = [
  {
    id: 'nexoris',
    category: 'ai',
    status: 'building',
    href: 'https://nexoris.ai',
    color: 'from-violet-500/5 to-transparent',
    accent: 'text-violet-600',
    border: 'border-violet-500/15 hover:border-violet-500/35',
  },
  {
    id: 'kryolio',
    category: 'transactions',
    status: 'building',
    href: 'https://kryolio.com',
    color: 'from-emerald-500/5 to-transparent',
    accent: 'text-emerald-700',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
  },
  {
    id: 'lyvra',
    category: 'lifestyle',
    status: 'concept',
    href: '#',
    color: 'from-rose-500/5 to-transparent',
    accent: 'text-rose-600',
    border: 'border-rose-500/15 hover:border-rose-500/35',
  },
  {
    id: 'vorrex',
    category: 'transactions',
    status: 'concept',
    href: '#',
    color: 'from-amber-500/5 to-transparent',
    accent: 'text-amber-700',
    border: 'border-amber-500/15 hover:border-amber-500/35',
  },
  {
    id: 'domify',
    category: 'lifestyle',
    status: 'concept',
    href: '#',
    color: 'from-sky-500/5 to-transparent',
    accent: 'text-sky-700',
    border: 'border-sky-500/15 hover:border-sky-500/35',
  },
  {
    id: 'fleetori',
    category: 'transactions',
    status: 'concept',
    href: '#',
    color: 'from-orange-500/5 to-transparent',
    accent: 'text-orange-700',
    border: 'border-orange-500/15 hover:border-orange-500/35',
  },
] as const

const statusColors: Record<string, string> = {
  building: 'bg-aegryn-apex/10 text-emerald-700',
  concept: 'bg-black/5 text-aegryn-muted',
  live: 'bg-green-500/10 text-green-700',
}

export default function WhatWeBuildPage() {
  const t = useTranslations('build')

  return (
    <>
      {/* Hero */}
      <section className="border-b border-aegryn-border">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-aegryn-apex mb-6">
            {t('hero.label')}
          </p>
          <h1 className="font-display text-6xl font-black tracking-tighter text-aegryn-cream sm:text-7xl max-w-2xl leading-[1.02]">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-sm text-aegryn-cream2 leading-relaxed max-w-lg">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Assets grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm transition-all ${asset.border}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${asset.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className={`font-mono text-[10px] uppercase tracking-[0.25em] mb-1 ${asset.accent}`}>
                      {t(`categories.${asset.category}`)}
                    </p>
                    <h2 className="font-display text-2xl font-black tracking-tighter text-aegryn-cream">
                      {asset.id.charAt(0).toUpperCase() + asset.id.slice(1)}
                    </h2>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${statusColors[asset.status]}`}>
                    {t(`status.${asset.status}`)}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-aegryn-cream2 leading-relaxed mb-6">
                  {t(`assets.${asset.id}.desc`)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {(t.raw(`assets.${asset.id}.tags`) as string[]).map((tag: string) => (
                    <span key={tag} className="rounded-full border border-aegryn-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-aegryn-muted">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {asset.href !== '#' ? (
                  <a
                    href={asset.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 font-mono text-xs transition-colors ${asset.accent} hover:opacity-70`}
                  >
                    {t('visitSite')} ↗
                  </a>
                ) : (
                  <span className="font-mono text-xs text-aegryn-muted">{t('comingSoon')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t border-aegryn-border bg-aegryn-bg2">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-aegryn-apex mb-6">
                / {t('philosophy.label')}
              </p>
              <h2 className="font-display text-4xl font-black tracking-tighter text-aegryn-cream sm:text-5xl mb-6">
                {t('philosophy.title')}
              </h2>
              <p className="text-sm text-aegryn-cream2 leading-relaxed">
                {t('philosophy.desc')}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {(['proprietary', 'sovereign', 'durable'] as const).map((p) => (
                <div key={p} className="rounded-2xl border border-aegryn-border bg-aegryn-bg3 p-6">
                  <p className="font-display text-3xl font-black text-aegryn-apex mb-2">
                    {t(`pillars.${p}.stat`)}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-aegryn-muted">
                    {t(`pillars.${p}.label`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advisory CTA */}
      <section className="border-t border-aegryn-border">
        <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-2xl font-black tracking-tighter text-aegryn-cream max-w-md">
            {t('advisoryCta.text')}
          </p>
          <Link
            href="/advisory"
            className="group shrink-0 inline-flex items-center gap-3 rounded-full bg-aegryn-apex px-7 py-3.5 font-display text-sm font-bold text-aegryn-obsidian transition-all hover:bg-aegryn-obsidian hover:text-aegryn-white"
          >
            {t('advisoryCta.button')}
            <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </Link>
        </div>
      </section>
    </>
  )
}
