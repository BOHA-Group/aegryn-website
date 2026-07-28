import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase'
import { getAdminUser }        from '@/lib/adminAuth'

const ALLOWED_ROLES = ['buyer', 'seller', 'partner', 'admin', 'super_admin'] as const

const schema = z.object({
  token: z.string().optional().default(''),

  /* Profil — champs non-personnels éditables */
  roles: z.array(z.enum(ALLOWED_ROLES)).optional(),
  admin_note: z.string().max(2000).optional().nullable(),

  /* NDA — mise à jour statut */
  nda_request_id: z.string().uuid().optional(),
  nda_status: z.enum(['pending', 'approved', 'rejected', 'nda_sent', 'nda_signed']).optional(),

  /* KYC document — mise à jour statut */
  kyc_doc_id: z.string().uuid().optional(),
  kyc_status: z.enum(['pending', 'in_review', 'validated', 'rejected', 'expired']).optional(),
  kyc_rejection_reason: z.string().max(500).optional().nullable(),

  /* Suppression de données de test */
  delete_nda_request_id: z.string().uuid().optional(),
  delete_kyc_doc_id: z.string().uuid().optional(),
})

async function checkAuth(token: string): Promise<boolean> {
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && token === adminToken) return true
  /* Fallback session admin */
  const adminUser = await getAdminUser()
  return !!adminUser
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supa = createServiceClient()

  try {
    const body = schema.parse(await req.json())
    const authorized = await checkAuth(body.token ?? '')
    if (!authorized) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const results: Record<string, unknown> = {}

    /* ── 1. Mise à jour des rôles ── */
    if (body.roles !== undefined) {
      const { error } = await supa
        .from('profiles')
        .update({ roles: body.roles })
        .eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      results.roles = body.roles
    }

    /* ── 2. Note admin sur le profil ── */
    if (body.admin_note !== undefined) {
      const { error } = await supa
        .from('profiles')
        .update({ admin_note: body.admin_note })
        .eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      results.admin_note = body.admin_note
    }

    /* ── 3. Statut NDA ── */
    if (body.nda_request_id && body.nda_status) {
      const update: Record<string, unknown> = { status: body.nda_status, reviewed_by: 'admin', reviewed_at: new Date().toISOString() }
      if (body.nda_status === 'nda_sent')   update.nda_sent_at   = new Date().toISOString()
      if (body.nda_status === 'nda_signed') update.nda_signed_at = new Date().toISOString()
      const { error } = await supa.from('nda_requests').update(update).eq('id', body.nda_request_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      results.nda = body.nda_status
    }

    /* ── 4. Statut KYC document ── */
    if (body.kyc_doc_id && body.kyc_status) {
      const update: Record<string, unknown> = { status: body.kyc_status }
      if (body.kyc_status === 'validated') update.validated_at = new Date().toISOString()
      if (body.kyc_rejection_reason)       update.rejection_reason = body.kyc_rejection_reason
      const { error } = await supa.from('kyc_documents').update(update).eq('id', body.kyc_doc_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      results.kyc = body.kyc_status
    }

    /* ── 5. Suppression demande NDA (cleanup test) ── */
    if (body.delete_nda_request_id) {
      const { error } = await supa.from('nda_requests').delete().eq('id', body.delete_nda_request_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      results.deleted_nda = body.delete_nda_request_id
    }

    /* ── 6. Suppression document KYC (cleanup test) ── */
    if (body.delete_kyc_doc_id) {
      const { error } = await supa.from('kyc_documents').delete().eq('id', body.delete_kyc_doc_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      results.deleted_kyc = body.delete_kyc_doc_id
    }

    return NextResponse.json({ ok: true, ...results })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[admin/members/patch]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token') ?? ''

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && token !== adminToken) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supa = createServiceClient()

  /* ── Récupérer email avant suppression (pour NDA + audit) ── */
  const { data: profile } = await supa
    .from('profiles')
    .select('email')
    .eq('id', id)
    .single()
  const userEmail: string = (profile as { email?: string } | null)?.email ?? ''

  /* ── 1. Dissocier les actifs vendeur (conservation légale) ── */
  await supa.from('assets').update({ seller_uid: null }).eq('seller_uid', id)

  /* ── 2. Dissocier les offres acheteur (conservation historique) ── */
  await supa.from('offers').update({ buyer_id: null }).eq('buyer_id', id)

  /* ── 3. Supprimer documents KYC ── */
  await supa.from('kyc_documents').delete().eq('user_id', id)

  /* ── 4. Supprimer demandes NDA (par email) ── */
  if (userEmail) await supa.from('nda_requests').delete().eq('buyer_email', userEmail)

  /* ── 5. Supprimer notifications ── */
  await supa.from('user_notifications').delete().eq('user_id', id)

  /* ── 6. Commissions et introductions partenaire ── */
  await supa.from('introductions').delete().eq('partner_id', id)
  await supa.from('commissions').delete().eq('partner_id', id)

  /* ── 7. Certifications partenaire ── */
  await supa.from('partner_certifications').delete().eq('partner_id', id)

  /* ── 8. Supprimer le compte Auth (cascade → profiles) ── */
  const { error: deleteErr } = await supa.auth.admin.deleteUser(id)
  if (deleteErr) {
    console.error('[admin/members/delete] deleteUser:', deleteErr)
    return NextResponse.json({ error: deleteErr.message }, { status: 500 })
  }

  /* ── 9. Audit trail RGPD (fire-and-forget) ── */
  supa.from('rgpd_requests').insert({
    user_id:      null,
    user_email:   userEmail || null,
    type:         'delete_full',
    status:       'completed',
    admin_note:   'Admin-initiated deletion',
    processed_at: new Date().toISOString(),
  }).then(({ error }) => {
    if (error) console.error('[admin/members/delete] rgpd_requests insert:', error)
  })

  return NextResponse.json({ ok: true, deleted_user: id })
}
