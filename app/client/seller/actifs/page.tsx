import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowUpRight, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mes dossiers — Espace Cédant Aegryn',
  robots: { index: false, follow: false },
}

const STATUS_STEPS = [
  { key: 'submitted',    label: 'Reçu' },
  { key: 'under_review', label: 'Analyse' },
  { key: 'graded',       label: 'Gradé' },
  { key: 'published',    label: 'Publié' },
  { key: 'sold',         label: 'Vendu' },
]

function getStepIndex(status: string) {
  return STATUS_STEPS.findIndex(s => s.key === status)
}

function gradeColor(g: string) {
  return g === '★'   ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
    : g === 'AAA'    ? 'text-blue-700 border-blue-200 bg-blue-50'
    : g === 'AA'     ? 'text-green-700 border-green-200 bg-green-50'
    : g === 'A'      ? 'text-yellow-700 border-yellow-200 bg-yellow-50'
    : g === 'B'      ? 'text-gray-600 border-gray-200 bg-gray-50'
    : 'text-red-500 border-red-100 bg-red-50'
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

type Asset = {
  id: string
  company_name: string | null
  asset_type: string | null
  arr: number | null
  official_grade: string | null
  score_total: number | null
  status: string
  public_summary: string | null
  submitted_at: string | null
  graded_at: string | null
  published_at: string | null
}

export default async function SellerActifsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const [{ data: byEmail }, { data: byUid }] = await Promise.all([
    supa.from('assets')
      .select('id, company_name, asset_type, arr, official_grade, score_total, status, public_summary, submitted_at, graded_at, published_at')
      .eq('seller_email', user.email!)
      .order('submitted_at', { ascending: false }),
    supa.from('assets')
      .select('id, company_name, asset_type, arr, official_grade, score_total, status, public_summary, submitted_at, graded_at, published_at')
      .eq('seller_uid', user.id)
      .order('submitted_at', { ascending: false }),
  ])

  const seen = new Set<string>()
  const assets = ([...(byEmail ?? []), ...(byUid ?? [])] as Asset[]).filter(a => {
    if (seen.has(a.id)) return false
    seen.add(a.id)
    return true
  })

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Cédant</p>
          <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Mes dossiers de certification</h1>
          <p className="font-sans text-[13px] text-gray-400 mt-1">Suivi du pipeline de vos actifs soumis à Aegryn.</p>
        </div>
        <Link href="/grade/submit"
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-black transition-colors">
          <FileText size={11} /> Soumettre un actif
        </Link>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <FileText size={24} className="text-gray-300 mx-auto mb-4" />
          <p className="font-sans text-[14px] text-gray-400 mb-4">Aucun dossier associé à ce compte.</p>
          <Link href="/grade/submit"
            className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors">
            Soumettre mon actif <ArrowUpRight size={10} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {assets.map(asset => {
            const stepIdx    = getStepIndex(asset.status)
            const isWithdrawn = asset.status === 'withdrawn'

            return (
              <Link key={asset.id} href={`/client/seller/actifs/${asset.id}`}
                className="bg-white border border-gray-200 hover:border-ag-navy/30 hover:shadow-sm transition-all block group">

                {/* Header */}
                <div className="p-6 pb-4 flex items-start justify-between gap-6 border-b border-gray-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h2 className="font-sans font-semibold text-gray-900 text-[15px] truncate">
                        {asset.company_name ?? `Actif #${asset.id.slice(0, 8)}`}
                      </h2>
                      {asset.asset_type && (
                        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-400 border border-gray-200 px-1.5 py-0.5">
                          {asset.asset_type}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-gray-400">
                      Soumis le {fmtDate(asset.submitted_at)}
                      {asset.arr != null && ` — ARR ${fmtChf(asset.arr)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {asset.official_grade && (
                      <div className={`border px-3 py-1.5 font-mono font-bold text-[15px] ${gradeColor(asset.official_grade)}`}>
                        {asset.official_grade}
                        {asset.score_total != null && (
                          <span className="font-sans font-normal text-[9px] opacity-60 ml-1">{asset.score_total}/100</span>
                        )}
                      </div>
                    )}
                    <ArrowUpRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>

                {/* Timeline */}
                {!isWithdrawn ? (
                  <div className="px-6 py-4">
                    <div className="flex items-start">
                      {STATUS_STEPS.map((step, i) => {
                        const done    = i < stepIdx
                        const current = i === stepIdx
                        return (
                          <div key={step.key} className="flex-1 flex flex-col items-center relative">
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`absolute top-2.5 left-1/2 w-full h-px ${done ? 'bg-ag-apex' : 'bg-gray-200'}`} />
                            )}
                            <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center mb-1.5 ${
                              done    ? 'bg-ag-apex border-ag-apex'
                              : current ? 'bg-white border-ag-apex'
                              : 'bg-white border-gray-200'
                            }`}>
                              {done    && <div className="w-1.5 h-1.5 bg-ag-navy rounded-full" />}
                              {current && <div className="w-1.5 h-1.5 bg-ag-apex rounded-full" />}
                            </div>
                            <p className={`font-sans text-[8px] text-center leading-tight ${
                              current ? 'text-ag-black font-semibold' : done ? 'text-gray-400' : 'text-gray-300'
                            }`}>{step.label}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-3">
                    <p className="font-sans text-[11px] text-gray-400 italic">Dossier retiré du processus.</p>
                  </div>
                )}

                {/* Dates clés */}
                <div className="px-6 pb-4 flex flex-wrap gap-5">
                  {asset.graded_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Gradé le</p>
                      <p className="font-sans text-[11px] text-gray-500">{fmtDate(asset.graded_at)}</p>
                    </div>
                  )}
                  {asset.published_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Publié le</p>
                      <p className="font-sans text-[11px] text-gray-500">{fmtDate(asset.published_at)}</p>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {assets.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
          <p className="font-sans text-[13px] text-gray-400">Vous avez un autre actif à certifier ?</p>
          <Link href="/grade/submit"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:border-gray-500 transition-all">
            Soumettre un actif <ArrowUpRight size={10} />
          </Link>
        </div>
      )}
    </div>
  )
}
