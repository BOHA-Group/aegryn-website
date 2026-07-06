import type { Metadata }      from 'next'
import { redirect }            from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { checkAdminAccess }    from '@/lib/adminAuth'
import Link                    from 'next/link'
import { ArrowLeft, Clock }    from 'lucide-react'
import GradeEngineForm         from './GradeEngineForm'

export const metadata: Metadata = {
  title: 'Moteur Grade — Admin AEGRYN',
  robots: { index: false, follow: false },
}

const GRADE_LABELS: Record<string, string> = {
  star: 'AEG ★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B', refused: 'Non certifiable',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function GradeEnginePage({
  params,
  searchParams,
}: {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id }    = await params
  const sp        = await searchParams
  await checkAdminAccess(sp.token)

  const supa = createServiceClient()

  // Charger la fiche actif
  const { data: asset } = await supa
    .from('assets')
    .select('id, name, aeg_grade, status')
    .eq('id', id)
    .single()

  if (!asset) redirect('/admin/assets')

  // Historique des évaluations
  const { data: assessments } = await supa
    .from('grade_assessments')
    .select('id, computed_grade, final_grade, computed_score, final_score, is_overridden, status, created_at, validated_at, published_at')
    .eq('asset_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  const adminToken = sp.token ?? process.env.ADMIN_LEADS_TOKEN ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* En-tête */}
        <div className="mb-8">
          <Link href={`/admin/assets${sp.token ? `?token=${sp.token}` : ''}`}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft size={12} /> Retour aux actifs
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Moteur de calcul grade</p>
              <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">{asset.name}</h1>
              <p className="font-sans text-[13px] text-gray-400 mt-0.5">
                Grade actuel : <strong>{asset.aeg_grade ? GRADE_LABELS[asset.aeg_grade] ?? asset.aeg_grade : '—'}</strong>
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 px-3 py-2 text-right">
              <p className="font-mono text-[9px] uppercase tracking-widest text-amber-600">Usage interne</p>
              <p className="font-sans text-[11px] text-amber-700 mt-0.5">Logique propriétaire — ne pas partager</p>
            </div>
          </div>
        </div>

        {/* Formulaire principal */}
        <GradeEngineForm assetId={id} adminToken={adminToken} />

        {/* Historique */}
        {assessments && assessments.length > 0 && (
          <div className="mt-10">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Historique des évaluations</p>
            <div className="space-y-2">
              {assessments.map(a => (
                <div key={a.id} className="bg-white border border-gray-200 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Clock size={12} className="text-gray-300 shrink-0" />
                    <div>
                      <p className="font-sans text-[12px] text-gray-700">
                        Grade calculé : <strong>{GRADE_LABELS[a.computed_grade] ?? a.computed_grade}</strong>
                        {a.is_overridden && (
                          <> → overridé : <strong>{GRADE_LABELS[a.final_grade] ?? a.final_grade}</strong></>
                        )}
                        {' '}· Score : {a.computed_score}/100
                      </p>
                      <p className="font-mono text-[9px] text-gray-300 mt-0.5">{fmtDate(a.created_at)}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                    a.status === 'published'   ? 'text-emerald-600 border-emerald-200 bg-emerald-50' :
                    a.status === 'validated'   ? 'text-blue-600   border-blue-200   bg-blue-50' :
                    a.status === 'superseded'  ? 'text-gray-400   border-gray-200   bg-gray-50' :
                                                 'text-amber-600  border-amber-200  bg-amber-50'
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
