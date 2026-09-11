import type { Metadata }      from 'next'
import { redirect }            from 'next/navigation'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS }        from '@/lib/ndaVersions'
import { ShieldCheck }         from 'lucide-react'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Mon NDA Partenaire — Aegryn',
  robots: { index: false, follow: false },
}

export default async function PartnerNdaPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Accord de confidentialité" />
}
