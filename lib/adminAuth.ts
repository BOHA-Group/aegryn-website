/**
 * lib/adminAuth.ts
 * Helpers d'authentification admin (Server Components uniquement).
 * Vérifie session Supabase + rôle admin stocké dans profiles.
 */
import { redirect }            from 'next/navigation'
import { createAuthClient }    from './supabaseServer'
import { createServiceClient } from './supabase'

/** Vérifie session + rôle admin. Redirige vers /admin/login si non autorisé. */
export async function requireAdmin() {
  const client = await createAuthClient()
  const { data: { user } } = await client.auth.getUser()

  if (!user) redirect('/admin/login')

  /* Double vérification : app_metadata (JWT) OU table profiles */
  const isAdminMeta = user.app_metadata?.role === 'admin'
  if (isAdminMeta) return user

  /* Fallback : vérifier la table profiles */
  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    await client.auth.signOut()
    redirect('/admin/login?error=not_admin')
  }

  return user
}

/** Retourne l'user admin connecté ou null (sans redirection) */
export async function getAdminUser() {
  try {
    return await requireAdmin()
  } catch {
    return null
  }
}
