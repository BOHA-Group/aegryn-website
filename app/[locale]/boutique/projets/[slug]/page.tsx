import { notFound }          from 'next/navigation'
import { Link } from '@/i18n/navigation'
import Image                  from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { Aegryn_ASSETS, assetPath } from '@/data/assets'
import { INDUSTRIES, getLocaleText, type Industry, type IndustrySector } from '@/data/industries'
import { getTranslations }    from 'next-intl/server'
import type { Metadata }      from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

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
    'An Aegryn company',
  ] : []
  return generateAegrynMetadata({
    title: isNeediu ? 'neediu — Services à domicile, paru dans Gala | Aegryn' : asset.name,
    description: isNeediu
      ? 'neediu, application de mise en relation avec des prestataires à domicile. Paru dans Gala, 27 novembre 2025. Un actif propriétaire Aegryn.'
      : tItemsMeta(`${asset.id}.tagline`),
    path: assetPath(slug),
    locale,
    keywords: neediuKeywords,
  })
}

export default async function AssetPage({ params }: Props) {
  const { locale, slug } = await params
  const t       = await getTranslations({ locale, namespace: 'assetPage' })
  const tAssets  = await getTranslations({ locale, namespace: 'assets.page' })
  const tItems   = await getTranslations({ locale, namespace: 'assets.items' })
  const asset = Aegryn_ASSETS.find((a) => a.slug === slug && a.id !== 'kryv')
  if (!asset) notFound()

  const assetId = asset.id as 'subblink' | 'neediu' | 'primiom' | 'movtoo' | 'hobconnect' | 'heritix' | 'chrosium' | 'insertdry'
  const hasAssetI18n = ['subblink', 'neediu', 'primiom', 'movtoo', 'hobconnect', 'heritix', 'chrosium', 'insertdry'].includes(assetId)
  const longDesc  = hasAssetI18n ? t(`assets.${assetId}.longDesc`) : tItems(`${asset.id}.description`)
  const audience  = hasAssetI18n ? t(`assets.${assetId}.audience`) : ''
  const features  = hasAssetI18n ? (t.raw(`assets.${assetId}.features`) as string[]) : []
  const need      = hasAssetI18n ? t(`assets.${assetId}.need`) : ''
  const skills    = hasAssetI18n ? (t.raw(`assets.${assetId}.skills`) as string[]) : []
  const orgs      = hasAssetI18n ? t(`assets.${assetId}.orgs`) : ''

  const isLive   = !!asset.url

  /* Secteur de rattachement (eyebrow hero) */
  const sectorRef = asset.industrySector
    ? INDUSTRIES.find((i) => i.slug === asset.industrySector!.industry)?.sectors[asset.industrySector.sectorIndex]
    : undefined
  const sectorName = sectorRef ? getLocaleText(sectorRef.name, locale) : ''

  /* Mini-covers des secteurs /industries où la capacité se transpose */
  const sectorCovers = (asset.transposeSectors ?? []).map((ref) => {
    const industry = INDUSTRIES.find((i) => i.slug === ref.industry)
    const sector = industry?.sectors[ref.sectorIndex]
    return sector ? { industry: industry!, sector } : null
  }).filter((s): s is { industry: Industry; sector: IndustrySector } => !!s)

  return (
    <>

      {/* Hero — même format que les pages métiers (image plein cadre sur navy) */}
      <section
        className="relative overflow-hidden bg-ag-navy pt-36 pb-24 px-6 md:px-12"
        style={{ minHeight: 'clamp(460px,50vw,620px)' }}
      >
        {asset.image && (
          <Image
            src={asset.image}
            alt={tItems(`${asset.id}.tagline`)}
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/70 via-ag-navy/60 to-ag-navy/95" />
        <div className="relative max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {sectorName}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-4xl mb-6 text-balance"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {tItems(`${asset.id}.capability`)}
          </h1>

          {isLive && (
            <a
              href={asset.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('visit')} {asset.name}
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </section>

      {/* Divider strip */}
      <div className="h-px bg-gradient-to-r from-transparent via-ag-apex/40 to-transparent" />

      {/* Rubriques en cartes — template carte du site */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid md:grid-cols-2 gap-3">

            {/* Carte : Le besoin + Savoir-faire mobilisé */}
            <div className="rounded-2xl border border-ag-border p-8 md:p-10 flex flex-col gap-10">
              <div>
                <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-6">
                  {t('rubricNeed')}
                </p>
                <p className="font-sans font-semibold text-[16px] text-ag-black leading-relaxed mb-4">
                  {tItems(`${asset.id}.tagline`)}
                </p>
                <p className="text-[15px] text-ag-dark leading-[1.8]">
                  {need}
                </p>
              </div>
              {skills.length > 0 && (
                <div>
                  <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-6">
                    {t('rubricSkills')}
                  </p>
                  <ul className="space-y-2">
                    {skills.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.75 w-4 h-4 shrink-0 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-ag-apex" />
                        </span>
                        <span className="text-[15px] text-ag-gray leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Carte navy : Ce que nous avons mis en place */}
            <div className="rounded-2xl bg-ag-navy p-8 md:p-10 flex flex-col gap-10">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/70 mb-6">
                  {t('rubricSetup')}
                </p>
                <p className="text-[15px] text-white leading-[1.8] mb-6">
                  {longDesc}
                </p>
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.75 w-4 h-4 shrink-0 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-ag-apex" />
                      </span>
                      <span className="text-[15px] text-white/70 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
                {audience && (
                  <div className="mt-8 pt-6">
                    <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex mb-2"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('audience')}</p>
                    <p className="text-[15px] text-white/70">{audience}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secteurs où elle se transpose — mini-covers */}
      {(orgs || sectorCovers.length > 0) && (
        <section className="border-b border-ag-border">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
            <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
              {t('rubricOrgs')}
            </p>
            {orgs && (
              <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-10">{orgs}</p>
            )}
            {sectorCovers.length > 0 && (
              <div className={`grid grid-cols-2 gap-3 ${sectorCovers.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                {sectorCovers.map(({ industry, sector }) => {
                  const sectorName = getLocaleText(sector.name, locale)
                  return (
                    <Link
                      key={`${industry.slug}-${sectorName}`}
                      href={`/industries/${industry.slug}` as never}
                      className="group relative overflow-hidden rounded-xl flex flex-col justify-end"
                      style={{ height: 'clamp(150px,14vw,200px)' }}
                    >
                      <Image
                        src={sector.img}
                        alt={sectorName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      <div className="relative z-10 p-4 flex items-end justify-between gap-2">
                        <h3 className="font-sans font-bold text-white text-[13px] leading-[1.15] tracking-[-0.02em]">
                          {sectorName}
                        </h3>
                        <ArrowUpRight size={13} className="text-white/70 group-hover:text-white transition-colors shrink-0 mb-0.5" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
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
            url:           'https://aegryn.com/fr/boutique/projets/neediu',
            image:         'https://aegryn.com/images/press/press-gala-neediu-ad.png',
            author:        { '@type': 'Organization', name: 'Gala', url: 'https://gala.fr' },
            publisher:     { '@type': 'Organization', name: 'Gala', url: 'https://gala.fr' },
            about: {
              '@type':     'MobileApplication',
              name:        'neediu',
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
              {t('press.press')}
            </p>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Badge */}
              <div className="shrink-0">
                <Image
                  src="/images/press/press-gala-badge.png"
                  alt={t('press.neediu.altBadge')}
                  width={220}
                  height={160}
                  className="object-contain"
                />
              </div>
              {/* Couverture */}
              <div className="shrink-0">
                <Image
                  src="/images/press/press-gala-cover.png"
                  alt={t('press.neediu.altCover')}
                  width={200}
                  height={266}
                  className="object-cover shadow-md"
                />
              </div>
              {/* Pub neediu */}
              <div className="flex-1 max-w-sm">
                <Image
                  src="/images/press/press-gala-neediu-ad.png"
                  alt={t('press.neediu.altAd')}
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
              {t('press.press')}
            </p>

            {/* 3 items sur la même ligne — centrés */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

              {/* 1 — Logo partenaire */}
              <div className="shrink-0 flex flex-col gap-3">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light">{t('press.partner')}</p>
                <div className="rounded-lg border border-ag-border bg-ag-white px-5 py-5 w-[200px] flex flex-col items-center text-center gap-3">
                  <Image
                    src="/images/press/press-village-justice-logo.png"
                    alt={t('press.subblink.partnerName')}
                    width={150}
                    height={75}
                    className="object-contain"
                  />
                  <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ag-gray-light leading-tight whitespace-pre-line">
                    {t('press.subblink.partnerStats')}
                  </p>
                  <div className="w-full pt-3 flex flex-col items-center gap-1">
                    <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ag-gray-light">{t('press.partnerCode')}</p>
                    <p className="font-mono text-[12px] font-bold text-ag-apex-ink tracking-widest">LEGI-4141-01</p>
                  </div>
                  <p className="font-mono text-[10px] text-ag-gray-light">{t('press.publishedOn')}</p>
                </div>
              </div>

              {/* 2 — Carte article */}
              <div className="shrink-0 flex flex-col gap-3">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light">{t('press.article')}</p>
                <div className="border border-ag-border bg-ag-white w-[260px]">
                  <div className="rounded-lg bg-ag-navy px-5 py-3 flex items-center">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/70">{t('press.subblink.partnerName')}</span>
                  </div>
                  <div className="px-5 py-5 flex flex-col gap-3">
                    <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">{t('press.publishedOn')}</p>
                    <p className="font-sans font-bold text-[13px] text-ag-black leading-snug">
                      {t('press.subblink.articleTitle')}
                    </p>
                    <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                      {t('press.subblink.articleDesc')}
                    </p>
                    <a
                      href="https://www.village-justice.com/articles/village-justice-vous-propose-faire-auditer-tous-vos-contrats-obtenir-score-des,57640.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ag-black border-t border-ag-border pt-3 mt-1 hover:text-ag-apex-ink transition-colors"
                    >
                      {t('press.readArticle')} <ArrowUpRight size={10} />
                    </a>
                  </div>
                </div>
              </div>

              {/* 3 — Banner subblink */}
              <div className="flex flex-col gap-3 shrink-0">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light">{t('press.visual')}</p>
                <Image
                  src="/images/assets/subblink-banner.jpeg"
                  alt={t('press.subblink.altBanner')}
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
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex mb-4"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('cta.label')}</p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('cta.title')}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 lg:shrink-0">
            <Link
              href="/what-we-build"
              className="rounded-lg inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
            >
              {t('cta.allAssets')}
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href={`/contact?subject=general&projet=${asset.id}` as never}
              className="rounded-lg inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase bg-ag-apex text-ag-navy px-6 py-3 hover:bg-ag-apex/90 transition-colors"
            >
              {tAssets('compareCta')}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
