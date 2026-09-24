import { redirect }           from 'next/navigation'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS }       from '@/lib/ndaVersions'
import NdaAcceptForm          from '../NdaAcceptForm'
import { ShieldCheck }        from 'lucide-react'

/* NDA générique client — exigé pour toute demande de certification CIFSO 5000
   (accès dossiers de certification + data room). Sans dépendance aux anciens
   rôles acquéreur/cédant : confidentialité des données uniquement. */
export default async function ClientNdaPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles, client_nda_accepted_at, client_nda_version')
    .eq('id', user.id)
    .single()

  const current = NDA_VERSIONS.client
  if (profile?.client_nda_accepted_at && profile?.client_nda_version === current) {
    redirect('/client/seller')
  }

  const roles = Array.isArray(profile?.roles) ? profile.roles as string[] : []
  if (!roles.includes('client')) redirect('/client/account')

  const fullName = profile?.full_name ?? user.email ?? ''

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-3xl">

        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck size={20} className="text-ag-navy" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400">Espace Client — Signature requise</p>
            <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight mt-0.5">
              Accord de Confidentialité — Client
            </h1>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8 mb-6 space-y-6 text-[14px] font-sans text-ag-gray leading-relaxed">

          <p className="font-sans font-semibold text-ag-black text-[15px]">
            Entre Aegryn (société enregistrée en Suisse) et{' '}
            <span className="text-ag-navy">{fullName}</span> (ci-après « le Client »).
          </p>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">1. Objet</h2>
            <p>
              Dans le cadre d'une demande de certification CIFSO 5000 et de l'accès à l'espace
              de gestion des dossiers et à la data room associée, le Client s'engage à la
              stricte confidentialité des informations auxquelles il a accès.
              Le présent accord couvre exclusivement l'accès à des données confidentielles
              à ne pas divulguer.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">2. Informations confidentielles</h2>
            <p>Sont considérées comme confidentielles :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Les rapports d'analyse, grades et évaluations produits par Aegryn dans le cadre du protocole CIFSO</li>
              <li>Les données et documents contenus dans les dossiers de certification et la data room</li>
              <li>Les échanges avec les analystes, auditeurs et partenaires certifiés Aegryn</li>
              <li>Les méthodes, processus et outils propriétaires Aegryn (protocole CIFSO, moteur de grade)</li>
              <li>L'existence et le contenu du processus de certification en cours</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">3. Obligations du Client</h2>
            <p>Le Client s'engage à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ne pas divulguer d'information confidentielle à des tiers sans accord préalable écrit d'Aegryn</li>
              <li>N'utiliser les informations confidentielles qu'aux seules fins de l'évaluation et de la certification</li>
              <li>Ne pas reproduire, copier ou transmettre les documents consultés dans la data room</li>
              <li>Fournir des informations exactes, complètes et à jour dans le cadre du dossier de certification</li>
              <li>Informer immédiatement Aegryn de tout contact direct initié par un tiers introduit dans le cadre du processus</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">4. Durée</h2>
            <p>
              Les présentes obligations s'appliquent pendant toute la durée du processus de
              certification et pendant une période de <strong>3 ans</strong> suivant sa
              conclusion ou son abandon, quelle qu'en soit la raison.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">5. Sanctions</h2>
            <p>
              Tout manquement aux présentes obligations expose le Client à la suspension
              immédiate de son accès à l'espace de certification, ainsi qu'à des
              dommages-intérêts incluant une indemnité forfaitaire minimale de 25 000 CHF HT,
              sans préjudice de tout autre préjudice démontré.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">6. Droit applicable</h2>
            <p>
              Le présent accord est soumis au droit suisse. Tout litige sera soumis aux tribunaux
              du canton de domicile d'Aegryn, après tentative de résolution amiable sous 30 jours.
            </p>
          </section>

          <div className="rounded-lg bg-gray-50 border border-gray-200 px-5 py-3">
            <p className="font-mono text-[10px] text-gray-400">Version {NDA_VERSIONS.client} | Aegryn Confidentiality Agreement — Client</p>
          </div>
        </div>

        <NdaAcceptForm
          ndaType="client"
          version={NDA_VERSIONS.client}
          redirect="/client/seller"
          fullName={fullName}
        />
      </div>
    </div>
  )
}
