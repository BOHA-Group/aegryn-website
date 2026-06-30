import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Users, Building2, BarChart3, TrendingUp, ShieldCheck, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Modèles d'acquisition — AEGRYN Auction",
  description: "Club Deal, Corporate, Fonds, Equity Stake — les 4 modèles d'acquisition AEGRYN avec la Promesse de Transaction Tech en 5 étapes.",
}

const MODELS = [
  {
    icon: Users,
    badge: "HNWI · Entrepreneurs · Particuliers qualifiés",
    label: "MODÈLE 01",
    title: "Club Deal",
    summary: "Un acquéreur principal (lead bidder) peut associer jusqu'à 4 co-investisseurs déclarés. Une seule offre, un seul séquestre versé par le lead. La répartition interne reste confidentielle.",
    conditions: [
      "Ticket minimum : 500 000 €",
      "KYC lead bidder complet + co-investisseurs simplifiés",
      "Séquestre 10% versé par le lead bidder sous 5 jours ouvrés",
      "Jusqu'à 4 co-investisseurs déclarés sous NDA",
      "Répartition interne modifiable jusqu'au signing",
    ],
    structures: ["Cash total", "Cash + earnout (délai et KPIs à préciser)", "Autre (à détailler)"],
    highlight: false,
  },
  {
    icon: Building2,
    badge: "PME · Holdings · Corporates · Groupes",
    label: "MODÈLE 02",
    title: "Corporate",
    summary: "Une entité légale acquiert l'actif directement dans son bilan. Deux entités peuvent co-acquérir via une JV déclarée à AEGRYN. Asset deal ou share deal selon la structure retenue.",
    conditions: [
      "Ticket minimum : 500 000 €",
      "KYC B2B complet — Kbis < 3 mois, statuts, UBO ≥ 25%, pièce d'identité du dirigeant",
      "Séquestre 10% versé depuis le compte de l'entité légale",
      "JV possible : deux co-acquéreurs, structure à déclarer avant offre ferme",
    ],
    structures: [
      "Asset deal (code, IP, contrats, base clients)",
      "Share deal (rachat de la société détentrice)",
      "Acquisition directe au bilan",
      "Acquisition via filiale dédiée",
      "Acqui-hire (intégration équipe + technologie)",
    ],
    highlight: false,
  },
  {
    icon: BarChart3,
    badge: "PE · VC · Family Office · Search Fund · Fonds souverains",
    label: "MODÈLE 03",
    title: "Fonds",
    summary: "Les fonds institutionnels bénéficient d'un délai IC de 5 à 10 jours ouvrés avant de soumettre une offre ferme. SPV disponible pour co-investissement direct des LP sur des deals spécifiques.",
    conditions: [
      "Ticket minimum : 500 000 € (pas de plafond)",
      "KYC institutionnel — agrément régulateur si applicable (FINMA, AMF, FCA)",
      "Délai IC : réservation confidentielle 5–10 jours ouvrés sans séquestre",
      "SPV possible pour co-investissement LP direct",
      "Management presentation via AEGRYN, jamais en direct vendeur/acquéreur",
    ],
    structures: [
      "Acquisition plateforme (premier actif d'un roll-up PE)",
      "Add-on (actif complémentaire à un portfolio existant)",
      "Acquisition totale (100%)",
      "Acquisition minoritaire (< 50%) avec SHA structuré",
      "LMBO (avec participation équipe actuelle)",
    ],
    highlight: false,
  },
  {
    icon: TrendingUp,
    badge: "Investisseurs stratégiques · Partenaires opérationnels",
    label: "MODÈLE 04",
    title: "Equity Stake",
    subBadge: "Sans cession · Sans séquestre",
    summary: "Pour les investisseurs ou partenaires qui souhaitent prendre une participation dans l'actif sans l'acquérir totalement — shares contre advisory fees, carried interest, ou apport opérationnel. Engagement live, sans séquestre bancaire.",
    conditions: [
      "Aucun ticket minimum fixe (valorisation négociée entre parties)",
      "KYC selon profil (simplifié particuliers qualifiés, complet entités)",
      "Pas de séquestre — engagement via SHA co-rédigée avec les conseils des deux parties",
      "Engagement live : signature SHA + éventuellement warrant ou BSA",
      "AEGRYN perçoit une commission d'intermédiation sur la valorisation retenue",
    ],
    structures: [
      "Advisory equity (X% contre conseil/expertise sur N mois)",
      "Carried interest (X% sur les bénéfices futurs de l'actif)",
      "Investissement minoritaire cash partiel + seat au board",
      "Warrant / BSA (droit d'acquérir des actions à terme)",
      "Revenue share + option d'achat ultérieure",
    ],
    highlight: true,
  },
]

const PTT_STEPS = [
  {
    num: "01",
    title: "Expression d'Intérêt (EI)",
    desc: "Non-engageante. Transmise au vendeur sous 48h. Aucun dépôt requis.",
  },
  {
    num: "02",
    title: "Accord de Principe (AP)",
    desc: "Prix et structure convenus. La signature de l'AP déclenche l'obligation de séquestre.",
  },
  {
    num: "03",
    title: "Séquestre 10%",
    desc: "Versé sur compte bancaire tiers dans les 5 jours ouvrés. AEGRYN n'a jamais accès aux fonds. Banque partenaire Alliance agit comme dépositaire.",
  },
  {
    num: "04",
    title: "Due Diligence — 30 jours standard",
    desc: "Accès data room complet sous NDA. Q&A via AEGRYN uniquement (jamais en direct vendeur/acquéreur). Extension possible sur accord mutuel (max +30 jours).",
  },
  {
    num: "05",
    title: "Signing & Closing",
    desc: "KRYV Protocol certifie l'état exact du code. Paiement du solde (90% restant). Transfert de l'actif + émission du Certificat de Transaction AEGRYN.",
  },
]

type ModelType = typeof MODELS[number] & { subBadge?: string }

export default function BidModelsPage() {
  return (
    <main id="main" className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/auction" className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-ag-apex transition-colors mb-10">
            ← Auction
          </Link>
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            AEGRYN AUCTION
          </p>
          <h1 className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6" style={{ fontSize: "clamp(32px,4.5vw,64px)" }}>
            Choisissez votre modèle d&apos;acquisition
          </h1>
          <p className="font-sans text-[15px] text-white/55 max-w-xl leading-relaxed">
            Quatre profils d&apos;acquéreurs, une seule exigence : la qualité du deal. Chaque modèle est adapté à votre structure et à vos objectifs.
          </p>
        </div>
      </section>

      {/* 4 Model cards */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(MODELS as ModelType[]).map((model) => {
            const Icon = model.icon
            return (
              <div key={model.label} className={`border p-8 flex flex-col gap-6 ${model.highlight ? "border-ag-apex/50 bg-ag-apex/[0.03]" : "border-ag-border"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-ag-border flex items-center justify-center shrink-0">
                      <Icon size={14} className={model.highlight ? "text-ag-apex" : "text-ag-gray-light"} />
                    </div>
                    <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">{model.label}</span>
                  </div>
                  {model.subBadge && (
                    <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-ag-apex border border-ag-apex/40 px-2 py-1 shrink-0">{model.subBadge}</span>
                  )}
                </div>

                <div>
                  <h2 className="font-sans font-bold text-ag-black tracking-[-0.025em] mb-1" style={{ fontSize: "clamp(20px,2vw,28px)" }}>{model.title}</h2>
                  <p className="font-sans text-[11px] text-ag-gray-light uppercase tracking-[0.12em]">{model.badge}</p>
                </div>

                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{model.summary}</p>

                <div>
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-3">Conditions clés</p>
                  <ul className="flex flex-col gap-2">
                    {model.conditions.map((c, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={12} className="text-ag-apex mt-0.5 shrink-0" />
                        <span className="font-sans text-[12px] text-ag-black leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-3">Structures disponibles</p>
                  <div className="flex flex-wrap gap-2">
                    {model.structures.map((s, i) => (
                      <span key={i} className="font-sans text-[11px] text-ag-gray border border-ag-border px-3 py-1">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* PTT — Promesse de Transaction Tech */}
      <section className="bg-ag-off-white py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            PROCESSUS COMMUN — MODÈLES 01, 02, 03
          </p>
          <h2 className="font-sans font-bold text-ag-black leading-[1.1] tracking-[-0.03em] max-w-2xl mb-4" style={{ fontSize: "clamp(24px,3vw,44px)" }}>
            La Promesse de Transaction Tech
          </h2>
          <p className="font-sans text-[14px] text-ag-gray mb-12 max-w-xl">
            5 étapes structurées pour tous les deals avec acquisition réelle. Le Modèle Equity Stake suit un processus SHA dédié sans séquestre.
          </p>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-ag-border hidden md:block" />
            <div className="flex flex-col">
              {PTT_STEPS.map((step) => (
                <div key={step.num} className="flex gap-8 items-start py-6 border-b border-ag-border last:border-b-0">
                  <div className="w-10 h-10 border border-ag-border bg-ag-white flex items-center justify-center shrink-0 relative z-10">
                    <span className="font-sans text-[10px] font-bold tracking-[0.08em] text-ag-apex">{step.num}</span>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-ag-black text-[14px] mb-1">{step.title}</p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protection bilatérale */}
          <div className="mt-12 border border-ag-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={18} className="text-ag-apex" />
              <p className="font-sans font-bold text-ag-black text-[14px] tracking-[-0.01em]">Protection bilatérale</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <p className="font-sans text-[12px] text-ag-gray border-l-2 border-ag-apex/30 pl-4 leading-relaxed">
                <strong className="block text-ag-black mb-1">Rétractation acquéreur</strong>
                Sans motif valable → séquestre acquis au vendeur.
              </p>
              <p className="font-sans text-[12px] text-ag-gray border-l-2 border-ag-apex/30 pl-4 leading-relaxed">
                <strong className="block text-ag-black mb-1">Rétractation vendeur</strong>
                Sans motif valable → séquestre restitué doublé à l&apos;acquéreur.
              </p>
              <p className="font-sans text-[12px] text-ag-gray border-l-2 border-ag-apex/30 pl-4 leading-relaxed">
                <strong className="block text-ag-black mb-1">Condition suspensive levée</strong>
                → Séquestre intégralement restitué à l&apos;acquéreur (no fault).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-sans font-bold text-white leading-[1.1] tracking-[-0.025em] mb-4" style={{ fontSize: "clamp(22px,2.5vw,38px)" }}>
              Prêt à soumettre une offre ?
            </h2>
            <p className="font-sans text-[14px] text-white/60 max-w-lg">
              Consultez les actifs disponibles ou contactez-nous pour discuter de votre profil d&apos;acquisition.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link href="/auction/how-to-buy" className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-bold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-white transition-colors">
              Guide acquéreur <ArrowUpRight size={13} />
            </Link>
            <Link href="/auction/catalog" className="inline-flex items-center gap-2 border border-white/30 text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:border-white/60 transition-colors">
              Voir le catalogue
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
