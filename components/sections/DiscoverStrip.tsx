'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { ArticleCard } from '@/components/sections/ArticleCard'
import { ArticleStrip } from '@/components/sections/ArticleStrip'
import { AllArticlesButton } from '@/components/sections/AllArticlesButton'
import { IssueMiniCard } from '@/components/magazine/IssueMiniCard'
import { ISSUE_01 } from '@/content/magazine/issue-01/meta'
import { ISSUE_02 } from '@/content/magazine/issue-02/meta'
import { ISSUE_03 } from '@/content/magazine/issue-03/meta'
import { ISSUE_04 } from '@/content/magazine/issue-04/meta'
import { ARTICLES, ARTICLE_CATEGORIES } from '@/data/articles'

import { BLOG_IMAGES, BLOG_IMAGE_FALLBACK, getBlogImagePosition } from '@/data/blogImages'

/*
 * Disposition fidèle Barnes :
 * - Card texte à gauche (~35%), fond blanc, centrée verticalement
 * - Zone covers à droite (~65%), overflow hidden
 * - 4 covers en 2 rangées diagonale montante vers haut-droit
 *   Rangée basse : issue-01 (gauche) + issue-02 (droite)  — plus bas
 *   Rangée haute : issue-03 (gauche) + issue-04 (droite)  — plus haut
 * - Covers = IssueMiniCard identiques à la page magazine (overlays texte inclus)
 * - Pas de badge "À venir" (isPublic/isPreview ne sont pas utilisés pour le rendu décoratif)
 */
/* Covers classées par date de parution, issue-01 en premier à gauche */
const COVER_LAYOUT: { issue: typeof ISSUE_01; rot: string; left: string; top?: string; bottom?: string; z: number }[] = [
  { issue: ISSUE_01, rot: '-5deg', left: '3.5%', bottom: '42px', z: 1 },
  { issue: ISSUE_02, rot:  '3deg', left: '20%',  top: '170px',   z: 2 },
  { issue: ISSUE_03, rot: '-3deg', left: '46%',  top: '55px',    z: 3 },
  { issue: ISSUE_04, rot:  '6deg', left: '66%',  top: '250px',   z: 4 },
]

interface Props {
  magLabel:      string
  magTitle:      string
  magDesc:       string
  magFooter:     string
  magCta:        string
  articlesLabel: string
  articlesCta:   string
}

export function DiscoverStrip({ magLabel, magTitle, magDesc, magFooter, magCta, articlesLabel, articlesCta }: Props) {
  const t      = useTranslations('discoverStrip')
  const locale = useLocale()
  const ref    = useRef<HTMLElement>(null)
  const magRef = useRef<HTMLDivElement>(null)

  const VALID_LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
  type ValidLocale = typeof VALID_LOCALES[number]
  const lang: ValidLocale = (VALID_LOCALES as readonly string[]).includes(locale)
    ? locale as ValidLocale
    : 'en'

  const getImage = (slug: string) => BLOG_IMAGES[slug] ?? BLOG_IMAGE_FALLBACK
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Apparition articles */
      gsap.fromTo('.discover-strip-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
        },
      )
      /* Apparition covers magazine */
      gsap.fromTo('.mag-cover-card',
        { opacity: 0, y: 32, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.08, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: magRef.current, start: 'top 80%', once: true },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  /* Articles à la une — carrousel horizontal, image + texte, pas de spotlight */
  const featuredArticles = ARTICLES.filter(a => a.featured)

  return (
    <section ref={ref} id="informer" className="bg-ag-white border-t border-ag-border mt-20 scroll-mt-20">

      {/* ── Bloc 1 : Teaser Magazine — fidèle au modèle Barnes ── */}
      <div
        ref={magRef}
        className="relative overflow-hidden border-b border-ag-border flex flex-col md:justify-center"
        style={{ background: '#F5F2EE', minHeight: 560 }}
      >
        {/* Card texte — dans le flux : le bloc grandit avec le contenu,
            plus de rognage desktop ni mobile */}
        <div
          className="relative z-10 bg-white space-y-4
            mx-4 mt-6 mb-2
            md:mx-0 md:ml-[12%] md:my-4"
          style={{ maxWidth: 380, padding: '36px 40px' }}
        >
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1]"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {magLabel}
          </h2>
          <p
            className="font-sans font-semibold italic text-ag-black leading-[1.3]"
            style={{ fontSize: 'clamp(13px, 1.1vw, 16px)' }}
          >
            {magTitle}
          </p>
          <div className="font-sans text-[15px] text-ag-gray leading-[1.75] space-y-2">
            {magDesc.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <p className="font-sans font-semibold text-[12px] text-ag-black">
            {magFooter}
          </p>
          <div className="pt-2">
            <Link
              href="/magazine"
              className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-black border border-ag-black px-5 py-2.5 hover:bg-ag-black hover:text-white transition-all duration-300"
            >
              {magCta} <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>

        {/* Zone covers — desktop : diagonale montante haut-droit */}
        <div
          className="hidden lg:block absolute top-0 bottom-0 overflow-hidden pointer-events-none"
          style={{ left: '38%', right: 0 }}
        >
          {COVER_LAYOUT.map(({ issue, rot, left, top, bottom, z }, i) => (
            <div
              key={i}
              className="mag-cover-card absolute"
              style={{
                transform: `rotate(${rot}) scale(0.72)`,
                transformOrigin: 'center center',
                zIndex: z,
                left,
                top,
                bottom,
              }}
            >
              <IssueMiniCard
                issue={issue}
                locale="en"
                decorative
              />
            </div>
          ))}
        </div>

        {/* Zone covers — mobile : scroll horizontal sous la card texte, dans le flux */}
        <div className="lg:hidden flex gap-3 overflow-x-auto px-6 pb-6 pt-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {COVER_LAYOUT.map(({ issue }, i) => (
            <div key={i} className="mag-cover-card shrink-0 scale-75 origin-bottom-left">
              <IssueMiniCard issue={issue} locale="en" decorative />
            </div>
          ))}
        </div>
      </div>

      {/* ── Bloc 2 : Articles ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">

        <div className="flex items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex-ink flex items-center gap-3">
              <span className="w-5 h-px bg-ag-apex/50 inline-block" />
              {articlesLabel}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15] whitespace-pre-line"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('title')}
            </h2>
          </div>
          <AllArticlesButton label={articlesCta} className="shrink-0 hidden md:inline-flex" />
        </div>

        <ArticleStrip>
          {featuredArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              slug={article.slug}
              title={article.title[lang] ?? article.title.en}
              category={ARTICLE_CATEGORIES[article.category][lang] ?? ARTICLE_CATEGORIES[article.category].en}
              date={formatDate(article.date)}
              image={getImage(article.slug)}
              imagePosition={getBlogImagePosition(getImage(article.slug))}
              readMore={t('readMore')}
              className="discover-strip-card"
              style={{ opacity: 0 }}
            />
          ))}
        </ArticleStrip>

        <div className="mt-8 md:hidden">
          <AllArticlesButton label={articlesCta} />
        </div>

      </div>
    </section>
  )
}
