import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Scale, Calculator, ShieldCheck, Code2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Expert Network — Aegryn Grade',
  description: 'Aegryn Grade is an independent certification. Independent experts (IP legal, chartered accountants, cybersecurity, code audit) can apply to align with the certification or support sellers and buyers.',
}

const PARTNER_ICONS = [Code2, Scale, Calculator, ShieldCheck] as const
const PARTNER_KEYS = ['code', 'legal', 'finance', 'security'] as const

export default async function GradePartnersPage() {
  const t = await getTranslations('gradePartners')

  const PARTNER_TYPES = PARTNER_KEYS.map((key, i) => ({
    icon: PARTNER_ICONS[i],
    label: t(`types.${key}.label`),
    title: t('openApps'),
    desc: t(`types.${key}.desc`),
    dimension: t(`types.${key}.dimension`),
  }))

  const benefits = t.raw('benefits') as string[]

  return (
    <main className="bg-ag-white">

      {/* Hero */}
      <section className="border-b border-ag-border pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('eyebrow')}
          </p>
          <h1 className="font-sans font-bold text-ag-black leading-[1.05] tracking-[-0.03em] max-w-2xl mb-6" style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}>
            {t('title')}
          </h1>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-xl mb-8">
            {t('intro1')}
          </p>
          <p className="font-sans text-[13px] text-ag-gray-light max-w-xl">
            {t('intro2')}
          </p>
        </div>
      </section>

      {/* 4 colonnes experts */}
      <section className="py-20 px-6 border-b border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PARTNER_TYPES.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.label} className="border border-ag-border border-dashed p-8 flex flex-col gap-6">
                <div className="w-12 h-12 border border-ag-border flex items-center justify-center">
                  <Icon size={18} className="text-ag-gray-light" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2">{p.label}</p>
                  <p className="font-sans font-bold text-ag-black text-[16px] mb-1">{p.title}</p>
                  <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-ag-apex">{p.dimension}</p>
                </div>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{p.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA partenaires potentiels */}
      <section className="py-20 px-6 border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-6">{t('ctaLabel')}</p>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.025em] leading-[1.1] mb-6" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>
              {t('ctaTitle')}
            </h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed mb-8">
              {t('ctaDesc')}
            </p>
            <Link
              href={"/alliances?tab=certification" as never}
              className="inline-flex items-center gap-2 bg-ag-black text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-ag-navy transition-colors"
            >
              {t('ctaBtn')} <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="border border-ag-border p-8 bg-ag-white">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-4">{t('benefitsLabel')}</p>
            <ul className="flex flex-col gap-4">
              {benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 border border-ag-apex/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-ag-apex rounded-full" />
                  </span>
                  <span className="font-sans text-[13px] text-ag-gray leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </main>
  )
}
