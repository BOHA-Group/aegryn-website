/**
 * POST /api/report/subscribe
 *
 * Alias conservé pour rétrocompatibilité.
 * Délègue à la route canonique /api/newsletter/subscribe.
 */
import { NextRequest, NextResponse } from 'next/server'
import { rateLimited } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (await rateLimited(req, 'report-subscribe', 5)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  const canonical = new URL('/api/newsletter/subscribe', req.url)
  return fetch(canonical.toString(), {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  }).then(r => r.json())
    .then(json => NextResponse.json(json))
    .catch(() => NextResponse.json({ error: 'internal' }, { status: 500 }))
}
