import type { Metadata }      from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { getTranslations }    from 'next-intl/server'
import { Link }               from '@/i18n/navigation'
import { ArrowUpRight, ShieldCheck, BarChart3, FileText, Users, Lock, Landmark } from 'lucide-react'
import ReadinessScore         from './ReadinessScore'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Céder votre actif — AEGRYN Auction',
    description: 'Parcours cédant AEGRYN : valorisation indicative, readiness score, dépôt de mandat. Certification CIFS, confidentialité absolue, séquestre institutionnel suisse.',
    path: '/auction/sell',
    locale,
    keywords: [
      'vendre entreprise tech', 'cession SaaS', 'exit startup',
      'mandat cession actif numérique', 'vente confidentielle', 'auction tech suisse',
      'sell SaaS Europe', 'exit planning', 'M&A tech',
    ],
  })
}

const STEPS = [
  {
    num:   '01',
    icon:  <BarChart3 size={20} className="text-ag-apex" />,
    title: 'Valorisation indicative',
    desc:  'Obtenez une fourchette de valorisation en 4 étapes (finance, code, IP, sécurité) et un grade estimé AEGRYN. Gratuit, confidentiel, sans engagement.',
    cta:   { label: 'Estimer la valeur →', href: '/valuation' },
  },
  {
    num:   '02',
    icon:  <FileText size={20} className="text-ag-apex" />,
    title: 'Readiness Score',
    desc:  'Évaluez si votre dossier est prêt pour une session auction : data room, contrats, indépendance opérationnelle, IP, dette technique. 6 questions, résultat immédiat.',
    cta:   null,
  },
  {
    num:   '03',
    icon:  <ShieldCheck size={20} className="text-ag-apex" />,
    title: 'Dépôt de mandat',
    desc:  "Soumettez votre actif à l'équipe AEGRYN. Certification CIFS indépendante, attribution de grade officiel, entrée en session auction sous mandat exclusif 60 jours.",
    cta:   { label: 'Déposer votre mandat →', href: '/auction/submit' },
  },
]

const GUARANTEES = [
  {
    icon:  <Lock size={16} className="text-ag-apex shrink-0 mt-0.5" />,
    title: 'Confidentialité absolue',
    desc:  "L'identité de votre actif n'est jamais révélée avant signature du NDA acheteur et ouverture de la session auction.",
  },
  {
    icon:  <Users size={16} className="text-ag-apex shrink-0 mt-0.5" />,
    title: 'Acheteurs 100% pré-qualifiés',
    desc:  'Chaque acheteur est vérifié : capacité financière, secteur, ticket. Zéro curieux, zéro concurrent direct sans accord préalable.',
  },
  {
    icon:  <Landmark size={16} className="text-ag-apex shrink-0 mt-0.5" />,
    title: 'Séquestre bancaire suisse',
    desc:  "10% du prix au HoT via séquestre institutionnel. Aucun transfert d'actifs avant libération des fonds. Juridiction suisse.",
  },
  {
    icon:  <ShieldCheck size={16} className="text-ag-apex shrink-0 mt-0.5" />,
    title: 'Certification CIFS indépendante',
    desc:  "Grade ★/AAA/AA/A/B attribué par un auditeur indépendant — finance, code, IP, sécurité. Opposable et documenté.",
  },
]

export default async function AuctionSellPage({ params }: Props) {
  await params

  return (
    <main className="bg-ag-white">

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            Céder votre actif
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-6"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            Votre actif mérite{'\n'}une cession à sa valeur réelle.
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            AEGRYN certifie, grade et met en compétition des acheteurs institutionnels pré-qualifiés — dans un cadre confidentiel, structuré, sous droit suisse.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/valuation"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              Estimer la valeur <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/auction/submit"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:border-white/70 transition-colors"
            >
              Déposer un mandat <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Parcours 3 étapes ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            Parcours cédant
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-16 max-w-lg">
            Trois étapes, de la valorisation au mandat.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-ag-border divide-y md:divide-y-0 md:divide-x divide-ag-border mb-20">
            {STEPS.map(({ num, icon, title, desc, cta }) => (
              <div key={num} className="p-10 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{num}</span>
                  {icon}
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-ag-black text-[18px] leading-snug tracking-[-0.02em] mb-2">
                    {title}
                  </h3>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
                {cta && (
                  <Link
                    href={cta.href as '/valuation' | '/auction/submit'}
                    className="inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] uppercase tracking-[0.14em] text-ag-navy hover:text-ag-apex transition-colors mt-auto"
                  >
                    {cta.label} <ArrowUpRight size={11} />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* ── Readiness Score ── */}
          <div className="max-w-2xl">
            <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
              Étape 02
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] mb-8">
              Votre actif est-il prêt pour une session auction ?
            </h2>
            <ReadinessScore />
          </div>
        </div>
      </section>

      {/* ── Garanties ── */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            Engagements AEGRYN
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em] mb-12">
            Ce que vous n&apos;obtenez pas ailleurs.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GUARANTEES.map(({ icon, title, desc }) => (
              <div key={title} className="border border-ag-border bg-ag-white p-7 flex gap-4">
                {icon}
                <div>
                  <p className="font-sans font-semibold text-ag-black text-[14px] mb-1">{title}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em] mb-2">
              Prêt à soumettre votre actif ?
            </h2>
            <p className="font-sans text-[14px] text-ag-gray">
              Dépôt de mandat gratuit. Notre équipe revient vers vous sous 48h.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/auction/submit"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-navy-mid transition-colors"
            >
              Déposer un mandat <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:border-ag-black transition-colors"
            >
              Parler à un advisor <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
