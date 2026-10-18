'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

const BLUR = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAArAEADASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAAAgEDBAUGBwD/xAAtEAACAQMDAgQGAgMAAAAAAAABAgMABBEFEiETMQZBYXEUMlFSgbEi4ZGhwf/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAaEQEBAAMBAQAAAAAAAAAAAAAAARESITEC/9oADAMBAAIRAxEAPwDroWiC0WKXFZaDtpQuOaXFewaITAP1oWUeVHikxRTJUU0yVJK0JSpQN1qFnY7Pi7qG36hwnVcLuPpmvXeoWtkubiYKT8qjlm9gOTXMfE7ahqttDPdSystujsxeARrHhHmO/anNEc6rIetLqUVrJEGjmRFLT59SMgCm0MVsn8SyzytDYWRkZe+7kj3A4H5IpTLr0wyz20Q+0/1n90zAtrBAscMmppGvAVdij/QourZEKJb7UYS0gRRJLguSM8YHvTaGKiG71mBclILjH2jB/Yr1v4kiMvSubd43HzBckj1KnBx7ZqIl5pjo8q6tqG1WZeGYnIPPG2sl4q1PUHhxp9tqMscR6guZcMVUeYGwFPfNNoYrc+FLwXPhaxmkmOBlYwCVWfQH4in/AOBLyR3PYGOMIa+b6a/oBudhu3PBNPsbWOCI5PA3i3y3dycOQR3owRmHFuHkKwHzsHYLn0WhA0t0H1nzjOAS0T2+ah+yCdCNrdcxNG4+adFdjrh7FMFj7nNO0qyuRA2k8uOuP7c0rdrAQpyGGcUEfpCC1OK9aEg+QOadbXIGDkHtzWnWW8jntjNdtF1ZpwUMTcluVbrnJHNei2eOIx3rtNE1Z6QWMPGNB4NAP0FK1y5UGi1QQnEdx9HtSrtdyMcr+dL+zO3G5Ofalbsi8r/OtGx1OJ7h0MnGMdaHchjDJGI5wzAzscckd6tyz7ADtUH1rM8Raq/ibV5L5eE3hFU/3QSazV2qAOSaNQVdOFWqUVJVHvS5weKWk4oEbqMrWV4puPs+k3E3dULY+tUvEGrlrSUW0R+Y8s+1Y4pGtzWhq5RCGBGBwKkt4zPdxwj+BPMm7r9nTGaLqby9ElrCc1oHQ0JLQnRUxn0qSPNc3olx9huopTwyuFPv2rp/Ja4jDJ94nFBqtKTWrRg8Pxtqd1bxNkKMH6mtyfw/Yxy/P8PJj5iVrJ0Qn7Bbj0B/SsaFb21PpgNaJXewsdS38P2w8rBX5pwA55B4Fqw5mWS4Zgf4iBWutGy21mva4bBHWtUVv//Z'

/**
 * Hero About — style size.swiss/capital :
 * fond blanc, titre noir, puis la photo part d'un cadre centré
 * en bas du viewport et s'étend en plein écran au scroll (scrub).
 *
 * Le cadre initial doit montrer le voilier en entier (mât compris), quel que
 * soit le ratio d'écran. Pour cela, zoom et origine de transformation sont
 * calculés dynamiquement : on connaît la position du voilier dans l'image
 * source (fraction horizontale/verticale FX1..FY2, mesurée une fois sur le
 * fichier), et on résout l'équation qui fait correspondre cette fenêtre à la
 * géométrie exacte du cadre (FRAME). Au scroll, le zoom retombe à 1 (image
 * pleine, non recadrée) pendant que le cadre s'étend au plein écran — un seul
 * calque image, comme avant.
 */
const FRAME  = { top: 0.2, bottom: 0.26, right: 0.06, ratio: 0.5052631578947369 }
const BOAT   = { fx1: 0.695, fx2: 0.845, fy1: 0.345, fy2: 0.79 }
const IMG_W  = 1920
const IMG_H  = 1280

function computeBoatZoom(vw: number, vh: number) {
  const s0 = Math.max(vw / IMG_W, vh / IMG_H)
  const offsetX = (IMG_W * s0 - vw) / 2
  const offsetY = (IMG_H * s0 - vh) / 2
  const screenX = (fx: number) => fx * IMG_W * s0 - offsetX
  const screenY = (fy: number) => fy * IMG_H * s0 - offsetY

  const h = vh * (1 - FRAME.top - FRAME.bottom)
  const w = h * FRAME.ratio
  const boxLeft = vw - vw * FRAME.right - w
  const boxTop  = vh * FRAME.top

  const x1 = screenX(BOAT.fx1), x2 = screenX(BOAT.fx2)
  const y1 = screenY(BOAT.fy1), y2 = screenY(BOAT.fy2)

  const scaleX = w / (x2 - x1)
  const scaleY = h / (y2 - y1)
  const originX = (boxLeft - x1 * scaleX) / (1 - scaleX)
  const originY = (boxTop  - y1 * scaleY) / (1 - scaleY)

  return { scaleX, scaleY, originX, originY, boxLeft, boxTop, w, h }
}

export function AboutHeroScroll() {
  const t = useTranslations('about')
  const wrapRef  = useRef<HTMLElement>(null)
  const textRef  = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current || !mediaRef.current || !imgRef.current || !textRef.current) return

    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(wrapRef.current, { height: 'auto' })
      gsap.set(wrapRef.current!.firstElementChild, { position: 'relative', height: 'auto' })
      gsap.set(textRef.current, { height: 'auto', paddingBottom: 48 })
      gsap.set(mediaRef.current, { position: 'relative', height: '50vh', clipPath: 'none' })
    })
    motion.add('(prefers-reduced-motion: no-preference)', () => {
    const ctx = gsap.context(() => {
      const st = {
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }

      /* Cadre en bas à droite (dégagé du texte à gauche) → plein écran */
      const mm = gsap.matchMedia()
      mm.add({
        isDesktop: '(min-width: 768px)',
        isMobile:  '(max-width: 767px)',
      }, (mq) => {
        if (mq.conditions?.isDesktop) {
          const vw = window.innerWidth, vh = window.innerHeight
          const z  = computeBoatZoom(vw, vh)
          const start = `inset(${FRAME.top * 100}% ${FRAME.right * 100}% ${FRAME.bottom * 100}% ${(1 - FRAME.right - z.w / vw) * 100}% round 16px)`

          gsap.fromTo(mediaRef.current,
            { clipPath: start },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: st },
          )
          gsap.fromTo(imgRef.current,
            { scaleX: z.scaleX, scaleY: z.scaleY, transformOrigin: `${z.originX}px ${z.originY}px` },
            { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: st },
          )
        } else {
          /* Mobile : calques composites (force3D) — une transformation 2D rasterise
             l'image plein cadre à chaque frame et saccade le défilement. */
          gsap.fromTo(mediaRef.current,
            { clipPath: 'inset(88% 5% 1% 5% round 16px)', force3D: true },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', force3D: true, scrollTrigger: st },
          )
          gsap.fromTo(imgRef.current,
            { scale: 1.18, force3D: true },
            { scale: 1, ease: 'none', force3D: true, scrollTrigger: st },
          )
        }
      })

      /* Le texte s'estompe quand la photo recouvre le haut */
      gsap.to(textRef.current, {
        opacity: 0, y: -40, ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: '25% top',
          end: '60% bottom',
          scrub: true,
        },
      })
    }, wrapRef)

    return () => ctx.revert()
    })
    return () => motion.revert()
  }, [])

  return (
    <section ref={wrapRef} className="relative h-[260vh] bg-ag-white" aria-labelledby="about-hero-title">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Texte — noir sur blanc */}
        <div
          ref={textRef}
          className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-start px-6 pt-28 md:px-12 md:pt-36"
        >
          <div className="flex items-start justify-between gap-8 mb-8">
            <h1
              id="about-hero-title"
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15] max-w-3xl"
              style={{ fontSize: 'clamp(36px,5vw,72px)' }}
            >
              {t('hero.title').split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
          </div>
          <p className="text-[16px] text-ag-gray leading-relaxed max-w-xl whitespace-pre-line">
            {t('hero.desc')}
          </p>
        </div>

        {/* Photo — clip-path expansible, recouvre le texte au scroll */}
        <div ref={mediaRef} className="absolute inset-0 z-20 will-change-[clip-path] [transform:translateZ(0)]">
          <div ref={imgRef} className="absolute inset-0 will-change-transform [backface-visibility:hidden]">
            <Image
              src="/images/about/about_regatta.webp"
              alt={t('hero.imageAlt')}
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR}
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
