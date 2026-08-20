/**
 * lib/adminAuth.ts
 * Helpers d'authentification admin (Server Components uniquement).
 * Vérifie session Supabase + rôle admin stocké dans profiles.
 *
 * Token URL (?token=xxx) :
 *  - Accepté à la première requête pour rétrocompatibilité
 *  - Immédiatement transformé en cookie httpOnly (aegryn-admin-token)
 *  - Le token n'est plus propagé en clair dans les URLs après la première validation
 */
import { redirect }            from 'next/navigation'
import { cookies }             from 'next/headers'
import { createAuthClient }    from './supabaseServer'
import { createServiceClient } from './supabase'

const ADMIN_TOKEN_COOKIE = 'aegryn-admin-token'

/**
 * Si un token URL valide est fourni, le persiste en cookie httpOnly
 * pour que les pages suivantes n'aient plus besoin du query param.
 */
async function persistTokenAsCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/admin',
    maxAge:   60 * 60 * 8, // 8h
  })
}

/** Vérifie session + rôle admin. Redirige vers /admin/login si non autorisé. */
export async function requireAdmin() {
  const client = await createAuthClient()
  const { data: { user } } = await client.auth.getUser()

  if (!user) redirect('/admin/login')

  /* Double vérification : app_metadata (JWT) OU table profiles */
  const isAdminMeta = user.app_metadata?.role === 'admin'
  if (isAdminMeta) return user

  /* Fallback : vérifier la table profiles — colonne role (string) ET roles (array) */
  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('role, roles')
    .eq('id', user.id)
    .single()

  const roleStr = (profile?.role ?? '') as string
  const roles   = (profile?.roles ?? []) as string[]
  const isAdmin =
    roleStr === 'admin' ||
    roleStr === 'super_admin' ||
    roles.includes('admin') ||
    roles.includes('super_admin')

  if (!isAdmin) {
    await client.auth.signOut()
    redirect('/admin/login?error=not_admin')
  }

  return user
}

/**
 * Vérifie l'accès admin : token URL OU cookie httpOnly OU session Supabase avec rôle admin.
 *
 * Ordre de vérification :
 *  1. Token URL valide → persiste en cookie httpOnly → accès accordé
 *  2. Cookie httpOnly aegryn-admin-token valide → accès accordé
 *  3. Session Supabase avec rôle admin → accès accordé
 *  4. Sinon → redirect /admin/login
 */
export async function checkAdminAccess(token?: string): Promise<void> {
  const adminToken = process.env.ADMIN_LEADS_TOKEN

  /* 1. Token URL valide → persister en cookie et autoriser */
  if (adminToken && token && token === adminToken) {
    await persistTokenAsCookie(token)
    return
  }

  /* 2. Cookie httpOnly valide → autoriser */
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value
  if (adminToken && cookieToken === adminToken) {
    return
  }

  /* 3. Session Supabase admin → autoriser */
  await requireAdmin()
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
      .select('role, roles')
      .eq('id', user.id)
      .single()

    const roleStr = (profile?.role ?? '') as string
    const roles   = (profile?.roles ?? []) as string[]
    if (
      roleStr === 'admin' ||
      roleStr === 'super_admin' ||
      roles.includes('admin') ||
      roles.includes('super_admin')
    ) return user
    return null
  } catch {
    return null
  }
}
