/**
 * /client/auth-confirm
 * Page intermédiaire affichée brièvement pendant que le callback
 * /api/auth/callback échange le code OTP et redirige vers /client/my-assets.
 * Peut aussi servir de landing si l'URL de redirection Supabase est configurée
 * sur cette page plutôt que directement sur /api/auth/callback.
 */
import type { Metadata } from 'next'
import Link              from 'next/link'

export const metadata: Metadata = {
  title: 'Connexion en cours — AEGRYN',
  robots: { index: false, follow: false },
}

export default function AuthConfirmPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error

  if (error) {
    return (
      <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-red-400 mb-4">Erreur d'authentification</p>
          <h1 className="font-sans font-bold text-white text-[22px] tracking-tight mb-3">
            Lien invalide ou expiré
          </h1>
          <p className="font-sans text-[13px] text-white/40 mb-8">
            Les liens magiques sont valables 1 heure. Veuillez en demander un nouveau.
          </p>
          <Link
            href="/client/login"
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            Retourner à la connexion
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="w-8 h-8 border-2 border-ag-apex border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-3">AEGRYN</p>
        <h1 className="font-sans font-bold text-white text-[20px] tracking-tight mb-2">
          Connexion en cours…
        </h1>
        <p className="font-sans text-[13px] text-white/30">
          Vous allez être redirigé vers votre espace.
        </p>
      </div>
    </main>
  )
}
