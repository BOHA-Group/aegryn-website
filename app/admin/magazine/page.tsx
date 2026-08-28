import { checkAdminAccess }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { ISSUE_01 }            from '@/content/magazine/issue-01/meta'
import type { MagazineIssue }  from '@/lib/magazine/types'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import MagazinePublishToggle   from './MagazinePublishToggle'

export const metadata: Metadata = {
  title: 'Magazine — Aegryn Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

/* Registre de toutes les issues — ajouter ici à chaque nouveau numéro */
const ALL_ISSUES: MagazineIssue[] = [ISSUE_01]

function issueFlags(num: number) {
  const pad = String(num).padStart(2, '0')
  return {
    public:      `magazine_issue_${pad}_public`,
    earlyAccess: `magazine_issue_${pad}_early_access`,
  }
}

export default async function AdminMagazinePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa = createServiceClient()

  /* Charger tous les flags de toutes les issues en une seule requête */
  const allKeys = ALL_ISSUES.flatMap(i => Object.values(issueFlags(i.number)))
  const { data } = await supa
    .from('site_settings')
    .select('key, value')
    .in('key', allKeys)

  function getBool(key: string) {
    const row = (data ?? []).find((r: { key: string; value: unknown }) => r.key === key)
    if (!row) return false
    return row.value === true || row.value === 'true'
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-6 md:px-10 md:py-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN · Contenu</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Publication Magazine</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              Contrôle de l&apos;accès public aux numéros — QR code, flipbook, web edition.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="space-y-8">
          {ALL_ISSUES.map(issue => {
            const flags       = issueFlags(issue.number)
            const isPublic    = getBool(flags.public)
            const isEarly     = getBool(flags.earlyAccess)
            const pad         = String(issue.number).padStart(2, '0')
            const statusColor = isPublic ? 'bg-emerald-400' : isEarly ? 'bg-amber-400' : 'bg-gray-300'
            const statusText  = isPublic
              ? 'Accès public ouvert — visible par tous.'
              : isEarly
                ? 'Accès anticipé actif — inscrits uniquement (48 h avant publication publique).'
                : 'Non publié — QR code affiche "Coming soon", boutons verrouillés.'

            return (
              <div key={issue.slug}>
                {/* En-tête issue */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Issue {pad}</span>
                  <span className="text-gray-300">—</span>
                  <span className="font-semibold text-[13px] text-gray-800">{issue.title}</span>
                  <span className="text-[10px] text-gray-400">{new Date(issue.publishedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>

                {/* État courant */}
                <div className="flex items-center gap-3 mb-2 bg-white border border-gray-200 px-5 py-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor}`} />
                  <p className="text-[12px] text-gray-600">{statusText}</p>
                </div>

                <div className="space-y-2">
                  {/* Niveau 1 — early access */}
                  <div className="bg-white border border-gray-200 px-6 py-5">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5">Niveau 1</span>
                          <p className="font-semibold text-[14px] text-gray-900">Accès anticipé — inscrits 48 h</p>
                        </div>
                        <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">
                          Ouvre l&apos;accès pour les abonnés newsletter et la liste de souhait papier,
                          48 h avant l&apos;ouverture publique.
                        </p>
                      </div>
                      <MagazinePublishToggle
                        issueKey={flags.earlyAccess}
                        issueLabel=""
                        initialValue={isEarly}
                      />
                    </div>
                  </div>

                  {/* Niveau 2 — publication publique */}
                  <div className="bg-white border border-gray-200 px-6 py-5">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5">Niveau 2</span>
                          <p className="font-semibold text-[14px] text-gray-900">Publication publique</p>
                        </div>
                        <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">
                          Accès ouvert à tous — QR code actif, boutons &quot;Explorer en ligne&quot; et &quot;Feuilleter le PDF&quot; déverrouillés.
                        </p>
                      </div>
                      <MagazinePublishToggle
                        issueKey={flags.public}
                        issueLabel=""
                        initialValue={isPublic}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 pt-2 leading-relaxed">
                  Ordre recommandé : Niveau 1 (J-2), Niveau 2 le jour J.
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </main>
  )
}
