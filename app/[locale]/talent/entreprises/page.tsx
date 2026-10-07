import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { Link }            from '@/i18n/navigation'
import { ArrowUpRight }    from 'lucide-react'
import { Suspense }        from 'react'
import { generateAegrynMetadata } from '@/lib/seo'
import TalentHiringForm    from '@/components/forms/TalentHiringForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent.entreprises' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/talent/entreprises',
    locale
  })
}

export default async function TalentEntreprisesPage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'talent.entreprises' })
  const tm = await getTranslations({ locale, namespace: 'talent' })

  const steps   = tm.raw('method.steps') as { title: string; desc: string }[]
  const aiItems = t.raw('ai.items') as string[]
  const diagQ   = t.raw('diagnostic.questions') as string[]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border bg-ag-navy overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.18] max-w-3xl mb-8"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[16px] text-white/60 leading-relaxed max-w-xl mb-10">
            {t('hero.desc')}
          </p>
          <a
            href="#besoin"
            className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('hero.cta')} <ArrowUpRight size={12} />
          </a>
        </div>
      </section>

      {/* Méthode en 4 étapes */}
      <section className="py-24 border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-16" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {tm('method.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            {steps.map((step, i) => (
              <div key={i}>
                <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex-ink mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                  {step.title}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="border-l-2 border-ag-apex pl-6 max-w-3xl">
            <h3 className="font-sans font-bold text-ag-black text-[15px] mb-2">
              {tm('method.discreet.title')}
            </h3>
            <p className="text-[14px] text-ag-gray leading-relaxed">
              {tm('method.discreet.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Ce qu'un outil d'IA ne fera pas */}
      <section className="py-24 border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-8" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
              {t('ai.title')}
            </h2>
            <ul className="space-y-4">
              {aiItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-ag-gray leading-relaxed">
                  <span className="shrink-0 mt-2.5 w-1.5 h-1.5 bg-ag-apex rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-8" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
              {t('diagnostic.title')}
            </h2>
            <ol className="space-y-4">
              {diagQ.map((q, i) => (
                <li key={i} className="flex items-start gap-4 border border-ag-border bg-white p-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-ag-apex-ink pt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[14px] text-ag-gray leading-relaxed">{q}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Formulaire Présenter mon besoin */}
      <section id="besoin" className="py-24 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('form.title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed mb-2">
            {t('form.desc')}
          </p>
          <p className="text-[13px] text-ag-gray-light leading-relaxed mb-10">
            {t('form.note')}
          </p>
          <Suspense fallback={null}>
            <TalentHiringForm />
          </Suspense>
        </div>
      </section>

      {/* Repli transition */}
      <section className="py-20 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.01em] mb-2">
              {t('transitionTeaser.title')}
            </h2>
            <p className="text-[14px] text-ag-gray max-w-xl">
              {t('transitionTeaser.desc')}
            </p>
          </div>
          <Link
            href="/talent/transition"
            className="rounded-lg inline-flex items-center gap-2 border border-ag-navy text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-navy hover:text-white transition-colors shrink-0"
          >
            {t('transitionTeaser.cta')} <ArrowUpRight size={12} />
          </Link>
        </div>
      </section>
    </>
  )
}
