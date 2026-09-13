import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getAdminUser }       from '@/lib/adminAuth'
import { refreshPrescore }    from '@/lib/prescoreServer'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const adminToken = process.env.ADMIN_LEADS_TOKEN

  const body = await req.json() as {
    token?: string
    admin_quality?: string
    admin_note?: string
    required_level?: string
  }

  const tokenOk = adminToken && body.token === adminToken
  if (!tokenOk) {
    const adminUser = await getAdminUser()
    if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allowed_qualities = ['pending_review', 'sufficient', 'insufficient', 'missing']
  const allowed_levels    = ['blocking', 'recommended', 'optional']

  const patch: Record<string, unknown> = {}

  if (body.admin_quality !== undefined) {
    if (!allowed_qualities.includes(body.admin_quality))
      return NextResponse.json({ error: 'Invalid admin_quality' }, { status: 400 })
    patch.admin_quality = body.admin_quality
  }

  if (body.admin_note !== undefined) patch.admin_note = body.admin_note

  if (body.required_level !== undefined) {
    if (!allowed_levels.includes(body.required_level))
      return NextResponse.json({ error: 'Invalid required_level' }, { status: 400 })
    patch.required_level = body.required_level
  }

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: 'Nothing to patch' }, { status: 400 })

  const supa = createServiceClient()
  const { data: doc, error } = await supa
    .from('data_room_documents')
    .update(patch)
    .eq('id', id)
    .select('asset_id, document_code, file_name')
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  /* Pré-scoring documentaire automatique recalculé à chaque décision */
  if (doc) await refreshPrescore(doc.asset_id).catch(err => console.error('[documents] prescore', err))

  /* Retour au client : pièce validée ou à reprendre (uniquement sur décision finale) */
  if (doc && (body.admin_quality === 'sufficient' || body.admin_quality === 'insufficient')) {
    const { data: asset } = await supa
      .from('assets').select('seller_uid, seller_email').eq('id', doc.asset_id).maybeSingle()
    let clientUid: string | null = asset?.seller_uid ?? null
    if (!clientUid && asset?.seller_email) {
      const { data: prof } = await supa.from('profiles').select('id').eq('email', asset.seller_email).maybeSingle()
      clientUid = prof?.id ?? null
    }
    if (clientUid) {
      const ok = body.admin_quality === 'sufficient'
      await supa.from('user_notifications').insert({
        user_id: clientUid,
        type:    'certification_update',
        title:   ok ? `Pièce validée : ${doc.document_code}` : `Pièce à compléter : ${doc.document_code}`,
        body:    ok
          ? `${doc.file_name ?? doc.document_code} a été vérifié et accepté par nos analystes.`
          : `${doc.file_name ?? doc.document_code} est insuffisant.${body.admin_note ? ` Motif : ${body.admin_note}` : ''} Merci de déposer une nouvelle version dans votre Data Room.`,
        link:    `/client/seller/actifs/${doc.asset_id}/documents`,
        payload: { asset_id: doc.asset_id, document_code: doc.document_code, admin_quality: body.admin_quality },
      })
    }
  }

  return NextResponse.json({ ok: true })
}
