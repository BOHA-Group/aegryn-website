/**
 * GET /api/report/unsubscribe?token=<uuid>
 *
 * Désabonne un inscrit à The AEGRYN Report via son token unique.
 * Lien inclus dans chaque email de notification de parution.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'token_required' }, { status: 400 })
  }

  const supa = createServiceClient()

  const { error } = await supa
    .from('report_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .eq('status', 'active')

  if (error) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  const locale = req.nextUrl.searchParams.get('locale') ?? 'en'
  return NextResponse.redirect(new URL(`/${locale}/intelligence/notify?unsubscribed=1`, req.url))
}
