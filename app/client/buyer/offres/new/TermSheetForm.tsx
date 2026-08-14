'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, SendHorizonal, ChevronDown, ChevronUp, Info } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Structure = 'asset_deal' | 'share_deal' | 'merger' | 'earnout_only' | 'mixed'

type Props = {
  assetId: string
  assetName: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STRUCTURE_LABELS: Record<Structure, string> = {
  share_deal:    'Cession de titres (Share Deal)',
  asset_deal:    'Cession d\'actifs (Asset Deal)',
  merger:        'Fusion',
  earnout_only:  'Earnout exclusif',
  mixed:         'Structure mixte',
}

function SectionToggle({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className="flex items-center justify-between w-full bg-gray-50 border border-gray-200 px-5 py-3 hover:bg-gray-100 transition-colors group">
      <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-gray-900">{label}</span>
      {open ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
    </button>
  )
}

function FieldLabel({ children, required, hint }: { children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <label className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">
      {children}{required && <span className="text-red-400">*</span>}
      {hint && (
        <span className="group relative cursor-help ml-1">
          <Info size={10} className="text-gray-300 group-hover:text-gray-500" />
          <span className="hidden group-hover:block absolute left-4 top-0 z-10 w-56 bg-gray-900 text-white font-sans text-[11px] p-2.5 leading-relaxed shadow-lg">
            {hint}
          </span>
        </span>
      )}
    </label>
  )
}

const INPUT = "w-full bg-white border border-gray-300 px-4 py-2.5 font-mono text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-ag-navy transition-colors"
const TEXTAREA = `${INPUT} resize-none`

// ── Composant principal ───────────────────────────────────────────────────────

export default function TermSheetForm({ assetId, assetName }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Prix & structure
  const [price, setPrice] = useState('')
  const [structure, setStructure] = useState<Structure>('share_deal')
  const [priceComment, setPriceComment] = useState('')

  // ── Earnout
  const [showEarnout, setShowEarnout] = useState(false)
  const [earnoutIncluded, setEarnoutIncluded] = useState(false)
  const [earnoutPct, setEarnoutPct] = useState('')
  const [earnoutMonths, setEarnoutMonths] = useState('')
  const [earnoutKpi, setEarnoutKpi] = useState('')
  const [earnoutCap, setEarnoutCap] = useState('')

  // ── Management
  const [showMgmt, setShowMgmt] = useState(false)
  const [mgmtIncluded, setMgmtIncluded] = useState(false)
  const [mgmtMonths, setMgmtMonths] = useState('')
  const [mgmtComp, setMgmtComp] = useState('')
  const [mgmtRole, setMgmtRole] = useState('')

  // ── Non-concurrence
  const [showNonCompete, setShowNonCompete] = useState(false)
  const [ncIncluded, setNcIncluded] = useState(false)
  const [ncMonths, setNcMonths] = useState('')
  const [ncScope, setNcScope] = useState('')
  const [ncPenalty, setNcPenalty] = useState('')

  // ── Garanties
  const [showWarranties, setShowWarranties] = useState(false)
  const [wRetentionPct, setWRetentionPct] = useState('')
  const [wRetentionMonths, setWRetentionMonths] = useState('')
  const [wRwiInsurance, setWRwiInsurance] = useState(false)
  const [wCapPct, setWCapPct] = useState('')

  // ── Processus
  const [showProcess, setShowProcess] = useState(true)
  const [ddDays, setDdDays] = useState('60')
  const [closingWeeks, setClosingWeeks] = useState('12')
  const [conditions, setConditions] = useState('')
  const [buyerNote, setBuyerNote] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ''))
    if (!parsedPrice || parsedPrice <= 0) {
      setError('Veuillez saisir un montant valide.')
      return
    }

    const payload = {
      asset_id: assetId,
      proposed_price_chf: parsedPrice,
      structure,
      price_comment: priceComment || undefined,

      earnout: earnoutIncluded ? {
        included: true,
        percentage:      earnoutPct    ? parseFloat(earnoutPct)    : undefined,
        duration_months: earnoutMonths ? parseInt(earnoutMonths)   : undefined,
        kpi:             earnoutKpi    || undefined,
        cap_chf:         earnoutCap    ? parseFloat(earnoutCap)    : undefined,
      } : undefined,

      management_contract: mgmtIncluded ? {
        included: true,
        duration_months:  mgmtMonths ? parseInt(mgmtMonths)  : undefined,
        compensation_chf: mgmtComp   ? parseFloat(mgmtComp) : undefined,
        role:             mgmtRole   || undefined,
      } : undefined,

      non_compete: ncIncluded ? {
        included: true,
        duration_months:  ncMonths  ? parseInt(ncMonths)  : undefined,
        geographic_scope: ncScope   || undefined,
        penalty_chf:      ncPenalty ? parseFloat(ncPenalty) : undefined,
      } : undefined,

      warranties: (wRetentionPct || wRetentionMonths || wCapPct) ? {
        warranty_retention_pct:    wRetentionPct    ? parseFloat(wRetentionPct)    : undefined,
        retention_duration_months: wRetentionMonths ? parseInt(wRetentionMonths)   : undefined,
        rep_and_warranty_insurance: wRwiInsurance,
        indemnity_cap_pct:         wCapPct          ? parseFloat(wCapPct)          : undefined,
      } : undefined,

      dd_duration_days: ddDays     ? parseInt(ddDays)     : undefined,
      closing_weeks:    closingWeeks ? parseInt(closingWeeks) : undefined,
      conditions_precedent: conditions
        ? conditions.split('\n').map(s => s.trim()).filter(Boolean)
        : undefined,
      buyer_profile_note: buyerNote || undefined,
    }

    setLoading(true)
    try {
      const res = await fetch('/api/buyer/term-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la soumission.')
      router.push(`/client/buyer/propositions/${json.id}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* ── 1. Prix & structure ── */}
      <div className="bg-white border border-gray-200 p-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-5">01 — Prix & structure de cession</p>

        <div className="flex flex-col gap-4">
          <div>
            <FieldLabel required hint="Valorisation indicative en CHF. Non contractuelle à ce stade.">
              Prix proposé (CHF)
            </FieldLabel>
            <input type="number" min="0" step="1000" required value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="ex. 2 500 000"
              className={INPUT} />
            <p className="font-sans text-[11px] text-gray-400 mt-1.5">Non-engageant. La transaction sera formalisée dans un protocole signé.</p>
          </div>

          <div>
            <FieldLabel required hint="La structure légale préférée pour la cession.">
              Structure de cession
            </FieldLabel>
            <select value={structure} onChange={e => setStructure(e.target.value as Structure)}
              className={INPUT}>
              {(Object.entries(STRUCTURE_LABELS) as [Structure, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel hint="Contexte de votre valorisation : méthode utilisée, hypothèses, ajustements envisagés.">
              Commentaire sur le prix (optionnel)
            </FieldLabel>
            <textarea rows={2} value={priceComment} onChange={e => setPriceComment(e.target.value)}
              placeholder="Ex. Multiple 3.5x ARR basé sur croissance T1 2026. Ajustement possible selon audit comptable."
              className={TEXTAREA} />
          </div>
        </div>
      </div>

      {/* ── 2. Earnout ── */}
      <div>
        <SectionToggle label="02 — Clause d'earnout" open={showEarnout} onToggle={() => setShowEarnout(o => !o)} />
        {showEarnout && (
          <div className="border border-t-0 border-gray-200 p-6 flex flex-col gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={earnoutIncluded} onChange={e => setEarnoutIncluded(e.target.checked)}
                className="w-4 h-4 accent-ag-navy" />
              <span className="font-sans text-[13px] text-gray-700">Inclure une clause d&apos;earnout dans ma proposition</span>
            </label>
            {earnoutIncluded && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel hint="Part du prix total soumise à l'earnout (%).">Part earnout (%)</FieldLabel>
                  <input type="number" min="1" max="100" value={earnoutPct} onChange={e => setEarnoutPct(e.target.value)}
                    placeholder="ex. 20" className={INPUT} />
                </div>
                <div>
                  <FieldLabel hint="Durée de la période d'earnout en mois.">Durée (mois)</FieldLabel>
                  <input type="number" min="6" max="60" value={earnoutMonths} onChange={e => setEarnoutMonths(e.target.value)}
                    placeholder="ex. 24" className={INPUT} />
                </div>
                <div className="col-span-2">
                  <FieldLabel hint="KPI déclencheur de l'earnout (ex. ARR > 1.5M CHF à 24 mois).">KPI déclencheur</FieldLabel>
                  <input type="text" value={earnoutKpi} onChange={e => setEarnoutKpi(e.target.value)}
                    placeholder="ex. ARR > 1.5M CHF à 24 mois post-closing" className={INPUT} />
                </div>
                <div>
                  <FieldLabel hint="Montant maximum de l'earnout en CHF.">Plafond earnout (CHF)</FieldLabel>
                  <input type="number" min="0" value={earnoutCap} onChange={e => setEarnoutCap(e.target.value)}
                    placeholder="ex. 500 000" className={INPUT} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. Management ── */}
      <div>
        <SectionToggle label="03 — Reprise de management / transition" open={showMgmt} onToggle={() => setShowMgmt(o => !o)} />
        {showMgmt && (
          <div className="border border-t-0 border-gray-200 p-6 flex flex-col gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={mgmtIncluded} onChange={e => setMgmtIncluded(e.target.checked)}
                className="w-4 h-4 accent-ag-navy" />
              <span className="font-sans text-[13px] text-gray-700">Souhaite un contrat de management / transition avec le cédant</span>
            </label>
            {mgmtIncluded && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Durée (mois)</FieldLabel>
                  <input type="number" min="1" max="36" value={mgmtMonths} onChange={e => setMgmtMonths(e.target.value)}
                    placeholder="ex. 12" className={INPUT} />
                </div>
                <div>
                  <FieldLabel hint="Rémunération annuelle brute souhaitée en CHF.">Compensation annuelle (CHF)</FieldLabel>
                  <input type="number" min="0" value={mgmtComp} onChange={e => setMgmtComp(e.target.value)}
                    placeholder="ex. 120 000" className={INPUT} />
                </div>
                <div className="col-span-2">
                  <FieldLabel>Rôle souhaité</FieldLabel>
                  <input type="text" value={mgmtRole} onChange={e => setMgmtRole(e.target.value)}
                    placeholder="ex. Directeur technique / Conseil stratégique" className={INPUT} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 4. Non-concurrence ── */}
      <div>
        <SectionToggle label="04 — Clause de non-concurrence" open={showNonCompete} onToggle={() => setShowNonCompete(o => !o)} />
        {showNonCompete && (
          <div className="border border-t-0 border-gray-200 p-6 flex flex-col gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={ncIncluded} onChange={e => setNcIncluded(e.target.checked)}
                className="w-4 h-4 accent-ag-navy" />
              <span className="font-sans text-[13px] text-gray-700">Inclure une clause de non-concurrence</span>
            </label>
            {ncIncluded && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Durée (mois)</FieldLabel>
                  <input type="number" min="6" max="60" value={ncMonths} onChange={e => setNcMonths(e.target.value)}
                    placeholder="ex. 36" className={INPUT} />
                </div>
                <div>
                  <FieldLabel>Périmètre géographique</FieldLabel>
                  <input type="text" value={ncScope} onChange={e => setNcScope(e.target.value)}
                    placeholder="ex. Europe occidentale" className={INPUT} />
                </div>
                <div>
                  <FieldLabel hint="Pénalité contractuelle en cas de violation (CHF).">Pénalité (CHF)</FieldLabel>
                  <input type="number" min="0" value={ncPenalty} onChange={e => setNcPenalty(e.target.value)}
                    placeholder="ex. 300 000" className={INPUT} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 5. Garanties ── */}
      <div>
        <SectionToggle label="05 — Garanties & représentations" open={showWarranties} onToggle={() => setShowWarranties(o => !o)} />
        {showWarranties && (
          <div className="border border-t-0 border-gray-200 p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel hint="% du prix séquestré comme garantie post-closing.">Rétention garantie (%)</FieldLabel>
                <input type="number" min="0" max="30" value={wRetentionPct} onChange={e => setWRetentionPct(e.target.value)}
                  placeholder="ex. 10" className={INPUT} />
              </div>
              <div>
                <FieldLabel>Durée de rétention (mois)</FieldLabel>
                <input type="number" min="6" max="36" value={wRetentionMonths} onChange={e => setWRetentionMonths(e.target.value)}
                  placeholder="ex. 18" className={INPUT} />
              </div>
              <div>
                <FieldLabel hint="Plafond d'indemnisation en % du prix de cession.">Plafond d&apos;indemnisation (%)</FieldLabel>
                <input type="number" min="0" max="100" value={wCapPct} onChange={e => setWCapPct(e.target.value)}
                  placeholder="ex. 30" className={INPUT} />
              </div>
              <div className="flex items-center mt-5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={wRwiInsurance} onChange={e => setWRwiInsurance(e.target.checked)}
                    className="w-4 h-4 accent-ag-navy" />
                  <span className="font-sans text-[12px] text-gray-700">Assurance R&W envisagée</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 6. Processus ── */}
      <div>
        <SectionToggle label="06 — Processus & conditions" open={showProcess} onToggle={() => setShowProcess(o => !o)} />
        {showProcess && (
          <div className="border border-t-0 border-gray-200 p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel hint="Durée souhaitée pour la due diligence (jours ouvrables).">Durée due diligence (jours)</FieldLabel>
                <input type="number" min="14" max="180" value={ddDays} onChange={e => setDdDays(e.target.value)}
                  placeholder="60" className={INPUT} />
              </div>
              <div>
                <FieldLabel hint="Délai souhaitée entre signing et closing (semaines).">Délai closing (semaines)</FieldLabel>
                <input type="number" min="4" max="52" value={closingWeeks} onChange={e => setClosingWeeks(e.target.value)}
                  placeholder="12" className={INPUT} />
              </div>
            </div>
            <div>
              <FieldLabel hint="Listez une condition par ligne (ex. financement confirmé, validation actionnaire).">
                Conditions suspensives (une par ligne)
              </FieldLabel>
              <textarea rows={3} value={conditions} onChange={e => setConditions(e.target.value)}
                placeholder={"Obtention du financement bancaire\nValidation du conseil d'administration\nAudit technique sans anomalie majeure"}
                className={TEXTAREA} />
            </div>
            <div>
              <FieldLabel hint="Présentez brièvement votre profil, votre expérience dans le secteur et vos intentions pour l'actif.">
                Présentation de l&apos;acquéreur (optionnel)
              </FieldLabel>
              <textarea rows={4} value={buyerNote} onChange={e => setBuyerNote(e.target.value)}
                placeholder={`Présentez votre profil d'acquéreur, votre expérience sectorielle et votre vision pour ${assetName}.`}
                className={TEXTAREA} />
              <p className="font-sans text-[11px] text-gray-400 mt-1">{buyerNote.length}/1000 caractères</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Notice légale ── */}
      <div className="bg-ag-navy/5 border border-ag-navy/20 px-5 py-4">
        <p className="font-sans text-[11px] text-gray-600 leading-relaxed">
          Cette term sheet est une <strong>proposition structurée non-engageante</strong>. Elle sera examinée par l&apos;équipe Aegryn et transmise au cédant de façon anonymisée.
          Le cédant dispose de <strong>72h pour répondre</strong>. En cas d&apos;acceptation, Aegryn coordonne la formalisation du protocole de cession.
        </p>
      </div>

      {/* ── Erreur ── */}
      {error && (
        <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5">{error}</p>
      )}

      {/* ── Submit ── */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? <Loader2 size={12} className="animate-spin" /> : <SendHorizonal size={12} />}
          Soumettre la Term Sheet
        </button>
        <p className="font-sans text-[11px] text-gray-400">
          En soumettant, vous confirmez avoir lu les conditions de confidentialité Aegryn.
        </p>
      </div>
    </form>
  )
}
