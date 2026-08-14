import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

// ── Schéma Zod ────────────────────────────────────────────────────────────────

const EarnoutSchema = z.object({
  included:          z.boolean(),
  percentage:        z.number().min(0).max(100).optional(),
  duration_months:   z.number().int().min(1).max(120).optional(),
  kpi:               z.string().max(500).optional(),
  cap_chf:           z.number().positive().optional(),
}).optional()

const ManagementSchema = z.object({
  included:          z.boolean(),
  duration_months:   z.number().int().min(1).max(60).optional(),
  compensation_chf:  z.number().positive().optional(),
  role:              z.string().max(200).optional(),
  note:              z.string().max(500).optional(),
}).optional()

const NonCompeteSchema = z.object({
  included:          z.boolean(),
  duration_months:   z.number().int().min(1).max(120).optional(),
  geographic_scope:  z.string().max(200).optional(),
  sectors_covered:   z.array(z.string().max(100)).max(10).optional(),
  penalty_chf:       z.number().positive().optional(),
}).optional()

const WarrantiesSchema = z.object({
  warranty_retention_pct:       z.number().min(0).max(100).optional(),
  retention_duration_months:    z.number().int().min(1).max(60).optional(),
  rep_and_warranty_insurance:   z.boolean().optional(),
  indemnity_cap_pct:            z.number().min(0).max(200).optional(),
}).optional()

const TermSheetSchema = z.object({
  asset_id:               z.string().uuid(),
  proposed_price_chf:     z.number().positive(),
  structure:              z.enum(['asset_deal', 'share_deal', 'merger', 'earnout_only', 'mixed']),
  price_comment:          z.string().max(500).optional(),
  earnout:                EarnoutSchema,
  management_contract:    ManagementSchema,
  non_compete:            NonCompeteSchema,
  warranties:             WarrantiesSchema,
  dd_duration_days:       z.number().int().min(14).max(180).optional(),
  closing_weeks:          z.number().int().min(4).max(52).optional(),
  conditions_precedent:   z.array(z.string().max(300)).max(10).optional(),
  buyer_profile_note:     z.string().max(1000).optional(),
})

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = TermSheetSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
  }

  const {
    asset_id, proposed_price_chf, structure, price_comment,
    earnout, management_contract, non_compete, warranties,
    dd_duration_days, closing_weeks, conditions_precedent, buyer_profile_note,
  } = parsed.data

  const supa = createServiceClient()

  // Vérifier actif publié
  const { data: asset } = await supa
    .from('assets')
    .select('id, status, company_name, owner_id')
    .eq('id', asset_id)
    .eq('status', 'published')
    .single()

  if (!asset) return NextResponse.json({ error: 'Asset not found or not published' }, { status: 404 })

  // Un seul term sheet actif par acheteur + actif
  const { data: existing } = await supa
    .from('term_sheets')
    .select('id')
    .eq('asset_id', asset_id)
    .eq('buyer_id', user.id)
    .in('status', ['pending', 'viewed'])
    .limit(1)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'A term sheet is already active for this asset' }, { status: 409 })
  }

  // Insérer
  const { data: ts, error: insertError } = await supa
    .from('term_sheets')
    .insert({
      asset_id,
      buyer_id:            user.id,
      proposed_price_chf,
      structure,
      price_comment:       price_comment ?? null,
      earnout:             earnout ?? null,
      management_contract: management_contract ?? null,
      non_compete:         non_compete ?? null,
      warranties:          warranties ?? null,
      dd_duration_days:    dd_duration_days ?? null,
      closing_weeks:       closing_weeks ?? null,
      conditions_precedent: conditions_precedent ?? null,
      buyer_profile_note:  buyer_profile_note ?? null,
      status:              'pending',
      version:             1,
      expires_at:          new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    })
    .select('id')
    .single()

  if (insertError || !ts) {
    return NextResponse.json({ error: 'Failed to create term sheet' }, { status: 500 })
  }

  // Notification acheteur
  await supa.from('user_notifications').insert({
    user_id:     user.id,
    type:        'term_sheet_submitted',
    title:       'Votre Term Sheet a été soumise',
    body:        `Proposition de CHF ${proposed_price_chf.toLocaleString('fr-CH')} pour ${asset.company_name ?? 'l\'actif'}. Le cédant dispose de 72h pour répondre.`,
    link:        `/client/buyer/propositions/${ts.id}`,
    payload:     { term_sheet_id: ts.id, asset_id, proposed_price_chf },
    target_role: 'buyer',
  })

  // Notification vendeur (si owner_id dispo)
  if (asset.owner_id) {
    await supa.from('user_notifications').insert({
      user_id:     asset.owner_id,
      type:        'term_sheet_received',
      title:       'Nouvelle Term Sheet reçue',
      body:        `Une proposition structurée a été soumise pour ${asset.company_name ?? 'votre actif'}. Vous disposez de 72h pour répondre.`,
      link:        `/client/seller/actifs/${asset_id}`,
      payload:     { term_sheet_id: ts.id, asset_id },
      target_role: 'seller',
    })
  }

  return NextResponse.json({ id: ts.id }, { status: 201 })
}
