import { checkAdminAccess }    from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import SignedDocLink            from './SignedDocLink'
import DocActions               from './DocActions'
import { sendEmail, emailKycApproved } from '@/lib/sendEmail'
import { syncExpertVisibility } from '@/lib/expertVisibility'

export const metadata: Metadata = {
  title: 'Dossier KYC — Aegryn Admin',
  robots: { index: false, follow: false },
}

const DOC_LABELS: Record<string, string> = {
  id_card:                 'Pièce d\'identité',
  proof_of_address:        'Justificatif de domicile',
  proof_of_funds:          'Justificatif de capacité financière',
  kbis:                    'Kbis / extrait registre',
  articles_of_association: 'Statuts',
  director_id:             'Identité co-dirigeants / associés',
  delegation:              'Délégation de signature',
  ubo:                     'UBO — Bénéficiaire effectif',
  regulatory_approval:     'Agrément régulateur',
  asset_ownership:         'Justificatif de propriété de l\'actif',
  professional_insurance:  'RC Pro / Assurance professionnelle',
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

  /* ── Actions ── */
  if (params.action === 'doc' && params.docId && params.status) {
    const update: Record<string, unknown> = {
      status:       params.status,
      validated_by: 'admin',
      validated_at: new Date().toISOString(),
    }
    if (params.status === 'rejected' && params.reason) update.rejection_reason = params.reason
    await supa.from('kyc_documents').update(update).eq('id', params.docId)
    redirect(`/admin/kyc/${memberId}`)
  }

  if (params.action === 'global' && params.global) {
    const now = new Date().toISOString()
    await supa.from('buyer_kyc_verifications').update({
      kyc_status:  params.global,
      reviewed_by: 'admin',
      reviewed_at: now,
    }).eq('user_id', memberId)
    await supa.from('profiles').update({
      kyc_status: params.global,
    }).eq('id', memberId)

    await syncExpertVisibility(supa, memberId)

    /* Email final si approbation complète */
    if (params.global === 'approved') {
      const [{ data: memberProfile }, memberAuthData] = await Promise.all([
        supa.from('profiles').select('full_name, roles').eq('id', memberId).single(),
        supa.auth.admin.getUserById(memberId),
      ])
      const memberEmail = memberAuthData.data.user?.email
      if (memberEmail) {
        const roles: string[] = Array.isArray(memberProfile?.roles) ? memberProfile.roles : []
        const role: 'buyer' | 'seller' | 'partner' = roles.includes('partner') ? 'partner'
          : roles.includes('seller') ? 'seller'
          : 'buyer'
        const { subject, html } = emailKycApproved({
          memberName: memberProfile?.full_name ?? memberEmail,
          role,
        })
        await sendEmail(memberEmail, subject, html, 'kyc-approved')
      }
    }

    redirect(`/admin/kyc/${memberId}`)
  }

  const [{ data: kyc }, { data: docs }, { data: profile }] = await Promise.all([
    supa.from('buyer_kyc_verifications').select('*').eq('user_id', memberId).maybeSingle(),
    supa.from('kyc_documents').select('*').eq('user_id', memberId).order('created_at', { ascending: true }),
    supa.from('profiles').select('full_name, roles, kyc_status').eq('id', memberId).maybeSingle(),
  ])

  /* Rôle affiché dans l'en-tête */
  const roles: string[] = Array.isArray(profile?.roles) ? profile.roles : []
  const roleLabel = roles.includes('partner') ? 'Partenaire'
    : roles.includes('seller') ? 'Cédant'
    : roles.includes('buyer')  ? 'Acquéreur'
    : 'Membre'

  /* kyc_status sur profiles (source de vérité) */
  const profileKycStatus = (profile as { kyc_status?: string } | null)?.kyc_status ?? 'pending'

  const documents = (docs ?? []) as Record<string, unknown>[]
  const validatedCount = documents.filter(d => d.status === 'validated').length
  const progress = documents.length ? Math.round((validatedCount / documents.length) * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        <Link href={`/admin/kyc`} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block">
          ← Retour à la file KYC
        </Link>

        <div className="mb-8">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">DOSSIER KYC</p>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
            {String(kyc?.full_name ?? 'Membre')} {kyc?.company_name ? `— ${String(kyc.company_name)}` : ''}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">{roleLabel}</span>
            <p className="text-[11px] text-gray-300 font-mono">{memberId}</p>
          </div>
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
            <p className="text-[11px] text-gray-500">Statut profil :</p>
            <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
              profileKycStatus === 'approved' ? 'bg-emerald-50 text-emerald-700'
              : profileKycStatus === 'rejected' ? 'bg-red-50 text-red-600'
              : profileKycStatus === 'in_review' ? 'bg-blue-50 text-blue-700'
              : 'bg-yellow-50 text-yellow-700'
            }`}>
              {profileKycStatus}
            </span>
            <div className="flex gap-2 ml-auto">
              {['in_review', 'approved', 'rejected'].map(s => (
                <Link key={s}
                  href={`/admin/kyc/${memberId}?action=global&global=${s}`}
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
                  <SignedDocLink
                    filePath={String(d.file_url)}
                    token={params.token}
                  />
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
                <DocActions
                  memberId={memberId}
                  docId={String(d.id)}
                  token={params.token}
                />
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
