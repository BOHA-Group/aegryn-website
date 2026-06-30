import { getTranslations }  from 'next-intl/server'
import type { Metadata }    from 'next'
import Link                 from 'next/link'
import {
  ArrowUpRight, CheckCircle2, Clock,
  ShieldCheck, Scale, Globe, Lock,
  Landmark, Users, FileSearch, Handshake,
} from 'lucide-react'
import { breadcrumbJsonLd } from '@/lib/jsonld'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'roadmapPage.meta' })
  return { title: t('title'), description: t('desc') }
}

const FEATURE_ICONS = [
  { key: 'certification',  Icon: ShieldCheck },
  { key: 'swissLaw',       Icon: Scale       },
  { key: 'international',  Icon: Globe        },
  { key: 'nda',            Icon: Lock        },
  { key: 'escrow',         Icon: Landmark    },
  { key: 'buyers',         Icon: Users       },
  { key: 'dueDiligence',   Icon: FileSearch  },
  { key: 'transaction',    Icon: Handshake   },
] as const

export default async function RoadmapPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'roadmapPage' })

  const items   = t.raw('items')   as { phase: string; title: string; desc: string; status: string }[]
  const current = t.raw('current') as string[]

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'AEGRYN', url: 'https://aegryn.com' },
    { name: t('label'), url: `https://aegryn.com/${locale}/roadmap` },
  ])

  const isDev = (s: string) =>
    /développement|development|sviluppo|entwicklung|ontwikkeling|desarrollo/i.test(s)

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] mb-6 whitespace-pre-line max-w-2xl"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[15px] text-white/55 leading-relaxed max-w-xl mb-10">
            {t('desc')}
          </p>
          {/* Swiss law callout */}
          <div className="inline-flex items-start gap-3 border border-ag-apex/30 bg-ag-apex/10 px-5 py-3 max-w-xl">
            <Scale size={14} className="text-ag-apex shrink-0 mt-0.5" />
            <p className="font-sans text-[12px] text-white/80 leading-relaxed">
              {t('swissNote')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="py-24 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
            {t('featuresLabel')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border border border-ag-border">
            {FEATURE_ICONS.map(({ key, Icon }) => (
              <div key={key} className="bg-ag-white p-8 flex flex-col gap-4 group hover:bg-ag-off-white transition-colors">
                <div className="w-10 h-10 border border-ag-border flex items-center justify-center group-hover:border-ag-apex/40 transition-colors">
                  <Icon size={18} className="text-ag-apex" strokeWidth={1.5} />
                </div>
                <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-snug tracking-[-0.01em]">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                  {t(`features.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap phases ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
            {t('roadmapLabel')}
          </p>
          <div className="grid gap-px bg-ag-border border border-ag-border">
            {items.map((item, i) => (
              <div key={i} className="bg-ag-white p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="shrink-0 w-28">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-2">
                    {item.phase}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold ${
                    isDev(item.status)
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-gray-50 text-ag-gray border border-ag-border'
                  }`}>
                    <Clock size={10} />
                    {item.status}
                  </span>
                </div>
                <div className="flex-1">
                  <h2
                    className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1] mb-4"
                    style={{ fontSize: 'clamp(20px,2vw,28px)' }}
                  >
                    {item.title}
                  </h2>
                  <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disponible aujourd'hui ── */}
      <section className="py-20 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-6">
              {t('currentLabel')}
            </p>
            <ul className="space-y-3">
              {current.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={15} className="text-ag-apex shrink-0 mt-0.5" />
                  <span className="font-sans text-[14px] text-ag-black">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 md:pt-2">
            <Link
              href="/auction/submit"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-4 font-semibold hover:bg-ag-navy-mid transition-colors self-start"
            >
              {t('cta')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-4 hover:border-ag-black hover:text-ag-black transition-all self-start"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
