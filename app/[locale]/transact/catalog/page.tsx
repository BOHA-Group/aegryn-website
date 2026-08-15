import { getTranslations }        from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata }           from 'next'
import NextLink                    from 'next/link'
import { Link }                    from '@/i18n/navigation'
import { cookies }                 from 'next/headers'
import { createServerClient }      from '@supabase/ssr'
import { ArrowUpRight, Info, Lock } from 'lucide-react'
import AuctionAccessRequestForm    from './AuctionAccessRequestForm'
import CatalogFilters              from './CatalogFilters'
import { checkTransactCatalogAccess } from '@/lib/transactAccess'
import { createServiceClient }     from '@/lib/supabase'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.meta' })
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
  const t    = await getTranslations({ locale, namespace: 'transact.catalog' })

  /* ── Auth check ── */
  const user = await getSessionUser()

  /* ── Access check : NDA + CGV ── */
  const accessStatus = user
    ? await checkTransactCatalogAccess(user.id)
    : 'not_authenticated'

  /* ── Header commun (toujours visible) ── */
  const Header = (
    <section className="bg-ag-navy pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
          <span className="w-6 h-px bg-ag-apex/50 inline-block" />
          {t('label')}
        </p>
        <h1
          className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-4 whitespace-pre-line"
          style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
        >
          {t('title')}
        </h1>
        <p className="font-sans text-[15px] text-white/50 max-w-xl">
          {t('desc')}
        </p>
      </div>
    </section>
  )

  /* ── Bannière tiers ── */
  const ThirdPartyBanner = (
    <div className="border-b border-ag-border bg-ag-off-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info size={14} className="text-ag-gray-light mt-0.5 shrink-0" />
          <p className="font-sans text-[12px] text-ag-gray leading-relaxed max-w-2xl">
            {t('thirdPartyNote')}
          </p>
        </div>
        <Link
          href="/assets"
          className="shrink-0 inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-ag-gray-light border border-ag-border px-4 py-2 hover:border-ag-black hover:text-ag-black transition-colors whitespace-nowrap"
        >
          {t('portfolioLink')} <ArrowUpRight size={11} />
        </Link>
      </div>
    </div>
  )

  /* ── Écran accès requis (non connecté ou NDA/CGV non signés) ── */
  if (accessStatus !== 'ok') {
    return (
      <main className="bg-ag-white min-h-screen">
        {Header}
        {ThirdPartyBanner}

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Explications accès */}
            <div className="mb-12 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 border border-ag-border flex items-center justify-center">
                <Lock size={22} className="text-ag-gray-light" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ag-apex mb-3">
                  {t('conditionalAccess')}
                </p>
                <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] mb-3">
                  {t('qualifiedOnly')}
                </h2>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-md mx-auto">
                  {t('accessDesc')}
                </p>
              </div>

              {/* Étapes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 max-w-2xl w-full text-left">
                {[
                  { n: '01', label: t('step1'), done: !!user },
                  { n: '02', label: t('step2'), done: accessStatus === 'pending_cgv' },
                  { n: '03', label: t('step3'), done: false },
                ].map(({ n, label, done }) => (
                  <div key={n} className={`border p-5 flex items-start gap-3 ${done ? 'border-ag-apex/40 bg-ag-apex/5' : 'border-ag-border bg-ag-white'}`}>
                    <span className={`font-mono text-[11px] font-bold shrink-0 ${done ? 'text-ag-apex' : 'text-ag-gray-light'}`}>{n}</span>
                    <p className={`font-sans text-[13px] leading-snug ${done ? 'text-ag-black' : 'text-ag-gray'}`}>{label}</p>
                    {done && <span className="ml-auto text-ag-apex text-[11px] font-mono">✓</span>}
                  </div>
                ))}
              </div>

              {!user && process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <NextLink
                    href={`/client/login?next=/transact/catalog`}
                    className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-black transition-colors"
                  >
                    {t('loginCta')} <ArrowUpRight size={12} />
                  </NextLink>
                  <NextLink
                    href={`/client/register?next=/transact/catalog`}
                    className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:border-ag-black hover:text-ag-black transition-all"
                  >
                    {t('registerCta')}
                  </NextLink>
                </div>
              )}
            </div>

            {/* Formulaire demande accès si connecté mais NDA/CGV manquants */}
            {user && (
              <AuctionAccessRequestForm
                locale={locale}
                userId={user.id}
                userEmail={user.email}
                status={accessStatus as 'pending_nda' | 'pending_cgv'}
              />
            )}
          </div>
        </section>

        {/* Seller CTA */}
        <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="font-sans font-semibold text-ag-black text-[18px] max-w-md">
              {t('sellerCta')}
            </p>
            <Link
              href="/transact/how-to-sell"
              className="shrink-0 inline-flex items-center gap-2 bg-ag-black text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy transition-colors"
            >
              {t('viewAsset')} →
            </Link>
          </div>
        </section>
      </main>
    )
  }

  /* ── Catalogue complet (NDA + CGV validés) ── */
  const supa = createServiceClient()
  const { data } = await supa
    .from('assets')
    .select('id, asset_type, arr, official_grade, score_total, public_summary, published_at, company_name')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const publishedAssets = (data ?? []) as {
    id:             string
    asset_type:     string | null
    arr:            number | null
    official_grade: string | null
    score_total:    number | null
    public_summary: string | null
    published_at:   string | null
    company_name:   string | null
  }[]

  return (
    <main className="bg-ag-white min-h-screen">
      {Header}
      {ThirdPartyBanner}

      <CatalogFilters
        assets={publishedAssets}
        locale={locale}
        labels={{
          filterAll:    t('filterAll'),
          filterStar:   t('filterStar'),
          filterAAA:    t('filterAAA'),
          filterAA:     t('filterAA'),
          filterA:      t('filterA'),
          filterB:      t('filterB'),
          count:        '',
          session:      '',
          arrRanges:    [],
          categories:   [],
          noResults:    t('noResults'),
          resetFilters: t('resetFilters'),
        }}
      />

      {/* Seller CTA */}
      <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="font-sans font-semibold text-ag-black text-[18px] max-w-md">
            {t('sellerCta')}
          </p>
          <Link
            href="/transact/how-to-sell"
            className="shrink-0 inline-flex items-center gap-2 bg-ag-black text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy transition-colors"
          >
            {t('viewAsset')} →
          </Link>
        </div>
      </section>
    </main>
  )
}
