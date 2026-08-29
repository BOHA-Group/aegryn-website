import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

/**
 * Déverrouille l'accès anticipé à un numéro du magazine pour un lecteur
 * sans compte, via le lien envoyé par email (cf. lib/magazineAccess.ts).
 *
 * GET /api/magazine/access?issue=01&token=<uuid>
 * - Valide le token contre site_settings.magazine_issue_XX_access_token
 * - Pose un cookie de déverrouillage (lu par la page issue pour bypasser
 *   le gate public/early_access, cf. app/[locale]/magazine/[issue]/page.tsx)
 * - Redirige vers la page de l'issue
 */
const SLUG_BY_PAD: Record<string, string> = {
  '01': 'issue-01',
  '02': 'issue-02',
  '03': 'issue-03',
  '04': 'issue-04',
}

const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl']

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const issuePad = searchParams.get('issue')
  const token    = searchParams.get('token')

  const localePref = req.cookies.get('ag-locale-pref')?.value
  const locale      = localePref && LOCALES.includes(localePref) ? localePref : 'fr'

  const slug = issuePad ? SLUG_BY_PAD[issuePad] : null
  if (!issuePad || !token || !slug) {
    return NextResponse.redirect(new URL(`/${locale}/magazine`, req.url))
  }

  const supa = createServiceClient()
  const { data } = await supa
    .from('site_settings')
    .select('value')
    .eq('key', `magazine_issue_${issuePad}_access_token`)
    .maybeSingle()

  const validToken = typeof data?.value === 'string' && data.value === token

  const destination = validToken
    ? `/${locale}/magazine/${slug}`
    : `/${locale}/magazine`

  const response = NextResponse.redirect(new URL(destination, req.url))

  if (validToken) {
    /* Cookie de déverrouillage — 4 jours de marge après les 48h d'accès anticipé */
    response.cookies.set(`ag-mag-unlock-${issuePad}`, '1', {
      httpOnly: true,
      sameSite: 'lax',
      path:     '/',
      maxAge:   4 * 24 * 60 * 60,
    })
  }

  return response
}
