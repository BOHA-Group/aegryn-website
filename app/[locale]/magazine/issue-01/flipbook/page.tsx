import { redirect }      from 'next/navigation'
import { canAccessIssue } from '@/lib/magazineAccess'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

/**
 * /[locale]/magazine/issue-01/flipbook
 * Ouvre le flipbook autonome (StPageFlip) en pleine page.
 * Gate : même règles que la page issue (public / early_access+cookie / preview / admin).
 *
 * On rend un meta-refresh HTML au lieu d'un redirect() Next.js pour éviter :
 * - la barre navy du loading.tsx affichée pendant le redirect serveur
 * - l'entrée supplémentaire dans l'historique du navigateur (impossible de revenir)
 */
export default async function MagazineFlipbookPage({ params }: Props) {
  const { locale } = await params

  if (!(await canAccessIssue('01'))) {
    redirect(`/${locale}/magazine`)
  }

  const flipbookUrl = '/magazine/issue-01/aegryn-magazine-issue-01_1.html'

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${flipbookUrl}`} />
        <title>Aegryn Magazine — Flipbook</title>
      </head>
      <body style={{ margin: 0, background: '#0F1A2B' }} />
    </html>
  )
}
