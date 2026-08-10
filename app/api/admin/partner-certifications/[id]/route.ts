import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendEmail, emailPartnerScoreValidated, emailPartnerScoreRejected } from '@/lib/sendEmail'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json() as Record<string, unknown>

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const token = String(body.token ?? '')
  if (!adminToken || token !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, cosignature_amount_chf, rejection_reason } = body

  if (action !== 'validate' && action !== 'reject') {
    return NextResponse.json({ error: 'action doit être "validate" ou "reject"' }, { status: 400 })
  }

  const supa = createServiceClient()

  const updatePayload: Record<string, unknown> = {
    status: action === 'validate' ? 'validated' : 'rejected',
    validated_at: action === 'validate' ? new Date().toISOString() : null,
  }

  if (action === 'validate' && cosignature_amount_chf != null) {
    updatePayload.cosignature_amount_chf = Number(cosignature_amount_chf)
  }

  if (action === 'reject' && rejection_reason) {
    updatePayload.rejection_reason = String(rejection_reason)
  }

  const { error } = await supa
    .from('partner_certifications')
    .update(updatePayload)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Récupérer les infos pour l'email (best-effort, sans bloquer la réponse)
  const { data: cert } = await supa
    .from('partner_certifications')
    .select('partner_id, dimension, score, observations, rejection_reason, cosignature_amount_chf, assets(company_name)')
    .eq('id', id)
    .single()

  if (cert) {
    const { data: profile } = await supa
      .from('profiles')
      .select('email, full_name')
      .eq('id', String(cert.partner_id))
      .single()

    if (profile?.email) {
      const assetObj = Array.isArray(cert.assets) ? (cert.assets as Record<string, unknown>[])[0] : cert.assets as Record<string, unknown> | null
      const assetName = String(assetObj?.company_name ?? 'Actif Aegryn')
      const partnerName = String(profile.full_name ?? profile.email)

      if (action === 'validate') {
        const { subject, html } = await emailPartnerScoreValidated({
          partnerName,
          assetName,
          dimension:    String(cert.dimension),
          score:        Number(cert.score ?? 0),
          amountChf:    cert.cosignature_amount_chf != null ? Number(cert.cosignature_amount_chf) : null,
          observations: cert.observations ? String(cert.observations) : null,
        })
        await sendEmail(profile.email, subject, html, 'cert-validate').catch(() => {})
      } else {
        const { subject, html } = await emailPartnerScoreRejected({
          partnerName,
          assetName,
          dimension:       String(cert.dimension),
          rejectionReason: cert.rejection_reason ? String(cert.rejection_reason) : null,
          observations:    cert.observations ? String(cert.observations) : null,
        })
        await sendEmail(profile.email, subject, html, 'cert-reject').catch(() => {})
      }
    }
  }

  return NextResponse.json({ ok: true })
}
