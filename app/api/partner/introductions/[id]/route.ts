import { NextRequest, NextResponse } from 'next/server'
import { z }                          from 'zod'
import { getUser }                    from '@/lib/supabaseServer'
import { createServiceClient }        from '@/lib/supabase'

const patchSchema = z.object({
  introduction_type: z.enum(['asset', 'buyer']).optional(),
  contact_name:      z.string().min(1).max(200).optional(),
  contact_email:     z.string().email().max(200).optional(),
  context_note:      z.string().max(2000).nullable().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body   = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const supa = createServiceClient()

  /* Vérifier que l'intro appartient au partenaire et est encore au statut 'new' */
  const { data: existing, error: fetchErr } = await supa
    .from('introductions')
    .select('id, introduction_status')
    .eq('id', id)
    .eq('partner_id', user.id)
    .single()

  if (fetchErr || !existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (existing.introduction_status !== 'new') {
    return NextResponse.json({ error: 'Cannot edit a processed introduction' }, { status: 403 })
  }

  const { error } = await supa
    .from('introductions')
    .update(parsed.data)
    .eq('id', id)
    .eq('partner_id', user.id)

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supa   = createServiceClient()

  /* Vérifier ownership + statut new */
  const { data: existing, error: fetchErr } = await supa
    .from('introductions')
    .select('id, introduction_status')
    .eq('id', id)
    .eq('partner_id', user.id)
    .single()

  if (fetchErr || !existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (existing.introduction_status !== 'new') {
    return NextResponse.json({ error: 'Cannot delete a processed introduction' }, { status: 403 })
  }

  const { error } = await supa
    .from('introductions')
    .delete()
    .eq('id', id)
    .eq('partner_id', user.id)

  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
