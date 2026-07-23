import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import { ArrowUpRight, Users, Building2, BarChart3, TrendingUp, ShieldCheck, CheckCircle2 } from "lucide-react"

type Props = { params: Promise<{ locale: string }> }

const MODEL_ICONS = [Users, Building2, BarChart3, TrendingUp]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'bidModels.meta' })
  return { title: t('title'), description: t('desc') }
}

export default async function BidModelsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'bidModels' })

  type ModelData = {
    badge: string; label: string; title: string; summary: string
    subBadge?: string; conditions: string[]; structures: string[]
  }
  type StepData = { num: string; title: string; desc: string }

  const models = t.raw('models') as ModelData[]
  const pttSteps = t.raw('ptt.steps') as StepData[]

  return (
    <main id="main" className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/auction" className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-ag-apex transition-colors mb-10">
            {t('hero.back')}
          </Link>
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('hero.label')}
          </p>
          <h1 className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6" style={{ fontSize: "clamp(32px,4.5vw,64px)" }}>
            {t('hero.title')}
          </h1>
          <p className="font-sans text-[15px] text-white/55 max-w-xl leading-relaxed">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* 4 Model cards */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {models.map((model, idx) => {
            const Icon = MODEL_ICONS[idx] ?? Users
            const isHighlight = idx === 3
            return (
              <div key={model.label} className={`border p-8 flex flex-col gap-6 ${isHighlight ? "border-ag-apex/50 bg-ag-apex/[0.03]" : "border-ag-border"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-ag-border flex items-center justify-center shrink-0">
                      <Icon size={14} className={isHighlight ? "text-ag-apex" : "text-ag-gray-light"} />
                    </div>
                    <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">{model.label}</span>
                  </div>
                  {model.subBadge && (
                    <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-ag-apex border border-ag-apex/40 px-2 py-1 shrink-0">{model.subBadge}</span>
                  )}
                </div>

                <div>
                  <h2 className="font-sans font-bold text-ag-black tracking-[-0.025em] mb-1" style={{ fontSize: "clamp(20px,2vw,28px)" }}>{model.title}</h2>
                  <p className="font-sans text-[11px] text-ag-gray-light uppercase tracking-[0.12em]">{model.badge}</p>
                </div>

                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{model.summary}</p>

                <div>
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-3">{t('conditionsLabel')}</p>
                  <ul className="flex flex-col gap-2">
                    {model.conditions.map((c, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={12} className="text-ag-apex mt-0.5 shrink-0" />
                        <span className="font-sans text-[12px] text-ag-black leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-3">{t('structuresLabel')}</p>
                  <div className="flex flex-wrap gap-2">
                    {model.structures.map((s, i) => (
                      <span key={i} className="font-sans text-[11px] text-ag-gray border border-ag-border px-3 py-1">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* PTT */}
      <section className="bg-ag-off-white py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('ptt.label')}
          </p>
          <h2 className="font-sans font-bold text-ag-black leading-[1.1] tracking-[-0.03em] max-w-2xl mb-4" style={{ fontSize: "clamp(24px,3vw,44px)" }}>
            {t('ptt.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray mb-12 max-w-xl">
            {t('ptt.desc')}
          </p>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-ag-border hidden md:block" />
            <div className="flex flex-col">
              {pttSteps.map((step) => (
                <div key={step.num} className="flex gap-8 items-start py-6 border-b border-ag-border last:border-b-0">
                  <div className="w-10 h-10 border border-ag-border bg-ag-white flex items-center justify-center shrink-0 relative z-10">
                    <span className="font-sans text-[10px] font-bold tracking-[0.08em] text-ag-apex">{step.num}</span>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-ag-black text-[14px] mb-1">{step.title}</p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protection bilatérale */}
          <div className="mt-12 border border-ag-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={18} className="text-ag-apex" />
              <p className="font-sans font-bold text-ag-black text-[14px] tracking-[-0.01em]">{t('ptt.protection.title')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['buyer','seller','condition'] as const).map(key => (
                <p key={key} className="font-sans text-[12px] text-ag-gray border-l-2 border-ag-apex/30 pl-4 leading-relaxed">
                  <strong className="block text-ag-black mb-1">{t(`ptt.protection.${key}.title`)}</strong>
                  {t(`ptt.protection.${key}.desc`)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-sans font-bold text-white leading-[1.1] tracking-[-0.025em] mb-4" style={{ fontSize: "clamp(22px,2.5vw,38px)" }}>
              {t('cta.title')}
            </h2>
            <p className="font-sans text-[14px] text-white/60 max-w-lg">
              {t('cta.desc')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link href="/auction/how-to-buy" className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-bold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-white transition-colors">
              {t('cta.btnGuide')} <ArrowUpRight size={13} />
            </Link>
            <Link href="/auction/catalog" className="inline-flex items-center gap-2 border border-white/30 text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:border-white/60 transition-colors">
              {t('cta.btnCatalog')}
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
