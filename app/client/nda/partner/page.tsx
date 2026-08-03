import { redirect }          from 'next/navigation'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS }       from '@/lib/ndaVersions'
import NdaAcceptForm          from '../NdaAcceptForm'
import { ShieldCheck }        from 'lucide-react'

export default async function PartnerNdaPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles, partner_nda_accepted_at, partner_nda_version')
    .eq('id', user.id)
    .single()

  const current = NDA_VERSIONS.partner
  if (profile?.partner_nda_accepted_at && profile?.partner_nda_version === current) {
    redirect('/client/partner')
  }

  const roles = Array.isArray(profile?.roles) ? profile.roles as string[] : []
  if (!roles.includes('partner')) redirect('/client/buyer')

  const fullName = profile?.full_name ?? user.email ?? ''

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-3xl">

        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck size={20} className="text-ag-navy" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400">Espace Partenaire — Signature requise</p>
            <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight mt-0.5">
              Accord de Confidentialité — Partenaire
            </h1>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8 mb-6 space-y-6 text-[14px] font-sans text-ag-gray leading-relaxed">

          <p className="font-sans font-semibold text-ag-black text-[15px]">
            Entre AEGRYN (formerly BOHA-Group, société enregistrée en Suisse) et{' '}
            <span className="text-ag-navy">{fullName}</span> (ci-après « le Partenaire »).
          </p>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">1. Objet</h2>
            <p>
              Dans le cadre de la relation de partenariat avec AEGRYN — incluant sans limitation l'accès
              à l'annuaire expert AEGRYN, la mise en relation avec des cédants et acquéreurs qualifiés,
              et la participation au réseau d'introductions — le Partenaire s'engage à la stricte
              confidentialité des informations auxquelles il a accès.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">2. Informations confidentielles</h2>
            <p>Sont considérées comme confidentielles :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>L'identité et les coordonnées des cédants et acquéreurs introduits ou mis en relation via AEGRYN</li>
              <li>Les informations sur les actifs en cours de certification ou de cession</li>
              <li>Les conditions financières des transactions et le détail des mandats AEGRYN</li>
              <li>Les informations relatives aux autres partenaires du réseau AEGRYN</li>
              <li>Les méthodes, processus et outils propriétaires AEGRYN (protocole C/I/F/S, grade engine)</li>
              <li>Toute information transmise dans le cadre d'une introduction ou d'un apport d'affaires</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">3. Obligations du Partenaire</h2>
            <p>Le Partenaire s'engage à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ne pas contacter directement les cédants ou acquéreurs introduits par AEGRYN en dehors du cadre formel de la relation partenariale</li>
              <li>Ne pas reproduire, transmettre ou exploiter à titre personnel les informations confidentielles auxquelles il a accès dans l'annuaire expert ou via les mandats</li>
              <li>Ne pas utiliser les mises en relation AEGRYN pour contourner le processus et percevoir directement une rétrocession ou contrepartie de toute nature</li>
              <li>Informer immédiatement AEGRYN de tout contact direct initié par un cédant ou acquéreur introduit dans le cadre d'un mandat AEGRYN</li>
              <li>Respecter l'exclusivité territoriale ou sectorielle éventuellement accordée par AEGRYN dans le cadre d'un mandat signé</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">4. Modèle économique — Absence de commission</h2>
            <p>
              Le Partenaire reconnaît et accepte expressément que son accès au réseau AEGRYN est
              exclusivement conditionné au paiement d'un abonnement Fiche Expert (89 € HT/mois ou
              tarif annuel en vigueur). AEGRYN ne perçoit <strong>aucune commission</strong> sur les
              honoraires facturés par le Partenaire à ses clients, quelle que soit la nature de la
              mission (conseil, due diligence, assistance juridique, audit technique, etc.).
            </p>
            <p className="mt-3">
              Le Partenaire est un prestataire indépendant. Il n'est pas mandataire d'AEGRYN, ne représente
              pas AEGRYN dans ses relations avec les clients, et reste seul responsable de ses prestations
              et de sa tarification. Les mises en relation AEGRYN constituent un service de référencement,
              non un apport d'affaires donnant lieu à rétrocession.
            </p>
            <p className="mt-3 text-[12px] text-gray-500">
              Les conditions complètes de l'abonnement Fiche Expert et du programme de parrainage sont
              détaillées en Section XII des CGV AEGRYN disponibles sur aegryn.com/terms/cgv.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">5. Programme de parrainage — Fiche Expert</h2>
            <p>
              Dans le cadre de son programme de développement réseau, AEGRYN offre au Partenaire
              détenant un abonnement Fiche Expert actif la possibilité de parrainer d'autres professionnels :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Parrain :</strong> tout Partenaire AEGRYN dont un filleul souscrit un abonnement
                Fiche Expert bénéficie de <strong>1 mois offert</strong> sur son propre abonnement en cours,
                crédité automatiquement à la première échéance suivant la souscription du filleul.
              </li>
              <li>
                <strong>Filleul :</strong> tout nouveau Partenaire s'inscrivant avec un code de parrainage
                valide bénéficie de <strong>1 mois offert</strong> dès la souscription de sa Fiche Expert,
                déduction faite sur la première facture.
              </li>
              <li>Le programme est réservé aux Partenaires disposant d'un abonnement Fiche Expert actif au moment de l'attribution du crédit.</li>
              <li>AEGRYN se réserve le droit de modifier ou de suspendre le programme de parrainage avec un préavis de 30 jours.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">6. Durée</h2>
            <p>
              Les présentes obligations s'appliquent pendant toute la durée de la relation partenariale
              et pendant <strong>3 ans</strong> après sa cessation, quelle qu'en soit la cause.
              Les crédits de parrainage acquis restent valables jusqu'à leur utilisation effective.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">7. Sanctions</h2>
            <p>
              Tout manquement expose le Partenaire à la résiliation immédiate de la relation partenariale,
              à la perte des crédits de parrainage acquis, à la suspension de la Fiche Expert et à des
              dommages-intérêts incluant une indemnité forfaitaire minimale de 25 000 € HT,
              sans préjudice de tout autre préjudice démontré.
            </p>
          </section>

          <section>
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-widest text-ag-black mb-3">8. Droit applicable</h2>
            <p>
              Le présent accord est soumis au droit suisse. Tout litige sera soumis aux tribunaux
              du canton de domicile d'AEGRYN, après tentative de résolution amiable sous 30 jours.
            </p>
          </section>

          <div className="bg-gray-50 border border-gray-200 px-5 py-3">
            <p className="font-mono text-[10px] text-gray-400">Version {NDA_VERSIONS.partner} — AEGRYN Confidentiality Agreement — Partner</p>
          </div>
        </div>

        <NdaAcceptForm
          ndaType="partner"
          version={NDA_VERSIONS.partner}
          redirect="/client/partner"
          fullName={fullName}
        />
      </div>
    </div>
  )
}
