import type { Metadata }      from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { Link }               from '@/i18n/navigation'
import { ArrowUpRight, Lock, ShieldCheck, Users, Eye } from 'lucide-react'
import BuyerForm              from './BuyerForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Accès acheteurs — Aegryn Auction',
    description: "Rejoignez le cercle d'acheteurs pré-qualifiés Aegryn. Accédez en priorité au deal flow confidentiel d'actifs tech certifiés et gradés. Ticket €100K–€10M+.",
    path: '/auction/buyers',
    locale,
    keywords: [
      'acheter entreprise tech', 'buy SaaS Europe', 'acquisition startup',
      'deal flow confidentiel', 'acheteur qualifié M&A', 'tech acquisition Switzerland',
      'buy digital asset', 'achat actif numérique', 'investisseur tech',
    ],
  })
}

const ACCESS_STEPS = [
  {
    num:   '01',
    title: 'Soumettez votre profil',
    desc:  'Remplissez le formulaire ci-dessous : type d\'acquéreur, ticket, secteurs cibles, preuve de capacité financière.',
  },
  {
    num:   '02',
    title: 'Validation sous 48h',
    desc:  "Notre équipe vérifie votre profil et votre capacité financière. Un échange peut être demandé pour finaliser la qualification.",
  },
  {
    num:   '03',
    title: 'Signature du NDA acheteur',
    desc:  "Après validation, vous signez le NDA Aegryn. Aucune information sur un actif n'est transmise avant cette étape.",
  },
  {
    num:   '04',
    title: 'Alertes matching confidentielles',
    desc:  "Vous recevez des alertes sur les actifs correspondant à votre profil : secteur, grade, ticket. Identité du cédant jamais révélée avant ouverture de session.",
  },
]

const COMMITMENTS = [
  {
    icon:  <Lock size={16} className="text-ag-apex shrink-0 mt-0.5" />,
    title: 'Confidentialité totale',
    desc:  "L'identité de chaque actif est strictement protégée jusqu'à l'ouverture de la session auction. Aucun nom, aucune URL avant NDA mutuel.",
  },
  {
    icon:  <ShieldCheck size={16} className="text-ag-apex shrink-0 mt-0.5" />,
    title: 'Actifs certifiés et gradés',
    desc:  'Chaque actif en auction a reçu une certification CIFS indépendante (finance, code, IP, sécurité) et un grade ★/AAA/AA/A/B opposable.',
  },
  {
    icon:  <Users size={16} className="text-ag-apex shrink-0 mt-0.5" />,
    title: 'Cercle fermé d\'acheteurs',
    desc:  'Accès sur invitation ou pré-qualification uniquement. Zéro curieux, zéro concurrent sans accord préalable.',
  },
  {
    icon:  <Eye size={16} className="text-ag-apex shrink-0 mt-0.5" />,
    title: 'Deal flow en avant-première',
    desc:  "Les acheteurs pré-qualifiés reçoivent les alertes avant toute diffusion externe. Premier arrivé, premier informé.",
  },
]

export default async function AuctionBuyersPage({ params }: Props) {
  await params

  return (
    <main className="bg-ag-white">

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            Acheteurs pré-qualifiés
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-6"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            Accédez au deal flow{'\n'}avant tout le monde.
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            Rejoignez le cercle d'acheteurs pré-qualifiés Aegryn et recevez en priorité les alertes sur les actifs tech certifiés correspondant à votre profil — en totale confidentialité.
          </p>
          <a
            href="#form"
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-apex/90 transition-colors"
          >
            Soumettre ma candidature <ArrowUpRight size={13} />
          </a>
        </div>
      </section>

      {/* ── Process d'accès ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            Processus d'accès
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-16 max-w-lg">
            Quatre étapes pour intégrer le cercle.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-ag-border divide-y sm:divide-y-0 sm:divide-x divide-ag-border mb-20">
            {ACCESS_STEPS.map(({ num, title, desc }) => (
              <div key={num} className="p-8 flex flex-col gap-4">
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{num}</span>
                <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-snug tracking-[-0.01em]">{title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* ── Engagements ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
            {COMMITMENTS.map(({ icon, title, desc }) => (
              <div key={title} className="border border-ag-border bg-ag-off-white p-7 flex gap-4">
                {icon}
                <div>
                  <p className="font-sans font-semibold text-ag-black text-[14px] mb-1">{title}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Formulaire ── */}
          <div id="form" className="max-w-2xl scroll-mt-24">
            <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
              Pré-qualification
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] mb-8">
              Demande d&apos;accès au deal flow
            </h2>
            <BuyerForm />
          </div>
        </div>
      </section>

      {/* ── CTA secondaire ── */}
      <section className="py-16 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-sans text-[14px] text-ag-gray max-w-md leading-relaxed">
            Vous êtes cédant et cherchez à comprendre le processus de vente ?
          </p>
          <Link
            href="/auction/sell"
            className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:border-ag-black transition-colors shrink-0"
          >
            Parcours cédant <ArrowUpRight size={11} />
          </Link>
        </div>
      </section>

    </main>
  )
}
