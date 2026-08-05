import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }      from '@/lib/supabase'

const PAGE_SIZE = 24

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const page       = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const profession = searchParams.get('profession') ?? ''
    const specialty  = searchParams.get('specialty')  ?? ''
    const language   = searchParams.get('language')   ?? ''
    const country    = searchParams.get('country')    ?? ''
    const category   = searchParams.get('category')   ?? ''
    const domain     = searchParams.get('domain')     ?? ''

    const supa = createServiceClient()
    let query = supa
      .from('expert_profiles')
      .select(`
        id, first_name, last_name, profession, specialties,
        city, country_code, bio, organization, email_public,
        phone, website, min_rate_eur, languages, avatar_url,
        verified_at, category, domain,
        expertise_dimension, expertise_categories, expertise_specialties
      `)
      .eq('is_visible', true)
      .order('verified_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

    if (profession) query = query.eq('profession', profession)
    if (country)    query = query.eq('country_code', country)
    if (language)   query = query.contains('languages', [language])
    if (specialty)  query = query.contains('expertise_specialties', [specialty])
    if (category)   query = query.eq('category', category)
    if (domain)     query = query.contains('domain', [domain])

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ profiles: data ?? [], page })
  } catch (err) {
    console.error('[experts/profiles]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
