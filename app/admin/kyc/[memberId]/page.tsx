import { checkAdminAccess }    from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Dossier KYC — AEGRYN Admin',
  robots: { index: false, follow: false },
}

const DOC_LABELS: Record<string, string> = {
  id_card:                 'Pièce d\'identité',
  proof_of_address:        'Justificatif de domicile',
  proof_of_funds:          'Justificatif de capacité financière',
  kbis:                    'Kbis / extrait registre',
  articles_of_association: 'Statuts',
  director_id:             'Pièce d\'identité dirigeant',
  delegation:               'Délégation de signature',
  ubo:                      'UBO — Bénéficiaire effectif',
  regulatory_approval:      'Agrément régulateur',
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function AdminKycMemberPage({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ memberId: string }>
  searchParams: Promise<{ token?: string; action?: string; docId?: string; status?: string; reason?: string; global?: string }>
}) {
  const { memberId } = await paramsPromise
  const params       = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  /* ── Actions ── */
  if (params.action === 'doc' && params.docId && params.status) {
    const update: Record<string, unknown> = {
      status:       params.status,
      validated_by: 'admin',
      validated_at: new Date().toISOString(),
    }
    if (params.status === 'rejected' && params.reason) update.rejection_reason = params.reason
    await supa.from('kyc_documents').update(update).eq('id', params.docId)
    redirect(`/admin/kyc/${memberId}${tokenQs}`)
  }

  if (params.action === 'global' && params.global) {
    await supa.from('buyer_kyc_verifications').update({
      kyc_status:  params.global,
      reviewed_by: 'admin',
      reviewed_at: new Date().toISOString(),
    }).eq('user_id', memberId)
    redirect(`/admin/kyc/${memberId}${tokenQs}`)
  }

  const [{ data: kyc }, { data: docs }] = await Promise.all([
    supa.from('buyer_kyc_verifications').select('*').eq('user_id', memberId).maybeSingle(),
    supa.from('kyc_documents').select('*').eq('user_id', memberId).order('created_at', { ascending: true }),
  ])

  const documents = (docs ?? []) as Record<string, unknown>[]
  const validatedCount = documents.filter(d => d.status === 'validated').length
  const progress = documents.length ? Math.round((validatedCount / documents.length) * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        <Link href={`/admin/kyc${tokenQs}`} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block">
          ← Retour à la file KYC
        </Link>

        <div className="mb-8">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">DOSSIER KYC</p>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
            {String(kyc?.full_name ?? 'Membre')} {kyc?.company_name ? `— ${String(kyc.company_name)}` : ''}
          </h1>
          <p className="text-[12px] text-gray-400 mt-1 font-mono">{memberId}</p>
        </div>

        {/* Barre de progression */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Progression KYC</p>
            <p className="text-[11px] font-mono text-gray-500">{progress}% — {documents.length - validatedCount} document(s) restant(s)</p>
          </div>
          <div className="w-full h-2 bg-gray-100">
            <div className="h-2 bg-emerald-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-3 mt-5">
            <p className="text-[11px] text-gray-500">Statut global :</p>
            <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-gray-100 text-gray-700">
              {String(kyc?.kyc_status ?? 'pending')}
            </span>
            <div className="flex gap-2 ml-auto">
              {['in_review', 'approved', 'rejected'].map(s => (
                <Link key={s}
                  href={`/admin/kyc/${memberId}?action=global&global=${s}${params.token ? `&token=${params.token}` : ''}`}
                  className="text-[10px] font-semibold text-gray-600 border border-gray-300 px-3 py-1.5 hover:border-gray-500 transition-colors">
                  {s === 'in_review' ? 'Passer en revue' : s === 'approved' ? 'Approuver le dossier' : 'Rejeter le dossier'}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          <div className="px-6 py-4 bg-gray-50">
            <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Documents ({documents.length})</p>
          </div>
          {documents.length === 0 ? (
            <div className="p-10 text-center text-[12px] text-gray-400">
              Aucun document soumis pour le moment.
            </div>
          ) : documents.map((d) => (
            <div key={String(d.id)} className="px-6 py-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-[13px]">
                  {DOC_LABELS[String(d.doc_type)] ?? String(d.doc_type)}
                </p>
                {d.doc_type === 'ubo' && (
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {String(d.ubo_full_name ?? '—')} — {d.ubo_ownership_pct ? `${d.ubo_ownership_pct}%` : '—'} — {String(d.ubo_nationality ?? '—')}
                  </p>
                )}
                {typeof d.expires_at === 'string' && (
                  <p className="text-[10px] text-orange-500 mt-0.5 font-mono">Expire le {fmtDate(d.expires_at)}</p>
                )}
                {d.status === 'rejected' && Boolean(d.rejection_reason) && (
                  <p className="text-[11px] text-red-500 mt-1">Motif : {String(d.rejection_reason)}</p>
                )}
                {d.file_url ? (
                  <a href={String(d.file_url)} target="_blank" rel="noopener" className="text-[10px] text-blue-500 hover:underline mt-1 inline-block">
                    Voir le document ↗
                  </a>
                ) : (
                  <p className="text-[10px] text-gray-300 mt-1">Aucun fichier lié</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                  d.status === 'validated' ? 'bg-emerald-50 text-emerald-700'
                  : d.status === 'rejected' ? 'bg-red-50 text-red-600'
                  : d.status === 'expired'  ? 'bg-orange-50 text-orange-600'
                  : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {String(d.status)}
                </span>
                <div className="flex gap-1.5">
                  <Link href={`/admin/kyc/${memberId}?action=doc&docId=${d.id}&status=validated${params.token ? `&token=${params.token}` : ''}`}
                    className="text-[10px] font-semibold text-emerald-600 border border-emerald-200 px-2 py-1 hover:border-emerald-400 transition-colors">
                    Valider
                  </Link>
                  <Link href={`/admin/kyc/${memberId}?action=doc&docId=${d.id}&status=rejected&reason=Document%20illisible${params.token ? `&token=${params.token}` : ''}`}
                    className="text-[10px] font-semibold text-red-500 border border-red-200 px-2 py-1 hover:border-red-400 transition-colors">
                    Rejeter
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 text-[11px] text-blue-600">
          <strong>Process manuel :</strong> le membre uploade ses documents depuis son profil KYC. Chaque document est validé
          ou rejeté (avec motif transmis par email). Une fois tous les documents requis validés, le dossier global peut être approuvé.
        </div>

      </div>
    </main>
  )
}
