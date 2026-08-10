import type { Metadata }      from 'next'
import { redirect }            from 'next/navigation'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NDA_VERSIONS }        from '@/lib/ndaVersions'
import { ShieldCheck }         from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mon NDA Partenaire — Aegryn',
  robots: { index: false, follow: false },
}

export default async function PartnerNdaPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const [{ data: profile }, { data: ndaAcceptance }] = await Promise.all([
    supa
      .from('profiles')
      .select('full_name, partner_nda_accepted_at, partner_nda_version')
      .eq('id', user.id)
      .single(),
    supa
      .from('nda_acceptances')
      .select('ip_address')
      .eq('user_id', user.id)
      .eq('nda_type', 'partner')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const p          = profile as Record<string, unknown> | null
  const acceptedAt = p?.partner_nda_accepted_at as string | null
  const version    = p?.partner_nda_version     as string | null
  const ip         = (ndaAcceptance as Record<string, unknown> | null)?.ip_address as string | null
  const currentVer = NDA_VERSIONS.partner
  const isUpToDate = version === currentVer

  if (!acceptedAt) redirect('/client/nda/partner')

  const signedDate = new Date(acceptedAt).toLocaleDateString('fr-CH', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  const signedTime = new Date(acceptedAt).toLocaleTimeString('fr-CH', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich',
  })
  const fullName = (p?.full_name as string | null) ?? user.email

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Mon NDA Partenaire</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Accord de confidentialité et conditions de partenariat Aegryn — lecture seule.
        </p>
      </div>

      {/* Certificat de signature */}
      <div className="bg-emerald-50 border border-emerald-200 px-6 py-5 flex items-start gap-4 mb-6">
        <ShieldCheck size={18} className="text-emerald-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-sans text-[14px] font-semibold text-emerald-800 mb-3">
            Signature électronique enregistrée
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[11px] font-mono">
            <div>
              <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Signataire</p>
              <p className="text-emerald-900 font-semibold">{fullName}</p>
            </div>
            <div>
              <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Date</p>
              <p className="text-emerald-900">{signedDate}</p>
            </div>
            <div>
              <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Heure (CET)</p>
              <p className="text-emerald-900">{signedTime}</p>
            </div>
            <div>
              <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Version</p>
              <p className="text-emerald-900">{version ?? currentVer}</p>
            </div>
            <div>
              <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Statut</p>
              <p className={isUpToDate ? 'text-emerald-900 font-semibold' : 'text-amber-700 font-semibold'}>
                {isUpToDate ? 'En vigueur' : 'Version antérieure'}
              </p>
            </div>
            {ip && (
              <div>
                <p className="text-emerald-600 mb-0.5 uppercase tracking-widest text-[9px]">Adresse IP</p>
                <p className="text-emerald-900">{ip}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isUpToDate && (
        <div className="bg-amber-50 border border-amber-200 px-5 py-4 mb-6 text-[12px] text-amber-800">
          Une nouvelle version du NDA Partenaire est disponible (version {currentVer}).
          Votre signature porte sur la version {version}. Contactez Aegryn pour toute question.
        </div>
      )}

      {/* Texte intégral — lecture seule */}
      <div className="bg-white border border-gray-200 px-8 py-8 space-y-7 text-[13px] text-gray-700 leading-relaxed">

        <div className="border-b border-gray-100 pb-6">
          <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-400 mb-2">
            Version {version ?? currentVer}
          </p>
          <h2 className="text-[17px] font-bold text-gray-900 leading-snug">
            Accord de Confidentialité et Conditions de Partenariat
          </h2>
          <p className="text-[12px] text-gray-500 mt-1">
            Aegryn (formerly BOHA-Group, société enregistrée en Suisse) · contact@boha-group.com
          </p>
        </div>

        <div className="bg-gray-50 px-5 py-4 text-[12px] space-y-1">
          <p><strong>Entre :</strong> Aegryn (ci-après « Aegryn »)</p>
          <p><strong>Et :</strong> {fullName} (ci-après « le Partenaire »)</p>
        </div>

        <NdaArticle num="1" title="Objet">
          Dans le cadre de la relation de partenariat avec Aegryn — incluant sans limitation l&apos;accès
          à l&apos;annuaire expert Aegryn, la mise en relation avec des cédants et acquéreurs qualifiés,
          et la participation au réseau d&apos;introductions — le Partenaire s&apos;engage à la stricte
          confidentialité des informations auxquelles il a accès.
        </NdaArticle>

        <NdaArticle num="2" title="Informations confidentielles">
          <p>Sont considérées comme confidentielles :</p>
          <ul className="list-none mt-3 space-y-2">
            {[
              'L\'identité et les coordonnées des cédants et acquéreurs introduits ou mis en relation via Aegryn',
              'Les informations sur les actifs en cours de certification ou de cession',
              'Les conditions financières des transactions et le détail des mandats Aegryn',
              'Les informations relatives aux autres partenaires du réseau Aegryn',
              'Les méthodes, processus et outils propriétaires Aegryn (protocole C/I/F/S, grade engine)',
              'Toute information transmise dans le cadre d\'une introduction ou d\'un apport d\'affaires',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </NdaArticle>

        <NdaArticle num="3" title="Obligations du Partenaire">
          <p>Le Partenaire s&apos;engage à :</p>
          <ul className="list-none mt-3 space-y-2">
            {[
              'Ne pas contacter directement les cédants ou acquéreurs introduits par Aegryn en dehors du cadre formel de la relation partenariale',
              'Ne pas reproduire, transmettre ou exploiter à titre personnel les informations confidentielles auxquelles il a accès dans l\'annuaire expert ou via les mandats',
              'Ne pas utiliser les mises en relation Aegryn pour contourner le processus et percevoir directement une rétrocession ou contrepartie de toute nature',
              'Informer immédiatement Aegryn de tout contact direct initié par un cédant ou acquéreur introduit dans le cadre d\'un mandat Aegryn',
              'Respecter l\'exclusivité territoriale ou sectorielle éventuellement accordée par Aegryn dans le cadre d\'un mandat signé',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </NdaArticle>

        <NdaArticle num="4" title="Modèle économique — Absence de commission">
          <p>
            Le Partenaire reconnaît et accepte expressément que son accès au réseau Aegryn est
            exclusivement conditionné au paiement d&apos;un abonnement Fiche Expert (89 CHF HT/mois ou
            tarif annuel en vigueur). Aegryn ne perçoit <strong>aucune commission</strong> sur les
            honoraires facturés par le Partenaire à ses clients, quelle que soit la nature de la
            mission (conseil, due diligence, assistance juridique, audit technique, etc.).
          </p>
          <p className="mt-3">
            Le Partenaire est un prestataire indépendant. Il fixe <strong>librement ses honoraires</strong>,
            ses conditions d&apos;intervention et ses modalités contractuelles avec ses clients. Il n&apos;est pas
            mandataire d&apos;Aegryn et reste seul responsable de ses prestations.
          </p>
        </NdaArticle>

        <NdaArticle num="5" title="Programme de parrainage — Fiche Expert">
          <p>Dans le cadre de son programme de développement réseau, Aegryn offre au Partenaire
          détenant un abonnement Fiche Expert actif la possibilité de parrainer d&apos;autres professionnels :</p>
          <ul className="list-none mt-3 space-y-2">
            {[
              'Parrain : 1 mois offert sur son propre abonnement pour chaque filleul souscrivant un abonnement Fiche Expert.',
              'Filleul : 1 mois offert dès la souscription avec un code de parrainage valide.',
              'Le programme est réservé aux Partenaires disposant d\'un abonnement actif au moment de l\'attribution du crédit.',
              'Aegryn se réserve le droit de modifier ou de suspendre le programme avec un préavis de 30 jours.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </NdaArticle>

        <NdaArticle num="6" title="Durée">
          Les présentes obligations s&apos;appliquent pendant toute la durée de la relation partenariale
          et pendant <strong>3 ans</strong> après sa cessation, quelle qu&apos;en soit la cause.
          Les crédits de parrainage acquis restent valables jusqu&apos;à leur utilisation effective.
        </NdaArticle>

        <NdaArticle num="7" title="Sanctions">
          Tout manquement expose le Partenaire à la résiliation immédiate de la relation partenariale,
          à la perte des crédits de parrainage acquis, à la suspension de la Fiche Expert et à des
          dommages-intérêts incluant une indemnité forfaitaire minimale de <strong>25 000 CHF HT</strong>,
          sans préjudice de tout autre préjudice démontré.
        </NdaArticle>

        <NdaArticle num="8" title="Droit applicable">
          Le présent accord est soumis au droit suisse. Tout litige sera soumis aux tribunaux
          du canton de domicile d&apos;Aegryn, après tentative de résolution amiable sous 30 jours.
        </NdaArticle>
      </div>

      {/* Pied de page signature */}
      <div className="bg-white border border-ag-navy/20 px-8 py-5 mt-0">
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
            <p className="text-gray-700">{version ?? currentVer}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Signataire</p>
            <p className="text-gray-700">{fullName}</p>
          </div>
        </div>
      </div>

    </div>
  )
}

function NdaArticle({ num, title, children }: {
  num: string; title: string; children: React.ReactNode
}) {
  return (
    <div className="border-t border-gray-100 pt-6">
      <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-3">
        Article {num} — {title}
      </h3>
      <div className="text-[13px] text-gray-700 leading-relaxed">{children}</div>
    </div>
  )
}
