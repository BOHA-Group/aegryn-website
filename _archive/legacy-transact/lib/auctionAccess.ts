/**
 * lib/transactAccess.ts
 *
 * Vérifie si un utilisateur a les droits d'accès au catalogue TRANSACT.
 * Prérequis : compte créé + NDA Aegryn TRANSACT signé + CGV acceptées.
 * Ces deux champs sont renseignés manuellement par l'admin sur profiles.
 * Note : les colonnes DB (auction_nda_signed_at, auction_cgv_accepted_at) sont conservées telles quelles.
 */
import { createServiceClient } from '@/lib/supabase'

export type TransactionAccessStatus =
  | 'ok'              // NDA + CGV validés → accès catalogue TRANSACT complet
  | 'not_authenticated' // non connecté
  | 'pending_nda'     // connecté, NDA non encore signé
  | 'pending_cgv'     // NDA signé mais CGV non acceptées

export async function checkTransactionCatalogAccess(
  userId: string
): Promise<TransactionAccessStatus> {
  const supa = createServiceClient()
  const { data } = await supa
    .from('profiles')
    .select('auction_nda_signed_at, auction_cgv_accepted_at')
    .eq('id', userId)
    .single()

  if (!data) return 'pending_nda'
  if (!data.auction_nda_signed_at)   return 'pending_nda'
  if (!data.auction_cgv_accepted_at) return 'pending_cgv'
  return 'ok'
}
