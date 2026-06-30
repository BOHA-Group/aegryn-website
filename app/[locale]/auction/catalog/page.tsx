import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import Link                from 'next/link'
import CatalogNotifyForm   from './CatalogNotifyForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.meta' })
  return { title: t('title'), description: t('desc') }
}

export default async function AuctionCatalogPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.catalog' })

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

      {/* Empty state + formulaire de notification */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <CatalogNotifyForm locale={locale} />
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
