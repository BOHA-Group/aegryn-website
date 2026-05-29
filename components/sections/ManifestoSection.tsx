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
          <div className="flex items-center justify-between border-b border-ag-border py-4">
            <Link
              href="/advisory"
              className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light hover:text-ag-black transition-colors"
            >
              / What we do
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-ag-border">
            {WHAT_WE_DO.map((item) => (
              <div key={item.num} className="what-col py-12 lg:px-8 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex mb-5">
                  {item.num}
                </p>
                <h3
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-tight mb-4"
                  style={{ fontSize: 'clamp(13px,1.1vw,15px)' }}
                >
                  {item.title}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
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
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
                / About us
              </p>
              <h2
                className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.93] mb-8"
                style={{ fontSize: 'clamp(32px,4vw,54px)' }}
              >
                Aegryn, a Swiss Technology Asset Platform
              </h2>
              <p className="text-[15px] text-ag-gray leading-relaxed mb-8 max-w-lg">
                We design, build and operate digital ecosystems that move from bold ideas to real, enduring technology. We are not here to ship features.
                <br /><br />
                We are here to build assets that improve everyday life for individuals, professionals and the markets they operate in. Engineered in Switzerland. Built to last.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-black border border-ag-border px-6 py-3 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all"
              >
                More About Us →
              </Link>
            </div>
            <div className="py-20 md:pl-16 flex flex-col justify-center">
              <blockquote className="border-l-2 border-ag-apex pl-8">
                <p
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-[1.2] mb-6"
                  style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}
                >
                  &ldquo;We develop proprietary digital ecosystems engineered for endurance and scale. Our advisory draws on real execution frameworks in Data, AI &amp; Security&rdquo;
                </p>
                <footer className="font-sans font-semibold text-[11px] tracking-[0.2em] uppercase text-ag-gray-light">
                  CEO — Aegryn Group
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Mission ────────────────────────────────────── */}
      <section ref={missionRef} className="border-t border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / Our Mission
            </p>
            <p
              className="font-display font-black text-ag-black tracking-[-0.02em] text-[13px]"
            >
              SIMPLIFYING LIFE WITH SMART APPS
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {MISSION_PILLARS.map((item, i) => (
              <div key={item.title} className="mission-col py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-none mb-5"
                  style={{ fontSize: 'clamp(18px,1.6vw,22px)' }}
                >
                  {item.title}
                </h3>
                <p className="text-[14px] text-ag-gray leading-relaxed">
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
