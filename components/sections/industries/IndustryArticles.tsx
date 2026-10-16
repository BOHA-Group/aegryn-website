'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from '@/data/articles'
import { BLOG_IMAGES, BLOG_IMAGE_FALLBACK, getBlogImagePosition } from '@/data/blogImages'
import { FilterPills } from '@/components/ui/FilterPills'
import { ArticleCard } from '@/components/sections/ArticleCard'

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

        {/* Filter pills */}
        {categories.length > 1 && (
          <FilterPills
            options={[
              { key: 'all' as ArticleCategory | 'all', label: 'Tout' },
              ...categories.map(cat => ({
                key: cat as ArticleCategory | 'all',
                label: getText(ARTICLE_CATEGORIES[cat] as unknown as Record<string, string | undefined>, lang),
              })),
            ]}
            active={active}
            onChange={setActive}
            className="mb-8"
          />
        )}

        {/* Cards grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {filtered.map(article => (
            <ArticleCard
              key={article.slug}
              slug={article.slug}
              title={getText(article.title as unknown as Record<string, string | undefined>, lang)}
              category={getText(ARTICLE_CATEGORIES[article.category] as unknown as Record<string, string | undefined>, lang)}
              date={formatDate(article.date, locale)}
              excerpt={getText(article.excerpt as unknown as Record<string, string | undefined>, lang)}
              image={BLOG_IMAGES[article.slug] ?? BLOG_IMAGE_FALLBACK}
              imagePosition={getBlogImagePosition(BLOG_IMAGES[article.slug] ?? BLOG_IMAGE_FALLBACK)}
              fluid
            />
          ))}
        </div>

      </div>
    </section>
  )
}
