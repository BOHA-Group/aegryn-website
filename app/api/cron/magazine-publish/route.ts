import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

/**
 * Cron horaire — bascule automatiquement `magazine_issue_XX_public` à true
 * 48h après l'activation de `magazine_issue_XX_early_access` (basé sur le
 * updated_at de la ligne early_access, mis à jour par PATCH /api/admin/site-settings).
 *
 * Configuré via vercel.json → crons (toutes les heures).
 * Protégé par CRON_SECRET (Vercel ajoute automatiquement le header
 * `Authorization: Bearer $CRON_SECRET` pour les crons planifiés).
 */
const EARLY_ACCESS_KEY_RE = /^magazine_issue_(\d{2})_early_access$/
const EARLY_ACCESS_WINDOW_MS = 48 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const supa = createServiceClient()
  const { data: rows, error } = await supa
    .from('site_settings')
    .select('key, value, updated_at')
    .like('key', 'magazine_issue_%_early_access')

  if (error) {
    console.error('[cron/magazine-publish] Supabase error', error)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const published: string[] = []

  for (const row of rows ?? []) {
    const match = row.key.match(EARLY_ACCESS_KEY_RE)
    const isActive = row.value === true || row.value === 'true'
    if (!match || !isActive) continue

    const activatedAt = new Date(row.updated_at).getTime()
    if (Date.now() - activatedAt < EARLY_ACCESS_WINDOW_MS) continue

    const issuePad  = match[1]
    const publicKey = `magazine_issue_${issuePad}_public`

    const { data: pubRow } = await supa
      .from('site_settings')
      .select('value')
      .eq('key', publicKey)
      .maybeSingle()
    const alreadyPublic = pubRow?.value === true || pubRow?.value === 'true'
    if (alreadyPublic) continue

    const { error: upsertErr } = await supa
      .from('site_settings')
      .upsert({ key: publicKey, value: true, updated_at: new Date().toISOString() })

    if (upsertErr) {
      console.error(`[cron/magazine-publish] Échec publication issue ${issuePad}`, upsertErr)
      continue
    }
    published.push(issuePad)
  }

  return NextResponse.json({ ok: true, published })
}
