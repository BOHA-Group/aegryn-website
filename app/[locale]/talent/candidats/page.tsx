import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { ArrowRight, FileSearch, FileUp, Timer, Inbox } from 'lucide-react'
import { Suspense }        from 'react'
import { generateAegrynMetadata } from '@/lib/seo'
import TalentCandidateForm from '@/components/forms/TalentCandidateForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent.candidats' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/talent/candidats',
    locale
  })
}

export default async function TalentCandidatsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent.candidats' })

  const paths      = t.raw('paths.items') as { title: string; desc: string; cta: string }[]
  const pathIcons  = [FileSearch, FileUp, Timer]

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
            href="#profil"
            className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('hero.cta')} <ArrowRight size={12} />
          </a>
        </div>
      </section>

      {/* Trois parcours */}
      <section className="py-24 border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-12" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('paths.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {paths.map((p, i) => {
              const Icon = pathIcons[i]
              return (
              <div key={i} className="border border-ag-border bg-white p-8 flex flex-col">
                <span className="w-10 h-10 rounded-lg bg-ag-apex/10 border border-ag-apex/25 flex items-center justify-center text-ag-apex-ink mb-5">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <h3 className="font-sans font-bold text-ag-black text-[19px] tracking-[-0.01em] mb-4">
                  {p.title}
                </h3>
                <p className="text-[15px] text-ag-gray leading-relaxed mb-8">
                  {p.desc}
                </p>
                <a
                  href={i === 0 ? '#missions' : '#profil'}
                  className="mt-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ag-navy hover:text-ag-apex-ink transition-colors"
                >
                  {p.cta} <ArrowRight size={11} />
                </a>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Missions publiées */}
      <section id="missions" className="py-24 border-b border-ag-border bg-ag-off-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-3" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('missions.title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed mb-10 max-w-2xl">
            {t('missions.desc')}
          </p>
          <div className="border border-dashed border-ag-border bg-white p-10 text-center">
            <Inbox size={28} strokeWidth={1.5} className="mx-auto mb-4 text-ag-gray-light" />
            <p className="font-sans font-bold text-ag-black text-[17px] mb-3">
              {t('missions.emptyTitle')}
            </p>
            <p className="text-[14px] text-ag-gray leading-relaxed max-w-lg mx-auto mb-8">
              {t('missions.emptyDesc')}
            </p>
            <a
              href="#profil"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-black transition-colors"
            >
              {t('missions.emptyCta')} <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* Formulaire candidat */}
      <section id="profil" className="py-24 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('form.title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed mb-10">
            {t('form.desc')}
          </p>
          <Suspense fallback={null}>
            <TalentCandidateForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
