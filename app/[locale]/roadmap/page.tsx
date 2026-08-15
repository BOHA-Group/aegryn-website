import { getTranslations }  from 'next-intl/server'
import type { Metadata }    from 'next'
import { Link }             from '@/i18n/navigation'
import {
  ArrowUpRight, CheckCircle2,
  ShieldCheck, Scale, Globe, Lock,
  Landmark, Users, FileSearch, Handshake,
  LayoutGrid, Filter, Send, Award,
  Gift, Briefcase, ShieldAlert, BarChart2,
  Code2, Cpu, Star, Eye,
} from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'roadmapPage.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/roadmap', locale })
}

const FEATURE_ICONS = [
  { key: 'certification',  Icon: ShieldCheck },
  { key: 'swissLaw',       Icon: Scale       },
  { key: 'international',  Icon: Globe       },
  { key: 'nda',            Icon: Lock        },
  { key: 'escrow',         Icon: Landmark    },
  { key: 'buyers',         Icon: Users       },
  { key: 'dueDiligence',   Icon: FileSearch  },
  { key: 'transaction',    Icon: Handshake   },
] as const

const ITEM_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  certification:  ShieldCheck,
  grade:          Star,
  escrow:         Landmark,
  nda:            Lock,
  closing:        Handshake,
  swissLaw:       Scale,
  sessions:       LayoutGrid,
  catalogFilter:  Filter,
  buyers:         Users,
  dataRoom:       Eye,
  sellerSubmit:   Send,
  dueDiligence:   FileSearch,
  certifiers:     Award,
  referral:       Gift,
  mandates:       Briefcase,
  kyc:            ShieldAlert,
  international:  Globe,
  intelligence:   BarChart2,
  api:            Code2,
  onChain:        Cpu,
}

export default async function RoadmapPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'roadmapPage' })

  const items   = t.raw('items')   as { iconKey: string; theme: string; title: string; desc: string; live: boolean }[]
  const current = t.raw('current') as string[]

  const liveItems     = items.filter(i => i.live)
  const upcomingItems = items.filter(i => !i.live)

  return (
    <main>
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

      {/* ── Timeline top 20 ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-16">
            {t('roadmapLabel')}
          </p>

          {/* Disponible */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle2 size={14} className="text-ag-apex" />
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex">{t('statusLive')}</p>
            </div>
            <div className="relative border-l border-ag-apex/30 pl-8 space-y-0">
              {liveItems.map((item, i) => {
                const Icon = ITEM_ICONS[item.iconKey] ?? ShieldCheck
                return (
                  <div key={i} className="relative pb-8 last:pb-0">
                    <span className="absolute -left-[1.15rem] top-1 w-3 h-3 rounded-full border-2 border-ag-apex bg-ag-off-white" />
                    <div className="bg-ag-white border border-ag-border p-6 flex gap-5 group hover:border-ag-apex/40 transition-colors">
                      <div className="w-8 h-8 border border-ag-border flex items-center justify-center shrink-0 group-hover:border-ag-apex/40 transition-colors">
                        <Icon size={15} className="text-ag-apex" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-1">{item.theme}</p>
                        <h3 className="font-sans font-semibold text-ag-black text-[15px] tracking-[-0.01em] leading-snug mb-2">
                          {item.title}
                        </h3>
                        <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{item.desc}</p>
                      </div>
                      <span className="shrink-0 self-start font-mono text-[9px] uppercase tracking-widest text-ag-apex border border-ag-apex/30 px-2 py-1">
                        ● {t('statusLive')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* À venir */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-ag-gray-light" />
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light">{t('statusUpcoming')}</p>
            </div>
            <div className="relative border-l border-ag-border pl-8 space-y-0">
              {upcomingItems.map((item, i) => {
                const Icon = ITEM_ICONS[item.iconKey] ?? Code2
                return (
                  <div key={i} className="relative pb-8 last:pb-0">
                    <span className="absolute -left-[1.15rem] top-1 w-3 h-3 rounded-full border-2 border-ag-border bg-ag-off-white" />
                    <div className="bg-ag-white border border-ag-border p-6 flex gap-5 opacity-80 hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 border border-ag-border flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-ag-gray-light" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-1">{item.theme}</p>
                        <h3 className="font-sans font-semibold text-ag-black text-[15px] tracking-[-0.01em] leading-snug mb-2">
                          {item.title}
                        </h3>
                        <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{item.desc}</p>
                      </div>
                      <span className="shrink-0 self-start font-mono text-[9px] uppercase tracking-widest text-ag-gray-light border border-ag-border px-2 py-1">
                        ○ {t('statusUpcoming')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
              href="/transact/submit"
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
