import Link from 'next/link'
import { TrendingUp, ArrowUpRight } from 'lucide-react'
import { CLUSTER_LABELS_FR, type CifsoValuation, type ClusterKey } from '@/lib/cifsoValuation'

const eur = (n: number) => new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const pct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)} %`

/**
 * Valorisation indicative CIFSO : multiples de marché du cluster ajustés par le score
 * global et par chacune des cinq dimensions. Affichée à l'admin (après publication) et
 * au client (fiche dossier, grade publié uniquement). Jamais sur la page publique.
 */
export default function ValuationPanel({ v, admin = false, valuationIndexHref }: { v: CifsoValuation; admin?: boolean; valuationIndexHref?: string }) {
  const confCls = v.confidence === 'high' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : v.confidence === 'medium' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-gray-600 bg-gray-50 border-gray-200'
  const cluster = CLUSTER_LABELS_FR[v.cluster as ClusterKey] ?? v.cluster

  return (
    <div className={`border p-6 ${admin ? 'mt-6 bg-white border-gray-200' : 'bg-white border-gray-200 mb-6'}`}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-ag-navy" />
            <p className="font-sans font-bold text-gray-900 text-[14px]">Valorisation indicative CIFSO</p>
          </div>
          <p className="font-sans text-[11px] text-gray-500">
            Conclusion chiffrée du grade : multiples de marché européens de l'industrie <strong>{cluster}</strong>, ajustés par le score CIFSO et par chacune des cinq dimensions. Indicative, non contractuelle.
          </p>
        </div>
        <span className={`rounded-lg shrink-0 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${confCls}`}>
          Confiance {v.confidence === 'high' ? 'élevée' : v.confidence === 'medium' ? 'moyenne' : 'faible'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg bg-ag-off-white border border-gray-200 px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Fourchette basse</p>
          <p className="font-sans font-bold text-gray-900 text-[18px]">{eur(v.value.low)}</p>
          <p className="font-mono text-[10px] text-gray-500">{v.multiple.low}x revenu récurrent</p>
        </div>
        <div className="rounded-lg bg-ag-navy text-white px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/50 mb-1">Point médian</p>
          <p className="font-sans font-bold text-ag-apex text-[22px]">{eur(v.value.mid)}</p>
          <p className="font-mono text-[10px] text-white/60">{v.multiple.mid}x revenu récurrent</p>
        </div>
        <div className="rounded-lg bg-ag-off-white border border-gray-200 px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Fourchette haute</p>
          <p className="font-sans font-bold text-gray-900 text-[18px]">{eur(v.value.high)}</p>
          <p className="font-mono text-[10px] text-gray-500">{v.multiple.high}x revenu récurrent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Construction du multiple</p>
          <dl className="text-[12px] text-gray-700 flex flex-col gap-1">
            <div className="flex justify-between"><dt>Base de revenu récurrent</dt><dd className="font-mono">{eur(v.basis.arr)}</dd></div>
            <div className="flex justify-between"><dt>Multiple de marché, industrie {cluster}</dt><dd className="font-mono">{v.market.evRevenueLow}x à {v.market.evRevenueHigh}x</dd></div>
            <div className="flex justify-between"><dt>Coefficient CIFSO global</dt><dd className="font-mono">× {v.globalCoeff.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt>Ajustement des cinq dimensions</dt><dd className="font-mono">{pct(v.dimensionAdjustmentPct)}</dd></div>
            {v.valueEbitda && <div className="flex justify-between"><dt>Contrôle EV/EBITDA</dt><dd className="font-mono">{eur(v.valueEbitda.low)} à {eur(v.valueEbitda.high)}</dd></div>}
          </dl>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Impact de chaque dimension et potentiel à 16/20</p>
          <div className="flex flex-col gap-1.5">
            {v.impacts.map(i => (
              <div key={i.dimension} className="flex items-center gap-3 text-[12px]">
                <span className="w-5 font-sans font-bold text-ag-navy">{i.letter}</span>
                <span className="w-10 font-mono text-gray-500">{i.score}/20</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                  <div className={`absolute top-0 h-full ${i.adjustmentPct >= 0 ? 'bg-ag-apex left-1/2' : 'bg-amber-400 right-1/2'}`} style={{ width: `${Math.min(50, Math.abs(i.adjustmentPct) * 5)}%` }} />
                </div>
                <span className={`w-14 text-right font-mono ${i.adjustmentPct >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>{pct(i.adjustmentPct)}</span>
                <span className="w-24 text-right font-mono text-gray-500">{i.upliftTo16Mid > 0 ? `+${eur(i.upliftTo16Mid)}` : '·'}</span>
              </div>
            ))}
          </div>
          {v.upliftTotalMid > 0 && (
            <p className="font-sans text-[11px] text-gray-600 mt-2">
              Potentiel de la feuille de route : <strong>+{eur(v.upliftTotalMid)}</strong> au point médian si chaque dimension atteint 16/20.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <p className="font-sans text-[11px] text-gray-500">
          {v.confidenceNote}{v.market.referencePeriod ? ` Référence de marché : ${v.market.referencePeriod}${v.market.sampleSize ? `, ${v.market.sampleSize} transactions` : ''}.` : ''}
        </p>
        {valuationIndexHref && (
          <Link href={valuationIndexHref} className="rounded-lg shrink-0 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-3 py-1.5 hover:bg-ag-navy hover:text-white transition-colors">
            Affiner avec le CIFSO Valuation Index <ArrowUpRight size={11} />
          </Link>
        )}
      </div>
    </div>
  )
}
