import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Shield, CheckCircle } from 'lucide-react'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS } from '@/lib/ndaVersions'
import Link from 'next/link'
import LockedSection from '@/app/client/LockedSection'

export default async function SellerNdaViewPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Accord de confidentialité" />
}
