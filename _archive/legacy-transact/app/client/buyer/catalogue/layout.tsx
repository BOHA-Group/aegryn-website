/**
 * Layout guard pour /client/buyer/catalogue/*
 *
 * Vérifie que l'acheteur a signé le NDA catalog_general.
 * Si non → redirect vers /client/buyer/nda-required
 */

import { redirect } from 'next/navigation'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

export default async function CatalogueLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const { data: nda } = await supa
    .from('nda_signatures')
    .select('signed_at')
    .eq('buyer_id', user.id)
    .eq('scope', 'catalog_general')
    .not('signed_at', 'is', null)
    .maybeSingle()

  if (!nda) redirect('/client/buyer/nda-required')

  return <>{children}</>
}
