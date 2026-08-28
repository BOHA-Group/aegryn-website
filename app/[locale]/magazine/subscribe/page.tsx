import { getTranslations }      from 'next-intl/server'
import Link                      from 'next/link'
import type { Metadata }          from 'next'
import { ArrowUpRight }           from 'lucide-react'
import { PrintWishlistForm }      from '@/components/magazine/PrintWishlistForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.subscribe.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  { canonical: `/${locale}/magazine/subscribe` },
  }
}

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.subscribe' })

  const INTEREST_KEYS = ['market', 'techAi', 'build', 'transaction', 'buyers', 'outlook', 'index', 'people', 'life'] as const
  const labelsRaw = t.raw('interests')    as Record<string, string>
  const descsRaw  = t.raw('interestsDesc') as Record<string, string>
  const interests = INTEREST_KEYS.map(key => ({
    key,
    label: labelsRaw[key] ?? key,
    desc:  descsRaw[key]  ?? '',
  }))

  return (
    <main className="min-h-screen bg-magazine-ivory px-6 py-32">
      <div className="max-w-2xl mx-auto">

        {/* Digital version note */}
        <div className="flex items-start gap-3 bg-magazine-white border border-magazine-black/10 px-6 py-4 mb-12">
          <span className="text-magazine-accent text-[18px] leading-none mt-0.5">→</span>
          <p className="text-label-mag text-magazine-black/60 leading-relaxed">
            {t('digitalNote')}{' '}
            <Link
              href={`/${locale}/magazine/report`}
              className="underline text-magazine-black hover:text-magazine-accent transition-colors"
            >
              {t('digitalNoteCta')}
            </Link>
          </p>
        </div>

        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">
          Aegryn Magazine — {t('printBadge')}
        </p>
        <h1
          className="font-sans font-bold text-magazine-black mb-4"
          style={{ fontSize: 'clamp(32px,4.5vw,56px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
        >
          {t('title')}
        </h1>
        <p className="text-body-mag text-magazine-black/60 mb-12 leading-[1.75]">
          {t('desc')}
        </p>

        <PrintWishlistForm
          civilityLabel={t('civilityLabel')}
          civilityM={t('civilityM')}
          civilityMme={t('civilityMme')}
          firstNamePlaceholder={t('firstNamePlaceholder')}
          lastNamePlaceholder={t('lastNamePlaceholder')}
          emailPlaceholder={t('emailPlaceholder')}
          phonePlaceholder={t('phonePlaceholder')}
          companyPlaceholder={t('companyPlaceholder')}
          addressLabel={t('addressLabel')}
          addressPlaceholder={t('addressPlaceholder')}
          postalCodePlaceholder={t('postalCodePlaceholder')}
          cityPlaceholder={t('cityPlaceholder')}
          countryPlaceholder={t('countryPlaceholder')}
          interestsLabel={t('interestsLabel')}
          interests={interests}
          rgpdLabel={t('rgpdLabel')}
          legalNotice={t('legalNotice')}
          cta={t('cta')}
          successMsg={t('success')}
          errorMsg={t('error')}
          clientNote={t('clientNote')}
        />

        <div className="mt-16 border-t border-magazine-black/10 pt-8">
          <p className="text-label-mag text-magazine-black/30 leading-relaxed">
            {t('disclaimer')}
          </p>
          <Link
            href={`/${locale}/magazine/report`}
            className="mt-4 inline-flex items-center gap-1.5 text-label-mag text-magazine-black/60 uppercase tracking-[0.1em] hover:text-magazine-black transition-colors"
          >
            <ArrowUpRight size={11} /> {t('backToMagazine')}
          </Link>
        </div>
      </div>
    </main>
  )
}
