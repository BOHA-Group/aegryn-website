import { NextRequest, NextResponse } from 'next/server'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS }        from '@/lib/ndaVersions'

export { NDA_VERSIONS }

type NdaType = keyof typeof NDA_VERSIONS

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const ndaType = body?.nda_type as string | undefined

  if (!ndaType || !(['seller', 'buyer', 'partner'] as string[]).includes(ndaType)) {
    return NextResponse.json({ error: 'nda_type invalide' }, { status: 400 })
  }

  const type    = ndaType as NdaType
  const version = NDA_VERSIONS[type]
  const ip      = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
              ?? req.headers.get('x-real-ip')
              ?? null
  const ua      = req.headers.get('user-agent') ?? null

  const supa = createServiceClient()

  const { error: insertErr } = await supa.from('nda_acceptances').insert({
    user_id:    user.id,
    email:      user.email ?? null,
    nda_type:   type,
    nda_version: version,
    ip_address:  ip,
    user_agent:  ua,
  })

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  const profileUpdate: Record<string, string> = {
    [`${type}_nda_accepted_at`]: new Date().toISOString(),
    [`${type}_nda_version`]:     version,
  }

  const { error: updateErr } = await supa
    .from('profiles')
    .update(profileUpdate)
    .eq('id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, nda_type: type, version })
}
