import { getTranslations }   from 'next-intl/server'
import type { Metadata }     from 'next'
import Link                  from 'next/link'
import { ArrowUpRight }      from 'lucide-react'
import CatalogNotifyForm     from './CatalogNotifyForm'
import { createServiceClient } from '@/lib/supabase'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.meta' })
  return { title: t('title'), description: t('desc') }
}

function gradeColor(g: string) {
  return g === '★'  ? 'text-emerald-600 border-emerald-200'
    : g === 'AAA'   ? 'text-blue-700 border-blue-200'
    : g === 'AA'    ? 'text-green-700 border-green-200'
    : g === 'A'     ? 'text-yellow-700 border-yellow-200'
    : 'text-gray-600 border-gray-200'
}

function fmtArr(n: unknown) {
  if (!n) return null
  const v = Number(n)
  if (v >= 1_000_000) return `ARR ${(v / 1_000_000).toFixed(1)}M€`
  if (v >= 1_000)     return `ARR ${(v / 1_000).toFixed(0)}K€`
  return null
}

export default async function AuctionCatalogPage({ params }: Props) {
  const { locale } = await params
  const t    = await getTranslations({ locale, namespace: 'auction.catalog' })
  const supa = createServiceClient()

  /* Actifs publiés — anonymisés (pas de nom vendeur ni email) */
  const { data } = await supa
    .from('assets')
    .select('id, asset_type, arr, official_grade, score_total, public_summary, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const publishedAssets = (data ?? []) as {
    id: string
    asset_type: string | null
    arr: number | null
    official_grade: string | null
    score_total: number | null
    public_summary: string | null
    published_at: string | null
  }[]

  const GRADES = [
    { key: 'filterAll', color: '' },
    { key: 'filterStar', color: 'text-ag-grade-star' },
    { key: 'filterAAA',  color: 'text-ag-grade-aaa'  },
    { key: 'filterAA',   color: 'text-ag-grade-aa'   },
    { key: 'filterA',    color: 'text-ag-grade-a'    },
    { key: 'filterB',    color: 'text-ag-grade-b'    },
  ] as const

  return (
    <main id="main" className="bg-ag-white min-h-screen">
      {/* Header */}
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

      {/* Grille actifs publiés ou état vide */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {publishedAssets.length > 0 ? (
            <>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                {publishedAssets.length} actif{publishedAssets.length > 1 ? 's' : ''} — accès complet post-NDA
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border mb-16">
                {publishedAssets.map((asset) => (
                  <div key={asset.id} className="bg-ag-white p-8 flex flex-col gap-4 hover:bg-ag-off-white transition-colors">
                    {/* Grade badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className={`border px-3 py-1 font-mono font-bold text-[14px] ${gradeColor(asset.official_grade ?? '')}`}>
                        {asset.official_grade ?? '—'}
                      </div>
                      {asset.score_total != null && (
                        <span className="font-mono text-[10px] text-ag-gray-light">{asset.score_total}/100</span>
                      )}
                    </div>
                    {/* Type + ARR */}
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
                    {/* Résumé public */}
                    {asset.public_summary && (
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed line-clamp-3">
                        {asset.public_summary}
                      </p>
                    )}
                    {/* CTA contact */}
                    <div className="mt-auto pt-4 border-t border-ag-border">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ag-black hover:text-ag-apex transition-colors"
                      >
                        Demander l&apos;accès (NDA) <ArrowUpRight size={10} />
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
            href="/auction/how-to-sell"
            className="shrink-0 inline-flex items-center gap-2 bg-ag-black text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy transition-colors"
          >
            {t('viewAsset')} →
          </Link>
        </div>
      </section>
    </main>
  )
}
