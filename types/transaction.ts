/**
 * types/transaction.ts
 * Shapes for AssetLotSheet and related transaction data.
 * Every field mirrors a Supabase JSONB column in `transaction_assets`.
 */

/** Teaser document confidentiel — AssetTeaserDocument */
export interface AssetTeaser {
  lotNumber:      string
  name:           string
  tagline:        string
  catalogContext: string
  recipientName:  string | null
  pitch:          string
  tags:           string[]
  stats:          Array<{ value: string; label: string }>
  investmentNote: string
}

export interface HeroStat {
  value: string
  label: string
}

export interface SummaryItem {
  label: string
  value: string
}

export interface ExecutiveSummary {
  intro: string
  items: SummaryItem[]
}

export interface BulletItem {
  label: string
  text: string
}

export interface TargetItem {
  title: string
  desc: string
}

export interface AssetGrade {
  letter: string  // A, B, AA, AAA, ★
  label: string   // qualitative description
}

export interface AssetLot {
  lotNumber:   string
  name:        string
  tagline:     string
  catalogContext: string

  heroStats:   HeroStat[]
  grade:       AssetGrade

  executiveSummary: ExecutiveSummary

  presentationNotice: {
    body: string[]
    meta: string
  }
  provenance: {
    body: string[]
  }
  rarity: {
    body:       string[]
    highlight?: string
  }
  assetState: {
    body:  string[]
    specs: [string, string][]
    note?: string
  }
  capabilities: {
    intro:    string
    items:    BulletItem[]
    pending?: string
  }
  targetSegments: {
    intro: string
    items: TargetItem[]
    note?: string
  }
  growth: {
    body:     string[]
    items:    BulletItem[]
    closing?: string
  }
  competitivePosition: {
    body:       string[]
    highlight?: string
    closing?:   string
  }
  traction: {
    body: string[]
  }
  maturity: {
    specs: [string, string][]
  }
  risks: {
    intro: string
    items: BulletItem[]
  }
  thesis: {
    body:     string[]
    closing?: string
  }
  mentions: {
    body: string[]
  }
}

/**
 * Public teaser fields — visible in the catalog without NDA.
 * Derived from the auction_lots row.
 */
export interface AssetLotTeaser {
  id:              string
  slug:            string
  lot_number:      string
  tagline:         string | null
  catalog_context: string | null
  grade:           { letter: string; label: string }
  status:          'draft' | 'published' | 'archived' | 'withdrawn'
  access_circle:   number
  session_opens_at: string | null
}

/** Supabase row shape (transaction_assets table — schéma canonique) */
export interface TransactionLotRow {
  id:              string
  slug:            string
  lot_number:      string
  name:            string
  tagline:         string | null
  catalog_context: string | null
  /** JSONB {letter: string, label: string} */
  grade:              unknown
  status:          'draft' | 'published' | 'archived' | 'withdrawn'
  access_circle:   number
  session_opens_at:  string | null
  session_closes_at: string | null
  hero_stats:          unknown
  executive_summary:   unknown
  presentation_notice: unknown
  provenance:          unknown
  rarity:              unknown
  asset_state:         unknown
  capabilities:        unknown
  target_segments:     unknown
  growth:              unknown
  competitive_position: unknown
  traction:            unknown
  maturity:            unknown
  risks:               unknown
  thesis:              unknown
  mentions:            unknown
}

/** Access record shape (transaction_asset_access table) */
export interface TransactionLotAccess {
  id:         string
  asset_id:   string
  user_id:    string
  granted_at: string
  expires_at: string
  status:     'active' | 'revoked'
}
