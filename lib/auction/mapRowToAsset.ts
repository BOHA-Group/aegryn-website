/**
 * lib/auction/mapRowToAsset.ts
 * Convertit une ligne de la table Supabase `auction_assets` en objet
 * `asset` consommable par <AssetLotSheet />.
 *
 * Le helper jsonb() gère le cas défensif où Supabase renverrait la colonne
 * JSONB sous forme de string non parsée (rare mais possible en Edge Runtime).
 * En fonctionnement normal, Supabase parse déjà les JSONB en objets JS.
 */
import type { AssetLot, AuctionLotRow } from '@/types/auction'

function jsonb<T>(raw: unknown, fallback: T): T {
  if (!raw) return fallback
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as T } catch { return fallback }
  }
  return raw as T
}

export function mapRowToAsset(row: AuctionLotRow | null): AssetLot | null {
  if (!row) return null

  return {
    lotNumber:      row.lot_number ?? '—',
    name:           row.name       ?? '',
    tagline:        row.tagline        ?? '',
    catalogContext: row.catalog_context ?? '',

    heroStats: jsonb(row.hero_stats, []),

    grade: (() => {
      const g = jsonb<{ letter?: string; label?: string }>(row.grade, {})
      return {
        letter: g.letter ?? '—',
        label:  g.label  ?? 'Grade non encore attribué.',
      }
    })(),

    executiveSummary:    jsonb(row.executive_summary,   { intro: '', items: [] }),
    presentationNotice:  jsonb(row.presentation_notice, { body: [], meta: '' }),
    provenance:          jsonb(row.provenance,           { body: [] }),
    rarity:              jsonb(row.rarity,               { body: [], highlight: '' }),
    assetState:          jsonb(row.asset_state,          { body: [], specs: [], note: '' }),
    capabilities:        jsonb(row.capabilities,         { intro: '', items: [], pending: '' }),
    targetSegments:      jsonb(row.target_segments,      { intro: '', items: [], note: '' }),
    growth:              jsonb(row.growth,               { body: [], items: [], closing: '' }),
    competitivePosition: jsonb(row.competitive_position, { body: [], highlight: '', closing: '' }),
    traction:            jsonb(row.traction,             { body: [] }),
    maturity:            jsonb(row.maturity,             { specs: [] }),
    risks:               jsonb(row.risks,                { intro: '', items: [] }),
    thesis:              jsonb(row.thesis,               { body: [], closing: '' }),
    mentions:            jsonb(row.mentions,             { body: [] }),
  }
}
