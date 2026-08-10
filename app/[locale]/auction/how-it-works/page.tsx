import type { Metadata }      from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { Link }               from '@/i18n/navigation'
import {
  ArrowUpRight, BarChart3, ShieldCheck, FileText,
  Users, Landmark, CheckCircle2,
} from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Comment ça marche — Aegryn Auction',
    description: "Le processus Aegryn en 6 étapes : certification CIFS, grade indépendant, data room confidentielle, matching acheteurs, session auction, séquestre bancaire suisse.",
    path: '/auction/how-it-works',
    locale,
    keywords: [
      'processus auction tech', 'certification CIFS', 'grade actif numérique',
      'cession SaaS structurée', 'séquestre suisse M&A', 'comment vendre entreprise tech',
      'how to sell SaaS Europe', 'M&A process Switzerland',
    ],
  })
}

const PROCESS_STEPS = [
  {
    num:    '01',
    icon:   <BarChart3 size={22} className="text-ag-apex" />,
    title:  'Valorisation indicative',
    label:  'Cédant',
    desc:   "Le cédant complète le calculateur de valorisation Aegryn (finance, code, IP, sécurité). Il obtient une fourchette indicative et un grade estimé. Gratuit, confidentiel, sans engagement.",
    detail: "Outil self-serve en 4 étapes · Grade estimé ★/AAA/AA/A/B · Email du rapport",
    cta:    { label: 'Estimer la valeur', href: '/valuation' as const },
    side:   'seller',
  },
  {
    num:    '02',
    icon:   <FileText size={22} className="text-ag-apex" />,
    title:  'Dépôt de mandat & NDA cédant',
    label:  'Cédant',
    desc:   "Le cédant soumet son actif à l'équipe Aegryn avec les éléments de base (nom interne, ARR, type, pays). Il signe le NDA Aegryn avant tout traitement. Mandat exclusif 60 jours.",
    detail: "Formulaire de soumission · Signature NDA cédant · Mandat exclusif 60 jours · Réponse sous 48h",
    cta:    { label: 'Déposer un mandat', href: '/auction/submit' as const },
    side:   'seller',
  },
  {
    num:    '03',
    icon:   <ShieldCheck size={22} className="text-ag-apex" />,
    title:  'Certification CIFS & attribution de grade',
    label:  'Aegryn',
    desc:   "Un auditeur CIFS indépendant examine le code, les finances, l'IP et la sécurité. Un grade officiel ★/AAA/AA/A/B est attribué, documenté et opposable. C'est la différence fondamentale avec toute autre plateforme de cession.",
    detail: "Audit indépendant · 4 dimensions · Grade officiel et opposable · Rapport complet remis",
    cta:    { label: 'Comprendre les grades', href: '/grade/grading-system' as const },
    side:   'aegryn',
  },
  {
    num:    '04',
    icon:   <Users size={22} className="text-ag-apex" />,
    title:  'Matching acheteurs pré-qualifiés',
    label:  'Aegryn',
    desc:   "Les acheteurs dont le profil correspond (secteur, ticket, géographie) reçoivent une alerte confidentielle — secteur générique et grade uniquement. Aucun nom, aucune métrique, aucune URL. L'identité n'est révélée qu'après NDA acheteur et ouverture de session.",
    detail: "Matching sur profil acheteur · Notification : secteur + grade uniquement · NDA acheteur requis avant toute information",
    cta:    { label: 'Accès acheteurs', href: '/auction/buyers' as const },
    side:   'aegryn',
  },
  {
    num:    '05',
    icon:   <FileText size={22} className="text-ag-apex" />,
    title:  'Session auction & data room',
    label:  'Acheteurs + Cédant',
    desc:   "La session auction s'ouvre avec accès à la data room complète (financières, KPIs, contrats, rapport CIFS). Les acheteurs qualifiés soumettent leurs offres dans le délai imparti. Le cédant choisit l'offre retenue.",
    detail: "Data room sécurisée · Durée définie · Offres sous enveloppe · Cédant décide",
    cta:    null,
    side:   'both',
  },
  {
    num:    '06',
    icon:   <Landmark size={22} className="text-ag-apex" />,
    title:  'Closing & séquestre bancaire suisse',
    label:  'Aegryn',
    desc:   "10% du prix de cession est versé en séquestre bancaire institutionnel suisse au moment du HoT (Heads of Terms). Les actifs ne sont transférés qu'après libération complète des fonds. Juridiction suisse, droit continental.",
    detail: "10% au HoT en séquestre · Bancaire institutionnel suisse · Transfert conditionné aux fonds · SPA sous droit suisse",
    cta:    null,
    side:   'aegryn',
  },
]

const COMPARE_ROWS = [
  { label: 'Certification actif',       aegryn: 'CIFS indépendant · 4 dimensions',  other: 'Vetting interne informel' },
  { label: 'Confidentialité',           aegryn: 'Actif invisible avant double NDA',  other: 'Listing semi-public + NDA auto' },
  { label: 'Acheteurs',                 aegryn: '100% pré-qualifiés, preuve de fonds', other: 'Base ouverte, qualité variable' },
  { label: 'Séquestre',                 aegryn: 'Bancaire institutionnel suisse',    other: 'Escrow.com (US)' },
  { label: 'Juridiction',               aegryn: 'Suisse / droit continental',        other: 'Californie / droit US' },
  { label: 'Ticket typique',            aegryn: '€100K – €10M+',                     other: '$10K – $2M' },
  { label: 'Commission vendeur',        aegryn: 'Success fee uniquement',            other: '6–8% + listing fee mensuelle' },
]

const SIDE_COLORS: Record<string, string> = {
  seller: 'bg-blue-50 text-blue-700 border-blue-200',
  aegryn: 'bg-ag-apex/10 text-ag-navy border-ag-apex/30',
  both:   'bg-purple-50 text-purple-700 border-purple-200',
}
const SIDE_LABELS: Record<string, string> = {
  seller: 'Cédant',
  aegryn: 'Aegryn',
  both:   'Cédant + Acheteurs',
}

export default async function HowItWorksPage({ params }: Props) {
  await params

  return (
    <main className="bg-ag-white">

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            Processus Aegryn
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-6"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            De la valorisation{'\n'}au closing — 6 étapes.
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            Un processus structuré, confidentiel et institutionnel. Chaque étape est conçue pour protéger le cédant, qualifier l'acheteur, et maximiser la valeur transactionnelle de l'actif.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/auction/sell"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-apex/90 transition-colors">
              Je suis cédant <ArrowUpRight size={13} />
            </Link>
            <Link href="/auction/buyers"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:border-white/70 transition-colors">
              Je suis acheteur <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6 étapes ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            Étapes du processus
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-16 max-w-lg">
            Certification, confidentialité, closing.
          </h2>

          <div className="flex flex-col gap-0 border border-ag-border divide-y divide-ag-border">
            {PROCESS_STEPS.map(({ num, icon, title, label: _label, desc, detail, cta, side }) => (
              <div key={num} className="grid grid-cols-1 lg:grid-cols-[80px_1fr_280px] gap-0">
                {/* Num */}
                <div className="flex items-start justify-center pt-8 pb-4 lg:py-8 lg:border-r border-ag-border">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{num}</span>
                </div>
                {/* Content */}
                <div className="px-6 lg:px-8 py-8 lg:border-r border-ag-border flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.01em]">{title}</h3>
                    <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${SIDE_COLORS[side]}`}>
                      {SIDE_LABELS[side]}
                    </span>
                  </div>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed max-w-xl">{desc}</p>
                  <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed">{detail}</p>
                  {cta && (
                    <Link href={cta.href}
                      className="inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] uppercase tracking-[0.14em] text-ag-navy hover:text-ag-apex transition-colors mt-1 self-start">
                      {cta.label} <ArrowUpRight size={11} />
                    </Link>
                  )}
                </div>
                {/* Visual indicator */}
                <div className="hidden lg:flex items-center justify-center py-8 px-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-12 h-12 border border-ag-apex/30 flex items-center justify-center bg-ag-apex/5">
                      {icon}
                    </div>
                    {num !== '06' && (
                      <div className="w-px h-8 bg-ag-border mt-1" />
                    )}
                    {num === '06' && (
                      <CheckCircle2 size={16} className="text-ag-apex mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparatif Aegryn vs autres ── */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            Positionnement
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em] mb-10">
            Aegryn vs autres plateformes
          </h2>

          <div className="border border-ag-border overflow-hidden">
            <div className="grid grid-cols-3 bg-ag-navy">
              <div className="px-5 py-3 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-white/50" />
              <div className="px-5 py-3 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-apex border-l border-white/10">Aegryn</div>
              <div className="px-5 py-3 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-white/50 border-l border-white/10">Autres plateformes</div>
            </div>
            {COMPARE_ROWS.map(({ label, aegryn, other }, i) => (
              <div key={label} className={`grid grid-cols-3 border-t border-ag-border ${i % 2 === 0 ? 'bg-ag-white' : 'bg-ag-off-white'}`}>
                <div className="px-5 py-4 font-sans font-semibold text-[12px] text-ag-black border-r border-ag-border">{label}</div>
                <div className="px-5 py-4 font-sans text-[12px] text-ag-black border-r border-ag-border flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-ag-apex shrink-0" />
                  {aegryn}
                </div>
                <div className="px-5 py-4 font-sans text-[12px] text-ag-gray-light">{other}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA dual ── */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-0 border border-ag-border divide-y sm:divide-y-0 sm:divide-x divide-ag-border">
          <div className="p-10 flex flex-col gap-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">Cédant</p>
            <h3 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">Valorisez et cédez votre actif</h3>
            <p className="font-sans text-[13px] text-ag-gray leading-relaxed">Commencez par l'outil de valorisation gratuit, puis déposez votre mandat en 5 minutes.</p>
            <Link href="/auction/sell"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3.5 hover:bg-ag-navy-mid transition-colors self-start mt-auto">
              Parcours cédant <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="p-10 flex flex-col gap-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-apex">Acheteur</p>
            <h3 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">Accédez au deal flow certifié</h3>
            <p className="font-sans text-[13px] text-ag-gray leading-relaxed">Soumettez votre profil pour rejoindre le cercle d'acheteurs pré-qualifiés et recevoir les alertes matching.</p>
            <Link href="/auction/buyers"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3.5 hover:border-ag-black transition-colors self-start mt-auto">
              Devenir acheteur qualifié <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
