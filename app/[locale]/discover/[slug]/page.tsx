import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowUpRight } from 'lucide-react'
import { ARTICLES, ARTICLE_CATEGORIES, type ContentBlock } from '@/data/articles'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) return {}
  const lang = (locale === 'fr') ? 'fr' : 'en'
  return {
    title: article.title[lang],
    description: article.excerpt[lang],
  }
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) notFound()

  const lang     = (locale === 'fr') ? 'fr' : 'en'
  const t        = await getTranslations({ locale, namespace: 'discover' })
  const catLabel = ARTICLE_CATEGORIES[article.category][lang]
  const dateStr  = new Date(article.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <main id="main" className="bg-ag-white">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/discover"
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 hover:text-white/70 transition-colors mb-8 inline-block"
          >
            {t('backToDiscover')}
          </Link>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-4">
            {catLabel}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.08] tracking-[-0.03em] mb-6"
            style={{ fontSize: 'clamp(28px,4vw,56px)' }}
          >
            {article.title[lang]}
          </h1>
          <p className="font-sans text-[15px] text-white/55 leading-relaxed mb-8">
            {article.excerpt[lang]}
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
                    {block.text[lang]}
                  </p>
                )
                if (block.type === 'h2') return (
                  <h2 key={i} className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
                    {block.text[lang]}
                  </h2>
                )
                if (block.type === 'h3') return (
                  <h3 key={i} className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.01em] leading-snug">
                    {block.text[lang]}
                  </h3>
                )
                if (block.type === 'list') return (
                  <ul key={i} className="space-y-3 pl-0">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 font-sans text-[15px] text-ag-gray leading-relaxed">
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ag-apex rounded-full" />
                        {item[lang]}
                      </li>
                    ))}
                  </ul>
                )
                if (block.type === 'quote') return (
                  <blockquote key={i} className="border-l-2 border-ag-apex pl-6 my-8">
                    <p className="font-sans italic text-[17px] text-ag-black leading-[1.7] mb-3">
                      &ldquo;{block.text[lang]}&rdquo;
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
                          {stat.label[lang]}
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
                AEGRYN Editorial — Q3 2026
              </p>
            </div>
          )}
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
            <Link href="/auction" className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-3 hover:border-ag-black hover:text-ag-black transition-all">
              {t('ctaAuction')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
