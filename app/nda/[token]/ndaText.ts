import type { NdaLang } from '@/lib/nda/template'

export const NDA_PAGE: Record<NdaLang, {
  banner: string; stepRead: string; stepSign: string; stepLabel: string; intro: string
  signTitle: string; signIntro: string; forAegryn: string; theSignatory: string
  autoCounter: string; autoCounterNote: string; yourSignature: string
  nameLabel: string; nameHelp: string; accept: string
  submit: string; signing: string; error: string; errorExpired: string
  needName: string; needAccept: string
  signedTitle: string; signedText: string; download: string; ref: string; signedOn: string
  expiredTitle: string; expiredText: string; revokedTitle: string; revokedText: string
  invalidTitle: string; invalidText: string; unavailableTitle: string; unavailableText: string
  contact: string; validUntil: string; yourProfiles: string; version: string
}> = {
  fr: {
    banner: 'Accord de confidentialité',
    stepRead: '1. Lire l’accord', stepSign: '2. Signer en bas de page', stepLabel: 'Étape 2 sur 2',
    intro: 'Lisez l’accord ci-dessous, puis signez en bas de page. Aucun compte n’est nécessaire. Vous recevrez votre exemplaire signé en PDF.',
    signTitle: 'Signature de l’accord',
    signIntro: 'L’accord est conclu lorsque vous signez. Aegryn contresigne automatiquement au même instant.',
    forAegryn: 'Pour Aegryn', theSignatory: 'Le Signataire',
    autoCounter: 'Contresignature automatique', autoCounterNote: 'Apposée à l’instant de votre signature.',
    yourSignature: 'Votre signature',
    nameLabel: 'Votre nom complet',
    nameHelp: 'Saisissez votre nom tel qu’il doit figurer sur l’accord.',
    accept: 'J’ai lu l’accord et je l’accepte. Je comprends que cette acceptation vaut signature électronique, horodatée et conservée à titre de preuve.',
    submit: 'Signer l’accord', signing: 'Signature en cours...',
    error: 'La signature n’a pas pu être enregistrée. Réessayez ou écrivez-nous.',
    errorExpired: 'Ce lien a expiré ou n’est plus valide.',
    needName: 'Saisissez votre nom complet pour signer.', needAccept: 'Cochez la case d’acceptation pour signer.',
    signedTitle: 'Accord signé',
    signedText: 'Votre accord est signé et contresigné par Aegryn. Un exemplaire PDF vous est envoyé par e-mail.',
    download: 'Télécharger mon exemplaire (PDF)', ref: 'Référence', signedOn: 'Signé le',
    expiredTitle: 'Lien expiré', expiredText: 'Ce lien n’est plus valable. Écrivez-nous pour recevoir un nouveau lien.',
    revokedTitle: 'Lien révoqué', revokedText: 'Ce lien n’est plus valide. Écrivez-nous si vous pensez qu’il s’agit d’une erreur.',
    invalidTitle: 'Lien invalide', invalidText: 'Ce lien n’existe pas ou est incomplet. Vérifiez l’adresse reçue par e-mail.',
    unavailableTitle: 'Signature momentanément indisponible', unavailableText: 'Le service n’est pas disponible pour le moment. Écrivez-nous et nous revenons vers vous.',
    contact: 'contact@boha-group.com', validUntil: 'Lien valable jusqu’au', yourProfiles: 'Votre profil', version: 'Version',
  },
  en: {
    banner: 'Confidentiality agreement',
    stepRead: '1. Read the agreement', stepSign: '2. Sign at the bottom of the page', stepLabel: 'Step 2 of 2',
    intro: 'Read the agreement below, then sign at the bottom of the page. No account is needed. You will receive your signed copy as a PDF.',
    signTitle: 'Signing the agreement',
    signIntro: 'The agreement is concluded when you sign. Aegryn countersigns automatically at the same moment.',
    forAegryn: 'For Aegryn', theSignatory: 'The Signatory',
    autoCounter: 'Automatic countersignature', autoCounterNote: 'Applied at the moment you sign.',
    yourSignature: 'Your signature',
    nameLabel: 'Your full name',
    nameHelp: 'Enter your name as it should appear on the agreement.',
    accept: 'I have read the agreement and I accept it. I understand that this acceptance constitutes an electronic signature, time-stamped and kept as evidence.',
    submit: 'Sign the agreement', signing: 'Signing...',
    error: 'The signature could not be recorded. Please try again or write to us.',
    errorExpired: 'This link has expired or is no longer valid.',
    needName: 'Enter your full name to sign.', needAccept: 'Tick the acceptance box to sign.',
    signedTitle: 'Agreement signed',
    signedText: 'Your agreement is signed and countersigned by Aegryn. A PDF copy is being sent to you by e-mail.',
    download: 'Download my copy (PDF)', ref: 'Reference', signedOn: 'Signed on',
    expiredTitle: 'Link expired', expiredText: 'This link is no longer valid. Write to us to receive a new link.',
    revokedTitle: 'Link revoked', revokedText: 'This link is no longer valid. Write to us if you think this is a mistake.',
    invalidTitle: 'Invalid link', invalidText: 'This link does not exist or is incomplete. Check the address you received by e-mail.',
    unavailableTitle: 'Signing temporarily unavailable', unavailableText: 'The service is not available right now. Write to us and we will get back to you.',
    contact: 'contact@boha-group.com', validUntil: 'Link valid until', yourProfiles: 'Your profile', version: 'Version',
  },
}
