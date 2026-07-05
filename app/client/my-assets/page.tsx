import { redirect }           from 'next/navigation'
import type { Metadata }      from 'next'
import Link                   from 'next/link'
import { ArrowUpRight, LogOut } from 'lucide-react'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import DeleteAccountButton    from './DeleteAccountButton'

export const metadata: Metadata = {
  title: 'Mes actifs — Espace client AEGRYN',
  robots: { index: false, follow: false },
}

const STATUS_STEPS = [
  { key: 'submitted',    label: 'Dossier reçu',            desc: 'Votre dossier a bien été soumis.' },
  { key: 'under_review', label: 'Analyse en cours',        desc: 'Nos analystes étudient votre dossier.' },
  { key: 'graded',       label: 'Grade attribué',          desc: 'Votre actif a reçu un grade officiel AEGRYN.' },
  { key: 'published',    label: 'Publié au catalogue',     desc: 'Votre actif est visible par les acquéreurs qualifiés.' },
  { key: 'sold',         label: 'Transaction finalisée',   desc: 'La transaction a été clôturée avec succès.' },
]

function getStepIndex(status: string) {
  return STATUS_STEPS.findIndex(s => s.key === status)
}

function gradeColor(g: string) {
  return g === '★'  ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
    : g === 'AAA'   ? 'text-blue-700 border-blue-200 bg-blue-50'
    : g === 'AA'    ? 'text-green-700 border-green-200 bg-green-50'
    : g === 'A'     ? 'text-yellow-700 border-yellow-200 bg-yellow-50'
    : g === 'B'     ? 'text-gray-600 border-gray-200 bg-gray-50'
    : 'text-red-500 border-red-100 bg-red-50'
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function ClientMyAssetsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  /* Dispatcher de rôles — redirige vers l'espace approprié */
  const { data: profile } = await supa
    .from('profiles')
    .select('roles')
    .eq('id', user.id)
    .single()

  const roles = (profile?.roles ?? []) as string[]
  if (roles.includes('admin') || roles.includes('super_admin')) redirect('/admin')
  if (roles.includes('buyer'))   redirect('/client/buyer')
  if (roles.includes('partner')) redirect('/client/partner')
  // seller → reste sur cette page (my-assets legacy)

  /* Fetch actifs du vendeur par email (seller_uid pas encore lié pour les anciens) */
  const { data: byEmail } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, score_total, status, public_summary, submitted_at, graded_at, published_at')
    .eq('seller_email', user.email!)
    .order('submitted_at', { ascending: false })

  /* Fetch actifs liés par seller_uid */
  const { data: byUid } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, score_total, status, public_summary, submitted_at, graded_at, published_at')
    .eq('seller_uid', user.id)
    .order('submitted_at', { ascending: false })

  /* Déduplique par id */
  const allAssets = [...(byEmail ?? []), ...(byUid ?? [])]
  const seen = new Set<string>()
  const assets = allAssets.filter(a => {
    if (seen.has(a.id)) return false
    seen.add(a.id)
    return true
  }) as {
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
  }[]

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-ag-navy px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-apex font-bold">
            AEGRYN
          </Link>
          <span className="text-white/20">|</span>
          <span className="font-sans text-[12px] text-white/50">Espace client</span>
        </div>
        <form action="/api/client/logout" method="POST">
          <button type="submit"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors">
            <LogOut size={12} /> Déconnexion
          </button>
        </form>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Greeting */}
        <div className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-2">Espace vendeur</p>
          <h1 className="font-sans font-bold text-gray-900 text-[26px] tracking-tight">
            Mes dossiers de certification
          </h1>
          <p className="font-sans text-[13px] text-gray-400 mt-1">{user.email}</p>
        </div>

        {assets.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="font-sans text-[14px] text-gray-400 mb-4">
              Aucun dossier associé à ce compte pour le moment.
            </p>
            <Link
              href="/grade/submit"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-black transition-colors"
            >
              Soumettre mon actif <ArrowUpRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {assets.map(asset => {
              const stepIdx    = getStepIndex(asset.status)
              const isWithdrawn = asset.status === 'withdrawn'

              return (
                <div key={asset.id} className="bg-white border border-gray-200">
                  {/* Card header */}
                  <div className="p-6 flex items-start justify-between gap-6 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h2 className="font-sans font-semibold text-gray-900 text-[16px] truncate">
                          {asset.company_name ?? `Actif #${asset.id.slice(0, 8)}`}
                        </h2>
                        {asset.asset_type && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400 border border-gray-200 px-2 py-0.5">
                            {asset.asset_type}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-gray-400">
                        Soumis le {fmtDate(asset.submitted_at)}
                      </p>
                    </div>
                    {asset.official_grade && (
                      <div className={`border px-3 py-1.5 font-mono font-bold text-[16px] shrink-0 ${gradeColor(asset.official_grade)}`}>
                        {asset.official_grade}
                        {asset.score_total != null && (
                          <span className="font-sans font-normal text-[10px] opacity-60 ml-1">
                            {asset.score_total}/100
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timeline statut */}
                  {!isWithdrawn ? (
                    <div className="px-6 py-5">
                      <div className="flex items-start gap-0">
                        {STATUS_STEPS.map((step, i) => {
                          const done    = i < stepIdx
                          const current = i === stepIdx
                          const _future  = i > stepIdx
                          return (
                            <div key={step.key} className="flex-1 flex flex-col items-center relative">
                              {/* Connecteur */}
                              {i < STATUS_STEPS.length - 1 && (
                                <div className={`absolute top-3 left-1/2 w-full h-px ${done ? 'bg-ag-apex' : 'bg-gray-200'}`} />
                              )}
                              {/* Dot */}
                              <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 ${
                                done    ? 'bg-ag-apex border-ag-apex'
                                : current ? 'bg-white border-ag-apex'
                                : 'bg-white border-gray-200'
                              }`}>
                                {done && <div className="w-2 h-2 bg-ag-navy rounded-full" />}
                                {current && <div className="w-2 h-2 bg-ag-apex rounded-full" />}
                              </div>
                              {/* Label */}
                              <p className={`font-sans text-[9px] text-center leading-tight px-1 ${
                                current ? 'text-ag-black font-semibold'
                                : done   ? 'text-gray-500'
                                : 'text-gray-300'
                              }`}>
                                {step.label}
                              </p>
                              {current && (
                                <p className="font-sans text-[9px] text-ag-apex text-center mt-0.5 px-1 leading-tight">
                                  {step.desc}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-4">
                      <p className="font-sans text-[12px] text-gray-400 italic">Dossier retiré du processus.</p>
                    </div>
                  )}

                  {/* Résumé public si disponible */}
                  {asset.public_summary && asset.status === 'published' && (
                    <div className="px-6 pb-5">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-2">Résumé public (visible acquéreurs)</p>
                      <p className="font-sans text-[12px] text-gray-500 leading-relaxed border-l-2 border-ag-apex pl-3">
                        {asset.public_summary}
                      </p>
                    </div>
                  )}

                  {/* Dates clés */}
                  <div className="px-6 pb-5 flex flex-wrap gap-6">
                    {asset.graded_at && (
                      <div>
                        <p className="font-mono text-[9px] text-gray-300 uppercase tracking-widest mb-0.5">Grade attribué</p>
                        <p className="font-sans text-[11px] text-gray-500">{fmtDate(asset.graded_at)}</p>
                      </div>
                    )}
                    {asset.published_at && (
                      <div>
                        <p className="font-mono text-[9px] text-gray-300 uppercase tracking-widest mb-0.5">Publié le</p>
                        <p className="font-sans text-[11px] text-gray-500">{fmtDate(asset.published_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA nouveau dossier */}
        {assets.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
            <p className="font-sans text-[13px] text-gray-400">Vous avez un autre actif à certifier ?</p>
            <Link
              href="/grade/submit"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:border-gray-500 hover:text-gray-900 transition-all"
            >
              Soumettre un actif <ArrowUpRight size={11} />
            </Link>
          </div>
        )}

        {/* Zone de danger — suppression de compte (RGPD) */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <DeleteAccountButton />
        </div>

      </div>
    </main>
  )
}
