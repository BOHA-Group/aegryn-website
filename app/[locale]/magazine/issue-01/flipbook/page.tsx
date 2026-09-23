import type { Metadata } from 'next'
import { redirect }      from 'next/navigation'
import { canAccessIssue } from '@/lib/magazineAccess'
import FlipbookContent from './FlipbookContent'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Flipbook | Aegryn Magazine Issue 01',
    description: 'Lisez Aegryn Magazine Issue 01 en version flipbook interactive — The State of European Tech M&A. Tech. Money. Deals. People. Life.',
    robots: { index: false, follow: false },
    alternates: { canonical: `/${locale}/magazine/issue-01/flipbook` },
  }
}

export default async function MagazineFlipbookPage({ params }: Props) {
  const { locale } = await params
  if (!(await canAccessIssue('01'))) redirect(`/${locale}/magazine`)
  return <FlipbookContent />
}
