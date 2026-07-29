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
import { cache }              from 'react'

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** Client auth-aware pour Server Components (lit/écrit les cookies auth).
 *  cache() garantit une seule instance par requête RSC, peu importe
 *  combien de layouts appellent cette fonction. */
export const createAuthClient = cache(async () => {
  const cookieStore = await cookies()
  const cookieNames = cookieStore.getAll().map(c => c.name)
  console.log('[supabase] createAuthClient — cookies présents:', cookieNames)
  return createServerClient(url, anonKey, {
    cookies: {
      getAll()            { return cookieStore.getAll() },
      setAll(toSet)       { try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch { /* lecture seule en Server Component */ } },
    },
  })
})

/** Retourne la session courante ou null */
export async function getSession() {
  const client = await createAuthClient()
  const { data: { session } } = await client.auth.getSession()
  return session
}

/** Retourne l'utilisateur courant ou null.
 *  Utilise auth.getUser() (vérification réseau JWT, stateless) plutôt que
 *  getSession() (qui déclenche un refresh réseau si token expiré).
 *  Raison : plusieurs layouts imbriqués appellent getUser() en parallèle dans
 *  la même requête RSC. Si chacun tentait un refresh via getSession(), ils
 *  consommeraient le même refresh_token (rotation Supabase → 1 seul usage
 *  valide) → race condition → le 2e layout obtient null → redirect login.
 *  Le refresh est fait UNE SEULE FOIS dans proxy.ts (middleware) et propagé
 *  dans la requête via req.cookies.set(). Les Server Components lisent le
 *  token frais via cookies() et getUser() le valide sans retenter de refresh.
 */
export const getUser = cache(async () => {
  const client = await createAuthClient()
  const { data: { user }, error } = await client.auth.getUser()
  console.log('[supabase] getUser —', { hasUser: !!user, error: error?.message ?? null })
  if (error || !user) return null
  return user
})
