type Mail = { subject: string; hello: string; body: string; button: string; ignore: string }

const MAILS: Record<string, Mail> = {
  fr: { subject: 'Confirmez votre préinscription neediu', hello: 'Bonjour {name},', body: 'Merci de votre intérêt pour neediu. Confirmez votre préinscription pour être prévenu(e) dès l’ouverture de votre ville.', button: 'Confirmer ma préinscription', ignore: 'Si vous n’êtes pas à l’origine de cette demande, ignorez ce message : aucune inscription ne sera conservée.' },
  en: { subject: 'Confirm your neediu pre-registration', hello: 'Hello {name},', body: 'Thank you for your interest in neediu. Confirm your pre-registration to be told as soon as your city opens.', button: 'Confirm my pre-registration', ignore: 'If you did not make this request, ignore this message: no registration will be kept.' },
  de: { subject: 'Bestätigen Sie Ihre Vorabanmeldung bei neediu', hello: 'Guten Tag {name},', body: 'Vielen Dank für Ihr Interesse an neediu. Bestätigen Sie Ihre Vorabanmeldung, um zu erfahren, sobald Ihre Stadt startet.', button: 'Vorabanmeldung bestätigen', ignore: 'Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese Nachricht: Es wird keine Anmeldung gespeichert.' },
  es: { subject: 'Confirma tu preinscripción en neediu', hello: 'Hola {name}:', body: 'Gracias por tu interés en neediu. Confirma tu preinscripción para saber en cuanto abra tu ciudad.', button: 'Confirmar mi preinscripción', ignore: 'Si no has hecho esta solicitud, ignora este mensaje: no se conservará ninguna inscripción.' },
  it: { subject: 'Conferma la tua preiscrizione a neediu', hello: 'Buongiorno {name},', body: 'Grazie per l’interesse per neediu. Conferma la preiscrizione per sapere non appena aprirà la tua città.', button: 'Conferma la mia preiscrizione', ignore: 'Se non hai fatto tu questa richiesta, ignora questo messaggio: nessuna iscrizione verrà conservata.' },
  nl: { subject: 'Bevestig je voorinschrijving bij neediu', hello: 'Hallo {name},', body: 'Bedankt voor je interesse in neediu. Bevestig je voorinschrijving om te horen zodra jouw stad opent.', button: 'Voorinschrijving bevestigen', ignore: 'Heb je deze aanvraag niet gedaan, negeer dan dit bericht: er wordt geen inschrijving bewaard.' },
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function neediuProConfirmMail(locale: string, name: string, url: string) {
  const m = MAILS[locale] ?? MAILS.fr
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0F1C3F">
<p style="font-size:15px">${esc(m.hello.replace('{name}', name))}</p>
<p style="font-size:15px;line-height:1.6">${esc(m.body)}</p>
<p style="margin:28px 0"><a href="${esc(url)}" style="background:#5adda4;color:#0F1C3F;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:8px;display:inline-block">${esc(m.button)}</a></p>
<p style="font-size:12px;line-height:1.6;color:#5b6475">${esc(m.ignore)}</p></div>`
  return { subject: m.subject, html }
}
