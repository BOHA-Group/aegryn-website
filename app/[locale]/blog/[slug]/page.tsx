import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Calendar, Clock, ArrowUpRight } from 'lucide-react'
import { ARTICLES, ARTICLE_CATEGORIES, getLocaleText, type ContentBlock, type ArticleCategory } from '@/data/articles'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
const OG_FALLBACK = `${BASE}/og/blog-default.png`

const CATEGORY_KEYWORDS: Record<ArticleCategory, string[]> = {
  market:        ['M&A tech Europe', 'transaction actifs numériques', 'multiple valorisation SaaS', 'marché cession tech', 'deal flow Europe'],
  seller:        ['vendre son SaaS', 'cession startup tech', 'exit fondateur', 'valorisation SaaS', 'due diligence vendeur'],
  buyer:         ['acheter un SaaS', 'acquisition tech Europe', 'search fund', 'family office tech', 'private equity SaaS'],
  certification: ['certification actif tech', 'grade Aegryn', 'audit SaaS', 'CIFS Protocol', 'due diligence indépendante'],
  strategy:      ['stratégie cession tech', 'M&A stratégie', 'place de marché actifs tech', 'Aegryn Transaction', 'Swiss tech hub'],
  case_study:    ['étude de cas SaaS', 'exit SaaS Europe', 'transaction certifiée', 'M&A case study tech', 'Aegryn Grade'],
  legal:         ['share deal asset deal', 'RGPD cession données', 'fiscalité exit fondateur', 'earnout SaaS', 'structuration juridique cession'],
  vertical:      ['LegalTech valorisation', 'FinTech M&A', 'AI SaaS multiples', 'vertical software Europe', 'actif tech certifié'],
  dach:          ['Tech M&A DACH', 'SaaS cession Allemagne', 'Suisse hub tech', 'Österreich startup exit', 'actif numérique DACH'],
}

const BASE_ARTICLE_KEYWORDS = [
  'Aegryn', 'actifs tech certifiés', 'Suisse', 'cession SaaS', 'transaction privée',
  'Engineered to Last', 'certification indépendante', 'grade actif numérique',
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) return {}
  const title       = getLocaleText(article.title, locale)
  const description = getLocaleText(article.excerpt, locale)
  const ogImage     = article.ogImage ?? OG_FALLBACK
  const canonical   = `${BASE}/${locale}/blog/${slug}`
  const keywords    = [
    ...BASE_ARTICLE_KEYWORDS,
    ...(CATEGORY_KEYWORDS[article.category] ?? []),
    ...(article.keywords ?? []),
  ]
  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Aegryn', url: BASE }],
    creator: 'Aegryn Sàrl',
    publisher: 'Aegryn Sàrl',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-image-preview': 'large',
        'max-snippet':       -1,
      },
    },
    alternates: {
      canonical,
      languages: {
        fr:          `${BASE}/fr/blog/${slug}`,
        en:          `${BASE}/en/blog/${slug}`,
        de:          `${BASE}/de/blog/${slug}`,
        es:          `${BASE}/es/blog/${slug}`,
        it:          `${BASE}/it/blog/${slug}`,
        nl:          `${BASE}/nl/blog/${slug}`,
        'x-default': `${BASE}/fr/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url:           canonical,
      siteName:      'Aegryn',
      type:          'article',
      publishedTime: new Date(article.date).toISOString(),
      modifiedTime:  new Date(article.date).toISOString(),
      authors:       ['Aegryn'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [ogImage],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) notFound()

  const t           = await getTranslations({ locale, namespace: 'discover' })
  const catLabel = getLocaleText(ARTICLE_CATEGORIES[article.category], locale)
  const dateStr  = new Date(article.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <main className="bg-ag-white">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 hover:text-white/70 transition-colors mb-8 inline-block"
          >
            {t('backToDiscover')}
          </Link>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-4">
            {catLabel}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.18] tracking-[-0.03em] mb-6"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {getLocaleText(article.title, locale)}
          </h1>
          <p className="font-sans text-[15px] text-white/55 leading-relaxed mb-8">
            {getLocaleText(article.excerpt, locale)}
          </p>
          <div className="flex items-center gap-6 text-white/30">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em]">
              <Calendar size={11} /> {dateStr}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em]">
              <Clock size={11} /> {article.readMin} {t('readMin')}
            </span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {article.body ? (
            <div className="space-y-8">
              {article.body.map((block: ContentBlock, i: number) => {
                if (block.type === 'p') return (
                  <p key={i} className="font-sans text-[16px] text-ag-gray leading-[1.85]">
                    {getLocaleText(block.text, locale)}
                  </p>
                )
                if (block.type === 'h2') return (
                  <h2 key={i} className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
                    {getLocaleText(block.text, locale)}
                  </h2>
                )
                if (block.type === 'h3') return (
                  <h3 key={i} className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.01em] leading-snug">
                    {getLocaleText(block.text, locale)}
                  </h3>
                )
                if (block.type === 'list') return (
                  <ul key={i} className="space-y-3 pl-0">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 font-sans text-[15px] text-ag-gray leading-relaxed">
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ag-apex rounded-full" />
                        {getLocaleText(item, locale)}
                      </li>
                    ))}
                  </ul>
                )
                if (block.type === 'quote') return (
                  <blockquote key={i} className="border-l-2 border-ag-apex pl-6 my-8">
                    <p className="font-sans italic text-[17px] text-ag-black leading-[1.7] mb-3">
                      &ldquo;{getLocaleText(block.text, locale)}&rdquo;
                    </p>
                    {block.author && (
                      <cite className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light not-italic">
                        — {block.author}
                      </cite>
                    )}
                  </blockquote>
                )
                if (block.type === 'stats') return (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ag-border border border-ag-border my-8">
                    {block.items.map((stat, j) => (
                      <div key={j} className="bg-ag-off-white p-6">
                        <p className="font-sans font-bold text-ag-apex tracking-[-0.03em] leading-none mb-2"
                           style={{ fontSize: 'clamp(22px,2.5vw,34px)' }}>
                          {stat.value}
                        </p>
                        <p className="font-sans text-[11px] text-ag-gray leading-snug">
                          {getLocaleText(stat.label, locale)}
                        </p>
                      </div>
                    ))}
                  </div>
                )
                return null
              })}
            </div>
          ) : (
            <div className="border border-ag-border bg-ag-off-white p-10 text-center">
              <p className="font-sans text-[14px] text-ag-gray mb-2">
                {t('bodyComingSoon')}
              </p>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ag-gray-light">
                Aegryn Editorial — Q3 2026
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI Act art. 50 — mention éditoriale (si article assisté par IA) */}
      {article.aiAssisted && (
        <section className="py-6 px-6 border-t border-ag-border bg-ag-off-white">
          <div className="max-w-3xl mx-auto flex items-start gap-3">
            <span className="shrink-0 mt-0.5 font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light border border-ag-border px-2 py-0.5">
              IA
            </span>
            <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
              {t('aiEditorialNotice')}
            </p>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section className="py-8 px-6 border-t border-ag-border">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light hover:text-ag-black transition-colors inline-block"
          >
            {t('backToDiscover')}
          </Link>
        </div>
      </section>

      {/* Related CTA */}
      <section className="py-16 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-sans font-semibold text-ag-black text-[17px] max-w-md">
            {t('ctaTeaser')}
          </p>
          <div className="flex gap-3 shrink-0">
            <Link href="/grade" className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-3 hover:bg-ag-navy-mid transition-colors">
              {t('ctaGrade')} <ArrowUpRight size={12} />
            </Link>
            <Link href="/transact" className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-3 hover:border-ag-black hover:text-ag-black transition-all">
              {t('ctaTransaction')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
