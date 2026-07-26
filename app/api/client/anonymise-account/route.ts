/**
 * POST /api/client/anonymise-account
 * Anonymisation partielle RGPD / nLPD — Art. 17.
 * Remplace full_name + email du profil par des valeurs anonymes.
 * Le compte Supabase Auth est conserve (l'utilisateur reste connecte).
 * Les dossiers de certification restes lies au compte mais sans identite nominative.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient }          from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'

export async function POST(_req: NextRequest) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 })
  }

  const supa = createServiceClient()
  const anonId = user.id.slice(0, 8)

  /* Anonymiser le profil */
  const { error: profileErr } = await supa
    .from('profiles')
    .update({
      full_name: `Utilisateur anonyme ${anonId}`,
    })
    .eq('id', user.id)

  if (profileErr) {
    console.error('[anonymise-account] profile:', profileErr)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }

  /* Anonymiser l'email Supabase Auth */
  const anonEmail = `anon-${anonId}@deleted.invalid`
  const { error: authErr } = await supa.auth.admin.updateUserById(user.id, {
    email: anonEmail,
  })

  if (authErr) {
    console.error('[anonymise-account] auth:', authErr)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
