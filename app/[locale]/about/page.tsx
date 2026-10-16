import { useLocale, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { VisionMissionBlock } from '@/components/sections/VisionMissionBlock'
import { VisionTypewriter } from '@/components/sections/VisionTypewriter'
import { AboutHeroScroll }    from '@/components/sections/AboutHeroScroll'
import { HomeBoutiqueSection }  from '@/components/sections/HomeBoutiqueSection'
import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/animations/ScrollReveal'

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
  const t = await getTranslations({ locale, namespace: 'about.meta' })
  const base = generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
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

const values = ['exceptional', 'exclusive', 'confidential', 'trust', 'experience', 'elegance'] as const
const ctaProfiles = ['seller', 'buyer', 'partner'] as const

export default function AboutPage() {
  const t  = useTranslations('about')
  const ta = useTranslations('aboutPage')
  const locale = useLocale()

  return (
    <>
      {/* Hero — scroll-driven, style size.swiss */}
      <AboutHeroScroll />

      {/* Name — Etymology */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-10"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('name.label')}</p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] max-w-2xl mb-16 whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('name.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-16">
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="bg-ag-white p-10">
                <p className="font-sans font-bold text-ag-black tracking-[0.08em] text-[22px] mb-4">
                  {t(`name.roots.${i}.word`)}
                </p>
                <p className="text-[15px] text-ag-gray leading-relaxed">
                  {t(`name.roots.${i}.meaning`)}
                </p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl space-y-5">
            <p className="text-[16px] text-ag-black leading-relaxed font-semibold">
              {t('name.synthesis')}
            </p>
            <p className="text-[15px] text-ag-gray leading-relaxed">
              {t('name.formerly')}
            </p>
          </div>
        </ScrollReveal>
      </section>

      <VisionMissionBlock
        visionLabel={
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('vision.label')}</p>
        }
        visionText={
          <VisionTypewriter
            segments={t.raw('vision.segments') as { t: string; bold?: boolean }[]}
          />
        }
        dnaContent={
          <section className="border-b border-ag-border bg-ag-white">
            <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12 py-20">
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-12"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('dna.label')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
                {values.map((v) => (
                  <div key={v} className="bg-ag-off-white p-8 hover:bg-ag-white transition-colors">
                    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-apex-ink mb-4">
                      {t(`values.${v}.label`)}
                    </p>
                    <p className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-none mb-3">
                      {t(`values.${v}.title`)}
                    </p>
                    <p className="text-[15px] text-ag-gray leading-relaxed">
                      {t(`values.${v}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/culture"
                className="mt-10 inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-ag-black underline decoration-ag-border decoration-2 underline-offset-4 transition-colors hover:text-ag-apex-ink"
              >
                {t('dna.cultureCta')} <ArrowUpRight size={14} />
              </Link>
            </ScrollReveal>
          </section>
        }
      />

      {/* Contribution */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-10"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('contribution.label')}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] whitespace-pre-line"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('contribution.title')}
            </h2>
            <p className="text-[15px] text-ag-gray leading-relaxed self-end">
              {t('contribution.desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="bg-ag-white p-10">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex-ink mb-6">
                  {t(`contribution.items.${i}.num`)}
                </p>
                <h3 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-snug mb-4">
                  {t(`contribution.items.${i}.title`)}
                </h3>
                <p className="text-[15px] text-ag-gray leading-relaxed">
                  {t(`contribution.items.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Pourquoi Aegryn */}
      <section className="border-b border-ag-border bg-ag-white">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-10"><span className="inline-block h-px w-5 bg-ag-apex/50" />{ta('whyAegryn.label')}</p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] max-w-2xl mb-12"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {ta('whyAegryn.title')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:">
            {[ta('whyAegryn.p1'), ta('whyAegryn.p2')].map((block, i) => {
              const [constat, reponse] = block.split('\n\n')
              return (
                <div key={i} className={`space-y-5 ${i === 1 ? 'lg:pl-16' : ''}`}>
                  <p className="text-[15px] text-ag-gray leading-relaxed">{constat}</p>
                  <p className="text-[15px] text-ag-black font-semibold leading-relaxed">
                    {reponse}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="mt-12 pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-4"><span className="inline-block h-px w-5 bg-ag-apex/50" />{ta('whyAegryn.p3Label')}</p>
                <p className="text-[15px] text-ag-gray leading-relaxed">
                  {ta('whyAegryn.p3')}
                </p>
              </div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
                <Image
                  src="/images/about/about_lausanne.jpg"
                  alt={ta('whyAegryn.p3ImageAlt')}
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Founder */}
      <section id="fondateur" className="border-b border-ag-border" style={{ scrollMarginTop: '80px' }}>
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-10"><span className="inline-block h-px w-5 bg-ag-apex/50" />{ta('founder.label')}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1]"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {ta('founder.title')}
            </h2>
            <div className="space-y-5">
              {ta('founder.desc').split('\n\n').map((para, i) => (
                <p key={i} className="text-[15px] text-ag-gray leading-relaxed">{para}</p>
              ))}
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/advisory"
                  className="rounded-lg inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-black border border-ag-border px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
                >
                  {ta('founder.disciplinesCta')} <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase bg-ag-apex text-ag-navy px-6 py-3 hover:bg-ag-apex/90 transition-colors"
                >
                  {ta('founder.cta')} <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Travailler avec Aegryn — 5 disciplines */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-10"><span className="inline-block h-px w-5 bg-ag-apex/50" />{ta('workWith.label')}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] whitespace-pre-line"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {ta('workWith.title')}
            </h2>
            <p className="text-[15px] text-ag-gray leading-relaxed self-end">
              {ta('workWith.sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px">
            {([0, 1, 2, 3, 4] as const).map((i) => (
              <div key={i} className="bg-ag-white p-8 flex flex-col gap-5">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light">
                  {ta(`workWith.items.${i}.num`)}
                </p>
                <p className="font-sans font-bold text-ag-black text-[13px] tracking-[0.12em] leading-none">
                  {ta(`workWith.items.${i}.title`)}
                </p>
                <p className="text-[15px] text-ag-gray leading-relaxed flex-1">
                  {ta(`workWith.items.${i}.desc`)}
                </p>
                <Link
                  href={ta(`workWith.items.${i}.href`) as never}
                  className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-4 py-2.5 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all self-start"
                >
                  {ta(`workWith.items.${i}.cta`)} <ArrowUpRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Swiss */}
      <section className="bg-ag-navy py-28 px-6 md:px-12 border-b border-ag-navy">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex mb-4"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('swiss.groupLabel')}</p>
              <h2
                className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] whitespace-pre-line mb-8"
                style={{ fontSize: 'clamp(26px,3vw,44px)' }}
              >
                {t('swiss.title')}
              </h2>
              <Link
                href="/advisory"
                className="rounded-lg inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
              >
                {t('swiss.cta')} <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-[15px] text-white/70 leading-relaxed self-center">
              {t('swiss.desc')}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Segments clients */}
      <HomeBoutiqueSection locale={locale} />



      {/* CTA tripartite */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-16"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('cta.label')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {ctaProfiles.map((profile) => (
              <div key={profile} className="bg-ag-white p-10 flex flex-col gap-6">
                <div className="flex-1">
                  <h3 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] leading-snug mb-3">
                    {t(`cta.${profile}.title`)}
                  </h3>
                  <p className="text-[15px] text-ag-gray leading-relaxed">
                    {t(`cta.${profile}.desc`)}
                  </p>
                </div>
                <Link
                  href={t(`cta.${profile}.href`) as never}
                  className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-5 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all self-start"
                >
                  {t(`cta.${profile}.btn`)} <ArrowUpRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
