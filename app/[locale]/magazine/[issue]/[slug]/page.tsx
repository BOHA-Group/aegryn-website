import { permanentRedirect } from 'next/navigation'

/**
 * Anciennes pages d'articles du magazine (/magazine/[issue]/[slug]).
 * Le contenu est desormais servi par la web edition de chaque numero
 * (/magazine/[issue], onglet Web Edition) ; ces URL redirigent en 301.
 * Les sous-routes dediees (cover, web, flipbook) ont leurs propres pages
 * et ne passent pas par ce segment dynamique.
 */
type Props = { params: Promise<{ locale: string; issue: string; slug: string }> }

export default async function LegacyMagazineArticleRedirect({ params }: Props) {
  const { locale, issue } = await params
  permanentRedirect(`/${locale}/magazine/${issue}`)
}
