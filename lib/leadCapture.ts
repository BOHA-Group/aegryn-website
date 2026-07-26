import { createServiceClient } from '@/lib/supabase'

/* ─── Types ──────────────────────────────────────────────── */
export type EmailConfig = {
  /** Email du prospect/fondateur — reçoit le rapport */
  to: string
  subjectFounder: string
  textFounder: string
  /** Email interne équipe AEGRYN */
  subjectInternal: string
  textInternal: string
}

/* ─── Resend helper ──────────────────────────────────────── */
async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'contact@boha-group.com'
  if (!key) {
    console.warn(`[leadCapture] RESEND_API_KEY missing — skip email to ${to}`)
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${process.env.RESEND_FROM_NAME ?? 'AEGRYN'} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to: [to],
      subject,
      text,
    }),
  })
  if (!res.ok) console.error(`[leadCapture] Resend error (${to})`, await res.text())
}

/* ─── Core helper ────────────────────────────────────────── */
/**
 * Insère un lead dans Supabase via service_role puis envoie
 * deux emails Resend (rapport fondateur + notification interne).
 *
 * @param table   Nom de la table Supabase cible
 * @param data    Objet à insérer (colonnes matchent la table)
 * @param email   Config des deux emails à envoyer
 * @returns       { dbError } — null si insert OK
 */
export async function captureLead(
  table: string,
  data: Record<string, unknown>,
  email: EmailConfig,
): Promise<{ dbError: string | null }> {
  const supa = createServiceClient()

  const { error } = await supa.from(table).insert(data)
  if (error) {
    console.error(`[leadCapture] Supabase insert error (${table})`, error)
  }

  const internalEmail = process.env.AEGRYN_INTERNAL_EMAIL ?? 'team@boha-group.com'

  await Promise.allSettled([
    sendEmail(email.to, email.subjectFounder, email.textFounder),
    sendEmail(internalEmail, email.subjectInternal, email.textInternal),
  ])

  return { dbError: error?.message ?? null }
}

/* ─── Formatters partagés ────────────────────────────────── */
export function fmtEur(n?: number | null): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')} M€`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K€`
  return `${Math.round(n)} €`
}
