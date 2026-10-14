/**
 * /admin/nda/[id] : détail d'un accord (signataires, preuves, PDF archivés, journal).
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { ROLE_LABELS } from '@/lib/nda/template'
import type { AgreementRow, SignatoryRow } from '@/lib/nda/service'
import { AddSignatory, SignatoryActions } from './NdaDetailClient'

export const metadata: Metadata = { title: 'NDA | Aegryn Admin', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

type EventRow = { id: number; created_at: string; event: string; actor: string; ip_address: string | null; signatory_id: string | null; meta: Record<string, unknown> }

const fmt = (iso: string | null) => (iso ? `${new Date(iso).toISOString().replace('T', ' ').slice(0, 19)} UTC` : '-')
const statusLabel: Record<string, string> = { pending: 'En attente', signed: 'Signé', revoked: 'Révoqué', expired: 'Expiré' }
const statusCls = (s: string) =>
  s === 'signed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
  : s === 'revoked' ? 'bg-gray-100 text-gray-500 border-gray-200'
  : s === 'expired' ? 'bg-red-50 text-red-600 border-red-200'
  : 'bg-amber-50 text-amber-700 border-amber-200'

export default async function NdaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supa = createServiceClient()
  const { data: a } = await supa.from('nda_agreements').select('*').eq('id', id).maybeSingle()
  if (!a) notFound()
  const agreement = a as AgreementRow
  const [{ data: sigs }, { data: evs }] = await Promise.all([
    supa.from('nda_signatories').select('*').eq('agreement_id', id).order('created_at'),
    supa.from('nda_events').select('*').eq('agreement_id', id).order('created_at', { ascending: false }).limit(200),
  ])
  const signatories = (sigs ?? []) as SignatoryRow[]
  const events = (evs ?? []) as EventRow[]
  const nameById = Object.fromEntries(signatories.map(s => [s.id, s.full_name]))

  return (
    <div className="space-y-8 p-8">
      <div>
        <Link href="/admin/nda" className="text-[13px] text-gray-500 underline">← Tous les accords</Link>
        <h1 className="mt-2 font-sans text-2xl font-bold text-gray-900">{agreement.reference}</h1>
        <p className="mt-1 text-sm text-gray-600">{agreement.project_label}</p>
        <p className="mt-1 font-mono text-[11px] text-gray-400">
          {agreement.lang.toUpperCase()} · {agreement.term_years} ans · {agreement.penalty_chf ? `peine conventionnelle ${agreement.penalty_chf} CHF` : 'sans peine conventionnelle'} · modèle {agreement.template_version} · créé le {fmt(agreement.created_at)}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-sans text-lg font-bold text-gray-900">Signataires</h2>
        <p className="text-[13px] text-gray-500">Aucun envoi automatique : chaque NDA part uniquement quand vous cliquez sur « Envoyer le NDA », à l’e-mail du signataire.</p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
              <tr><th className="px-4 py-3">Signataire</th><th className="px-4 py-3">Profils</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3">Preuves</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 align-top">
              {signatories.map(s => (
                <tr key={s.id}>
                  <td className="px-4 py-3"><p className="font-semibold text-gray-900">{s.full_name}</p><p className="text-[12px] text-gray-500">{s.email}{s.company ? ` · ${s.company}` : ''}</p></td>
                  <td className="px-4 py-3 text-[12px] text-gray-600">{s.roles.map(r => ROLE_LABELS.fr[r]).join(', ')}</td>
                  <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${statusCls(s.status)}`}>{statusLabel[s.status] ?? s.status}</span>
                    {s.status !== 'signed' && (s.sent_at
                      ? <p className="mt-1 text-[11px] text-gray-400">Envoyé {fmt(s.sent_at)}<br />Lien jusqu’au {s.token_expires_at.slice(0, 10)}</p>
                      : <p className="mt-1 text-[11px] font-semibold text-amber-700">Brouillon : à envoyer manuellement</p>)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-500">
                    {s.signed_at ? (<>
                      <p>Signé {fmt(s.signed_at)}</p><p>Nom saisi : {s.signed_name}</p><p>IP {s.ip_address ?? '-'}</p>
                      <p title={s.content_sha256 ?? ''}>Texte SHA-256 {s.content_sha256?.slice(0, 16)}…</p>
                      <p title={s.pdf_sha256 ?? ''}>PDF SHA-256 {s.pdf_sha256 ? `${s.pdf_sha256.slice(0, 16)}…` : 'non archivé'}</p>
                    </>) : '-'}
                  </td>
                  <td className="px-4 py-3"><SignatoryActions id={s.id} status={s.status} hasPdf={!!s.pdf_path} sent={!!s.sent_at} email={s.email} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {agreement.status !== 'revoked' && <AddSignatory agreementId={agreement.id} />}
      </section>

      <section className="space-y-3">
        <h2 className="font-sans text-lg font-bold text-gray-900">Journal d’audit</h2>
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white text-[13px]">
          {events.map(e => (
            <li key={e.id} className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5">
              <span className="font-mono text-[11px] text-gray-400">{fmt(e.created_at)}</span>
              <span className="font-semibold text-gray-800">{e.event}</span>
              {e.signatory_id && <span className="text-gray-500">{nameById[e.signatory_id] ?? ''}</span>}
              <span className="text-gray-400">{e.actor}{e.ip_address ? ` · ${e.ip_address}` : ''}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
