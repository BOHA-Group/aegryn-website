import { getTranslations } from 'next-intl/server'
import Link              from 'next/link'
import { ArrowUpRight }  from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Grow With Us',
    description: "Rejoignez l'écosystème Aegryn — partenariats stratégiques, co-building et accès à notre réseau suisse.",
    path: '/grow-with-us',
    locale,
  })
}

const INVESTOR_WHY = [
  {
    num: '01',
    title: 'Fuel growth',
    desc: "Participez activement à la croissance d'actifs numériques propriétaires avec un potentiel de rendement à long terme.",
  },
  {
    num: '02',
    title: 'Shape the future',
    desc: "Contribuez à la direction stratégique d'un écosystème technologique suisse pensé pour durer des décennies.",
  },
  {
    num: '03',
    title: 'Unlock new opportunities',
    desc: "Accédez à un réseau exclusif de décideurs, fondateurs et partenaires technologiques en Suisse et en Europe.",
  },
]

const PARTNER_OPS = [
  { title: 'App development', desc: 'Co-construction de solutions mobiles et SaaS intégrées à l\'écosystème Aegryn.' },
  { title: 'Embedded insurance', desc: 'Intégration d\'assurances numériques dans nos plateformes lifestyle et services.' },
  { title: 'Integrated payment solutions', desc: 'Connexion de solutions de paiement nativement dans nos actifs transactionnels.' },
  { title: 'Co-branded growth initiatives', desc: 'Initiatives de croissance conjointes avec visibilité partagée sur nos marchés.' },
  { title: 'Data-driven marketing campaigns', desc: 'Campagnes marketing ciblées grâce à nos données first-party agrégées.' },
  { title: 'Social media & influencer collaborations', desc: 'Collaborations avec notre réseau de créateurs et influenceurs partenaires.' },
]

export default async function GrowWithUsPage({ params }: Props) {
  const { locale } = await params
  const _t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            Partenariats Stratégiques & Investissement
          </p>
          <h1
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.95] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            Partenaire de la révolution<br />des apps mobiles.
          </h1>
          <p className="mt-8 text-[15px] text-ag-gray leading-relaxed max-w-xl">
            Vision long terme. Exécution disciplinée. Construisons ensemble des écosystèmes
            numériques durables à travers la Suisse et l&apos;Europe.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-ag-black text-white font-mono text-[11px] tracking-[0.16em] uppercase px-6 py-3.5 hover:bg-ag-navy transition-colors"
          >
            Nous contacter
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Investors */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between border-b border-ag-border py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              / Investisseurs
            </p>
            <p className="font-display font-black text-ag-black text-[13px] tracking-[-0.02em]">
              Devenez un acteur clé
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {INVESTOR_WHY.map((item) => (
              <div key={item.num} className="py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {item.num}
                </p>
                <h2
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-none mb-4"
                  style={{ fontSize: 'clamp(18px,1.6vw,22px)' }}
                >
                  {item.title}
                </h2>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center justify-between mb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              / Partenaires
            </p>
            <p className="font-display font-black text-ag-black text-[13px] tracking-[-0.02em]">
              Opportunités à fort impact
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border">
            {PARTNER_OPS.map((op) => (
              <div key={op.title} className="bg-ag-off-white p-8 hover:bg-ag-white transition-colors">
                <h3
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-tight mb-3"
                  style={{ fontSize: 'clamp(16px,1.4vw,20px)' }}
                >
                  {op.title}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {op.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/40 mb-4">
              Aegryn Group
            </p>
            <h2
              className="font-display font-black text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(26px,3vw,46px)' }}
            >
              La bonne décision commence par la bonne conversation.
            </h2>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            Prendre contact
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
