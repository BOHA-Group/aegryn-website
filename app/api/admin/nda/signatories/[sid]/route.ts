/**
 * PATCH /api/admin/nda/signatories/[sid]
 * Actions : resend (nouveau lien + e-mail), revoke, regenerate (PDF manquant).
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminUser } from '@/lib/adminAuth'
import { NdaError, regeneratePdf, resendSignatory, revokeSignatory } from '@/lib/nda/service'

export const runtime = 'nodejs'

const schema = z.object({ action: z.enum(['resend', 'revoke', 'regenerate']) })

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ sid: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { sid } = await params

  let action: z.infer<typeof schema>['action']
  try { action = schema.parse(await req.json()).action } catch { return NextResponse.json({ error: 'validation' }, { status: 400 }) }

  try {
    const actor = `admin:${admin.id}`
    if (action === 'resend') await resendSignatory(sid, actor)
    else if (action === 'revoke') await revokeSignatory(sid, actor)
    else await regeneratePdf(sid, actor)
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof NdaError) return NextResponse.json({ error: e.code, detail: e.message }, { status: e.code === 'invalid' ? 409 : 500 })
    console.error('[admin/nda/signatory]', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
