import { redirect } from 'next/navigation'

/* Reliquat Aegryn TRANSACT (demandes d'accès dossier enchères) — archivé.
   L'espace acquéreur sera reconstruit avec la future data room
   acquisition/cession ; l'espace client neutre reprend le relais. */
export default function ClientAuctionPage() {
  redirect('/client/account')
}
