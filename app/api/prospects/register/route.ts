import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { sendLeadEmails }           from '@/lib/leadCapture'

const baseSchema = z.object({
  email:        z.string().email(),
  firstName:    z.string().min(1).max(100).optional(),
  lastName:     z.string().min(1).max(100).optional(),
  phone:        z.string().max(30).optional(),
  profileType:  z.enum(['buyer', 'seller', 'partner', 'undecided']),
  source:       z.enum(['linkedin', 'referral', 'organic', 'event', 'partner_intro', 'direct']).optional(),
  gdprConsent:      z.literal(true),
  marketingConsent: z.boolean().default(false),
})

const buyerSchema = baseSchema.extend({
  profileType:          z.literal('buyer'),
  buyerCategory:        z.enum(['individual_hnw', 'family_office', 'search_fund', 'pe_vc_fund', 'corporate_strategic', 'holding']).optional(),
  ticketRange:          z.enum(['<500k', '500k-2m', '2m-5m', '5m-20m', '20m+']).optional(),
  acquisitionIntent:    z.enum(['single_asset', 'portfolio_buildup', 'exploratory']).optional(),
  sectorsInterest:      z.array(z.string().max(50)).max(10).default([]),
  timelineToDeploy:     z.enum(['immediate', '3-6m', '6-12m', 'opportunistic']).optional(),
  hasFinancingSecured:  z.boolean().optional(),
})

const sellerSchema = baseSchema.extend({
  profileType:         z.literal('seller'),
  sellerAssetStage:    z.enum(['idea', 'mvp', 'revenue_generating', 'scaling', 'mature']).optional(),
  sellerAssetArrRange: z.enum(['<100k', '100k-500k', '500k-2m', '2m-10m', '10m+']).optional(),
  sellerReasonToSell:  z.enum(['full_exit', 'partial', 'succession', 'burnout', 'strategic_pivot']).optional(),
  sellerTimeline:      z.enum(['immediate', '3-6m', '6-12m', 'flexible']).optional(),
})

const partnerSchema = baseSchema.extend({
  profileType:               z.literal('partner'),
  partnerCategory:           z.enum(['law_firm', 'accounting', 'ma_boutique', 'vc_pe', 'accelerator', 'other']).optional(),
  partnerDealFlowEstimate:   z.enum(['<5_per_year', '5-10_per_year', '10-20_per_year', '20+_per_year']).optional(),
})

const undecidedSchema = baseSchema.extend({
  profileType: z.literal('undecided'),
})

const schema = z.discriminatedUnion('profileType', [
  buyerSchema,
  sellerSchema,
  partnerSchema,
  undecidedSchema,
])

export async function POST(req: NextRequest) {
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const supa = createServiceClient()

  const row: Record<string, unknown> = {
    email:             body.email,
    first_name:        body.firstName    ?? null,
    last_name:         body.lastName     ?? null,
    phone:             body.phone        ?? null,
    profile_type:      body.profileType,
    source:            body.source       ?? null,
    gdpr_consent:      body.gdprConsent,
    marketing_consent: body.marketingConsent,
    status:            'pending',
  }

  if (body.profileType === 'buyer') {
    row.buyer_category          = body.buyerCategory           ?? null
    row.ticket_range            = body.ticketRange             ?? null
    row.acquisition_intent      = body.acquisitionIntent       ?? null
    row.sectors_interest        = body.sectorsInterest         ?? []
    row.timeline_to_deploy      = body.timelineToDeploy        ?? null
    row.has_financing_secured   = body.hasFinancingSecured     ?? null
  }

  if (body.profileType === 'seller') {
    row.seller_asset_stage      = body.sellerAssetStage        ?? null
    row.seller_asset_arr_range  = body.sellerAssetArrRange     ?? null
    row.seller_reason_to_sell   = body.sellerReasonToSell      ?? null
    row.seller_timeline         = body.sellerTimeline          ?? null
  }

  if (body.profileType === 'partner') {
    row.partner_category            = body.partnerCategory           ?? null
    row.partner_deal_flow_estimate  = body.partnerDealFlowEstimate   ?? null
  }

  const { error } = await supa
    .from('prospects')
    .upsert(row, { onConflict: 'email', ignoreDuplicates: false })

  if (error) {
    console.error('[prospects/register]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const profileLabels: Record<string, string> = {
    buyer:     'Acquéreur',
    seller:    'Cédant',
    partner:   'Partenaire',
    undecided: 'Non défini',
  }
  const label = profileLabels[body.profileType] ?? body.profileType

  await sendLeadEmails({
    to:              body.email,
    subjectFounder:  'AEGRYN — Votre inscription à la liste d\'accès prioritaire',
    textFounder:     `Bonjour${body.firstName ? ` ${body.firstName}` : ''},\n\nVotre inscription à la liste d'accès prioritaire AEGRYN a bien été enregistrée (profil : ${label}).\n\nVous serez contacté en priorité lors de l'ouverture de la prochaine session.\n\nPour toute question : contact@boha-group.com\n\nL'équipe AEGRYN\nhttps://aegryn.com`,
    subjectInternal: `[Waitlist Session] Nouveau prospect ${label} — ${body.email}`,
    textInternal:    `Nouveau prospect waitlist session\n\nProfil : ${label}\nEmail : ${body.email}\nNom : ${body.firstName ?? '—'} ${body.lastName ?? ''}\nSource : ${body.source ?? '—'}\nMarketing consent : ${body.marketingConsent ? 'oui' : 'non'}`,
  })

  return NextResponse.json({ ok: true })
}
