'use client'

/**
 * Sticker vert vertical, propre à la préinscription des pros neediu : apparaît au scroll, face à la section
 * `targetId`. Cliquable vers la page dédiée quand elle est ouverte (`href`), sinon visible mais non cliquable.
 */
import { Link } from '@/i18n/navigation'
import { UserPlus } from 'lucide-react'
import { useSideTabVisibility } from '@/components/ui/useSideTabVisibility'

type Props = { label: string; soon: string; targetId: string; href?: '/neediu/pro' }

const BASE = 'fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2 rounded-l-xl bg-ag-apex px-3 py-5 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-ag-navy shadow-lg transition-all duration-300 [writing-mode:vertical-rl]'

export function ProSideTab({ label, soon, targetId, href }: Props) {
  const shown = useSideTabVisibility(targetId, 'within')
  const state = shown ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'
  const content = (
    <>
      <UserPlus size={15} className="rotate-90" aria-hidden="true" />
      {label}
      <span className="rounded-full bg-ag-navy/10 px-1.5 py-2 text-[9px] tracking-[0.16em]">{soon}</span>
    </>
  )
  if (!href) {
    return <span role="note" aria-disabled="true" className={`${BASE} cursor-default select-none ${shown ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} pointer-events-none`}>{content}</span>
  }
  return (
    <Link href={href} aria-hidden={!shown} tabIndex={shown ? 0 : -1} className={`${BASE} hover:bg-ag-navy hover:text-white ${state}`}>
      {content}
    </Link>
  )
}
