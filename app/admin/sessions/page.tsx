import { requireAdmin }    from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import Link                  from 'next/link'
import { ArrowUpRight, Plus, Calendar, Users, Layers } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  planning:  'Planification',
  confirmed: 'Confirmée',
  open:      'Ouverte',
  live:      'En cours',
  closed:    'Clôturée',
  published: 'Publiée',
}

const STATUS_COLORS: Record<string, string> = {
  planning:  'bg-gray-100 text-gray-600',
  confirmed: 'bg-blue-50 text-blue-700',
  open:      'bg-yellow-50 text-yellow-700',
  live:      'bg-green-50 text-green-700',
  closed:    'bg-orange-50 text-orange-700',
  published: 'bg-emerald-50 text-emerald-700',
}

const FORMAT_LABELS: Record<string, string> = {
  physical: 'Physique',
  digital:  'Digital',
  hybrid:   'Hybride',
}

export default async function AdminSessionsPage() {
  await requireAdmin()

  const supa = createServiceClient()
  const { data: sessions } = await supa
    .from('auction_sessions')
    .select('*')
    .order('session_date', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-sans text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
            ← Dashboard
          </Link>
          <span className="text-gray-200">|</span>
          <h1 className="font-sans font-bold text-gray-900 text-[15px]">Sessions Aegryn</h1>
        </div>
        <Link
          href="/admin/sessions/new"
          className="inline-flex items-center gap-2 bg-[#0A1D2E] text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-4 py-2 hover:bg-[#142d45] transition-colors"
        >
          <Plus size={12} /> Nouvelle session
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: sessions?.length ?? 0, icon: Layers },
            { label: 'En cours / Live', value: sessions?.filter(s => s.status === 'live').length ?? 0, icon: Calendar },
            { label: 'Ouvertes', value: sessions?.filter(s => s.status === 'open').length ?? 0, icon: ArrowUpRight },
            { label: 'Publiées', value: sessions?.filter(s => s.status === 'published').length ?? 0, icon: Users },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-gray-400">{stat.label}</p>
                  <Icon size={14} className="text-gray-300" />
                </div>
                <p className="font-sans font-bold text-gray-900 text-[24px]">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-sans font-semibold text-gray-900 text-[13px]">Toutes les sessions</h2>
          </div>

          {!sessions || sessions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Calendar size={28} className="text-gray-200 mx-auto mb-4" />
              <p className="font-sans text-[14px] text-gray-400 mb-2">Aucune session créée</p>
              <p className="font-sans text-[12px] text-gray-300">Créez votre première session Aegryn pour commencer.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Nom', 'Type', 'Date', 'Format', 'Statut', 'Lots', 'Actions'].map(col => (
                      <th key={col} className="text-left px-6 py-3 font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-gray-400">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => {
                    const lots = Array.isArray(session.lots) ? session.lots : []
                    return (
                      <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-sans font-semibold text-gray-900 text-[13px]">{session.name}</p>
                          {session.theme && (
                            <p className="font-sans text-[11px] text-gray-400 mt-0.5">{session.theme}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-sans text-[11px] text-gray-600 capitalize">
                            {session.type === 'main' ? 'Principale' : 'Thématique'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-sans text-[12px] text-gray-600">
                          {session.session_date
                            ? new Date(session.session_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td className="px-6 py-4 font-sans text-[12px] text-gray-600">
                          {FORMAT_LABELS[session.format] ?? session.format}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] ${STATUS_COLORS[session.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {STATUS_LABELS[session.status] ?? session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-sans font-semibold text-gray-900 text-[13px]">
                          {lots.length}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Link
                              href={`/admin/sessions/${session.id}`}
                              className="font-sans text-[11px] text-[#0A1D2E] hover:underline font-semibold"
                            >
                              Modifier
                            </Link>
                            <Link
                              href={`/admin/auction/lots`}
                              className="font-sans text-[11px] text-gray-500 hover:text-gray-800 transition-colors"
                            >
                              Lots
                            </Link>
                            {(session.status === 'closed' || session.status === 'published') && (
                              <Link
                                href={`/admin/sessions/${session.id}/results`}
                                className="font-sans text-[11px] text-emerald-600 hover:underline font-semibold"
                              >
                                Résultats
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
