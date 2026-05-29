'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'

const WHAT_WE_DO = [
  {
    num: '01',
    title: 'ECOSYSTEM ENGINEERING',
    desc: 'We architect digital ecosystems built for scale, resilience and long-term value — where every component connects and compounds.',
  },
  {
    num: '02',
    title: 'EXPERIENCE ARCHITECTURE',
    desc: 'We design seamless user experiences that simplify complexity and create intuitive interactions across all our platforms.',
  },
  {
    num: '03',
    title: 'TECHNOLOGY FOUNDATIONS',
    desc: 'We build on solid, sovereign technology infrastructure — ensuring security, independence and durability at every layer.',
  },
  {
    num: '04',
    title: 'STRATEGIC ADVISORY',
    desc: 'Our advisory draws on real execution frameworks in Data, AI & Security — grounded in how we build our own ecosystems.',
  },
]

const MISSION_PILLARS = [
  {
    title: 'WE CREATE',
    desc: 'Design and develop solutions that anticipate your needs as individuals or professionals, ensuring seamless digital interactions that enhance everyday life.',
  },
  {
    title: 'WE SIMPLIFY',
    desc: 'Eliminate complexity by integrating smart automation, intuitive interfaces, and interconnected systems, making technology effortless and efficient.',
  },
  {
    title: 'WE EMBRACE',
    desc: 'We stay ahead by pioneering innovations, embracing cutting-edge advancements, and setting new standards and offers in seamless digital experiences.',
  },
]

export function ManifestoSection() {
  const whatRef  = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const missionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.what-col', {
        opacity: 0, y: 24, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: whatRef.current, start: 'top 78%' },
      })
      gsap.from('.mission-col', {
        opacity: 0, y: 24, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: missionRef.current, start: 'top 78%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ── What we do ─────────────────────────────────────── */}
      <section ref={whatRef} className="border-t border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between border-b border-ag-border py-4 mb-0">
            <Link
              href="/advisory"
              className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light hover:text-ag-black transition-colors"
            >
              / What we do
            </Link>
            <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              04
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-ag-border">
            {WHAT_WE_DO.map((item) => (
              <div key={item.num} className="what-col py-14 lg:px-8 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex mb-6">
                  {item.num}
                </p>
                <h3
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-[1.1] mb-4"
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
      <section ref={aboutRef} className="border-t border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-ag-border">
            <div className="py-20 md:pr-16">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-10">
                / About Aegryn
              </p>
              <h2
                className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.93] mb-10"
                style={{ fontSize: 'clamp(34px,4.5vw,58px)' }}
              >
                Swiss Technology<br />Asset Platform.
              </h2>
              <p className="font-sans font-normal text-[15px] text-ag-gray leading-[1.85] mb-10 max-w-lg">
                Nous concevons, finançons et exploitons des écosystèmes numériques
                qui progressent des idées ambitieuses vers des technologies réelles
                et pérennes. Pas des features — des actifs.
              </p>
              <div className="flex items-center gap-px">
                <div className="w-8 h-px bg-ag-apex" />
                <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-apex ml-3">
                  Engineered in Switzerland. Built to last.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-black border border-ag-border px-6 py-3.5 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300"
                >
                  À propos d&apos;Aegryn
                  <span className="text-base leading-none">→</span>
                </Link>
              </div>
            </div>
            <div className="py-20 md:pl-16 flex flex-col justify-between gap-16">
              <blockquote className="relative">
                <span
                  className="font-display font-black text-ag-black/5 absolute -top-4 -left-2 select-none"
                  style={{ fontSize: '120px', lineHeight: 1 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-[1.2] mb-8 relative z-10"
                  style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}
                >
                  Nous construisons des actifs numériques qui améliorent
                  la vie quotidienne — pour les individus, les professionnels
                  et les marchés qu&apos;ils servent.
                </p>
                <footer>
                  <p className="font-sans font-semibold text-[11px] tracking-[0.2em] uppercase text-ag-black">
                    Yohann Bollack
                  </p>
                  <p className="font-sans font-normal text-[11px] text-ag-gray-light mt-0.5">
                    Founder & CEO — Aegryn Group
                  </p>
                </footer>
              </blockquote>

              {/* Stats inline */}
              <div className="grid grid-cols-3 border-t border-ag-border pt-8 gap-4">
                {[
                  { val: '6', label: 'Actifs' },
                  { val: '3', label: 'Catégories' },
                  { val: '6', label: 'Marchés' },
                ].map((s) => (
                  <div key={s.label}>
                    <p
                      className="font-display font-black text-ag-black tracking-[-0.03em] mb-1"
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

      {/* ── Our Mission ────────────────────────────────────── */}
      <section ref={missionRef} className="border-t border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between border-b border-ag-border py-4 mb-0">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / Notre Mission
            </p>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              Simplifier la vie par le numérique
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {MISSION_PILLARS.map((item, i) => (
              <div key={item.title} className="mission-col py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex mb-8">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-[1.05] mb-5"
                  style={{ fontSize: 'clamp(22px,2vw,28px)' }}
                >
                  {item.title}
                </h3>
                <p className="font-sans font-normal text-[14px] text-ag-gray leading-[1.75]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
