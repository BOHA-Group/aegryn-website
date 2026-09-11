'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ArrowUpRight, Calendar, Clock, Search, X } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { ARTICLES, ARTICLE_CATEGORIES, type ArticleCategory } from '@/data/articles'
import { BLOG_IMAGES, BLOG_IMAGE_FALLBACK } from '@/data/blogImages'
import { NewsletterSubscribeForm } from '@/components/newsletter/NewsletterSubscribeForm'
import { FilterPills } from '@/components/ui/FilterPills'

type Filter = 'all' | ArticleCategory

interface Props { locale: string }

const PAGE_SIZE = 12

export function DiscoverGrid({ locale }: Props) {
  const t = useTranslations('discover')
  const VALID_LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
  type ValidLocale = typeof VALID_LOCALES[number]
  const lang: ValidLocale = (VALID_LOCALES as readonly string[]).includes(locale)
    ? locale as ValidLocale
    : 'en'

  const [active, setActive]     = useState<Filter>('all')
  const [query, setQuery]       = useState('')
  const [visible, setVisible]   = useState(PAGE_SIZE)
  const gridRef  = useRef<HTMLDivElement>(null)
  const heroRef  = useRef<HTMLElement>(null)

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

  const shown      = filtered.slice(0, visible)
  const hasMore    = visible < filtered.length

  /* Tous les featured (jusqu'à 8 pour la liste droite) */
  const featured     = ARTICLES.filter(a => a.featured)
  const showFeatured = active === 'all' && !query.trim()

  /* Reset visible count quand le filtre / search change */
  useEffect(() => { setVisible(PAGE_SIZE) }, [active, query])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.discover-card', {
        opacity: 0, y: 20, stagger: 0.06,
        ease: 'expo.out', duration: 0.55,
        immediateRender: false,
        clearProps: 'opacity,transform',
      })
    }, gridRef)
    return () => ctx.revert()
  }, [active, visible])

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
    { key: 'all',           label: t('filterAll')           },
    { key: 'market',        label: t('filterMarket')        },
    { key: 'seller',        label: t('filterSeller')        },
    { key: 'buyer',         label: t('filterBuyer')         },
    { key: 'certification', label: t('filterCertification') },
    { key: 'strategy',      label: t('filterStrategy')      },
    { key: 'case_study',    label: t('filterCaseStudy')     },
    { key: 'legal',         label: t('filterLegal')         },
    { key: 'vertical',      label: t('filterVertical')      },
    { key: 'dach',          label: t('filterDACH')          },
  ]

  const filters = allFilters.filter(f =>
    f.key === 'all' || ARTICLES.some(a => a.category === f.key)
  )

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })

  const getImage = (slug: string) => BLOG_IMAGES[slug] ?? BLOG_IMAGE_FALLBACK



  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
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

      {/* ── Featured — format flowpartners : image portrait + liste ── */}
      {showFeatured && featured.length > 0 && (
        <section className="bg-ag-white border-t border-ag-border py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 items-start">

              {/* Article principal — image portrait 4/3 + texte dessous */}
              <Link
                href={`/blog/${featured[0].slug}` as never}
                className="group flex flex-col"
              >
                <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '4/3' }}>
                  <Image
                    src={getImage(featured[0].slug)}
                    alt={featured[0].title[lang] ?? featured[0].title.en}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority
                  />
                </div>
                <div className="mt-5">
                  <h2
                    className="font-sans font-bold text-ag-black leading-[1.15] tracking-[-0.03em] mb-3 group-hover:text-ag-navy transition-colors"
                    style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}
                  >
                    {featured[0].title[lang] ?? featured[0].title.en}
                  </h2>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed line-clamp-3 mb-4">
                    {featured[0].excerpt[lang] ?? featured[0].excerpt.en}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans text-[11px] text-ag-gray-light border border-ag-border rounded-full px-2.5 py-0.5">
                      {ARTICLE_CATEGORIES[featured[0].category][lang]}
                    </span>
                    <span className="text-ag-gray-light text-[11px]">·</span>
                    <span className="font-sans text-[11px] text-ag-gray-light">{formatDate(featured[0].date)}</span>
                  </div>
                </div>
              </Link>

              {/* Colonne droite — titre section + liste jusqu'à 7 articles */}
              <div className="flex flex-col">
                <p
                  className="font-sans font-bold text-ag-black mb-7 leading-tight tracking-[-0.025em]"
                  style={{ fontSize: 'clamp(18px,2vw,26px)' }}
                >
                  {t('featuredLabel')}
                </p>
                <div className="flex flex-col divide-y divide-ag-border">
                  {featured.slice(1, 8).map(article => (
                    <Link
                      key={article.slug}
                      href={`/blog/${article.slug}` as never}
                      className="group py-5 flex flex-col gap-2.5"
                    >
                      <h3 className="font-sans font-semibold text-ag-black text-[14px] tracking-[-0.01em] leading-snug group-hover:text-ag-navy transition-colors">
                        {article.title[lang] ?? article.title.en}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-sans text-[10px] text-ag-gray-light border border-ag-border rounded-full px-2 py-0.5 whitespace-nowrap">
                          {ARTICLE_CATEGORIES[article.category][lang]}
                        </span>
                        <span className="text-ag-gray-light text-[10px]">·</span>
                        <span className="font-sans text-[10px] text-ag-gray-light">{formatDate(article.date)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── All articles ─────────────────────────────────────── */}
      <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Search + filtres */}
          <div className="mb-10 flex flex-col gap-5">

            {/* Search */}
            <div className="relative max-w-sm">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ag-gray-light pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-10 py-2.5 rounded-full border border-ag-border bg-white font-sans text-[13px] text-ag-black placeholder-ag-gray-light focus:outline-none focus:border-ag-black transition-colors shadow-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ag-gray-light hover:text-ag-black transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter pills — onChange préserve la position de scroll */}
            <FilterPills
              options={filters}
              active={active}
              onChange={(key) => {
                const y = window.scrollY
                setActive(key)
                requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }))
              }}
            />

          </div>

          {/* Grille cards */}
          <div ref={gridRef}>
            {filtered.length === 0 ? (
              <p className="font-sans text-[14px] text-ag-gray py-12 text-center">{t('noArticles')}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {shown.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}` as never}
                    className="discover-card group flex flex-col rounded-2xl overflow-hidden border border-ag-border bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Image compacte */}
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={getImage(article.slug)}
                        alt={article.title[lang] ?? article.title.en}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-apex mb-2">
                        {ARTICLE_CATEGORIES[article.category][lang] ?? ARTICLE_CATEGORIES[article.category].en}
                      </p>
                      <h3 className="font-sans font-semibold text-ag-black text-[14px] tracking-[-0.01em] leading-snug mb-2 group-hover:text-ag-navy transition-colors flex-1">
                        {article.title[lang] ?? article.title.en}
                      </h3>
                      <p className="font-sans text-[12px] text-ag-gray leading-relaxed mb-4 line-clamp-2">
                        {article.excerpt[lang] ?? article.excerpt.en}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-ag-border">
                        <div className="flex items-center gap-3 text-ag-gray-light">
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <Calendar size={10} /> {formatDate(article.date)}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <Clock size={10} /> {article.readMin} {t('readMin')}
                          </span>
                        </div>
                        <ArrowUpRight size={13} className="text-ag-gray-light group-hover:text-ag-apex transition-colors shrink-0" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                type="button"
                onClick={() => setVisible(v => v + PAGE_SIZE)}
                className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-ag-navy border border-ag-navy rounded-full px-7 py-3 hover:bg-ag-navy hover:text-white transition-all duration-200"
              >
                {t('loadMore')}
                <span className="font-mono text-[11px] text-ag-gray-light">
                  ({filtered.length - visible})
                </span>
              </button>
            </div>
          )}

          {/* Newsletter */}
          <div className="mt-16 rounded-2xl border border-ag-border bg-white p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
