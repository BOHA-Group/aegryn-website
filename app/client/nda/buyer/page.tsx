import { redirect }          from 'next/navigation'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS }       from '@/app/api/client/nda/accept/route'
import NdaAcceptForm          from '../NdaAcceptForm'
import { ShieldCheck }        from 'lucide-react'

export default async function BuyerNdaPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles, buyer_nda_accepted_at, buyer_nda_version')
    .eq('id', user.id)
    .single()

  const current = NDA_VERSIONS.buyer
  if (profile?.buyer_nda_accepted_at && profile?.buyer_nda_version === current) {
    redirect('/client/buyer')
  }

  const roles = Array.isArray(profile?.roles) ? profile.roles as string[] : []
  if (!roles.includes('buyer')) redirect('/client/seller')

  const fullName = profile?.full_name ?? user.email ?? ''

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-3xl">

        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck size={20} className="text-ag-navy" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400">Espace Acquéreur — Signature requise</p>
            <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight mt-0.5">
              Accord de Confidentialité — Acquéreur
            </h1>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8 mb-6 space-y-6 text-[14px] font-sans text-ag-gray leading-relaxed">

          <p className="font-sans font-semibold text-ag-black text-[15px]">
            Entre AEGRYN (formerly BOHA-Group, société enregistrée en Suisse) et{' '}
            <span className="text-ag-navy">{fullName}</span> (ci-après « l'Acquéreur »).
          </p>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">1. Objet</h2>
            <p>
              Dans le cadre de l'accès au catalogue d'actifs technologiques certifiés AEGRYN et au processus
              d'acquisition (Expression d'Intérêt, Due Diligence, transaction), l'Acquéreur s'engage à
              maintenir la stricte confidentialité de toutes les informations auxquelles il a accès.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">2. Informations confidentielles</h2>
            <p>Sont considérées comme confidentielles :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>L'identité des cédants et toute information permettant de les identifier</li>
              <li>Les rapports de grade AEGRYN, teasers et documents de présentation des actifs</li>
              <li>L'ensemble des documents de la data room (code source, financiers, contrats, KPI)</li>
              <li>Les conditions des offres soumises et reçues (montants, structuration, earnout)</li>
              <li>Les informations sur les autres acquéreurs participants au processus</li>
              <li>Toute information marquée confidentielle ou dont la nature implique la confidentialité</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">3. Obligations de l'Acquéreur</h2>
            <p>L'Acquéreur s'engage à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ne pas reproduire, copier, photographier, transmettre ou divulguer à des tiers tout document consulté dans la data room AEGRYN</li>
              <li>N'utiliser les informations confidentielles qu'aux seules fins de l'évaluation de l'actif concerné</li>
              <li>Restreindre l'accès aux informations aux seuls membres de son organisation ayant un besoin strict de les connaître</li>
              <li>Ne pas contacter directement le cédant sans l'accord express d'AEGRYN</li>
              <li>Notifier immédiatement AEGRYN de tout accès non autorisé ou toute divulgation accidentelle</li>
              <li>Restituer ou détruire les informations confidentielles à la demande d'AEGRYN ou à l'issue du processus</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">4. Accès à la data room</h2>
            <p>
              L'accès à la data room est soumis à la signature d'un NDA Auction complémentaire par actif
              (ou par session AEGRYN). Le présent accord constitue le socle général de confidentialité
              applicable à l'ensemble des interactions avec la plateforme AEGRYN.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">5. Durée</h2>
            <p>
              Les présentes obligations s'appliquent pendant toute la durée du processus et pendant
              <strong> 5 ans</strong> après la conclusion ou l'abandon du processus, quelle qu'en soit la raison.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">6. Sanctions</h2>
            <p>
              Tout manquement expose l'Acquéreur à des dommages-intérêts calculés sur le préjudice réel subi
              par AEGRYN et/ou le cédant, assortis d'une indemnité forfaitaire minimale de 50 000 € HT.
              AEGRYN se réserve le droit de suspendre immédiatement l'accès à la plateforme.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">7. Droit applicable</h2>
            <p>
              Le présent accord est soumis au droit suisse. Tout litige sera soumis aux tribunaux
              du canton de domicile d'AEGRYN, après tentative de résolution amiable sous 30 jours.
            </p>
          </section>

          <div className="bg-gray-50 border border-gray-200 px-5 py-3">
            <p className="font-mono text-[10px] text-gray-400">Version {NDA_VERSIONS.buyer} — AEGRYN Confidentiality Agreement — Buyer</p>
          </div>
        </div>

        <NdaAcceptForm
          ndaType="buyer"
          version={NDA_VERSIONS.buyer}
          redirect="/client/buyer"
          fullName={fullName}
        />
      </div>
    </div>
  )
}
