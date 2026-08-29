'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { IssueMiniCard } from '@/components/magazine/IssueMiniCard'
import { ISSUE_01 } from '@/content/magazine/issue-01/meta'
import { ISSUE_02 } from '@/content/magazine/issue-02/meta'
import { ISSUE_03 } from '@/content/magazine/issue-03/meta'
import { ISSUE_04 } from '@/content/magazine/issue-04/meta'

/*
 * Disposition style Barnes en px absolus dans la col droite (largeur ~60% de l'écran)
 * Chaque IssueMiniCard = 232.5×330px natif
 */
const COVER_LAYOUT = [
  { issue: ISSUE_02, rot: '-12deg', left:  20, top: -30, z: 2 },
  { issue: ISSUE_01, rot:   '8deg', left: 190, top: -50, z: 1 },
  { issue: ISSUE_03, rot:  '-4deg', left:  80, top: 200, z: 4 },
  { issue: ISSUE_04, rot:  '10deg', left: 280, top: 160, z: 3 },
]

interface Props {
  magLabel:    string
  magTitle:    string
  magDesc:     string
  magCta:      string
  articlesLabel: string
  articlesCta:   string
}

export function DiscoverStrip({ magLabel, magTitle, magDesc, magCta, articlesLabel, articlesCta }: Props) {
  const t      = useTranslations('discoverStrip')
  const ref    = useRef<HTMLElement>(null)
  const magRef = useRef<HTMLDivElement>(null)

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

  const articles = [
    { title: t('article1Title'), cat: t('article1Cat'), href: '/blog/marche-ma-tech-europe-q3-2026' },
    { title: t('article2Title'), cat: t('article2Cat'), href: '/blog/5-erreurs-valorisation-saas'   },
    { title: t('article3Title'), cat: t('article3Cat'), href: '/blog/actif-tech-certifiable'        },
  ]

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border">

      {/* ── Bloc 1 : Teaser Magazine — style Barnes ── */}
      <div
        ref={magRef}
        className="overflow-hidden border-b border-ag-border"
        style={{ background: '#F5F2EE' }}
      >
        {/* Grid 2 colonnes : texte gauche | covers droite */}
        <div className="grid md:grid-cols-[45%_55%]" style={{ minHeight: 520 }}>

          {/* Col gauche — texte isolé sur fond blanc card */}
          <div className="flex items-center px-6 md:px-[80px] py-20">
            <div
              className="bg-white py-10 px-10 space-y-5"
              style={{ maxWidth: 380, boxShadow: '0 2px 24px rgba(0,0,0,.06)' }}
            >
              <p className="font-mono text-[9px] tracking-[0.30em] uppercase text-ag-gray-light">
                {magLabel}
              </p>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1]"
                style={{ fontSize: 'clamp(22px,2.4vw,36px)' }}
              >
                {magTitle}
              </h2>
              <p className="font-sans text-[13px] text-ag-gray leading-[1.75]">
                {magDesc}
              </p>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-black border border-ag-black px-5 py-2.5 hover:bg-ag-black hover:text-white transition-all duration-300"
              >
                {magCta} <ArrowUpRight size={11} />
              </Link>
            </div>
          </div>

          {/* Col droite — covers en diagonale */}
          <div className="hidden md:block relative overflow-hidden pointer-events-none">
            {COVER_LAYOUT.map(({ issue, rot, left, top, z }, i) => (
              <div
                key={i}
                className="mag-cover-card absolute"
                style={{
                  transform: `rotate(${rot})`,
                  transformOrigin: 'center center',
                  zIndex: z,
                  left,
                  top,
                }}
              >
                <IssueMiniCard
                  issue={issue}
                  locale="en"
                  isPublic={false}
                  isPreview={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bloc 2 : Articles ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24">

        <div className="flex items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex flex items-center gap-3">
              <span className="w-5 h-px bg-ag-apex/50 inline-block" />
              {articlesLabel}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15] whitespace-pre-line"
              style={{ fontSize: 'clamp(24px,3vw,42px)' }}
            >
              {t('title')}
            </h2>
          </div>
          <Link
            href="/blog"
            className="shrink-0 hidden md:inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-5 py-3 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300"
          >
            {articlesCta} <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border">
          {articles.map((a, i) => (
            <Link
              key={i}
              href={a.href as never}
              className="discover-strip-card group bg-ag-white p-8 flex flex-col gap-5 hover:bg-ag-off-white transition-colors"
              style={{ opacity: 0 }}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex">
                {a.cat}
              </span>
              <p
                className="font-sans font-semibold text-ag-black leading-[1.4] group-hover:text-ag-navy transition-colors"
                style={{ fontSize: 'clamp(14px,1.2vw,16px)' }}
              >
                {a.title}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] tracking-[0.12em] uppercase text-ag-gray group-hover:text-ag-black transition-colors">
                {t('readMore')} <ArrowUpRight size={11} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-5 py-3 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300"
          >
            {articlesCta} <ArrowUpRight size={12} />
          </Link>
        </div>

      </div>
    </section>
  )
}
