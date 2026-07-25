import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getNextArticleForSubscriber } from '@/lib/newsletter'
import { sendEmail, emailNewsletterArticle } from '@/lib/sendEmail'

/**
 * Cron hebdomadaire — envoie à chaque abonné actif le prochain article
 * (par ordre chronologique) qu'il n'a pas encore reçu. Une fois le backlog
 * rattrapé, l'abonné n'est plus notifié jusqu'à la publication d'un nouvel
 * article dans data/articles.ts.
 *
 * Configuré via vercel.json → crons (hebdomadaire, lundi 09:00 UTC).
 * Protégé par CRON_SECRET (Vercel ajoute automatiquement le header
 * `Authorization: Bearer $CRON_SECRET` pour les crons planifiés).
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const supabase = createServiceClient()
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, locale, last_sent_slug, unsubscribe_token')
    .eq('status', 'active')

  if (error) {
    console.error('[cron/newsletter] Supabase error', error)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  let sent = 0
  let skipped = 0

  for (const sub of subscribers ?? []) {
    const next = getNextArticleForSubscriber(sub.last_sent_slug)
    if (!next) { skipped++; continue }

    try {
      const { subject, html } = emailNewsletterArticle({
        article: next,
        locale: sub.locale,
        unsubscribeToken: sub.unsubscribe_token,
      })
      await sendEmail(sub.email, subject, html, 'newsletter')

      await supabase
        .from('newsletter_subscribers')
        .update({ last_sent_slug: next.slug, last_sent_at: new Date().toISOString() })
        .eq('id', sub.id)

      sent++
    } catch (err) {
      console.error(`[cron/newsletter] Échec envoi à ${sub.email}`, err)
    }
  }

  return NextResponse.json({
    ok: true,
    totalActiveSubscribers: subscribers?.length ?? 0,
    sent,
    upToDate: skipped,
  })
}
