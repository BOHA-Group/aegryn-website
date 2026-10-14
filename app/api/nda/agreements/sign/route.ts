/**
 * POST /api/nda/agreements/sign
 * Signature publique d'un NDA mutuel via lien personnel (jeton). Sans compte.
 * Body : { token, signedName, accept: true }
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { NdaError, signNda } from '@/lib/nda/service'

export const runtime = 'nodejs'
export const maxDuration = 30

const schema = z.object({
  token:      z.string().min(40).max(60),
  signedName: z.string().min(2).max(120),
  accept:     z.literal(true),
})

export async function POST(req: NextRequest) {
  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'validation' }, { status: 400 }) }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? null
  try {
    const r = await signNda(body.token, { signedName: body.signedName, ip, userAgent: req.headers.get('user-agent') })
    return NextResponse.json({ ok: true, already: r.already, reference: r.reference })
  } catch (e) {
    if (e instanceof NdaError) {
      const status = e.code === 'invalid' ? 404 : e.code === 'expired' || e.code === 'revoked' ? 410 : e.code === 'bad_name' ? 400 : 500
      return NextResponse.json({ error: e.code }, { status })
    }
    console.error('[nda/sign]', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
