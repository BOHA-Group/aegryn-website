import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Certifications — Partner Space Aegryn',
  robots: { index: false, follow: false },
}

export default async function PartnerCertificationsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Co-signatures CIFSO" />
}
