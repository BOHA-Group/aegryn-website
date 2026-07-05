import type { Metadata }    from 'next'
import ForgotPasswordForm   from './ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Mot de passe oublié — AEGRYN',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6 relative">
      <a
        href="/client/login"
        className="absolute top-6 left-6 inline-flex items-center gap-2 font-sans text-[12px] text-white/40 hover:text-white transition-colors"
      >
        <span aria-hidden="true">←</span> Retour à la connexion
      </a>
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">AEGRYN</p>
          <h1 className="font-sans font-bold text-white text-[24px] tracking-[-0.03em] mb-2">
            Réinitialiser le mot de passe
          </h1>
          <p className="font-sans text-[13px] text-white/40">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  )
}
