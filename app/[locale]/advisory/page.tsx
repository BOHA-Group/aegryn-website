import Link                     from 'next/link'
import { ArrowUpRight }          from 'lucide-react'
import { getTranslations }       from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata }         from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Aegryn Advisory — Strategic Advisory Data, AI & Cybersecurity',
    description: 'Strategic guidance in Data, AI and Cybersecurity. Built by operators. Delivered without noise.',
    path: '/advisory',
    locale,
  })
}

const TEAM = [
  { name: 'Romain F.',    domain: 'Security Audit – Cybersecurity, Penetration Testing & Risk Management', area: 'Back-end security' },
  { name: 'Yacouba N.',   domain: 'App & SaaS Security Audit – Cybersecurity Back-End & Cloud Expert',    area: 'Back-end security' },
  { name: 'Ferdinand H.', domain: 'Mobile Application – CTO as a service',                                area: 'Mobile application' },
  { name: 'Sarah L.',     domain: 'Digital Transformation – Operational Efficiency Expert',               area: 'UI/UX no-code' },
  { name: 'Rayan K.',     domain: 'Growth & Digital Marketing Expert',                                    area: 'Growth' },
  { name: 'Jeremy D.',    domain: 'Full-Stack Engineer & Technical Architecture',                          area: 'Engineering' },
  { name: 'Alexandre M.', domain: 'Data & AI Strategy',                                                   area: 'AI & Data' },
  { name: 'Romain M.',    domain: 'Digital Law & Intellectual Property',                                   area: 'Legal' },
  { name: 'Léo H.',       domain: 'Product & Platform Strategy',                                          area: 'Product' },
  { name: 'Baptiste L.',  domain: 'UX Design & User Experience',                                          area: 'Design' },
]

export default async function AdvisoryPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'advisoryPage' })

  const whoFor  = t.raw('whoFor.items')  as { title: string; desc: string }[]
  const domains = t.raw('domains.items') as { title: string; desc: string }[]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border bg-ag-navy overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.18] max-w-3xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            {t('hero.desc1')}
            <br /><br />
            {t('hero.desc2')}
          </p>
          <p className="font-sans font-semibold text-[13px] text-white/60 leading-relaxed max-w-xl mb-10 border-l-2 border-ag-apex/40 pl-5 whitespace-pre-line">
            {t('hero.quote')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex transition-colors"
          >
            {t('hero.cta')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Why Advisory */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {t('why.label')}
            </p>
          </div>
          <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-ag-border">
            <div className="py-16 md:pr-16">
              <p className="text-[15px] text-ag-gray leading-relaxed mb-6">{t('why.desc1')}</p>
              <p className="text-[15px] text-ag-gray leading-relaxed">{t('why.desc2')}</p>
            </div>
            <div className="py-16 md:pl-16">
              <p
                className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.2]"
                style={{ fontSize: 'clamp(20px,2vw,28px)' }}
              >
                {t('why.tagline')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {t('whoFor.label')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {whoFor.map((item, i) => (
              <div key={i} className="py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4"
                  style={{ fontSize: 'clamp(16px,1.4vw,20px)' }}
                >
                  {item.title}
                </h2>
                <p className="text-[14px] text-ag-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experts */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center justify-between mb-12">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {t('experts.label')}
            </p>
            <p className="font-sans font-semibold text-[10px] text-ag-gray-light">
              {String(TEAM.length).padStart(2, '0')} {t('experts.count')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border">
            {TEAM.map((member, i) => (
              <div key={member.name} className="bg-ag-white p-6 hover:bg-ag-off-white transition-colors group">
                <div className="flex items-start gap-4">
                  <span className="font-sans font-semibold text-[10px] text-ag-gray-light w-5 shrink-0 pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.02em] group-hover:text-ag-navy transition-colors">
                      {member.name}
                    </p>
                    <p className="font-sans font-normal text-[12px] text-ag-gray leading-snug mt-0.5 mb-2">
                      {member.domain}
                    </p>
                    <span className="font-sans font-semibold text-[10px] tracking-[0.12em] uppercase border border-ag-border px-2.5 py-0.5 text-ag-gray-light">
                      {member.area}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center justify-between mb-12">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {t('domains.label')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border">
            {domains.map((d, i) => (
              <div key={i} className="bg-ag-off-white p-8 hover:bg-ag-white transition-colors">
                <h3
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-3"
                  style={{ fontSize: 'clamp(15px,1.3vw,18px)' }}
                >
                  {d.title}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach + CTA */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              / {t('approach.label')}
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(24px,3vw,44px)' }}
            >
              {t('approach.title')}
            </h2>
            <p className="mt-4 text-[14px] text-white/50 max-w-lg leading-relaxed">
              {t('approach.desc')}
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3.5 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
          >
            {t('approach.cta')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
