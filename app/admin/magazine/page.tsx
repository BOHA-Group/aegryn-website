import { checkAdminAccess }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import MagazinePublishToggle   from './MagazinePublishToggle'

export const metadata: Metadata = {
  title: 'Magazine — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminMagazinePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa = createServiceClient()
  const { data } = await supa
    .from('site_settings')
    .select('key, value')
    .in('key', ['magazine_issue_01_public', 'magazine_issue_01_early_access'])

  function getBool(key: string) {
    const row = (data ?? []).find(r => r.key === key)
    if (!row) return false
    return row.value === true || row.value === 'true'
  }

  const isPublic      = getBool('magazine_issue_01_public')
  const isEarlyAccess = getBool('magazine_issue_01_early_access')

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

        {/* État courant */}
        <div className="flex items-center gap-3 mb-8 bg-white border border-gray-200 px-5 py-3">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isPublic ? 'bg-emerald-400' : isEarlyAccess ? 'bg-amber-400' : 'bg-gray-300'}`} />
          <p className="text-[12px] text-gray-600">
            {isPublic
              ? 'Accès public ouvert — magazine visible par tous.'
              : isEarlyAccess
                ? 'Accès anticipé actif — visible uniquement par les inscrits (48 h avant ouverture publique).'
                : 'Magazine non publié — QR code affiche "Coming soon", boutons verrouillés.'}
          </p>
        </div>

        {/* Issue 01 — 2 niveaux */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-3">Issue 01 — Built to Last.</p>

          {/* Niveau 1 : early access inscrits */}
          <div className="bg-white border border-gray-200 px-6 py-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5">Niveau 1</span>
                  <p className="font-semibold text-[14px] text-gray-900">Accès anticipé — inscrits 48 h</p>
                </div>
                <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">
                  Ouvre l&apos;accès au magazine pour les abonnés newsletter et la liste de souhait papier,
                  48 h avant la publication publique. Le QR code et les boutons restent actifs pour les inscrits connectés.
                </p>
              </div>
              <MagazinePublishToggle
                issueKey="magazine_issue_01_early_access"
                issueLabel=""
                initialValue={isEarlyAccess}
              />
            </div>
          </div>

          {/* Niveau 2 : publication publique */}
          <div className="bg-white border border-gray-200 px-6 py-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5">Niveau 2</span>
                  <p className="font-semibold text-[14px] text-gray-900">Publication publique</p>
                </div>
                <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">
                  Ouvre l&apos;accès à tous les visiteurs. QR code actif, boutons &quot;Explorer en ligne&quot;
                  et &quot;Feuilleter le PDF&quot; déverrouillés. Désactive automatiquement la notion d&apos;accès anticipé.
                </p>
              </div>
              <MagazinePublishToggle
                issueKey="magazine_issue_01_public"
                issueLabel=""
                initialValue={isPublic}
              />
            </div>
          </div>

          <p className="text-[11px] text-gray-400 pt-2 leading-relaxed">
            Ordre recommandé : activer le Niveau 1 (J-2), puis le Niveau 2 le jour J. Les deux peuvent coexister.
          </p>
        </div>

      </div>
    </main>
  )
}
