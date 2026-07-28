import CookieBanner from '@/components/analytics/CookieBanner'

/**
 * Root layout — le seul niveau où Next.js App Router accepte
 * strategy="beforeInteractive". CookieScript est placé ici pour
 * garantir qu'il s'exécute avant tout autre script tiers (GA, Stripe…).
 * Le <html> et <body> réels sont définis dans [locale]/layout.tsx ;
 * ce root layout enveloppe silencieusement avec le Script beforeInteractive.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CookieBanner />
      {children}
    </>
  )
}
