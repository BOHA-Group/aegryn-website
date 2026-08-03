/**
 * Calcul de la commission AEGRYN sur une transaction PTT
 * Grille dégressive juillet 2026 — minimum 25 000 € HT
 *
 * En dessous de 100 000 € : taux convenu au mandat (retourne null)
 * Au-dessus de 5 000 000 € : taux convenu au mandat (retourne null)
 */

export type CommissionTier = {
  min_amount:  number
  max_amount:  number | null
  rate:        number | null   // null = "taux convenu au mandat"
  minimum_fee: number
  label:       string
}

/** Grille embarquée — fallback si la table Supabase n'est pas disponible */
export const DEFAULT_TIERS: CommissionTier[] = [
  { min_amount: 100_000,   max_amount: 250_000,   rate: 0.10, minimum_fee: 25_000, label: '100 000 € – 250 000 €' },
  { min_amount: 250_001,   max_amount: 500_000,   rate: 0.09, minimum_fee: 25_000, label: '250 001 € – 500 000 €' },
  { min_amount: 500_001,   max_amount: 1_000_000, rate: 0.08, minimum_fee: 25_000, label: '500 001 € – 1 000 000 €' },
  { min_amount: 1_000_001, max_amount: 2_500_000, rate: 0.07, minimum_fee: 25_000, label: '1 000 001 € – 2 500 000 €' },
  { min_amount: 2_500_001, max_amount: 5_000_000, rate: 0.06, minimum_fee: 25_000, label: '2 500 001 € – 5 000 000 €' },
  { min_amount: 5_000_001, max_amount: null,       rate: null, minimum_fee: 25_000, label: '> 5 000 000 € — taux convenu au mandat' },
]

export type CommissionResult =
  | { type: 'calculated'; commission: number; rate: number; netSeller: number; tier: CommissionTier }
  | { type: 'manual';     reason: 'below_minimum' | 'above_maximum'; tier: CommissionTier | null }

export function calcCommission(
  transactionPrice: number,
  tiers: CommissionTier[] = DEFAULT_TIERS,
): CommissionResult {
  if (transactionPrice < 100_000) {
    return { type: 'manual', reason: 'below_minimum', tier: null }
  }

  const tier = tiers.find(t =>
    transactionPrice >= t.min_amount &&
    (t.max_amount === null || transactionPrice <= t.max_amount),
  ) ?? null

  if (!tier || tier.rate === null) {
    return { type: 'manual', reason: 'above_maximum', tier }
  }

  const raw        = transactionPrice * tier.rate
  const commission = Math.max(raw, tier.minimum_fee)
  const netSeller  = transactionPrice - commission

  return { type: 'calculated', commission, rate: tier.rate, netSeller, tier }
}

/** Commission earnout : 5% sur chaque versement reçu */
export const EARNOUT_RATE = 0.05

export function calcEarnoutCommission(earnoutPayment: number): number {
  return earnoutPayment * EARNOUT_RATE
}

/** Formatage EUR */
export function fmtEur(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(n)
}
