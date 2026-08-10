/**
 * Aegryn Valuation Engine v1.0
 *
 * Mirrors the 4-dimension CIFS grading protocol from /grade/methodology.
 * Thresholds are calibrated to match the published grade grid:
 *   90-100 → ★   | 75-89 → AAA | 60-74 → AA
 *   45-59  → A   | 30-44 → B   | < 30  → Non gradable
 *
 * Each dimension scores 0-25 pts. Total /100 → grade → multiplier range.
 * 100% client-side — zero API calls.
 */

/* ─── Input types ────────────────────────────────────────── */

export interface FinanceData {
  arr:        number   // Annual Recurring Revenue €
  growth:     number   // YoY %
  churn:      number   // Monthly churn %
  nrr:        number   // Net Revenue Retention %
  margin:     number   // Gross margin %
  seniority:  'under1' | 'one_to_three' | 'above3'
  arrAudited: 'yes' | 'no' | 'not_yet'
}

export interface CodeData {
  tests:      'full' | 'partial' | 'none'
  docs:       'full' | 'partial' | 'none'
  cicd:       'yes' | 'no'
  techDebt:   'documented' | 'known' | 'unknown'
  deps:       'under1y' | 'one_to_two' | 'above2y' | 'unknown'
  stack:      string   // label only, no score impact
}

export interface IPData {
  trademark:  'yes' | 'pending' | 'no'
  copyright:  'full' | 'partial' | 'none'
  opensource: 'clean' | 'gpl' | 'unaudited'
  apiContracts: 'yes' | 'partial' | 'no'
}

export interface SecurityData {
  pentest:    'under6m' | 'six_to_12m' | 'above12m' | 'never'
  gdpr:       'full' | 'partial' | 'none'
  mfa:        'yes' | 'no'
  secrets:    'vault' | 'partial' | 'none'
}

export interface ValuationInput {
  finance:  FinanceData
  code:     CodeData
  ip:       IPData
  security: SecurityData
}

/* ─── Score functions (0-25 each) ───────────────────────── */

export function scoreFinance(d: FinanceData): number {
  let s = 0

  // ARR audited (max 5)
  s += d.arrAudited === 'yes' ? 5 : d.arrAudited === 'not_yet' ? 2 : 0

  // NRR (max 7)
  s += d.nrr >= 120 ? 7 : d.nrr >= 110 ? 6 : d.nrr >= 100 ? 4 : d.nrr >= 90 ? 2 : 0

  // Churn (max 6)
  s += d.churn <= 1   ? 6
    : d.churn <= 2   ? 5
    : d.churn <= 4   ? 4
    : d.churn <= 6   ? 2
    : d.churn <= 10  ? 1
    : 0

  // Growth YoY (max 5)
  s += d.growth >= 50 ? 5
    : d.growth >= 25 ? 4
    : d.growth >= 10 ? 3
    : d.growth >= 0  ? 1
    : 0

  // Seniority (max 2)
  s += d.seniority === 'above3'      ? 2
    : d.seniority === 'one_to_three' ? 1
    : 0

  return Math.min(s, 25)
}

export function scoreCode(d: CodeData): number {
  let s = 0

  // Tests (max 8)
  s += d.tests === 'full'    ? 8 : d.tests === 'partial' ? 4 : 0

  // Documentation (max 6)
  s += d.docs  === 'full'    ? 6 : d.docs  === 'partial' ? 3 : 0

  // CI/CD (max 5)
  s += d.cicd  === 'yes' ? 5 : 0

  // Tech debt (max 4)
  s += d.techDebt === 'documented' ? 4
    : d.techDebt === 'known'       ? 2
    : 0

  // Dependencies (max 2)
  s += d.deps === 'under1y'    ? 2
    : d.deps === 'one_to_two'  ? 1
    : 0

  return Math.min(s, 25)
}

export function scoreIP(d: IPData): number {
  let s = 0

  // Trademark (max 8)
  s += d.trademark  === 'yes'     ? 8 : d.trademark  === 'pending' ? 4 : 0

  // Copyright / software rights (max 8)
  s += d.copyright  === 'full'    ? 8 : d.copyright  === 'partial' ? 4 : 0

  // Open-source compliance (max 6)
  s += d.opensource === 'clean'   ? 6 : d.opensource === 'gpl' ? 2 : 1

  // API contracts (max 3)
  s += d.apiContracts === 'yes'   ? 3 : d.apiContracts === 'partial' ? 1 : 0

  return Math.min(s, 25)
}

export function scoreSecurity(d: SecurityData): number {
  let s = 0

  // Pentest (max 10)
  s += d.pentest === 'under6m'    ? 10
    : d.pentest === 'six_to_12m'  ?  6
    : d.pentest === 'above12m'    ?  2
    : 0

  // GDPR (max 7)
  s += d.gdpr    === 'full'       ?  7 : d.gdpr    === 'partial' ? 3 : 0

  // MFA (max 5)
  s += d.mfa     === 'yes'        ?  5 : 0

  // Secrets management (max 3)
  s += d.secrets === 'vault'      ?  3 : d.secrets === 'partial' ? 1 : 0

  return Math.min(s, 25)
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

export interface ValuationResult {
  scores: {
    finance:  number
    code:     number
    ip:       number
    security: number
    total:    number
  }
  grade:    GradeEstimate
  range: {
    low:    number
    high:   number
    median: number
  } | null  // null = pre-revenue mode
  preRevenue: boolean
  preRevenueScore: number  // IP + Code combined → proxy for asset value
  /** Weakest dimension key for targeted CTA */
  weakestDim:   'finance' | 'code' | 'ip' | 'security'
  /** Strongest dimension key for positive reinforcement */
  strongestDim: 'finance' | 'code' | 'ip' | 'security'
}

export function runValuation(input: ValuationInput): ValuationResult {
  const sf = scoreFinance(input.finance)
  const sc = scoreCode(input.code)
  const si = scoreIP(input.ip)
  const ss = scoreSecurity(input.security)
  const total = sf + sc + si + ss

  const grade = estimateGrade(total)
  const arr   = input.finance.arr

  const scores = { finance: sf, code: sc, ip: si, security: ss, total }

  // Find weakest / strongest
  const dimScores = { finance: sf, code: sc, ip: si, security: ss } as const
  type DimKey = keyof typeof dimScores
  const sorted = (Object.keys(dimScores) as DimKey[]).sort((a, b) => dimScores[a] - dimScores[b])
  const weakestDim   = sorted[0]
  const strongestDim = sorted[sorted.length - 1]

  // Pre-revenue branch
  if (arr <= 0) {
    const preRevenueScore = si + sc  // IP + Code only
    return {
      scores,
      grade,
      range: null,
      preRevenue: true,
      preRevenueScore,
      weakestDim,
      strongestDim,
    }
  }

  // Normal branch
  const low    = arr * grade.multLow
  const high   = arr * grade.multHigh
  const median = arr * ((grade.multLow + grade.multHigh) / 2)

  return {
    scores,
    grade,
    range: { low, high, median },
    preRevenue: false,
    preRevenueScore: 0,
    weakestDim,
    strongestDim,
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
