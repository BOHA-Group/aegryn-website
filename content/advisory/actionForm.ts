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
  },
}
