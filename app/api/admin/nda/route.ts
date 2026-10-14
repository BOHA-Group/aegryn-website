/**
 * POST /api/admin/nda
 * Crée un accord NDA mutuel avec ses signataires et envoie les liens personnels.
 * Réservé aux admins (session).
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminUser } from '@/lib/adminAuth'
import { NdaError, createAgreement, sendInvitation } from '@/lib/nda/service'
import { NDA_ROLES } from '@/lib/nda/template'

export const runtime = 'nodejs'

const signatorySchema = z.object({
  fullName: z.string().min(2).max(120),
  company:  z.string().max(150).nullable().optional(),
  email:    z.string().email().max(200),
  roles:    z.array(z.enum(NDA_ROLES)).min(1),
})

const schema = z.object({
  projectLabel:       z.string().min(2).max(200),
  lang:               z.enum(['fr', 'en']),
  termYears:          z.number().int().min(1).max(20).default(5),
  penaltyChf:         z.number().int().positive().max(10_000_000).nullable().optional(),
  sourceContactEmail: z.string().email().nullable().optional(),
  note:               z.string().max(1000).nullable().optional(),
  signatories:        z.array(signatorySchema).min(1).max(20),
  send:               z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch (e) { return NextResponse.json({ error: 'validation', detail: e instanceof z.ZodError ? e.issues : undefined }, { status: 400 }) }

  try {
    const actor = `admin:${admin.id}`
    const { agreement, created } = await createAgreement({ ...body, createdBy: admin.id }, actor)
    if (body.send) for (const c of created) await sendInvitation(agreement, c.signatory, c.token, actor)
    return NextResponse.json({ ok: true, id: agreement.id, reference: agreement.reference })
  } catch (e) {
    if (e instanceof NdaError) return NextResponse.json({ error: e.code, detail: e.message }, { status: e.code === 'not_configured' ? 409 : 500 })
    console.error('[admin/nda]', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
