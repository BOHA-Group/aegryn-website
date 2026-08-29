import { redirect }       from 'next/navigation'
import { cookies }        from 'next/headers'
import type { Metadata }  from 'next'
import { canAccessIssue } from '@/lib/magazineAccess'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aegryn Magazine',
  robots: { index: false, follow: false },
}

/**
 * /magazine/qr — point d'entrée du QR code imprimé sur la cover d'issue-01.
 * Soumis aux mêmes règles d'accès que la page issue (canAccessIssue) :
 * - accessible (public / early_access+cookie / admin / preview) → direct sur l'issue.
 * - sinon → hub /magazine (toujours ouvert), pour découvrir/s'inscrire en attendant.
 */
export default async function MagazineQrPage() {
  const cookieStore = await cookies()
  const localePref  = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const locale      = ['fr','en','de','it','es','nl'].includes(localePref) ? localePref : 'fr'

  const destination = (await canAccessIssue('01'))
    ? `/${locale}/magazine/issue-01`
    : `/${locale}/magazine`

  redirect(destination)
}
