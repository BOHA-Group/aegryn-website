/**
 * POST /api/nda/request
 * Acquéreur demande l'accès NDA pour un actif publié.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

const schema = z.object({
  assetId:      z.string().uuid(),
  buyerEmail:   z.string().email(),
  buyerName:    z.string().min(2).max(100),
  buyerCompany: z.string().max(150).optional(),
  buyerType:    z.enum(['pe', 'strategic', 'family_office', 'individual']).optional(),
  capacity:     z.string().max(50).optional(),
  message:      z.string().max(2000).optional(),
  locale:       z.string().max(5).optional(),
})

async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'contact@boha-group.com'
  const name = process.env.RESEND_FROM_NAME ?? 'AEGRYN'
  if (!key) return
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `${name} <${from}>`, to: [to], subject, text }),
  })
  if (!res.ok) console.error('[nda/request] Resend error', await res.text())
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const supa = createServiceClient()

    /* ── 1. Vérifier que l'actif est bien publié ── */
    const { data: asset } = await supa
      .from('assets')
      .select('id, official_grade, asset_type')
      .eq('id', body.assetId)
      .eq('status', 'published')
      .single()

    if (!asset) {
      return NextResponse.json({ error: 'asset_not_found' }, { status: 404 })
    }

    /* ── 2. Insérer la demande NDA ── */
    const { error: dbError } = await supa.from('nda_requests').insert({
      asset_id:      body.assetId,
      buyer_email:   body.buyerEmail,
      buyer_name:    body.buyerName,
      buyer_company: body.buyerCompany ?? null,
      buyer_type:    body.buyerType    ?? null,
      capacity:      body.capacity     ?? null,
      message:       body.message      ?? null,
      locale:        body.locale       ?? 'fr',
      status:        'pending',
    })

    if (dbError) {
      console.error('[nda/request] DB error:', dbError)
      return NextResponse.json({ error: 'db_error' }, { status: 500 })
    }

    /* ── 3. Email confirmation acquéreur ── */
    const internal = process.env.AEGRYN_INTERNAL_EMAIL ?? 'team@boha-group.com'
    await Promise.allSettled([
      sendEmail(
        body.buyerEmail,
        'AEGRYN — Votre demande d\'accès NDA a été reçue',
        `Bonjour ${body.buyerName},\n\nNous avons bien reçu votre demande d'accès au dossier de cet actif (Grade ${asset.official_grade ?? '—'} — ${asset.asset_type ?? '—'}).\n\nNotre équipe va examiner votre profil dans les 24-48h ouvrées. Si votre dossier d'acquéreur est validé, vous recevrez l'accord de confidentialité (NDA) à signer électroniquement.\n\nL'équipe AEGRYN\nhttps://aegryn.boha-group.com`
      ),
      sendEmail(
        internal,
        `[NDA Request] ${body.buyerName} — Grade ${asset.official_grade ?? '—'}`,
        `Nouvelle demande NDA\n\nAcquéreur : ${body.buyerName}\nEmail : ${body.buyerEmail}\nSociété : ${body.buyerCompany ?? '—'}\nType : ${body.buyerType ?? '—'}\nCapacité : ${body.capacity ?? '—'}\nActif ID : ${body.assetId}\nGrade : ${asset.official_grade ?? '—'}\nMessage : ${body.message ?? '—'}\nLocale : ${body.locale ?? '—'}\n\nRevoir dans /admin/members`
      ),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[nda/request]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
