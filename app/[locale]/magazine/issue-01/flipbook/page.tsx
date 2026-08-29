import { redirect } from 'next/navigation'
import { canAccessIssue } from '@/lib/magazineAccess'

type Props = { params: Promise<{ locale: string }> }

/**
 * /[locale]/magazine/issue-01/flipbook
 * "Feuilleter le PDF" — ouvre le flipbook autonome (StPageFlip) en pleine page.
 * Même logique d'accès que la page de l'issue (public / early_access + cookie / preview).
 */
export default async function MagazineFlipbookPage({ params }: Props) {
  const { locale } = await params

  if (!(await canAccessIssue('01'))) {
    redirect(`/${locale}/magazine`)
  }

  redirect('/magazine/issue-01/aegryn-magazine-issue-01_1.html')
}
