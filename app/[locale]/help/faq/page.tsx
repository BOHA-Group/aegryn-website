import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata, generateFAQSchema } from '@/lib/seo'
import FaqContent from './FaqContent'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'FAQ | Aegryn',
    description: 'Questions fréquentes sur Aegryn : certification CIFSO 5000, valorisation, accompagnement du cycle de vie des organisations et comptes utilisateurs.',
    path: '/help/faq',
    locale,
    keywords: ['FAQ Aegryn', 'questions fréquentes Aegryn', 'aide Aegryn', 'certification CIFSO FAQ', 'valorisation organisation'],
  })
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faq' })
  const items = t.raw('items') as { q: string; a: string }[]
  const faqSchema = generateFAQSchema(items.map(({ q, a }) => ({ question: q, answer: a })))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqContent />
    </>
  )
}
