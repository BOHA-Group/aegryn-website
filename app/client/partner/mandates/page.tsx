import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Briefcase, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mandats clients — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:    { label: 'Actif',    color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  completed: { label: 'Terminé', color: 'text-gray-500 border-gray-200 bg-gray-50' },
  cancelled: { label: 'Annulé',  color: 'text-red-500 border-red-100 bg-red-50' },
}

const TYPE_LABELS: Record<string, string> = {
  advisory:      'Conseil stratégique',
  due_diligence: 'Due diligence',
  fundraising:   'Levée de fonds',
  other:         'Autre',
}

const CLIENT_TYPE_LABELS: Record<string, string> = {
  seller: 'Vendeur',
  buyer:  'Acquéreur',
  other:  'Autre',
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

type Mandate = {
  id: string
  client_name: string
  client_type: string
  mandate_type: string
  status: string
  retrocession_pct: number
  started_at: string | null
  ended_at: string | null
  created_at: string
  assets: { company_name: string | null } | null
}

export default async function PartnerMandatesPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: mandates } = await supa
    .from('partner_mandates')
    .select('id, client_name, client_type, mandate_type, status, retrocession_pct, started_at, ended_at, created_at, assets(company_name)')
    .eq('partner_id', user.id)
    .order('created_at', { ascending: false })

  const ms = (mandates ?? []) as unknown as Mandate[]

  const activeCount    = ms.filter(m => m.status === 'active').length
  const completedCount = ms.filter(m => m.status === 'completed').length

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
          <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Mandats clients</h1>
          <p className="font-sans text-[13px] text-gray-400 mt-1">
            Missions d&apos;accompagnement facturées directement à vos clients (CAS 3).
          </p>
        </div>
      </div>

      {/* Compteurs */}
      {ms.length > 0 && (
        <div className="flex gap-3 mb-8">
          <div className="border border-emerald-200 bg-emerald-50 px-3 py-1.5 flex items-center gap-2">
            <span className="font-mono font-bold text-[13px] text-emerald-700">{activeCount}</span>
            <span className="font-sans text-[11px] text-emerald-600">actif{activeCount > 1 ? 's' : ''}</span>
          </div>
          {completedCount > 0 && (
            <div className="border border-gray-200 bg-gray-50 px-3 py-1.5 flex items-center gap-2">
              <span className="font-mono font-bold text-[13px] text-gray-500">{completedCount}</span>
              <span className="font-sans text-[11px] text-gray-400">terminé{completedCount > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}

      {/* Info CAS 3 */}
      <div className="bg-blue-50 border border-blue-200 px-5 py-4 mb-6">
        <p className="font-sans text-[12px] text-blue-800 leading-relaxed">
          <strong>Comment ça fonctionne :</strong> Vous facturez votre client directement pour vos prestations.
          Pour chaque facture émise, vous déclarez le montant ci-dessous et reversez{' '}
          <strong>15%</strong> à AEGRYN. AEGRYN ne facture rien au client — vous êtes l&apos;interlocuteur unique.
        </p>
      </div>

      {ms.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <Briefcase size={24} className="text-gray-300 mx-auto mb-4" />
          <p className="font-sans text-[14px] text-gray-400 mb-2">
            Aucun mandat enregistré pour le moment.
          </p>
          <p className="font-sans text-[12px] text-gray-300">
            Contactez <a href="mailto:partners@aegryn.com" className="underline">partners@aegryn.com</a> pour ouvrir un mandat.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ms.map(m => {
            const statusCfg = STATUS_CONFIG[m.status] ?? STATUS_CONFIG.active
            const assetName = Array.isArray(m.assets)
              ? (m.assets as unknown[])[0] as { company_name: string | null } | undefined
              : m.assets

            return (
              <Link
                key={m.id}
                href={`/client/partner/mandates/${m.id}`}
                className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group block"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-sans font-semibold text-gray-900 text-[14px]">
                        {m.client_name}
                      </p>
                      <span className="font-mono text-[9px] text-gray-400 border border-gray-200 px-1.5 py-0.5">
                        {CLIENT_TYPE_LABELS[m.client_type] ?? m.client_type}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                      {TYPE_LABELS[m.mandate_type] ?? m.mandate_type}
                      {assetName?.company_name && ` · ${assetName.company_name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <ArrowUpRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-5">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Rétrocession AEGRYN</p>
                    <p className="font-sans font-semibold text-[12px] text-gray-700">{m.retrocession_pct}%</p>
                  </div>
                  {m.started_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Démarré le</p>
                      <p className="font-sans text-[12px] text-gray-600">{fmtDate(m.started_at)}</p>
                    </div>
                  )}
                  {m.ended_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Terminé le</p>
                      <p className="font-sans text-[12px] text-gray-600">{fmtDate(m.ended_at)}</p>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div className="mt-8 px-5 py-4 border border-gray-200 bg-gray-50">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          Pour ouvrir un nouveau mandat client, contactez <a href="mailto:partners@aegryn.com" className="text-ag-navy underline">partners@aegryn.com</a>.
          L&apos;équipe AEGRYN créera le mandat et vous l&apos;associera dans votre espace.
        </p>
      </div>
    </div>
  )
}
