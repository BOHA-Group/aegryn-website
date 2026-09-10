import { redirect } from 'next/navigation'

// Le catalogue offmarket n'est plus accessible directement.
// Les opportunités sont transmises de façon confidentielle et individuelle
// après NDA signé et sélection du profil par Aegryn.
export default function BuyerCataloguePage() {
  redirect('/client/buyer')
}
