import { redirect } from 'next/navigation'
import { canAccessIssue } from '@/lib/magazineAccess'

type Props = { params: Promise<{ locale: string }> }

/**
 * /[locale]/magazine/issue-01/web
 * Redirige vers le fichier HTML statique autonome (_web.html).
 * Celui-ci a sa propre navigation sidebar et ne dépend pas du layout Next.js.
 */
export default async function MagazineWebPage({ params }: Props) {
  const { locale } = await params

  if (!(await canAccessIssue('01'))) {
    redirect(`/${locale}/magazine`)
  }

  redirect('/magazine/issue-01/aegryn-magazine-issue-01_web.html')
}
