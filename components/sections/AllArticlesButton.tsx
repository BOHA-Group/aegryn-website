import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'

/** Bouton « Voir tous les articles » : même gabarit sur l'accueil du cabinet et sur celui de La Boutique. */
export function AllArticlesButton({ label, className = 'inline-flex' }: { label: string; className?: string }) {
  return (
    <Link
      href="/blog"
      className={`${className} items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border px-5 py-3 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300 rounded-lg`}
    >
      {label} <ArrowUpRight size={12} />
    </Link>
  )
}
