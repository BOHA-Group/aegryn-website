'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import type { DiagnosticLevel, DiagnosticQuestion } from '@/content/advisory/types'
import { ADVISORY_UI } from '@/content/advisory/ui'

interface Props {
  title:     string
  intro:     string
  questions: DiagnosticQuestion[]
  levels:    DiagnosticLevel[]
  privacy:   string
  ctaLabel:  string
  ctaHref:   string
  locale:    string
}

/**
 * Auto-diagnostic à cinq questions (oui / non). Résultat calculé côté client,
 * aucune donnée n'est envoyée ni stockée : le CTA renvoie vers le formulaire
 * de contact pour celles et ceux qui souhaitent aller plus loin.
 */
export function AdvisoryDiagnostic({ title, intro, questions, levels, privacy, ctaLabel, ctaHref, locale }: Props) {
  const ui = ADVISORY_UI[locale] ?? ADVISORY_UI.fr
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => questions.map(() => null))
  const answered = answers.every(a => a !== null)
  /* Score de reponses favorables : 'yes' par defaut, 'no' quand goodIf est 'no' */
  const favorable = useMemo(
    () => questions.reduce((n, q, i) => n + (answers[i] === (q.goodIf !== 'no') ? 1 : 0), 0),
    [answers, questions],
  )

  const level = useMemo(() => {
    if (!answered) return null
    return [...levels].sort((a, b) => b.min - a.min).find(l => favorable >= l.min) ?? levels[0]
  }, [answered, favorable, levels])

  const set = (i: number, v: boolean) => setAnswers(prev => prev.map((a, idx) => (idx === i ? v : a)))
  const reset = () => setAnswers(questions.map(() => null))

  return (
    <div className="rounded-2xl border border-ag-border bg-ag-white overflow-hidden">
      <div className="px-6 md:px-10 py-8 border-b border-ag-border">
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">{ui.autoDiag}</p>
        <h3 className="font-sans font-bold text-[26px] text-ag-black tracking-[-0.02em] mb-2">{title}</h3>
        <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl">{intro}</p>
      </div>

      <ol className="divide-y divide-ag-border">
        {questions.map((item, i) => (
          <li key={i} className="px-6 md:px-10 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="font-mono text-[10px] text-ag-gray-light tabular-nums shrink-0 w-6">{String(i + 1).padStart(2, '0')}</span>
            <p className="font-sans text-[14px] text-ag-black leading-relaxed flex-1">{item.q}</p>
            <div className="flex gap-2 shrink-0" role="group" aria-label={`${ui.question} ${i + 1}`}>
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
            </div>
          </li>
        ))}
      </ol>

      <div className="px-6 md:px-10 py-8 bg-ag-off-white border-t border-ag-border">
        {level ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-apex-ink">{ui.favCount(favorable, questions.length)}</span>
              <span className="font-sans font-bold text-[26px] text-ag-black tracking-[-0.02em]">{level.label}</span>
            </div>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl">{level.desc}</p>
            <div className="rounded-2xl bg-ag-white border border-ag-border p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ag-apex-ink mb-2">{ui.nextAction}</p>
              <p className="font-sans text-[15px] text-ag-black leading-relaxed max-w-2xl">{level.nextAction}</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Link
                href={ctaHref}
                className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-black transition-colors"
              >
                {ctaLabel} <ArrowUpRight size={13} />
              </Link>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 font-sans text-[12px] text-ag-gray hover:text-ag-navy transition-colors">
                <RotateCcw size={12} /> {ui.restart}
              </button>
            </div>
          </div>
        ) : (
          <p className="font-sans text-[13px] text-ag-gray-light">
            {ui.progress(answers.filter(a => a !== null).length, questions.length)}
          </p>
        )}
        <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed mt-6 max-w-2xl">{privacy}</p>
      </div>
    </div>
  )
}
