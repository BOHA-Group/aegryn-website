import { ARTICLES, type Article } from '@/data/articles'

/** Articles triés du plus ancien au plus récent — ordre d'envoi de la newsletter */
export function getSortedArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Détermine le prochain article à envoyer à un abonné donné son curseur actuel.
 * - lastSentSlug null/undefined → premier article du backlog (nouvel abonné).
 * - lastSentSlug introuvable (article supprimé depuis) → on repart du début.
 * - lastSentSlug = dernier article existant → null (abonné à jour, rien à envoyer).
 */
export function getNextArticleForSubscriber(lastSentSlug: string | null): Article | null {
  const sorted = getSortedArticles()
  if (!lastSentSlug) return sorted[0] ?? null

  const idx = sorted.findIndex((a) => a.slug === lastSentSlug)
  if (idx === -1) return sorted[0] ?? null

  return sorted[idx + 1] ?? null
}
