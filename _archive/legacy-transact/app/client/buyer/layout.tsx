import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'

/* Espace acquéreur archivé : les workflows hérités du périmètre enchères
   (catalogue, sessions, offres, transactions, séquestre) ne font plus partie
   du positionnement public Aegryn.

   Le rôle 'buyer' est conservé en BDD : il resservira dans la future
   data room acquisition/cession (projets M&A / transmission), structurée
   séparément de la data room CIFSO.

   En attendant, tout profil est renvoyé vers son espace compte. */
export default async function BuyerLayout() {
  const user = await getUser()
  if (!user) redirect('/client/login')
  redirect('/client/account')
}
