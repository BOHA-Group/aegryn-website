import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import type { WorkflowProgress } from '@/lib/certificationWorkflow'

/**
 * Bandeau étape par étape : où en est le dossier, que faire maintenant.
 * Commun admin / client / expert (le contenu des étapes dépend du rôle, calculé côté serveur).
 */
export default function WorkflowStepper({ progress, title, dark = false }: { progress: WorkflowProgress; title?: string; dark?: boolean }) {
  const { steps, currentIndex } = progress
  const current = steps[currentIndex]
  const cls = dark
    ? { wrap: 'bg-ag-navy text-white border-white/10', muted: 'text-white/50', line: 'bg-white/15', done: 'bg-ag-apex text-ag-navy', cur: 'bg-white text-ag-navy ring-4 ring-ag-apex/40', todo: 'bg-white/10 text-white/50', box: 'bg-white/5 border-white/10' }
    : { wrap: 'bg-white text-gray-900 border-gray-200', muted: 'text-gray-500', line: 'bg-gray-200', done: 'bg-ag-apex text-ag-navy', cur: 'bg-ag-navy text-white ring-4 ring-ag-apex/30', todo: 'bg-gray-100 text-gray-400', box: 'bg-ag-off-white border-gray-200' }

  return (
    <section className={`rounded-xl border p-5 md:p-6 mb-6 ${cls.wrap}`}>
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className={`font-mono text-[10px] tracking-[0.22em] uppercase ${cls.muted}`}>
          {title ?? (progress.dossierType === 'certification' ? 'Parcours de certification CIFSO 5000' : 'Parcours du dossier')}
        </p>
        <p className={`font-mono text-[10px] tracking-[0.18em] uppercase ${cls.muted}`}>Étape {currentIndex + 1} / {steps.length}</p>
      </div>

      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => (
          <li key={s.key} className="relative flex flex-col items-center text-center">
            {i < steps.length - 1 && <span className={`absolute top-3.5 left-1/2 w-full h-px ${cls.line}`} />}
            <span className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${s.state === 'done' ? cls.done : s.state === 'current' ? cls.cur : cls.todo}`}>
              {s.state === 'done' ? <Check size={13} /> : i + 1}
            </span>
            <span className={`mt-2 font-sans text-[10px] md:text-[11px] leading-tight ${s.state === 'current' ? 'font-semibold' : s.state === 'done' ? cls.muted : cls.muted}`}>{s.label}</span>
          </li>
        ))}
      </ol>

      {current && (
        <div className={`mt-5 rounded-lg border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cls.box}`}>
          <p className="font-sans text-[13px] leading-relaxed">
            <span className="font-semibold">{current.label}.</span> {current.desc}
          </p>
          {current.href && current.cta && (
            <Link href={current.href} className="rounded-lg shrink-0 inline-flex items-center gap-1.5 bg-ag-apex text-ag-navy font-mono text-[10px] uppercase tracking-widest px-3.5 py-2 hover:bg-ag-apex/90 transition-colors">
              {current.cta} <ArrowRight size={11} />
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
