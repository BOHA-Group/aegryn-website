'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import type { DiagnosticLevel, DiagnosticQuestion } from '@/content/advisory/types'

interface Props {
  title:     string
  intro:     string
  questions: DiagnosticQuestion[]
  levels:    DiagnosticLevel[]
  privacy:   string
  ctaLabel:  string
  ctaHref:   string
}

/**
 * Auto-diagnostic à cinq questions (oui / non). Résultat calculé côté client,
 * aucune donnée n'est envoyée ni stockée : le CTA renvoie vers le formulaire
 * de contact pour celles et ceux qui souhaitent aller plus loin.
 */
export function AdvisoryDiagnostic({ title, intro, questions, levels, privacy, ctaLabel, ctaHref }: Props) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => questions.map(() => null))
  const answered = answers.every(a => a !== null)
  const yesCount = answers.filter(Boolean).length

  const level = useMemo(() => {
    if (!answered) return null
    return [...levels].sort((a, b) => b.min - a.min).find(l => yesCount >= l.min) ?? levels[0]
  }, [answered, yesCount, levels])

  const set = (i: number, v: boolean) => setAnswers(prev => prev.map((a, idx) => (idx === i ? v : a)))
  const reset = () => setAnswers(questions.map(() => null))

  return (
    <div className="border border-ag-border bg-white">
      <div className="px-6 md:px-10 py-8 border-b border-ag-border">
        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-apex-ink mb-3">Auto-diagnostic</p>
        <h3 className="font-sans font-bold text-[24px] text-ag-navy tracking-[-0.01em] mb-2">{title}</h3>
        <p className="text-[14px] text-ag-gray leading-relaxed max-w-2xl">{intro}</p>
      </div>

      <ol className="divide-y divide-ag-border">
        {questions.map((item, i) => (
          <li key={i} className="px-6 md:px-10 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="font-sans font-semibold text-[11px] text-ag-gray-light tabular-nums shrink-0 w-6">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-[14px] text-ag-black leading-relaxed flex-1">{item.q}</p>
            <div className="flex gap-2 shrink-0" role="group" aria-label={`Question ${i + 1}`}>
              {([true, false] as const).map(v => {
                const active = answers[i] === v
                return (
                  <button
                    key={String(v)}
                    type="button"
                    onClick={() => set(i, v)}
                    aria-pressed={active}
                    className={`rounded-lg font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-4 py-2 border transition-colors ${
                      active
                        ? 'bg-ag-navy text-white border-ag-navy'
                        : 'bg-white text-ag-gray border-ag-border hover:border-ag-navy hover:text-ag-navy'
                    }`}
                  >
                    {v ? 'Oui' : 'Non'}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="px-6 md:px-10 py-8 bg-ag-cream border-t border-ag-border">
        {level ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="font-sans font-bold text-[11px] uppercase tracking-[0.2em] text-ag-apex-ink">{yesCount} / {questions.length} oui</span>
              <span className="font-sans font-bold text-[26px] text-ag-navy tracking-[-0.01em]">{level.label}</span>
            </div>
            <p className="text-[14px] text-ag-gray leading-relaxed max-w-2xl">{level.desc}</p>
            <div className="border-l-2 border-ag-apex pl-5">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-1">Prochaine action</p>
              <p className="text-[14px] text-ag-black leading-relaxed max-w-2xl">{level.nextAction}</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Link
                href={ctaHref}
                className="rounded-lg inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-3.5 hover:bg-ag-black transition-colors"
              >
                {ctaLabel} <ArrowUpRight size={13} />
              </Link>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 font-sans text-[12px] text-ag-gray hover:text-ag-navy transition-colors">
                <RotateCcw size={12} /> Recommencer
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-ag-gray-light">
            {answers.filter(a => a !== null).length} / {questions.length} réponses. Le résultat s’affiche une fois les cinq questions renseignées.
          </p>
        )}
        <p className="text-[11px] text-ag-gray-light leading-relaxed mt-6 max-w-2xl">{privacy}</p>
      </div>
    </div>
  )
}
