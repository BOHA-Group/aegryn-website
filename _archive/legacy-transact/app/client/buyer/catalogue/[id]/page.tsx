import { redirect } from 'next/navigation'

// Accès direct aux actifs non disponible.
// Les opportunités sont transmises confidentiellement après sélection et NDA.
export default function BuyerAssetPage() {
  redirect('/client/buyer')
}
