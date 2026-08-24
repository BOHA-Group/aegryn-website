import { redirect } from 'next/navigation'

/**
 * /[locale]/magazine/issue-01/web
 * Redirige vers le fichier HTML statique autonome (_web.html).
 * Celui-ci a sa propre navigation sidebar et ne dépend pas du layout Next.js.
 */
export default function MagazineWebPage() {
  redirect('/magazine/issue-01/aegryn-magazine-issue-01_web.html')
}
