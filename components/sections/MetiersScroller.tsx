'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

type Pillar = { title: string; desc: string; href?: string }

/* Photo de chaque métier : celle du hero de sa page */
const IMAGES: Record<string, string> = {
  strategy:           '/images/advisory/strategy-towers.webp',
  riskCompliance:     '/images/advisory/risk-compliance.webp',
  finance:            '/images/advisory/finance.webp',
  technology:         '/images/advisory/technology.webp',
  operations:         '/images/advisory/operations.webp',
  talentOrganization: '/images/advisory/talent.webp',
  program:            '/images/advisory/program.webp',
  ma:                 '/images/advisory/ma.webp',
}

/**
 * Section « Cadrer et réaliser » de l'accueil, sur le modèle de la section « Selected work » de scene-studio.webflow.io :
 * 1. la vidéo (petite, arrondie, centrée) s'ouvre en plein écran au scroll, avec le titre de la section ;
 * 2. elle s'efface au profit de la grille des métiers ;
 * 3. la grille défile vers la droite pendant le scroll, des traits rouges se dessinent en escalier d'un métier au suivant.
 * Chaque métier mène à sa page. Mouvement réduit : grille à défilement horizontal natif, sans vidéo.
 */
export function MetiersScroller() {
  const t = useTranslations('advisory')
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const introRef   = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)

  const pillars = (t.raw('pillars') as Record<string, Pillar>) || {}
  const keys = Object.keys(pillars)

  /* Vidéo chargée seulement quand la section approche du viewport */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const load = () => {
      if (video.dataset.loaded) return
      video.dataset.loaded = '1'
      const small = window.matchMedia('(max-width: 1023px)').matches
      video.src = (small ? video.dataset.srcMobile : video.dataset.srcDesktop) ?? ''
      video.load()
      video.play().catch(() => {})
    }
    if (!('IntersectionObserver' in window)) { load(); return }
    const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { load(); io.disconnect() } }, { rootMargin: '800px 0px' })
    io.observe(video)
    return () => io.disconnect()
  }, [])

  useLayoutEffect(() => {
    const section = sectionRef.current, track = trackRef.current, bg = bgRef.current, intro = introRef.current
    if (!section || !track || !bg || !intro) return
    const items = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.mw-item'))
    const first = items[0]
    const firstImg = first?.querySelector<HTMLElement>('.mw-image')
    if (!first || !firstImg) return
    const last = items[items.length - 1]

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([bg, intro], { display: 'none' })
        gsap.set(section, { overflowX: 'auto' })
        gsap.set(track, { left: 0 })
        return () => { gsap.set([bg, intro], { clearProps: 'display' }); gsap.set(section, { clearProps: 'overflowX' }); gsap.set(track, { clearProps: 'left' }) }
      })

      mm.add({ reduce: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 767px)' }, (mq) => {
        if (!mq.conditions?.reduce) return
        const frame = mq.conditions.mobile ? 'inset(38% 8% 38% 8% round 16px)' : 'inset(32% 30% 32% 30% round 16px)'

        const dist = () => {
          const pad = parseFloat(String(gsap.getProperty(track, 'paddingRight'))) || 0
          return Math.max(0, track.offsetLeft + last.offsetLeft + last.offsetWidth + pad - window.innerWidth)
        }
        const imgCenter = () => track.offsetLeft + first.offsetLeft + firstImg.offsetLeft + firstImg.offsetWidth / 2
        const shift = () => section.clientWidth / 2 - imgCenter()

        /* Chaque métier : trait horizontal (et marche verticale) qui se dessinent, puis le texte apparaît */
        const draws = items.map(item => {
          const line = item.querySelector<HTMLElement>('.mw-line')
          const riser = item.querySelector<HTMLElement>('.mw-riser')
          const copy = gsap.utils.toArray<HTMLElement>(item.querySelectorAll('.mw-title, .mw-sub, .mw-meta'))
          const d = gsap.timeline({ paused: true })
          if (line && riser) {
            const lr = line.getBoundingClientRect(), rr = riser.getBoundingClientRect()
            const lineAtTop = Math.abs(rr.top - lr.top) < Math.abs(rr.bottom - lr.top)
            const riserFirst = rr.left < lr.left
            const origin = riserFirst ? (lineAtTop ? '50% 100%' : '50% 0%') : (lineAtTop ? '50% 0%' : '50% 100%')
            if (riserFirst) {
              d.fromTo(riser, { scaleY: 0, transformOrigin: origin }, { scaleY: 1, duration: 0.4, ease: 'none' }, 0)
              d.fromTo(line, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'none' }, 0.4)
            } else {
              d.fromTo(line, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'none' }, 0)
              d.fromTo(riser, { scaleY: 0, transformOrigin: origin }, { scaleY: 1, duration: 0.4, ease: 'none' }, 0.6)
            }
          } else if (line) {
            d.fromTo(line, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'none' }, 0)
          }
          if (copy.length) d.fromTo(copy, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'none' }, 0.7)
          return { item, d }
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + (window.innerHeight * 2.6 + dist() + Math.abs(shift())),
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: () => drawAll(),
          },
        })
        const drawAll = () => {
          const gate = gsap.utils.clamp(0, 1, (tl.time() - 2.3) / 0.9)
          const vw = window.innerWidth
          draws.forEach(o => {
            const left = o.item.getBoundingClientRect().left
            const pos = gsap.utils.clamp(0, 1, (vw * 0.95 - left) / (vw * 0.35))
            o.d.progress(Math.min(gate, pos))
          })
        }
        tl.eventCallback('onUpdate', drawAll)

        /* 1. la vidéo s'ouvre en plein écran, le titre apparaît */
        tl.fromTo(bg, { clipPath: frame }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1, ease: 'none' }, 0)
        tl.fromTo(intro, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'none' }, 0.8)
        tl.to(intro, { autoAlpha: 0, duration: 0.4, ease: 'none' }, 1.5)
        /* 2. la vidéo s'efface, les métiers apparaissent, le premier au centre */
        tl.fromTo(track, { x: shift }, { x: shift, duration: 1, ease: 'none' }, 0)
        tl.fromTo(items, { autoAlpha: 0 }, { autoAlpha: 0, duration: 0.01 }, 0)
        tl.to(bg, { autoAlpha: 0, duration: 0.5, ease: 'none' }, 1.9)
        tl.to(items, { autoAlpha: 1, duration: 0.5, ease: 'none' }, 1.9)
        /* 3. défilement horizontal */
        tl.to(track, { x: () => -dist(), duration: 5, ease: 'none' }, 2.4)
        drawAll()
      })
    }, section)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { window.removeEventListener('load', refresh); ctx.revert() }
  }, [])

  return (
    <section ref={sectionRef} id="cadrer" className="mw-section">
      <div ref={bgRef} className="mw-bg" aria-hidden="true">
        <video
          ref={videoRef}
          className="mw-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/services/sailboat-rope-poster.jpg"
          preload="metadata"
          data-src-desktop="/videos/sailboat-rope-web.mp4"
          data-src-mobile="/videos/sailboat-rope-mobile.mp4"
        >
          <track kind="captions" />
        </video>
      </div>

      <div ref={introRef} className="mw-intro">
        <p className="mw-intro-label">{t('label')}</p>
        <h2 className="mw-intro-title">{t('hero.title')}</h2>
        <p className="mw-intro-desc">{t('hero.desc')}</p>
      </div>

      <div ref={trackRef} className="mw-grid">
        {keys.map((key, i) => {
          const p = pillars[key]
          return (
            <Link key={key} href={(p.href ?? '/advisory') as never} className={`mw-item ${i % 2 ? 'is-down' : ''}`}>
              <div className="mw-line" />
              {i > 0 && <div className={`mw-riser ${i % 2 ? 'is-down' : 'is-up'}`} />}
              <div className="mw-image">
                <Image
                  src={IMAGES[key] ?? '/images/advisory/strategy-towers.webp'}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(max-width: 767px) 80vw, 40svh"
                />
              </div>
              <div className="mw-text">
                <h3 className="mw-title">{p.title}</h3>
                <p className="mw-sub">{p.desc}</p>
                <p className="mw-meta">{String(i + 1).padStart(2, '0')} / {String(keys.length).padStart(2, '0')}</p>
              </div>
            </Link>
          )
        })}
        <Link href="/advisory" className="mw-link">
          {t('all')} <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  )
}
