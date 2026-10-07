import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import { checkAdminAccess }   from '@/lib/adminAuth'

export const metadata: Metadata = {
  title: 'Talent | Aegryn Admin',
  robots: { index: false, follow: false },
}

const CYCLE_LABELS: Record<string, string> = {
  lancement: 'Lancement', croissance: 'Croissance', restructuration: 'Restructuration',
  acquisition: 'Acquisition', transmission: 'Transmission',
}
const FAMILY_LABELS: Record<string, string> = {
  general: 'Direction générale', finance: 'Finance', operations: 'Opérations',
  technology: 'Technologie', hr: 'RH', sales: 'Commercial', other: 'Autre',
}
const URGENCY_LABELS: Record<string, string> = {
  immediate: 'Immédiat', month: 'Ce mois', quarter: 'Ce trimestre', flexible: 'Flexible',
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'new'         ? 'bg-ag-apex/15 text-ag-apex-ink border-ag-apex/30' :
    status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                               'bg-ag-off-white text-ag-gray-light border-ag-border'
  const label = status === 'new' ? 'Nouveau' : status === 'in_progress' ? 'En cours' : 'Clôturé'
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${cls}`}>
      {label}
    </span>
  )
}

const th = 'px-4 py-2.5 text-left font-mono text-[9px] uppercase tracking-[0.18em] text-ag-gray-light font-semibold'
const td = 'px-4 py-3 font-sans text-[13px] text-ag-black align-top'

export default async function AdminTalentPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; view?: string }>
}) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa = createServiceClient()
  const view = params.view === 'hiring' ? 'hiring' : 'candidates'

  const [{ data: candidates, error: candErr }, { data: hiring, error: hireErr }] = await Promise.all([
    supa.from('talent_candidates')
      .select('id, full_name, email, phone, linkedin_url, cv_url, cv_filename, motivation, function_family, lifecycle_cycle, profile_type, country, availability, status, locale, created_at')
      .order('created_at', { ascending: false }).limit(200),
    supa.from('talent_hiring_requests')
      .select('id, company, contact_name, email, phone, role_title, role_description, location, budget_annual_chf, urgency, mission_type, lifecycle_cycle, confidential, company_size, status, locale, created_at')
      .order('created_at', { ascending: false }).limit(200),
  ])

  /* Liens signés (1 h) vers les CV du bucket privé talent-cvs */
  const cvLinks: Record<string, string> = {}
  await Promise.all((candidates ?? []).map(async c => {
    if (!c.cv_url) return
    const { data } = await supa.storage.from('talent-cvs').createSignedUrl(c.cv_url, 3600)
    if (data?.signedUrl) cvLinks[c.id] = data.signedUrl
  }))

  const tab = (v: string, label: string, count: number) => (
    <a
      href={`/admin/talent?view=${v}${params.token ? `&token=${params.token}` : ''}`}
      className={`rounded-lg px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] border transition-colors ${
        view === v ? 'bg-ag-navy text-white border-ag-navy' : 'bg-white text-ag-gray border-ag-border hover:border-ag-navy'
      }`}
    >
      {label} <span className="ml-1 text-ag-gray-light">{count}</span>
    </a>
  )

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('fr-CH', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-sans font-bold text-[22px] text-ag-black mb-1">Talent — vivier & mandats</h1>
      <p className="font-sans text-[13px] text-ag-gray mb-6">
        Candidatures déposées via /talent/candidats et besoins recruteurs via /talent/entreprises.
      </p>

      <div className="flex items-center gap-2 mb-6">
        {tab('candidates', 'Candidats', candidates?.length ?? 0)}
        {tab('hiring', 'Besoins recruteurs', hiring?.length ?? 0)}
      </div>

      {(candErr || hireErr) && (
        <p className="mb-4 text-[13px] text-red-600">{candErr?.message ?? hireErr?.message}</p>
      )}

      {view === 'candidates' && (
        <div className="border border-ag-border rounded-xl overflow-x-auto bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-ag-off-white border-b border-ag-border">
              <tr>
                <th className={th}>Candidat</th>
                <th className={th}>Fonction</th>
                <th className={th}>Type</th>
                <th className={th}>Cycle</th>
                <th className={th}>Pays</th>
                <th className={th}>CV</th>
                <th className={th}>Statut</th>
                <th className={th}>Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ag-border">
              {(candidates ?? []).map(c => (
                <tr key={c.id}>
                  <td className={td}>
                    <p className="font-semibold">{c.full_name}</p>
                    <p className="text-[12px] text-ag-gray-light">{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
                    {c.linkedin_url && <a href={c.linkedin_url} target="_blank" rel="noreferrer" className="text-[12px] text-ag-apex-ink hover:underline">LinkedIn</a>}
                    {(c.motivation || c.availability) && (
                      <details className="mt-1">
                        <summary className="text-[11px] text-ag-gray-light cursor-pointer">Motivation / dispo</summary>
                        <p className="text-[12px] text-ag-gray mt-1 whitespace-pre-line">{[c.motivation, c.availability].filter(Boolean).join('\n')}</p>
                      </details>
                    )}
                  </td>
                  <td className={td}>{FAMILY_LABELS[c.function_family ?? ''] ?? c.function_family ?? '—'}</td>
                  <td className={td}>{c.profile_type === 'transition' ? 'Transition' : c.profile_type === 'permanent' ? 'Permanent' : '—'}</td>
                  <td className={td}>{CYCLE_LABELS[c.lifecycle_cycle ?? ''] ?? '—'}</td>
                  <td className={td}>{c.country ?? '—'}</td>
                  <td className={td}>
                    {cvLinks[c.id]
                      ? <a href={cvLinks[c.id]} target="_blank" rel="noreferrer" className="text-ag-apex-ink hover:underline text-[12px]">{c.cv_filename ?? 'CV'}</a>
                      : '—'}
                  </td>
                  <td className={td}><StatusBadge status={c.status} /></td>
                  <td className={td}>{fmt(c.created_at)}</td>
                </tr>
              ))}
              {(candidates ?? []).length === 0 && (
                <tr><td colSpan={8} className={`${td} text-center text-ag-gray-light py-10`}>Aucune candidature pour le moment.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === 'hiring' && (
        <div className="border border-ag-border rounded-xl overflow-x-auto bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-ag-off-white border-b border-ag-border">
              <tr>
                <th className={th}>Entreprise</th>
                <th className={th}>Poste</th>
                <th className={th}>Mission</th>
                <th className={th}>Cycle</th>
                <th className={th}>Lieu</th>
                <th className={th}>Urgence</th>
                <th className={th}>Statut</th>
                <th className={th}>Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ag-border">
              {(hiring ?? []).map(h => (
                <tr key={h.id}>
                  <td className={td}>
                    <p className="font-semibold">{h.company}{h.confidential ? <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.1em] text-ag-beta">confidentiel</span> : null}</p>
                    <p className="text-[12px] text-ag-gray-light">{h.contact_name} · {h.email}{h.phone ? ` · ${h.phone}` : ''}</p>
                    {h.company_size && <p className="text-[11px] text-ag-gray-light">{h.company_size}</p>}
                  </td>
                  <td className={td}>
                    <p className="font-semibold">{h.role_title}</p>
                    <details className="mt-1">
                      <summary className="text-[11px] text-ag-gray-light cursor-pointer">Description</summary>
                      <p className="text-[12px] text-ag-gray mt-1 whitespace-pre-line max-w-md">{h.role_description}</p>
                    </details>
                    {h.budget_annual_chf && <p className="text-[11px] text-ag-gray-light mt-1">Budget : {h.budget_annual_chf}</p>}
                  </td>
                  <td className={td}>{h.mission_type === 'transition' ? 'Transition' : h.mission_type === 'permanent' ? 'Permanent' : '—'}</td>
                  <td className={td}>{CYCLE_LABELS[h.lifecycle_cycle ?? ''] ?? '—'}</td>
                  <td className={td}>{h.location}</td>
                  <td className={td}>{URGENCY_LABELS[h.urgency] ?? h.urgency}</td>
                  <td className={td}><StatusBadge status={h.status} /></td>
                  <td className={td}>{fmt(h.created_at)}</td>
                </tr>
              ))}
              {(hiring ?? []).length === 0 && (
                <tr><td colSpan={8} className={`${td} text-center text-ag-gray-light py-10`}>Aucun besoin recruteur pour le moment.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
