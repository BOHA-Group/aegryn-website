import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import CreateMandateForm from './CreateMandateForm'

export const metadata: Metadata = {
  title: 'Créer un mandat — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminCreateMandatePage({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await paramsPromise
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa = createServiceClient()

  const { data: profile } = await supa.from('profiles').select('id, full_name, email').eq('id', id).maybeSingle()
  if (!profile) notFound()

  const { data: assets } = await supa
    .from('assets')
    .select('id, name')
    .order('name', { ascending: true })

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/admin/partners/${id}`}
          className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block"
        >
          ← Retour au partenaire
        </Link>

        <div className="mb-8">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn Admin · CAS 3</p>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Créer un mandat client</h1>
          <p className="text-[12px] text-gray-400 mt-1">
            Pour <strong>{String(profile.full_name ?? profile.email)}</strong> — le partenaire facture son client directement et reverse 15% à Aegryn.
          </p>
        </div>

        <CreateMandateForm
          partnerId={id}
          assets={(assets ?? []) as { id: string; name: string }[]}
          backHref={`/admin/partners/${id}`}
        />
      </div>
    </main>
  )
}
