import type { NdaLang } from '@/lib/nda/template'

export const NDA_PAGE: Record<NdaLang, {
  kicker: string; intro: string; nameLabel: string; nameHelp: string; accept: string
  submit: string; signing: string; error: string; errorExpired: string; errorName: string
  signedTitle: string; signedText: string; download: string; ref: string; signedOn: string
  expiredTitle: string; expiredText: string; revokedTitle: string; revokedText: string
  invalidTitle: string; invalidText: string; unavailableTitle: string; unavailableText: string
  contact: string; validUntil: string; yourProfiles: string
}> = {
  fr: {
    kicker: 'Accord de confidentialité',
    intro: 'Lisez l’accord ci-dessous, puis signez en bas de page. Aucun compte n’est nécessaire. Vous recevrez votre exemplaire signé en PDF.',
    nameLabel: 'Votre nom complet (signature)',
    nameHelp: 'Saisissez votre nom tel qu’il doit figurer sur l’accord.',
    accept: 'J’ai lu l’accord et je l’accepte. Je comprends que cette acceptation vaut signature électronique, horodatée et conservée à titre de preuve.',
    submit: 'Signer l’accord', signing: 'Signature en cours...',
    error: 'La signature n’a pas pu être enregistrée. Réessayez ou écrivez-nous.',
    errorExpired: 'Ce lien a expiré ou n’est plus valide.', errorName: 'Saisissez votre nom complet.',
    signedTitle: 'Accord signé',
    signedText: 'Votre accord est signé et contresigné par Aegryn. Un exemplaire PDF vous est envoyé par e-mail.',
    download: 'Télécharger mon exemplaire (PDF)', ref: 'Référence', signedOn: 'Signé le',
    expiredTitle: 'Lien expiré', expiredText: 'Ce lien n’est plus valable. Écrivez-nous pour recevoir un nouveau lien.',
    revokedTitle: 'Lien révoqué', revokedText: 'Ce lien n’est plus valide. Écrivez-nous si vous pensez qu’il s’agit d’une erreur.',
    invalidTitle: 'Lien invalide', invalidText: 'Ce lien n’existe pas ou est incomplet. Vérifiez l’adresse reçue par e-mail.',
    unavailableTitle: 'Signature momentanément indisponible', unavailableText: 'Le service n’est pas disponible pour le moment. Écrivez-nous et nous revenons vers vous.',
    contact: 'contact@boha-group.com', validUntil: 'Lien valable jusqu’au', yourProfiles: 'Votre profil',
  },
  en: {
    kicker: 'Confidentiality agreement',
    intro: 'Read the agreement below, then sign at the bottom of the page. No account is needed. You will receive your signed copy as a PDF.',
    nameLabel: 'Your full name (signature)',
    nameHelp: 'Enter your name as it should appear on the agreement.',
    accept: 'I have read the agreement and I accept it. I understand that this acceptance constitutes an electronic signature, time-stamped and kept as evidence.',
    submit: 'Sign the agreement', signing: 'Signing...',
    error: 'The signature could not be recorded. Please try again or write to us.',
    errorExpired: 'This link has expired or is no longer valid.', errorName: 'Please enter your full name.',
    signedTitle: 'Agreement signed',
    signedText: 'Your agreement is signed and countersigned by Aegryn. A PDF copy is being sent to you by e-mail.',
    download: 'Download my copy (PDF)', ref: 'Reference', signedOn: 'Signed on',
    expiredTitle: 'Link expired', expiredText: 'This link is no longer valid. Write to us to receive a new link.',
    revokedTitle: 'Link revoked', revokedText: 'This link is no longer valid. Write to us if you think this is a mistake.',
    invalidTitle: 'Invalid link', invalidText: 'This link does not exist or is incomplete. Check the address you received by e-mail.',
    unavailableTitle: 'Signing temporarily unavailable', unavailableText: 'The service is not available right now. Write to us and we will get back to you.',
    contact: 'contact@boha-group.com', validUntil: 'Link valid until', yourProfiles: 'Your profile',
  },
}
