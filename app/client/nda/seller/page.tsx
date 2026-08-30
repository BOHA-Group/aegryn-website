import { redirect }          from 'next/navigation'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS }       from '@/lib/ndaVersions'
import NdaAcceptForm          from '../NdaAcceptForm'
import { ShieldCheck }        from 'lucide-react'

export default async function SellerNdaPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')


  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles, seller_nda_accepted_at, seller_nda_version')
    .eq('id', user.id)
    .single()

  const current = NDA_VERSIONS.seller
  if (profile?.seller_nda_accepted_at && profile?.seller_nda_version === current) {
    redirect('/client/seller')
  }

  const roles = Array.isArray(profile?.roles) ? profile.roles as string[] : []
  if (!roles.includes('seller')) redirect('/client/buyer')

  const fullName = profile?.full_name ?? user.email ?? ''

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-3xl">

        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck size={20} className="text-ag-navy" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400">Espace Cédant — Signature requise</p>
            <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight mt-0.5">
              Accord de Confidentialité — Cédant
            </h1>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8 mb-6 space-y-6 text-[14px] font-sans text-ag-gray leading-relaxed">

          <p className="font-sans font-semibold text-ag-black text-[15px]">
            Entre Aegryn (, société enregistrée en Suisse) et{' '}
            <span className="text-ag-navy">{fullName}</span> (ci-après « le Cédant »).
          </p>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">1. Objet</h2>
            <p>
              Dans le cadre du processus de certification et de cession d'un actif technologique via Aegryn,
              le Cédant s'engage à maintenir la stricte confidentialité de toutes les informations échangées
              avec Aegryn, ses analystes, ses partenaires certifiés et les acquéreurs qualifiés.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">2. Informations confidentielles</h2>
            <p>Sont considérées comme confidentielles :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Les rapports d'analyse, grades et évaluations produits par Aegryn</li>
              <li>Les informations relatives aux acquéreurs qualifiés ayant exprimé un intérêt</li>
              <li>Les conditions et modalités des offres reçues (Expression d'Intérêt, Accord de Principe)</li>
              <li>Les communications internes et notes d'évaluation Aegryn</li>
              <li>L'existence même du processus de cession jusqu'à sa finalisation</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">3. Obligations du Cédant</h2>
            <p>Le Cédant s'engage à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ne pas divulguer à des tiers l'existence du processus de certification ni les informations confidentielles sans accord préalable écrit d'Aegryn</li>
              <li>Fournir des informations exactes, complètes et à jour sur l'actif soumis, notamment ses états financiers, KPI, contrats et situation juridique</li>
              <li>Garantir disposer de tous les droits, titres et autorisations nécessaires pour procéder à la cession</li>
              <li>Ne pas engager de négociations parallèles avec des acquéreurs introduits ou identifiés par Aegryn pendant la durée du mandat</li>
              <li>Notifier immédiatement Aegryn de toute approche directe d'un acquéreur introduit par Aegryn, sous peine d'exigibilité immédiate des honoraires</li>
              <li>Ne pas conclure de transaction avec un acquéreur présenté par Aegryn en dehors du cadre formel du mandat</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">4. Honoraires de cession</h2>
            <p>
              En contrepartie des services d'intermédiation, de certification et de conduite du processus,
              le Cédant s'acquittera d'un honoraire de succès calculé sur le prix de cession final,
              selon la grille dégressive officielle Aegryn en vigueur au moment de la signature du mandat :
            </p>
            <table className="mt-3 w-full text-[12px] font-mono border-collapse">
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
                  ['250 001 € – 500 000 €', '9 %',  '25 000 CHF'],
                  ['500 001 € – 1 000 000 €', '8 %','25 000 CHF'],
                  ['1 000 001 € – 2 500 000 €', '7 %','25 000 CHF'],
                  ['2 500 001 € – 5 000 000 €', '6 %','25 000 CHF'],
                  ['> 5 000 000 €', 'taux convenu au mandat', '25 000 CHF'],
                ].map(([tranche, taux, min]) => (
                  <tr key={tranche}>
                    <td className="px-3 py-1.5 border border-gray-200">{tranche}</td>
                    <td className="px-3 py-1.5 border border-gray-200 text-right">{taux}</td>
                    <td className="px-3 py-1.5 border border-gray-200 text-right">{min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[12px] text-gray-500">
              Les honoraires sont exigibles à la date de signature de l'acte de cession définitif.
              En cas de transaction conclue avec un acquéreur introduit par Aegryn en dehors du mandat
              formel, les honoraires sont calculés sur la base du prix de cession réel et majorés de 50 %.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">4bis. Frais en cas de non-réalisation de la transaction</h2>
            <p>
              Dans le cas où l&apos;actif admis en Certification Transaction serait retiré du catalogue ou
              qu&apos;aucune transaction ne se réalise à l&apos;issue du processus Aegryn, des frais
              fixes minimaux de <strong>CHF 2 000 HT</strong> sont dus à Aegryn en contrepartie du
              travail engagé par ses équipes (analyse C/I/F/S, grade officiel, catalogue, communication,
              marketing, visibilité produit). Exigibles à la date de retrait ou de clôture sans transaction,
              facturés directement au Cédant. Non applicable en cas de condition suspensive non levée
              dûment documentée.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">5. Durée</h2>
            <p>
              Les présentes obligations s'appliquent pendant toute la durée du processus Aegryn et pendant
              une période de <strong>3 ans</strong> suivant la conclusion ou l'abandon du processus,
              quelle qu'en soit la raison. L'obligation de paiement des honoraires survit à toute résiliation.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">6. Sanctions</h2>
            <p>
              Tout manquement aux présentes obligations expose le Cédant à des dommages-intérêts,
              incluant notamment le paiement immédiat des honoraires de succès majorés, la perte du
              bénéfice du processus Aegryn et une indemnité forfaitaire minimale de 25 000 CHF HT,
              sans préjudice de tout autre préjudice démontré.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">7. Droit applicable</h2>
            <p>
              Le présent accord est soumis au droit suisse. Tout litige sera soumis aux tribunaux
              du canton de domicile d'Aegryn, après tentative de résolution amiable sous 30 jours.
            </p>
          </section>

          <div className="bg-gray-50 border border-gray-200 px-5 py-3">
            <p className="font-mono text-[10px] text-gray-400">Version {NDA_VERSIONS.seller} — Aegryn Confidentiality Agreement — Seller</p>
          </div>
        </div>

        <NdaAcceptForm
          ndaType="seller"
          version={NDA_VERSIONS.seller}
          redirect="/client/seller"
          fullName={fullName}
        />
      </div>
    </div>
  )
}
