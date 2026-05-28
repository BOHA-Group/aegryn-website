import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { generateAegrynMetadata, aegrynOrganizationSchema } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  return generateAegrynMetadata({
    title: t('tagline'),
    description: 'Aegryn est un Swiss Tech Asset Builder. Nous construisons des actifs propriétaires conçus pour durer.',
    locale,
  })
}

const assets = [
  {
    name: 'Subblink',
    tagline: 'AI Contract Analysis',
    href: 'https://subblink.app',
    label: 'B2B SaaS',
    status: 'live',
    category: 'ai',
  },
  {
    name: 'Aegryn Advisory',
    tagline: 'Cybersecurity & AI Trust',
    href: '/advisory',
    label: 'Protocole',
    status: 'live',
    category: 'ai',
  },
  {
    name: 'Neediu',
    tagline: 'Home Services Marketplace',
    href: 'https://neediu.com',
    label: 'B2C',
    status: 'beta',
    category: 'lifestyle',
  },
  {
    name: 'Movtoo',
    tagline: 'On-demand Delivery',
    href: 'https://movtoo.com',
    label: 'B2C',
    status: 'dev',
    category: 'lifestyle',
  },
  {
    name: 'Primiom',
    tagline: 'AI-assisted Real Estate',
    href: 'https://primiom.com',
    label: 'B2C',
    status: 'dev',
    category: 'transactions',
  },
  {
    name: 'Hobconnect',
    tagline: 'Passion Social Network',
    href: 'https://hobconnect.com',
    label: 'B2C',
    status: 'dev',
    category: 'transactions',
  },
]

const statusConfig = {
  live: { dot: 'bg-aegryn-live animate-apex-pulse', label: 'Live' },
  beta: { dot: 'bg-aegryn-beta', label: 'Beta' },
  dev:  { dot: 'bg-aegryn-muted', label: 'Dev' },
}

function AssetCard({ asset }: { asset: typeof assets[number] }) {
  const status = statusConfig[asset.status as keyof typeof statusConfig]
  const isExternal = asset.href.startsWith('http')

  return (
    <Link
      href={asset.href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="asset-tile group relative flex flex-col justify-between rounded-2xl border border-aegryn-border bg-aegryn-glass p-6 transition-all duration-300 hover:border-aegryn-border-h hover:bg-black/[0.03]"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-aegryn-muted">
            {asset.label}
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            <span className="font-mono text-[9px] text-aegryn-muted">{status.label}</span>
          </span>
        </div>
        <h3 className="font-display text-xl font-bold tracking-tighter text-aegryn-cream mb-1">
          {asset.name}
        </h3>
        <p className="font-mono text-xs text-aegryn-cream2">{asset.tagline}</p>
      </div>
      <div className="mt-6 flex items-center justify-end">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-aegryn-border text-aegryn-cream2 transition-all group-hover:border-aegryn-obsidian group-hover:bg-aegryn-obsidian group-hover:text-aegryn-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const t = useTranslations('hero')
  const tManifesto = useTranslations('manifesto')
  const tAssets = useTranslations('assets')
  const tAdvisory = useTranslations('advisory')
  const tStats = useTranslations('stats')

  const aiAssets     = assets.filter(a => a.category === 'ai')
  const lifestyleAssets = assets.filter(a => a.category === 'lifestyle')
  const transactionAssets = assets.filter(a => a.category === 'transactions')

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
      />

      {/* ── SECTION 1 — HERO ──────────────────────────────── */}
      <section
        className="relative flex min-h-screen items-end overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Mountains background */}
        <div className="absolute inset-0">
          <Image
            src="/images/mountains.avif"
            alt="Alpes suisses — fondement visuel d'Aegryn"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-aegryn-obsidian via-aegryn-navy/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-aegryn-obsidian/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl w-full px-6 pb-24 pt-40">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-aegryn-apex mb-6 animate-fade-up">
            {t('tagline')}
          </p>
          <h1
            id="hero-title"
            className="font-display text-6xl font-black leading-[1.02] tracking-tighter text-aegryn-white sm:text-7xl lg:text-8xl max-w-3xl"
            style={{ animationDelay: '100ms' }}
          >
            {t('title').split('\n').map((line, i) => (
              <span key={i} className={`block ${i === 1 ? 'text-white/70' : ''}`}>
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 font-mono text-sm text-white/70 leading-relaxed max-w-md animate-fade-up" style={{ animationDelay: '200ms' }}>
            {t('sub').split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link
              href="/what-we-build"
              className="group flex items-center gap-3 rounded-full bg-aegryn-apex px-7 py-3.5 font-display text-sm font-bold text-aegryn-obsidian transition-all hover:bg-aegryn-white"
            >
              {t('cta')}
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-display text-sm font-bold text-aegryn-white transition-all hover:border-white/40 hover:bg-white/[0.06]"
            >
              À propos
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-16 flex flex-wrap items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-aegryn-apex/60" />
              Suisse
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-aegryn-apex/60" />
              RGPD & LPD
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-aegryn-apex/60" />
              6 langues
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — MANIFESTE AEGIS/AEGIR/AEON ────────── */}
      <section className="border-t border-aegryn-border bg-aegryn-bg2" aria-labelledby="manifesto-title">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-aegryn-apex mb-16 text-center">
            L'origine du nom
          </p>
          <div className="grid gap-px sm:grid-cols-3 rounded-2xl overflow-hidden border border-aegryn-border">
            {(['aegis', 'aegir', 'aeon'] as const).map((key) => (
              <div key={key} className="bg-aegryn-bg2 p-8 hover:bg-aegryn-bg3 transition-colors border-r border-aegryn-border last:border-r-0">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-aegryn-apex mb-4">
                  {tManifesto(`${key}.label`)}
                </p>
                <h3 className="font-display text-2xl font-bold tracking-tighter text-aegryn-cream mb-4">
                  {tManifesto(`${key}.title`)}
                </h3>
                <p className="text-sm text-aegryn-cream2 leading-relaxed">
                  {tManifesto(`${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — ACTIFS ─────────────────────────────── */}
      <section className="border-t border-aegryn-border" aria-labelledby="assets-title">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2
            id="assets-title"
            className="font-display text-4xl font-black tracking-tighter text-aegryn-cream sm:text-5xl mb-2"
          >
            {tAssets('title')}
          </h2>
          <p className="font-mono text-sm text-aegryn-muted mb-10">{tAssets('sub')}</p>

          {/* Assets intro visual */}
          <div className="relative w-full overflow-hidden rounded-2xl mb-16 h-64 sm:h-80 lg:h-96">
            <Image
              src="/images/assets-intro.jpg"
              alt="Aegryn proprietary ecosystem"
              fill
              className="object-cover object-center"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-aegryn-obsidian/70 via-aegryn-obsidian/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-aegryn-obsidian/30 to-transparent" />
            <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                Ecosystem — 2026
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">CH</p>
            </div>
          </div>

          {/* AI & Protocoles */}
          <div className="mb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-aegryn-apex mb-6">
              / {tAssets('categories.ai')}
            </p>
            <div className="assets-grid grid gap-4 sm:grid-cols-2">
              {aiAssets.map(a => <AssetCard key={a.name} asset={a} />)}
            </div>
          </div>

          {/* Services & Lifestyle */}
          <div className="mb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-aegryn-apex mb-6">
              / {tAssets('categories.lifestyle')}
            </p>
            <div className="assets-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lifestyleAssets.map(a => <AssetCard key={a.name} asset={a} />)}
            </div>
          </div>

          {/* Transactions & Réseau */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-aegryn-apex mb-6">
              / {tAssets('categories.transactions')}
            </p>
            <div className="assets-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {transactionAssets.map(a => <AssetCard key={a.name} asset={a} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — ADVISORY STRIP ─────────────────────── */}
      <section className="bg-aegryn-navy" aria-label="Aegryn Advisory">
        <div className="mx-auto max-w-7xl px-6 py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-aegryn-apex mb-3">Advisory</p>
            <h2 className="font-display text-3xl font-black tracking-tighter text-aegryn-white sm:text-4xl max-w-xl">
              {tAdvisory('strip')}
            </h2>
          </div>
          <Link
            href="/advisory"
            className="group flex shrink-0 items-center gap-3 rounded-full border border-white/20 px-6 py-3 font-display text-sm font-bold text-aegryn-white transition-all hover:border-aegryn-apex hover:bg-aegryn-apex hover:text-aegryn-obsidian"
          >
            {tAdvisory('cta')}
            <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </Link>
        </div>
      </section>

      {/* ── SECTION 5 — CHIFFRES ───────────────────────────── */}
      <section className="border-t border-aegryn-border" aria-label="Chiffres clés">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-wrap items-center justify-center gap-0 divide-x divide-aegryn-border">
            {[
              { value: '06', label: tStats('assets') },
              { value: '06', label: tStats('languages') },
              { value: 'CH',  label: tStats('base') },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center px-12 py-6">
                <span className="font-display text-5xl font-black tracking-tighter text-aegryn-cream">
                  {value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-aegryn-muted mt-2">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
