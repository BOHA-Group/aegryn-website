import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { Link }            from '@/i18n/navigation'
import { ArrowUpRight, ArrowRight, ClipboardList, Radar, UserCheck, Handshake, UserPlus, Clock, Users } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/talent',
    locale
  })
}

const CYCLE_SLUGS = ['lancement', 'croissance', 'restructuration', 'acquisition', 'transmission'] as const

type CycleRow = { name: string; recruit: string; transition: string }
type DemandCard = { stat: string; desc: string; source: string; url?: string }

const BTN_PRI = 'rounded-lg inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors'
const BTN_SEC = 'rounded-lg inline-flex items-center justify-center gap-2 border border-ag-border text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:border-ag-navy transition-colors'
const BTN_SEC_W = 'rounded-lg inline-flex items-center justify-center gap-2 border border-white/40 text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-white hover:text-ag-navy transition-colors'

function DoorButtons({ t, dark = false }: { t: (k: string) => string; dark?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link href="/talent/entreprises" className={dark ? BTN_PRI : 'rounded-lg inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-black transition-colors'}>
        {t('doors.recruit')} <ArrowUpRight size={12} />
      </Link>
      <Link href="/talent/candidats" className={dark ? BTN_SEC_W : BTN_SEC}>
        {t('doors.candidate')} <ArrowUpRight size={12} />
      </Link>
    </div>
  )
}

export default async function TalentPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent' })

  const cycleRows = t.raw('cycles.rows') as CycleRow[]
  const demandCards = t.raw('demand.cards') as DemandCard[]
  const steps = t.raw('method.steps') as { title: string; desc: string }[]
  const stepIcons  = [ClipboardList, Radar, UserCheck, Handshake]
  const offerIcons = { recruit: UserPlus, transition: Clock, pool: Users } as const

  return (
    <>
      {/* Hero — deux portes */}
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
          <DoorButtons t={t} dark />
          <p className="mt-8 font-sans text-[13px] text-white/50">
            {t('hero.trust1')} · {t('hero.trust2')}
          </p>
        </div>
      </section>

      {/* Sélecteur collant */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex gap-2">
          <Link
            href="/talent/entreprises"
            className="py-3 pr-5 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy hover:text-ag-apex-ink transition-colors"
          >
            {t('doors.recruit')}
          </Link>
          <Link
            href="/talent/candidats"
            className="py-3 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-gray hover:text-ag-black transition-colors"
          >
            {t('doors.candidate')}
          </Link>
        </div>
      </div>

      {/* Ce que propose Aegryn — 3 cartes */}
      <section className="py-24 border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-16" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('offers.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(['recruit', 'transition', 'pool'] as const).map((k) => {
              const Icon = offerIcons[k]
              return (
              <div key={k} className="border border-ag-border bg-white p-8 flex flex-col hover:border-ag-apex/40 transition-colors">
                <span className="w-10 h-10 rounded-lg bg-ag-apex/10 border border-ag-apex/25 flex items-center justify-center text-ag-apex-ink mb-5">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <h3 className="font-sans font-bold text-ag-black text-[19px] tracking-[-0.01em] mb-4">
                  {t(`offers.${k}.title`)}
                </h3>
                <p className="text-[15px] text-ag-gray leading-relaxed mb-8">
                  {t(`offers.${k}.desc`)}
                </p>
                <Link
                  href={k === 'recruit' ? '/talent/entreprises' : k === 'transition' ? '/talent/transition' : '/talent/candidats'}
                  className="mt-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ag-navy hover:text-ag-apex-ink transition-colors"
                >
                  {t(`offers.${k}.cta`)} <ArrowRight size={11} />
                </Link>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* À chaque cycle de vie */}
      <section className="py-24 border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-3" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('cycles.title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed mb-12 max-w-2xl">
            {t('cycles.desc')}
          </p>
          <div className="border border-ag-border bg-white divide-y divide-ag-border">
            <div className="hidden md:grid md:grid-cols-[1.1fr_1.4fr_1.4fr_auto] gap-6 px-6 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light">{t('cycles.colCycle')}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light">{t('cycles.colRecruit')}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light">{t('cycles.colTransition')}</p>
              <span />
            </div>
            {cycleRows.map((row, i) => {
              const slug = CYCLE_SLUGS[i]
              return (
                <div key={slug} id={`cycle-${slug}`} className="scroll-mt-32 px-6 py-6 grid md:grid-cols-[1.1fr_1.4fr_1.4fr_auto] gap-4 md:gap-6 items-start">
                  <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em]">
                    {row.name}
                  </h3>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                    <span className="md:hidden block font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-1">{t('cycles.colRecruit')}</span>
                    {row.recruit}
                  </p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                    <span className="md:hidden block font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-1">{t('cycles.colTransition')}</span>
                    {row.transition}
                  </p>
                  <div className="flex md:flex-col gap-3 md:gap-2 md:text-right shrink-0">
                    <Link
                      href={`/franchir/${slug}` as never}
                      className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ag-navy hover:text-ag-apex-ink transition-colors"
                    >
                      {t('cycles.decisionLink')} <ArrowRight size={9} />
                    </Link>
                    <Link
                      href={{ pathname: '/contact', query: { type: 'recruter', cycle: slug } } as never}
                      className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ag-gray hover:text-ag-black transition-colors"
                    >
                      {t('cycles.needLink')} <ArrowUpRight size={9} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Où se trouve la demande — données sourcées */}
      <section className="py-24 border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-3" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('demand.title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed mb-12 max-w-2xl">
            {t('demand.note')}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {demandCards.map((card, i) => (
              <div key={i} className="border border-ag-border bg-white p-6">
                <p className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] mb-3">
                  {card.stat}
                </p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed mb-4">
                  {card.desc}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ag-gray-light">
                  {card.url ? (
                    <a href={card.url} target="_blank" rel="noopener noreferrer" className="hover:text-ag-apex-ink transition-colors">
                      {card.source} ↗
                    </a>
                  ) : card.source}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[13px] text-ag-gray-light italic leading-relaxed max-w-3xl">
            {t('demand.reading')}
          </p>
        </div>
      </section>

      {/* Notre méthode */}
      <section className="py-24 border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-16" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('method.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            {steps.map((step, i) => {
              const Icon = stepIcons[i]
              return (
              <div key={i}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-lg bg-ag-apex/10 border border-ag-apex/25 flex items-center justify-center text-ag-apex-ink shrink-0">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex-ink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                  {step.title}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {step.desc}
                </p>
              </div>
              )
            })}
          </div>
          <div className="border-l-2 border-ag-apex pl-6 max-w-3xl">
            <h3 className="font-sans font-bold text-ag-black text-[15px] mb-2">
              {t('method.discreet.title')}
            </h3>
            <p className="text-[14px] text-ag-gray leading-relaxed">
              {t('method.discreet.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Insights & Données Marché */}
      <section id="marche" className="py-24 border-b border-ag-border scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-12">
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-3" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
              {t('insights.insightsTitle')}
            </h2>
            <p className="text-[15px] text-ag-gray">
              {t('insights.insightsSubtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-ag-border bg-white p-8">
              <h3 className="font-sans font-bold text-ag-black text-[19px] tracking-[-0.01em] mb-3">
                {t('insights.salaryReportTitle')}
              </h3>
              <p className="text-[15px] text-ag-gray leading-relaxed mb-6">
                {t('insights.salaryReportDesc')}
              </p>
              <Link
                href={{ pathname: '/blog/[slug]', params: { slug: 'salaires-executive-tech-suisse-europe-2026' } }}
                className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-5 py-3 hover:bg-ag-navy hover:text-white transition-colors"
              >
                {t('insights.salaryReportCta')}
              </Link>
            </div>
            <div className="border border-ag-border bg-white p-8">
              <h3 className="font-sans font-bold text-ag-black text-[19px] tracking-[-0.01em] mb-3">
                {t('insights.magazineTitle')}
              </h3>
              <p className="text-[15px] text-ag-gray leading-relaxed mb-6">
                {t('insights.magazineDesc')}
              </p>
              <Link
                href="/magazine"
                className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-5 py-3 hover:bg-ag-navy hover:text-white transition-colors"
              >
                {t('insights.magazineCta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Repli — deux portes répétées */}
      <section className="py-24 bg-ag-navy">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-white tracking-[-0.02em] mb-10" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('doorsBottom.title')}
          </h2>
          <DoorButtons t={t} dark />
        </div>
      </section>
    </>
  )
}
