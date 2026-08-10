import { checkAdminAccess } from '@/lib/adminAuth'
import type { Metadata } from 'next'
import Link              from 'next/link'

export const metadata: Metadata = {
  title: 'Paramètres — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  await checkAdminAccess(params.token)

  const tokenQs = params.token ? `?token=${params.token}` : ''

  const sections = [
    { title: 'Documents légaux',  desc: 'CGV, mentions légales, politique de confidentialité', href: `/admin/settings/legal${tokenQs}` },
    { title: 'Templates emails',  desc: 'Emails transactionnels (Resend) — invitations, notifications', href: `/admin/settings/emails${tokenQs}` },
    { title: 'Benchmark marché',  desc: 'Mise à jour des données de benchmark_data', href: `/admin/settings/benchmark${tokenQs}` },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Paramètres</h1>
          </div>
          <Link href={`/admin${tokenQs}`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Dashboard
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {sections.map(s => (
            <Link key={s.title} href={s.href} className="bg-white border border-gray-200 p-6 hover:border-gray-400 transition-colors">
              <p className="font-semibold text-gray-800 text-[14px]">{s.title}</p>
              <p className="text-[12px] text-gray-400 mt-1">{s.desc}</p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
