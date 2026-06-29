import { getTranslations } from 'next-intl/server'
import { Suspense }        from 'react'
import { generateAegrynMetadata, aegrynOrganizationSchema } from '@/lib/seo'
import type { Metadata }  from 'next'
import AlliancesContent   from './AlliancesContent'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'alliances' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/alliances',
    locale,
  })
}

export default async function AlliancesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
      />
      <Suspense>
        <AlliancesContent />
      </Suspense>
    </>
  )
}
