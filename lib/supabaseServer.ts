/**
 * Supabase SSR helpers — utilisent les cookies Next.js pour
 * persister la session auth côté serveur (Server Components + API routes).
 *
 * DIFFÉRENT de lib/supabase.ts :
 *   - supabase.ts    → client anon (browser) + service_role (API routes sans auth)
 *   - supabaseServer.ts → client auth-aware (cookies) pour /client/* pages
 */
import { createServerClient } from '@supabase/ssr'
import { cookies }            from 'next/headers'

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Client auth-aware pour Server Components (lit/écrit les cookies auth) */
export async function createAuthClient() {
  const cookieStore = await cookies()
  return createServerClient(url, anonKey, {
    cookies: {
      getAll()            { return cookieStore.getAll() },
      setAll(toSet)       { try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { /* lecture seule en Server Component */ } },
    },
  })
}

/** Retourne la session courante ou null */
export async function getSession() {
  const client = await createAuthClient()
  const { data: { session } } = await client.auth.getSession()
  return session
}

/** Retourne l'utilisateur courant ou null.
 *  Appelle getSession() en premier pour forcer le refresh du access_token
 *  via le refresh_token si expiré — sans ça, getUser() retourne null
 *  après 1h d'inactivité même si la session est toujours valide.
 */
export async function getUser() {
  const client = await createAuthClient()
  const { data: { session } } = await client.auth.getSession()
  if (!session) return null
  return session.user
}
