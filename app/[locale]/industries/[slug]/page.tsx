import type { Metadata } from 'next'
import { notFound }       from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Image               from 'next/image'
import { Link }            from '@/i18n/navigation'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { WaveReveal }   from '@/components/animations/WaveReveal'
import { INDUSTRIES, getIndustry, getOtherIndustries, getLocaleText } from '@/data/industries'
import { ARTICLES }  from '@/data/articles'
import { IndustryArticles } from '@/components/sections/industries/IndustryArticles'
import { IndustrySegments } from '@/components/sections/industries/IndustrySegments'

const SECTOR_IMG_FALLBACK = '/images/blog/modern-office.jpg'

type Props = { params: Promise<{ locale: string; slug: string }> }

/* ── Slugs statiques ────────────────────────────────────────── */
export function generateStaticParams() {
  return INDUSTRIES.map(i => ({ slug: i.slug }))
}

/* ── Metadata ───────────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const ind = getIndustry(slug)
  if (!ind) return {}
  return generateAegrynMetadata({
    title: `${getLocaleText(ind.name, locale)} | Aegryn`,
    description: getLocaleText(ind.vision, locale).slice(0, 160).replace(/\n/g, ' '),
    path: `/industries/${slug}`,
    locale,
  })
}

/* ── Helpers ────────────────────────────────────────────────── */
const CLUSTER_IMAGES: Record<string, string> = {
  finance:   '/images/industries/theme_fintech.jpg',
  sante:     '/images/industries/cluster-sante.jpg',
  industrie: '/images/industries/cluster-industrie.jpg',
  commerce:  '/images/industries/theme_marketplace.jpg',
  tech:      '/images/industries/theme_AI.jpg',
}

/* ── Page ───────────────────────────────────────────────────── */
export default async function IndustryDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const ind = getIndustry(slug)
  if (!ind) notFound()

  const t       = await getTranslations({ locale, namespace: 'industries.page' })
  const others  = getOtherIndustries(slug)
  const articles = ARTICLES.filter(a => ind.articleSlugs.includes(a.slug))

  return (
    <main className="min-h-screen bg-ag-white">

      {/* ════════════════════════════════════════════════════════
          HERO — photo pleine + titre bold
      ════════════════════════════════════════════════════════ */}
      <section className="relative bg-ag-navy overflow-hidden" style={{ minHeight: 'clamp(460px, 50vw, 620px)' }}>
        <Image
          src={ind.img}
          alt={getLocaleText(ind.imgAlt, locale)}
          fill
          className="object-cover opacity-45"
          sizes="100vw"
          priority
          fetchPriority="high"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/60 via-ag-navy/40 to-ag-navy/95" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-20 flex flex-col gap-6">
          {/* Breadcrumb */}
          <Link href={"/industries" as never}
            className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors w-fit">
            <ArrowLeft size={11} /> {t('industriesTitle')}
          </Link>

          {/* Métriques clés en ligne */}
          <ScrollReveal y={8} className="flex flex-wrap gap-6 mt-2" staggerChildren>
            {ind.keyMetrics.map((m, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-mono font-bold text-ag-apex" style={{ fontSize: 'clamp(18px,2vw,26px)' }}>{m.value}</span>
                <span className="font-sans text-[11px] text-white/70 max-w-[180px] leading-snug">{getLocaleText(m.label, locale)}</span>
              </div>
            ))}
          </ScrollReveal>

          {/* Titre */}
          <WaveReveal delay={0.1}>
            <h1
              className="font-sans font-bold text-white leading-[1.0] tracking-[-0.03em] max-w-3xl text-balance"
              style={{ fontSize: 'clamp(36px,5vw,72px)' }}
            >
              {getLocaleText(ind.name, locale)}
            </h1>
          </WaveReveal>

          {/* CTAs */}
          <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/contact"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[10px] tracking-[0.18em] uppercase px-7 py-3 font-semibold hover:bg-ag-apex/90 transition-colors">
              {t('contactCta')}
            </Link>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          VISION
      ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3">
              {t('readingLabel')}
            </p>
          </div>
          <div className="lg:col-span-8">
            {getLocaleText(ind.vision, locale).split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="font-sans text-[16px] text-ag-gray leading-relaxed mb-4 last:mb-0">
                {para.trim()}
              </p>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTEURS — cartes avec image (format carte industrie)
      ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">
            {t('sectorsLabel')}
          </p>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${ind.sectors.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {ind.sectors.map((sector, i) => {
              const sectorName = getLocaleText(sector.name, locale)
              const img = sector.img ?? SECTOR_IMG_FALLBACK
              return (
                <div
                  key={sectorName}
                  className="group relative overflow-hidden rounded-xl flex flex-col justify-end"
                  style={{ height: 'clamp(180px, 18vw, 240px)' }}
                >
                  {/* Image pleine */}
                  <Image
                    src={img}
                    alt={sectorName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {/* Dégradé bas → transparent */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent rounded-xl" />

                  {/* Numéro haut gauche */}
                  <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.22em] text-white/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Tag haut droite */}
                  <span className="absolute top-4 right-4 font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 bg-black/40 backdrop-blur-sm border border-white/15 text-white/70 rounded-md whitespace-nowrap">
                    {getLocaleText(sector.tag, locale)}
                  </span>

                  {/* Titre + desc en bas */}
                  <div className="relative z-10 p-5">
                    <h3
                      className="font-sans font-bold text-white leading-[1.1] tracking-[-0.02em] mb-1.5"
                      style={{ fontSize: 'clamp(13px,1.2vw,16px)' }}
                    >
                      {sectorName}
                    </h3>
                    <p className="font-sans text-[12px] text-white/70 leading-relaxed line-clamp-2">
                      {getLocaleText(sector.desc, locale)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════
          EXPERTISES — 2 colonnes
      ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">
            {t('expertiseLabel')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ind.expertise.map((ex, i) => (
              <div key={i} className="bg-ag-white border border-ag-border rounded-xl p-7 flex flex-col gap-3 hover:bg-ag-off-white transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] tracking-[0.22em] text-ag-apex-ink">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-snug">{getLocaleText(ex.title, locale)}</h3>
                </div>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed">{getLocaleText(ex.desc, locale)}</p>
              </div>
            ))}
          </div>
          {ind.expertiseFootnote && (
            <p className="mt-6 font-sans text-[13px] text-ag-gray italic">
              {getLocaleText(ind.expertiseFootnote, locale)}
            </p>
          )}
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════
          SEGMENTS & PROBLÉMATIQUES — avec storytelling persona
      ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-2">
            {t('segmentsLabel')}
          </p>
          <p className="font-sans text-[13px] text-ag-gray-light mb-8 max-w-xl">
            {t('segmentsSub')}
          </p>
          <IndustrySegments
            segments={ind.segments.map(seg => ({
              label:    getLocaleText(seg.label, locale),
              story:    getLocaleText(seg.story, locale),
              problems: seg.problems.map(pb => getLocaleText(pb, locale)),
              icon:     seg.icon,
            }))}
            problemsLabel={ind.problemsLabel ? getLocaleText(ind.problemsLabel, locale) : t('problemsLabel')}
            footnote={ind.segmentsFootnote ? getLocaleText(ind.segmentsFootnote, locale) : undefined}
          />
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════
          PUBLICATIONS ASSOCIÉES
      ════════════════════════════════════════════════════════ */}
      <IndustryArticles articles={articles} locale={locale} />

      {/* ════════════════════════════════════════════════════════
          EXPLORE OTHER INDUSTRIES — compact, évite le scroll up
      ════════════════════════════════════════════════════════ */}
      <section className="py-10 px-6 md:px-12 border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ag-gray-light mb-5">
            {t('exploreLabel')}
          </p>
          <div className="flex flex-wrap gap-3">
            {others.map(other => (
              <Link
                key={other.slug}
                href={`/industries/${other.slug}` as never}
                className="group flex items-center gap-3 border border-ag-border rounded-xl px-4 py-3 hover:border-ag-black transition-all bg-ag-white hover:bg-ag-off-white"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={CLUSTER_IMAGES[other.clusterId] ?? other.img}
                    alt={getLocaleText(other.name, locale)}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <span className="font-sans text-[12px] font-semibold text-ag-black leading-snug max-w-[180px]">
                  {getLocaleText(other.name, locale)}
                </span>
                <ArrowUpRight size={11} className="text-ag-gray-light group-hover:text-ag-black transition-colors shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
