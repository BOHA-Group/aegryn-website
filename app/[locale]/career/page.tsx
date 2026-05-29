import { getTranslations } from 'next-intl/server'
import Link              from 'next/link'
import { ArrowUpRight }  from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Careers | Advisory & Digital Ecosystem Experts | Aegryn',
    description: 'Join Aegryn, a Swiss Tech Asset Builder seeking senior advisory talents in Data, AI and Cybersecurity to structure durable digital ecosystems.',
    path: '/career',
    locale,
  })
}

const OPEN_POSITIONS = [
  {
    title: 'Senior Advisor – Business Strategy',
    domain: 'Business Strategy',
    type: 'Advisory',
  },
  {
    title: 'Senior Advisor – Backend & Application Security (Mobile & SaaS)',
    domain: 'Cybersecurity',
    type: 'Advisory',
  },
  {
    title: 'Senior Advisor – M&A, Fundraising & Capital Strategy',
    domain: 'Finance',
    type: 'Advisory — Exception Track',
  },
  {
    title: 'Senior Advisor – Growth, Brand & Go-To-Market',
    domain: 'Growth & Brand',
    type: 'Advisory',
  },
  {
    title: 'Senior Advisor – AI, Automation & Data Strategy',
    domain: 'AI & Data',
    type: 'Advisory',
  },
  {
    title: 'Senior Advisor – Architecture & Digital Platforms',
    domain: 'Architecture',
    type: 'Advisory',
  },
  {
    title: 'Senior Advisor – UX, Design & User Experience',
    domain: 'UX & Design',
    type: 'Advisory',
  },
  {
    title: 'Senior Advisor – Product, Platform & Innovation (Mobile & SaaS)',
    domain: 'Product',
    type: 'Advisory',
  },
]

export default async function CareerPage({ params }: Props) {
  const { locale } = await params
  const _t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            Aegryn Advisory & Careers
          </p>
          <h1
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.95] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            Advisory & Digital Ecosystem Experts
          </h1>
          <p className="mt-8 text-[15px] text-ag-gray leading-relaxed max-w-xl">
            Aegryn recrute des Senior Advisors — des experts opérationnels en Data, IA et Cybersécurité
            pour structurer des écosystèmes numériques durables.
          </p>
        </div>
      </section>

      {/* Open positions */}
      <section className="border-b border-ag-border py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between border-b border-ag-border py-4 mb-0">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              Postes ouverts
            </p>
            <p className="font-sans font-semibold text-[10px] text-ag-gray-light">
              {String(OPEN_POSITIONS.length).padStart(2, '0')}
            </p>
          </div>

          {OPEN_POSITIONS.map((pos, i) => (
            <div
              key={i}
              className="group flex items-center justify-between border-b border-ag-border py-6 hover:bg-ag-off-white transition-colors px-0 -mx-0 cursor-default"
            >
              <div className="flex items-start gap-6">
                <span className="font-sans font-semibold text-[10px] text-ag-gray-light w-6 shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p
                    className="font-display font-black text-ag-black tracking-[-0.02em] leading-tight group-hover:text-ag-navy transition-colors"
                    style={{ fontSize: 'clamp(15px,1.4vw,18px)' }}
                  >
                    {pos.title}
                  </p>
                  <p className="font-sans font-semibold text-[10px] text-ag-gray-light mt-1">
                    {pos.domain}
                  </p>
                </div>
              </div>
              <span className="shrink-0 font-sans font-semibold text-[10px] tracking-[0.12em] uppercase border border-ag-border px-3 py-1 text-ag-gray-light ml-6">
                {pos.type}
              </span>
            </div>
          ))}

          <div className="mt-12 flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-3.5 hover:bg-ag-navy transition-colors"
            >
              Postuler
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase border border-ag-border px-6 py-3.5 text-ag-dark hover:border-ag-black hover:text-ag-black transition-all"
            >
              Candidature spontanée
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/40 mb-4">
              Aegryn Advisory
            </p>
            <h2
              className="font-display font-black text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(26px,3vw,46px)' }}
            >
              Engineered to Last — construit par des experts qui y croient.
            </h2>
          </div>
          <Link
            href="/advisory"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            Découvrir l&apos;Advisory
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
