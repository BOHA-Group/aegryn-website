/**
 * lib/transactAccess.ts
 *
 * Vérifie si un utilisateur a les droits d'accès au catalogue TRANSACT tiers.
 * Prérequis : compte créé + NDA Aegryn TRANSACT signé + CGV acceptées.
 * Ces deux champs sont renseignés manuellement par l'admin sur profiles.
 */
import { createServiceClient } from '@/lib/supabase'

export type TransactAccessStatus =
  | 'ok'              // NDA + CGV + KYC validés → accès catalogue complet
  | 'not_authenticated' // non connecté
  | 'pending_nda'     // connecté, NDA non encore signé
  | 'pending_cgv'     // NDA signé mais CGV non acceptées
  | 'pending_kyc'     // NDA + CGV OK mais KYC non approuvé

export async function checkTransactCatalogAccess(
  userId: string
): Promise<TransactAccessStatus> {
  const supa = createServiceClient()
  const { data } = await supa
    .from('profiles')
    .select('auction_nda_signed_at, auction_cgv_accepted_at, kyc_status')
    .eq('id', userId)
    .single()

  if (!data) return 'pending_nda'
  if (!data.auction_nda_signed_at)   return 'pending_nda'
  if (!data.auction_cgv_accepted_at) return 'pending_cgv'
  if ((data as { kyc_status?: string }).kyc_status !== 'approved') return 'pending_kyc'
  return 'ok'
}
