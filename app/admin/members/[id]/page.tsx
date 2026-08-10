import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import MemberDetailClient from './MemberDetailClient'

export const metadata: Metadata = {
  title: 'Profil membre — Aegryn Admin',
  robots: { index: false, follow: false },
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function AdminMemberDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string; action?: string; nda?: string; status?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  await checkAdminAccess(sp.token)

  const supa = createServiceClient()

  /* ── Server-side action (NDA status change via URL) ── */
  if (sp.action === 'nda' && sp.nda && sp.status) {
    const allowed = ['approved', 'rejected', 'nda_sent', 'nda_signed']
    if (allowed.includes(sp.status)) {
      const update: Record<string, unknown> = { status: sp.status, reviewed_by: 'admin', reviewed_at: new Date().toISOString() }
      if (sp.status === 'nda_sent')   update.nda_sent_at   = new Date().toISOString()
      if (sp.status === 'nda_signed') update.nda_signed_at = new Date().toISOString()
      await supa.from('nda_requests').update(update).eq('id', sp.nda)
    }
    redirect(`/admin/members/${id}`)
  }

  /* ── Fetch profile ── */
  const { data: profile } = await supa
    .from('profiles')
    .select('id, email, full_name, roles, role, created_at, updated_at, admin_note')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  /* ── NDA requests liées à cet utilisateur (email match) ── */
  const { data: ndaRows } = await supa
    .from('nda_requests')
    .select('id, buyer_name, buyer_email, buyer_company, buyer_type, capacity, status, nda_sent_at, nda_signed_at, created_at, asset_id, assets(company_name, official_grade, asset_type, arr)')
    .eq('buyer_email', profile.email)
    .order('created_at', { ascending: false })

  /* ── NDA Auction signatures (plateforme) ── */
  const { data: ndaSignatures } = await supa
    .from('nda_signatures')
    .select('id, nda_version, signed_at, ip_address, user_agent, scope, asset_id')
    .eq('buyer_id', id)
    .order('signed_at', { ascending: false })

  /* ── NDA profil acceptés en ligne (seller/buyer/partner) ── */
  const { data: ndaAcceptances } = await supa
    .from('nda_acceptances')
    .select('id, nda_type, nda_version, accepted_at, ip_address, user_agent')
    .eq('user_id', id)
    .order('accepted_at', { ascending: false })

  /* ── KYC documents ── */
  const { data: kycDocs } = await supa
    .from('kyc_documents')
    .select('id, doc_type, status, rejection_reason, file_url, created_at, validated_at, expires_at')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  /* ── Introductions (partenaire) ── */
  const { data: introductions } = await supa
    .from('introductions')
    .select('id, introduction_type, contact_name, contact_email, introduction_status, created_at, admin_note')
    .eq('partner_id', id)
    .order('created_at', { ascending: false })

  /* ── Commissions ── */
  const { data: commissions } = await supa
    .from('commissions')
    .select('id, type, amount_chf, status, eligible_at, paid_at, created_at')
    .eq('partner_id', id)
    .order('created_at', { ascending: false })

  /* ── Assets soumis par ce vendeur ── */
  const { data: sellerAssets } = await supa
    .from('assets')
    .select('id, company_name, asset_type, status, official_grade, arr, created_at')
    .eq('seller_uid', id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-[11px] font-mono text-gray-400">
          <Link href={`/admin`} className="hover:text-gray-700 transition-colors">Admin</Link>
          <span>/</span>
          <Link href={`/admin/members`} className="hover:text-gray-700 transition-colors">Members</Link>
          <span>/</span>
          <span className="text-gray-700">{profile.full_name ?? profile.email}</span>
        </div>

        {/* Header profil */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight">
                {profile.full_name ?? '—'}
              </h1>
              <p className="font-mono text-[11px] text-gray-500 mt-0.5">{profile.email}</p>
              <p className="font-mono text-[10px] text-gray-400 mt-1">
                Créé le {fmtDate(profile.created_at)} · Mis à jour le {fmtDate(profile.updated_at)}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {((profile.roles as string[]) ?? []).map((r: string) => (
                <span key={r} className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 bg-ag-navy text-ag-apex border border-ag-navy/30">
                  {r}
                </span>
              ))}
              {((profile.roles as string[]) ?? []).length === 0 && (
                <span className="font-mono text-[9px] text-gray-400">Aucun rôle</span>
              )}
            </div>
          </div>
        </div>

        {/* Client component — toute la logique interactive */}
        <MemberDetailClient
          profileId={id}
          currentRoles={(profile.roles as string[]) ?? []}
          adminNote={profile.admin_note ?? ''}
          ndaRows={(ndaRows ?? []) as Record<string, unknown>[]}
          ndaSignatures={(ndaSignatures ?? []) as Record<string, unknown>[]}
          ndaAcceptances={(ndaAcceptances ?? []) as Record<string, unknown>[]}
          kycDocs={(kycDocs ?? []) as Record<string, unknown>[]}
          introductions={(introductions ?? []) as Record<string, unknown>[]}
          commissions={(commissions ?? []) as Record<string, unknown>[]}
          sellerAssets={(sellerAssets ?? []) as Record<string, unknown>[]}
          token={sp.token ?? ''}
        />

      </div>
    </main>
  )
}
