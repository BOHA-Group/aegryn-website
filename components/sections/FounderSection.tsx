'use client'

import { useEffect, useRef } from 'react'
import Image                  from 'next/image'
import Link                   from 'next/link'
import { ArrowUpRight }       from 'lucide-react'
import { useTranslations }    from 'next-intl'
import { gsap }               from '@/lib/gsap'

/**
 * Section "Le Fondateur" — style Rolex.com.
 * Photo plein-section. Au scroll:
 *   - overlay noir opacity 0 → 0.72
 *   - backdrop blur 0px → 6px (via class toggle + CSS var scrubbed)
 *   - texte superposé fade-up + clip reveal
 */
export function FounderSection() {
  const t           = useTranslations('about')
  const sectionRef  = useRef<HTMLElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const blurRef     = useRef<HTMLDivElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)
  const nameRef     = useRef<HTMLHeadingElement>(null)
  const titleRef    = useRef<HTMLParagraphElement>(null)
  const bio1Ref     = useRef<HTMLParagraphElement>(null)
  const bio2Ref     = useRef<HTMLParagraphElement>(null)
  const ctasRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   'top 60%',
          end:     '+=120%',
          scrub:   1.4,
        },
      })

      /* Phase 1 (0→30%) — overlay noir + blur progressif */
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 0.72, ease: 'none', duration: 0.30 },
        0,
      )
      tl.fromTo(blurRef.current,
        { backdropFilter: 'blur(0px)' },
        { backdropFilter: 'blur(8px)', ease: 'none', duration: 0.30 },
        0,
      )

      /* Phase 2 (30→80%) — texte apparaît progressivement */
      tl.fromTo(nameRef.current,
        { yPercent: 20, opacity: 0 },
        { yPercent: 0,  opacity: 1, ease: 'expo.out', duration: 0.16 },
        0.30,
      )
      tl.fromTo(titleRef.current,
        { yPercent: 16, opacity: 0 },
        { yPercent: 0,  opacity: 1, ease: 'expo.out', duration: 0.14 },
        0.38,
      )
      tl.fromTo(bio1Ref.current,
        { yPercent: 14, opacity: 0 },
        { yPercent: 0,  opacity: 1, ease: 'expo.out', duration: 0.14 },
        0.46,
      )
      tl.fromTo(bio2Ref.current,
        { yPercent: 14, opacity: 0 },
        { yPercent: 0,  opacity: 1, ease: 'expo.out', duration: 0.14 },
        0.54,
      )
      tl.fromTo(ctasRef.current,
        { yPercent: 10, opacity: 0 },
        { yPercent: 0,  opacity: 1, ease: 'expo.out', duration: 0.12 },
        0.62,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-ag-border overflow-hidden"
      style={{ minHeight: '90vh' }}
    >
      {/* Label section */}
      <div className="absolute top-10 left-6 md:left-12 z-20">
        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-white/60">
          / {t('founder.label')}
        </p>
      </div>

      {/* Photo plein fond */}
      <div className="absolute inset-0">
        <Image
          src="/images/profil CEO 169.png"
          alt="Yohann Bollack — Founder & CEO, Aegryn"
          fill
          priority
          quality={95}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Overlay noir progressif (scrub GSAP) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black"
        style={{ opacity: 0 }}
      />

      {/* Couche blur (scrub GSAP) */}
      <div
        ref={blurRef}
        className="absolute inset-0"
        style={{ backdropFilter: 'blur(0px)' }}
      />

      {/* Texte superposé — centré bas-gauche */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col justify-end min-h-[90vh] pb-16 px-6 md:px-16 max-w-4xl"
      >
        {/* Ligne décorative */}
        <div className="w-12 h-px bg-ag-apex mb-8" />

        <h2
          ref={nameRef}
          className="font-sans font-bold text-white tracking-[-0.03em] leading-none mb-3"
          style={{ fontSize: 'clamp(40px,5vw,72px)', opacity: 0 }}
        >
          Yohann Bollack
        </h2>

        <p
          ref={titleRef}
          className="font-sans font-semibold text-ag-apex uppercase tracking-[0.22em] text-[11px] mb-10"
          style={{ opacity: 0 }}
        >
          Founder &amp; CEO — Aegryn
        </p>

        <div className="space-y-5 max-w-xl mb-10">
          <p
            ref={bio1Ref}
            className="font-sans font-normal text-[15px] text-white/90 leading-[1.8]"
            style={{ opacity: 0 }}
          >
            {t('founder.bio1')}
          </p>
          <p
            ref={bio2Ref}
            className="font-sans font-normal text-[15px] text-white/80 leading-[1.8]"
            style={{ opacity: 0 }}
          >
            {t('founder.bio2')}
          </p>
        </div>

        <div
          ref={ctasRef}
          className="flex flex-wrap gap-4"
          style={{ opacity: 0 }}
        >
          <a
            href="https://www.linkedin.com/in/yohann-bollack-2a2922"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/40 px-5 py-2.5 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-white hover:border-white hover:bg-white hover:text-ag-navy transition-all duration-300"
          >
            LinkedIn <ArrowUpRight size={12} />
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-ag-apex/50 px-5 py-2.5 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-apex hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all duration-300"
          >
            {t('founder.cta')} <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}
