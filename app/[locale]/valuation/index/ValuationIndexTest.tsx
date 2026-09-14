'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ValuationCalculator from '../ValuationCalculator'
import IndexTestView from '../IndexTestView'
import type { ValuationResult, FinanceData } from '@/lib/valuationEngine'
import type { ClusterKey } from '@/lib/cifsoValuation'

type Freemium = { estimateNote: string; illustrativeNote: string }

/* Fil d'étapes, réutilisé pour les deux phases */
function StepIndicator({ phase, t }: { phase: 'form' | 'index'; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex items-center gap-3 mt-8">
      <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border ${phase === 'form' ? 'bg-ag-apex text-ag-navy border-ag-apex font-semibold' : 'border-white/20 text-white/40'}`}>
        {t('stepLabel1')}
      </span>
      <span className="w-6 h-px bg-white/20" />
      <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border ${phase === 'index' ? 'bg-ag-apex text-ag-navy border-ag-apex font-semibold' : 'border-white/20 text-white/40'}`}>
        {t('stepLabel2')}
      </span>
    </div>
  )
}

/**
 * Parcours /valuation/index — remplace l'ancienne section « Estimation libre » de /valuation :
 *   Étape 1 : questionnaire CIFSO 5 dimensions + industrie + vertical (ValuationCalculator,
 *             qui porte son propre hero — on y injecte juste le fil d'étapes).
 *   Étape 2 : vue Index réelle mais partiellement floutée, filtres fonctionnels, position de
 *             l'utilisateur mise en évidence, CTA vert liste d'attente (IndexTestView).
 * Toutes les données de l'étape 1 sont capturées anonymement (industrie, vertical, scores,
 * métriques — jamais le nom ni l'email) pour alimenter automatiquement l'Index.
 */
export default function ValuationIndexTest() {
  const t  = useTranslations('valuation')
  const ti = useTranslations('valuation.indexTest')
  const fm = t.raw('freemium') as Freemium

  const [phase, setPhase] = useState<'form' | 'index'>('form')
  const [position, setPosition] = useState<{ industry: ClusterKey; vertical?: string; grade: string; score: number } | null>(null)

  function handleComplete(result: ValuationResult, finance: Partial<FinanceData>) {
    if (!finance.industry) return
    setPosition({ industry: finance.industry, vertical: finance.vertical, grade: result.grade.grade, score: result.scores.total })
  }

  if (phase === 'index' && position) {
    return (
      <main className="bg-ag-navy">
        <section className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-ag-apex/50 inline-block" />
              {ti('hero.label')}
            </p>
            <h1 className="font-sans font-bold text-white leading-[1.05] tracking-[-0.035em] max-w-2xl mb-6 whitespace-pre-line" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
              {ti('hero.titleStep2')}
            </h1>
            <p className="font-sans text-[14px] text-white/60 leading-relaxed max-w-xl">
              {ti('hero.descStep2')}
            </p>
            <StepIndicator phase={phase} t={ti} />
          </div>
        </section>
        <section className="pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <IndexTestView user={position} />
          </div>
        </section>
      </main>
    )
  }

  return (
    <ValuationCalculator
      freemiumNote={fm.estimateNote}
      illustrative={fm.illustrativeNote}
      onComplete={handleComplete}
      onContinue={() => setPhase('index')}
      stepIndicator={<StepIndicator phase={phase} t={ti} />}
    />
  )
}
