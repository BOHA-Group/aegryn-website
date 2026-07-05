import type { Metadata }   from 'next'
import ResetPasswordForm   from './ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Nouveau mot de passe — AEGRYN',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6 relative">
      <a
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 font-sans text-[12px] text-white/40 hover:text-white transition-colors"
      >
        <span aria-hidden="true">←</span> Retour au site
      </a>
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">AEGRYN</p>
          <h1 className="font-sans font-bold text-white text-[24px] tracking-[-0.03em] mb-2">
            Nouveau mot de passe
          </h1>
          <p className="font-sans text-[13px] text-white/40">
            Choisissez un mot de passe sécurisé pour votre compte.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </main>
  )
}
