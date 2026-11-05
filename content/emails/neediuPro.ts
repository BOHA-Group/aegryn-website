import { NEEDIU_SERVICES } from '@/content/neediu/services'

type Mail = {
  subject: string; hello: string; intro: string; button: string; validity: string
  recap: string; company: string; vat: string; city: string; phone: string; services: string
  next: string; steps: [string, string, string, string]
  privacy: string; notice: string; ignore: string
}

const MAILS: Record<string, Mail> = {
  fr: {
    subject: 'Confirmez votre préinscription neediu', hello: 'Bonjour {name},',
    intro: 'Merci de votre intérêt pour neediu. Il ne reste qu’une étape : confirmez votre adresse e-mail pour valider votre préinscription et être prévenu(e) dès l’ouverture de votre ville.',
    button: 'Confirmer ma préinscription', validity: 'Ce lien est valable 48 heures.',
    recap: 'Ce que vous nous avez confié', company: 'Entreprise', vat: 'N° de TVA', city: 'Ville', phone: 'Téléphone', services: 'Services',
    next: 'Et ensuite ?',
    steps: ['Vous confirmez votre adresse avec le bouton ci-dessus.', 'À l’ouverture de neediu dans votre ville, nous vous écrivons avec les liens de l’app et un code d’invitation personnel.', 'Vous créez votre compte prestataire avec la même adresse : vos informations sont déjà préparées.', 'Notre équipe examine votre profil sous 48 h, notamment l’assurance responsabilité civile professionnelle, à déposer dans l’espace Compte.'],
    privacy: 'Vos données ne servent qu’à préparer l’ouverture de neediu dans votre ville. Pour les effacer, répondez simplement à cet e-mail.',
    notice: 'Notice de protection des données',
    ignore: 'Si vous n’êtes pas à l’origine de cette demande, ignorez ce message : aucune inscription ne sera conservée.',
  },
  en: {
    subject: 'Confirm your neediu pre-registration', hello: 'Hello {name},',
    intro: 'Thank you for your interest in neediu. One step left: confirm your email address to validate your pre-registration and be told as soon as your city opens.',
    button: 'Confirm my pre-registration', validity: 'This link is valid for 48 hours.',
    recap: 'What you shared with us', company: 'Company', vat: 'VAT number', city: 'City', phone: 'Phone', services: 'Services',
    next: 'What happens next?',
    steps: ['You confirm your address with the button above.', 'When neediu opens in your city, we write to you with the app links and a personal invitation code.', 'You create your provider account with the same address: your details are already prepared.', 'Our team reviews your profile within 48 hours, including your professional liability insurance, to be uploaded in the Account section.'],
    privacy: 'Your data is only used to prepare the opening of neediu in your city. To delete it, simply reply to this email.',
    notice: 'Data protection notice',
    ignore: 'If you did not make this request, ignore this message: no registration will be kept.',
  },
  de: {
    subject: 'Bestätigen Sie Ihre Vorabanmeldung bei neediu', hello: 'Guten Tag {name},',
    intro: 'Vielen Dank für Ihr Interesse an neediu. Ein Schritt fehlt noch: Bestätigen Sie Ihre E-Mail-Adresse, um Ihre Vorabanmeldung zu bestätigen und zu erfahren, sobald Ihre Stadt startet.',
    button: 'Vorabanmeldung bestätigen', validity: 'Dieser Link ist 48 Stunden gültig.',
    recap: 'Ihre Angaben', company: 'Unternehmen', vat: 'USt-Nr.', city: 'Stadt', phone: 'Telefon', services: 'Dienste',
    next: 'Wie geht es weiter?',
    steps: ['Sie bestätigen Ihre Adresse mit der Schaltfläche oben.', 'Wenn neediu in Ihrer Stadt startet, schreiben wir Ihnen mit den App-Links und einem persönlichen Einladungscode.', 'Sie erstellen Ihr Anbieterkonto mit derselben Adresse: Ihre Angaben sind bereits vorbereitet.', 'Unser Team prüft Ihr Profil innerhalb von 48 Stunden, insbesondere die Berufshaftpflichtversicherung, die Sie im Bereich Konto hochladen.'],
    privacy: 'Ihre Daten dienen nur der Vorbereitung des Starts von neediu in Ihrer Stadt. Um sie zu löschen, antworten Sie einfach auf diese E-Mail.',
    notice: 'Datenschutzhinweis',
    ignore: 'Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese Nachricht: Es wird keine Anmeldung gespeichert.',
  },
  es: {
    subject: 'Confirma tu preinscripción en neediu', hello: 'Hola {name}:',
    intro: 'Gracias por tu interés en neediu. Solo falta un paso: confirma tu correo electrónico para validar tu preinscripción y saber en cuanto abra tu ciudad.',
    button: 'Confirmar mi preinscripción', validity: 'Este enlace es válido durante 48 horas.',
    recap: 'Lo que nos has confiado', company: 'Empresa', vat: 'N.º de IVA', city: 'Ciudad', phone: 'Teléfono', services: 'Servicios',
    next: '¿Y después?',
    steps: ['Confirmas tu dirección con el botón de arriba.', 'Cuando neediu abra en tu ciudad, te escribiremos con los enlaces de la app y un código de invitación personal.', 'Creas tu cuenta de profesional con la misma dirección: tus datos ya están preparados.', 'Nuestro equipo revisa tu perfil en 48 h, en particular el seguro de responsabilidad civil profesional, que debes subir en la sección Cuenta.'],
    privacy: 'Tus datos solo sirven para preparar la apertura de neediu en tu ciudad. Para borrarlos, responde a este correo.',
    notice: 'Aviso de protección de datos',
    ignore: 'Si no has hecho esta solicitud, ignora este mensaje: no se conservará ninguna inscripción.',
  },
  it: {
    subject: 'Conferma la tua preiscrizione a neediu', hello: 'Buongiorno {name},',
    intro: 'Grazie per l’interesse per neediu. Manca un solo passaggio: conferma il tuo indirizzo e-mail per convalidare la preiscrizione e sapere non appena aprirà la tua città.',
    button: 'Conferma la mia preiscrizione', validity: 'Questo link è valido per 48 ore.',
    recap: 'Ciò che ci hai affidato', company: 'Azienda', vat: 'Partita IVA', city: 'Città', phone: 'Telefono', services: 'Servizi',
    next: 'E poi?',
    steps: ['Confermi il tuo indirizzo con il pulsante qui sopra.', 'All’apertura di neediu nella tua città, ti scriviamo con i link dell’app e un codice d’invito personale.', 'Crei il tuo account professionista con lo stesso indirizzo: i tuoi dati sono già pronti.', 'Il nostro team esamina il tuo profilo entro 48 ore, in particolare l’assicurazione di responsabilità civile professionale, da caricare nella sezione Account.'],
    privacy: 'I tuoi dati servono solo a preparare l’apertura di neediu nella tua città. Per cancellarli, rispondi semplicemente a questa e-mail.',
    notice: 'Informativa sulla protezione dei dati',
    ignore: 'Se non hai fatto tu questa richiesta, ignora questo messaggio: nessuna iscrizione verrà conservata.',
  },
  nl: {
    subject: 'Bevestig je voorinschrijving bij neediu', hello: 'Hallo {name},',
    intro: 'Bedankt voor je interesse in neediu. Nog één stap: bevestig je e-mailadres om je voorinschrijving te valideren en te horen zodra jouw stad opent.',
    button: 'Voorinschrijving bevestigen', validity: 'Deze link is 48 uur geldig.',
    recap: 'Wat je ons hebt toevertrouwd', company: 'Bedrijf', vat: 'Btw-nummer', city: 'Stad', phone: 'Telefoon', services: 'Diensten',
    next: 'En daarna?',
    steps: ['Je bevestigt je adres met de knop hierboven.', 'Zodra neediu in jouw stad opent, schrijven we je met de app-links en een persoonlijke uitnodigingscode.', 'Je maakt je aanbiederaccount aan met hetzelfde adres: je gegevens staan al klaar.', 'Ons team controleert je profiel binnen 48 uur, in het bijzonder de beroepsaansprakelijkheidsverzekering, die je uploadt in het onderdeel Account.'],
    privacy: 'Je gegevens dienen alleen om de opening van neediu in jouw stad voor te bereiden. Om ze te wissen, antwoord je gewoon op deze e-mail.',
    notice: 'Privacyverklaring',
    ignore: 'Heb je deze aanvraag niet gedaan, negeer dan dit bericht: er wordt geen inschrijving bewaard.',
  },
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export type NeediuProSummary = { company: string; vat: string; city: string; phone: string; services: string[] }

/**
 * E-mail de double confirmation de la préinscription des pros neediu : bandeau noir neediu, bouton de confirmation,
 * récapitulatif de ce qui a été saisi et suite du parcours. Même charte que l'e-mail d'ouverture de ville envoyé depuis l'app.
 */
export function neediuProConfirmMail(locale: string, name: string, url: string, summary: NeediuProSummary) {
  const l = (locale in MAILS ? locale : 'fr') as keyof typeof MAILS & ('fr' | 'en' | 'de' | 'es' | 'it' | 'nl')
  const m = MAILS[l]
  const serviceLabel = (key: string) => NEEDIU_SERVICES.find(s => s.key === key)?.label[l] ?? key
  const rows: [string, string][] = [
    [m.company, summary.company], [m.vat, summary.vat], [m.city, summary.city], [m.phone, summary.phone],
    [m.services, summary.services.map(serviceLabel).join(', ')],
  ]
  const recap = rows.map(([k, v]) =>
    `<tr><td style="padding:6px 12px 6px 0;font-size:13px;color:#6b7280;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;font-size:13px;color:#111827;line-height:1.5">${esc(v)}</td></tr>`).join('')
  const steps = m.steps.map((s, i) =>
    `<tr><td style="padding:0 12px 10px 0;vertical-align:top"><div style="width:24px;height:24px;border-radius:12px;background:#000000;color:#ffffff;font-size:12px;font-weight:700;line-height:24px;text-align:center">${i + 1}</div></td><td style="padding:2px 0 10px;font-size:14px;color:#374151;line-height:1.55">${esc(s)}</td></tr>`).join('')
  const html = `<!DOCTYPE html>
<html lang="${l}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9fafb;padding:40px 0">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
        <tr><td style="background:#000000;padding:28px 40px;text-align:center"><span style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px">neediu</span></td></tr>
        <tr><td style="padding:32px 40px 8px">
          <p style="margin:0 0 14px;font-size:15px;color:#374151">${esc(m.hello.replace('{name}', name))}</p>
          <p style="margin:0 0 22px;font-size:14px;color:#374151;line-height:1.6">${esc(m.intro)}</p>
          <p style="margin:0 0 8px"><a href="${esc(url)}" style="display:inline-block;background:#000000;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 26px;border-radius:12px">${esc(m.button)}</a></p>
          <p style="margin:0 0 26px;font-size:12px;color:#9ca3af">${esc(m.validity)}</p>
          <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#111827">${esc(m.recap)}</p>
          <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 26px;width:100%;border-top:1px solid #e5e7eb">${recap}</table>
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#111827">${esc(m.next)}</p>
          <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 12px">${steps}</table>
        </td></tr>
        <tr><td style="background:#f3f4f6;padding:18px 40px;text-align:center">
          <p style="margin:0 0 6px;font-size:12px;color:#6b7280;line-height:1.5">${esc(m.privacy)}</p>
          <p style="margin:0 0 6px;font-size:12px"><a href="https://www.aegryn.com/${l}/data-protection-notice-neediu" style="color:#6b7280">${esc(m.notice)}</a></p>
          <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5">${esc(m.ignore)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  return { subject: m.subject, html }
}
