import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

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

  return NextResponse.json({ ok: true })
}
