/** Tampon « Confidentiel » en diagonale, posé sur les visuels des fiches verrouillées. */
export function ConfidentialStamp({ label, className = '' }: { label: string; className?: string }) {
  return (
    <span
      translate="no"
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] select-none ${className}`}
    >
      <span className="block rounded-[4px] border-[3px] border-ag-grade-refused/90 px-5 py-2 font-mono text-[13px] font-bold uppercase tracking-[0.3em] text-ag-grade-refused/90 ring-1 ring-ag-grade-refused/40 ring-offset-4">
        {label}
      </span>
    </span>
  )
}
