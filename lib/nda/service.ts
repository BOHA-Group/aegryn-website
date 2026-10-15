/**
 * Service NDA mutuel (serveur uniquement).
 *
 * Cycle : l'admin crée un accord et ses signataires → chaque signataire reçoit
 * un lien personnel (jeton aléatoire, seul le hash SHA-256 est stocké) → il lit
 * le texte, saisit son nom et accepte → Aegryn contresigne automatiquement →
 * un PDF avec dossier de preuve est généré, archivé (bucket privé) et envoyé
 * au signataire et à Aegryn. Tout est tracé dans nda_events (ajout seul).
 */
import { createHash, randomBytes } from 'crypto'
import { createServiceClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/sendEmail'
import { AEGRYN_PARTY, NDA_BUCKET, NDA_LINK_VALIDITY_DAYS, NDA_TEMPLATE_VERSION, getAegrynSignatory, getNdaNotifyEmail } from './config'
import { ndaContentHash, renderNda, type NdaBlock, type NdaLang, type NdaRole, type NdaVars } from './template'
import { buildSignedNdaPdf } from './pdf'
import { ndaInternalEmail, ndaInvitationEmail, ndaLink, ndaSignedEmail } from './emails'

export class NdaError extends Error {
  constructor(public code: 'not_configured' | 'invalid' | 'expired' | 'revoked' | 'bad_name' | 'template_changed' | 'storage' | 'db', message?: string) {
    super(message ?? code)
  }
}

export interface AgreementRow {
  id: string; reference: string; created_at: string
  project_label: string; lang: NdaLang; term_years: number; penalty_chf: number | null
  template_version: string; status: 'open' | 'completed' | 'revoked'
  source_contact_email: string | null; note: string | null
}

export interface SignatoryRow {
  id: string; agreement_id: string; created_at: string
  full_name: string; company: string | null; email: string; roles: NdaRole[]
  token_hash: string; token_expires_at: string
  status: 'pending' | 'signed' | 'revoked' | 'expired'
  sent_at: string | null; last_reminder_at: string | null
  signed_name: string | null; signed_at: string | null; ip_address: string | null; user_agent: string | null
  content_sha256: string | null; template_version: string | null
  countersigned_by_name: string | null; countersigned_by_title: string | null; countersigned_at: string | null
  pdf_path: string | null; pdf_sha256: string | null
}

export interface SignatoryInput { fullName: string; company?: string | null; email: string; roles: NdaRole[] }

export interface CreateAgreementInput {
  projectLabel: string; lang: NdaLang; termYears: number; penaltyChf?: number | null
  createdBy?: string | null; sourceContactEmail?: string | null; note?: string | null
  signatories: SignatoryInput[]
}

const db = () => createServiceClient()

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')
const sha256Hex = (data: string | Uint8Array) => createHash('sha256').update(data).digest('hex')

export function newToken() {
  const token = randomBytes(32).toString('base64url')
  return { token, hash: hashToken(token) }
}

const addDays = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString()

async function logEvent(agreementId: string, signatoryId: string | null, event: string, actor: string, ip: string | null = null, meta: Record<string, unknown> = {}) {
  const { error } = await db().from('nda_events').insert({ agreement_id: agreementId, signatory_id: signatoryId, event, actor, ip_address: ip, meta })
  if (error) console.error('[nda] log', event, error.message)
}

async function getAgreement(id: string): Promise<AgreementRow> {
  const { data, error } = await db().from('nda_agreements').select('*').eq('id', id).maybeSingle()
  if (error || !data) throw new NdaError('invalid', error?.message)
  return data as AgreementRow
}

async function getSignatory(id: string): Promise<SignatoryRow> {
  const { data, error } = await db().from('nda_signatories').select('*').eq('id', id).maybeSingle()
  if (error || !data) throw new NdaError('invalid', error?.message)
  return data as SignatoryRow
}

function varsFor(a: AgreementRow, s: SignatoryRow, aegryn: { name: string; title: string }): NdaVars {
  return {
    projectLabel: a.project_label, termYears: a.term_years, penaltyChf: a.penalty_chf,
    signatoryName: s.full_name, signatoryCompany: s.company, roles: s.roles,
    aegrynSignatory: aegryn, reference: a.reference,
  }
}

/* ── Création et distribution ─────────────────────────────────────────────── */

export async function addSignatory(agreementId: string, input: SignatoryInput, actor: string) {
  const { token, hash } = newToken()
  const { data, error } = await db().from('nda_signatories').insert({
    agreement_id: agreementId, full_name: input.fullName.trim(), company: input.company?.trim() || null,
    email: input.email.trim().toLowerCase(), roles: input.roles, token_hash: hash, token_expires_at: addDays(NDA_LINK_VALIDITY_DAYS),
  }).select('*').single()
  if (error || !data) throw new NdaError('db', error?.message)
  await logEvent(agreementId, data.id, 'signatory_added', actor, null, { email: data.email, roles: input.roles })
  return { signatory: data as SignatoryRow, token }
}

export async function createAgreement(input: CreateAgreementInput, actor: string) {
  if (!getAegrynSignatory()) throw new NdaError('not_configured')
  const { data, error } = await db().from('nda_agreements').insert({
    project_label: input.projectLabel.trim(), lang: input.lang, term_years: input.termYears,
    penalty_chf: input.penaltyChf ?? null, template_version: NDA_TEMPLATE_VERSION,
    created_by: input.createdBy ?? null, source_contact_email: input.sourceContactEmail ?? null, note: input.note ?? null,
  }).select('*').single()
  if (error || !data) throw new NdaError('db', error?.message)
  const agreement = data as AgreementRow
  await logEvent(agreement.id, null, 'agreement_created', actor, null, { project: agreement.project_label, lang: agreement.lang })
  const created = []
  for (const s of input.signatories) created.push(await addSignatory(agreement.id, s, actor))
  return { agreement, created }
}

export async function sendInvitation(agreement: AgreementRow, signatory: SignatoryRow, token: string, actor: string, reminder = false) {
  const mail = ndaInvitationEmail({
    lang: agreement.lang, name: signatory.full_name, reference: agreement.reference, projectLabel: agreement.project_label,
    token, expiresAtIso: signatory.token_expires_at, reminder,
  })
  await sendEmail(signatory.email, mail.subject, mail.html, 'nda-invitation')
  const patch = reminder ? { last_reminder_at: new Date().toISOString() } : { sent_at: new Date().toISOString() }
  await db().from('nda_signatories').update(patch).eq('id', signatory.id)
  await logEvent(agreement.id, signatory.id, reminder ? 'reminder_sent' : 'invitation_sent', actor)
}

/** Envoi manuel du NDA : génère un lien neuf (l'éventuel précédent cesse de fonctionner) et l'envoie. Premier envoi = invitation, suivants = rappel. */
export async function resendSignatory(signatoryId: string, actor: string) {
  const s = await getSignatory(signatoryId)
  if (s.status === 'signed') throw new NdaError('invalid', 'already signed')
  if (s.status === 'revoked') throw new NdaError('revoked')
  const a = await getAgreement(s.agreement_id)
  const { token, hash } = newToken()
  const expires = addDays(NDA_LINK_VALIDITY_DAYS)
  const { data, error } = await db().from('nda_signatories')
    .update({ token_hash: hash, token_expires_at: expires, status: 'pending' }).eq('id', s.id).select('*').single()
  if (error || !data) throw new NdaError('db', error?.message)
  await logEvent(a.id, s.id, 'link_rotated', actor)
  await sendInvitation(a, data as SignatoryRow, token, actor, !!s.sent_at)
}

export async function revokeSignatory(signatoryId: string, actor: string) {
  const s = await getSignatory(signatoryId)
  if (s.status === 'signed') throw new NdaError('invalid', 'already signed')
  await db().from('nda_signatories').update({ status: 'revoked' }).eq('id', s.id)
  await logEvent(s.agreement_id, s.id, 'revoked', actor)
  await refreshAgreementStatus(s.agreement_id)
}

async function refreshAgreementStatus(agreementId: string) {
  const { data } = await db().from('nda_signatories').select('status').eq('agreement_id', agreementId)
  const rows = (data ?? []) as { status: string }[]
  const live = rows.filter(r => r.status !== 'revoked')
  const status = live.length === 0 ? 'revoked' : live.every(r => r.status === 'signed') ? 'completed' : 'open'
  await db().from('nda_agreements').update({ status }).eq('id', agreementId)
}

/* ── Lien public : contexte de signature ──────────────────────────────────── */

export type SigningContext =
  | { state: 'invalid' }
  | { state: 'unavailable' }
  | { state: 'revoked'; lang: NdaLang; reference: string }
  | { state: 'expired'; lang: NdaLang; reference: string }
  | { state: 'signed'; lang: NdaLang; reference: string; projectLabel: string; fullName: string; signedAtIso: string }
  | { state: 'ready'; lang: NdaLang; reference: string; projectLabel: string; fullName: string; company: string | null; roles: NdaRole[]; blocks: NdaBlock[]; expiresAtIso: string; aegryn: { name: string; title: string } }

async function findByToken(token: string): Promise<{ s: SignatoryRow; a: AgreementRow } | null> {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null
  const { data } = await db().from('nda_signatories').select('*').eq('token_hash', hashToken(token)).maybeSingle()
  if (!data) return null
  const s = data as SignatoryRow
  return { s, a: await getAgreement(s.agreement_id) }
}

export async function getSigningContext(token: string): Promise<SigningContext> {
  const found = await findByToken(token)
  if (!found) return { state: 'invalid' }
  const { s, a } = found
  if (s.status === 'signed' && s.signed_at) return { state: 'signed', lang: a.lang, reference: a.reference, projectLabel: a.project_label, fullName: s.signed_name ?? s.full_name, signedAtIso: s.signed_at }
  if (s.status === 'revoked' || a.status === 'revoked') return { state: 'revoked', lang: a.lang, reference: a.reference }
  if (new Date(s.token_expires_at).getTime() < Date.now()) {
    if (s.status === 'pending') {
      await db().from('nda_signatories').update({ status: 'expired' }).eq('id', s.id)
      await logEvent(a.id, s.id, 'expired', 'system')
    }
    return { state: 'expired', lang: a.lang, reference: a.reference }
  }
  const aegryn = getAegrynSignatory()
  if (!aegryn) return { state: 'unavailable' }
  return {
    state: 'ready', lang: a.lang, reference: a.reference, projectLabel: a.project_label, fullName: s.full_name, company: s.company,
    roles: s.roles, blocks: renderNda(a.lang, varsFor(a, s, aegryn)), expiresAtIso: s.token_expires_at, aegryn,
  }
}

/* ── Signature ────────────────────────────────────────────────────────────── */

async function buildPdf(a: AgreementRow, s: SignatoryRow) {
  const aegryn = { name: s.countersigned_by_name ?? '', title: s.countersigned_by_title ?? '' }
  const blocks = renderNda(a.lang, varsFor(a, s, aegryn))
  const contentSha = ndaContentHash(a.lang, blocks)
  if (s.content_sha256 && s.content_sha256 !== contentSha) throw new NdaError('template_changed')
  const bytes = await buildSignedNdaPdf({
    lang: a.lang, blocks, reference: a.reference, templateVersion: s.template_version ?? a.template_version, contentSha256: contentSha,
    signatory: {
      name: s.signed_name ?? s.full_name, company: s.company, email: s.email, roles: s.roles,
      signedAtIso: s.signed_at as string, ip: s.ip_address, userAgent: s.user_agent,
      nameSha256: sha256Hex(s.signed_name ?? s.full_name),
    },
    aegryn: { ...aegryn, countersignedAtIso: s.countersigned_at as string },
  })
  return { bytes, sha: sha256Hex(bytes) }
}

async function storePdf(a: AgreementRow, s: SignatoryRow, actor: string) {
  const { bytes, sha } = await buildPdf(a, s)
  const path = `${a.reference}/${s.id}.pdf`
  const { error: upErr } = await db().storage.from(NDA_BUCKET).upload(path, bytes, { contentType: 'application/pdf', upsert: false })
  if (upErr) throw new NdaError('storage', upErr.message)
  const { data, error } = await db().from('nda_signatories').update({ pdf_path: path, pdf_sha256: sha }).eq('id', s.id).select('*').single()
  if (error || !data) throw new NdaError('db', error?.message)
  await logEvent(a.id, s.id, 'pdf_stored', actor, null, { path, sha256: sha })
  return { signatory: data as SignatoryRow, bytes, sha }
}

export async function signNda(token: string, input: { signedName: string; ip: string | null; userAgent: string | null }) {
  const found = await findByToken(token)
  if (!found) throw new NdaError('invalid')
  const { s, a } = found
  if (s.status === 'signed') return { already: true as const, reference: a.reference, lang: a.lang }
  if (s.status === 'revoked' || a.status === 'revoked') throw new NdaError('revoked')
  if (new Date(s.token_expires_at).getTime() < Date.now()) throw new NdaError('expired')

  const signedName = input.signedName.replace(/\s+/g, ' ').trim()
  if (signedName.length < 2 || signedName.length > 120) throw new NdaError('bad_name')
  const aegryn = getAegrynSignatory()
  if (!aegryn) throw new NdaError('not_configured')

  const now = new Date().toISOString()
  const blocks = renderNda(a.lang, varsFor(a, s, aegryn))
  const contentSha = ndaContentHash(a.lang, blocks)
  const ua = input.userAgent?.slice(0, 400) ?? null

  /* Le filtre sur status = 'pending' rend la signature idempotente en cas de double envoi */
  const { data: updated, error } = await db().from('nda_signatories').update({
    status: 'signed', signed_name: signedName, signed_at: now, ip_address: input.ip, user_agent: ua,
    content_sha256: contentSha, template_version: NDA_TEMPLATE_VERSION,
    countersigned_by_name: aegryn.name, countersigned_by_title: aegryn.title, countersigned_at: now,
  }).eq('id', s.id).eq('status', 'pending').select('*').maybeSingle()
  if (error) throw new NdaError('db', error.message)
  if (!updated) return { already: true as const, reference: a.reference, lang: a.lang }

  const signed = updated as SignatoryRow
  await logEvent(a.id, s.id, 'signed', 'signatory', input.ip, { signedName, contentSha256: contentSha, templateVersion: NDA_TEMPLATE_VERSION })
  await logEvent(a.id, s.id, 'countersigned', 'system', null, { by: aegryn.name, title: aegryn.title })
  await refreshAgreementStatus(a.id)

  /* PDF, archivage et e-mails : un échec ici n'annule pas la signature (déjà enregistrée) */
  let pdf: { signatory: SignatoryRow; bytes: Uint8Array; sha: string } | null = null
  try {
    pdf = await storePdf(a, signed, 'system')
  } catch (e) {
    console.error('[nda] pdf', e)
    await logEvent(a.id, s.id, 'pdf_failed', 'system', null, { error: e instanceof Error ? e.message : String(e) })
  }

  if (pdf) {
    const attachment = [{ filename: `${a.reference}.pdf`, content: pdf.bytes }]
    const base = { lang: a.lang, name: signedName, reference: a.reference, projectLabel: a.project_label }
    try {
      const mail = ndaSignedEmail({ ...base, token, signedAtIso: now, pdfSha256: pdf.sha })
      await sendEmail(signed.email, mail.subject, mail.html, 'nda-signed', attachment)
      await logEvent(a.id, s.id, 'signed_copy_sent', 'system', null, { to: signed.email })
      const internal = ndaInternalEmail({
        ...base, email: signed.email, company: signed.company, roles: signed.roles, signedAtIso: now, ip: input.ip,
        pdfSha256: pdf.sha, adminUrl: `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')}/admin/nda/${a.id}`,
      })
      await sendEmail(getNdaNotifyEmail(), internal.subject, internal.html, 'nda-internal', attachment)
    } catch (e) {
      console.error('[nda] email', e)
    }
  }
  return { already: false as const, reference: a.reference, lang: a.lang, signedAtIso: now }
}

/** Régénère le PDF d'un signataire dont l'archivage a échoué (jamais si un PDF existe déjà). */
export async function regeneratePdf(signatoryId: string, actor: string) {
  const s = await getSignatory(signatoryId)
  if (s.status !== 'signed') throw new NdaError('invalid', 'not signed')
  if (s.pdf_path) return s
  return (await storePdf(await getAgreement(s.agreement_id), s, actor)).signatory
}

/* ── Téléchargement ───────────────────────────────────────────────────────── */

export async function createDownloadUrl(pdfPath: string, filename: string, seconds = 60): Promise<string | null> {
  const { data } = await db().storage.from(NDA_BUCKET).createSignedUrl(pdfPath, seconds, { download: filename })
  return data?.signedUrl ?? null
}

/** Lien de téléchargement pour le signataire (jeton), avec auto-réparation si le PDF manque. */
export async function downloadUrlForToken(token: string): Promise<string | null> {
  const found = await findByToken(token)
  if (!found || found.s.status !== 'signed') return null
  const s = found.s.pdf_path ? found.s : await regeneratePdf(found.s.id, 'system').catch(() => null)
  if (!s?.pdf_path) return null
  await logEvent(found.a.id, found.s.id, 'pdf_downloaded', 'signatory')
  return createDownloadUrl(s.pdf_path, `${found.a.reference}.pdf`)
}

export { AEGRYN_PARTY, ndaLink }
