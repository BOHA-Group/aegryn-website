'use client'

import { useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { FRANCHIR_UI } from '@/content/franchir/ui'
import type { CycleSlug } from '@/content/franchir/types'

interface IntroQuestion {
  q:     string
  cycle: CycleSlug
}

interface Props {
  title:      string
  questions:  IntroQuestion[]
  /** Titres des cycles pour le lien « Voir ce cycle » */
  cycleTitle: Record<CycleSlug, string>
  locale:     string
}

/**
 * « Où en êtes-vous ? » — cinq questions, une par cycle de vie.
 * Une reponse « oui » renvoie vers la page du cycle concerne ;
 * rien n'est envoye ni stocke.
 */
export function FranchirDiagnostic({ title, questions, cycleTitle, locale }: Props) {
  const ui = FRANCHIR_UI[locale] ?? FRANCHIR_UI.fr
  const [open, setOpen] = useState(false)
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => questions.map(() => null))
  const set = (i: number, v: boolean) => setAnswers(prev => prev.map((a, idx) => (idx === i ? v : a)))

  return (
    <div className="bg-ag-white">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className={`w-full py-6 flex items-center gap-5 text-left group${open ? ' border-b border-ag-border' : ''}`}
      >
        <h3 className="font-sans font-bold text-[26px] text-ag-black tracking-[-0.02em] group-hover:text-ag-navy transition-colors">{title}</h3>
        <span className="flex items-center gap-2 shrink-0 translate-y-[3px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ag-gray-light group-hover:text-ag-navy transition-colors">
            {open ? ui.diagClose : ui.diagOpen}
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-ag-gray-light group-hover:text-ag-navy transition-all duration-200 ${open ? 'rotate-180' : 'animate-pulse'}`}
          />
        </span>
      </button>

      {open && (
      <ol className="divide-y divide-ag-border">
        {questions.map((item, i) => {
          const yes = answers[i] === true
          return (
            <li key={i} className="py-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="font-mono text-[10px] text-ag-gray-light tabular-nums shrink-0 w-6">{String(i + 1).padStart(2, '0')}</span>
              <p className="font-sans text-[14px] text-ag-black leading-relaxed flex-1">{item.q}</p>
              <div className="flex items-center gap-2 shrink-0" role="group" aria-label={`Question ${i + 1}`}>
                {([true, false] as const).map(v => {
                  const active = answers[i] === v
                  return (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => set(i, v)}
                      aria-pressed={active}
                      className={`rounded-full font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 border transition-colors ${
                        active
                          ? 'bg-ag-navy text-white border-ag-navy'
                          : 'bg-ag-white text-ag-gray border-ag-border hover:border-ag-navy hover:text-ag-navy'
                      }`}
                    >
                      {v ? ui.yes : ui.no}
                    </button>
                  )
                })}
                {yes && (
                  <Link
                    href={`/${locale}/franchir/${item.cycle}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ag-apex-ink hover:text-ag-navy transition-colors ml-2"
                  >
                    {ui.seeCycle} — {cycleTitle[item.cycle]} <ArrowUpRight size={11} />
                  </Link>
                )}
              </div>
            </li>
          )
        })}
      </ol>
      )}
    </div>
  )
}
