import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import NewIntroductionForm from './NewIntroductionForm'
import IntroductionsList from './IntroductionsList'
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
