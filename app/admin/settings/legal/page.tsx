import { checkAdminAccess } from '@/lib/adminAuth'
import type { Metadata } from 'next'
import Link              from 'next/link'

export const metadata: Metadata = { title: 'Documents légaux — Aegryn Admin', robots: { index: false, follow: false } }

export default async function AdminSettingsLegalPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href={`/admin/settings`} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block">← Retour aux paramètres</Link>
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight mb-6">Documents légaux</h1>
        <div className="bg-white border border-gray-200 p-8 text-[13px] text-gray-500">
          Les CGV, mentions légales et politique de confidentialité sont actuellement gérées directement dans le code
          (<code className="font-mono text-[11px] bg-gray-100 px-1.5 py-0.5">app/[locale]/legal/*</code>). Une interface d'édition
          pourra être ajoutée ici dans une itération suivante.
        </div>
      </div>
    </main>
  )
}
