import type { Metadata } from 'next'
import NextLink          from 'next/link'
import { Link }          from '@/i18n/navigation'
import { CheckCircle2 }  from 'lucide-react'

export const metadata: Metadata = {
  title: 'Paiement confirmé — AEGRYN',
  robots: { index: false, follow: false },
}

export default function GradeSubmitSuccessPage() {
  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        <CheckCircle2 size={40} className="text-ag-apex mx-auto mb-6" />
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">AEGRYN</p>
        <h1 className="font-sans font-bold text-white text-[28px] tracking-[-0.03em] mb-4">
          Paiement confirmé
        </h1>
        <p className="font-sans text-[15px] text-white/60 leading-relaxed mb-3">
          Votre dossier a bien été soumis. Notre équipe vous contactera sous les délais convenus.
        </p>
        <p className="font-sans text-[13px] text-white/30 mb-10">
          Un email de confirmation vous a été envoyé.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/grade"
            className="inline-flex items-center gap-2 border border-white/20 text-white/60 font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-white/50 hover:text-white transition-colors"
          >
            Retour au Grade
          </Link>
          {process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && (
            <NextLink
              href="/client/login"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              Accéder à mon espace
            </NextLink>
          )}
        </div>
      </div>
    </main>
  )
}
