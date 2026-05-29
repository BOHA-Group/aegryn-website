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

const PILLARS = [
  {
    num: '01',
    title: 'Co-building',
    desc: "Vous apportez le domaine, nous apportons l'infrastructure, le capital et l'exécution. Ensemble, nous construisons un actif qui dure.",
  },
  {
    num: '02',
    title: 'Distribution',
    desc: "Accédez à l'écosystème Aegryn — utilisateurs, partenaires B2B, réseau suisse et européen — pour accélérer votre croissance.",
  },
  {
    num: '03',
    title: 'Protocoles',
    desc: 'Intégrez nos protocoles KRYV et Advisory dans vos produits pour offrir un niveau de confiance institutionnel à vos clients.',
  },
  {
    num: '04',
    title: 'Réseau',
    desc: 'Accédez à notre carnet d\'adresses de décideurs, fonds et partenaires technologiques en Suisse, France et au-delà.',
  },
]

export default async function GrowWithUsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  void t

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            Partenariats & Écosystème
          </p>
          <h1
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.95] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            Grandissez avec<br />Aegryn.
          </h1>
          <p className="mt-8 text-base text-ag-gray leading-relaxed max-w-lg">
            Nous construisons des actifs propriétaires sur le long terme. Si vous partagez cette vision,
            il y a plusieurs façons de rejoindre l&apos;écosystème.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-ag-navy text-white font-mono text-[11px] tracking-[0.16em] uppercase px-6 py-3.5 hover:bg-ag-black transition-colors"
          >
            Nous contacter
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {PILLARS.map((p) => (
              <div key={p.num} className="py-16 px-0 md:px-12 first:pl-0 last:pr-0 border-b border-ag-border md:border-b-0 last:border-b-0">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {p.num}
                </p>
                <h2 className="font-display font-black text-ag-black text-[24px] tracking-[-0.03em] leading-none mb-4">
                  {p.title}
                </h2>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="bg-ag-navy py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/40 mb-4">
              Aegryn Group
            </p>
            <h2
              className="font-display font-black text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              Une conversation suffit pour commencer.
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
