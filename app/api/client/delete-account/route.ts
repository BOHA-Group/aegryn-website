/**
 * POST /api/client/delete-account
 * Suppression de compte en libre-service (droit à l'effacement RGPD Art.17 / nLPD Art.30).
 * L'utilisateur doit être authentifié (cookie de session).
 *
 * Séquence (ordre FK) :
 *  1. Dissocier les actifs soumis (seller_uid → NULL) — données légales conservées
 *  2. Dissocier les offres acheteur (buyer_id → NULL) — historique transaction conservé
 *  3. Supprimer documents KYC
 *  4. Supprimer demandes NDA
 *  5. Supprimer notifications
 *  6. Supprimer commissions et introductions (partenaire)
 *  7. Supprimer certifications partenaire
 *  8. Supprimer le compte Auth (cascade → profiles via ON DELETE CASCADE)
 *  9. Audit trail rgpd_requests (fire-and-forget)
 * 10. Email de confirmation RGPD (fire-and-forget)
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient }          from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'
import { sendEmail }                 from '@/lib/sendEmail'

export async function POST(_req: NextRequest) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }

  const supa      = createServiceClient()
  const userEmail = user.email ?? ''

  /* ── 1. Dissocier les actifs vendeur ── */
  const { error: e1 } = await supa
    .from('assets')
    .update({ seller_uid: null })
    .eq('seller_uid', user.id)
  if (e1) { console.error('[delete-account] unlink assets:', e1); return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 }) }

  /* ── 2. Dissocier les offres acheteur ── */
  await supa.from('offers').update({ buyer_id: null }).eq('buyer_id', user.id)

  /* ── 3. Supprimer documents KYC ── */
  await supa.from('kyc_documents').delete().eq('user_id', user.id)

  /* ── 4. Supprimer demandes NDA (par email — clé naturelle de la table) ── */
  if (userEmail) await supa.from('nda_requests').delete().eq('buyer_email', userEmail)

  /* ── 5. Supprimer notifications ── */
  await supa.from('user_notifications').delete().eq('user_id', user.id)

  /* ── 6. Commissions et introductions partenaire ── */
  await supa.from('commissions').delete().eq('partner_id', user.id)
  await supa.from('introductions').delete().eq('partner_id', user.id)

  /* ── 7. Certifications partenaire ── */
  await supa.from('partner_certifications').delete().eq('partner_id', user.id)

  /* ── 8. Supprimer le compte Auth (cascade → profiles) ── */
  const { error: deleteErr } = await supa.auth.admin.deleteUser(user.id)
  if (deleteErr) {
    console.error('[delete-account] deleteUser:', deleteErr)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }

  /* ── 9. Audit trail RGPD (fire-and-forget) ── */
  supa.from('rgpd_requests').insert({
    user_id:      null,
    user_email:   userEmail,
    type:         'delete_full',
    status:       'completed',
    processed_at: new Date().toISOString(),
  }).then(({ error }) => {
    if (error) console.error('[delete-account] rgpd_requests insert:', error)
  })

  /* ── 10. Email de confirmation suppression (fire-and-forget) ── */
  if (userEmail) {
    sendEmail(
      userEmail,
      '[Aegryn] Suppression de votre compte confirmée',
      `<!DOCTYPE html><html lang="fr"><body style="font-family:Helvetica,Arial,sans-serif;color:#1e293b;padding:32px;">
        <h2 style="color:#0F1C3F;">Votre compte Aegryn a été supprimé</h2>
        <p>Conformément à votre demande et au droit à l'effacement (Art. 17 RGPD / Art. 30 nLPD),
        votre compte et vos données personnelles ont été supprimés définitivement.</p>
        <p style="color:#64748b;font-size:13px;">
          Les dossiers de certification déjà engagés sont conservés à des fins légales
          sans lien avec votre identité.<br/>
          Les sauvegardes d'infrastructure sont purgées dans un délai maximal de 30 jours.
        </p>
        <p style="margin-top:24px;font-size:12px;color:#94a3b8;">
          Aegryn — Genève, Suisse — <a href="https://aegryn.com" style="color:#5ADDA4;">aegryn.com</a>
        </p>
      </body></html>`,
      'delete-account',
    ).catch(() => {})
  }

  /* ── 11. Nettoyer la session côté navigateur ── */
  await authClient.auth.signOut()

  return NextResponse.json({ ok: true })
}
