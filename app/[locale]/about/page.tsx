import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { VisionMissionBlock } from '@/components/sections/VisionMissionBlock'
import { AboutHeroLogo }       from '@/components/brand/AboutHeroLogo'
import { SegmentsSection }     from '@/components/sections/SegmentsSection'
import type { Metadata } from 'next'

const BASE = 'https://aegryn.com'
const ABOUT_SLUG: Record<string, string> = {
  fr: '/a-propos',
  en: '/about',
  it: '/chi-siamo',
  es: '/sobre-nosotros',
  de: '/ueber-uns',
  nl: '/over-ons',
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const slug = ABOUT_SLUG[locale] ?? '/about'
  const base = generateAegrynMetadata({
    title: 'About Aegryn | The trust infrastructure for European tech M&A',
    description: 'Certification. Discretion. Permanence. Three principles that shaped a name — and a company. Aegryn is the independent certification and transaction infrastructure for European tech M&A.',
    path: slug,
    locale,
  })
  return {
    ...base,
    alternates: {
      canonical: `${BASE}/${locale}${slug}`,
      languages: {
        fr:          `${BASE}/fr/a-propos`,
        en:          `${BASE}/en/about`,
        it:          `${BASE}/it/chi-siamo`,
        es:          `${BASE}/es/sobre-nosotros`,
        de:          `${BASE}/de/ueber-uns`,
        nl:          `${BASE}/nl/over-ons`,
        'x-default': `${BASE}/en/about`,
      },
    },
  }
}

const values = ['precision', 'durability', 'sovereignty', 'independence'] as const
const missionPillars = ['create', 'simplify', 'embrace'] as const
const ctaProfiles = ['seller', 'buyer', 'partner'] as const

export default function AboutPage() {
  const t  = useTranslations('about')
  const ta = useTranslations('aboutPage')

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-32">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
                {t('hero.label')}
              </p>
              <h1
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.18] max-w-3xl mb-8 whitespace-pre-line"
                style={{ fontSize: 'clamp(48px,6vw,86px)' }}
              >
                {t('hero.title')}
              </h1>
              <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl whitespace-pre-line">
                {t('hero.desc')}
              </p>
            </div>
            <AboutHeroLogo />
          </div>
        </div>
      </section>

      {/* Name — Etymology */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-10">
            / {t('name.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] max-w-2xl mb-16 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4vw,56px)' }}
          >
            {t('name.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border mb-16">
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="bg-ag-white p-10">
                <p className="font-sans font-bold text-ag-black tracking-[0.08em] text-[22px] mb-4">
                  {t(`name.roots.${i}.word`)}
                </p>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {t(`name.roots.${i}.meaning`)}
                </p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl space-y-5">
            <p className="text-[16px] text-ag-black leading-relaxed font-semibold">
              {t('name.synthesis')}
            </p>
            <p className="text-[14px] text-ag-gray leading-relaxed">
              {t('name.formerly')}
            </p>
          </div>
        </div>
      </section>

      <VisionMissionBlock
        visionLabel={
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
            / {t('vision.label')}
          </p>
        }
        visionText={
          <p
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.15] whitespace-pre-line"
            style={{ fontSize: 'clamp(22px,2.5vw,32px)' }}
          >
            {t('vision.text')}
          </p>
        }
        dnaContent={
          <section className="border-b border-ag-border bg-ag-off-white/80">
            <div className="mx-auto max-w-7xl px-6 md:px-12 py-20">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-12">
                / {t('dna.label')}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border">
                {values.map((v) => (
                  <div key={v} className="bg-ag-off-white p-8 hover:bg-ag-white transition-colors">
                    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-apex mb-4">
                      {t(`values.${v}.label`)}
                    </p>
                    <p className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-none mb-3">
                      {t(`values.${v}.title`)}
                    </p>
                    <p className="text-[13px] text-ag-gray leading-relaxed">
                      {t(`values.${v}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        }
        missionContent={
          <div className="mx-auto max-w-7xl px-6 md:px-12 py-4">
            <div className="flex items-center justify-between border-b border-ag-border py-4 mb-0">
              <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
                / {t('mission.label')}
              </span>
              <span className="font-sans font-bold text-ag-black tracking-[-0.02em] text-[13px]">
                {t('mission.title')}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
              {missionPillars.map((key, i) => (
                <div key={key} className="py-14 md:px-10 first:pl-0 last:pr-0">
                  <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2
                    className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.2] mb-5"
                    style={{ fontSize: 'clamp(20px,1.8vw,26px)' }}
                  >
                    {t(`mission.${key}.title`)}
                  </h2>
                  <p className="text-[14px] text-ag-gray leading-relaxed">
                    {t(`mission.${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* Contribution */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-10">
            / {t('contribution.label')}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] whitespace-pre-line"
              style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            >
              {t('contribution.title')}
            </h2>
            <p className="text-[15px] text-ag-gray leading-relaxed self-end">
              {t('contribution.desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border">
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="bg-ag-white p-10">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex mb-6">
                  {t(`contribution.items.${i}.num`)}
                </p>
                <h3 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-snug mb-4">
                  {t(`contribution.items.${i}.title`)}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {t(`contribution.items.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Aegryn */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-10">
            / {ta('whyAegryn.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] max-w-2xl mb-12"
            style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
          >
            {ta('whyAegryn.title')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {ta('whyAegryn.p1').split('\n\n').map((para, i) => (
                <p key={i} className="text-[15px] text-ag-gray leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="space-y-6">
              {ta('whyAegryn.p2').split('\n\n').map((para, i) => (
                <p key={i} className="text-[15px] text-ag-gray leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
          <div className="mt-12 pt-10 border-t border-ag-border">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
              / {ta('whyAegryn.p3Label')}
            </p>
            <p className="text-[14px] text-ag-gray leading-relaxed max-w-xl">
              {ta('whyAegryn.p3')}
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section id="fondateur" className="border-b border-ag-border" style={{ scrollMarginTop: '80px' }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-10">
            / {ta('founder.label')}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1]"
              style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            >
              {ta('founder.title')}
            </h2>
            <div className="space-y-5">
              {ta('founder.desc').split('\n\n').map((para, i) => (
                <p key={i} className="text-[15px] text-ag-gray leading-relaxed">{para}</p>
              ))}
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-black border border-ag-border px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all mt-4"
              >
                {ta('founder.cta')} <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Travailler avec Aegryn — 5 disciplines */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-10">
            / {ta('workWith.label')}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] whitespace-pre-line"
              style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            >
              {ta('workWith.title')}
            </h2>
            <p className="text-[15px] text-ag-gray leading-relaxed self-end">
              {ta('workWith.sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-ag-border">
            {([0, 1, 2, 3, 4] as const).map((i) => (
              <div key={i} className="bg-ag-white p-8 flex flex-col gap-5">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light">
                  {ta(`workWith.items.${i}.num`)}
                </p>
                <p className="font-sans font-bold text-ag-black text-[13px] tracking-[0.12em] leading-none">
                  {ta(`workWith.items.${i}.title`)}
                </p>
                <p className="text-[13px] text-ag-gray leading-relaxed flex-1">
                  {ta(`workWith.items.${i}.desc`)}
                </p>
                <Link
                  href={ta(`workWith.items.${i}.href`) as never}
                  className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-4 py-2.5 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all self-start"
                >
                  {ta(`workWith.items.${i}.cta`)} <ArrowUpRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swiss */}
      <section className="bg-ag-navy py-28 px-6 md:px-12 border-b border-ag-navy">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
                {t('swiss.groupLabel')}
              </p>
              <h2
                className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] whitespace-pre-line mb-8"
                style={{ fontSize: 'clamp(26px,3vw,48px)' }}
              >
                {t('swiss.title')}
              </h2>
              <Link
                href="/transact"
                className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
              >
                {t('swiss.cta')} <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-[15px] text-white/70 leading-relaxed self-center">
              {t('swiss.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Segments clients */}
      <SegmentsSection />


      {/* What's next */}
      <section className="border-b border-ag-border bg-ag-off-white/60">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-10">
            / {t('whatsnext.label')}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] whitespace-pre-line"
              style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            >
              {t('whatsnext.title')}
            </h2>
            <div className="space-y-5">
              <p className="text-[15px] text-ag-gray leading-relaxed whitespace-pre-line">
                {t('whatsnext.desc')}
              </p>
              <Link
                href="/transact"
                className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-black border border-ag-border px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
              >
                {t('whatsnext.cta')} <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA tripartite */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-16">
            / {t('cta.label')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border">
            {ctaProfiles.map((profile) => (
              <div key={profile} className="bg-ag-white p-10 flex flex-col gap-6">
                <div className="flex-1">
                  <h3 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-snug mb-3">
                    {t(`cta.${profile}.title`)}
                  </h3>
                  <p className="text-[13px] text-ag-gray leading-relaxed">
                    {t(`cta.${profile}.desc`)}
                  </p>
                </div>
                <Link
                  href={t(`cta.${profile}.href`) as never}
                  className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-5 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all self-start"
                >
                  {t(`cta.${profile}.btn`)} <ArrowUpRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
