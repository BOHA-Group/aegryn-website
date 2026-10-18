'use client'

import { useId, useLayoutEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { gsap } from '@/lib/gsap'

/**
 * Original outlines from public/images/brand/logo.svg.
 * The temporary black cap and cut only exist during the desktop scroll sequence.
 * HTML and the complete logo are the default, including without JavaScript.
 */
export function AboutSign() {
  const t = useTranslations('about.sign')
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const logoTitleId = useId()

  useLayoutEffect(() => {
    const section = sectionRef.current
    const panel = panelRef.current
    if (!section || !panel) return

    const mm = gsap.matchMedia()
    // Short desktop windows keep the static layout so all the copy stays reachable.
    mm.add('(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)', () => {
      const find = (selector: string) => section.querySelector(selector)
      const mark = find('[data-sign-mark]')
      const cap = find('[data-sign-cap]')
      const cut = find('[data-sign-cut]')
      const apex = find('[data-sign-apex]')
      const copy = find('[data-sign-copy]')
      const steps = section.querySelectorAll('[data-sign-step]')
      const size = () => { section.style.height = `${panel.offsetHeight + window.innerHeight * 1.6}px` }

      size()
      gsap.set(panel, { position: 'sticky', top: 64 })
      gsap.set(mark, { opacity: 0, y: 18 })
      gsap.set(cap, { opacity: 1 })
      gsap.set(cut, { opacity: 1, strokeDasharray: 190, strokeDashoffset: 190 })
      gsap.set(apex, { opacity: 0, y: -48 })
      gsap.set(copy, { opacity: 0 })
      gsap.set(steps, { opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'about-sign',
          trigger: section,
          start: 'top 64px',
          end: () => `+=${section.offsetHeight - panel.offsetHeight}`,
          scrub: 0.35,
          invalidateOnRefresh: true,
          onRefreshInit: size,
        },
      })

      tl.to(mark, { opacity: 1, y: 0, duration: 0.45 }, 0)
        .to(steps[0], { opacity: 1, duration: 0.25 }, 0)
        .to(steps[0], { opacity: 0, duration: 0.2 }, 0.85)
        .to(steps[1], { opacity: 1, duration: 0.2 }, 1.05)
        .to(cut, { strokeDashoffset: 0, duration: 0.5 }, 1.05)
        .to(cap, { opacity: 0, y: -12, duration: 0.3 }, 1.55)
        .to(cut, { opacity: 0, duration: 0.15 }, 1.85)
        .to(steps[1], { opacity: 0, duration: 0.2 }, 1.9)
        .to(steps[2], { opacity: 1, duration: 0.2 }, 2.1)
        .to(apex, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 2.1)
        .to(steps[2], { opacity: 0, duration: 0.25 }, 3)
        .to(copy, { opacity: 1, duration: 0.45 }, 3.25)
        // Leave a reading interval with the complete mark and the full text.
        .to({}, { duration: 0.6 })

      return () => { section.style.removeProperty('height') }
    }, section)

    return () => mm.revert()
  }, [])

  const code = () => <code className="font-mono text-[0.85em]">{'</>'}</code>

  return (
    <section ref={sectionRef} id="notre-signe" aria-labelledby={titleId} className="border-b border-ag-border bg-white">
      <div ref={panelRef} className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:py-20">
        <p className="mb-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink lg:mb-12">
          <span className="inline-block h-px w-5 bg-ag-apex/50" aria-hidden="true" />
          {t('label')}
        </p>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <div className="flex justify-center py-2 lg:py-10">
            <svg
              data-sign-mark
              viewBox="0 -60 441.14 547.91"
              role="img"
              aria-labelledby={logoTitleId}
              className="w-32 overflow-visible lg:w-full lg:max-w-[300px]"
            >
              <title id={logoTitleId}>{t('imageAlt')}</title>
              <polygon fill="#000" points="317.41 214.36 246.64 143.18 184.15 80.28 175.05 100.56 0 487.91 90.63 487.91 220.57 201.12 350.51 487.91 441.14 487.91 317.41 214.36" />
              <polygon data-sign-cap aria-hidden="true" opacity="0" fill="#000" points="184.15 80.28 220.57 0 317.41 214.36" />
              <path data-sign-cut aria-hidden="true" opacity="0" d="M184.15 80.28L317.41 214.36" fill="none" stroke="#fff" strokeWidth="3" />
              <polygon data-sign-apex fill="#5ADDA5" points="297.96 171.32 266.09 100.56 220.57 0 191.6 64.14 254.09 127.04 297.96 171.32" />
            </svg>
          </div>
          <div>
            <h2 id={titleId} className="mb-8 font-sans font-bold leading-[1.1] tracking-[-0.03em] text-ag-black" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
              {t('title')}
            </h2>
            <div className="relative">
              <div data-sign-copy className="text-[15px] leading-relaxed text-ag-gray">
                <div className="hidden space-y-5 lg:block">
                  <p>{t('paragraph1')}</p>
                  <p>{t('paragraph2')}</p>
                  <p>{t.rich('paragraph3', { code })}</p>
                </div>
                <p className="lg:hidden">{t.rich('mobile', { code })}</p>
                <p className="mt-8 font-semibold text-ag-black">{t('closing')}</p>
                <p className="mt-2 text-ag-black">{t('signature')}</p>
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-center lg:grid">
                {(['step1', 'step2', 'step3'] as const).map((key, i) => (
                  <p key={key} data-sign-step className="col-start-1 row-start-1 font-sans text-[22px] leading-relaxed tracking-[-0.02em] text-ag-black opacity-0">
                    <span className="mb-5 block font-mono text-[10px] tracking-[0.22em] text-ag-apex-ink">0{i + 1}</span>
                    {t(key)}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Link href="/culture" className="mt-10 inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-ag-black underline decoration-ag-border decoration-2 underline-offset-4 transition-colors hover:text-ag-apex-ink">
          {t('cultureCta')} <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
