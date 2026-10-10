'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'
import { AboutHeroLogo } from '@/components/brand/AboutHeroLogo'

const BLUR = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAArAEADASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAAAgEDBAUGBwD/xAAtEAACAQMDAgQGAgMAAAAAAAABAgMABBEFEiETMQZBYXEUMlFSgbEi4ZGhwf/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAaEQEBAAMBAQAAAAAAAAAAAAAAARESITEC/9oADAMBAAIRAxEAPwDroWiC0WKXFZaDtpQuOaXFewaITAP1oWUeVHikxRTJUU0yVJK0JSpQN1qFnY7Pi7qG36hwnVcLuPpmvXeoWtkubiYKT8qjlm9gOTXMfE7ahqttDPdSystujsxeARrHhHmO/anNEc6rIetLqUVrJEGjmRFLT59SMgCm0MVsn8SyzytDYWRkZe+7kj3A4H5IpTLr0wyz20Q+0/1n90zAtrBAscMmppGvAVdij/QourZEKJb7UYS0gRRJLguSM8YHvTaGKiG71mBclILjH2jB/Yr1v4kiMvSubd43HzBckj1KnBx7ZqIl5pjo8q6tqG1WZeGYnIPPG2sl4q1PUHhxp9tqMscR6guZcMVUeYGwFPfNNoYrc+FLwXPhaxmkmOBlYwCVWfQH4in/AOBLyR3PYGOMIa+b6a/oBudhu3PBNPsbWOCI5PA3i3y3dycOQR3owRmHFuHkKwHzsHYLn0WhA0t0H1nzjOAS0T2+ah+yCdCNrdcxNG4+adFdjrh7FMFj7nNO0qyuRA2k8uOuP7c0rdrAQpyGGcUEfpCC1OK9aEg+QOadbXIGDkHtzWnWW8jntjNdtF1ZpwUMTcluVbrnJHNei2eOIx3rtNE1Z6QWMPGNB4NAP0FK1y5UGi1QQnEdx9HtSrtdyMcr+dL+zO3G5Ofalbsi8r/OtGx1OJ7h0MnGMdaHchjDJGI5wzAzscckd6tyz7ADtUH1rM8Raq/ibV5L5eE3hFU/3QSazV2qAOSaNQVdOFWqUVJVHvS5weKWk4oEbqMrWV4puPs+k3E3dULY+tUvEGrlrSUW0R+Y8s+1Y4pGtzWhq5RCGBGBwKkt4zPdxwj+BPMm7r9nTGaLqby9ElrCc1oHQ0JLQnRUxn0qSPNc3olx9huopTwyuFPv2rp/Ja4jDJ94nFBqtKTWrRg8Pxtqd1bxNkKMH6mtyfw/Yxy/P8PJj5iVrJ0Qn7Bbj0B/SsaFb21PpgNaJXewsdS38P2w8rBX5pwA55B4Fqw5mWS4Zgf4iBWutGy21mva4bBHWtUVv//Z'

/**
 * Hero About — style size.swiss/capital :
 * fond blanc, titre noir, puis la photo part d'un cadre centré
 * en bas du viewport et s'étend en plein écran au scroll (scrub).
 */
export function AboutHeroScroll() {
  const t = useTranslations('about')
  const wrapRef  = useRef<HTMLElement>(null)
  const textRef  = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current || !mediaRef.current || !imgRef.current || !textRef.current) return

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
        const start = mq.conditions?.isDesktop
          ? 'inset(58% 6% 8% 62% round 4px)'
          : 'inset(88% 5% 1% 5% round 4px)'
        gsap.fromTo(mediaRef.current,
          { clipPath: start },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: st },
        )
      })

      /* Zoom interne de la photo pendant l'expansion */
      gsap.fromTo(imgRef.current,
        { scale: 1.18 },
        { scale: 1, ease: 'none', scrollTrigger: st },
      )

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
              style={{ fontSize: 'clamp(48px,6vw,86px)' }}
            >
              {t('hero.title').split('\n').map((line, i) => (
                <span key={i} className={i === 0 ? 'block font-normal' : 'block'}>{line}</span>
              ))}
            </h1>
            <div className="shrink-0 mt-16 -mr-3">
              <AboutHeroLogo />
            </div>
          </div>
          <p className="text-[16px] text-ag-gray leading-relaxed max-w-xl whitespace-pre-line">
            {t('hero.desc')}
          </p>
        </div>

        {/* Photo — clip-path expansible, recouvre le texte au scroll */}
        <div ref={mediaRef} className="absolute inset-0 z-20 will-change-[clip-path]">
          <div ref={imgRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/images/about/about_regatta.webp"
              alt={t('hero.imageAlt')}
              fill
              priority
              unoptimized
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
