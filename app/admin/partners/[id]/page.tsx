import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { notFound }  from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import CertValidation          from './CertValidation'
import DeletePartnerButton     from './DeletePartnerButton'

export const metadata: Metadata = {
  title: 'Partenaire — AEGRYN Admin',
  robots: { index: false, follow: false },
}

export default async function AdminPartnerDetailPage({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id }  = await paramsPromise
  const params  = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const { data: profile, error } = await supa.from('profiles').select('*').eq('id', id).maybeSingle()
  if (!profile && !error) notFound()

  const [{ data: certs }, { data: refs }, { data: comms }, { data: mandates }, { data: kycDocs }] = await Promise.all([
    supa.from('partner_certifications').select('id, dimension, status, score, subcodes, observations, deadline_at, cosignature_amount_chf, assets(company_name, official_grade)').eq('partner_id', id).order('created_at', { ascending: false }),
    supa.from('introductions').select('*').eq('partner_id', id).order('created_at', { ascending: false }),
    supa.from('commissions').select('*').eq('partner_id', id).order('created_at', { ascending: false }),
    supa.from('partner_mandates').select('id, client_name, mandate_type, status, retrocession_pct, created_at').eq('partner_id', id).order('created_at', { ascending: false }),
    supa.from('kyc_documents').select('id, doc_type, status, created_at').eq('user_id', id).order('created_at', { ascending: false }),
  ])

  const DOC_LABELS: Record<string, string> = {
    id_card: 'Pièce d\'identité', proof_of_address: 'Justificatif domicile',
    kbis: 'Kbis', articles_of_association: 'Statuts',
    director_id: 'Identité dirigeants', ubo: 'UBO', professional_insurance: 'RC Pro',
  }
  const kycPending = (kycDocs ?? []).filter((d: Record<string, unknown>) => d.status === 'pending').length

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        <Link href={`/admin/partners${tokenQs}`} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block">
          ← Retour aux partenaires
        </Link>

        {error || !profile ? (
          <div className="bg-red-50 border border-red-200 p-4 text-[12px] text-red-700">Partenaire introuvable.</div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">PARTENAIRE ALLIANCE</p>
                <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">{String(profile.full_name ?? '—')}</h1>
                <p className="text-[12px] text-gray-400 mt-1">{String(profile.email ?? '')}</p>
              </div>

              {/* Actions rapides */}
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/admin/assets${tokenQs}`}
                  className="border border-gray-300 text-gray-600 text-[10px] font-semibold uppercase tracking-wide px-3 py-2 hover:border-gray-500 transition-colors"
                  title="Aller sur un actif pour assigner une co-certification CAS 1"
                >
                  + Assignation CIFS
                </Link>
                <Link
                  href={`/admin/partners/${id}/create-mandate${tokenQs}`}
                  className="bg-gray-900 text-white text-[10px] font-semibold uppercase tracking-wide px-3 py-2 hover:bg-gray-700 transition-colors"
                >
                  + Mandat client
                </Link>
              </div>
            </div>

            {/* Certifications assignées — avec validation inline */}
            <CertValidation
              certs={(certs ?? []) as Parameters<typeof CertValidation>[0]['certs']}
              adminToken={params.token ?? ''}
            />

            {/* Apports d'affaires */}
            <div className="bg-white border border-gray-200 mb-6">
              <div className="px-6 py-4 bg-gray-50"><p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Apports d'affaires ({(refs ?? []).length})</p></div>
              {(refs ?? []).length === 0 ? (
                <div className="p-8 text-center text-[12px] text-gray-400">Aucun apport référencé.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {(refs ?? []).map((r: Record<string, unknown>) => (
                    <div key={String(r.id)} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 text-[13px]">{String(r.contact_name)} — {String(r.introduction_type) === 'asset' ? 'Actif' : 'Acquéreur'}</p>
                        <p className="text-[11px] text-gray-400">{String(r.contact_email)}</p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-gray-100 text-gray-700">{String(r.introduction_status)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mandats clients CAS 3 */}
            <div className="bg-white border border-gray-200 mb-6">
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Mandats clients — CAS 3 ({(mandates ?? []).length})</p>
                <Link
                  href={`/admin/partners/${id}/create-mandate${tokenQs}`}
                  className="text-[10px] text-gray-400 hover:text-gray-700"
                >
                  + Nouveau →
                </Link>
              </div>
              {(mandates ?? []).length === 0 ? (
                <div className="p-8 text-center text-[12px] text-gray-400">Aucun mandat. Le partenaire facture son client directement et reverse 15% à AEGRYN.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {(mandates ?? []).map((m: Record<string, unknown>) => (
                    <div key={String(m.id)} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 text-[13px]">{String(m.client_name)}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{String(m.mandate_type)} · rétrocession {String(m.retrocession_pct)}%</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                        m.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        m.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-600'
                      }`}>{String(m.status)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documents KYC */}
            <div className="bg-white border border-gray-200 mb-6">
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                    Documents KYC ({(kycDocs ?? []).length})
                  </p>
                  {kycPending > 0 && (
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200">
                      {kycPending} en attente
                    </span>
                  )}
                </div>
                <Link
                  href={`/admin/kyc/${id}${tokenQs}`}
                  className="text-[10px] font-semibold text-gray-400 hover:text-gray-700"
                >
                  Ouvrir dossier KYC complet →
                </Link>
              </div>
              {(kycDocs ?? []).length === 0 ? (
                <div className="p-8 text-center text-[12px] text-gray-400">Aucun document KYC soumis.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {(kycDocs ?? []).map((d: Record<string, unknown>) => (
                    <div key={String(d.id)} className="px-6 py-3 flex items-center justify-between">
                      <p className="text-[12px] text-gray-700">{DOC_LABELS[String(d.doc_type)] ?? String(d.doc_type)}</p>
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                        d.status === 'validated' ? 'bg-emerald-50 text-emerald-700'
                        : d.status === 'rejected' ? 'bg-red-50 text-red-600'
                        : 'bg-yellow-50 text-yellow-700'
                      }`}>{String(d.status)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commissions */}
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Commissions ({(comms ?? []).length})</p>
                <Link href={`/admin/commissions${tokenQs}`} className="text-[10px] text-gray-400 hover:text-gray-700">Voir toutes →</Link>
              </div>
              {(comms ?? []).length === 0 ? (
                <div className="p-8 text-center text-[12px] text-gray-400">Aucune commission.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {(comms ?? []).map((c: Record<string, unknown>) => (
                    <div key={String(c.id)} className="px-6 py-4 flex items-center justify-between">
                      <p className="text-[12px] text-gray-700">{String(c.type)}</p>
                      <p className="font-mono text-[12px] text-gray-700">{c.amount_chf ? `${c.amount_chf} CHF` : '—'}</p>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-gray-100 text-gray-700">{String(c.status)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Zone de danger */}
        <DeletePartnerButton partnerId={id} tokenQs={tokenQs} />

      </div>
    </main>
  )
}
