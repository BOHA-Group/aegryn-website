import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Headhunting & Transition | Executive Search & Interim Management | Aegryn',
    description: 'Aegryn Talent: Executive search and interim management for tech leaders. CTO, CISO, Head of AI, and C-level transitions.',
    path: '/talent',
    locale,
  })
}

export default async function TalentPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-8 text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Two services */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="grid md:grid-cols-2 gap-px bg-ag-border">
            {/* Hiring */}
            <div className="bg-white p-12 border border-ag-border">
              <div className="w-12 h-px bg-ag-apex mb-6" />
              <h2 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-4">
                {t('hiring.title')}
              </h2>
              <p className="text-[14px] text-ag-gray leading-relaxed mb-6">
                {t('hiring.desc')}
              </p>
              <ul className="space-y-2 mb-8">
                <li className="text-[13px] text-ag-gray flex items-start gap-2">
                  <span className="text-ag-apex mt-1">→</span>
                  <span>{t('hiring.profiles.cto')}</span>
                </li>
                <li className="text-[13px] text-ag-gray flex items-start gap-2">
                  <span className="text-ag-apex mt-1">→</span>
                  <span>{t('hiring.profiles.ciso')}</span>
                </li>
                <li className="text-[13px] text-ag-gray flex items-start gap-2">
                  <span className="text-ag-apex mt-1">→</span>
                  <span>{t('hiring.profiles.headAI')}</span>
                </li>
                <li className="text-[13px] text-ag-gray flex items-start gap-2">
                  <span className="text-ag-apex mt-1">→</span>
                  <span>{t('hiring.profiles.cLevel')}</span>
                </li>
              </ul>
              <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-apex">
                {t('hiring.cta')}
              </p>
            </div>

            {/* Candidate */}
            <div className="bg-white p-12 border border-ag-border">
              <div className="w-12 h-px bg-ag-apex mb-6" />
              <h2 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-4">
                {t('candidate.title')}
              </h2>
              <p className="text-[14px] text-ag-gray leading-relaxed mb-6">
                {t('candidate.desc')}
              </p>
              <ul className="space-y-2 mb-8">
                <li className="text-[13px] text-ag-gray flex items-start gap-2">
                  <span className="text-ag-apex mt-1">→</span>
                  <span>{t('candidate.benefits.network')}</span>
                </li>
                <li className="text-[13px] text-ag-gray flex items-start gap-2">
                  <span className="text-ag-apex mt-1">→</span>
                  <span>{t('candidate.benefits.confidential')}</span>
                </li>
                <li className="text-[13px] text-ag-gray flex items-start gap-2">
                  <span className="text-ag-apex mt-1">→</span>
                  <span>{t('candidate.benefits.curated')}</span>
                </li>
                <li className="text-[13px] text-ag-gray flex items-start gap-2">
                  <span className="text-ag-apex mt-1">→</span>
                  <span>{t('candidate.benefits.transition')}</span>
                </li>
              </ul>
              <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-apex">
                {t('candidate.cta')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-ag-off-white py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-4">
            {t('process.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-16"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('process.title')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex mb-4">01</div>
              <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                {t('process.steps.brief.title')}
              </h3>
              <p className="text-[13px] text-ag-gray leading-relaxed">
                {t('process.steps.brief.desc')}
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex mb-4">02</div>
              <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                {t('process.steps.search.title')}
              </h3>
              <p className="text-[13px] text-ag-gray leading-relaxed">
                {t('process.steps.search.desc')}
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex mb-4">03</div>
              <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                {t('process.steps.placement.title')}
              </h3>
              <p className="text-[13px] text-ag-gray leading-relaxed">
                {t('process.steps.placement.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {t('cta.title')}
          </h2>
          <p className="text-[15px] text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
            {t('cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#hiring-form"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-navy bg-white px-8 py-4 hover:bg-ag-apex transition-all"
            >
              {t('cta.hiringBtn')}
            </a>
            <a
              href="#candidate-form"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-8 py-4 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
            >
              {t('cta.candidateBtn')}
            </a>
          </div>
        </div>
      </section>

      {/* Placeholder for forms — to be implemented in ÉTAPE 6 */}
      <section id="hiring-form" className="py-24 border-b border-ag-border">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-center text-ag-gray text-[14px]">
            {t('forms.hiring.placeholder')}
          </p>
        </div>
      </section>

      <section id="candidate-form" className="py-24 bg-ag-off-white">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-center text-ag-gray text-[14px]">
            {t('forms.candidate.placeholder')}
          </p>
        </div>
      </section>
    </>
  )
}
