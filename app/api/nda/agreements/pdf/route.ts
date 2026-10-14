/**
 * GET /api/nda/agreements/pdf?token=...
 * Redirige vers un lien de téléchargement temporaire de l'exemplaire signé.
 */
import { NextRequest, NextResponse } from 'next/server'
import { downloadUrlForToken } from '@/lib/nda/service'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  const url = await downloadUrlForToken(token).catch(() => null)
  if (!url) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.redirect(url, 302)
}
