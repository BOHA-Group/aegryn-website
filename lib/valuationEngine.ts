/**
 * Aegryn Valuation Engine v2.0 — CIFSO v4.0
 *
 * Five independent dimensions, each scored 0–20 pts. Total /100.
 *   C — Capital & IP (code, architecture, IP, marque)
 *   I — Intégrité & Gouvernance (juridique, cap table, contrats, moat)
 *   F — Finances & Métriques (ARR, churn, NRR, marges, croissance)
 *   S — Sécurité & Souveraineté (pentest, RGPD, MFA, secrets, infra)
 *   O — Organisation & Talent (dépendance fondateur, N-1, succession)
 *
 * Grade grid (mirrors /grade/methodology):
 *   90-100 → ★   | 75-89 → AAA | 60-74 → AA
 *   45-59  → A   | 30-44 → B   | < 30  → Non gradable
 *
 * 100% client-side — zero API calls.
 */

/* ─── Input types ────────────────────────────────────────── */

export interface CapitalData {
  tests:      'full' | 'partial' | 'none'        // Code coverage
  docs:       'full' | 'partial' | 'none'        // Technical docs
  cicd:       'yes' | 'no'                       // CI/CD pipeline
  techDebt:   'documented' | 'known' | 'unknown' // Tech debt
  trademark:  'yes' | 'pending' | 'no'           // Brand registered
  stack:      string                              // label only
}

export interface IntegrityData {
  structure:     'clean' | 'partial' | 'none'    // Legal structure / cap table
  contracts:     'full' | 'partial' | 'none'     // Client/supplier contracts
  litiges:       'none' | 'minor' | 'active'     // Active disputes
  moat:          'strong' | 'moderate' | 'none'  // Competitive moat
}

export interface FinanceData {
  arr:        number
  growth:     number   // YoY %
  churn:      number   // Monthly churn %
  nrr:        number   // Net Revenue Retention %
  margin:     number   // Gross margin %
  seniority:  'under1' | 'one_to_three' | 'above3'
  arrAudited: 'yes' | 'no' | 'not_yet'
}

export interface SecurityData {
  pentest:    'under6m' | 'six_to_12m' | 'above12m' | 'never'
  gdpr:       'full' | 'partial' | 'none'
  mfa:        'yes' | 'no'
  secrets:    'vault' | 'partial' | 'none'
  infra:      'isolated' | 'partial' | 'mixed'   // Prod/staging isolation
}

export interface OrgData {
  founderDep:   'low' | 'moderate' | 'high'      // ≤20% / 20-50% / >50% CA
  nMinus1:      'yes' | 'partial' | 'no'         // N-1 autonome sur fonctions clés
  succession:   'documented' | 'partial' | 'none'
  turnover:     'low' | 'moderate' | 'high'      // <10% / 10-20% / >20%
}

export interface ValuationInput {
  capital:   CapitalData
  integrity: IntegrityData
  finance:   FinanceData
  security:  SecurityData
  org:       OrgData
}

/* ─── Score functions (0-20 each) ───────────────────────── */

export function scoreCapital(d: CapitalData): number {
  let s = 0

  // Tests / code coverage (max 6)
  s += d.tests === 'full' ? 6 : d.tests === 'partial' ? 3 : 0

  // Docs (max 4)
  s += d.docs  === 'full' ? 4 : d.docs  === 'partial' ? 2 : 0

  // CI/CD (max 4)
  s += d.cicd  === 'yes' ? 4 : 0

  // Tech debt (max 3)
  s += d.techDebt === 'documented' ? 3 : d.techDebt === 'known' ? 1 : 0

  // Trademark (max 3)
  s += d.trademark === 'yes' ? 3 : d.trademark === 'pending' ? 1 : 0

  return Math.min(s, 20)
}

export function scoreIntegrity(d: IntegrityData): number {
  let s = 0

  // Legal structure / cap table (max 7)
  s += d.structure === 'clean' ? 7 : d.structure === 'partial' ? 3 : 0

  // Contracts (max 6)
  s += d.contracts === 'full' ? 6 : d.contracts === 'partial' ? 3 : 0

  // Litiges (max 4)
  s += d.litiges === 'none' ? 4 : d.litiges === 'minor' ? 2 : 0

  // Moat (max 3)
  s += d.moat === 'strong' ? 3 : d.moat === 'moderate' ? 1 : 0

  return Math.min(s, 20)
}

export function scoreFinance(d: FinanceData): number {
  let s = 0

  // ARR audited (max 4)
  s += d.arrAudited === 'yes' ? 4 : d.arrAudited === 'not_yet' ? 1 : 0

  // NRR (max 5)
  s += d.nrr >= 120 ? 5 : d.nrr >= 110 ? 4 : d.nrr >= 100 ? 3 : d.nrr >= 90 ? 1 : 0

  // Churn (max 5)
  s += d.churn <= 1  ? 5
    : d.churn <= 2  ? 4
    : d.churn <= 3  ? 3
    : d.churn <= 5  ? 2
    : d.churn <= 10 ? 1
    : 0

  // Growth YoY (max 4)
  s += d.growth >= 50 ? 4
    : d.growth >= 25 ? 3
    : d.growth >= 10 ? 2
    : d.growth >= 0  ? 1
    : 0

  // Seniority (max 2)
  s += d.seniority === 'above3' ? 2 : d.seniority === 'one_to_three' ? 1 : 0

  return Math.min(s, 20)
}

export function scoreSecurity(d: SecurityData): number {
  let s = 0

  // Pentest (max 7)
  s += d.pentest === 'under6m'   ? 7
    : d.pentest === 'six_to_12m' ? 4
    : d.pentest === 'above12m'   ? 1
    : 0

  // GDPR (max 5)
  s += d.gdpr    === 'full'    ? 5 : d.gdpr    === 'partial' ? 2 : 0

  // MFA (max 4)
  s += d.mfa     === 'yes'     ? 4 : 0

  // Secrets management (max 2)
  s += d.secrets === 'vault'   ? 2 : d.secrets === 'partial' ? 1 : 0

  // Infra isolation (max 2)
  s += d.infra   === 'isolated' ? 2 : d.infra === 'partial' ? 1 : 0

  return Math.min(s, 20)
}

export function scoreOrg(d: OrgData): number {
  let s = 0

  // Founder dependency (max 8)
  s += d.founderDep === 'low' ? 8 : d.founderDep === 'moderate' ? 4 : 0

  // N-1 autonomy (max 6)
  s += d.nMinus1 === 'yes' ? 6 : d.nMinus1 === 'partial' ? 3 : 0

  // Succession plan (max 4)
  s += d.succession === 'documented' ? 4 : d.succession === 'partial' ? 2 : 0

  // Turnover (max 2)
  s += d.turnover === 'low' ? 2 : d.turnover === 'moderate' ? 1 : 0

  return Math.min(s, 20)
}

/* ─── Grade estimation (mirrors /grade/methodology grid) ─── */

export type GradeCode = '★' | 'AAA' | 'AA' | 'A' | 'B' | 'NG'

export interface GradeEstimate {
  grade:       GradeCode
  totalScore:  number
  multLow:     number
  multHigh:    number
  colorClass:  string
}

export function estimateGrade(total: number): GradeEstimate {
  if (total >= 90) return { grade: '★',   totalScore: total, multLow: 6.5, multHigh: 9.0, colorClass: 'text-ag-apex' }
  if (total >= 75) return { grade: 'AAA', totalScore: total, multLow: 5.0, multHigh: 6.5, colorClass: 'text-ag-grade-aaa' }
  if (total >= 60) return { grade: 'AA',  totalScore: total, multLow: 3.5, multHigh: 5.0, colorClass: 'text-ag-grade-aa' }
  if (total >= 45) return { grade: 'A',   totalScore: total, multLow: 2.0, multHigh: 3.5, colorClass: 'text-ag-grade-a' }
  if (total >= 30) return { grade: 'B',   totalScore: total, multLow: 1.0, multHigh: 2.0, colorClass: 'text-ag-grade-b' }
  return                   { grade: 'NG', totalScore: total, multLow: 0.3, multHigh: 0.8, colorClass: 'text-ag-gray-light' }
}

/* ─── Valuation output ───────────────────────────────────── */

export type DimKey = 'capital' | 'integrity' | 'finance' | 'security' | 'org'

export interface ValuationResult {
  scores: {
    capital:   number
    integrity: number
    finance:   number
    security:  number
    org:       number
    total:     number
  }
  grade:    GradeEstimate
  range: {
    low:    number
    high:   number
    median: number
  } | null
  preRevenue:      boolean
  preRevenueScore: number
  weakestDim:   DimKey
  strongestDim: DimKey
}

export function runValuation(input: ValuationInput): ValuationResult {
  const sc = scoreCapital(input.capital)
  const si = scoreIntegrity(input.integrity)
  const sf = scoreFinance(input.finance)
  const ss = scoreSecurity(input.security)
  const so = scoreOrg(input.org)
  const total = sc + si + sf + ss + so

  const grade = estimateGrade(total)
  const arr   = input.finance.arr

  const scores = { capital: sc, integrity: si, finance: sf, security: ss, org: so, total }

  const dimScores = { capital: sc, integrity: si, finance: sf, security: ss, org: so } as const
  const sorted = (Object.keys(dimScores) as DimKey[]).sort((a, b) => dimScores[a] - dimScores[b])
  const weakestDim   = sorted[0]
  const strongestDim = sorted[sorted.length - 1]

  if (arr <= 0) {
    const preRevenueScore = sc + si
    return {
      scores, grade, range: null,
      preRevenue: true, preRevenueScore,
      weakestDim, strongestDim,
    }
  }

  const low    = arr * grade.multLow
  const high   = arr * grade.multHigh
  const median = arr * ((grade.multLow + grade.multHigh) / 2)

  return {
    scores, grade,
    range: { low, high, median },
    preRevenue: false, preRevenueScore: 0,
    weakestDim, strongestDim,
  }
}

/* ─── Formatting helpers ─────────────────────────────────── */

export function fmtEur(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')} M€`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K€`
  return `${Math.round(n)} €`
}

export function preRevenueRange(score: number): { low: number; high: number } {
  // IP + Code combined (0-50) → proxy estimate 50K€ to 500K€
  const pct = Math.min(score, 50) / 50
  return {
    low:  50_000 + pct * 100_000,
    high: 150_000 + pct * 350_000,
  }
}

/* ─── Benchmark market anchor (60% weight) ──────────────── */

export interface BenchmarkResult {
  multipleLow:  number
  multipleHigh: number
  source:       string
  sourceDate:   string
  tier:         string
}

/**
 * Fetches the best matching benchmark tier for a given asset profile.
 * Requires a Supabase client with anon access to benchmark_data.
 * Server-side only — do not call from client components.
 *
 * @param supabase  - Supabase client instance (anon or service)
 * @param category  - Asset category matching benchmark_data.category
 * @param nrr       - Net Revenue Retention %
 * @param growth    - YoY growth %
 * @param margin    - Gross margin %
 */
export async function fetchBenchmark(
  supabase: { from: (table: string) => unknown },
  category: string,
  nrr:      number,
  growth:   number,
  margin:   number,
): Promise<BenchmarkResult | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('benchmark_data')
    .select('profile_tier, multiple_low, multiple_high, source, source_date')
    .eq('category', category)
    .lte('nrr_min', nrr)
    .lte('growth_min', growth)
    .lte('gross_margin_min', margin)
    .order('nrr_min', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  return {
    multipleLow:  data.multiple_low,
    multipleHigh: data.multiple_high,
    source:       data.source,
    sourceDate:   data.source_date,
    tier:         data.profile_tier,
  }
}

/**
 * Blends benchmark multiples (60%) with internal grade multiples (40%).
 * The market sets the price; the grade explains position in the range.
 */
export function calculateFinalMultiple(
  gradeMultiplier:     { low: number; high: number },
  benchmarkMultiplier: { low: number; high: number },
): { low: number; high: number } {
  return {
    low:  benchmarkMultiplier.low  * 0.6 + gradeMultiplier.low  * 0.4,
    high: benchmarkMultiplier.high * 0.6 + gradeMultiplier.high * 0.4,
  }
}
