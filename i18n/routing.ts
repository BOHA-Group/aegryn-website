import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en', 'it', 'es', 'de', 'nl'],
  defaultLocale: 'fr',
  pathnames: {
    '/': '/',
    '/about': {
      fr: '/a-propos',
      en: '/about',
      it: '/chi-siamo',
      es: '/sobre-nosotros',
      de: '/ueber-uns',
      nl: '/over-ons',
    },
    '/what-we-build': {
      fr: '/ce-que-nous-construisons',
      en: '/what-we-build',
      it: '/cosa-costruiamo',
      es: '/lo-que-construimos',
      de: '/was-wir-bauen',
      nl: '/wat-we-bouwen',
    },
    '/advisory': {
      fr: '/advisory',
      en: '/advisory',
      it: '/advisory',
      es: '/advisory',
      de: '/advisory',
      nl: '/advisory',
    },
    '/contact': {
      fr: '/contact',
      en: '/contact',
      it: '/contatto',
      es: '/contacto',
      de: '/kontakt',
      nl: '/contact',
    },
  },
})
