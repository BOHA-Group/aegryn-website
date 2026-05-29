import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-ag-apex mb-4">404</p>
      <h1 className="font-display text-5xl font-black tracking-tighter text-ag-black mb-4">
        Page introuvable
      </h1>
      <p className="text-sm text-ag-gray mb-10">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-ag-apex px-6 py-3 font-display text-sm font-bold text-ag-navy transition-all hover:bg-ag-black hover:text-white"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  )
}
