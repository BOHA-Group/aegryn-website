'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/gsap'

export function ManifestoSection() {
  const tW = useTranslations('whatwedo')
  const tA = useTranslations('aboutSection')

  const whatwedoItems = tW.raw('items') as { num: string; title: string; desc: string }[]
  const stats         = tA.raw('stats') as { val: string; label: string }[]

  const whatRef    = useRef<HTMLElement>(null)
  const aboutRef   = useRef<HTMLElement>(null)
  const aboutH2Ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const aboutH2 = aboutH2Ref.current
    if (!aboutH2) return

    /* ── SplitText setup — aboutH2 words clip reveal ── */
    const splitAbout = new SplitText(aboutH2, {
      type: 'words',
      wordsClass: 'about-word-inner',
    })
    gsap.set(splitAbout.words, {
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      marginRight: '0.22em',
    })

    const ctx = gsap.context(() => {

      /* ── What we do: stagger clip-reveal per column ── */
      gsap.fromTo('.what-col',
        { opacity: 0, y: 30, clipPath: 'inset(0 0 100% 0)' },
        {
          opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
          stagger: 0.1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: whatRef.current, start: 'top 78%', once: true },
        },
      )

      /* ── About H2: words clip reveal scrub ── */
      gsap.fromTo(splitAbout.words,
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.07,
          ease: 'expo.out',
          duration: 0.9,
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 72%',
            once: true,
          },
        },
      )

      /* About desc + tagline + CTA: staggered fade-up */
      gsap.fromTo('.about-body > *',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: '.about-body', start: 'top 80%', once: true },
        },
      )

      /* About quote fade-up */
      gsap.fromTo('.about-quote',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: '.about-quote', start: 'top 82%', once: true },
        },
      )

      /* Stats count-up reveal */
      gsap.fromTo('.about-stat',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          stagger: 0.09, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: '.about-stats', start: 'top 85%', once: true },
        },
      )

    })

    return () => {
      splitAbout.revert()
      ctx.revert()
    }
  }, [])

  return (
    <>
      {/* ── What we do ─────────────────────────────────────── */}
      <section ref={whatRef} className="border-t border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between border-b border-ag-border py-4 mb-0">
            <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {tW('label')}
            </span>
            <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              01
            </span>
          </div>
          <div className="py-16 border-b border-ag-border text-center px-4">
            <p
              className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.3]"
              style={{ fontSize: 'clamp(18px,2.2vw,28px)' }}
            >
              {tW('conviction').split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br className="hidden md:block" />}
                  {i < arr.length - 1 && <span className="md:hidden"> </span>}
                </span>
              ))}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ag-border">
            {whatwedoItems.map((item) => (
              <div key={item.num} className="what-col py-16 lg:px-10 first:pl-0 last:pr-0" style={{ opacity: 0 }}>
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex-ink mb-6">
                  {item.num}
                </p>
                <h3
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.25] mb-5"
                  style={{ fontSize: 'clamp(15px,1.25vw,17px)' }}
                >
                  {item.title}
                </h3>
                <p className="font-sans font-normal text-[13px] text-ag-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About us ───────────────────────────────────────── */}
      <section ref={aboutRef} className="border-t border-ag-border bg-ag-off-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-ag-border">

            {/* Left col */}
            <div className="py-24 md:pr-16">
              <div className="flex items-center justify-between mb-10">
                <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
                  / {tA('label')}
                </p>
                <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
                  02
                </span>
              </div>
              <h2
                ref={aboutH2Ref}
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2] pb-[0.15em] mb-12 overflow-hidden"
                style={{ fontSize: 'clamp(34px,4.5vw,58px)' }}
                dangerouslySetInnerHTML={{ __html: tA('title').replace(/\n/g, '<br>') }}
              />
              <div className="about-body space-y-8">
                <p className="font-sans font-normal text-[15px] text-ag-gray leading-[1.85] max-w-lg">
                  {tA('desc')}
                </p>
                <div className="flex items-center gap-px">
                  <div className="w-8 h-px bg-ag-apex" />
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-apex-ink ml-3">
                    {tA('tagline')}
                  </p>
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-black border border-ag-border px-6 py-3.5 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300"
                >
                  {tA('cta')}
                  <span className="text-base leading-none">→</span>
                </Link>
              </div>
            </div>

            {/* Right col */}
            <div className="py-24 md:pl-16 flex flex-col justify-between gap-16">
              <blockquote className="about-quote relative" style={{ opacity: 0 }}>
                <p
                  className="font-sans font-normal italic text-ag-black tracking-[-0.01em] leading-[1.45] mb-8 relative z-10"
                  style={{ fontSize: 'clamp(18px,2vw,26px)' }}
                >
                  &ldquo;{tA('quote')}&rdquo;
                </p>
                <footer>
                  <p className="font-sans font-normal text-[11px] text-ag-gray-light">
                    {tA('ceoTitle')}
                  </p>
                </footer>
              </blockquote>

              <div className="about-stats grid grid-cols-1 sm:grid-cols-3 border-t border-ag-border pt-8 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="about-stat" style={{ opacity: 0 }}>
                    <p
                      className="font-sans font-bold text-ag-black tracking-[-0.03em] mb-1"
                      style={{ fontSize: 'clamp(28px,3vw,40px)' }}
                    >
                      {s.val}
                    </p>
                    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
