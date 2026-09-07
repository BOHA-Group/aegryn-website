import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, AlertTriangle, BarChart2, TrendingUp } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Investisseurs & Institutionnels | Aegryn',
    description: 'Aegryn agit comme operating partner pour les fonds et family offices. Screening technique, value creation post-acquisition, préparation exit. Aligné sur la valeur créée.',
    path: '/investisseurs',
    locale,
    keywords: [
      'operating partner fonds', 'family office operating partner', 'value creation post-acquisition',
      'screening deal flow technique', 'préparation exit organisation', 'operating partner suisse',
      'fonds investissement PME', 'portfolio company value creation', 'M&A value creation',
    ],
  })
}

const PROBLEMS = [
  {
    icon: <AlertTriangle size={20} className="text-ag-apex" />,
    text: 'Votre participation n\'a pas d\'équipe opérationnelle pour piloter la valeur.',
  },
  {
    icon: <BarChart2 size={20} className="text-ag-apex" />,
    text: 'Votre deal flow est difficile à lire techniquement et organisationnellement.',
  },
  {
    icon: <TrendingUp size={20} className="text-ag-apex" />,
    text: 'Votre exit est dans 24 à 36 mois et l\'organisation n\'est pas prête.',
  },
]

const ROLES = [
  {
    letter: 'A',
    title: 'Operating partner pour vos holdings directs',
    desc: 'Nous prenons un rôle opérationnel dans vos participations : gouvernance, talent, pilotage de la valeur au quotidien. Présence terrain, pas uniquement en board.',
  },
  {
    letter: 'B',
    title: 'Screening deal flow technique et organisationnel',
    desc: 'Avant l\'investissement, nous qualifions les cibles sur les 5 dimensions CIFSO : capital, intégrité, finances, sécurité, organisation. Vous investissez avec une lecture complète.',
  },
  {
    letter: 'C',
    title: 'Value creation post-acquisition et préparation exit',
    desc: 'Après l\'acquisition, nous structurons le plan de valeur sur 12 à 36 mois, documentons l\'organisation et préparons la transmission dans les meilleures conditions.',
  },
]

export default async function InvestisseursPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  void t

  return (
    <main className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            INVESTISSEURS & INSTITUTIONNELS
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,64px)' }}
          >
            {'Votre capital mérite\nun operating partner.'}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-2xl mb-4 leading-relaxed">
            La banque finance. Le fonds investit.
          </p>
          <p className="font-sans text-[16px] text-white/55 max-w-2xl mb-12 leading-relaxed">
            Aegryn crée et réalise la valeur opérationnelle dans vos participations.
          </p>
          <Link
            href={{ pathname: '/contact', query: { subject: 'investisseurs' } }}
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            Discutons de votre portefeuille <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* Section 1 — Le problème */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
            TROIS SITUATIONS QUE NOUS RÉSOLVONS
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {PROBLEMS.map(({ icon, text }, i) => (
              <div key={i} className="bg-ag-white p-10 flex flex-col gap-6">
                <div className="w-10 h-10 border border-ag-apex/30 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <p className="font-sans text-[15px] text-ag-dark leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — Nos 3 rôles */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
            NOS TROIS RÔLES
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-16 max-w-2xl"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            Un engagement opérationnel, pas consultatif.
          </h2>
          <div className="flex flex-col gap-px bg-ag-border border border-ag-border">
            {ROLES.map(({ letter, title, desc }) => (
              <div key={letter} className="bg-ag-white p-10 grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-8 items-start">
                <div className="w-12 h-12 bg-ag-navy flex items-center justify-center shrink-0">
                  <span className="font-sans font-bold text-ag-apex text-[18px]">{letter}</span>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-ag-black text-[18px] leading-snug tracking-[-0.02em] mb-3">
                    {title}
                  </h3>
                  <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Modèle d'alignement */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5">
              MODÈLE D'ALIGNEMENT
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              Notre succès dépend du vôtre.
            </h2>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-4 max-w-md">
              Pas de facturation à l'heure.
            </p>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-md">
              Un engagement aligné sur la valeur créée et réalisée.
            </p>
          </div>
          <div className="bg-ag-navy p-12 flex flex-col gap-6">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex">
              NOTRE ENGAGEMENT
            </p>
            {[
              'Présence opérationnelle, pas uniquement en board.',
              'Certification CIFSO incluse dans le mandat.',
              'Rémunération alignée sur la valeur à la sortie.',
              'Reporting mensuel structuré sur les 5 dimensions.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-ag-apex shrink-0 mt-2" />
                <p className="font-sans text-[14px] text-white/75 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-3">
              PREMIER CONTACT
            </p>
            <p className="font-sans font-bold text-white text-[22px] max-w-md leading-snug">
              Un portefeuille à valoriser ou à céder ?
            </p>
            <p className="font-sans text-[14px] text-white/55 mt-3 max-w-md leading-relaxed">
              Fonds, family office, holding avec une participation à structurer. Réponse sous 48h.
            </p>
          </div>
          <Link
            href={{ pathname: '/contact', query: { subject: 'investisseurs' } }}
            className="shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            Discutons de votre portefeuille <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

    </main>
  )
}
