'use client'

/**
 * Bouton d'action vert « Où en êtes-vous ? » : onglet fixé au bord droit de l'accueil,
 * qui ouvre au clic un panneau avec les cinq questions (une par cycle de vie).
 * Apparaît dès que le hero est dépassé ; Échap ou clic hors du panneau le ferme.
 */
import { useEffect, useState } from 'react'
import { X, HelpCircle } from 'lucide-react'
import { FranchirDiagnostic } from '@/components/franchir/FranchirDiagnostic'
import type { CycleSlug } from '@/content/franchir/types'

const CLOSE: Record<string, string> = { fr: 'Fermer', en: 'Close', de: 'Schließen', es: 'Cerrar', it: 'Chiudi', nl: 'Sluiten' }

type Props = {
  title: string
  questions: { q: string; cycle: CycleSlug }[]
  cycleTitle: Record<CycleSlug, string>
  locale: string
}

export function DiagnosticLauncher({ title, questions, cycleTitle, locale }: Props) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2 rounded-l-xl bg-ag-apex px-3 py-5 font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-ag-navy shadow-lg transition-all duration-300 hover:bg-ag-navy hover:text-white [writing-mode:vertical-rl] ${shown && !open ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'}`}
      >
        <HelpCircle size={15} className="rotate-90" aria-hidden="true" />
        {title}
      </button>

      <div
        className={`fixed inset-0 z-[60] bg-ag-navy/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed right-0 top-0 z-[61] flex h-[100dvh] w-[min(540px,100vw)] flex-col bg-ag-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between gap-4 px-6 pb-2 pt-[clamp(14px,3vh,24px)] md:px-8">
          <h2 className="font-sans font-bold tracking-[-0.02em] text-ag-black" style={{ fontSize: 'clamp(20px,3.8vh,26px)' }}>{title}</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label={CLOSE[locale] ?? 'Close'} className="flex h-9 w-9 items-center justify-center rounded-full border border-ag-border text-ag-gray transition-colors hover:border-ag-navy hover:text-ag-navy">
            <X size={16} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-12 md:px-8">
          <FranchirDiagnostic title={title} questions={questions} cycleTitle={cycleTitle} locale={locale} panel />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ag-white to-transparent" />
      </aside>
    </>
  )
}
