import { getTranslations } from 'next-intl/server'
import Link                from 'next/link'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { generateAegrynMetadata, aegrynOrganizationSchema } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'alliances' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/alliances',
    locale,
  })
}

const TYPE_KEYS = ['certification', 'distribution', 'dealflow'] as const

const TYPE_ACCENTS: Record<string, string> = {
  certification: 'border-ag-apex/40 hover:border-ag-apex',
  distribution:  'border-ag-grade-aaa/40 hover:border-ag-grade-aaa',
  dealflow:      'border-ag-grade-a/40 hover:border-ag-grade-a',
}

const TYPE_LABEL_COLORS: Record<string, string> = {
  certification: 'text-ag-apex',
  distribution:  'text-ag-grade-aaa',
  dealflow:      'text-ag-grade-a',
}

export default async function AlliancesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'alliances' })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
      />

      {/* ── Hero ── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] max-w-3xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* ── 3 types d'alliance ── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border">
            {TYPE_KEYS.map((key) => (
              <div
                key={key}
                className={`bg-ag-white p-10 border-t-2 ${TYPE_ACCENTS[key]} transition-colors group`}
              >
                <p className={`font-sans font-semibold text-[10px] uppercase tracking-[0.28em] mb-5 ${TYPE_LABEL_COLORS[key]}`}>
                  {t(`types.${key}.label` as Parameters<typeof t>[0])}
                </p>
                <h2
                  className="font-sans font-bold text-ag-black tracking-[-0.025em] leading-[1.2] mb-5"
                  style={{ fontSize: 'clamp(20px,1.8vw,26px)' }}
                >
                  {t(`types.${key}.title` as Parameters<typeof t>[0])}
                </h2>
                <p className="text-[13px] text-ag-gray leading-relaxed mb-6">
                  {t(`types.${key}.desc` as Parameters<typeof t>[0])}
                </p>
                <p className="font-sans text-[11px] text-ag-gray-light tracking-wide mb-8">
                  {t(`types.${key}.profiles` as Parameters<typeof t>[0])}
                </p>
                <Link
                  href={`/contact?subject=alliance-${key}`}
                  className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-5 py-2.5 group-hover:border-ag-black transition-all duration-200"
                >
                  {t(`types.${key}.cta` as Parameters<typeof t>[0])}
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi un réseau d'alliances ── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
            <div>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-6">
                / AEGRYN
              </p>
              <p
                className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.2]"
                style={{ fontSize: 'clamp(22px,2.5vw,34px)' }}
              >
                {t('hero.desc')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TYPE_KEYS.map((key) => (
                <div key={key} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-ag-apex" />
                  <div>
                    <p className={`font-sans font-semibold text-[11px] uppercase tracking-[0.16em] mb-1.5 ${TYPE_LABEL_COLORS[key]}`}>
                      {t(`types.${key}.label` as Parameters<typeof t>[0])}
                    </p>
                    <p className="text-[12px] text-ag-gray leading-relaxed">
                      {t(`types.${key}.profiles` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Formulaire candidature ── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">

            {/* Left — title */}
            <div>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-6">
                / Application
              </p>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6"
                style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
              >
                {t('form.title')}
              </h2>
              <p className="text-[13px] text-ag-gray leading-relaxed">
                {t('form.note')}
              </p>
            </div>

            {/* Right — form */}
            <form
              action="/api/contact"
              method="POST"
              className="space-y-5"
            >
              {/* Structure + Type — 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2">
                    {t('form.structure')}
                  </label>
                  <input
                    name="structure"
                    type="text"
                    required
                    className="w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2">
                    {t('form.type')}
                  </label>
                  <select
                    name="alliance_type"
                    required
                    className="w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black transition-colors appearance-none"
                  >
                    <option value="">{t('form.typePlaceholder')}</option>
                    <option value="certification">{t('form.typeOptions.certification')}</option>
                    <option value="distribution">{t('form.typeOptions.distribution')}</option>
                    <option value="dealflow">{t('form.typeOptions.dealflow')}</option>
                    <option value="other">{t('form.typeOptions.other')}</option>
                  </select>
                </div>
              </div>

              {/* Email + Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2">
                    {t('form.email')}
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2">
                    {t('form.country')}
                  </label>
                  <input
                    name="country"
                    type="text"
                    className="w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2">
                  {t('form.description')}
                </label>
                <textarea
                  name="description"
                  rows={5}
                  required
                  className="w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-ag-navy transition-colors"
              >
                {t('form.submit')} <ArrowUpRight size={13} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── CTA navy ── */}
      <section className="bg-ag-navy py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/50 mb-4">
              AEGRYN
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl"
              style={{ fontSize: 'clamp(24px,2.8vw,42px)' }}
            >
              {t('hero.title')}
            </h2>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
          >
            {t('types.certification.cta')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
