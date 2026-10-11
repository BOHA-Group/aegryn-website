'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'

const IMG = '/images/transact/hero-valorisation.webp'

type Props = {
  eyebrow:  string
  title:    string
  sub:      string
  ctaLabel: string
  ctaHref:  string
}

/**
 * Intro FRANCHIR — même mécanique que AboutHeroScroll :
 * la photo montagne part d'un cadre arrondi dans la colonne droite
 * et s'étend en plein écran au scroll (clip-path + zoom interne, scrub).
 * prefers-reduced-motion : rendu statique (grille texte + image).
 */
export function FranchirHeroScroll({ eyebrow, title, sub, ctaLabel, ctaHref }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const textRef  = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  /* On ne monte la version scrub que si le mouvement est autorisé —
     le rendu SSR/no-JS/reduced-motion garde la grille statique. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setAnimated(true)
  }, [])

  useEffect(() => {
    if (!animated) return
    if (!wrapRef.current || !mediaRef.current || !imgRef.current || !textRef.current) return

    const ctx = gsap.context(() => {
      const st = {
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }

      /* Cadre dans la colonne droite (rounded-2xl ~16px) → plein écran */
      const mm = gsap.matchMedia()
      mm.add({
        isDesktop: '(min-width: 1024px)',
        isMobile:  '(max-width: 1023px)',
      }, (mq) => {
        const start = mq.conditions?.isDesktop
          ? 'inset(20% 6% 20% 55% round 16px)'
          : 'inset(72% 5% 6% 5% round 16px)'
        gsap.fromTo(mediaRef.current,
          { clipPath: start },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: st },
        )
      })

      /* Zoom interne de la photo pendant l'expansion */
      gsap.fromTo(imgRef.current,
        { scale: 1.18 },
        { scale: 1, ease: 'none', scrollTrigger: st },
      )

      /* Le texte s'estompe quand la photo recouvre le haut */
      gsap.to(textRef.current, {
        opacity: 0, y: -40, ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: '20% top',
          end: '55% bottom',
          scrub: true,
        },
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [animated])

  const heading = (
    <>
      <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex-ink mb-6 flex items-center gap-3">
        <span className="w-6 h-px bg-ag-apex/50 inline-block" />
        {eyebrow}
      </p>
      <h2
        className="font-sans font-bold text-ag-black leading-[1.05] tracking-[-0.03em] mb-6"
        style={{ fontSize: 'clamp(26px,3vw,44px)' }}
      >
        {title}
      </h2>
      <p className="font-sans text-[15px] text-ag-gray max-w-xl mb-10 leading-relaxed">
        {sub}
      </p>
      <Link
        href={ctaHref}
        className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-navy-mid transition-colors"
      >
        {ctaLabel} <ArrowUpRight size={13} />
      </Link>
    </>
  )

  if (!animated) {
    return (
      <div className="bg-ag-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>{heading}</div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-ag-border">
            <Image
              src={IMG}
              alt="Aegryn Group"
              fill
              unoptimized
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="relative h-[240vh] bg-ag-white">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center max-lg:items-start">
        <div ref={textRef} className="relative z-10 max-w-7xl mx-auto px-6 w-full max-lg:pt-28">
          <div className="max-w-[52%] max-lg:max-w-full">
            {heading}
          </div>
        </div>
        <div ref={mediaRef} className="absolute inset-0 z-20 will-change-[clip-path]">
          <div ref={imgRef} className="absolute inset-0 will-change-transform">
            <Image
              src={IMG}
              alt="Aegryn Group"
              fill
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
