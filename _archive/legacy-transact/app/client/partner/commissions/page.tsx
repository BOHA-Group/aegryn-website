/**
 * Redirection permanente vers /client/partner
 * La page commissions partenaire a été supprimée — modèle abonnement archivé.
 */
import { redirect } from 'next/navigation'

export default function PartnerCommissionsRedirect() {
  redirect('/client/partner')
}
