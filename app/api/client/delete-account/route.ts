/**
 * POST /api/client/delete-account
 * Suppression de compte en libre-service (droit à l'effacement RGPD).
 * L'utilisateur doit être authentifié (cookie de session).
 *
 * - Dissocie les actifs soumis par ce compte (seller_uid -> NULL) : la
 *   FK assets.seller_uid REFERENCES auth.users(id) est en ON DELETE NO ACTION
 *   par défaut (cf. supabase/migrations/005_user_profiles.sql), donc supprimer
 *   l'utilisateur sans cette étape échoue avec une violation de contrainte.
 *   Les dossiers eux-mêmes (assets) sont conservés pour raison légale
 *   (obligations comptables/contractuelles liées à une transaction déjà
 *   engagée) mais ne sont plus rattachés à une identité de compte.
 * - Supprime le profil (user_profiles) — cascade automatique via
 *   ON DELETE CASCADE sur auth.users(id).
 * - Supprime le compte Supabase Auth via l'Admin API (service_role).
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient }          from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'

export async function POST(_req: NextRequest) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }

  const supa = createServiceClient()

  /* ── 1. Dissocier les actifs (garde l'historique, retire le lien identité) ── */
  const { error: unlinkErr } = await supa
    .from('assets')
    .update({ seller_uid: null })
    .eq('seller_uid', user.id)

  if (unlinkErr) {
    console.error('[delete-account] unlink assets:', unlinkErr)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }

  /* ── 2. Supprimer le compte Auth (cascade -> user_profiles) ── */
  const { error: deleteErr } = await supa.auth.admin.deleteUser(user.id)

  if (deleteErr) {
    console.error('[delete-account] deleteUser:', deleteErr)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }

  /* ── 3. Nettoyer la session côté navigateur ── */
  await authClient.auth.signOut()

  return NextResponse.json({ ok: true })
}
