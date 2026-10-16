import type { Metadata } from 'next'
import { redirect }     from 'next/navigation'
import { getUser }      from '@/lib/supabaseServer'

export const metadata: Metadata = {
  title: 'Subscription — Partner Space Aegryn',
  robots: { index: false, follow: false },
}

/* MASQUÉ 2026-09-03 — Abonnement Fiche Expert 89€/mois (Stripe)
   Code complet : git show HEAD~3:app/client/partner/subscription/page.tsx
   Voir docs/parking-lot.md § "Fiche Expert & Abonnement partenaire"
   Pour réactiver : restaurer le code original + décommenter PartnerNav.tsx lignes 21-22 */
export default async function PartnerSubscriptionPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')
  redirect('/client/partner')
}
