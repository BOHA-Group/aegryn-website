import { createServiceClient } from '@/lib/supabase'
import { Mail, User, Calendar, MapPin } from 'lucide-react'

type Lead = {
  id: string
  first_name: string
  last_name: string
  email: string
  consent_given: boolean
  consent_at: string | null
  filter_category: string | null
  filter_domain: string | null
  filter_specialty: string | null
  filter_country: string | null
  created_at: string
  expert_profiles: {
    first_name: string
    last_name: string
    profession: string
  } | null
}

export default async function ExpertLeadsPage() {
  const supa = createServiceClient()

  const { data: leads } = await supa
    .from('expert_contact_leads')
    .select(`
      id,
      first_name,
      last_name,
      email,
      consent_given,
      consent_at,
      filter_category,
      filter_domain,
      filter_specialty,
      filter_country,
      created_at,
      expert_profiles(first_name, last_name, profession)
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  const { data: stats } = await supa
    .from('expert_lead_stats')
    .select('*')
    .limit(20)

  const rows = (leads ?? []) as unknown as Lead[]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Leads experts</h1>
        <p className="text-sm text-gray-500">
          Demandeurs ayant consenti au partage de leurs données pour contacter un expert.
        </p>
      </div>

      {/* KPI par expert */}
      {stats && stats.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Top experts — leads reçus</h2>
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Expert</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Profession</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">7 j</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">30 j</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Dernier lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.map((s: Record<string, unknown>) => (
                  <tr key={s.expert_id as string} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {s.expert_first_name as string} {s.expert_last_name as string}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{s.profession as string}</td>
                    <td className="px-4 py-3 text-center font-bold text-gray-900">{s.total_leads as number}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{s.leads_7d as number}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{s.leads_30d as number}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {s.last_lead_at ? new Date(s.last_lead_at as string).toLocaleDateString('fr-FR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Liste complète des leads */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Tous les leads ({rows.length})
      </h2>
      {rows.length === 0 ? (
        <div className="border border-gray-200 bg-gray-50 p-12 text-center text-gray-400 text-sm">
          Aucun lead enregistré pour l'instant.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Demandeur</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Expert contacté</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Consent</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Filtres actifs</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(lead => {
                const expert = lead.expert_profiles
                const filters = [
                  lead.filter_category,
                  lead.filter_domain,
                  lead.filter_specialty,
                  lead.filter_country,
                ].filter(Boolean)

                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-900">
                          {lead.first_name} {lead.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                        <Mail size={11} /> {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {expert
                        ? <><span className="font-medium">{expert.first_name} {expert.last_name}</span><br /><span className="text-xs text-gray-400">{expert.profession}</span></>
                        : <span className="text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {lead.consent_given
                        ? <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">Oui</span>
                        : <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded">Non</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {filters.length > 0
                        ? <div className="flex flex-wrap gap-1">
                            {filters.map((f, i) => (
                              <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-mono rounded">
                                <MapPin size={8} /> {f}
                              </span>
                            ))}
                          </div>
                        : <span className="text-gray-300 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(lead.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {lead.consent_at && (
                        <div className="text-[10px] text-green-500 mt-0.5">
                          Consent à {new Date(lead.consent_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
