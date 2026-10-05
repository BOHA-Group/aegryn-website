/** Libellés du formulaire d'action (/contact?metier=...&action=...). */
export interface ActionFormUi {
  name:                string
  email:               string
  revenueLabel:        string
  revenuePlaceholder:  string
  sectorLabel:         string
  sectorPlaceholder:   string
  newsletterLabel:     string
  submit:              string
  sending:             string
  successTitle:        string
  successDesc:         string
  error:               string
  backToGeneral:       string
  email_: {
    subject:   string
    kicker:    string
    greeting:  (name: string) => string
    intro:     string
    recap:     string
    request:   string
    revenue:   string
    sector:    string
    yourAnswer: string
    next:      string
    reply:     string
    sign:      string
    headerSubtitle: string
    footnote:  string
  }
}

export const ACTION_FORM_UI: Record<string, ActionFormUi> = {
  fr: {
    name: 'Nom et prénom', email: 'Email professionnel',
    revenueLabel: "Chiffre d'affaires annuel", revenuePlaceholder: 'Choisir',
    sectorLabel: "Secteur d'activité", sectorPlaceholder: 'Choisir',
    newsletterLabel: "Je souhaite recevoir la newsletter Built to Last (analyses de marché, pas de prospection).",
    submit: 'Envoyer la demande', sending: 'Envoi en cours…',
    successTitle: 'Reçu.', successDesc: 'Un expert vous répond rapidement.',
    error: "Une erreur s'est produite. Réessayez ou écrivez-nous directement à",
    backToGeneral: 'Question générale ? Utiliser le formulaire de contact standard',
    email_: {
      subject: 'Aegryn · Votre demande est bien reçue', kicker: 'Demande reçue',
      greeting: n => `Bonjour ${n},`,
      intro: 'Nous avons bien reçu votre demande. En voici le récapitulatif :',
      recap: 'Récapitulatif', request: 'Votre demande', revenue: "Chiffre d'affaires", sector: 'Secteur', yourAnswer: 'Votre réponse',
      next: 'Un expert du réseau Aegryn, nommé et responsable de son périmètre, prend connaissance de votre demande et vous répond rapidement.',
      reply: 'Vous pouvez compléter votre demande en répondant simplement à cet e-mail.',
      sign: 'Aegryn · Suisse',
      headerSubtitle: 'Cabinet de conseil intégré', footnote: 'Vous recevez cet e-mail parce que vous avez soumis une demande sur aegryn.com.',
    },
  },
  en: {
    name: 'Full name', email: 'Professional email',
    revenueLabel: 'Annual revenue', revenuePlaceholder: 'Choose',
    sectorLabel: 'Sector', sectorPlaceholder: 'Choose',
    newsletterLabel: "I'd like to receive the Built to Last newsletter (market analysis, no prospecting).",
    submit: 'Send request', sending: 'Sending…',
    successTitle: 'Received.', successDesc: 'An expert will get back to you shortly.',
    error: 'Something went wrong. Please try again or email us directly at',
    backToGeneral: 'General question? Use the standard contact form',
    email_: {
      subject: 'Aegryn · Your request has been received', kicker: 'Request received',
      greeting: n => `Hello ${n},`,
      intro: 'We have received your request. Here is a summary:',
      recap: 'Summary', request: 'Your request', revenue: 'Annual revenue', sector: 'Sector', yourAnswer: 'Your answer',
      next: 'A named expert from the Aegryn network, accountable for their scope, is reviewing your request and will get back to you shortly.',
      reply: 'You can add to your request simply by replying to this email.',
      sign: 'Aegryn · Switzerland',
      headerSubtitle: 'Integrated advisory firm', footnote: 'You are receiving this email because you submitted a request on aegryn.com.',
    },
  },
  de: {
    name: 'Vor- und Nachname', email: 'Geschäftliche E-Mail',
    revenueLabel: 'Jahresumsatz', revenuePlaceholder: 'Auswählen',
    sectorLabel: 'Branche', sectorPlaceholder: 'Auswählen',
    newsletterLabel: 'Ich möchte den Built-to-Last-Newsletter erhalten (Marktanalysen, keine Akquise).',
    submit: 'Anfrage senden', sending: 'Wird gesendet…',
    successTitle: 'Erhalten.', successDesc: 'Ein Experte meldet sich in Kürze bei Ihnen.',
    error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an',
    backToGeneral: 'Allgemeine Frage? Standardkontaktformular verwenden',
    email_: {
      subject: 'Aegryn · Ihre Anfrage ist eingegangen', kicker: 'Anfrage erhalten',
      greeting: n => `Guten Tag ${n},`,
      intro: 'Wir haben Ihre Anfrage erhalten. Hier die Zusammenfassung:',
      recap: 'Zusammenfassung', request: 'Ihre Anfrage', revenue: 'Jahresumsatz', sector: 'Branche', yourAnswer: 'Ihre Antwort',
      next: 'Ein namentlich benannter Experte aus dem Aegryn-Netzwerk, verantwortlich für seinen Bereich, prüft Ihre Anfrage und meldet sich in Kürze bei Ihnen.',
      reply: 'Sie können Ihre Anfrage ergänzen, indem Sie einfach auf diese E-Mail antworten.',
      sign: 'Aegryn · Schweiz',
      headerSubtitle: 'Integrierte Beratungsgesellschaft', footnote: 'Sie erhalten diese E-Mail, weil Sie auf aegryn.com eine Anfrage gestellt haben.',
    },
  },
  it: {
    name: 'Nome e cognome', email: 'Email professionale',
    revenueLabel: 'Fatturato annuo', revenuePlaceholder: 'Scegliere',
    sectorLabel: 'Settore', sectorPlaceholder: 'Scegliere',
    newsletterLabel: 'Desidero ricevere la newsletter Built to Last (analisi di mercato, nessuna prospezione).',
    submit: 'Inviare la richiesta', sending: 'Invio in corso…',
    successTitle: 'Ricevuto.', successDesc: 'Un esperto vi risponderà a breve.',
    error: 'Si è verificato un errore. Riprovate o scriveteci direttamente a',
    backToGeneral: 'Domanda generale? Usate il modulo di contatto standard',
    email_: {
      subject: 'Aegryn · La vostra richiesta è stata ricevuta', kicker: 'Richiesta ricevuta',
      greeting: n => `Buongiorno ${n},`,
      intro: 'Abbiamo ricevuto la vostra richiesta. Ecco il riepilogo:',
      recap: 'Riepilogo', request: 'La vostra richiesta', revenue: 'Fatturato annuo', sector: 'Settore', yourAnswer: 'La vostra risposta',
      next: 'Un esperto della rete Aegryn, nominato e responsabile del proprio perimetro, esamina la vostra richiesta e vi risponderà a breve.',
      reply: 'Potete completare la vostra richiesta rispondendo semplicemente a questa e-mail.',
      sign: 'Aegryn · Svizzera',
      headerSubtitle: 'Società di consulenza integrata', footnote: 'Ricevete questa e-mail perché avete inviato una richiesta su aegryn.com.',
    },
  },
  es: {
    name: 'Nombre y apellidos', email: 'Correo profesional',
    revenueLabel: 'Facturación anual', revenuePlaceholder: 'Elegir',
    sectorLabel: 'Sector', sectorPlaceholder: 'Elegir',
    newsletterLabel: 'Deseo recibir el boletín Built to Last (análisis de mercado, sin prospección).',
    submit: 'Enviar solicitud', sending: 'Enviando…',
    successTitle: 'Recibido.', successDesc: 'Un experto le responderá en breve.',
    error: 'Se produjo un error. Inténtelo de nuevo o escríbanos directamente a',
    backToGeneral: '¿Pregunta general? Use el formulario de contacto estándar',
    email_: {
      subject: 'Aegryn · Hemos recibido su solicitud', kicker: 'Solicitud recibida',
      greeting: n => `Buenos días ${n},`,
      intro: 'Hemos recibido su solicitud. Este es el resumen:',
      recap: 'Resumen', request: 'Su solicitud', revenue: 'Facturación anual', sector: 'Sector', yourAnswer: 'Su respuesta',
      next: 'Un experto de la red Aegryn, con nombre y responsable de su perímetro, está revisando su solicitud y le responderá en breve.',
      reply: 'Puede completar su solicitud respondiendo simplemente a este correo.',
      sign: 'Aegryn · Suiza',
      headerSubtitle: 'Firma de consultoría integrada', footnote: 'Recibe este correo porque ha enviado una solicitud en aegryn.com.',
    },
  },
  nl: {
    name: 'Voor- en achternaam', email: 'Zakelijk e-mailadres',
    revenueLabel: 'Jaaromzet', revenuePlaceholder: 'Kiezen',
    sectorLabel: 'Sector', sectorPlaceholder: 'Kiezen',
    newsletterLabel: 'Ik ontvang graag de Built to Last-nieuwsbrief (marktanalyses, geen prospectie).',
    submit: 'Aanvraag versturen', sending: 'Bezig met verzenden…',
    successTitle: 'Ontvangen.', successDesc: 'Een expert neemt binnenkort contact met u op.',
    error: 'Er is iets misgegaan. Probeer het opnieuw of mail ons rechtstreeks op',
    backToGeneral: 'Algemene vraag? Gebruik het standaard contactformulier',
    email_: {
      subject: 'Aegryn · Uw aanvraag is ontvangen', kicker: 'Aanvraag ontvangen',
      greeting: n => `Goedendag ${n},`,
      intro: 'Wij hebben uw aanvraag ontvangen. Hier is de samenvatting:',
      recap: 'Samenvatting', request: 'Uw aanvraag', revenue: 'Jaaromzet', sector: 'Sector', yourAnswer: 'Uw antwoord',
      next: 'Een met naam genoemde expert uit het Aegryn-netwerk, verantwoordelijk voor zijn domein, bekijkt uw aanvraag en neemt binnenkort contact met u op.',
      reply: 'U kunt uw aanvraag aanvullen door eenvoudig op deze e-mail te antwoorden.',
      sign: 'Aegryn · Zwitserland',
      headerSubtitle: 'Geïntegreerd adviesbureau', footnote: 'U ontvangt deze e-mail omdat u een aanvraag heeft ingediend op aegryn.com.',
    },
  },
}
