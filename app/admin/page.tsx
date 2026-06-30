import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Admin — AEGRYN',
  robots: { index: false, follow: false },
}

export default async function AdminIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  /* Counts rapides */
  const [
    { count: assetsNew },
    { count: assetsGraded },
    { count: ndaPending },
    { count: valLeads },
  ] = await Promise.all([
    supa.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
    supa.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'graded'),
    supa.from('nda_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supa.from('valuation_leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const modules = [
    {
      href:    `/admin/assets${tokenQs}`,
      title:   'Assets',
      desc:    'Pipeline de certification — soumissions à grader',
      badge:   assetsNew ?? 0,
      badgeLabel: 'soumis',
      color:   'border-blue-200 hover:border-blue-400',
    },
    {
      href:    `/admin/assets${tokenQs}`,
      title:   'Grading',
      desc:    `${assetsGraded ?? 0} actif${(assetsGraded ?? 0) > 1 ? 's' : ''} gradé${(assetsGraded ?? 0) > 1 ? 's' : ''} en attente de publication`,
      badge:   assetsGraded ?? 0,
      badgeLabel: 'gradés',
      color:   'border-purple-200 hover:border-purple-400',
    },
    {
      href:    `/admin/catalog${tokenQs}`,
      title:   'Catalogue',
      desc:    'Publication et gestion des actifs visibles acquéreurs',
      badge:   null,
      badgeLabel: '',
      color:   'border-emerald-200 hover:border-emerald-400',
    },
    {
      href:    `/admin/members${tokenQs}`,
      title:   'Members — NDA',
      desc:    'Qualification des acquéreurs et suivi NDA',
      badge:   ndaPending ?? 0,
      badgeLabel: 'en attente',
      color:   'border-yellow-200 hover:border-yellow-400',
    },
    {
      href:    `/admin/leads${tokenQs}`,
      title:   'Leads',
      desc:    'Valuation, catalog waitlist, assessment days, alliances',
      badge:   valLeads ?? 0,
      badgeLabel: 'nouveaux',
      color:   'border-gray-200 hover:border-gray-400',
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">AEGRYN</p>
          <h1 className="text-[30px] font-bold text-gray-900 tracking-tight">Admin</h1>
          <p className="text-[12px] text-gray-400 mt-1">
            {new Date().toLocaleDateString('fr-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(m => (
            <Link
              key={m.title}
              href={m.href}
              className={`bg-white border p-6 flex flex-col gap-3 transition-colors ${m.color}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-sans font-bold text-gray-900 text-[15px]">{m.title}</h2>
                {m.badge != null && m.badge > 0 && (
                  <span className="bg-red-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 shrink-0">
                    {m.badge} {m.badgeLabel}
                  </span>
                )}
              </div>
              <p className="font-sans text-[12px] text-gray-500 leading-relaxed">{m.desc}</p>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-300 mt-auto">
                Ouvrir →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-300 mb-3">Liens rapides</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: '/grade/submit',      href: '/grade/submit' },
              { label: '/auction/catalog',   href: '/auction/catalog' },
              { label: '/valuation',         href: '/valuation' },
              { label: '/client/login',      href: '/client/login' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener"
                className="font-mono text-[10px] text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 hover:border-gray-400 transition-colors">
                {label} ↗
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
