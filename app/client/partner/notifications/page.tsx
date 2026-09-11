import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Bell } from 'lucide-react'
import PartnerNotificationsClient from './PartnerNotificationsClient'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Notifications — Partner Space Aegryn',
  robots: { index: false, follow: false },
}

export type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  payload: Record<string, unknown>
  read_at: string | null
  dismissed_at: string | null
  created_at: string
}

export default async function PartnerNotificationsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Notifications" />
}
