import { getTranslations }        from 'next-intl/server'
import type { Metadata }           from 'next'
import Link                        from 'next/link'
import { cookies }                 from 'next/headers'
import { createServerClient }      from '@supabase/ssr'
import { ArrowUpRight, Info, Lock } from 'lucide-react'
import CatalogNotifyForm           from './CatalogNotifyForm'
import AuctionAccessRequestForm    from './AuctionAccessRequestForm'
import { checkAuctionCatalogAccess } from '@/lib/auctionAccess'
import { createServiceClient }     from '@/lib/supabase'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.meta' })
  return { title: t('title'), description: t('desc') }
}

function gradeColor(g: string) {
  return g === '★'  ? 'text-ag-grade-star border-ag-grade-star/30'
    : g === 'AAA'   ? 'text-ag-grade-aaa  border-ag-grade-aaa/30'
    : g === 'AA'    ? 'text-ag-grade-aa   border-ag-grade-aa/30'
    : g === 'A'     ? 'text-ag-grade-a    border-ag-grade-a/30'
    : g === 'B'     ? 'text-ag-grade-b    border-ag-grade-b/30'
    : 'text-ag-gray-light border-ag-border'
}

function fmtArr(n: unknown) {
  if (!n) return null
  const v = Number(n)
  if (v >= 1_000_000) return `ARR ${(v / 1_000_000).toFixed(1)}M€`
  if (v >= 1_000)     return `ARR ${(v / 1_000).toFixed(0)}K€`
  return null
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

const GRADES = [
  { key: 'filterAll',  color: '' },
  { key: 'filterStar', color: 'text-ag-grade-star' },
  { key: 'filterAAA',  color: 'text-ag-grade-aaa'  },
  { key: 'filterAA',   color: 'text-ag-grade-aa'   },
  { key: 'filterA',    color: 'text-ag-grade-a'    },
  { key: 'filterB',    color: 'text-ag-grade-b'    },
] as const

export default async function AuctionCatalogPage({ params }: Props) {
  const { locale } = await params
  const t    = await getTranslations({ locale, namespace: 'auction.catalog' })

  /* ── Auth check ── */
  const user = await getSessionUser()

  /* ── Access check : NDA + CGV ── */
  const accessStatus = user
    ? await checkAuctionCatalogAccess(user.id)
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
          href={`/${locale}/assets`}
          className="shrink-0 inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-ag-gray-light border border-ag-border px-4 py-2 hover:border-ag-black hover:text-ag-black transition-colors whitespace-nowrap"
        >
          Portfolio AEGRYN <ArrowUpRight size={11} />
        </Link>
      </div>
    </div>
  )

  /* ── Écran accès requis (non connecté ou NDA/CGV non signés) ── */
  if (accessStatus !== 'ok') {
    return (
      <main id="main" className="bg-ag-white min-h-screen">
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
                  Accès conditionnel
                </p>
                <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] mb-3">
                  Catalogue réservé aux acquéreurs qualifiés
                </h2>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-md mx-auto">
                  Les noms de sociétés et fiches actifs complets sont accessibles uniquement après
                  création de compte, signature du NDA et acceptation des CGV AEGRYN Auction.
                </p>
              </div>

              {/* Étapes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 max-w-2xl w-full text-left">
                {[
                  { n: '01', label: 'Créer un compte acquéreur', done: !!user },
                  { n: '02', label: 'Signer le NDA AEGRYN Auction', done: accessStatus === 'pending_cgv' },
                  { n: '03', label: 'Accepter les CGV', done: false },
                ].map(({ n, label, done }) => (
                  <div key={n} className={`border p-5 flex items-start gap-3 ${done ? 'border-ag-apex/40 bg-ag-apex/5' : 'border-ag-border bg-ag-white'}`}>
                    <span className={`font-mono text-[11px] font-bold shrink-0 ${done ? 'text-ag-apex' : 'text-ag-gray-light'}`}>{n}</span>
                    <p className={`font-sans text-[13px] leading-snug ${done ? 'text-ag-black' : 'text-ag-gray'}`}>{label}</p>
                    {done && <span className="ml-auto text-ag-apex text-[11px] font-mono">✓</span>}
                  </div>
                ))}
              </div>

              {!user && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Link
                    href={`/${locale}/client/login?next=/${locale}/auction/catalog`}
                    className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-black transition-colors"
                  >
                    Se connecter <ArrowUpRight size={12} />
                  </Link>
                  <Link
                    href={`/${locale}/client/register?next=/${locale}/auction/catalog`}
                    className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:border-ag-black hover:text-ag-black transition-all"
                  >
                    Créer un compte
                  </Link>
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
              Vous souhaitez lister votre actif dans le prochain catalogue ?
            </p>
            <Link
              href={`/${locale}/auction/how-to-sell`}
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
    <main id="main" className="bg-ag-white min-h-screen">
      {Header}
      {ThirdPartyBanner}

      {/* Grade filters */}
      <section className="border-b border-ag-border bg-ag-white sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 overflow-x-auto py-3">
          {GRADES.map(({ key, color }) => (
            <button
              key={key}
              className={`font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 border border-ag-border hover:border-ag-black transition-colors whitespace-nowrap ${color || 'text-ag-gray'}`}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </section>

      {/* Grille actifs */}
      <section id="notify" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {publishedAssets.length > 0 ? (
            <>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                {publishedAssets.length} actif{publishedAssets.length > 1 ? 's' : ''} — session en cours
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border mb-16">
                {publishedAssets.map((asset) => (
                  <div key={asset.id} className="bg-ag-white p-8 flex flex-col gap-4 hover:bg-ag-off-white transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`border px-3 py-1 font-mono font-bold text-[14px] ${gradeColor(asset.official_grade ?? '')}`}>
                        {asset.official_grade ?? '—'}
                      </div>
                      {asset.score_total != null && (
                        <span className="font-mono text-[10px] text-ag-gray-light">{asset.score_total}/100</span>
                      )}
                    </div>

                    {/* Nom société — visible après NDA/CGV */}
                    {asset.company_name && (
                      <p className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em]">
                        {asset.company_name}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {asset.asset_type && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light border border-ag-border px-2 py-0.5">
                          {asset.asset_type}
                        </span>
                      )}
                      {fmtArr(asset.arr) && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-apex">
                          {fmtArr(asset.arr)}
                        </span>
                      )}
                    </div>

                    {asset.public_summary && (
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed line-clamp-3">
                        {asset.public_summary}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-ag-border">
                      <Link
                        href={`/${locale}/client/buyer/catalogue`}
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ag-black hover:text-ag-apex transition-colors"
                      >
                        Accéder au dossier complet <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <CatalogNotifyForm locale={locale} />
            </>
          ) : (
            <CatalogNotifyForm locale={locale} />
          )}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="font-sans font-semibold text-ag-black text-[18px] max-w-md">
            Vous souhaitez lister votre actif dans le prochain catalogue ?
          </p>
          <Link
            href={`/${locale}/auction/how-to-sell`}
            className="shrink-0 inline-flex items-center gap-2 bg-ag-black text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy transition-colors"
          >
            {t('viewAsset')} →
          </Link>
        </div>
      </section>
    </main>
  )
}
