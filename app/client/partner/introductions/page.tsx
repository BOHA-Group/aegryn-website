import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Introductions — Partner Space Aegryn',
  robots: { index: false, follow: false },
}

export default async function PartnerIntroductionsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Introductions" />
}
