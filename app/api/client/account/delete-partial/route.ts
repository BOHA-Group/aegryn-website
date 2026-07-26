/**
 * POST /api/client/account/delete-partial
 * Suppression partielle des données personnelles — Art. 17 RGPD / Art. 30 nLPD.
 * L'utilisateur choisit quelles catégories supprimer via une checklist.
 * Le compte Auth et le profil sont conservés.
 *
 * Catégories supprimables :
 *   notifications       — user_notifications
 *   kyc_documents       — kyc_documents (+ reset kyc_status sur profiles)
 *   offers              — offers (buyer_id dissocié, pas supprimé — légal)
 *   nda_requests        — nda_requests (par email)
 *   commissions         — commissions
 *   introductions       — introductions
 *   partner_certs       — partner_certifications
 *
 * Non supprimables (conservation légale) :
 *   transactions, assets — conservés sans lien identité ou avec lien anonymisé
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createAuthClient }          from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'

const DELETABLE_CATEGORIES = [
  'notifications',
  'kyc_documents',
  'offers',
  'nda_requests',
  'commissions',
  'introductions',
  'partner_certs',
] as const

type Category = typeof DELETABLE_CATEGORIES[number]

const schema = z.object({
  categories: z.array(z.enum(DELETABLE_CATEGORIES)).min(1),
})

export async function POST(req: NextRequest) {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })

  const body = schema.safeParse(await req.json().catch(() => ({})))
  if (!body.success) {
    return NextResponse.json({ error: 'Données invalides.', issues: body.error.issues }, { status: 400 })
  }

  const supa       = createServiceClient()
  const cats       = new Set<Category>(body.data.categories)
  const userEmail  = user.email ?? ''
  const deleted: Category[] = []

  if (cats.has('notifications')) {
    const { error } = await supa.from('user_notifications').delete().eq('user_id', user.id)
    if (error) console.error('[delete-partial] notifications:', error)
    else deleted.push('notifications')
  }

  if (cats.has('kyc_documents')) {
    const { error } = await supa.from('kyc_documents').delete().eq('user_id', user.id)
    if (error) console.error('[delete-partial] kyc_documents:', error)
    else {
      deleted.push('kyc_documents')
      /* Reset du statut KYC global sur le profil */
      await supa.from('profiles').update({ kyc_status: 'pending' }).eq('id', user.id)
    }
  }

  if (cats.has('offers')) {
    /* Dissociation (conservation légale) plutôt que suppression */
    const { error } = await supa.from('offers').update({ buyer_id: null }).eq('buyer_id', user.id)
    if (error) console.error('[delete-partial] offers:', error)
    else deleted.push('offers')
  }

  if (cats.has('nda_requests') && userEmail) {
    const { error } = await supa.from('nda_requests').delete().eq('buyer_email', userEmail)
    if (error) console.error('[delete-partial] nda_requests:', error)
    else deleted.push('nda_requests')
  }

  if (cats.has('commissions')) {
    const { error } = await supa.from('commissions').delete().eq('partner_id', user.id)
    if (error) console.error('[delete-partial] commissions:', error)
    else deleted.push('commissions')
  }

  if (cats.has('introductions')) {
    const { error } = await supa.from('introductions').delete().eq('partner_id', user.id)
    if (error) console.error('[delete-partial] introductions:', error)
    else deleted.push('introductions')
  }

  if (cats.has('partner_certs')) {
    const { error } = await supa.from('partner_certifications').delete().eq('partner_id', user.id)
    if (error) console.error('[delete-partial] partner_certifications:', error)
    else deleted.push('partner_certs')
  }

  /* Audit trail RGPD (fire-and-forget) */
  supa.from('rgpd_requests').insert({
    user_id:      user.id,
    user_email:   userEmail || null,
    type:         'delete_partial',
    status:       'completed',
    admin_note:   `Categories: ${deleted.join(', ')}`,
    processed_at: new Date().toISOString(),
  }).then(({ error }) => {
    if (error) console.error('[delete-partial] rgpd_requests:', error)
  })

  return NextResponse.json({ ok: true, deleted })
}
