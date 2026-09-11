'use client'

import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/gsap'

/* ── Counter animation helper ─────────────────────────────── */
function animateCounter(el: HTMLElement, target: number, duration = 1.4) {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target, duration, ease: 'power2.out',
    onUpdate() {
      el.textContent = String(Math.round(obj.val))
    },
    onComplete() {
      el.textContent = String(target)
    },
  })
}

export function ManifestoSection() {
  const tW = useTranslations('whatwedo')
  const tA = useTranslations('aboutSection')

  const whatwedoItems = tW.raw('items') as { num: string; title: string; desc: string }[]
  const stats         = tA.raw('stats') as { val: string; label: string; sub?: string }[]

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

      /* ── Stats: fade-up chiffres + labels + counter ── */
      gsap.fromTo('[data-stat-num]',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.6, ease: 'expo.out',
          scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 85%',
            once: true,
            onEnter: () => {
              document.querySelectorAll<HTMLElement>('[data-counter]').forEach(el => {
                const raw    = el.getAttribute('data-counter') ?? '0'
                const suffix = raw.endsWith('+') ? '+' : raw.endsWith('%') ? '%' : ''
                const target = parseInt(raw.replace(/\D/g, ''), 10)
                animateCounter(el, target, 1.4)
                gsap.delayedCall(1.45, () => { el.textContent = target + suffix })
              })
            },
          },
        },
      )
      gsap.fromTo('[data-stat-label]',
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.5, ease: 'expo.out', delay: 0.15,
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
          <div className="py-16 border-b border-ag-border text-center px-4 max-w-3xl mx-auto">
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2] mb-5"
              style={{ fontSize: 'clamp(22px,2.8vw,38px)' }}
            >
              {tW('convictionTitle').split('. ').map((part, i, arr) => (
                <span key={i}>
                  {part}{i < arr.length - 1 ? '.' : ''}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p
              className="font-sans font-normal text-ag-gray leading-[1.75]"
              style={{ fontSize: 'clamp(14px,1.2vw,17px)' }}
            >
              {tW('convictionDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-ag-border">
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
                <p className="font-sans font-normal text-[13px] text-ag-gray leading-relaxed whitespace-pre-line">
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
                <div className="space-y-4 max-w-lg">
                  {tA('desc').split('\n\n').map((para, i) => (
                    <p key={i} className="font-sans font-normal text-[15px] text-ag-gray leading-[1.85]">
                      {para}
                    </p>
                  ))}
                </div>
                <div className="flex items-center gap-px">
                  <div className="w-8 h-px bg-ag-apex" />
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-apex-ink ml-3">
                    {tA('tagline')}
                  </p>
                </div>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={((tA.raw('ctaHref') as string | undefined) ?? '/about') as any}
                  className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-black border border-ag-border px-6 py-3.5 rounded-lg hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300 rounded-lg"
                >
                  {tA('cta')}
                  <span className="text-base leading-none">→</span>
                </Link>
              </div>
            </div>

            {/* Right col — 4 stats en grand avec compteur animé */}
            <div className="py-24 md:pl-16 flex flex-col justify-center">
              {/*
                Grille 2×2 avec subgrid sur les rangées :
                chaque paire de cellules (chiffre | label) partage la même hauteur
                → les légendes s'alignent horizontalement quelle que soit la hauteur du chiffre.
                grid-rows: [chiffre-ligne1] [label-ligne1] [chiffre-ligne2] [label-ligne2]
              */}
              <div
                className="about-stats grid grid-cols-2 gap-x-8"
                style={{ gridTemplateRows: 'auto auto auto auto', rowGap: '0' }}
              >
                {stats.map((s, i) => {
                  const isNumeric = /^\d/.test(s.val)
                  const hasPlus   = s.val.endsWith('+')
                  const hasPct    = s.val.endsWith('%')
                  const rawNum    = parseInt(s.val.replace(/\D/g, ''), 10)
                  const suffix    = hasPlus ? '+' : hasPct ? '%' : ''

                  /* rangée chiffre : 0→row1, 1→row1, 2→row3, 3→row3 */
                  const numRow   = i < 2 ? 1 : 3
                  /* rangée label : 0→row2, 1→row2, 2→row4, 3→row4 */
                  const labelRow = i < 2 ? 2 : 4
                  const col      = (i % 2) + 1

                  return (
                    <div
                      key={s.label}
                      className="about-stat contents"
                      style={{ opacity: 1 }}
                    >
                      {/* Cellule chiffre */}
                      <p
                        className="font-sans font-bold text-ag-black tracking-[-0.04em] leading-none pt-10 pb-4"
                        style={{
                          fontSize: 'clamp(48px,6vw,80px)',
                          gridRow: numRow,
                          gridColumn: col,
                          opacity: 0,
                        }}
                        data-stat-num
                      >
                        {isNumeric ? (
                          <span data-counter={rawNum + suffix}>{s.val}</span>
                        ) : (
                          s.val
                        )}
                      </p>
                      {/* Cellule label — alignée sur la même rangée que l'autre colonne */}
                      <div
                        className="pb-10"
                        style={{
                          gridRow: labelRow,
                          gridColumn: col,
                          opacity: 0,
                        }}
                        data-stat-label
                      >
                        <p className="font-sans font-semibold text-[12px] uppercase tracking-[0.22em] text-ag-black mb-1.5">
                          {s.label}
                        </p>
                        {s.sub && (
                          <p className="font-sans font-normal text-[12px] text-ag-gray-light leading-snug">
                            {s.sub}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

    </>
  )
}
