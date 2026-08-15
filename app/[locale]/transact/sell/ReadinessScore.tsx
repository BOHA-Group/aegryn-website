'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, ChevronRight, RotateCcw, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type Answer = 'yes' | 'partial' | 'no'
type Level  = 'ready' | 'almost' | 'not_ready'

const QUESTION_IDS = [
  { id: 'dataroom',           weight: 3 },
  { id: 'contracts',          weight: 2 },
  { id: 'founder_dependency', weight: 3 },
  { id: 'growth_documented',  weight: 2 },
  { id: 'ip_clean',           weight: 2 },
  { id: 'tech_debt',          weight: 1 },
] as const

const SCORE_MAX = QUESTION_IDS.reduce((s, q) => s + q.weight * 2, 0)

function scoreAnswer(answer: Answer, weight: number): number {
  if (answer === 'yes')     return weight * 2
  if (answer === 'partial') return weight * 1
  return 0
}

function getLevel(pct: number): Level {
  if (pct >= 75) return 'ready'
  if (pct >= 45) return 'almost'
  return 'not_ready'
}

const LEVEL_COLORS: Record<Level, { color: string; bg: string; border: string; icon: React.ReactNode; ctaHref: string }> = {
  ready:     { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />, ctaHref: '/transact/submit' },
  almost:    { color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: <AlertCircle  size={20} className="text-amber-600 shrink-0"  />, ctaHref: '/contact'        },
  not_ready: { color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     icon: <XCircle      size={20} className="text-red-500 shrink-0"    />, ctaHref: '/contact'        },
}

const btnCls = (v: Answer | '', current: Answer) =>
  `border px-4 py-2 font-sans text-[12px] transition-colors whitespace-nowrap ${
    v === current
      ? 'border-ag-black bg-ag-black text-white'
      : 'border-ag-border text-ag-black hover:border-ag-black'
  }`

export default function ReadinessScore() {
  const t = useTranslations('transact.sell.readiness')

  const [answers, setAnswers] = useState<Partial<Record<string, Answer>>>({})
  const [done,    setDone]    = useState(false)

  const answered = Object.keys(answers).length
  const complete  = answered === QUESTION_IDS.length

  const rawScore = Object.entries(answers).reduce((sum, [id, ans]) => {
    const q = QUESTION_IDS.find(q => q.id === id)
    return sum + (q ? scoreAnswer(ans!, q.weight) : 0)
  }, 0)
  const pct   = Math.round((rawScore / SCORE_MAX) * 100)
  const level = getLevel(pct)
  const cfg   = LEVEL_COLORS[level]

  const weakPoints = QUESTION_IDS.filter(q => answers[q.id] === 'no' || answers[q.id] === 'partial')

  function reset() {
    setAnswers({})
    setDone(false)
  }

  return (
    <div className="border border-ag-border bg-ag-white">

      {/* Header */}
      <div className="px-7 py-5 border-b border-ag-border flex items-center justify-between">
        <div>
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-0.5">{t('toolLabel')}</p>
          <h3 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em]">{t('toolTitle')}</h3>
        </div>
        {done && (
          <button onClick={reset} className="inline-flex items-center gap-1.5 font-sans text-[11px] text-ag-gray-light hover:text-ag-black transition-colors">
            <RotateCcw size={12} /> {t('restart')}
          </button>
        )}
      </div>

      {!done ? (
        <div className="px-7 py-6 flex flex-col gap-6">
          <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
            {t('intro')}
          </p>

          {QUESTION_IDS.map((q, i) => (
            <div key={q.id} className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <span className="font-mono text-[9px] text-ag-apex font-bold tracking-[0.1em] mt-0.5 shrink-0">0{i + 1}</span>
                <div className="flex-1">
                  <p className="font-sans font-semibold text-ag-black text-[13px] mb-0.5">{t(`questions.${q.id}.label`)}</p>
                  <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed mb-2">{t(`questions.${q.id}.hint`)}</p>
                  <div className="flex gap-2">
                    {(['yes', 'partial', 'no'] as Answer[]).map(ans => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: ans }))}
                        className={btnCls(answers[q.id] ?? '', ans)}
                      >
                        {ans === 'yes' ? t('answerYes') : ans === 'partial' ? t('answerPartial') : t('answerNo')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2 flex items-center justify-between">
            <span className="font-sans text-[11px] text-ag-gray-light">
              {t('progress', { answered, total: QUESTION_IDS.length })}
            </span>
            <button
              type="button"
              disabled={!complete}
              onClick={() => setDone(true)}
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-navy-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('calculateBtn')} <ChevronRight size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-7 py-6 flex flex-col gap-6">

          {/* Score visuel */}
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={level === 'ready' ? '#10b981' : level === 'almost' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeLinecap="butt"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-sans font-bold text-ag-black text-[18px]">
                {pct}%
              </span>
            </div>
            <div>
              <p className={`font-sans font-bold text-[15px] ${cfg.color} mb-1`}>{t(`levels.${level}.label`)}</p>
              <p className="font-sans text-[12px] text-ag-gray-light">
                {t('scoreLabel', { score: rawScore, max: SCORE_MAX })}
              </p>
            </div>
          </div>

          {/* Message */}
          <div className={`border ${cfg.border} ${cfg.bg} p-5 flex items-start gap-3`}>
            {cfg.icon}
            <p className="font-sans text-[12px] text-ag-black leading-relaxed">{t(`levels.${level}.message`)}</p>
          </div>

          {/* Points faibles */}
          {weakPoints.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{t('weakPoints')}</p>
              {weakPoints.map(q => (
                <div key={q.id} className="flex items-start gap-2 py-2 border-b border-ag-border/50 last:border-b-0">
                  <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${answers[q.id] === 'no' ? 'bg-red-400' : 'bg-amber-400'}`} />
                  <div>
                    <p className="font-sans font-semibold text-[12px] text-ag-black">{t(`questions.${q.id}.label`)}</p>
                    <p className="font-sans text-[11px] text-ag-gray-light">{t(`questions.${q.id}.hint`)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <Link
            href={cfg.ctaHref as '/transact/submit' | '/contact'}
            className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3.5 hover:bg-ag-navy-mid transition-colors self-start"
          >
            {t(`levels.${level}.cta`)} <ArrowUpRight size={12} />
          </Link>
        </div>
      )}
    </div>
  )
}
