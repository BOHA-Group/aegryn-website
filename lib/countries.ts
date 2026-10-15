/** Noms de pays localisés et listes classées par ordre alphabétique (selon la langue du visiteur). */
export function countryName(code: string, locale: string): string {
  try { return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code } catch { return code }
}

export function sortAlpha<T>(items: readonly T[], label: (item: T) => string, locale: string): T[] {
  const collator = new Intl.Collator(locale, { sensitivity: 'base' })
  return [...items].sort((a, b) => collator.compare(label(a), label(b)))
}

/** Drapeau emoji dérivé du code ISO (évite les caractères codés en dur). */
export function flagEmoji(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map(ch => 127397 + ch.charCodeAt(0)))
}
