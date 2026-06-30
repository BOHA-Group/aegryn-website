/**
 * lib/auction/mapRowToAsset.ts
 * Transforms a Supabase auction_lots row into the AssetLot shape
 * expected by <AssetLotSheet />.
 */
import type { AssetLot, AuctionLotRow } from '@/types/auction'

function jsonb<T>(raw: unknown, fallback: T): T {
  if (!raw) return fallback
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as T } catch { return fallback }
  }
  return raw as T
}

export function mapRowToAsset(row: AuctionLotRow): AssetLot {
  return {
    lotNumber:      row.lot_number,
    name:           row.name,
    tagline:        row.tagline        ?? '',
    catalogContext: row.catalog_context ?? '',

    heroStats: jsonb(row.hero_stats, []),
    grade: {
      letter: row.grade_letter ?? '—',
      label:  row.grade_label  ?? '',
    },

    executiveSummary:    jsonb(row.executive_summary,  { intro: '', items: [] }),
    presentationNotice:  jsonb(row.presentation_notice, { body: [], meta: '' }),
    provenance:          jsonb(row.provenance,          { body: [] }),
    rarity:              jsonb(row.rarity,              { body: [] }),
    assetState:          jsonb(row.asset_state,         { body: [], specs: [] }),
    capabilities:        jsonb(row.capabilities,        { intro: '', items: [] }),
    targetSegments:      jsonb(row.target_segments,     { intro: '', items: [] }),
    growth:              jsonb(row.growth,              { body: [], items: [] }),
    competitivePosition: jsonb(row.competitive_position,{ body: [] }),
    traction:            jsonb(row.traction,            { body: [] }),
    maturity:            jsonb(row.maturity,            { specs: [] }),
    risks:               jsonb(row.risks,               { intro: '', items: [] }),
    thesis:              jsonb(row.thesis,              { body: [] }),
    mentions:            jsonb(row.mentions,            { body: [] }),
  }
}
