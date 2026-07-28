/**
 * Redirection permanente vers /client/partner/subscription
 * La page commissions partenaire a été supprimée — modèle abonnement mensuel.
 */
import { redirect } from 'next/navigation'

export default function PartnerCommissionsRedirect() {
  redirect('/client/partner/subscription')
}
