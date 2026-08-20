import { getTranslations }        from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata }           from 'next'
import { Link }                    from '@/i18n/navigation'
import NextLink                    from 'next/link'
import { cookies }                 from 'next/headers'
import { createServerClient }      from '@supabase/ssr'
import { ArrowUpRight, Info, Calendar, MapPin, Users, Bell, Lock } from 'lucide-react'
import Image                       from 'next/image'
import CatalogFilters              from './CatalogFilters'
import CatalogNotifyForm           from './CatalogNotifyForm'
import { checkTransactCatalogAccess } from '@/lib/transactAccess'
import { createServiceClient }     from '@/lib/supabase'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transaction.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/transact/catalog',
    locale,
    image: '/og/transact.jpg',
    keywords: [
      'transact catalog', 'catalogue cession tech', 'buy SaaS company', 'acheter SaaS',
      'digital asset for sale', 'actif numérique à vendre', 'tech M&A deal', 'SaaS for sale',
      'sell digital business', 'acquire tech startup', 'NDA dossier',
    ],
  })
}

async function getSessionUser() {
  const cookieStore = await cookies()
  const supaUser = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supaUser.auth.getUser()
  return user
}

export default async function TransactCatalogPage({ params }: Props) {
  const { locale } = await params
  const tc = await getTranslations({ locale, namespace: 'transaction.catalog' })
  const ts = await getTranslations({ locale, namespace: 'transaction.session' })

  /* ── Auth + access checks ── */
  const user = await getSessionUser()
  const accessStatus = user
    ? await checkTransactCatalogAccess(user.id)
    : 'not_authenticated'
  const hasLotAccess = accessStatus === 'ok'

  /* ── Assets publiés ── */
  const supa = createServiceClient()
  const { data } = await supa
    .from('assets')
    .select('id, slug, asset_type, arr, official_grade, score_total, public_summary, published_at, company_name')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const publishedAssets = (data ?? []) as {
    id:             string
    slug:           string | null
    asset_type:     string | null
    arr:            number | null
    official_grade: string | null
    score_total:    number | null
    public_summary: string | null
    published_at:   string | null
    company_name:   string | null
  }[]

  const sessionDetails = [
    { icon: Calendar, label: ts('date'),     value: ts('dateTbd')       },
    { icon: Users,    label: ts('format'),   value: ts('formatValue')   },
    { icon: MapPin,   label: ts('location'), value: ts('locationValue') },
  ]

  return (
    <main className="bg-ag-white min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {tc('label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-4 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {tc('title')}
          </h1>
          <p className="font-sans text-[15px] text-white/50 max-w-xl">
            {tc('desc')}
          </p>
        </div>
      </section>

      {/* ── Bannière tiers ── */}
      <div className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info size={14} className="text-ag-gray-light mt-0.5 shrink-0" />
            <p className="font-sans text-[12px] text-ag-gray leading-relaxed max-w-2xl">
              {tc('thirdPartyNote')}
            </p>
          </div>
          <Link
            href="/assets"
            className="shrink-0 inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-ag-gray-light border border-ag-border px-4 py-2 hover:border-ag-black hover:text-ag-black transition-colors whitespace-nowrap"
          >
            {tc('portfolioLink')} <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>

      {/* ── Bloc accès conditionnel — visible si non qualifié, avant "Actifs à venir" ── */}
      {!hasLotAccess && publishedAssets.length > 0 && (
        <section className="py-10 px-6 bg-ag-navy/3 border-b border-ag-border">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 border border-ag-apex/40 bg-ag-apex/10 flex items-center justify-center shrink-0 mt-0.5">
                <Lock size={14} className="text-ag-apex" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ag-apex mb-1">
                  {tc('conditionalAccess')}
                </p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                  <span className="font-semibold text-ag-black">{publishedAssets.length}</span>
                  {' '}{tc('assetsAvailable', { count: publishedAssets.length })}
                </p>
              </div>
            </div>
            <NextLink
              href={user
                ? `/${locale}/client/buyer/kyc`
                : `/${locale}/client/register?next=/${locale}/transact/catalog`}
              className="shrink-0 inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-black transition-colors whitespace-nowrap"
            >
              {tc('requestQualifiedAccess')} <ArrowUpRight size={12} />
            </NextLink>
          </div>
        </section>
      )}

      {/* ── Actifs à venir (ex "Prochaine session") ── */}
      <section className="py-16 px-6 border-b border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-6">
            Actifs à venir
          </p>

          {/* Métadonnées session */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {sessionDetails.map(({ icon: Icon, label, value }) => (
              <div key={label} className="border border-ag-border p-5 flex flex-col gap-3">
                <Icon size={14} className="text-ag-apex" />
                <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-gray-light">{label}</p>
                <p className="font-sans font-semibold text-ag-black text-[13px]">{value}</p>
              </div>
            ))}
          </div>

          {/* Card lot */}
          <div className="border border-ag-border bg-ag-white flex flex-col md:flex-row gap-0 md:gap-8 hover:border-ag-black/30 transition-colors">
            {/* Vignette 9:16 */}
            <div className="relative w-full md:w-[140px] shrink-0 bg-ag-off-white overflow-hidden" style={{ aspectRatio: '9 / 16' }}>
              <Image
                src="/images/transact/transact_legal-tech_T32026.jpg"
                alt={ts('sessionCardTitle')}
                fill
                className="object-contain"
                sizes="140px"
              />
              <span className="absolute top-3 left-3 bg-ag-apex text-ag-navy font-mono font-semibold text-[10px] tracking-[0.14em] uppercase px-3 py-1.5">
                {ts('sessionCardStatus')}
              </span>
            </div>

            {/* Détails + CTAs */}
            <div className="flex-1 py-8 pr-8 pl-6 md:pl-0 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-apex-ink mb-2">
                  {ts('sessionCardKicker')} — {ts('sessionCardCategory')}
                </p>
                <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-snug mb-3">
                  {ts('sessionCardTitle')}
                </h2>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-ag-gray">
                  <span className="flex items-center gap-1.5 font-sans text-[12px]">
                    <MapPin size={12} className="text-ag-gray-light" /> {ts('sessionCardLocation')}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-[12px]">
                    <Calendar size={12} className="text-ag-gray-light" /> {ts('sessionCardDateValue')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {hasLotAccess ? (
                  <Link
                    href="/transact/teaser-preview"
                    className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 hover:bg-ag-navy-mid transition-colors"
                  >
                    {ts('sessionCardCtaPreview')}
                  </Link>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-2 bg-ag-off-white border border-ag-border text-ag-gray-light font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 cursor-not-allowed select-none">
                      <Lock size={11} /> {ts('sessionCardCtaPreview')}
                    </span>
                    <p className="font-sans text-[11px] text-ag-gray-light leading-tight">
                      {ts('sessionCardLocked')}
                    </p>
                    <NextLink
                      href="/client/register"
                      className="font-sans text-[11px] font-semibold text-ag-apex-ink underline underline-offset-2 hover:text-ag-apex transition-colors"
                    >
                      {ts('sessionCardLockedCta')} →
                    </NextLink>
                  </div>
                )}
                <Link
                  href={{ pathname: '/transact/catalog', hash: 'notify' }}
                  className="inline-flex items-center gap-2 border border-ag-apex/40 text-ag-apex-ink font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 hover:border-ag-apex hover:bg-ag-apex/10 transition-colors"
                >
                  <Bell size={11} /> {ts('sessionCardCtaNotify')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grille actifs avec filtres ── */}
      <CatalogFilters
        assets={publishedAssets}
        locale={locale}
        accessStatus={accessStatus}
        isAuthenticated={!!user}
        labels={{
          filterAll:         tc('filterAll'),
          filterStar:        tc('filterStar'),
          filterAAA:         tc('filterAAA'),
          filterAA:          tc('filterAA'),
          filterA:           tc('filterA'),
          filterB:           tc('filterB'),
          arrRanges:         [tc('arrAll'), tc('arrBelow100k'), tc('arr100kTo1m'), tc('arr1mTo5m'), tc('arrAbove5m')],
          noResults:         tc('noResults'),
          resetFilters:      tc('resetFilters'),
          resetFiltersShort: tc('resetFiltersShort'),
          viewFullDossier:   tc('viewFullDossier'),
          conditionalAccess: tc('conditionalAccess'),
          qualifiedOnly:     tc('qualifiedOnly'),
          accessDesc:        tc('accessDesc'),
          step1:             tc('step1'),
          step2:             tc('step2'),
          step3:             tc('step3'),
          loginCta:          tc('loginCta'),
          registerCta:       tc('registerCta'),
          kycPending:        tc('kycPending'),
        }}
      />

      {/* ── Notification + Seller CTA — layout 2 colonnes ── */}
      <section id="notify" className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-ag-border">

            {/* Colonne gauche — être notifié */}
            <div className="p-10 md:p-12 border-b lg:border-b-0 lg:border-r border-ag-border">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ag-apex mb-4">
                {tc('emptyTitle')}
              </p>
              <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-tight mb-3">
                {tc('emptyDesc')}
              </h2>
              <CatalogNotifyForm locale={locale} />
            </div>

            {/* Colonne droite — Seller CTA */}
            <div className="p-10 md:p-12 bg-ag-white flex flex-col gap-6 justify-center">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex-ink">
                {ts('sellerTitle')}
              </p>
              <p className="font-sans font-bold text-ag-black text-[22px] leading-snug tracking-[-0.02em]">
                {tc('sellerCta')}
              </p>
              <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
                {ts('sellerDesc')}
              </p>
              <Link
                href="/transact/how-to-sell"
                className="self-start inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
              >
                {tc('viewAsset')} <ArrowUpRight size={13} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Sessions passées ── */}
      <section className="py-16 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-6">
            {ts('pastSessions')}
          </p>
          <p className="font-sans text-[14px] text-ag-gray">{ts('noSessions')}</p>
        </div>
      </section>

    </main>
  )
}
