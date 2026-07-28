import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { generateAegrynMetadata } from '@/lib/seo'
import GradeSubmitForm from './GradeSubmitForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gradeSubmit' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/grade/submit',
    locale,
  })
}

export default function GradeSubmitPage() {
  return (
    <Suspense>
      <GradeSubmitForm />
    </Suspense>
  )
}
