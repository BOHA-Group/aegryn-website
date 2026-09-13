import { NextRequest, NextResponse } from 'next/server'
import { getIndexSnapshot } from '@/lib/cifsoIndex'
import type { IndexLocale } from '@/lib/indexTaxonomy'

const LOCALES: IndexLocale[] = ['fr', 'en', 'de', 'es', 'it', 'nl']

/**
 * GET /api/valuation/index?locale=fr
 * Instantané du CIFSO Valuation Index en mode aperçu (accès libre) : séries publiques
 * chiffrées, séries réservées verrouillées. Le mode complet sera ouvert aux abonnés
 * (contrôle d'abonnement à brancher ici lors de la mise en place du paiement).
 */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('locale') ?? 'fr'
  const locale = (LOCALES.includes(raw as IndexLocale) ? raw : 'fr') as IndexLocale
  try {
    const snapshot = await getIndexSnapshot({ locale, full: false })
    return NextResponse.json(snapshot, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } })
  } catch (err) {
    console.error('[/api/valuation/index]', err)
    return NextResponse.json({ error: 'index_unavailable' }, { status: 500 })
  }
}
