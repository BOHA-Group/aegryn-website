import { formatChfEur } from '@/lib/fxRate'
import type { Article, LocaleText } from '@/data/articles'

/**
 * Helper Resend centralisé.
 * Variables d'env : RESEND_API_KEY, RESEND_FROM, RESEND_FROM_NAME, RESEND_REPLY_TO
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  tag?: string,
): Promise<void> {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  const name = process.env.RESEND_FROM_NAME ?? 'Aegryn'
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

/* ── Logo AE officiel — coordonnées verbatim depuis AegrynLogo.tsx ────── */
// viewBox="0 0 441.14 487.91" — identique au composant brand officiel
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="36" viewBox="0 0 441.14 487.91" fill="none" aria-label="Aegryn">
  <polygon fill="#5adda4" points="297.96 171.32 266.09 100.56 220.57 0 191.6 64.14 254.09 127.04 297.96 171.32"/>
  <polygon fill="#0F1C3F" points="317.41 214.36 246.64 143.18 184.15 80.28 175.05 100.56 0 487.91 90.63 487.91 220.57 201.12 350.51 487.91 441.14 487.91 317.41 214.36"/>
</svg>`

/* ── Squelette commun light mode ───────────────────────────────────────── */
const FOOTER = `
<tr>
  <td style="padding:24px 32px 20px;border-top:1px solid #e2e8f0;">
    <p style="margin:0 0 4px 0;font-size:11px;color:#94a3b8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <strong style="color:#64748b;">Aegryn</strong> — Genève, Suisse
    </p>
    <p style="margin:0;font-size:11px;color:#94a3b8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <a href="https://aegryn.com" style="color:#5ADDA4;text-decoration:none;">aegryn.com</a>
      &nbsp;·&nbsp;
      <a href="https://aegryn.com/client/partner" style="color:#94a3b8;text-decoration:none;">Espace partenaire</a>
    </p>
  </td>
</tr>`

const FOOTER_NEWSLETTER = `
<tr>
  <td style="padding:24px 32px 20px;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:11px;color:#94a3b8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <a href="https://aegryn.com" style="color:#5ADDA4;text-decoration:none;">aegryn.com</a>
      &nbsp;·&nbsp;
      <a href="https://aegryn.com/blog" style="color:#94a3b8;text-decoration:none;">Articles blog</a>
    </p>
  </td>
</tr>`

function WRAP_NEWSLETTER(body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;max-width:560px;width:100%;">

          <!-- Header logo -->
          <tr>
            <td style="padding:24px 32px 20px;border-bottom:1px solid #e2e8f0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="padding-right:12px;">${LOGO_SVG}</td>
                <td>
                  <p style="margin:0;font-size:18px;font-weight:700;color:#0F1C3F;letter-spacing:-0.02em;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Aegryn</p>
                  <p style="margin:0;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#5ADDA4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Newsletter</p>
                </td>
              </tr></table>
            </td>
          </tr>

          <!-- Corps -->
          <tr><td style="padding:28px 32px;">
            ${body}
          </td></tr>

          ${FOOTER_NEWSLETTER}
        </table>
      </td>
    </tr>
  </table>
</body></html>`
}

function WRAP(body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;max-width:560px;width:100%;">

          <!-- Header logo -->
          <tr>
            <td style="padding:24px 32px 20px;border-bottom:1px solid #e2e8f0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="padding-right:12px;">${LOGO_SVG}</td>
                <td>
                  <p style="margin:0;font-size:18px;font-weight:700;color:#0F1C3F;letter-spacing:-0.02em;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Aegryn</p>
                  <p style="margin:0;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#5ADDA4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">Réseau Partenaires</p>
                </td>
              </tr></table>
            </td>
          </tr>

          <!-- Corps -->
          <tr><td style="padding:28px 32px;">
            ${body}
          </td></tr>

          ${FOOTER}
        </table>

        <p style="font-size:10px;color:#94a3b8;margin:12px 0 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          Cet email vous est adressé en tant que partenaire certifié Aegryn.
        </p><!-- /WRAP -->
      </td>
    </tr>
  </table>
</body></html>`
}

/* ── Helpers affichage montant ─────────────────────────────────────────── */
function amountRow(label: string, chfFormatted: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;font-size:12px;font-weight:600;color:#64748b;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:13px;font-weight:700;color:#0F1C3F;font-family:monospace;">${chfFormatted}</td>
  </tr>`
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:5px 12px 5px 0;font-size:12px;font-weight:600;color:#64748b;white-space:nowrap;">${label}</td>
    <td style="padding:5px 0;font-size:13px;color:#1e293b;">${value}</td>
  </tr>`
}

function ctaButton(label: string, href: string, accent = true): string {
  return `<a href="${href}" style="display:inline-block;padding:11px 28px;background:${accent ? '#5ADDA4' : '#0F1C3F'};color:${accent ? '#0F1C3F' : '#ffffff'};text-decoration:none;font-weight:700;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${label} →</a>`
}

/* ── Templates ─────────────────────────────────────────────────────────── */

export async function emailPartnerScoreValidated(opts: {
  partnerName: string
  assetName: string
  dimension: string
  score: number
  amountChf?: number | null
  observations?: string | null
}): Promise<{ subject: string; html: string }> {
  const dim = opts.dimension.toUpperCase()
  const subject = `[Aegryn] Contribution ${dim} validée — ${opts.assetName}`

  const amountLine = opts.amountChf
    ? amountRow('Honoraires dus', await formatChfEur(Number(opts.amountChf)))
    : ''

  const html = WRAP(`
    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5ADDA4;font-weight:600;">Certification CIFS — CAS 1</p>
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#0F1C3F;line-height:1.25;">Contribution validée</h1>
    <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">
      Bonjour <strong style="color:#0F1C3F;">${opts.partnerName}</strong>,<br/>
      Votre contribution à la co-certification de l'actif <strong style="color:#0F1C3F;">${opts.assetName}</strong>
      (dimension <strong style="color:#5ADDA4;">${dim}</strong>) a été <strong style="color:#16a34a;">validée</strong> par l'équipe Aegryn.
    </p>

    <table cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;padding:4px 16px;margin-bottom:20px;width:100%;">
      ${infoRow('Actif', opts.assetName)}
      ${infoRow('Dimension', dim)}
      ${infoRow('Score retenu', `<span style="color:#5ADDA4;font-size:16px;font-weight:700;font-family:monospace;">${opts.score} / 25</span>`)}
      ${amountLine}
    </table>

    ${opts.observations ? `
    <div style="border-left:3px solid #5ADDA4;padding:10px 14px;background:#f0fdf4;margin-bottom:20px;">
      <p style="margin:0;font-size:12px;color:#166534;line-height:1.5;font-style:italic;">${opts.observations}</p>
    </div>` : ''}

    <p style="margin:0 0 20px 0;font-size:13px;color:#64748b;">
      Retrouvez le détail de cette certification et vos honoraires dans votre espace partenaire.
    </p>
    <p style="margin:0;">${ctaButton('Voir mon espace', 'https://aegryn.com/client/partner/certifications')}</p>
  `)

  return { subject, html }
}

export async function emailPartnerScoreRejected(opts: {
  partnerName: string
  assetName: string
  dimension: string
  rejectionReason?: string | null
  observations?: string | null
}): Promise<{ subject: string; html: string }> {
  const dim = opts.dimension.toUpperCase()
  const subject = `[Aegryn] Retour sur votre contribution ${dim} — ${opts.assetName}`

  const html = WRAP(`
    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#94a3b8;font-weight:600;">Certification CIFS — CAS 1</p>
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#0F1C3F;line-height:1.25;">Retour sur votre contribution</h1>
    <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">
      Bonjour <strong style="color:#0F1C3F;">${opts.partnerName}</strong>,<br/>
      Votre contribution à la co-certification de l'actif <strong style="color:#0F1C3F;">${opts.assetName}</strong>
      (dimension <strong style="color:#dc2626;">${dim}</strong>) n'a pas pu être retenue en l'état.
    </p>

    ${opts.rejectionReason ? `
    <div style="border-left:3px solid #dc2626;padding:10px 14px;background:#fef2f2;margin-bottom:16px;">
      <p style="margin:0 0 2px 0;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#991b1b;">Motif</p>
      <p style="margin:0;font-size:13px;color:#7f1d1d;line-height:1.5;">${opts.rejectionReason}</p>
    </div>` : ''}

    ${opts.observations ? `
    <div style="border-left:3px solid #cbd5e1;padding:10px 14px;background:#f8fafc;margin-bottom:20px;">
      <p style="margin:0;font-size:12px;color:#475569;line-height:1.5;font-style:italic;">${opts.observations}</p>
    </div>` : ''}

    <p style="margin:0 0 20px 0;font-size:13px;color:#64748b;">
      Contactez votre référent Aegryn pour discuter des ajustements à apporter avant une nouvelle soumission.
    </p>
    <p style="margin:0;">${ctaButton('Mon espace partenaire', 'https://aegryn.com/client/partner/certifications', false)}</p>
  `)

  return { subject, html }
}

export async function emailPartnerMandateCreated(opts: {
  partnerName: string
  partnerEmail: string
  clientName: string
  mandateType: string
  retrocessionPct: number
  assetName?: string | null
}): Promise<{ subject: string; html: string }> {
  const typeLabel: Record<string, string> = {
    advisory:      'Conseil stratégique',
    due_diligence: 'Due diligence',
    fundraising:   'Levée de fonds',
    other:         'Autre',
  }
  const subject = `[Aegryn] Mandat client activé — ${opts.clientName}`

  const html = WRAP(`
    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5ADDA4;font-weight:600;">Mandat client — CAS 3</p>
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#0F1C3F;line-height:1.25;">Nouveau mandat activé</h1>
    <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">
      Bonjour <strong style="color:#0F1C3F;">${opts.partnerName}</strong>,<br/>
      Un nouveau mandat client a été créé et activé dans votre espace partenaire Aegryn.
    </p>

    <table cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;padding:4px 16px;margin-bottom:24px;width:100%;">
      ${infoRow('Client', opts.clientName)}
      ${infoRow('Nature de la mission', typeLabel[opts.mandateType] ?? opts.mandateType)}
      ${infoRow('Rétrocession Aegryn', `<span style="color:#5ADDA4;font-weight:700;font-family:monospace;">${opts.retrocessionPct}%</span> de vos honoraires facturés`)}
      ${opts.assetName ? infoRow('Actif associé', opts.assetName) : ''}
    </table>

    <p style="margin:0 0 20px 0;font-size:13px;color:#64748b;">
      Vous pouvez déclarer vos factures et suivre l'avancement de ce mandat directement dans votre espace.
      La rétrocession Aegryn est calculée automatiquement à la validation de chaque facture.
    </p>
    <p style="margin:0;">${ctaButton('Voir mes mandats', 'https://aegryn.com/client/partner/mandates')}</p>
  `)

  return { subject, html }
}

/* ── Newsletter blog — 1 article par semaine ─────────────────────────────── */
const NEWSLETTER_CATEGORY_LABEL: Record<Article['category'], LocaleText> = {
  market:        { fr: 'Marché',        en: 'Market' },
  seller:        { fr: 'Vendeurs',      en: 'Sellers' },
  buyer:         { fr: 'Acquéreurs',    en: 'Buyers' },
  certification: { fr: 'Certification', en: 'Certification' },
  strategy:      { fr: 'Stratégie',     en: 'Strategy' },
  case_study:    { fr: 'Étude de cas',  en: 'Case study' },
  legal:         { fr: 'Juridique',     en: 'Legal' },
  vertical:      { fr: 'Vertical',      en: 'Vertical' },
  dach:          { fr: 'DACH',          en: 'DACH' },
}

function pickLocale(text: LocaleText, locale: string): string {
  return (text as Record<string, string | undefined>)[locale] ?? text.en ?? text.fr
}

export function emailNewsletterArticle(opts: {
  article: Article
  locale: string
  unsubscribeToken: string
}): { subject: string; html: string } {
  const { article, locale, unsubscribeToken } = opts
  const lang = ['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'fr'
  const title      = pickLocale(article.title, lang)
  const excerpt    = pickLocale(article.excerpt, lang)
  const category   = pickLocale(NEWSLETTER_CATEGORY_LABEL[article.category], lang)
  const articleUrl = `https://aegryn.com/${lang}/blog/${article.slug}`
  const unsubUrl   = `https://aegryn.com/api/newsletter/unsubscribe?token=${unsubscribeToken}`

  const isFr = lang === 'fr'
  const subject = `[Aegryn] ${title}`

  const html = WRAP_NEWSLETTER(`
    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5ADDA4;font-weight:600;">${category}</p>
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#0F1C3F;line-height:1.25;">${title}</h1>
    <p style="margin:0 0 24px 0;font-size:14px;color:#475569;line-height:1.6;">${excerpt}</p>
    <p style="margin:0 0 28px 0;">${ctaButton(isFr ? 'Lire l\u2019article' : 'Read the article', articleUrl)}</p>
    <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
      ${isFr
        ? 'Vous recevez cet email car vous êtes abonné à la newsletter Aegryn (1 article par semaine).'
        : 'You are receiving this email because you subscribed to the Aegryn newsletter (1 article per week).'}
      <br/>
      <a href="${unsubUrl}" style="color:#94a3b8;text-decoration:underline;">${isFr ? 'Se désabonner' : 'Unsubscribe'}</a>
    </p>
  `)

  return { subject, html }
}

/* ── KYC : notification admin à la soumission d'un document ────────────── */
export function emailKycDocSubmitted(opts: {
  memberName: string
  memberId: string
  docLabel: string
}): { subject: string; html: string } {
  const subject = `[Aegryn KYC] Nouveau document soumis — ${opts.docLabel}`
  const html = WRAP(`
    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5ADDA4;font-weight:600;">KYC — Document reçu</p>
    <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:700;color:#0F1C3F;line-height:1.25;">${opts.docLabel}</h1>
    <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">
      <strong style="color:#0F1C3F;">${opts.memberName}</strong> vient de soumettre un document KYC pour validation.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
      ${infoRow('Type', opts.docLabel)}
      ${infoRow('ID membre', `<span style="font-family:monospace;font-size:11px;">${opts.memberId}</span>`)}
    </table>
    <p style="margin:0;">${ctaButton('Ouvrir le dossier KYC', 'https://aegryn.com/admin/kyc/' + opts.memberId, false)}</p>
  `)
  return { subject, html }
}

/* ── KYC : email final profil approuvé (buyer, seller ou partner) ──────── */
export function emailKycApproved(opts: {
  memberName: string
  role: 'buyer' | 'seller' | 'partner'
}): { subject: string; html: string } {
  const { role } = opts
  const subject = '[Aegryn] Votre profil KYC est validé'

  const roleLabel  = role === 'buyer' ? 'acquéreur' : role === 'seller' ? 'cédant' : 'partenaire expert'
  const ctaLabel   = role === 'buyer'   ? 'Accéder aux sessions d\'acquisition'
                   : role === 'seller'  ? 'Soumettre un actif'
                   : 'Mon espace partenaire'
  const ctaHref    = role === 'buyer'   ? 'https://aegryn.com/client/buyer/catalogue'
                   : role === 'seller'  ? 'https://aegryn.com/client/seller/actifs'
                   : 'https://aegryn.com/client/partner'
  const roleAction = role === 'buyer'   ? 'vous pouvez désormais <strong>vous inscrire et accéder aux sessions de vente Aegryn</strong>.'
                   : role === 'seller'  ? 'vous pouvez désormais <strong>soumettre un actif pour certification et mise en vente</strong>.'
                   : 'vous pouvez désormais <strong>publier votre fiche profil expert et recevoir des mandats clients Aegryn</strong>.'

  const html = WRAP(`
    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5ADDA4;font-weight:600;">
      KYC — Profil vérifié et conforme
    </p>
    <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#0F1C3F;line-height:1.25;">Votre dossier KYC est validé</h1>
    <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">
      Bonjour <strong style="color:#0F1C3F;">${opts.memberName}</strong>,<br/><br/>
      Votre dossier KYC a été examiné et <strong style="color:#16a34a;">approuvé</strong> par l'équipe Aegryn. Votre identité et vos documents sont conformes à nos exigences réglementaires.<br/><br/>
      En tant que ${roleLabel}, ${roleAction}
    </p>
    <p style="margin:0 0 28px 0;">${ctaButton(ctaLabel, ctaHref)}</p>
    <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
      Pour toute question : <a href="mailto:contact@boha-group.com" style="color:#5ADDA4;text-decoration:none;">contact@boha-group.com</a>
    </p>
  `)
  return { subject, html }
}
