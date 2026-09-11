import type { Metadata } from 'next'
import { notFound }       from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Image               from 'next/image'
import { Link }            from '@/i18n/navigation'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { INDUSTRIES, getIndustry, getOtherIndustries, type IndustryData } from '@/data/industries'
import { ARTICLES, getLocaleText }  from '@/data/articles'

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
  const t = await getTranslations({ locale, namespace: 'industries.page' })
  return generateAegrynMetadata({
    title: `${ind.clusterId} — Aegryn`,
    description: ind.vision.slice(0, 160).replace(/\n/g, ' '),
    path: `/industries/${slug}`,
    locale,
  })
}

/* ── Helpers ────────────────────────────────────────────────── */
const CLUSTER_IMAGES: Record<string, string> = {
  finance:   '/images/theme_fintech.jpg',
  sante:     '/images/grade-usecases/uc-due-diligence.jpg',
  industrie: '/images/theme_marketplace.jpg',
  commerce:  '/images/theme_saas.jpg',
  tech:      '/images/theme_AI.jpg',
}

const CLUSTER_SLUGS: Record<string, string> = {
  finance:   'finance-capital',
  sante:     'sante-sciences-de-la-vie',
  industrie: 'industrie-energie-infrastructure',
  commerce:  'commerce-services-experience-client',
  tech:      'tech-innovation-secteur-public',
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
      <section className="relative bg-ag-navy overflow-hidden" style={{ minHeight: 'clamp(380px, 45vw, 560px)' }}>
        <Image
          src={ind.img}
          alt={ind.imgAlt}
          fill
          className="object-cover opacity-45"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/60 via-ag-navy/40 to-ag-navy/95" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-20 flex flex-col gap-6">
          {/* Breadcrumb */}
          <Link href={"/industries" as never}
            className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 hover:text-white/70 transition-colors w-fit">
            <ArrowLeft size={11} /> {t('industriesTitle')}
          </Link>

          {/* Métriques clés en ligne */}
          <div className="flex flex-wrap gap-6 mt-2">
            {ind.keyMetrics.map((m, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-mono font-bold text-ag-apex" style={{ fontSize: 'clamp(18px,2vw,26px)' }}>{m.value}</span>
                <span className="font-sans text-[11px] text-white/40 max-w-[180px] leading-snug">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Titre */}
          <h1
            className="font-sans font-bold text-white leading-[1.0] tracking-[-0.03em] max-w-3xl"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            {ind.clusterId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </h1>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Link href="/grade"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[10px] tracking-[0.18em] uppercase px-7 py-3 font-semibold hover:bg-white transition-colors">
              {t('certifCta')} <ArrowUpRight size={12} />
            </Link>
            <Link href="/contact"
              className="rounded-lg inline-flex items-center gap-2 border border-white/20 text-white/55 font-mono text-[10px] tracking-[0.18em] uppercase px-7 py-3 hover:border-white/50 hover:text-white transition-all">
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          VISION
      ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3">
              Notre lecture
            </p>
          </div>
          <div className="lg:col-span-8">
            {ind.vision.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="font-sans text-[15px] text-ag-gray leading-relaxed mb-4 last:mb-0">
                {para.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTEURS — grille compacte
      ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">
            Secteurs couverts
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ind.sectors.map(sector => (
              <div key={sector.name} className="bg-ag-white border border-ag-border rounded-xl p-6 flex flex-col gap-2 hover:bg-ag-off-white transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug">{sector.name}</p>
                  <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 border border-ag-border text-ag-gray-light bg-ag-off-white shrink-0 whitespace-nowrap mt-0.5">
                    {sector.tag}
                  </span>
                </div>
                <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          EXPERTISES — 2 colonnes
      ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">
            Nos expertises appliquées
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ind.expertise.map((ex, i) => (
              <div key={i} className="bg-ag-white border border-ag-border rounded-xl p-7 flex flex-col gap-3 hover:bg-ag-off-white transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] tracking-[0.22em] text-ag-apex">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-sans font-semibold text-ag-black text-[13px] leading-snug">{ex.title}</h3>
                </div>
                <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SEGMENTS & PROBLÉMATIQUES
      ════════════════════════════════════════════════════════ */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">
            Comment nous accompagnons nos clients
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ind.segments.map((seg, i) => (
              <div key={i} className="border border-ag-border rounded-xl p-7 flex flex-col gap-4">
                <div className="flex items-center gap-3 pb-4 border-b border-ag-border">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-ag-apex shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-sans font-semibold text-ag-black text-[13px] leading-snug">{seg.label}</h3>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {seg.problems.map((pb, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-ag-apex shrink-0" />
                      <span className="font-sans text-[12px] text-ag-gray leading-relaxed">{pb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PUBLICATIONS ASSOCIÉES
      ════════════════════════════════════════════════════════ */}
      {articles.length > 0 && (
        <section className="border-b border-ag-border bg-ag-off-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
            <div className="flex items-center justify-between mb-8">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light">
                Publications associées
              </p>
              <Link href="/blog"
                className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray hover:text-ag-black transition-colors">
                Toutes nos publications <ArrowUpRight size={10} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}` as never}
                  className="group bg-ag-white border border-ag-border rounded-xl p-6 flex flex-col gap-4 hover:border-ag-black transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-ag-gray-light">
                      {article.date}
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.12em] uppercase px-1.5 py-0.5 border border-ag-border text-ag-gray-light">
                      {article.readMin} min
                    </span>
                  </div>
                  <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug group-hover:text-ag-black">
                    {getLocaleText(article.title, locale)}
                  </p>
                  <p className="font-sans text-[12px] text-ag-gray leading-relaxed line-clamp-3">
                    {getLocaleText(article.excerpt, locale)}
                  </p>
                  <span className="mt-auto font-mono text-[9px] tracking-[0.18em] uppercase text-ag-gray group-hover:text-ag-black transition-colors flex items-center gap-1.5">
                    Lire <ArrowUpRight size={9} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          CTA CERTIFICATION
      ════════════════════════════════════════════════════════ */}
      <section className="bg-ag-navy border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex/70 mb-3">
              Certification CIFSO 5000
            </p>
            <p className="font-sans font-bold text-white max-w-lg leading-snug tracking-[-0.025em]"
              style={{ fontSize: 'clamp(18px,2.2vw,28px)' }}>
              Faites évaluer votre organisation et obtenez une certification indépendante défendable.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/grade"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[10px] tracking-[0.16em] uppercase px-6 py-3 font-semibold hover:bg-white transition-colors">
              {t('certifCta')} <ArrowUpRight size={12} />
            </Link>
            <Link href="/contact"
              className="rounded-lg inline-flex items-center gap-2 border border-white/20 text-white/55 font-mono text-[10px] tracking-[0.16em] uppercase px-6 py-3 hover:border-white/50 hover:text-white transition-all">
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          EXPLORE OTHER INDUSTRIES — compact, évite le scroll up
      ════════════════════════════════════════════════════════ */}
      <section className="py-10 px-6 md:px-12 border-b border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ag-gray-light mb-5">
            Explorer d'autres industries
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
                    alt={other.clusterId}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <span className="font-sans text-[12px] font-semibold text-ag-black leading-snug max-w-[180px]">
                  {other.clusterId}
                </span>
                <ArrowUpRight size={11} className="text-ag-gray-light group-hover:text-ag-black transition-colors shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
