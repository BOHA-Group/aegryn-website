'use client'

import { useEffect, useState } from 'react'

/** Catégories de Cookie-Script : « performance » = mesure d'audience, « targeting » = publicité. */
export type ConsentCategory = 'performance' | 'targeting' | 'functionality'

const EVENTS = ['CookieScriptLoaded', 'CookieScriptAccept', 'CookieScriptAcceptAll', 'CookieScriptReject', 'CookieScriptClose', 'CookieScriptConsentUpdated']

function readCategories(): string[] {
  const m = document.cookie.match(/(?:^|;\s*)CookieScriptConsent=([^;]*)/)
  if (!m?.[1]) return []
  try {
    const raw: unknown = JSON.parse(decodeURIComponent(m[1]))
    const cats = typeof raw === 'object' && raw !== null && 'categories' in raw ? (raw as { categories: unknown }).categories : []
    const list: unknown = typeof cats === 'string' ? JSON.parse(cats) : cats
    return Array.isArray(list) ? list.filter((c): c is string => typeof c === 'string') : []
  } catch {
    return []
  }
}

/**
 * Vrai seulement si le visiteur a donné son accord, via Cookie-Script (cookie `CookieScriptConsent`), à la catégorie demandée.
 * Aucun choix ou refus : faux. Les balises tierces (GTM, pixel) ne doivent se charger qu'ensuite.
 */
export function useCookieScriptConsent(category: ConsentCategory): boolean {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const check = () => setGranted(readCategories().includes(category))
    check()
    EVENTS.forEach((e) => window.addEventListener(e, check))
    return () => EVENTS.forEach((e) => window.removeEventListener(e, check))
  }, [category])

  return granted
}
