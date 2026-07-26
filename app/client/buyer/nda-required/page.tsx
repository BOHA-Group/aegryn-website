import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { NdaAcceptForm } from '@/components/buyer/NdaAcceptForm'

export const metadata: Metadata = {
  title: 'Accord de confidentialité — Espace Acquéreur AEGRYN',
  robots: { index: false, follow: false },
}

const NDA_VERSION = 'v1.0-2026-07'

export default async function NdaRequiredPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  /* Si déjà signé, rediriger directement */
  const { data: existing } = await supa
    .from('nda_signatures')
    .select('signed_at')
    .eq('buyer_id', user.id)
    .eq('scope', 'catalog_general')
    .not('signed_at', 'is', null)
    .maybeSingle()

  if (existing) redirect('/client/buyer/catalogue')

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-ag-navy text-white px-6 py-5 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Shield size={16} className="text-ag-apex shrink-0" />
          <div>
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-ag-apex font-bold">Étape requise</p>
            <p className="text-[13px] font-semibold text-white/90">Accord de confidentialité — AEGRYN Auction</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* Intro */}
        <div className="bg-white border border-gray-200 px-8 py-6">
          <p className="text-[13px] text-gray-600 leading-relaxed">
            Avant d'accéder au catalogue AEGRYN Auction, vous devez lire et accepter l'accord de
            confidentialité ci-dessous. Cet accord est <strong className="text-gray-900">obligatoire</strong> et
            constitue un engagement contractuel de confidentialité envers AEGRYN et les vendeurs.
            Votre signature est horodatée et journalisée à des fins légales.
          </p>
        </div>

        {/* Texte NDA complet */}
        <div className="bg-white border border-gray-200 px-8 py-8 space-y-8 text-[13px] text-gray-700 leading-relaxed">

          {/* Titre */}
          <div className="border-b border-gray-100 pb-6">
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-400 mb-2">NDA — Version {NDA_VERSION}</p>
            <h1 className="text-[17px] font-bold text-gray-900 leading-snug">
              Conditions de Confidentialité Acquéreur
            </h1>
            <p className="text-[12px] text-gray-500 mt-1">AEGRYN (formerly BOHA-Group Sàrl)</p>
          </div>

          {/* Parties */}
          <div className="bg-gray-50 px-5 py-4 text-[12px] space-y-2">
            <p><strong>Entre les soussignés :</strong></p>
            <p>
              <strong>AEGRYN (formerly BOHA-Group Sàrl)</strong>, société enregistrée en Suisse,
              ci-après « AEGRYN »,
            </p>
            <p className="text-gray-400">Et</p>
            <p>
              L'utilisateur identifié par les informations renseignées lors de son inscription sur
              la plateforme AEGRYN (nom, prénom ou raison sociale, email professionnel),
              ci-après « l'Acquéreur »,
            </p>
          </div>

          <NdaArticle num="1" title="Objet">
            Le présent accord de confidentialité (« NDA ») encadre l'accès de l'Acquéreur au catalogue
            AEGRYN Auction, aux fiches d'actifs, aux rapports de grade, et à tout document de la data
            room mis à disposition dans le cadre du processus de certification et de transaction AEGRYN.
            <br /><br />
            L'acceptation du présent NDA est une condition préalable et obligatoire à tout accès au
            catalogue, quel que soit le niveau d'accès (aperçu anonymisé ou dossier complet
            post-qualification).
          </NdaArticle>

          <NdaArticle num="2" title="Définition des informations confidentielles">
            Sont considérées comme informations confidentielles :
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Toute information relative à l'identité du vendeur ou de l'entité cédante, avant décision explicite de mise en relation par AEGRYN",
                "Toute donnée financière, technique, commerciale ou juridique contenue dans une fiche d'actif ou un document de data room",
                "Le contenu des rapports de grade AEGRYN, y compris les scores, sous-codes et réserves",
                "Toute information relative à d'autres acquéreurs, à leurs offres, ou à l'état d'avancement d'une négociation",
                "L'existence même d'un processus de cession en cours sur un actif donné",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </NdaArticle>

          <NdaArticle num="3" title="Engagements de l'Acquéreur">
            <div className="space-y-4 mt-2">
              <SubSection label="3.1 Confidentialité stricte">
                Ne divulguer aucune information confidentielle à un tiers, y compris à ses conseils,
                employés ou partenaires, sauf si ceux-ci sont eux-mêmes tenus par une obligation de
                confidentialité équivalente et strictement nécessaire à l'évaluation de l'opportunité.
              </SubSection>
              <SubSection label="3.2 Usage limité">
                N'utiliser les informations confidentielles qu'aux seules fins d'évaluer une opportunité
                d'acquisition via AEGRYN — jamais à des fins concurrentielles, commerciales, de
                recrutement, ou de reproduction technique.
              </SubSection>
              <SubSection label="3.3 Non-reproduction">
                Ne pas télécharger, copier, capturer, photographier, ou reproduire par quelque moyen
                que ce soit tout document consulté dans la data room AEGRYN, y compris par capture
                d'écran, photographie d'écran, ou tout autre moyen de contournement des mesures de
                protection technique mises en place.
              </SubSection>
              <SubSection label="3.4 Reconnaissance des limites techniques">
                L'Acquéreur reconnaît que les documents consultés sont protégés par des mesures
                techniques de dissuasion (blocage de téléchargement, détection de tentative de
                capture d'écran, filigrane nominatif). L'Acquéreur reconnaît que ces mesures
                constituent une dissuasion raisonnable dont l'efficacité ne peut être garantie à 100%
                face à des moyens de contournement externes, et accepte que son engagement de
                confidentialité au titre du présent NDA s'applique indépendamment de l'efficacité de
                ces mesures techniques.
              </SubSection>
              <SubSection label="3.5 Non-contournement">
                Ne pas contacter directement, ni tenter de contacter, le vendeur ou toute partie liée
                à un actif consulté via AEGRYN, en dehors du processus AEGRYN, pendant une durée de
                24 mois à compter de la première consultation.
              </SubSection>
              <SubSection label="3.6 Non-divulgation de l'existence du processus">
                Ne pas révéler à un tiers l'existence même d'un processus de cession en cours sur un
                actif consulté, y compris son secteur, sa taille approximative, ou toute donnée
                permettant son identification.
              </SubSection>
            </div>
          </NdaArticle>

          <NdaArticle num="4" title="Traçabilité et consentement à la journalisation">
            L'Acquéreur reconnaît et accepte que :
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Chaque consultation de document est horodatée et journalisée (identité, date, heure, adresse IP)",
                "Toute tentative de capture d'écran ou de contournement des protections techniques est détectée et journalisée",
                "Ces journaux peuvent être utilisés comme preuve en cas de manquement au présent NDA",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ag-navy mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </NdaArticle>

          <NdaArticle num="5" title="Durée">
            Les obligations de confidentialité du présent NDA restent en vigueur pendant une durée de
            <strong className="text-gray-900"> 5 ans</strong> à compter de la première consultation d'un
            document via la plateforme AEGRYN, y compris après la clôture, l'abandon, ou le refus d'une
            opportunité d'acquisition, et y compris après la suppression du compte de l'Acquéreur.
          </NdaArticle>

          <NdaArticle num="6" title="Sanctions en cas de manquement">
            En cas de violation du présent NDA, l'Acquéreur s'expose à :
            <ul className="mt-3 space-y-2 list-none">
              {[
                "La suspension immédiate et définitive de son accès à la plateforme AEGRYN",
                "Une indemnisation des préjudices subis par AEGRYN et/ou le vendeur concerné",
                "Toute action judiciaire que AEGRYN ou le vendeur jugerait utile d'engager",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </NdaArticle>

          <NdaArticle num="7" title="Droit applicable et juridiction">
            Le présent NDA est soumis au droit suisse. Tout litige relevant du présent NDA sera soumis
            à la compétence exclusive des tribunaux du canton de domicile d'AEGRYN.
          </NdaArticle>

          <NdaArticle num="8" title="Acceptation">
            En cochant les cases ci-dessous et en cliquant sur « Accepter et accéder au catalogue »,
            l'Acquéreur reconnaît avoir lu, compris et accepté sans réserve l'intégralité des
            dispositions du présent NDA.
          </NdaArticle>
        </div>

        {/* Formulaire d'acceptation */}
        <div className="bg-white border border-ag-navy/20 px-8 py-6 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ag-navy">
            Article 8 — Acceptation
          </p>
          <NdaAcceptForm redirectTo="/client/buyer/catalogue" ndaVersion={NDA_VERSION} />
        </div>

      </div>
    </main>
  )
}

/* ── Composants helpers ─────────────────────────────────────────────────── */

function NdaArticle({ num, title, children }: {
  num: string
  title: string
  children: React.ReactNode
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

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pl-4 border-l-2 border-gray-100">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      <p className="text-[13px] text-gray-600 leading-relaxed">{children}</p>
    </div>
  )
}
