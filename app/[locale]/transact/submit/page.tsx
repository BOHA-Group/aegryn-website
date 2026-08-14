import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { Suspense }        from 'react'
import AuctionSubmitForm   from './AuctionSubmitForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auctionSubmit.meta' })
  return { title: t('title'), description: t('desc') }
}

export default function AuctionSubmitPage() {
  return (
    <Suspense>
      <AuctionSubmitForm />
    </Suspense>
  )
}
