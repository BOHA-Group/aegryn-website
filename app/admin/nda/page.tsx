/**
 * /admin/nda : NDA mutuels numériques (liste, création, distribution).
 * Remplace le NDA de compte : signature par lien personnel, sans compte, PDF archivé.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { NDA_TEMPLATE_STATUS, getAegrynSignatory } from '@/lib/nda/config'
import NdaCreateForm from './NdaCreateForm'

export const metadata: Metadata = { title: 'NDA mutuels | Aegryn Admin', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

type Row = { id: string; reference: string; project_label: string; lang: string; status: string; created_at: string; nda_signatories: { status: string }[] }

const badge = (s: string) =>
  s === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
  : s === 'revoked' ? 'bg-gray-100 text-gray-500 border-gray-200'
  : 'bg-amber-50 text-amber-700 border-amber-200'
const label: Record<string, string> = { open: 'En cours', completed: 'Signé', revoked: 'Révoqué' }

export default async function NdaAdminPage({ searchParams }: { searchParams: Promise<{ new?: string; name?: string; email?: string; project?: string; role?: string }> }) {
  await requireAdmin()
  const sp = await searchParams
  const { data, error } = await createServiceClient()
    .from('nda_agreements')
    .select('id, reference, project_label, lang, status, created_at, nda_signatories(status)')
    .order('created_at', { ascending: false }).limit(200)
  const rows = (data ?? []) as unknown as Row[]
  const signatory = getAegrynSignatory()

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-sans text-2xl font-bold text-gray-900">NDA mutuels</h1>
        <p className="mt-1 text-sm text-gray-500">Un accord tout-en-un (socle commun + annexes par profil), signé par lien personnel sans compte. Contresignature Aegryn automatique, PDF archivé, journal d’audit.</p>
      </div>

      {NDA_TEMPLATE_STATUS === 'draft' && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Le modèle de NDA est en brouillon : à faire valider par le conseil juridique avant tout envoi à un tiers (voir <code>lib/nda/config.ts</code>).
        </div>
      )}
      {!signatory && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          Signataire Aegryn non configuré : définir <code>NDA_AEGRYN_SIGNATORY_NAME</code> et <code>NDA_AEGRYN_SIGNATORY_TITLE</code> pour permettre la contresignature automatique.
        </div>
      )}
      {error && <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">Lecture impossible ({error.message}). La migration 124_nda_agreements.sql est-elle exécutée ?</div>}

      <NdaCreateForm defaults={{ name: sp.name, email: sp.email, project: sp.project, role: sp.role }} initiallyOpen={sp.new === '1'} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
            <tr><th className="px-4 py-3">Référence</th><th className="px-4 py-3">Objet</th><th className="px-4 py-3">Langue</th><th className="px-4 py-3">Signatures</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3">Créé le</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun accord pour le moment.</td></tr>}
            {rows.map(r => {
              const live = r.nda_signatories.filter(s => s.status !== 'revoked')
              return (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-[12px]"><Link className="text-ag-navy underline" href={`/admin/nda/${r.id}`}>{r.reference}</Link></td>
                  <td className="px-4 py-3">{r.project_label}</td>
                  <td className="px-4 py-3 uppercase">{r.lang}</td>
                  <td className="px-4 py-3">{live.filter(s => s.status === 'signed').length} / {live.length}</td>
                  <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${badge(r.status)}`}>{label[r.status] ?? r.status}</span></td>
                  <td className="px-4 py-3 text-gray-500">{new Date(r.created_at).toLocaleDateString('fr-CH')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
