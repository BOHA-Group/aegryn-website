import { notFound }          from 'next/navigation'
import Link                   from 'next/link'
import Image                  from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { Aegryn_ASSETS } from '@/data/assets'
import { getTranslations }    from 'next-intl/server'
import type { Metadata }      from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

const STATUS_DOT: Record<string, { dot: string; text: string }> = {
  live:        { dot: 'bg-ag-live',       text: 'text-ag-live'       },
  beta:        { dot: 'bg-ag-beta',       text: 'text-ag-beta'       },
  dev:         { dot: 'bg-ag-gray-light', text: 'text-ag-gray-light' },
  not_started: { dot: 'bg-ag-gray-light', text: 'text-ag-gray-light' },
} as const

const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl']

export async function generateStaticParams() {
  const assets = Aegryn_ASSETS.filter((a) => a.id !== 'kryv')
  return LOCALES.flatMap((locale) =>
    assets.map((a) => ({ locale, slug: a.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const asset = Aegryn_ASSETS.find((a) => a.slug === slug && a.id !== 'kryv')
  if (!asset) return {}
  const tItemsMeta = await getTranslations({ locale, namespace: 'assets.items' })
  const isNeediu = asset.id === 'neediu'
  const neediuKeywords = isNeediu ? [
    'neediu', 'neediu app', 'services à domicile', 'marketplace services maison',
    'paru dans Gala', 'Gala 27 novembre 2025', 'neediu Gala presse',
    'booking prestataire domicile', 'aide à domicile app', 'service à la personne digital',
    'application home services', 'jardinage app', 'bricolage app', 'babysitting app',
    'neediu.app', 'An Aegryn company',
  ] : []
  return generateAegrynMetadata({
    title: isNeediu ? 'neediu — Services à domicile, paru dans Gala | Aegryn' : asset.name,
    description: isNeediu
      ? 'neediu, application de mise en relation avec des prestataires à domicile. Paru dans Gala, 27 novembre 2025. Un actif propriétaire Aegryn.'
      : tItemsMeta(`${asset.id}.tagline`),
    path: `/assets/${slug}`,
    locale,
    keywords: neediuKeywords,
  })
}

export default async function AssetPage({ params }: Props) {
  const { locale, slug } = await params
  const t       = await getTranslations({ locale, namespace: 'assetPage' })
  const tStatus = await getTranslations({ locale, namespace: 'assetStatus' })
  const tFooter  = await getTranslations({ locale, namespace: 'footer' })
  const tItems   = await getTranslations({ locale, namespace: 'assets.items' })
  const tCats    = await getTranslations({ locale, namespace: 'assets.items.categories' })
  const asset = Aegryn_ASSETS.find((a) => a.slug === slug && a.id !== 'kryv')
  if (!asset) notFound()

  const assetId = asset.id as 'subblink' | 'neediu' | 'primiom' | 'movtoo' | 'hobconnect'
  const hasAssetI18n = ['subblink', 'neediu', 'primiom', 'movtoo', 'hobconnect'].includes(assetId)
  const longDesc  = hasAssetI18n ? t(`assets.${assetId}.longDesc`) : tItems(`${asset.id}.description`)
  const audience  = hasAssetI18n ? t(`assets.${assetId}.audience`) : ''
  const features  = hasAssetI18n ? (t.raw(`assets.${assetId}.features`) as string[]) : []

  const statusKey = asset.status as keyof typeof STATUS_DOT
  const statusDot = STATUS_DOT[statusKey] ?? STATUS_DOT.not_started
  const statusLabel = statusKey === 'live' ? tStatus('live')
    : statusKey === 'beta' ? tStatus('beta')
    : statusKey === 'dev'  ? tStatus('dev')
    : tStatus('notStarted')
  const categoryLabel = tCats(asset.category)
  const isLive   = !!asset.url

  return (
    <>

      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-28">
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-ag-gray-light border border-ag-border px-3 py-1">
              {categoryLabel}
            </span>
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase border border-ag-border px-3 py-1 text-ag-gray-light">
              {tItems(`${asset.id}.badge`)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot.dot}`} />
              <span className={`font-sans font-semibold text-[10px] tracking-[0.14em] uppercase ${statusDot.text}`}>
                {statusLabel}
              </span>
            </span>
          </div>

          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.18] max-w-3xl mb-6"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {asset.name}
          </h1>
          <p className="font-sans font-semibold text-[14px] text-ag-gray leading-relaxed max-w-xl mb-10">
            {tItems(`${asset.id}.tagline`)}
          </p>

          {isLive ? (
            <a
              href={asset.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-navy transition-colors"
            >
              {t('visit')} {asset.name}
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-3 border border-ag-border text-ag-gray-light font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 cursor-default select-none">
              {t('comingSoon')}
            </span>
          )}
        </div>
      </section>

      {/* Divider strip */}
      <div className="h-px bg-gradient-to-r from-transparent via-ag-apex/40 to-transparent" />

      {/* Description + features */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ag-border">

            {/* Long description */}
            <div className="py-20 md:pr-16">
              <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                {t('presentation')}
              </p>
              <p className="text-[15px] text-ag-dark leading-[1.8]">
                {longDesc}
              </p>
              {audience && (
                <div className="mt-10 pt-8 border-t border-ag-border">
                  <p className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-2">
                    {t('audience')}
                  </p>
                  <p className="text-[14px] text-ag-gray">{audience}</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="py-20 md:pl-16">
              <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                {t('features')}
              </p>
              <ul className="space-y-4">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-[3px] w-4 h-4 shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-ag-apex" />
                    </span>
                    <span className="text-[14px] text-ag-gray leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </section>

      {/* Neediu legal notice — only on the neediu page */}
      {asset.id === 'neediu' && (
        <div className="border-b border-ag-border bg-ag-off-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-end">
            <Link
              href="/data-protection-notice-neediu"
              className="font-sans font-semibold text-[10px] tracking-[0.16em] uppercase text-ag-gray-light hover:text-ag-black transition-colors"
            >
              {tFooter('neediuLegal')}
            </Link>
          </div>
        </div>
      )}

      {/* Neediu press — Gala */}
      {asset.id === 'neediu' && (
        <>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context':    'https://schema.org',
            '@type':       'NewsArticle',
            headline:      'neediu — Services à domicile à 360° | Paru dans Gala',
            description:   'neediu, l\'application de mise en relation avec des prestataires à domicile de confiance, présentée dans le magazine Gala le 27 novembre 2025.',
            datePublished: '2025-11-27',
            url:           'https://aegryn.com/fr/assets/neediu',
            image:         'https://aegryn.com/images/press-gala-neediu-ad.png',
            author:        { '@type': 'Organization', name: 'Gala', url: 'https://gala.fr' },
            publisher:     { '@type': 'Organization', name: 'Gala', url: 'https://gala.fr' },
            about: {
              '@type':     'MobileApplication',
              name:        'neediu',
              url:         'https://neediu.app',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'iOS, Android',
              description: 'Application de mise en relation avec des prestataires de services à domicile : ménage, jardinage, bricolage, babysitting, aide aux seniors.',
            },
            isPartOf: {
              '@type':   'Periodical',
              name:      'Gala',
              issn:      '1163-5053',
              publisher: { '@type': 'Organization', name: 'Prisma Media' },
            },
            mentions: {
              '@type':   'Organization',
              name:      'Aegryn',
              url:       'https://aegryn.com',
            },
          }) }}
        />
        <section className="border-b border-ag-border bg-ag-off-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
            <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
              PRESSE
            </p>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Badge */}
              <div className="shrink-0">
                <Image
                  src="/images/press-gala-badge.png"
                  alt="Paru dans Gala — 27 novembre 2025"
                  width={220}
                  height={160}
                  className="object-contain"
                />
              </div>
              {/* Couverture */}
              <div className="shrink-0">
                <Image
                  src="/images/press-gala-cover.png"
                  alt="Couverture Gala — 27 novembre 2025"
                  width={200}
                  height={266}
                  className="object-cover shadow-md"
                />
              </div>
              {/* Pub neediu */}
              <div className="flex-1 max-w-sm">
                <Image
                  src="/images/press-gala-neediu-ad.png"
                  alt="Publicité neediu dans Gala"
                  width={380}
                  height={480}
                  className="object-contain w-full shadow-md"
                />
              </div>
            </div>
          </div>
        </section>
        </>
      )}

      {/* Subblink press — Village de la Justice */}
      {asset.id === 'subblink' && (
        <>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context':    'https://schema.org',
            '@type':       'NewsArticle',
            headline:      'Village de la Justice vous propose de faire auditer tous vos contrats',
            description:   'Village de la Justice présente subblink comme une solution IA unique : ContractScore de A à E, analyse en 60 secondes, verdict SIGNER · NÉGOCIER · REFUSER. Code partenaire LEGI-4141-01.',
            datePublished: '2026-07-16',
            url:           'https://www.village-justice.com/articles/village-justice-vous-propose-faire-auditer-tous-vos-contrats-obtenir-score-des,57640.html',
            author:        { '@type': 'Organization', name: 'Village de la Justice', url: 'https://www.village-justice.com' },
            publisher:     { '@type': 'Organization', name: 'Village de la Justice', url: 'https://www.village-justice.com' },
            about: {
              '@type':     'SoftwareApplication',
              name:        'subblink',
              url:         'https://subblink.com',
              applicationCategory: 'BusinessApplication',
              description: 'Analyseur de contrats par IA. ContractScore A-E, droit suisse et européen, verdict clause par clause.',
            },
            mentions: {
              '@type': 'Organization',
              name:    'Aegryn',
              url:     'https://aegryn.com',
            },
          }) }}
        />
        <section className="border-b border-ag-border bg-ag-off-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
            <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
              PRESSE
            </p>

            {/* 3 items sur la même ligne — centrés */}
            <div className="flex flex-col md:flex-row gap-8 items-start justify-center">

              {/* 1 — Logo partenaire — référence w-200 */}
              <div className="shrink-0 flex flex-col gap-3">
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-gray-light">Partenaire</p>
                <div className="border border-ag-border bg-ag-white px-5 py-5 w-[200px] flex flex-col items-center text-center gap-3">
                  <Image
                    src="/images/press-village-justice-logo.png"
                    alt="Village de la Justice — By Legi Team"
                    width={150}
                    height={75}
                    className="object-contain"
                  />
                  <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-ag-gray-light leading-tight">
                    158 140 membres<br />1 100 000 visites/mois
                  </p>
                  <div className="w-full pt-3 border-t border-ag-border flex flex-col items-center gap-1">
                    <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-ag-gray-light">Code partenaire</p>
                    <p className="font-mono text-[12px] font-bold text-ag-apex tracking-widest">LEGI-4141-01</p>
                  </div>
                  <p className="font-mono text-[8px] text-ag-gray-light">16 juillet 2026</p>
                </div>
              </div>

              {/* 2 — Carte article — w-260 (+30% vs logo) */}
              <div className="shrink-0 flex flex-col gap-3">
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-gray-light">Article</p>
                <div className="border border-ag-border bg-ag-white w-[260px]">
                  <div className="bg-ag-navy px-5 py-3 flex items-center">
                    <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/80">Village de la Justice</span>
                  </div>
                  <div className="px-5 py-5 flex flex-col gap-3">
                    <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-ag-gray-light">16 juillet 2026</p>
                    <p className="font-sans font-bold text-[13px] text-ag-black leading-snug">
                      Village de la Justice vous propose de faire auditer en ligne tous vos contrats et d&apos;obtenir un ContractScore
                    </p>
                    <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                      ContractScore de A à E, analyse en 60 secondes, verdict <strong>SIGNER ✓ · NÉGOCIER ⚑ · REFUSER ✗</strong>. Contre-propositions rédigées clause par clause.
                    </p>
                    <a
                      href="https://www.village-justice.com/articles/village-justice-vous-propose-faire-auditer-tous-vos-contrats-obtenir-score-des,57640.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase text-ag-black border-t border-ag-border pt-3 mt-1 hover:text-ag-apex transition-colors"
                    >
                      Lire l&apos;article <ArrowUpRight size={10} />
                    </a>
                  </div>
                </div>
              </div>

              {/* 3 — Banner subblink — 50% réduit */}
              <div className="flex flex-col gap-3 shrink-0">
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-gray-light">Visuel</p>
                <Image
                  src="/images/subblink banner.jpeg"
                  alt="subblink — Analyse contractuelle par IA"
                  width={400}
                  height={267}
                  className="object-contain"
                />
              </div>

            </div>
          </div>
        </section>
        </>
      )}

      {/* CTA strip */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              {t('cta.label')}
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              {t('cta.title')}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/what-we-build"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
            >
              {t('cta.allAssets')}
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-navy bg-ag-apex px-6 py-3 hover:bg-white transition-colors"
            >
              {t('cta.contact')}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
