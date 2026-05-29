'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const WHY_ITEMS = [
  {
    num: '01',
    title: 'Innovative',
    desc: 'We leverage cutting-edge technologies — AI, automation and smart data — to create apps that continuously evolve and improve your experience.',
  },
  {
    num: '02',
    title: 'Secure & Private',
    desc: 'Your data is yours. Every Aegryn app is engineered with privacy-first architecture, encrypted communications and transparent data practices aligned with Swiss and European standards.',
  },
  {
    num: '03',
    title: 'Diverse & Inclusive',
    desc: 'We design for everyone. Our apps are built to be accessible, culturally sensitive and available across languages and markets — because great technology should serve all.',
  },
  {
    num: '04',
    title: 'Social Impact',
    desc: 'We build with purpose. Each platform we create is designed to simplify real-life challenges, reduce friction and create measurable value for individuals and communities.',
  },
  {
    num: '05',
    title: 'Accessible',
    desc: 'From first-time smartphone users to seasoned professionals, our apps are intuitive and barrier-free — because the best interface is one anyone can use.',
  },
]

export function WhyUseApps() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.why-col', {
        opacity: 0, y: 24, stagger: 0.09,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="border-t border-ag-border bg-ag-off-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between border-b border-ag-border py-4">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
            / Why use our apps
          </p>
          <p className="font-display font-black text-ag-black text-[13px] tracking-[-0.02em]">
            04
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-ag-border">
          {WHY_ITEMS.map((item) => (
            <div key={item.num} className="why-col py-12 lg:px-6 first:pl-0 last:pr-0">
              <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex mb-5">
                {item.num}
              </p>
              <h3
                className="font-sans font-semibold text-ag-black leading-tight mb-3"
                style={{ fontSize: 'clamp(13px,1vw,15px)' }}
              >
                {item.title}
              </h3>
              <p className="font-sans font-normal text-[12px] text-ag-gray leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
