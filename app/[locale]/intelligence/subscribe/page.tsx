import { getTranslations }   from 'next-intl/server'
import type { Metadata }      from 'next'
import { SubscribeForm }      from '@/components/magazine/SubscribeForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'intelligence.subscribe.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  { canonical: `/${locale}/intelligence/subscribe` },
  }
}

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'intelligence.subscribe' })

  return (
    <main className="min-h-screen bg-magazine-ivory flex items-center justify-center px-6 py-32">
      <div className="max-w-prose w-full">
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">
          The AEGRYN Report
        </p>
        <h1
          className="font-sans font-bold text-magazine-black mb-4"
          style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
        >
          {t('title')}
        </h1>
        <p className="text-body-mag text-magazine-black/60 mb-12 leading-[1.75]">
          {t('desc')}
        </p>
        <SubscribeForm
          placeholder={t('placeholder')}
          cta={t('cta')}
          successMsg={t('success')}
          errorMsg={t('error')}
        />
      </div>
    </main>
  )
}
