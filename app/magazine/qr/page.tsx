import { redirect }  from 'next/navigation'
import { cookies }   from 'next/headers'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aegryn Magazine',
  robots: { index: false, follow: false },
}

/**
 * /magazine/qr — point d'entrée du QR code imprimé sur la cover.
 * La page hub /magazine est toujours ouverte au public (pas de gate) : on y
 * redirige systématiquement. Seul l'accès direct à une issue verrouillée
 * (via les boutons CTA du hub) reste soumis à canAccessIssue().
 */
export default async function MagazineQrPage() {
  const cookieStore = await cookies()
  const localePref  = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const locale      = ['fr','en','de','it','es','nl'].includes(localePref) ? localePref : 'fr'

  redirect(`/${locale}/magazine`)
}
