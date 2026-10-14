/**
 * POST /api/admin/nda/[id]/signatories
 * Distribue l'accord à un signataire supplémentaire (nouveau lien personnel).
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminUser } from '@/lib/adminAuth'
import { NdaError, addSignatory, sendInvitation } from '@/lib/nda/service'
import { createServiceClient } from '@/lib/supabase'
import { NDA_ROLES } from '@/lib/nda/template'
import type { AgreementRow } from '@/lib/nda/service'

export const runtime = 'nodejs'

const schema = z.object({
  fullName: z.string().min(2).max(120),
  company:  z.string().max(150).nullable().optional(),
  email:    z.string().email().max(200),
  roles:    z.array(z.enum(NDA_ROLES)).min(1),
  send:     z.boolean().default(true),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) } catch { return NextResponse.json({ error: 'validation' }, { status: 400 }) }

  const { data } = await createServiceClient().from('nda_agreements').select('*').eq('id', id).maybeSingle()
  if (!data) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const agreement = data as AgreementRow
  if (agreement.status === 'revoked') return NextResponse.json({ error: 'revoked' }, { status: 409 })

  try {
    const actor = `admin:${admin.id}`
    const { signatory, token } = await addSignatory(id, body, actor)
    if (body.send) await sendInvitation(agreement, signatory, token, actor)
    await createServiceClient().from('nda_agreements').update({ status: 'open' }).eq('id', id)
    return NextResponse.json({ ok: true, signatoryId: signatory.id })
  } catch (e) {
    if (e instanceof NdaError) return NextResponse.json({ error: e.code }, { status: 500 })
    console.error('[admin/nda/signatories]', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
