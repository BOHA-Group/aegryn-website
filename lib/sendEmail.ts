/**
 * Helper Resend centralisé — même pattern que les routes existantes.
 * Variables d'env : RESEND_API_KEY, RESEND_FROM, RESEND_FROM_NAME, RESEND_REPLY_TO
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  tag?: string,
): Promise<void> {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'contact@boha-group.com'
  const name = process.env.RESEND_FROM_NAME ?? 'AEGRYN'
  if (!key) {
    console.warn(`[sendEmail] RESEND_API_KEY manquant — skip email to ${to}`)
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:     `${name} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to:       [to],
      subject,
      html,
    }),
  })
  if (!res.ok) console.error(`[sendEmail${tag ? ` ${tag}` : ''}] Resend error (${to})`, await res.text())
}

/* ── Templates partenaires ─────────────────────────────────────────────── */

const FOOTER = `
<hr style="border:none;border-top:1px solid #1e293b;margin:24px 0 12px 0;" />
<p style="font-size:10px;color:#475569;font-family:monospace;margin:0;">
  AEGRYN Sàrl — Suisse · <a href="https://aegryn.com" style="color:#475569;">aegryn.com</a>
  · <a href="https://aegryn.com/client/partner/certifications" style="color:#475569;">Mon espace partenaire</a>
</p>`

const WRAP = (body: string) =>
  `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#050a1a;color:#ffffff;">
<p style="font-family:monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#5ADDA4;margin:0 0 20px 0;">AEGRYN · Réseau Partenaires</p>
${body}
${FOOTER}
</div>`

export function emailPartnerScoreValidated(opts: {
  partnerName: string
  assetName: string
  dimension: string
  score: number
  amountChf?: number | null
  observations?: string | null
}): { subject: string; html: string } {
  const dim = opts.dimension.toUpperCase()
  const subject = `[AEGRYN] Votre contribution ${dim} a été validée — ${opts.assetName}`
  const html = WRAP(`
<p style="font-size:22px;font-weight:700;margin:0 0 8px 0;">Contribution validée ✓</p>
<p style="font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 20px 0;">
  Bonjour ${opts.partnerName},<br/>
  Votre contribution à la co-certification de l'actif <strong style="color:#fff;">${opts.assetName}</strong>
  (dimension <strong style="color:#5ADDA4;">${dim}</strong>) a été validée par l'équipe AEGRYN.
</p>
<table style="font-size:12px;color:#94a3b8;border-collapse:collapse;width:100%;margin-bottom:20px;">
  <tr><td style="padding:4px 8px 4px 0;font-weight:600;color:#cbd5e1;">Score retenu</td><td style="color:#5ADDA4;font-family:monospace;font-size:16px;font-weight:700;">${opts.score}/25</td></tr>
  ${opts.amountChf ? `<tr><td style="padding:4px 8px 4px 0;font-weight:600;color:#cbd5e1;">Honoraires dus</td><td style="color:#5ADDA4;font-family:monospace;font-size:16px;font-weight:700;">${Number(opts.amountChf).toLocaleString('fr-CH')} CHF</td></tr>` : ''}
</table>
${opts.observations ? `<p style="font-size:12px;color:#94a3b8;line-height:1.6;border-left:2px solid #5ADDA4;padding-left:12px;margin-bottom:20px;"><em>${opts.observations}</em></p>` : ''}
<p style="margin:0 0 24px 0;">
  <a href="https://aegryn.com/client/partner/certifications" style="display:inline-block;padding:10px 24px;background:#5ADDA4;color:#050a1a;text-decoration:none;font-weight:700;font-size:13px;font-family:monospace;letter-spacing:0.08em;">VOIR MON ESPACE →</a>
</p>`)
  return { subject, html }
}

export function emailPartnerScoreRejected(opts: {
  partnerName: string
  assetName: string
  dimension: string
  rejectionReason?: string | null
  observations?: string | null
}): { subject: string; html: string } {
  const dim = opts.dimension.toUpperCase()
  const subject = `[AEGRYN] Retour sur votre contribution ${dim} — ${opts.assetName}`
  const html = WRAP(`
<p style="font-size:22px;font-weight:700;margin:0 0 8px 0;">Retour sur votre contribution</p>
<p style="font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 20px 0;">
  Bonjour ${opts.partnerName},<br/>
  Votre contribution à la co-certification de l'actif <strong style="color:#fff;">${opts.assetName}</strong>
  (dimension <strong style="color:#fc8181;">${dim}</strong>) n'a pas pu être retenue en l'état.
</p>
${opts.rejectionReason ? `<p style="font-size:13px;color:#fc8181;border-left:2px solid #fc8181;padding-left:12px;margin-bottom:16px;"><strong>Motif :</strong> ${opts.rejectionReason}</p>` : ''}
${opts.observations ? `<p style="font-size:12px;color:#94a3b8;line-height:1.6;border-left:2px solid #475569;padding-left:12px;margin-bottom:20px;"><em>${opts.observations}</em></p>` : ''}
<p style="font-size:13px;color:#94a3b8;margin:0 0 24px 0;">Contactez votre référent AEGRYN pour discuter des points à corriger.</p>
<p style="margin:0 0 24px 0;">
  <a href="https://aegryn.com/client/partner/certifications" style="display:inline-block;padding:10px 24px;background:#334155;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;font-family:monospace;letter-spacing:0.08em;">MON ESPACE PARTENAIRE →</a>
</p>`)
  return { subject, html }
}

export function emailPartnerMandateCreated(opts: {
  partnerName: string
  partnerEmail: string
  clientName: string
  mandateType: string
  retrocessionPct: number
  assetName?: string | null
}): { subject: string; html: string } {
  const typeLabel: Record<string, string> = {
    advisory:      'Conseil stratégique',
    due_diligence: 'Due diligence',
    fundraising:   'Levée de fonds',
    other:         'Autre',
  }
  const subject = `[AEGRYN] Nouveau mandat client créé — ${opts.clientName}`
  const html = WRAP(`
<p style="font-size:22px;font-weight:700;margin:0 0 8px 0;">Mandat client activé</p>
<p style="font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 20px 0;">
  Bonjour ${opts.partnerName},<br/>
  Un nouveau mandat client a été créé dans votre espace partenaire AEGRYN.
</p>
<table style="font-size:12px;color:#94a3b8;border-collapse:collapse;width:100%;margin-bottom:24px;">
  <tr><td style="padding:5px 8px 5px 0;font-weight:600;color:#cbd5e1;">Client</td><td>${opts.clientName}</td></tr>
  <tr><td style="padding:5px 8px 5px 0;font-weight:600;color:#cbd5e1;">Nature de la mission</td><td>${typeLabel[opts.mandateType] ?? opts.mandateType}</td></tr>
  <tr><td style="padding:5px 8px 5px 0;font-weight:600;color:#cbd5e1;">Rétrocession AEGRYN</td><td style="color:#5ADDA4;font-family:monospace;">${opts.retrocessionPct}% de vos honoraires</td></tr>
  ${opts.assetName ? `<tr><td style="padding:5px 8px 5px 0;font-weight:600;color:#cbd5e1;">Actif associé</td><td>${opts.assetName}</td></tr>` : ''}
</table>
<p style="font-size:13px;color:#94a3b8;margin:0 0 24px 0;">
  Vous pouvez déclarer vos factures et suivre ce mandat directement dans votre espace partenaire.
</p>
<p style="margin:0 0 24px 0;">
  <a href="https://aegryn.com/client/partner/mandates" style="display:inline-block;padding:10px 24px;background:#5ADDA4;color:#050a1a;text-decoration:none;font-weight:700;font-size:13px;font-family:monospace;letter-spacing:0.08em;">VOIR MES MANDATS →</a>
</p>`)
  return { subject, html }
}
