import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { isNeediuProVisible } from '@/lib/neediuPro'
import { createNeediuServiceClient } from '@/lib/neediuSupabase'

const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl']

/** Double confirmation : le lien reçu par e-mail valide la préinscription (48 h). */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const locale = LOCALES.includes(url.searchParams.get('locale') ?? '') ? url.searchParams.get('locale')! : 'fr'
  const back = (ok: boolean) => NextResponse.redirect(new URL(`/${locale}/neediu/pro?confirmed=${ok ? 1 : 0}`, url.origin))

  const token = url.searchParams.get('token') ?? ''
  const db = createNeediuServiceClient()
  if (!isNeediuProVisible() || !db || token.length < 20) return back(false)

  const hash = createHash('sha256').update(token).digest('hex')
  const { data, error } = await db.from('provider_preregistrations')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString(), confirm_token_hash: null, confirm_expires_at: null })
    .eq('confirm_token_hash', hash).eq('status', 'pending_email').gt('confirm_expires_at', new Date().toISOString())
    .select('id')
  return back(!error && !!data?.length)
}
