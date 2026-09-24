/* Remplit les cellules vides de fin de grille (pattern `gap-px bg-ag-border`)
   pour éviter les zones grises visibles dans la dernière ligne.
   `cols` indique le nombre de colonnes par breakpoint (hérité si omis). */
export function GridFillers({ count, cols }: {
  count: number
  cols: { sm?: number; md?: number; lg?: number; xl?: number }
}) {
  const ranges: [number | undefined, string][] = [
    [cols.sm, 'hidden sm:block md:hidden'],
    [cols.md, 'hidden md:block lg:hidden'],
    [cols.lg, 'hidden lg:block xl:hidden'],
    [cols.xl, 'hidden xl:block'],
  ]
  let prev = 1
  const cells: React.ReactNode[] = []
  ranges.forEach(([c, cls], ri) => {
    const n = c ?? prev
    prev = n
    const fill = (n - (count % n)) % n
    for (let i = 0; i < fill; i++) {
      cells.push(<div key={`${ri}-${i}`} aria-hidden className={`${cls} bg-ag-white`} />)
    }
  })
  return <>{cells}</>
}
