import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  const {
    expert_id,
    first_name,
    last_name,
    email,
    consent_given,
    filter_category,
    filter_domain,
    filter_specialty,
    filter_country,
  } = body as {
    expert_id:        string
    first_name:       string
    last_name:        string
    email:            string
    consent_given:    boolean
    filter_category?: string
    filter_domain?:   string
    filter_specialty?: string
    filter_country?:  string
  }

  if (!expert_id || !first_name?.trim() || !last_name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!consent_given) {
    return NextResponse.json({ error: 'Consent required' }, { status: 422 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          ?? req.headers.get('x-real-ip')
          ?? null
  const ua       = req.headers.get('user-agent') ?? null
  const referrer = req.headers.get('referer') ?? null

  const supa = createServiceClient()

  /* Rejeter silencieusement si la fiche n'est pas publiée */
  const { data: ep } = await supa
    .from('expert_profiles')
    .select('is_visible')
    .eq('user_id', expert_id)
    .maybeSingle()

  if (!ep?.is_visible) {
    return NextResponse.json({ error: 'Expert not found' }, { status: 404 })
  }

  // 1. Insérer le clic KPI (type email) dans la table existante
  const { data: clickData } = await supa.from('expert_contact_clicks').insert({
    expert_id,
    click_type:       'email',
    ip_address:       ip,
    user_agent:       ua,
    referrer,
    filter_category:  filter_category  ?? null,
    filter_domain:    filter_domain    ?? null,
    filter_specialty: filter_specialty ?? null,
    filter_country:   filter_country   ?? null,
  }).select('id').single()

  // 2. Insérer le lead qualifié
  const { error } = await supa.from('expert_contact_leads').insert({
    expert_id,
    first_name:       first_name.trim(),
    last_name:        last_name.trim(),
    email:            email.trim().toLowerCase(),
    consent_given:    true,
    consent_at:       new Date().toISOString(),
    consent_ip:       ip,
    consent_ua:       ua,
    filter_category:  filter_category  ?? null,
    filter_domain:    filter_domain    ?? null,
    filter_specialty: filter_specialty ?? null,
    filter_country:   filter_country   ?? null,
    referrer,
    click_id:         clickData?.id ?? null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 3. Retourner l'email de l'expert pour que le client puisse ouvrir mailto:
  const { data: expert } = await supa
    .from('expert_profiles')
    .select('email_public')
    .eq('id', expert_id)
    .single()

  return NextResponse.json({ ok: true, email_public: expert?.email_public ?? null })
}
