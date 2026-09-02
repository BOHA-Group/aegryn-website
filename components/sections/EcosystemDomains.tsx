'use client'

import { useEffect, useRef } from 'react'
import Image                 from 'next/image'
import Link                  from 'next/link'
import { ArrowUpRight }      from 'lucide-react'
import { useTranslations }   from 'next-intl'
import { gsap, SplitText }   from '@/lib/gsap'

interface Domain {
  id: string
  label: string
  desc: string
}

/* Photos éditoriales par thématique — compléter au fur et à mesure des visuels disponibles */
const DOMAIN_IMAGES: Record<string, string> = {
  ai:          '/images/theme_AI.jpg',
  saas:        '/images/theme_saas.jpg',
  fintech:     '/images/theme_fintech.jpg',
  ip:          '/images/theme_IP.jpg',
  marketplace: '/images/theme_marketplace.jpg',
  web3:        '/images/theme_Digital Art.jpg',
}

export function EcosystemDomains() {
  const t       = useTranslations('ecosystemDomains')
  const domains = (t.raw('domains') as Domain[]) || []

  const wrapRef   = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const h2Ref     = useRef<HTMLHeadingElement>(null)
  const labelRef  = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const h2 = h2Ref.current
    if (!h2) return

    const split = new SplitText(h2, { type: 'lines', linesClass: 'ag-line-inner' })

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, scrollTrigger: { trigger: headerRef.current, start: 'top 82%', once: true } },
        )
      }
      gsap.fromTo(split.lines,
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out', scrollTrigger: { trigger: headerRef.current, start: 'top 80%', once: true } },
      )
      domains.forEach((_domain, i) => {
        gsap.fromTo(`.domain-card-${i}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', delay: (i % 3) * 0.05,
            scrollTrigger: { trigger: wrapRef.current, start: 'top 85%', once: true } },
        )
      })
    }, wrapRef)

    return () => { split.revert(); ctx.revert() }
  }, [domains])

  return (
    <section className="bg-ag-white border-t border-ag-border">
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-14">
        <p ref={labelRef} className="font-sans font-semibold text-[11px] tracking-[0.24em] uppercase text-ag-gray-light mb-6">
          {t('label')}
        </p>
        <h2
          ref={h2Ref}
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2] overflow-hidden pb-4"
          style={{ fontSize: 'clamp(42px,5.5vw,80px)' }}
          dangerouslySetInnerHTML={{ __html: t('title').replace(/\n/g, '<br>') }}
        />
      </div>

      <div ref={wrapRef} className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-ag-border mb-10">
          {domains.map((domain, i) => {
            const borderRight   = i % 3 !== 2 ? 'lg:border-r border-ag-border' : ''
            const borderRightSm = i % 2 !== 1 ? 'sm:border-r border-ag-border' : ''
            const image         = DOMAIN_IMAGES[domain.id]
            return (
              <div
                key={domain.id}
                className={`domain-card-${i} group relative flex flex-col justify-start overflow-hidden p-8 transition-all duration-500
                  bg-ag-navy hover:bg-ag-navy border-b border-ag-border
                  ${borderRight} ${borderRightSm}`}
                style={{ minHeight: '220px', opacity: 0 }}
              >
                {image && (
                  <>
                    <Image
                      src={image}
                      alt={domain.label}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-30 transition-opacity duration-500"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-ag-navy/20 group-hover:bg-ag-navy/75 transition-colors duration-500" />
                  </>
                )}

                <div className="relative z-10 w-full flex items-center justify-end mb-6">
                  <ArrowUpRight size={14} className="text-white/40 group-hover:text-white/80 transition-all duration-500" />
                </div>

                <div className="relative z-10">
                  <h3
                    className="font-sans font-bold tracking-[-0.02em] leading-[1.1] mb-3 text-white transition-colors duration-500"
                    style={{ fontSize: 'clamp(18px,1.8vw,22px)' }}
                  >
                    {domain.label}
                  </h3>
                  <p className="font-sans font-normal text-[12.5px] leading-relaxed text-white/70 transition-colors duration-500">
                    {domain.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="border-t border-ag-border pt-8 flex items-center justify-end">
          <Link
            href="/transact/how-to-sell"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-6 py-3 hover:bg-ag-black hover:text-white hover:border-ag-black transition-all duration-300"
          >
            {t('cta')} <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}
