/**
 * /client/seller/nda-view — NDA Cédant signé, lecture seule avec timestamp
 */
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Shield, CheckCircle } from 'lucide-react'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS } from '@/lib/ndaVersions'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mon NDA Cédant — Aegryn',
    robots: { index: false, follow: false },
  }
}

export default async function SellerNdaViewPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')


  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, seller_nda_accepted_at, seller_nda_version, roles')
    .eq('id', user.id)
    .single()

  const p = profile as {
    full_name: string | null
    seller_nda_accepted_at: string | null
    seller_nda_version: string | null
    roles: string[]
  } | null

  if (!p?.seller_nda_accepted_at) redirect('/client/nda/seller')

  const roles = Array.isArray(p?.roles) ? p.roles as string[] : []
  if (!roles.includes('seller')) redirect('/client/buyer')

  const signedDate = new Date(p.seller_nda_accepted_at!).toLocaleDateString('fr-CH', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  const signedTime = new Date(p.seller_nda_accepted_at!).toLocaleTimeString('fr-CH', {
    hour: '2-digit', minute: '2-digit',
  })

  const isCurrentVersion = p.seller_nda_version === NDA_VERSIONS.seller

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-ag-navy text-white px-6 py-5 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-ag-apex shrink-0" />
            <div>
              <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-ag-apex font-bold">
                Accord de confidentialité — Cédant
              </p>
              <p className="text-[13px] font-semibold text-white/90">Lecture seule — document signé</p>
            </div>
          </div>
          <Link href="/client/seller"
            className="font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors border border-white/20 px-3 py-1.5">
            ← Espace Cédant
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Certificat de signature */}
        <div className="bg-emerald-50 border border-emerald-200 px-6 py-5 flex items-start gap-4">
          <CheckCircle size={18} className="text-emerald-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-sans text-[14px] font-semibold text-emerald-800 mb-3">
              NDA Cédant — Signature électronique enregistrée
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[11px] font-mono">
              <div>
                <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Signataire</p>
                <p className="text-emerald-900 font-semibold">{p.full_name ?? user.email}</p>
              </div>
              <div>
                <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Date</p>
                <p className="text-emerald-900">{signedDate}</p>
              </div>
              <div>
                <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Heure</p>
                <p className="text-emerald-900">{signedTime}</p>
              </div>
              <div>
                <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Version</p>
                <p className="text-emerald-900">{p.seller_nda_version ?? NDA_VERSIONS.seller}</p>
              </div>
              <div>
                <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Statut</p>
                <p className={isCurrentVersion ? 'text-emerald-900 font-semibold' : 'text-amber-700 font-semibold'}>
                  {isCurrentVersion ? 'En vigueur' : 'Version antérieure'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!isCurrentVersion && (
          <div className="bg-amber-50 border border-amber-200 px-5 py-4 text-[12px] text-amber-800">
            Une nouvelle version du NDA Cédant est disponible. Rendez-vous dans votre espace pour la signer.
          </div>
        )}

        {/* Texte intégral du NDA Cédant — lecture seule */}
        <div className="bg-white border border-gray-200 px-8 py-8 space-y-7 text-[13px] text-gray-700 leading-relaxed">

          <div className="border-b border-gray-100 pb-6">
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-400 mb-2">
              Version {p.seller_nda_version ?? NDA_VERSIONS.seller}
            </p>
            <h1 className="text-[17px] font-bold text-gray-900 leading-snug">
              Accord de Confidentialité et Conditions d'Engagement — Cédant
            </h1>
            <p className="text-[12px] text-gray-500 mt-1">
              Aegryn (, société enregistrée en Suisse) · contact@boha-group.com
            </p>
          </div>

          <div className="bg-gray-50 px-5 py-4 text-[12px] space-y-1">
            <p><strong>Entre :</strong> Aegryn (ci-après « Aegryn »)</p>
            <p><strong>Et :</strong> {p.full_name ?? user.email} (ci-après « le Cédant »)</p>
          </div>

          <Article num="1" title="Objet">
            Dans le cadre du processus de certification et de cession d&apos;un actif technologique via Aegryn,
            le Cédant s&apos;engage à maintenir la stricte confidentialité de toutes les informations échangées
            avec Aegryn, ses analystes, ses partenaires certifiés et les acquéreurs qualifiés.
          </Article>

          <Article num="2" title="Informations confidentielles">
            <p>Sont considérées comme confidentielles :</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Les rapports d\'analyse, grades et évaluations produits par Aegryn',
                'Les informations relatives aux acquéreurs qualifiés ayant exprimé un intérêt',
                'Les conditions et modalités des offres reçues (Expression d\'Intérêt, Accord de Principe)',
                'Les communications internes et notes d\'évaluation Aegryn',
                'L\'existence même du processus de cession jusqu\'à sa finalisation',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Article>

          <Article num="3" title="Obligations du Cédant">
            <p>Le Cédant s&apos;engage à :</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Ne pas divulguer à des tiers l\'existence du processus de certification ni les informations confidentielles sans accord préalable écrit d\'Aegryn',
                'Fournir des informations exactes, complètes et à jour sur l\'actif soumis, notamment ses états financiers, KPI, contrats et situation juridique',
                'Garantir disposer de tous les droits, titres et autorisations nécessaires pour procéder à la cession',
                'Ne pas engager de négociations parallèles avec des acquéreurs introduits ou identifiés par Aegryn pendant la durée du mandat',
                'Notifier immédiatement Aegryn de toute approche directe d\'un acquéreur introduit par Aegryn, sous peine d\'exigibilité immédiate des honoraires',
                'Ne pas conclure de transaction avec un acquéreur présenté par Aegryn en dehors du cadre formel du mandat',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Article>

          <Article num="4" title="Honoraires de cession">
            <p>
              En contrepartie des services d&apos;intermédiation, de certification et de conduite du processus,
              le Cédant s&apos;acquittera d&apos;un honoraire de succès selon la grille dégressive officielle Aegryn :
            </p>
            <table className="mt-4 w-full text-[11px] font-mono border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="text-left px-3 py-2 border border-gray-200">Tranche de prix</th>
                  <th className="text-right px-3 py-2 border border-gray-200">Taux</th>
                  <th className="text-right px-3 py-2 border border-gray-200">Minimum</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  ['100 000 € – 250 000 €', '10 %', '25 000 CHF'],
                  ['250 001 € – 500 000 €', '9 %', '25 000 CHF'],
                  ['500 001 € – 1 000 000 €', '8 %', '25 000 CHF'],
                  ['1 000 001 € – 2 500 000 €', '7 %', '25 000 CHF'],
                  ['2 500 001 € – 5 000 000 €', '6 %', '25 000 CHF'],
                  ['> 5 000 000 €', 'taux convenu au mandat', '25 000 CHF'],
                ].map(([t, tx, m]) => (
                  <tr key={t}>
                    <td className="px-3 py-1.5 border border-gray-200">{t}</td>
                    <td className="px-3 py-1.5 border border-gray-200 text-right">{tx}</td>
                    <td className="px-3 py-1.5 border border-gray-200 text-right">{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Article>

          <Article num="4bis" title="Frais en cas de non-réalisation de la transaction">
            <p>
              Dans le cas où l&apos;actif admis en Certification TRANSACT serait retiré du catalogue ou
              qu&apos;aucune transaction ne se réalise à l&apos;issue du processus Aegryn, des frais fixes
              minimaux de <strong>CHF 2 000 HT</strong> sont dus à Aegryn en contrepartie du travail
              engagé par ses équipes : analyse C/I/F/S, attribution du grade officiel, préparation du
              dossier catalogue, communication, marketing, et visibilité produit acquise durant la présence
              de l&apos;actif au catalogue. Ces frais sont exigibles à la date de retrait ou de clôture
              sans transaction, facturés directement au Cédant. Non applicable en cas de condition
              suspensive non levée dûment documentée.
            </p>
          </Article>

          <Article num="5" title="Durée">
            Les présentes obligations s&apos;appliquent pendant toute la durée du processus Aegryn et pendant
            une période de <strong>3 ans</strong>{' '}suivant la conclusion ou l&apos;abandon du processus.
            L&apos;obligation de paiement des honoraires survit à toute résiliation.
          </Article>

          <Article num="6" title="Sanctions">
            Tout manquement aux présentes obligations expose le Cédant à des dommages-intérêts,
            incluant notamment le paiement immédiat des honoraires de succès majorés, la perte du
            bénéfice du processus Aegryn et une indemnité forfaitaire minimale de <strong>25 000 CHF HT</strong>,
            sans préjudice de tout autre préjudice démontré.
          </Article>

          <Article num="7" title="Droit applicable">
            Le présent accord est soumis au droit suisse. Tout litige sera soumis aux tribunaux
            du canton de domicile d&apos;Aegryn, après tentative de résolution amiable sous 30 jours.
          </Article>
        </div>

        {/* Pied de page signature */}
        <div className="bg-white border border-ag-navy/20 px-8 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ag-navy mb-3">
            Signature électronique enregistrée
          </p>
          <div className="grid grid-cols-3 gap-4 text-[11px] text-gray-500 font-mono">
            <div>
              <p className="text-gray-400 mb-0.5">Date et heure</p>
              <p className="text-gray-700">{signedDate} à {signedTime}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Version</p>
              <p className="text-gray-700">{p.seller_nda_version ?? NDA_VERSIONS.seller}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Signataire</p>
              <p className="text-gray-700">{p.full_name ?? user.email}</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

function Article({ num, title, children }: {
  num: string; title: string; children: React.ReactNode
}) {
  return (
    <div className="border-t border-gray-100 pt-6">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-3">
        Article {num} — {title}
      </h2>
      <div className="text-[13px] text-gray-700 leading-relaxed">{children}</div>
    </div>
  )
}
