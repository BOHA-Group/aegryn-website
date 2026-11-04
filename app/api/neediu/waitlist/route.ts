import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'node:crypto'
import { z } from 'zod'
import { isNeediuProVisible, NEEDIU_CITIES } from '@/lib/neediuPro'
import { NEEDIU_SERVICE_KEYS } from '@/content/neediu/services'
import { createNeediuServiceClient } from '@/lib/neediuSupabase'
import { neediuProConfirmMail } from '@/content/emails/neediuPro'
import { sendEmail } from '@/lib/sendEmail'

const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
const CONSENT_VERSION = '2026-11-04'
const CITY_KEYS = NEEDIU_CITIES.map(c => c.key) as [string, ...string[]]

const schema = z.object({
  firstName:   z.string().trim().min(1).max(80),
  lastName:    z.string().trim().min(1).max(80),
  email:       z.string().trim().toLowerCase().email().max(160),
  phone:       z.string().trim().regex(/^\+[1-9]\d{7,14}$/),
  companyName: z.string().trim().min(2).max(160),
  vat:         z.string().trim().min(5).max(30).regex(/^[A-Za-z0-9 .\-/]+$/),
  cityKey:     z.enum(CITY_KEYS),
  services:    z.array(z.string()).min(1).max(NEEDIU_SERVICE_KEYS.length).refine(a => a.every(k => NEEDIU_SERVICE_KEYS.includes(k))),
  consent:     z.literal(true),
  website:     z.string().max(0).optional().default(''),
  locale:      z.enum(LOCALES).default('fr'),
})

/**
 * Préinscription des pros : écrit dans la table provider_preregistrations du projet Supabase neediu-react (maître des données).
 * Fermée en production tant que NEEDIU_PRO_PUBLIC n'est pas « true ». Sans clé neediu en preview ou en local : mode test
 * (validation complète, rien n'est enregistré).
 */
export async function POST(req: NextRequest) {
  if (!isNeediuProVisible()) return NextResponse.json({ error: 'closed' }, { status: 404 })
  const db = createNeediuServiceClient()
  if (!db && process.env.VERCEL_ENV === 'production') return NextResponse.json({ error: 'unconfigured' }, { status: 503 })

  try {
    const data = schema.parse(await req.json())
    if (!db) return NextResponse.json({ ok: true, dryRun: true })

    const preset = NEEDIU_CITIES.find(c => c.key === data.cityKey)!
    const { data: existing } = await db.from('provider_preregistrations').select('confirmed_at').eq('email', data.email).maybeSingle()
    if (existing?.confirmed_at) return NextResponse.json({ ok: true })

    const token = randomBytes(24).toString('base64url')
    const row = {
      first_name: data.firstName, last_name: data.lastName, email: data.email, phone: data.phone,
      business_name: data.companyName, vat_number: data.vat,
      country_code: preset.country, city_name: preset.name,
      service_keys: data.services, locale: data.locale, consent_at: new Date().toISOString(), consent_version: CONSENT_VERSION,
      confirm_token_hash: createHash('sha256').update(token).digest('hex'),
      confirm_expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    }
    const { error } = await db.from('provider_preregistrations').upsert(row, { onConflict: 'email' })
    if (error) { console.error('[neediu/waitlist] insert', error.message); return NextResponse.json({ error: 'internal' }, { status: 500 }) }

    const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
    const mail = neediuProConfirmMail(data.locale, data.firstName, `${site}/api/neediu/waitlist/confirm?token=${token}&locale=${data.locale}`)
    await sendEmail(data.email, mail.subject, mail.html, 'neediu-waitlist')
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'validation' }, { status: 400 })
    console.error('[neediu/waitlist]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
