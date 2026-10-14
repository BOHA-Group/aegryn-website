import '@/styles/globals.css'

/* Layout minimal de la signature NDA : feuille de style globale, sans navigation.
   html/body sont rendus par le root layout. */
export default function NdaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
