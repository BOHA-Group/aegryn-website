import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }      from '@/lib/supabase'
import { sendEmail }                 from '@/lib/sendEmail'

/**
 * Cron quotidien — envoie une notification J-7 aux partenaires experts
 * dont l'abonnement (ou le crédit admin) expire dans exactement 7 jours.
 * Protégé par CRON_SECRET.
 * Configuré dans vercel.json → crons (quotidien 08:00 UTC).
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const supa    = createServiceClient()
  const now     = new Date()

  // Fenêtre J-7 : entre dans 6j 23h et dans 7j 1h (tolérance 2h pour les dérives cron)
  const low  = new Date(now); low.setDate(low.getDate() + 6);  low.setHours(low.getHours() + 23)
  const high = new Date(now); high.setDate(high.getDate() + 7); high.setHours(high.getHours() + 1)

  const { data: profiles, error } = await supa
    .from('profiles')
    .select('id, full_name, email, expert_plan, expert_plan_end')
    .gte('expert_plan_end', low.toISOString())
    .lte('expert_plan_end', high.toISOString())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!profiles || profiles.length === 0) return NextResponse.json({ ok: true, notified: 0 })

  type ProfileRow = { id: string; full_name: string | null; email: string | null; expert_plan: string | null; expert_plan_end: string | null }

  const results: { id: string; email: string | null; ok: boolean }[] = []

  for (const p of profiles as ProfileRow[]) {
    if (!p.email) continue

    const expiryDate = new Date(p.expert_plan_end!).toLocaleDateString('fr-CH', {
      day: '2-digit', month: 'long', year: 'numeric',
    })
    const name = p.full_name?.split(' ')[0] || 'Partenaire'

    // 1. Notification in-app
    await supa.from('user_notifications').insert({
      user_id:     p.id,
      type:        'broadcast_alert',
      title:       'Votre abonnement expert expire dans 7 jours',
      body:        `Votre abonnement expert Aegryn expire le ${expiryDate}. Renouvelez-le pour maintenir votre fiche visible dans l'annuaire.`,
      link:        '/client/partner/subscription',
      target_role: 'partner',
    })

    // 2. Email
    const subject = `[Aegryn] Votre abonnement expert expire le ${expiryDate}`
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff">
        <p style="font-size:13px;color:#6b7280;margin-bottom:24px">Aegryn Advisory — Réseau d'experts</p>
        <h2 style="font-size:18px;font-weight:700;color:#111827;margin-bottom:16px">
          Bonjour ${name}, votre abonnement expert expire dans 7 jours
        </h2>
        <p style="font-size:14px;color:#374151;line-height:1.6;margin-bottom:16px">
          Votre abonnement de référencement expert Aegryn arrive à échéance le <strong>${expiryDate}</strong>.
        </p>
        <p style="font-size:14px;color:#374151;line-height:1.6;margin-bottom:24px">
          Sans renouvellement, votre fiche sera automatiquement retirée de l'annuaire à cette date.
          Vos clients peuvent toujours vous contacter directement — Aegryn ne prélève aucune commission.
        </p>
        <a href="https://aegryn.com/client/partner/subscription"
           style="display:inline-block;background:#0b1120;color:#fff;font-size:12px;font-weight:600;
                  letter-spacing:0.08em;text-transform:uppercase;padding:12px 24px;text-decoration:none;margin-bottom:24px">
          Renouveler mon abonnement →
        </a>
        <p style="font-size:12px;color:#9ca3af;line-height:1.5">
          Vous recevez cet email car vous êtes inscrit au réseau d'experts Aegryn.<br>
          Questions : <a href="mailto:contact@boha-group.com" style="color:#6b7280">contact@boha-group.com</a>
        </p>
      </div>
    `

    try {
      await sendEmail(p.email, subject, html)
      results.push({ id: p.id, email: p.email, ok: true })
    } catch {
      results.push({ id: p.id, email: p.email, ok: false })
    }
  }

  return NextResponse.json({ ok: true, notified: results.length, results })
}
