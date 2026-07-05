import { checkAdminAccess } from '@/lib/adminAuth'
import type { Metadata } from 'next'
import Link              from 'next/link'

export const metadata: Metadata = { title: 'Templates emails — AEGRYN Admin', robots: { index: false, follow: false } }

export default async function AdminSettingsEmailsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams
  await checkAdminAccess(params.token)
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const templates = [
    { name: 'Confirmation NDA',       source: 'app/api/nda/request/route.ts' },
    { name: 'Confirmation grading',   source: 'app/api/grade/submit/route.ts' },
    { name: 'Confirmation auction',   source: 'app/api/auction/submit/route.ts' },
    { name: 'Paiement Stripe confirmé', source: 'app/api/webhooks/stripe/route.ts' },
    { name: 'Lead capture',           source: 'lib/leadCapture.ts' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href={`/admin/settings${tokenQs}`} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block">← Retour aux paramètres</Link>
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight mb-2">Templates emails</h1>
        <p className="text-[12px] text-gray-400 mb-6">Envoyés via Resend, définis directement dans le code (pas d'éditeur WYSIWYG pour l'instant).</p>
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {templates.map(t => (
            <div key={t.name} className="px-6 py-4 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-gray-800">{t.name}</p>
              <code className="text-[11px] font-mono text-gray-400">{t.source}</code>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
