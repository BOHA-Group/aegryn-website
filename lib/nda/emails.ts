/**
 * E-mails du NDA mutuel : invitation à signer, exemplaire signé (avec PDF joint),
 * copie interne. Gabarit commun `emailClientAck`, langue de l'accord (fr ou en).
 */
import { emailClientAck } from '@/lib/emailAck'
import { ROLE_LABELS, type NdaLang, type NdaRole } from './template'

const SITE = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
export const ndaLink = (token: string) => `${SITE()}/nda/${token}`

const dateOnly = (iso: string) => new Date(iso).toISOString().slice(0, 10)
const utc = (iso: string) => `${new Date(iso).toISOString().replace('T', ' ').slice(0, 16)} UTC`

interface Base { lang: NdaLang; name: string; reference: string; projectLabel: string }

export function ndaInvitationEmail(o: Base & { token: string; expiresAtIso: string; reminder?: boolean }) {
  const fr = o.lang === 'fr'
  return emailClientAck({
    lang: o.lang,
    subject: fr
      ? `Aegryn · ${o.reminder ? 'Rappel : ' : ''}accord de confidentialité à signer (${o.reference})`
      : `Aegryn · ${o.reminder ? 'Reminder: ' : ''}confidentiality agreement to sign (${o.reference})`,
    kicker: fr ? 'Accord de confidentialité' : 'Confidentiality agreement',
    title: fr ? 'Votre accord de confidentialité est prêt' : 'Your confidentiality agreement is ready',
    name: o.name,
    intro: fr
      ? `Pour échanger en confiance sur « ${o.projectLabel} », Aegryn vous adresse un accord de confidentialité mutuel. Il se signe en ligne en quelques instants, sans compte. Vous recevez ensuite votre exemplaire signé en PDF.`
      : `To exchange in confidence about “${o.projectLabel}”, Aegryn sends you a mutual confidentiality agreement. It is signed online in a few moments, without an account. You then receive your signed copy as a PDF.`,
    rows: [
      [fr ? 'Référence' : 'Reference', o.reference],
      [fr ? 'Lien valable jusqu’au' : 'Link valid until', dateOnly(o.expiresAtIso)],
    ],
    paragraphs: [fr
      ? 'Le lien est personnel : ne le transférez pas. Si une autre personne doit signer, indiquez-le-nous et nous lui adresserons son propre lien.'
      : 'The link is personal: please do not forward it. If another person needs to sign, tell us and we will send them their own link.'],
    cta: { label: fr ? 'Lire et signer' : 'Read and sign', href: ndaLink(o.token) },
    headerSubtitle: fr ? 'Accord de confidentialité' : 'Confidentiality agreement',
  })
}

export function ndaSignedEmail(o: Base & { token: string; signedAtIso: string; pdfSha256: string }) {
  const fr = o.lang === 'fr'
  return emailClientAck({
    lang: o.lang,
    subject: fr ? `Aegryn · Votre accord de confidentialité signé (${o.reference})` : `Aegryn · Your signed confidentiality agreement (${o.reference})`,
    kicker: fr ? 'Accord signé' : 'Agreement signed',
    title: fr ? 'Accord de confidentialité signé' : 'Confidentiality agreement signed',
    name: o.name,
    intro: fr
      ? 'Votre accord de confidentialité avec Aegryn est signé et contresigné. Votre exemplaire PDF est joint à cet e-mail.'
      : 'Your confidentiality agreement with Aegryn is signed and countersigned. Your PDF copy is attached to this email.',
    rows: [
      [fr ? 'Référence' : 'Reference', o.reference],
      [fr ? 'Objet' : 'Subject', o.projectLabel],
      [fr ? 'Signé le' : 'Signed on', utc(o.signedAtIso)],
      ['SHA-256 PDF', `${o.pdfSha256.slice(0, 32)}…`],
    ],
    paragraphs: [fr
      ? 'Vous pouvez aussi retrouver et télécharger votre exemplaire à tout moment avec votre lien personnel, sans compte.'
      : 'You can also find and download your copy at any time with your personal link, without an account.'],
    cta: { label: fr ? 'Télécharger mon exemplaire' : 'Download my copy', href: ndaLink(o.token) },
    headerSubtitle: fr ? 'Accord de confidentialité' : 'Confidentiality agreement',
  })
}

export function ndaInternalEmail(o: Base & { email: string; company?: string | null; roles: NdaRole[]; signedAtIso: string; ip: string | null; pdfSha256: string; adminUrl: string }) {
  return emailClientAck({
    lang: 'fr',
    subject: `[NDA signé] ${o.reference} · ${o.name}`,
    kicker: 'NDA signé',
    title: `${o.name} a signé le NDA ${o.reference}`,
    intro: 'La contresignature d’Aegryn a été apposée automatiquement. L’exemplaire signé est joint et archivé.',
    rows: [
      ['Signataire', `${o.name}${o.company ? `, ${o.company}` : ''}`],
      ['E-mail', o.email],
      ['Profils', o.roles.map(r => ROLE_LABELS.fr[r]).join(', ')],
      ['Objet', o.projectLabel],
      ['Signé le', utc(o.signedAtIso)],
      ['Adresse IP', o.ip],
      ['SHA-256 PDF', o.pdfSha256],
    ],
    cta: { label: 'Ouvrir dans l’admin', href: o.adminUrl },
    footnote: 'Notification interne Aegryn.',
    footerLine: '',
  })
}
