import { getTranslations }       from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata }         from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Blog — AEGRYN',
    description: 'Analyses, actualités et perspectives sur la certification et la transaction d\'actifs numériques.',
    path: '/blog',
    locale,
  })
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blogPage' })

  return (
    <section className="bg-ag-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-32">
        <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
          {t('label')}
        </p>
        <h1
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] max-w-2xl mb-8"
          style={{ fontSize: 'clamp(40px,5vw,64px)' }}
        >
          {t('title')}
        </h1>
        <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl">
          {t('desc')}
        </p>
      </div>
    </section>
  )
}
