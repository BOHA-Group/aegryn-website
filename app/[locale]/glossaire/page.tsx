import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import Link                from 'next/link'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')

/* ── Glossary data — FR + EN ───────────────────────────────────────────── */
const TERMS: { letter: string; terms: { id: string; name: string; def: { fr: string; en: string } }[] }[] = [
  {
    letter: 'A',
    terms: [
      { id: 'arr', name: 'ARR', def: { fr: 'Annual Recurring Revenue — Le revenu annuel récurrent, base de calcul des multiples de valorisation SaaS. Ne pas confondre avec le revenu total qui inclut les revenus one-shot.', en: 'Annual Recurring Revenue — The annual recurring revenue, basis for SaaS valuation multiples. Do not confuse with total revenue which includes one-shot revenues.' } },
      { id: 'asset-deal', name: 'Asset deal', def: { fr: 'Acquisition des actifs uniquement (code, IP, contrats, clients) sans reprendre la structure légale de la société. Opposé au share deal.', en: 'Acquisition of assets only (code, IP, contracts, clients) without taking on the legal company structure. Opposite of a share deal.' } },
    ],
  },
  {
    letter: 'C',
    terms: [
      { id: 'cac', name: 'CAC', def: { fr: 'Customer Acquisition Cost — Coût d\'acquisition d\'un client. Le ratio LTV:CAC > 3:1 est le seuil minimum pour un SaaS B2B sain.', en: 'Customer Acquisition Cost — Cost of acquiring a client. An LTV:CAC ratio > 3:1 is the minimum threshold for a healthy B2B SaaS.' } },
      { id: 'churn', name: 'Churn', def: { fr: 'Taux d\'attrition. Churn client (% de clients perdus) vs churn revenu (% de revenu perdu). Le churn revenu est plus significatif pour la valorisation.', en: 'Attrition rate. Client churn (% of clients lost) vs revenue churn (% of revenue lost). Revenue churn is more significant for valuation.' } },
      { id: 'closing', name: 'Closing', def: { fr: 'Finalisation juridique et financière de la transaction. Signature du SPA + virement du solde du prix + transfert des droits.', en: 'Legal and financial completion of the transaction. SPA signature + balance transfer + rights transfer.' } },
    ],
  },
  {
    letter: 'D',
    terms: [
      { id: 'data-room', name: 'Data room', def: { fr: 'Espace sécurisé de partage de documents entre vendeur et acquéreur qualifié, sous NDA. Contient les éléments d\'audit complets (financiers, techniques, juridiques).', en: 'Secure document sharing space between seller and qualified acquirer, under NDA. Contains complete audit materials (financial, technical, legal).' } },
      { id: 'due-diligence', name: 'Due diligence', def: { fr: 'Processus d\'audit approfondi mené par l\'acquéreur avant closing. Couvre les dimensions technique, juridique, financière, et commerciale.', en: 'In-depth audit process conducted by the acquirer before closing. Covers technical, legal, financial, and commercial dimensions.' } },
    ],
  },
  {
    letter: 'E',
    terms: [
      { id: 'earnout', name: 'Earnout', def: { fr: 'Complément de prix conditionnel versé après le closing, basé sur l\'atteinte d\'objectifs définis (ARR, croissance, rétention). Mécanisme d\'alignement d\'intérêts entre vendeur et acquéreur.', en: 'Conditional price supplement paid after closing, based on achieving defined targets (ARR, growth, retention). An interest-alignment mechanism between seller and acquirer.' } },
      { id: 'escrow', name: 'Escrow (séquestre)', def: { fr: 'Montant bloqué par une tierce partie (banque ou notaire) pendant la période entre la signature et le closing. Garantit le vendeur contre le défaut de paiement.', en: 'Amount held by a third party (bank or notary) during the period between signing and closing. Protects the seller against payment default.' } },
    ],
  },
  {
    letter: 'G',
    terms: [
      { id: 'grade-aeg', name: 'Grade AEG', def: { fr: 'Certification indépendante des analystes AEGRYN sur un actif tech, émise selon un protocole reproductible. De ★ (Exceptionnel) à B (Correct). Non attribué = Refusé. Basé sur 4 dimensions : Code, IP, Finance, Sécurité.', en: 'Independent certification from AEGRYN analysts on a tech asset, issued following a reproducible protocol. From ★ (Exceptional) to B (Standard). Not assigned = Refused. Based on 4 dimensions: Code, IP, Finance, Security.' } },
    ],
  },
  {
    letter: 'L',
    terms: [
      { id: 'loi', name: 'LOI (Letter of Intent)', def: { fr: 'Lettre d\'intention non-engageante. Première formalisation de l\'accord entre acheteur et vendeur sur le prix indicatif et les conditions principales.', en: 'Non-binding letter of intent. First formalisation of the agreement between buyer and seller on the indicative price and main conditions.' } },
      { id: 'ltv', name: 'LTV', def: { fr: 'Lifetime Value — Revenu total généré par un client sur sa durée de vie. Formule : LTV = ARPU × (1 / churn mensuel).', en: 'Lifetime Value — Total revenue generated by a client over their lifetime. Formula: LTV = ARPU × (1 / monthly churn).' } },
    ],
  },
  {
    letter: 'M',
    terms: [
      { id: 'mrr', name: 'MRR', def: { fr: 'Monthly Recurring Revenue — L\'ARR divisé par 12. Utile pour les actifs jeunes ou en forte croissance mensuelle.', en: 'Monthly Recurring Revenue — ARR divided by 12. Useful for young or fast-growing assets.' } },
      { id: 'multiple-arr', name: 'Multiple ARR', def: { fr: 'Prix de cession exprimé en multiple de l\'ARR annuel. Exemple : actif avec 500K€ ARR vendu 2M€ = multiple de 4x ARR. Indicateur principal de valorisation SaaS.', en: 'Sale price expressed as a multiple of annual ARR. Example: asset with €500K ARR sold for €2M = 4x ARR multiple. Primary SaaS valuation indicator.' } },
    ],
  },
  {
    letter: 'N',
    terms: [
      { id: 'nrr', name: 'NRR', def: { fr: 'Net Revenue Retention — Mesure l\'évolution du revenu sur une cohorte de clients existants. NRR > 100% = expansion nette. Indicateur critique pour les multiples premium (NRR > 110% → multiples top quartile).', en: 'Net Revenue Retention — Measures revenue evolution on a cohort of existing clients. NRR > 100% = net expansion. Critical indicator for premium multiples (NRR > 110% → top quartile multiples).' } },
    ],
  },
  {
    letter: 'P',
    terms: [
      { id: 'pe', name: 'PE (Private Equity)', def: { fr: 'Fonds d\'investissement qui acquiert pour restructurer et revendre à horizon 3–7 ans. Représente environ 58% des acquéreurs SaaS en Europe en 2025.', en: 'Investment fund that acquires to restructure and resell at a 3–7 year horizon. Represents approximately 58% of SaaS acquirers in Europe in 2025.' } },
    ],
  },
  {
    letter: 'S',
    terms: [
      { id: 'search-fund', name: 'Search Fund', def: { fr: 'Véhicule créé par un entrepreneur (le searcher) pour lever du capital, trouver une entreprise à acquérir, et l\'opérer personnellement. Modèle en forte croissance en Europe.', en: 'Vehicle created by an entrepreneur (the searcher) to raise capital, find a company to acquire, and operate it personally. A fast-growing model in Europe.' } },
      { id: 'share-deal', name: 'Share deal', def: { fr: 'Rachat de la société entière (ses parts ou actions) qui détient l\'actif. L\'acquéreur hérite de tous les actifs ET passifs. Opposé à l\'asset deal.', en: 'Acquisition of the entire company (its shares) holding the asset. The acquirer inherits all assets AND liabilities. Opposite of an asset deal.' } },
      { id: 'spa', name: 'SPA (Share Purchase Agreement)', def: { fr: 'Acte de cession final dans le cas d\'un share deal. Document juridique principal de la transaction, signé au closing.', en: 'Final transfer deed in the case of a share deal. The main legal document of the transaction, signed at closing.' } },
      { id: 'strategic-buyer', name: 'Strategic buyer', def: { fr: 'Acquéreur industriel qui intègre l\'actif à son activité existante (acqui-hire, intégration technique, expansion verticale). Peut payer des primes significatives vs les fonds PE.', en: 'Industrial acquirer who integrates the asset into their existing activity (acqui-hire, technical integration, vertical expansion). Can pay significant premiums vs PE funds.' } },
    ],
  },
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isFr = locale === 'fr'
  const title       = isFr ? 'Glossaire M&A tech — 30 termes essentiels | AEGRYN' : 'Tech M&A Glossary — 30 essential terms | AEGRYN'
  const description = isFr
    ? 'Définitions des 30 termes essentiels du M&A tech européen : ARR, NRR, earnout, due diligence, Grade AEGRYN, share deal et plus.'
    : 'Definitions of the 30 essential terms in European tech M&A: ARR, NRR, earnout, due diligence, AEGRYN Grade, share deal and more.'
  return generateAegrynMetadata({ title, description, path: '/glossaire', locale })
}

export default async function GlossairePage({ params }: Props) {
  const { locale } = await params
  const lang = locale === 'fr' ? 'fr' : 'en'

  const definedTermsLd = {
    '@context': 'https://schema.org',
    '@graph': TERMS.flatMap(group =>
      group.terms.map(term => ({
        '@type':       'DefinedTerm',
        '@id':         `${BASE}/${locale}/glossaire#${term.id}`,
        name:          term.name,
        description:   term.def[lang],
        inDefinedTermSet: {
          '@type': 'DefinedTermSet',
          name:    lang === 'fr' ? 'Glossaire M&A tech AEGRYN' : 'AEGRYN Tech M&A Glossary',
          url:     `${BASE}/${locale}/glossaire`,
        },
      }))
    ),
  }

  const letters = TERMS.map(g => g.letter)

  return (
    <main id="main" className="bg-ag-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermsLd) }} />

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {lang === 'fr' ? 'AEGRYN — Ressources' : 'AEGRYN — Resources'}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.06] tracking-[-0.03em] mb-5"
            style={{ fontSize: 'clamp(32px,5vw,68px)' }}
          >
            {lang === 'fr' ? 'Glossaire M&A tech' : 'Tech M&A Glossary'}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-8">
            {lang === 'fr'
              ? 'Les 30 termes essentiels du marché des actifs tech européens — des métriques SaaS aux mécanismes contractuels.'
              : 'The 30 essential terms of the European tech asset market — from SaaS metrics to contractual mechanisms.'}
          </p>

          {/* Alpha nav */}
          <div className="flex flex-wrap gap-2">
            {letters.map(l => (
              <a
                key={l}
                href={`#letter-${l}`}
                className="font-mono text-[11px] tracking-[0.16em] uppercase px-3 py-1.5 border border-white/20 text-white/50 hover:border-ag-apex hover:text-ag-apex transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {TERMS.map(group => (
            <div key={group.letter} id={`letter-${group.letter}`}>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-sans font-bold text-ag-apex text-[48px] leading-none tracking-[-0.04em]">
                  {group.letter}
                </span>
                <span className="flex-1 h-px bg-ag-border" />
              </div>
              <div className="space-y-0 border border-ag-border divide-y divide-ag-border">
                {group.terms.map(term => (
                  <div key={term.id} id={term.id} className="p-6 hover:bg-ag-off-white transition-colors group">
                    <p className="font-sans font-bold text-ag-black text-[16px] tracking-[-0.01em] mb-2 group-hover:text-ag-navy transition-colors">
                      {term.name}
                    </p>
                    <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
                      {term.def[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-2">AEGRYN Blog</p>
            <p className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em]">
              {lang === 'fr' ? 'Approfondir avec nos analyses' : 'Go deeper with our analyses'}
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-black transition-colors"
          >
            {lang === 'fr' ? 'Voir tous les articles' : 'View all articles'}
          </Link>
        </div>
      </section>
    </main>
  )
}
