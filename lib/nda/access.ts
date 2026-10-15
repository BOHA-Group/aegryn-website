/**
 * Accès fondé sur le NDA mutuel (remplace l'acceptation de NDA par compte).
 * Un accès est accordé quand l'e-mail du compte a signé un NDA dont les profils
 * incluent le profil requis (ex. certification, partner). L'e-mail est celui du
 * lien personnel signé, donc il ne dépend d'aucun compte.
 */
import { createServiceClient } from '@/lib/supabase'
import type { NdaRole } from './template'

export type NdaAccess =
  | { state: 'signed'; reference: string; signedAt: string }
  | { state: 'pending'; reference: string; sentAt: string | null }
  | { state: 'none' }

interface Row { id: string; status: string; roles: NdaRole[]; signed_at: string | null; sent_at: string | null; nda_agreements: { reference: string } | { reference: string }[] | null }

const refOf = (r: Row) => (Array.isArray(r.nda_agreements) ? r.nda_agreements[0]?.reference : r.nda_agreements?.reference) ?? ''

async function rowsFor(email: string): Promise<Row[]> {
  const { data } = await createServiceClient()
    .from('nda_signatories')
    .select('id, status, roles, signed_at, sent_at, nda_agreements(reference)')
    .eq('email', email.trim().toLowerCase())
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as Row[]
}

/** Statut du NDA pour un e-mail et au moins un des profils requis. */
export async function getNdaAccess(email: string | null | undefined, anyOf: NdaRole[]): Promise<NdaAccess> {
  if (!email) return { state: 'none' }
  const rows = (await rowsFor(email)).filter(r => r.roles.some(x => anyOf.includes(x)))
  const signed = rows.find(r => r.status === 'signed' && r.signed_at)
  if (signed) return { state: 'signed', reference: refOf(signed), signedAt: signed.signed_at as string }
  const pending = rows.find(r => r.status === 'pending' && r.sent_at)
  if (pending) return { state: 'pending', reference: refOf(pending), sentAt: pending.sent_at }
  return { state: 'none' }
}

/** NDA signés d'un e-mail (espace compte : copies PDF). */
export async function listSignedNdas(email: string | null | undefined) {
  if (!email) return []
  return (await rowsFor(email)).filter(r => r.status === 'signed' && r.signed_at).map(r => ({ id: r.id, reference: refOf(r), signedAt: r.signed_at as string, roles: r.roles }))
}
