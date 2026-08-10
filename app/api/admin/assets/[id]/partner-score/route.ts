import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getAdminUser }       from '@/lib/adminAuth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: assetId } = await params
  const body = await req.json() as Record<string, unknown>

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const tokenOk = adminToken && String(body.token ?? '') === adminToken
  if (!tokenOk) {
    const adminUser = await getAdminUser()
    if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { partner_email, dimension, score, subcodes, observations } = body

  if (!partner_email || !dimension) {
    return NextResponse.json({ error: 'Email et dimension obligatoires.' }, { status: 400 })
  }

  const supa = createServiceClient()

  // Rechercher la certification partenaire correspondant à cet actif + partenaire
  const { data: profile } = await supa
    .from('profiles')
    .select('id')
    .eq('email', String(partner_email))
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: `Aucun compte trouvé pour ${partner_email}` }, { status: 404 })
  }

  // Upsert dans partner_certifications (score + subcodes + observations)
  const { error } = await supa
    .from('partner_certifications')
    .upsert({
      partner_id:   profile.id,
      asset_id:     assetId,
      dimension:    String(dimension),
      score:        Number(score ?? 0),
      subcodes:     Array.isArray(subcodes) ? subcodes : [],
      observations: observations ? String(observations) : null,
      status:       'submitted',
    }, { onConflict: 'partner_id,asset_id,dimension' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
