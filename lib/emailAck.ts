/**
 * Accusé de réception client, gabarit commun à tous les formulaires publics.
 * Même visuel (WRAP_CLIENT), contenu personnalisé par formulaire, langue du
 * visiteur. Chaque route fournit : accroche, titre, lignes de récapitulatif,
 * paragraphes de suite ; le reste (en-tête, pied, salutation, signature,
 * invitation à répondre) est commun et traduit ici.
 */
import { WRAP_CLIENT, infoRow, ctaButton } from '@/lib/sendEmail'

export type Lang = 'fr' | 'en' | 'de' | 'it' | 'es' | 'nl'
export const LANGS: Lang[] = ['fr', 'en', 'de', 'it', 'es', 'nl']
export const toLang = (l?: string | null): Lang => (LANGS.includes(l as Lang) ? (l as Lang) : 'fr')

const COMMON: Record<Lang, {
  headerSubtitle: string; footnote: string; sign: string; recap: string
  reply: string; greeting: (n?: string | null) => string
}> = {
  fr: { headerSubtitle: 'Cabinet de conseil intégré', footnote: 'Vous recevez cet e-mail parce que vous avez soumis une demande sur aegryn.com.', sign: 'Aegryn · Suisse', recap: 'Récapitulatif', reply: 'Vous pouvez compléter votre demande en répondant simplement à cet e-mail.', greeting: n => n ? `Bonjour ${n},` : 'Bonjour,' },
  en: { headerSubtitle: 'Integrated advisory firm', footnote: 'You are receiving this email because you submitted a request on aegryn.com.', sign: 'Aegryn · Switzerland', recap: 'Summary', reply: 'You can add to your request simply by replying to this email.', greeting: n => n ? `Hello ${n},` : 'Hello,' },
  de: { headerSubtitle: 'Integrierte Beratungsgesellschaft', footnote: 'Sie erhalten diese E-Mail, weil Sie auf aegryn.com eine Anfrage gestellt haben.', sign: 'Aegryn · Schweiz', recap: 'Zusammenfassung', reply: 'Sie können Ihre Anfrage ergänzen, indem Sie einfach auf diese E-Mail antworten.', greeting: n => n ? `Guten Tag ${n},` : 'Guten Tag,' },
  it: { headerSubtitle: 'Società di consulenza integrata', footnote: 'Ricevete questa e-mail perché avete inviato una richiesta su aegryn.com.', sign: 'Aegryn · Svizzera', recap: 'Riepilogo', reply: 'Potete completare la vostra richiesta rispondendo semplicemente a questa e-mail.', greeting: n => n ? `Buongiorno ${n},` : 'Buongiorno,' },
  es: { headerSubtitle: 'Firma de consultoría integrada', footnote: 'Recibe este correo porque ha enviado una solicitud en aegryn.com.', sign: 'Aegryn · Suiza', recap: 'Resumen', reply: 'Puede completar su solicitud respondiendo simplemente a este correo.', greeting: n => n ? `Buenos días ${n},` : 'Buenos días,' },
  nl: { headerSubtitle: 'Geïntegreerd adviesbureau', footnote: 'U ontvangt deze e-mail omdat u een aanvraag heeft ingediend op aegryn.com.', sign: 'Aegryn · Zwitserland', recap: 'Samenvatting', reply: 'U kunt uw aanvraag aanvullen door eenvoudig op deze e-mail te antwoorden.', greeting: n => n ? `Goedendag ${n},` : 'Goedendag,' },
}

export const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export interface AckOptions {
  lang:        Lang | string | null | undefined
  subject:     string
  kicker:      string
  title:       string
  name?:       string | null
  intro:       string
  /** Lignes de récapitulatif ; les valeurs vides sont ignorées */
  rows?:       [string, string | null | undefined][]
  /** Paragraphes de suite (ce qui se passe ensuite, confidentialité, etc.) */
  paragraphs?: string[]
  /** Bloc pré-formaté optionnel (rapport texte) */
  pre?:        string
  cta?:        { label: string; href: string }
  /** Remplace l'invitation à répondre (ex. lien de désabonnement) */
  footerLine?: string
  /** Remplace la note de provenance */
  footnote?:   string
  /** Sous-titre d'en-tête spécifique (ex. "Talent") */
  headerSubtitle?: string
}

export function emailClientAck(o: AckOptions): { subject: string; html: string } {
  const lang = toLang(o.lang)
  const c = COMMON[lang]
  const rows = (o.rows ?? []).filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([k, v]) => infoRow(esc(k), esc(String(v)).replace(/\n/g, '<br/>'))).join('')
  const html = WRAP_CLIENT(`
    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#5ADDA4;font-weight:600;">${esc(o.kicker)}</p>
    <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:700;color:#0F1C3F;line-height:1.25;">${esc(o.title)}</h1>
    <p style="margin:0 0 8px 0;font-size:14px;color:#475569;line-height:1.6;">${esc(c.greeting(o.name))}</p>
    <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">${esc(o.intro)}</p>
    ${rows ? `<p style="margin:0 0 8px 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#94a3b8;font-weight:600;">${esc(c.recap)}</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">${rows}</table>` : ''}
    ${o.pre ? `<pre style="margin:0 0 24px 0;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;line-height:1.55;color:#334155;white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;">${esc(o.pre)}</pre>` : ''}
    ${(o.paragraphs ?? []).map(p => `<p style="margin:0 0 12px 0;font-size:14px;color:#475569;line-height:1.6;">${esc(p)}</p>`).join('')}
    ${o.cta ? `<p style="margin:8px 0 20px 0;">${ctaButton(esc(o.cta.label), o.cta.href)}</p>` : ''}
    <p style="margin:8px 0 20px 0;font-size:13px;color:#64748b;line-height:1.6;">${o.footerLine ?? esc(c.reply)}</p>
    <p style="margin:0;font-size:13px;color:#0F1C3F;font-weight:600;">${esc(c.sign)}</p>
  `, { lang, subtitle: esc(o.headerSubtitle ?? c.headerSubtitle), footnote: esc(o.footnote ?? c.footnote) })
  return { subject: o.subject, html }
}
