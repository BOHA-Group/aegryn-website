import type { Metadata } from 'next'
import { redirect }     from 'next/navigation'
import { getUser }      from '@/lib/supabaseServer'

export const metadata: Metadata = {
  title: 'Fiche Expert — Espace Partenaire Aegryn',
  robots: { index: false, follow: false },
}

/* MASQUÉ 2026-09-03 — Publication fiche expert + abonnement 89€/mois
   Code complet : git show HEAD~3:app/client/partner/expert-profile/page.tsx
   Voir docs/parking-lot.md § "Fiche Expert & Abonnement partenaire"
   Pour réactiver : restaurer le code original + décommenter PartnerNav.tsx lignes 21-22 */
export default async function PartnerExpertProfilePage() {
  const user = await getUser()
  if (!user) redirect('/client/login')
  redirect('/client/partner')
}
