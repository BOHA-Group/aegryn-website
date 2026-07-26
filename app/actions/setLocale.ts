'use server'

import { cookies } from 'next/headers'

const SUPPORTED = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
type Locale = typeof SUPPORTED[number]

/**
 * Server Action — pose le cookie ag-locale-pref et retourne le chemin cible.
 * Pas de redirect() : en Next.js 15, redirect() dans une Server Action throw
 * NEXT_REDIRECT, ce qui est capturé comme erreur dans certains contextes React
 * et produit "This page couldn't load".
 * Le client navigue via window.location.assign apres reception du chemin.
 */
export async function setLocaleCookie(locale: string, returnPath: string): Promise<string> {
  const safe: Locale = (SUPPORTED as readonly string[]).includes(locale)
    ? (locale as Locale)
    : 'fr'

  const cookieStore = await cookies()
  cookieStore.set('ag-locale-pref', safe, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  })

  return returnPath
}
