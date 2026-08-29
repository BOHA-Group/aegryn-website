/**
 * Root layout — requis par Next.js 15 (doit avoir html + body).
 * Les layouts enfants ([locale], /client, /admin) surchargent html/body
 * avec leur propre lang/class via suppressHydrationWarning.
 * CookieScript est chargé via GTM — pas de script direct ici.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
