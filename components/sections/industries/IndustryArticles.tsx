'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowUpRight, Calendar, Clock } from 'lucide-react'
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from '@/data/articles'
import { BLOG_IMAGES, BLOG_IMAGE_FALLBACK } from '@/data/blogImages'

interface Props {
  articles: Article[]
  locale:   string
}

type ValidLocale = 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'
const VALID: ValidLocale[] = ['fr', 'en', 'de', 'es', 'it', 'nl']

function getLang(locale: string): ValidLocale {
  return VALID.includes(locale as ValidLocale) ? (locale as ValidLocale) : 'en'
}

function getText(obj: Record<string, string | undefined>, lang: ValidLocale): string {
  return obj[lang] ?? obj.en ?? ''
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function IndustryArticles({ articles, locale }: Props) {
  const lang = getLang(locale)

  /* Filtres disponibles basés sur les catégories présentes */
  const categories = Array.from(new Set(articles.map(a => a.category))) as ArticleCategory[]
  const [active, setActive] = useState<ArticleCategory | 'all'>('all')

  const filtered = active === 'all'
    ? articles
    : articles.filter(a => a.category === active)

  if (articles.length === 0) return null

  return (
    <section className="border-b border-ag-border bg-ag-off-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light">
            Publications associées
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray hover:text-ag-black transition-colors shrink-0"
          >
            Toutes nos publications <ArrowUpRight size={10} />
          </Link>
        </div>

        {/* Filter pills — style flowpartners : fond léger, pill actif sombre */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-8 p-1.5 bg-white border border-ag-border rounded-xl w-fit">
            <button
              onClick={() => setActive('all')}
              className={`font-mono text-[9px] tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                active === 'all'
                  ? 'bg-ag-navy text-white shadow-sm'
                  : 'text-ag-gray hover:text-ag-navy'
              }`}
            >
              Tout
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-mono text-[9px] tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                  active === cat
                    ? 'bg-ag-navy text-white shadow-sm'
                    : 'text-ag-gray hover:text-ag-navy'
                }`}
              >
                {getText(ARTICLE_CATEGORIES[cat] as unknown as Record<string, string | undefined>, lang)}
              </button>
            ))}
          </div>
        )}

        {/* Cards grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(article => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}` as never}
              className="group flex flex-col rounded-2xl overflow-hidden border border-ag-border bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Image compacte */}
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={BLOG_IMAGES[article.slug] ?? BLOG_IMAGE_FALLBACK}
                  alt={getText(article.title as unknown as Record<string, string | undefined>, lang)}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>

              {/* Contenu */}
              <div className="p-5 flex flex-col flex-1">
                <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-ag-apex mb-2">
                  {getText(ARTICLE_CATEGORIES[article.category] as unknown as Record<string, string | undefined>, lang)}
                </p>
                <h3 className="font-sans font-semibold text-ag-black text-[13px] leading-snug mb-2 group-hover:text-ag-navy transition-colors flex-1">
                  {getText(article.title as unknown as Record<string, string | undefined>, lang)}
                </h3>
                <p className="font-sans text-[12px] text-ag-gray leading-relaxed mb-4 line-clamp-2">
                  {getText(article.excerpt as unknown as Record<string, string | undefined>, lang)}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-ag-border">
                  <div className="flex items-center gap-3 text-ag-gray-light">
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Calendar size={10} /> {formatDate(article.date, locale)}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock size={10} /> {article.readMin} min
                    </span>
                  </div>
                  <ArrowUpRight size={13} className="text-ag-gray-light group-hover:text-ag-apex transition-colors shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
