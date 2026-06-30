import type { Metadata } from 'next'
import LoginForm         from './LoginForm'

export const metadata: Metadata = {
  title: 'Connexion — Espace client AEGRYN',
  robots: { index: false, follow: false },
}

export default function ClientLoginPage() {
  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">AEGRYN</p>
          <h1 className="font-sans font-bold text-white text-[28px] tracking-[-0.03em] mb-2">
            Espace client
          </h1>
          <p className="font-sans text-[13px] text-white/40">
            Accès réservé aux vendeurs et acquéreurs certifiés AEGRYN.
          </p>
        </div>
        <LoginForm />
        <p className="mt-8 text-center font-sans text-[11px] text-white/25">
          Vous n&apos;avez pas de compte ? L&apos;accès est sur invitation uniquement.
          <br />
          Contactez <a href="mailto:contact@aegryn.com" className="text-ag-apex/60 hover:text-ag-apex transition-colors">contact@aegryn.com</a>
        </p>
      </div>
    </main>
  )
}
