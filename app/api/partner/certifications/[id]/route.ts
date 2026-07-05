import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

const submitSchema = z.object({
  action:         z.literal('submit'),
  score:          z.number().int().min(0).max(25),
  subcodes:       z.array(z.string()).optional().default([]),
  summary:        z.string().min(1).max(3000),
  reserves:       z.string().max(2000).nullable().optional(),
  recommendation: z.enum(['none', 'review', 'remediation']).optional().default('none'),
})

const declineSchema = z.object({ action: z.literal('decline') })
const bodySchema = z.discriminatedUnion('action', [submitSchema, declineSchema])

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const supa = createServiceClient()

  const { data: cert } = await supa
    .from('partner_certifications')
    .select('id, status, partner_id')
    .eq('id', id)
    .eq('partner_id', user.id)
    .single()

  if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!['assigned', 'in_review'].includes(cert.status)) {
    return NextResponse.json({ error: 'Cannot update in current status' }, { status: 409 })
  }

  if (parsed.data.action === 'decline') {
    const { error } = await supa
      .from('partner_certifications')
      .update({ status: 'declined' })
      .eq('id', id)
    if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  const { score, subcodes, summary, reserves, recommendation } = parsed.data
  const { error } = await supa
    .from('partner_certifications')
    .update({
      status:             'submitted',
      score,
      subcodes,
      summary,
      reserves:           reserves ?? null,
      recommendation,
      signed_by_checkbox: true,
      signed_at:          new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[partner/certifications] update error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
