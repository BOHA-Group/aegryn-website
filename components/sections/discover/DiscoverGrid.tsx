'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Calendar, Clock, Search } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { ARTICLES, ARTICLE_CATEGORIES, type ArticleCategory } from '@/data/articles'
import { NewsletterSubscribeForm } from '@/components/newsletter/NewsletterSubscribeForm'

type Filter = 'all' | ArticleCategory

interface Props { locale: string }

export function DiscoverGrid({ locale }: Props) {
  const t    = useTranslations('discover')
  const VALID_LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
  type ValidLocale = typeof VALID_LOCALES[number]
  const lang: ValidLocale = (VALID_LOCALES as readonly string[]).includes(locale) ? locale as ValidLocale : 'en'
  const [active, setActive] = useState<Filter>('all')
  const [query, setQuery]   = useState('')
  const [page, setPage]     = useState(1)
  const PAGE_SIZE = 12
  const gridRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const filtered = ARTICLES
    .filter(a => active === 'all' || a.category === active)
    .filter(a => {
      if (!query.trim()) return true
      const q = query.toLowerCase()
      const title   = (a.title[lang]   ?? a.title.en ?? '').toLowerCase()
      const excerpt = (a.excerpt[lang] ?? a.excerpt.en ?? '').toLowerCase()
      const cat     = (ARTICLE_CATEGORIES[a.category][lang] ?? ARTICLE_CATEGORIES[a.category].en ?? '').toLowerCase()
      return title.includes(q) || excerpt.includes(q) || cat.includes(q)
    })

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const featured   = ARTICLES.filter(a => a.featured).slice(0, 3)
  const showFeatured = active === 'all'

  useEffect(() => { setPage(1) }, [active, query])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.discover-card', {
        opacity: 0, y: 20, stagger: 0.07,
        ease: 'expo.out', duration: 0.6,
        immediateRender: false,
        clearProps: 'opacity,transform',
      })
    }, gridRef)
    return () => ctx.revert()
  }, [active, page])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(['.discover-hero-label', '.discover-hero-title', '.discover-hero-desc'], {
        opacity: 0, y: 16, stagger: 0.12,
        ease: 'expo.out', duration: 0.7, delay: 0.1,
        immediateRender: false,
        clearProps: 'opacity,transform',
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const allFilters: { key: Filter; label: string }[] = [
    { key: 'all',           label: t('filterAll')          },
    { key: 'market',        label: t('filterMarket')       },
    { key: 'seller',        label: t('filterSeller')       },
    { key: 'buyer',         label: t('filterBuyer')        },
    { key: 'certification', label: t('filterCertification') },
    { key: 'strategy',      label: t('filterStrategy')     },
    { key: 'case_study',    label: t('filterCaseStudy')    },
    { key: 'legal',         label: t('filterLegal')        },
    { key: 'vertical',      label: t('filterVertical')     },
    { key: 'dach',          label: t('filterDACH')         },
  ]

  const filters = allFilters.filter(f =>
    f.key === 'all' || ARTICLES.some(a => a.category === f.key)
  )

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="discover-hero-label font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h1
            className="discover-hero-title font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('title')}
          </h1>
          <p className="discover-hero-desc font-sans text-[16px] text-white/55 max-w-xl">
            {t('desc')}
          </p>
        </div>
      </section>

      {/* Featured articles */}
      {showFeatured && (
        <section className="bg-ag-white border-t border-ag-border py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
              {t('featuredLabel')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 border border-ag-border divide-y md:divide-y-0 md:divide-x divide-ag-border">
              {featured.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}` as never}
                  className="group bg-ag-white p-8 flex flex-col gap-4 hover:bg-ag-off-white transition-colors"
                >
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-apex">
                    {ARTICLE_CATEGORIES[article.category][lang]}
                  </p>
                  <h2 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.02em] leading-snug group-hover:text-ag-navy transition-colors">
                    {article.title[lang]}
                  </h2>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                    {article.excerpt[lang]}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-ag-border">
                    <div className="flex items-center gap-4 text-ag-gray-light">
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Calendar size={10} /> {formatDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock size={10} /> {article.readMin} {t('readMin')}
                      </span>
                    </div>
                    <ArrowUpRight size={14} className="text-ag-gray-light group-hover:text-ag-apex transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All articles with filter */}
      <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative max-w-lg">
              <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-ag-gray-light pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 border border-ag-border bg-ag-white font-sans text-[13px] text-ag-black placeholder-ag-gray-light focus:outline-none focus:border-ag-black transition-colors"
              />
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-1 flex-wrap mb-10 pb-6 border-b border-ag-border">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mr-4 w-full mb-3 sm:w-auto sm:mb-0">
              {t('allArticles')}
            </p>
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors ${
                  active === key
                    ? 'border-ag-black bg-ag-black text-white'
                    : 'border-ag-border bg-ag-white text-ag-gray hover:border-ag-black hover:text-ag-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div ref={gridRef}>
            {filtered.length === 0 ? (
              <p className="font-sans text-[14px] text-ag-gray py-12 text-center">{t('noArticles')}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-ag-border divide-y md:divide-y-0">
                {paginated.map((article, idx) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}` as never}
                    className={`discover-card group bg-ag-white p-8 flex flex-col gap-4 hover:bg-ag-off-white transition-colors border-ag-border ${
                      idx % 3 !== 2 ? 'md:border-r' : ''
                    } ${idx >= 3 ? 'border-t' : ''}`}
                  >
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-apex">
                      {ARTICLE_CATEGORIES[article.category][lang] ?? ARTICLE_CATEGORIES[article.category].en}
                    </p>
                    <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.02em] leading-snug group-hover:text-ag-navy transition-colors">
                      {article.title[lang] ?? article.title.en}
                    </h3>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                      {article.excerpt[lang] ?? article.excerpt.en}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-ag-border">
                      <div className="flex items-center gap-4 text-ag-gray-light">
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Calendar size={10} /> {formatDate(article.date)}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Clock size={10} /> {article.readMin} {t('readMin')}
                        </span>
                      </div>
                      <ArrowUpRight size={14} className="text-ag-gray-light group-hover:text-ag-apex transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pb-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 border border-ag-border bg-ag-white text-ag-gray hover:border-ag-black hover:text-ag-black disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`font-mono text-[10px] tracking-[0.14em] uppercase w-9 h-9 border transition-colors ${
                    n === page
                      ? 'border-ag-black bg-ag-black text-white'
                      : 'border-ag-border bg-ag-white text-ag-gray hover:border-ag-black hover:text-ag-black'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 border border-ag-border bg-ag-white text-ag-gray hover:border-ag-black hover:text-ag-black disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                →
              </button>
            </div>
          )}

          {/* Newsletter strip */}
          <div className="mt-16 border border-ag-border bg-ag-white p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-2">{t('newsletterLabel')}</p>
              <p className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em] mb-1">{t('newsletterTitle')}</p>
              <p className="font-sans text-[13px] text-ag-gray">{t('newsletterDesc')}</p>
            </div>
            <NewsletterSubscribeForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  )
}
