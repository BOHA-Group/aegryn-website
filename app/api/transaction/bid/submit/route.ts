/**
 * POST /api/transaction/bid/submit
 * Soumettre une offre sur un actif de la session Aegryn TRANSACT.
 *
 * Règles appliquées côté serveur :
 *  1. Auth obligatoire + accès dossier actif (transact_asset_access)
 *  2. Créneau horaire : bid_opens_at ≤ now ≤ bid_closes_at
 *     (fallback sur session_opens_at / session_closes_at si bid_opens_at absent)
 *  3. Séquestre reçu obligatoire (transact_sequesters.status = 'received')
 *  4. Une seule offre par (asset_id, user_id) — 409 si doublon
 *  5. Montant ≥ reserve_price si défini (sinon 403)
 *  6. INSERT offre status='submitted'
 *  7. Email de confirmation acheteur (sans montant) + notification interne
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createServiceClient }       from '@/lib/supabase'
import { createClient }              from '@supabase/supabase-js'

export const runtime = 'nodejs'

const schema = z.object({
  asset_id:       z.string().uuid(),
  bid_amount_chf: z.coerce.number().positive(),
  bid_model:      z.enum(['club_deal', 'corporate', 'fund', 'equity_stake']).default('corporate'),
  conditions:     z.record(z.unknown()).optional().default({}),
  equity_percentage:   z.coerce.number().min(0).max(100).optional(),
  equity_consideration: z.enum([
    'advisory_fees', 'carried_interest', 'cash_partial', 'warrant', 'revenue_share',
  ]).optional(),
})

async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      from:     `${process.env.RESEND_FROM_NAME ?? 'Aegryn'} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to:       [to],
      subject,
      text,
    }),
  }).catch((e) => console.error('[bid/submit] sendEmail:', e))
}

export async function POST(req: NextRequest) {
  /* ── 1. Auth via cookie de session ── */
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const authCookie   = req.headers.get('cookie') ?? ''

  /* Créer un client avec les cookies pour récupérer l'utilisateur authentifié */
  const authClient = createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Cookie: authCookie } },
    auth:   { persistSession: false },
  })
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  /* ── 2. Validation body ── */
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'validation', issues: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const supa = createServiceClient()
  const now  = new Date()

  /* ── 3. Récupérer l'actif ── */
  const { data: asset } = await supa
    .from('transact_assets')
    .select('id, name, status, reserve_price, session_opens_at, session_closes_at, bid_opens_at, bid_closes_at')
    .eq('id', body.asset_id)
    .single()

  if (!asset || asset.status !== 'published') {
    return NextResponse.json({ error: 'lot_not_available' }, { status: 404 })
  }

  /* ── 4. Vérifier accès dossier actif ── */
  const { data: access } = await supa
    .from('transact_asset_access')
    .select('id, status, expires_at')
    .eq('asset_id', body.asset_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (!access || new Date(access.expires_at) < now) {
    return NextResponse.json({ error: 'no_dossier_access' }, { status: 403 })
  }

  /* ── 5. Vérifier créneau horaire ── */
  const bidOpens  = asset.bid_opens_at  ? new Date(asset.bid_opens_at)  : (asset.session_opens_at  ? new Date(asset.session_opens_at)  : null)
  const bidCloses = asset.bid_closes_at ? new Date(asset.bid_closes_at) : (asset.session_closes_at ? new Date(asset.session_closes_at) : null)

  if (bidOpens && now < bidOpens) {
    return NextResponse.json({
      error:   'bid_window_not_open',
      opens_at: asset.bid_opens_at ?? asset.session_opens_at,
    }, { status: 403 })
  }
  if (bidCloses && now > bidCloses) {
    return NextResponse.json({
      error:    'bid_window_closed',
      closed_at: asset.bid_closes_at ?? asset.session_closes_at,
    }, { status: 403 })
  }

  /* ── 6. Séquestre reçu obligatoire ── */
  const { data: sequester } = await supa
    .from('transact_sequesters')
    .select('id, amount_chf, status')
    .eq('asset_id', body.asset_id)
    .eq('user_id', user.id)
    .eq('status', 'received')
    .maybeSingle()

  if (!sequester) {
    return NextResponse.json({ error: 'sequester_required' }, { status: 403 })
  }

  /* ── 7. Montant ≥ reserve_price ── */
  if (asset.reserve_price && body.bid_amount_chf < asset.reserve_price) {
    return NextResponse.json({
      error:         'below_reserve',
      reserve_price: asset.reserve_price,
    }, { status: 403 })
  }

  /* ── 8. Doublon — un seul bid par (asset_id, user_id) ── */
  const { data: existing } = await supa
    .from('transact_offers')
    .select('id, status')
    .eq('asset_id', body.asset_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({
      error:  'bid_already_submitted',
      bid_id: existing.id,
      status: existing.status,
    }, { status: 409 })
  }

  /* ── 9. Insérer le bid ── */
  const insertPayload: Record<string, unknown> = {
    asset_id:       body.asset_id,
    user_id:        user.id,
    sequester_id:   sequester.id,
    bid_amount_chf: body.bid_amount_chf,
    bid_model:      body.bid_model,
    conditions:     body.conditions ?? {},
    status:         'submitted',
    submitted_at:   now.toISOString(),
  }
  if (body.bid_model === 'equity_stake') {
    insertPayload.equity_percentage    = body.equity_percentage ?? null
    insertPayload.equity_consideration = body.equity_consideration ?? null
  }

  const { data: bid, error: insertError } = await supa
    .from('transact_offers')
    .insert(insertPayload)
    .select('id')
    .single()

  if (insertError) {
    console.error('[bid/submit] insert:', insertError)
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  /* ── 10. Emails (non bloquants) ── */
  const { data: profile } = await supa
    .from('profiles')
    .select('email, full_name')
    .eq('id', user.id)
    .single()

  const buyerEmail = (profile as Record<string, unknown> | null)?.email as string ?? user.email ?? ''
  const buyerName  = (profile as Record<string, unknown> | null)?.full_name as string ?? buyerEmail
  const internal   = process.env.Aegryn_INTERNAL_EMAIL ?? 'tech@boha-group.com'

  await Promise.allSettled([
    sendEmail(
      buyerEmail,
      `Aegryn TRANSACT — Votre offre sur "${asset.name}" a été reçue`,
      `Bonjour ${buyerName},\n\nVotre offre sur l'actif "${asset.name}" a bien été enregistrée dans le processus Aegryn TRANSACT.\n\nRéférence : ${bid?.id}\n\nL'équipe Aegryn vous contactera à l'issue du processus avec les résultats.\n\nL'équipe Aegryn\nhttps://aegryn.com/transact`
    ),
    sendEmail(
      internal,
      `[TRANSACT — Offre] ${asset.name} — ${buyerEmail}`,
      `Nouvelle offre reçue\n\nActif : ${asset.name} (${body.asset_id})\nAcheteur : ${buyerName} <${buyerEmail}>\nMontant : ${body.bid_amount_chf.toLocaleString('fr-CH')} CHF\nModèle : ${body.bid_model}\nOffre ID : ${bid?.id}\nSéquestre : ${sequester.id} (${sequester.amount_chf} CHF)`
    ),
  ])

  return NextResponse.json({ ok: true, bid_id: bid?.id })
}
