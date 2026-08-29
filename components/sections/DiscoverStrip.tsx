'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import Image from 'next/image'

/*
 * 4 covers JPG — positionnées en 2 rangées côte à côte, diagonale montante
 * vers le coin haut-droit, fidèle au modèle Barnes.
 * Chaque cover = 200×283px (ratio A4 1:1.414).
 *
 * Rangée basse : issue-01 (gauche) + issue-03 (droite)
 * Rangée haute : issue-02 (gauche) + issue-04 (droite, partiellement coupée)
 *
 * La diagonale est obtenue par un décalage progressif left↑ top↓ de gauche à droite.
 */
const CW = 200
const CH = Math.round(CW * 1.414)

const COVERS = [
  { src: '/magazine/issue-01/cover-magazine-issue-01.jpg', rot: '-6deg', left: 40,  top: 280, z: 1 },
  { src: '/magazine/issue-02/cover-magazine-issue-02.jpg', rot: '-3deg', left: 260, top: 180, z: 2 },
  { src: '/magazine/issue-03/cover-magazine-issue-03.jpg', rot:  '4deg', left: 460, top:  80, z: 3 },
  { src: '/magazine/issue-04/cover-magazine-issue-04.jpg', rot:  '7deg', left: 640, top: -20, z: 4 },
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
    <section ref={ref} className="bg-ag-white border-t border-ag-border mt-20">

      {/* ── Bloc 1 : Teaser Magazine — fidèle au modèle Barnes ── */}
      <div
        ref={magRef}
        className="relative overflow-hidden border-b border-ag-border"
        style={{ background: '#F5F2EE', height: 560 }}
      >
        {/* Card texte — centrée gauche-centre, fond blanc, z-index au-dessus des covers */}
        <div
          className="absolute z-10 bg-white py-10 px-12 space-y-5"
          style={{
            left: '8%',
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: 380,
          }}
        >
          <p className="font-mono text-[9px] tracking-[0.30em] uppercase text-ag-gray-light">
            {magLabel}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1]"
            style={{ fontSize: 'clamp(22px, 2.4vw, 36px)' }}
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

        {/* Covers — 4 images en diagonale montante bas-gauche → haut-droit */}
        {COVERS.map(({ src, rot, left, top, z }, i) => (
          <div
            key={i}
            className="mag-cover-card absolute pointer-events-none"
            style={{
              width: CW,
              height: CH,
              left,
              top,
              transform: `rotate(${rot})`,
              zIndex: z,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,.18)',
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={`${CW}px`}
              className="object-cover"
            />
          </div>
        ))}
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
