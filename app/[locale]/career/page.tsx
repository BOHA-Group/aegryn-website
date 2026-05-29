import { getTranslations } from 'next-intl/server'
import Link              from 'next/link'
import { ArrowUpRight }  from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Carrières',
    description: "Rejoignez Aegryn et construisez des actifs numériques propriétaires qui durent des décennies.",
    path: '/career',
    locale,
  })
}

const VALUES = [
  {
    label: 'Builders first',
    desc: "Nous recrutons des gens qui font — pas qui délèguent. Chaque collaborateur est co-responsable d'un actif réel.",
  },
  {
    label: 'Long terme',
    desc: "Pas de sprint culture. Pas de burn & churn. Nous construisons des actifs pour 10 ans, pas pour le prochain pitch.",
  },
  {
    label: 'Souveraineté',
    desc: 'Vos décisions comptent. Notre structure plate garantit que les meilleures idées gagnent, quelle que soit leur origine.',
  },
]

export default async function CareerPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  void t

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            Carrières
          </p>
          <h1
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.95] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            Construire ce qui<br />dure, ensemble.
          </h1>
          <p className="mt-8 text-base text-ag-gray leading-relaxed max-w-lg">
            Aegryn est un builder, pas une agence. Rejoindre l&apos;équipe, c&apos;est prendre une part
            de responsabilité réelle sur des actifs propriétaires suisses.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {VALUES.map((v, i) => (
              <div key={i} className="py-16 md:px-12 first:pl-0 last:pr-0">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="font-display font-black text-ag-black text-[22px] tracking-[-0.03em] leading-none mb-3">
                  {v.label}
                </h2>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions — placeholder */}
      <section className="border-b border-ag-border py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-12">
            Postes ouverts
          </p>
          <div className="border border-ag-border p-12 text-center">
            <p className="font-display font-black text-ag-black text-[20px] tracking-[-0.02em] mb-2">
              Aucun poste ouvert pour le moment.
            </p>
            <p className="text-[14px] text-ag-gray mb-8">
              Mais nous cherchons toujours des profils exceptionnels. Envoyez-nous une candidature spontanée.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase border border-ag-border px-6 py-3 text-ag-dark hover:border-ag-black hover:text-ag-black transition-all"
            >
              Candidature spontanée
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="bg-ag-navy py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/40 mb-6">
            Aegryn Group
          </p>
          <h2
            className="font-display font-black text-white tracking-[-0.03em] leading-[0.95] max-w-2xl mb-10"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            Engineered to Last — et construits par des gens qui y croient.
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            Nous écrire
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
