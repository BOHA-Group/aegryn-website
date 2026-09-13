import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import VerifyForm from './VerifyForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'verify' })
  return generateAegrynMetadata({ title: t('metaTitle'), description: t('metaDesc'), path: '/verify', locale })
}

export default async function VerifyIndexPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'verify' })
  return (
    <main className="bg-ag-white min-h-[70vh]">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">{t('eyebrow')}</p>
        <h1 className="font-sans font-bold text-ag-black text-[36px] md:text-[48px] tracking-[-0.03em] leading-[1.05] mb-6">{t('title')}</h1>
        <p className="font-sans text-[17px] text-ag-black/75 leading-relaxed max-w-2xl mb-10">{t('lead')}</p>
        <VerifyForm />
        <div className="mt-16 border-l-4 border-ag-apex pl-6 max-w-2xl">
          <h2 className="font-sans font-bold text-ag-black text-[18px] mb-2">{t('whatTitle')}</h2>
          <p className="font-sans text-[14px] text-ag-black/70 leading-relaxed">{t('whatDesc')}</p>
        </div>
      </section>
    </main>
  )
}
