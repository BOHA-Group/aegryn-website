/**
 * Accès anticipé magazine — 48h avant publication publique.
 *
 * Flux :
 * 1. Admin active le flag `magazine_issue_XX_early_access` (site_settings).
 * 2. On génère un token d'accès unique pour ce numéro (site_settings,
 *    clé `magazine_issue_XX_access_token`) et on envoie un email à tous
 *    les inscrits (newsletter + wishlist édition papier) avec un lien
 *    /api/magazine/access?issue=XX&token=... qui débloque la lecture
 *    sans compte (cookie de déverrouillage, cf. app/api/magazine/access).
 * 3. Un cron (app/api/cron/magazine-publish) bascule automatiquement
 *    `magazine_issue_XX_public` à true 48h après l'activation de l'accès
 *    anticipé (basé sur updated_at de la ligne early_access).
 */
import { randomUUID } from 'crypto'
import { createServiceClient } from '@/lib/supabase'
import { sendEmail, emailMagazineEarlyAccess } from '@/lib/sendEmail'

export async function activateEarlyAccessAndNotify(opts: {
  issuePad:    string
  issueLabel:  string
  issueTheme:  string
}): Promise<{ token: string; sent: number }> {
  const supa  = createServiceClient()
  const token = randomUUID()

  await supa.from('site_settings').upsert({
    key:        `magazine_issue_${opts.issuePad}_access_token`,
    value:      token,
    updated_at: new Date().toISOString(),
  })

  const accessUrl = `https://aegryn.com/api/magazine/access?issue=${opts.issuePad}&token=${token}`

  const [{ data: newsletterRows }, { data: wishlistRows }] = await Promise.all([
    supa.from('newsletter_subscribers').select('email, unsubscribe_token').eq('status', 'active'),
    supa.from('print_wishlist').select('email'),
  ])

  /* Dédup par email — priorité au token de désabonnement newsletter quand présent */
  const recipients = new Map<string, string | undefined>()
  for (const r of newsletterRows ?? []) {
    if (r.email) recipients.set(r.email.toLowerCase(), r.unsubscribe_token ?? undefined)
  }
  for (const r of wishlistRows ?? []) {
    const email = r.email?.toLowerCase()
    if (email && !recipients.has(email)) recipients.set(email, undefined)
  }

  let sent = 0
  for (const [email, unsubscribeToken] of recipients) {
    try {
      const { subject, html } = emailMagazineEarlyAccess({
        issueLabel: opts.issueLabel,
        issueTheme: opts.issueTheme,
        accessUrl,
        unsubscribeToken,
      })
      await sendEmail(email, subject, html, 'magazine-early-access')
      sent++
    } catch (err) {
      console.error(`[magazineAccess] Échec envoi à ${email}`, err)
    }
  }

  return { token, sent }
}
