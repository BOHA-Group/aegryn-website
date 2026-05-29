'use client'

import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { gsap, SplitText } from '@/lib/gsap'

type Props = {
  label: string
  title: string
  cta: string
  href: string
}

export function StatementStrip({ label, title, cta, href }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const titleEl = titleRef.current
    if (!titleEl) return

    const split = new SplitText(titleEl, { type: 'words' })
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
      tl.from(labelRef.current, { opacity: 0, y: 10, duration: 0.5, ease: 'expo.out' })
        .from(split.words, {
          opacity: 0, y: 24, stagger: 0.06, duration: 0.7, ease: 'expo.out',
        }, '-=0.2')
        .from(ctaRef.current, { opacity: 0, y: 10, duration: 0.5, ease: 'expo.out' }, '-=0.3')
    }, sectionRef)

    return () => { ctx.revert(); split.revert() }
  }, [title])

  return (
    <section
      ref={sectionRef}
      className="relative bg-ag-navy py-32 px-6 md:px-12 border-t border-ag-navy overflow-hidden"
    >
      {/* Radial gradient depth — submarine effect */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(90,221,164,0.06) 0%, transparent 65%), ' +
            'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(10,29,46,0.8) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <p
          ref={labelRef}
          className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-6"
        >
          {label}
        </p>
        <h2
          ref={titleRef}
          className="font-sans font-bold text-white tracking-[-0.03em] leading-[0.95] max-w-2xl mb-12"
          style={{ fontSize: 'clamp(32px,4vw,60px)' }}
        >
          {title}
        </h2>
        <Link
          ref={ctaRef}
          href={href}
          className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-black transition-all duration-300"
        >
          {cta}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  )
}
