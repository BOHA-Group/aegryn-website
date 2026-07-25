'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SUPPORTED = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
type Locale = typeof SUPPORTED[number]

/**
 * Server Action — pose le cookie ag-locale-pref et redirige vers la même URL.
 * Utilisé par LanguageSwitcher pour éviter window.location.reload()
 * qui déclenche la popup "Recharger la page ?" du navigateur.
 */
export async function setLocaleCookie(locale: string, returnPath: string) {
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

  redirect(returnPath)
}
