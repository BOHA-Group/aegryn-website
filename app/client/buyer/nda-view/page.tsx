import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Shield, CheckCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'
import { NDA_VERSIONS } from '@/lib/ndaVersions'
import LockedSection from '@/app/client/LockedSection'

export default async function NdaViewPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Accord de confidentialité" />
}
