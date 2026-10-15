/**
 * POST /api/transaction/track-access
 * Enregistre une ouverture de dossier dans auction_access_log (table Supabase).
 * Appelé côté client à chaque chargement de la page dossier.
 * IP hashée SHA-256 + salt (RGPD/nLPD).
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { createAuthClient }          from '@/lib/supabaseServer'
import { createHash }                from 'crypto'
import { z }                         from 'zod'

const schema = z.object({
  asset_id:  z.string().uuid(),
  access_id: z.string().uuid().optional(),
  page:      z.enum(['dossier', 'teaser']).default('dossier'),
})

const IP_SALT = process.env.IP_HASH_SALT ?? 'aegryn-transaction-salt'

function hashIp(ip: string | null): string | null {
  if (!ip) return null
  return createHash('sha256').update(IP_SALT + ip).digest('hex').slice(0, 16)
}

export async function POST(req: NextRequest) {
  try {
    const authClient = await createAuthClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ ok: false }, { status: 401 })

    const body   = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

    const { asset_id, access_id, page } = parsed.data
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    const ua = req.headers.get('user-agent')?.slice(0, 255) ?? null

    const supa = createServiceClient()
    await supa.from('auction_access_log').insert({
      asset_id,
      user_id:    user.id,
      access_id:  access_id ?? null,
      page,
      ip_hash:    hashIp(ip),
      user_agent: ua,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[track-access]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
