import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { Suspense }        from 'react'
import TransactionSubmitForm from './AuctionSubmitForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transactionSubmit.meta' })
  return { title: t('title'), description: t('desc') }
}

export default function TransactionSubmitPage() {
  return (
    <Suspense>
      <TransactionSubmitForm />
    </Suspense>
  )
}
