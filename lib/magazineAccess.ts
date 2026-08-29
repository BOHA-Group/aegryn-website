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
import { cookies }    from 'next/headers'
import { createServiceClient } from '@/lib/supabase'
import { getAdminUser }        from '@/lib/adminAuth'
import { sendEmail, emailMagazineEarlyAccess } from '@/lib/sendEmail'

/**
 * Vérifie si l'issue est consultable pour la requête courante :
 * - toujours vrai hors production (preview/dev) — permet aux équipes internes
 *   de relire un numéro avant son ouverture publique.
 * - toujours vrai pour un admin connecté (session Supabase, rôle admin) — même
 *   en production, avant toute activation de early_access/public.
 * - vrai en production si `public` est actif.
 * - vrai en production si `early_access` est actif ET que le visiteur détient
 *   le cookie de déverrouillage (obtenu via le lien email, cf. /api/magazine/access).
 */
export async function canAccessIssue(issuePad: string): Promise<boolean> {
  const isPreviewEnv = process.env.VERCEL_ENV !== 'production'
  if (isPreviewEnv) return true

  const supa = createServiceClient()
  const [adminUser, { data }] = await Promise.all([
    getAdminUser(),
    supa
      .from('site_settings')
      .select('key, value')
      .in('key', [`magazine_issue_${issuePad}_public`, `magazine_issue_${issuePad}_early_access`]),
  ])

  if (adminUser) return true

  const isPublic = data?.some(r => r.key === `magazine_issue_${issuePad}_public` && (r.value === true || r.value === 'true')) ?? false
  if (isPublic) return true

  const isEarly = data?.some(r => r.key === `magazine_issue_${issuePad}_early_access` && (r.value === true || r.value === 'true')) ?? false
  if (!isEarly) return false

  const cookieStore = await cookies()
  return cookieStore.get(`ag-mag-unlock-${issuePad}`)?.value === '1'
}

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
