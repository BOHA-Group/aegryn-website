'use client'

import { useEffect, useRef } from 'react'
import Link                  from 'next/link'
import { useTranslations }   from 'next-intl'
import { ArrowRight }        from 'lucide-react'
import { gsap }              from '@/lib/gsap'

export function DiscoverPreview() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('discoverSection')

  const articles = t.raw('articles') as { category: string; title: string; desc: string }[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.discover-card', {
        opacity: 0, y: 24, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-28 bg-ag-off-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-4">
              {t('label')}
            </p>
            <h2
              className="font-display font-black text-ag-black tracking-[-0.03em] leading-[1.05] whitespace-pre-line"
              style={{ fontSize: 'clamp(26px,3vw,42px)' }}
            >
              {t('title')}
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ag-gray hover:text-ag-black transition-colors shrink-0"
          >
            {t('cta')}
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border">
          {articles.map((article, i) => (
            <article
              key={i}
              className="discover-card bg-ag-white p-8 flex flex-col gap-4 hover:bg-ag-off-white transition-colors group cursor-pointer"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex">
                {article.category}
              </span>
              <h3 className="font-sans font-bold text-ag-black leading-[1.25] group-hover:text-ag-navy transition-colors"
                style={{ fontSize: 'clamp(15px,1.3vw,18px)' }}>
                {article.title}
              </h3>
              <p className="text-[13px] text-ag-gray leading-relaxed flex-1">
                {article.desc}
              </p>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light group-hover:text-ag-apex transition-colors flex items-center gap-1.5">
                Lire <ArrowRight size={10} />
              </span>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
