import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseServer'

// POST /api/valuation/waitlist
// Inscrit un email à la liste d'attente CIFSO Valuation Index
export async function POST(req: NextRequest) {
  try {
    const { email, org_type, sector, locale, source_url } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    const db = createServiceClient()
    const { error } = await db
      .from('cifso_index_waitlist')
      .upsert(
        { email: email.trim().toLowerCase(), org_type, sector, locale, source_url },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/valuation/waitlist]', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
