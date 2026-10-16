'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { assetPath } from '@/data/assets'

type Project = { id: string; slug: string; image?: string }

/**
 * La Boutique, section « Projets signature » : même chorégraphie que la section « Cadrer et réaliser »
 * de l'accueil (scene-studio.webflow.io), sans la vidéo d'introduction. Le premier projet est centré
 * sous le titre ; au scroll, le titre s'efface et la grille défile vers la droite pendant que les
 * traits rouges se dessinent en escalier d'un projet au suivant. Chaque fiche mène à la page du projet.
 * Mouvement réduit : grille à défilement horizontal natif.
 */
export function ProjectsScroller({ title, allLabel, projects }: { title: string; allLabel: string; projects: Project[] }) {
  const tItems = useTranslations('assets.items')
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current, track = trackRef.current, head = headRef.current
    if (!section || !track || !head) return
    const items = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.mw-item'))
    const first = items[0]
    const firstImg = first?.querySelector<HTMLElement>('.mw-image')
    if (!first || !firstImg) return
    const last = items[items.length - 1]

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(section, { overflowX: 'auto', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: '2.5rem', paddingTop: '4rem', paddingBottom: '4rem' })
        gsap.set(head, { position: 'static', paddingLeft: '24px', paddingRight: '24px' })
        gsap.set(track, { left: 0 })
        return () => { gsap.set([section, head, track], { clearProps: 'all' }) }
      })

      mm.add({ reduce: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 767px)' }, (mq) => {
        if (!mq.conditions?.reduce) return

        const dist = () => {
          const pad = parseFloat(String(gsap.getProperty(track, 'paddingRight'))) || 0
          return Math.max(0, track.offsetLeft + last.offsetLeft + last.offsetWidth + pad - window.innerWidth)
        }
        const imgCenter = () => track.offsetLeft + first.offsetLeft + firstImg.offsetLeft + firstImg.offsetWidth / 2
        const shift = () => section.clientWidth / 2 - imgCenter()

        /* Chaque projet : trait horizontal (et marche verticale) qui se dessinent, puis le texte apparaît */
        const draws = items.map(item => {
          const line = item.querySelector<HTMLElement>('.mw-line')
          const riser = item.querySelector<HTMLElement>('.mw-riser')
          const copy = gsap.utils.toArray<HTMLElement>(item.querySelectorAll('.mw-title, .mw-meta'))
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
            end: () => '+=' + (window.innerHeight * 1.4 + dist() + Math.abs(shift())),
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: () => drawAll(),
          },
        })
        const drawAll = () => {
          const vw = window.innerWidth
          draws.forEach(o => {
            const left = o.item.getBoundingClientRect().left
            o.d.progress(gsap.utils.clamp(0, 1, (vw * 0.95 - left) / (vw * 0.35)))
          })
        }
        tl.eventCallback('onUpdate', drawAll)

        /* Au repos : premier projet centré sous le titre. Au scroll : le titre s'efface, la grille défile. */
        tl.set(track, { x: shift }, 0)
        tl.to(head, { autoAlpha: 0, y: -24, duration: 0.5, ease: 'none' }, 0)
        tl.to(track, { x: () => -dist(), duration: 5, ease: 'none' }, 0.5)
        drawAll()
      })
    }, section)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => { window.removeEventListener('load', refresh); ctx.revert() }
  }, [])

  return (
    <section ref={sectionRef} id="projets" className="mw-section">
      <div ref={headRef} className="mw-head">
        <h2 className="mw-head-title">{title}</h2>
        <Link href={'/boutique/projets' as never} className="mw-head-link">{allLabel} →</Link>
      </div>

      <div ref={trackRef} className="mw-grid">
        {projects.map((p, i) => (
          <Link key={p.id} href={assetPath(p.slug) as never} className={`mw-item ${i % 2 ? 'is-down' : ''}`}>
            <div className="mw-line" />
            {i > 0 && <div className={`mw-riser ${i % 2 ? 'is-down' : 'is-up'}`} />}
            {p.image && (
              <div className="mw-image">
                <Image src={p.image} alt={tItems(`${p.id}.tagline`)} fill loading="eager" sizes="(max-width: 767px) 80vw, 40svh" />
              </div>
            )}
            <div className="mw-text">
              <h3 className="mw-title">{tItems(`${p.id}.capability`)}</h3>
              <p className="mw-meta">{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
