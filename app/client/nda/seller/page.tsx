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
            Entre AEGRYN (formerly BOHA-Group, société enregistrée en Suisse) et{' '}
            <span className="text-ag-navy">{fullName}</span> (ci-après « le Cédant »).
          </p>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">1. Objet</h2>
            <p>
              Dans le cadre du processus de certification et de cession d'un actif technologique via AEGRYN,
              le Cédant s'engage à maintenir la stricte confidentialité de toutes les informations échangées
              avec AEGRYN, ses analystes, ses partenaires certifiés et les acquéreurs qualifiés.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">2. Informations confidentielles</h2>
            <p>Sont considérées comme confidentielles :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Les rapports d'analyse, grades et évaluations produits par AEGRYN</li>
              <li>Les informations relatives aux acquéreurs qualifiés ayant exprimé un intérêt</li>
              <li>Les conditions et modalités des offres reçues (Expression d'Intérêt, Accord de Principe)</li>
              <li>Les communications internes et notes d'évaluation AEGRYN</li>
              <li>L'existence même du processus de cession jusqu'à sa finalisation</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">3. Obligations du Cédant</h2>
            <p>Le Cédant s'engage à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ne pas divulguer à des tiers l'existence du processus de certification ni les informations confidentielles sans accord préalable écrit d'AEGRYN</li>
              <li>Fournir des informations exactes, complètes et à jour sur l'actif soumis</li>
              <li>Garantir disposer de tous les droits nécessaires pour procéder à la cession</li>
              <li>Ne pas engager de négociations parallèles avec des acquéreurs introduits par AEGRYN pendant la durée du mandat exclusif</li>
              <li>Notifier immédiatement AEGRYN de toute approche directe d'un acquéreur introduit par AEGRYN</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">4. Durée</h2>
            <p>
              Les présentes obligations s'appliquent pendant toute la durée du processus AEGRYN et pendant
              une période de <strong>3 ans</strong> suivant la conclusion ou l'abandon du processus,
              quelle qu'en soit la raison.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">5. Sanctions</h2>
            <p>
              Tout manquement aux présentes obligations expose le Cédant à des dommages-intérêts,
              incluant notamment la perte du bénéfice du processus AEGRYN et une indemnité forfaitaire
              minimale de 25 000 € HT, sans préjudice de tout autre préjudice démontré.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">6. Droit applicable</h2>
            <p>
              Le présent accord est soumis au droit suisse. Tout litige sera soumis aux tribunaux
              du canton de domicile d'AEGRYN, après tentative de résolution amiable sous 30 jours.
            </p>
          </section>

          <div className="bg-gray-50 border border-gray-200 px-5 py-3">
            <p className="font-mono text-[10px] text-gray-400">Version {NDA_VERSIONS.seller} — AEGRYN Confidentiality Agreement — Seller</p>
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
