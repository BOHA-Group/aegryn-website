import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  const { expert_id, click_type, filter_category, filter_domain, filter_specialty, filter_country } = body as {
    expert_id:        string
    click_type:       'email' | 'website'
    filter_category?: string
    filter_domain?:   string
    filter_specialty?: string
    filter_country?:  string
  }

  if (!expert_id || !['email', 'website'].includes(click_type)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          ?? req.headers.get('x-real-ip')
          ?? null
  const ua       = req.headers.get('user-agent') ?? null
  const referrer = req.headers.get('referer') ?? null

  const supa = createServiceClient()

  /* Ne tracer que si la fiche est publiée */
  const { data: ep } = await supa
    .from('expert_profiles')
    .select('is_visible')
    .eq('user_id', expert_id)
    .maybeSingle()

  if (!ep?.is_visible) {
    return NextResponse.json({ ok: true })
  }

  const { error } = await supa.from('expert_contact_clicks').insert({
    expert_id,
    click_type,
    ip_address:       ip,
    user_agent:       ua,
    referrer,
    filter_category:  filter_category  ?? null,
    filter_domain:    filter_domain    ?? null,
    filter_specialty: filter_specialty ?? null,
    filter_country:   filter_country   ?? null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
