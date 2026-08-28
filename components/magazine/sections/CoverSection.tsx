'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowDown, BookOpen, Globe } from 'lucide-react'
import type { MagazineIssue, IssueStat } from '@/lib/magazine/types'
import { useCoverReveal } from '../hooks/useCoverReveal'

interface Props {
  issue:     MagazineIssue
  _stats?:   IssueStat[]
  ctaScroll: string
}

/**
 * Cover section — style Salford / magazine print cover.
 * Dark background, AEGRYN massive, accent tagline, theme text.
 */
export function CoverSection({ issue, ctaScroll, locale = 'fr' }: Props & { locale?: string }) {
  const ref      = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useCoverReveal(ref, titleRef)

  const date      = new Date(issue.publishedAt)
  const formatted = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase()
  const issueNum  = `ISSUE ${String(issue.number).padStart(2, '0')}`

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-between px-8 md:px-14 py-10 overflow-hidden lg:pl-[calc(240px+3.5rem)]"
    >
      {/* Background image — Geneva Jet d'eau */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/magazine/issue-01/cover-magazine-issue-01.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />
      {/* QR code scannable — reporté depuis la cover flipbook, coin bas-droit */}
      <div className="hidden sm:block absolute bottom-8 right-8 md:right-14 z-20 bg-white p-1.5 rounded-sm shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=88x88&data=https%3A%2F%2Faegryn.com%2Fmagazine&color=0F1A2B&bgcolor=ffffff&qzone=0&format=png"
          width={88}
          height={88}
          alt="aegryn.com/magazine"
          style={{ display: 'block', imageRendering: 'pixelated' }}
        />
      </div>

      {/* ── TOP BAR : date gauche / Special Edition droite ── */}
      <div className="cover-meta relative z-10 flex items-start justify-between">
        <p className="font-sans tracking-[0.22em] uppercase text-white font-medium" style={{ fontSize: '9px' }}>
          {formatted}
        </p>
        <div className="text-right">
          <p className="font-sans tracking-[0.18em] uppercase text-white font-bold" style={{ fontSize: '9px' }}>Special Edition</p>
          <p className="font-sans tracking-[0.18em] uppercase text-white font-bold" style={{ fontSize: '9px' }}>{issueNum}</p>
        </div>
      </div>

      {/* ── AEGRYN massif + BUSINESS MAGAZINE — copie exacte cover flipbook ── */}
      <div className="relative z-10" style={{ marginTop: -8 }}>
        <h1
          ref={titleRef}
          className="font-sans font-bold text-white"
          style={{ fontSize: 'clamp(90px,14vw,190px)', fontWeight: 700, lineHeight: 0.86, letterSpacing: '-0.04em' }}
        >
          Aegryn
        </h1>
        <p className="cover-meta" style={{ textAlign: 'right', fontSize: 8, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', marginTop: 5 }}>
          Business Magazine
        </p>
      </div>

      {/* ── EXCLUSIVE — milieu gauche ── */}
      <div className="cover-meta relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-[220px]">
          <p className="font-sans font-bold text-white uppercase tracking-[0.08em] mb-2" style={{ fontSize: '13px' }}>
            Exclusive
          </p>
          <div className="w-10 h-[2px] bg-white mb-3" />
          <p className="font-sans font-bold text-white uppercase leading-snug" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
            Build. Certify. Transact.
          </p>
        </div>
      </div>

      {/* ── BAS : titre accent + theme centré + scroll — contenu identique cover flipbook ── */}
      <div className="cover-meta relative z-10">
        <p
          className="font-sans font-bold text-white uppercase leading-none mb-1"
          style={{ fontSize: 'clamp(22px,4vw,46px)', letterSpacing: '-0.01em', lineHeight: 1.0 }}
        >
          Built
        </p>
        <p
          className="font-sans font-bold text-white uppercase leading-none mb-4"
          style={{ fontSize: 'clamp(22px,4vw,46px)', letterSpacing: '-0.01em', lineHeight: 1.0 }}
        >
          to Last.
        </p>
        <p
          className="font-sans uppercase text-white leading-snug mb-8"
          style={{ fontSize: '10px', letterSpacing: '0.07em' }}
        >
          The anatomy of a tech asset that sells and one that doesn&apos;t.
        </p>

        {/* ── Deux CTAs style Barnes ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Feuilleter le flipbook → scroll vers #s-flipbook */}
          <button
            onClick={() => document.getElementById('s-flipbook')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] uppercase
                       bg-[#5ADDA4] text-[#0F1A2B] px-4 py-2.5 font-bold
                       hover:bg-white hover:text-[#0F1A2B] transition-colors"
          >
            <BookOpen size={11} /> Feuilleter le flipbook
          </button>

          {/* Explorer en ligne → page dédiée */}
          <Link
            href={`/${locale}/magazine/issue-01/web`}
            className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] uppercase
                       border border-white/30 text-white/70 px-4 py-2.5
                       hover:border-white/70 hover:text-white transition-colors"
          >
            <Globe size={11} /> Explorer en ligne
          </Link>
        </div>

        <button
          onClick={() => {
            const firstSection = issue.sections[0]
            if (firstSection) document.getElementById(firstSection.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase text-white/25 hover:text-white/60 transition-colors"
          aria-label={ctaScroll}
        >
          {ctaScroll} <ArrowDown size={11} />
        </button>
      </div>
    </section>
  )
}
