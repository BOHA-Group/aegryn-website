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
    .select('roles')
    .eq('id', user.id)
    .single()

  const roles = (profile?.roles ?? []) as string[]
  if (!roles.includes('admin') && !roles.includes('super_admin')) {
    await client.auth.signOut()
    redirect('/admin/login?error=not_admin')
  }

  return user
}

/**
 * Vérifie l'accès admin : token URL OU session Supabase avec rôle admin.
 * Utiliser dans toutes les sous-pages admin à la place du check token seul.
 */
export async function checkAdminAccess(token?: string): Promise<void> {
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const hasToken = !!adminToken && token === adminToken
  if (!hasToken) {
    await requireAdmin()
  }
}

/** Retourne l'user admin connecté ou null (sans redirection — utilisable dans API routes) */
export async function getAdminUser() {
  try {
    const client = await createAuthClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user) return null

    if (user.app_metadata?.role === 'admin') return user

    const supa = createServiceClient()
    const { data: profile } = await supa
      .from('profiles')
      .select('roles')
      .eq('id', user.id)
      .single()

    const roles = (profile?.roles ?? []) as string[]
    if (roles.includes('admin') || roles.includes('super_admin')) return user
    return null
  } catch {
    return null
  }
}
