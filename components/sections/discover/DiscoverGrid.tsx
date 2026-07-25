'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Calendar, Clock } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { ARTICLES, ARTICLE_CATEGORIES, type ArticleCategory } from '@/data/articles'

type Filter = 'all' | ArticleCategory

interface Props { locale: string }

export function DiscoverGrid({ locale }: Props) {
  const t    = useTranslations('discover')
  const lang = locale === 'fr' ? 'fr' : 'en'
  const [active, setActive] = useState<Filter>('all')
  const gridRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const filtered = active === 'all'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === active)

  const featured   = ARTICLES.filter(a => a.featured).slice(0, 3)
  const showFeatured = active === 'all'

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
  }, [active])

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
              {featured.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
                {filtered.map(article => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="discover-card group bg-ag-white p-8 flex flex-col gap-4 hover:bg-ag-off-white transition-colors"
                  >
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-apex">
                      {ARTICLE_CATEGORIES[article.category][lang]}
                    </p>
                    <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.02em] leading-snug group-hover:text-ag-navy transition-colors">
                      {article.title[lang]}
                    </h3>
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
            )}
          </div>

          {/* Newsletter strip */}
          <div className="mt-16 border border-ag-border bg-ag-white p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-2">{t('newsletterLabel')}</p>
              <p className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em] mb-1">{t('newsletterTitle')}</p>
              <p className="font-sans text-[13px] text-ag-gray">{t('newsletterDesc')}</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy-mid transition-colors"
            >
              {t('newsletterCta')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
