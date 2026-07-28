import { NextResponse } from 'next/server'

/**
 * Feature archivée — Assessment Days (parking-lot).
 * Retourne 410 Gone pour toute tentative de soumission.
 * Réactiver en restaurant l'implémentation depuis git history si relancé.
 */
export async function POST() {
  return NextResponse.json({ error: 'feature_unavailable' }, { status: 410 })
}
