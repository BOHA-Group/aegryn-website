import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Award, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Co-signatures — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  assigned:  { label: 'Assignée',  color: 'text-gray-500 border-gray-200 bg-gray-50' },
  in_review: { label: 'En cours',  color: 'text-blue-600 border-blue-200 bg-blue-50' },
  submitted: { label: 'Soumise',   color: 'text-amber-600 border-amber-200 bg-amber-50' },
  signed:    { label: 'Signée',    color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  declined:  { label: 'Refusée',   color: 'text-red-500 border-red-100 bg-red-50' },
}

const DIMENSION_LABELS: Record<string, string> = {
  ip:       'Propriété Intellectuelle',
  finance:  'Finance & Comptabilité',
  security: 'Sécurité & Conformité',
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

type Cert = {
  id: string
  dimension: string
  status: string
  score: number | null
  deadline_at: string | null
  signed_at: string | null
  created_at: string
  assets: { id: string; company_name: string | null; official_grade: string | null } | null
}

export default async function PartnerCertificationsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: certs } = await supa
    .from('partner_certifications')
    .select('id, dimension, status, score, deadline_at, signed_at, created_at, assets(id, company_name, official_grade)')
    .eq('partner_id', user.id)
    .order('created_at', { ascending: false })

  const counts = (certs ?? []).reduce<Record<string, number>>((acc, c) => {
    const cert = c as unknown as Cert
    acc[cert.status] = (acc[cert.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Co-signatures CIFS</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Missions de co-certification par dimension attribuées par l&apos;équipe AEGRYN.
        </p>
      </div>

      {/* Compteurs */}
      {certs && certs.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => counts[key] ? (
            <div key={key} className={`border px-3 py-1.5 flex items-center gap-2 ${color}`}>
              <span className="font-mono font-bold text-[13px]">{counts[key]}</span>
              <span className="font-sans text-[11px]">{label}</span>
            </div>
          ) : null)}
        </div>
      )}

      {!certs || certs.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <Award size={24} className="text-gray-300 mx-auto mb-4" />
          <p className="font-sans text-[14px] text-gray-400">
            Aucune mission de co-signature assignée pour le moment.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(certs as unknown[] as Cert[]).map(cert => {
            const statusCfg = STATUS_CONFIG[cert.status] ?? STATUS_CONFIG.assigned
            const asset = Array.isArray(cert.assets) ? (cert.assets as unknown[])[0] as { id: string; company_name: string | null; official_grade: string | null } | null : cert.assets

            return (
              <Link key={cert.id} href={`/client/partner/certifications/${cert.id}`}
                className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group block">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-sans font-semibold text-gray-900 text-[14px]">
                        {asset?.company_name ?? `Actif #${cert.id.slice(0, 8)}`}
                      </p>
                      {asset?.official_grade && (
                        <span className="font-mono text-[9px] font-bold text-gray-500 border border-gray-200 px-1.5 py-0.5">
                          {asset.official_grade}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                      {DIMENSION_LABELS[cert.dimension] ?? cert.dimension}
                    </p>
                  </div>
                  <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest shrink-0 ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-5">
                    {cert.score != null && (
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Score soumis</p>
                        <p className="font-sans font-bold text-[13px] text-gray-800">{cert.score}/25</p>
                      </div>
                    )}
                    {cert.deadline_at && (
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Échéance</p>
                        <p className={`font-sans text-[12px] ${
                          new Date(cert.deadline_at) < new Date() ? 'text-red-500' : 'text-gray-700'
                        }`}>{fmtDate(cert.deadline_at)}</p>
                      </div>
                    )}
                    {cert.signed_at && (
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Signée le</p>
                        <p className="font-sans text-[12px] text-emerald-600">{fmtDate(cert.signed_at)}</p>
                      </div>
                    )}
                  </div>
                  <ArrowUpRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
