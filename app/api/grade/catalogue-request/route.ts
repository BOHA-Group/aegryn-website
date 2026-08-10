import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { getUser }                  from '@/lib/supabaseServer'

const schema = z.object({
  assetId:          z.string().uuid().optional(),
  assetName:        z.string().min(1).max(200),
  catalogueAgreed:  z.boolean(),
  feeAgreed:        z.boolean(),
})

async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${process.env.RESEND_FROM_NAME ?? 'Aegryn'} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to: [to],
      subject,
      text,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const body = schema.parse(await req.json())

    if (!body.catalogueAgreed || !body.feeAgreed) {
      return NextResponse.json(
        { error: 'consent_required', message: 'Les deux cases d\'accord sont requises.' },
        { status: 422 }
      )
    }

    const supa  = createServiceClient()
    const adminEmail = process.env.Aegryn_INTERNAL_EMAIL ?? 'team@boha-group.com'

    /* ── Récupérer le profil cédant ── */
    const { data: profile } = await supa
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const sellerName = profile?.full_name ?? user.email ?? 'Cédant'

    /* ── Créer la demande catalogue ── */
    const { data: catReq, error: catErr } = await supa
      .from('catalogue_requests')
      .insert({
        asset_id:              body.assetId ?? null,
        seller_uid:            user.id,
        seller_email:          user.email!,
        seller_name:           sellerName,
        asset_name:            body.assetName,
        catalogue_agreed:      true,
        publication_fee_agreed: true,
        status:                'pending',
      })
      .select('id')
      .single()

    if (catErr) {
      return NextResponse.json({ error: 'db_error', detail: catErr.message }, { status: 500 })
    }

    /* ── Pré-créer le brouillon de facture ── */
    const year   = new Date().getFullYear()
    const { count: invoiceCount } = await supa
      .from('invoices')
      .select('id', { count: 'exact', head: true })
    const seqNum = String((invoiceCount ?? 0) + 1).padStart(4, '0')
    const invoiceNumber = `AEG-${year}-${seqNum}`

    await supa.from('invoices').insert({
      invoice_number:       invoiceNumber,
      catalogue_request_id: catReq!.id,
      asset_id:             body.assetId ?? null,
      seller_uid:           user.id,
      recipient_name:       sellerName,
      recipient_email:      user.email!,
      line_items: [
        {
          description: `Frais de publication catalogue Aegryn — "${body.assetName}"`,
          unit:        'Forfait',
          qty:         1,
          unit_price_ht: 2000,
        }
      ],
      subtotal_ht:  2000,
      vat_rate:     0,
      vat_amount:   0,
      total_ttc:    2000,
      currency:     'CHF',
      iban:         process.env.Aegryn_IBAN ?? '',
      bic:          process.env.Aegryn_BIC ?? '',
      bank_name:    process.env.Aegryn_BANK_NAME ?? '',
      account_holder: 'Aegryn / BOHA-Group',
      status:       'draft',
      due_date:     new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    })

    /* ── Email admin ── */
    const adminLink = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'}/admin/invoices`
    await sendEmail(
      adminEmail,
      `[Catalogue] Nouvelle demande de mise au catalogue — ${body.assetName} (${user.email})`,
      `Nouvelle demande de mise au catalogue Aegryn\n\n` +
      `Cédant : ${sellerName}\n` +
      `Email : ${user.email}\n` +
      `Actif : ${body.assetName}\n` +
      `ID demande : ${catReq!.id}\n` +
      `Accord catalogue : ✓\n` +
      `Accord frais CHF 2 000 HT : ✓\n\n` +
      `Prochaine étape :\n` +
      `1. Vérifier le dossier dans l'espace admin\n` +
      `2. Finaliser et envoyer la facture depuis ${adminLink}\n` +
      `3. Confirmer la réception du virement\n` +
      `4. Marquer la demande comme admise (J0) — la mise au catalogue sera préparée à J+15, visible acquéreurs à J+45\n\n` +
      `Facture brouillon créée : ${invoiceNumber}\n` +
      `→ ${adminLink}`
    )

    /* ── Email cédant (accusé réception) ── */
    await sendEmail(
      user.email!,
      'Aegryn — Votre demande de mise au catalogue a été reçue',
      `Bonjour ${sellerName},\n\n` +
      `Nous avons bien reçu votre demande de mise au catalogue pour l'actif "${body.assetName}".\n\n` +
      `Vous avez accepté :\n` +
      `✓ La mise au catalogue Aegryn\n` +
      `✓ Les frais de publication de CHF 2 000 HT (déductibles de la commission en cas de vente)\n\n` +
      `Prochaines étapes :\n` +
      `1. Notre équipe va examiner votre dossier (délai : 72h ouvrées max)\n` +
      `2. Vous recevrez une facture par email avec les instructions de virement\n` +
      `3. À réception du paiement, votre actif sera préparé pour le catalogue (15 jours)\n` +
      `4. Votre actif sera visible aux acquéreurs membres Aegryn à J+45 minimum\n\n` +
      `Référence demande : ${catReq!.id}\n\n` +
      `L'équipe Aegryn\nhttps://aegryn.com`
    )

    return NextResponse.json({ ok: true, requestId: catReq!.id, invoiceNumber })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
