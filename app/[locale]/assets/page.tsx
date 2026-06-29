import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import { AssetsGrid } from '@/components/sections/assets/AssetsGrid'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.page.meta' })
  return { title: t('title'), description: t('desc') }
}

export default function AssetsPage() {
  const t = useTranslations('assets.page')

  return (
    <main id="main">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,76px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl">
            {t('desc')}
          </p>
        </div>
      </section>

      {/* Filterable grid */}
      <AssetsGrid />
    </main>
  )
}
