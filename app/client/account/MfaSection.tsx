'use client'

import { useEffect, useState } from 'react'
import { Loader2, CheckCircle2, ShieldCheck, ShieldOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Factor = { id: string; friendly_name?: string | null; factor_type: string; status: string }

export default function MfaSection() {
  const [loading,     setLoading]     = useState(true)
  const [factor,      setFactor]      = useState<Factor | null>(null)

  /* Enrollment en cours */
  const [enrolling,   setEnrolling]   = useState(false)
  const [factorId,    setFactorId]    = useState<string | null>(null)
  const [qrCode,      setQrCode]      = useState<string | null>(null)
  const [secret,      setSecret]      = useState<string | null>(null)
  const [code,        setCode]        = useState('')

  const [busy,        setBusy]        = useState(false)
  const [error,        setError]      = useState('')
  const [success,      setSuccess]    = useState('')

  async function loadFactors() {
    setLoading(true)
    const { data, error: err } = await supabase.auth.mfa.listFactors()
    if (!err) {
      const verified = data?.totp?.find(f => f.status === 'verified') ?? null
      setFactor(verified as Factor | null)
    }
    setLoading(false)
  }

  useEffect(() => { loadFactors() }, [])

  async function startEnrollment() {
    setError('')
    setSuccess('')
    setBusy(true)
    const { data, error: err } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
    setBusy(false)
    if (err || !data) {
      setError(err?.message ?? 'Impossible de démarrer l\u2019activation.')
      return
    }
    setFactorId(data.id)
    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setEnrolling(true)
  }

  async function confirmEnrollment(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId || code.length !== 6) return
    setError('')
    setBusy(true)
    const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeErr || !challenge) {
      setBusy(false)
      setError(challengeErr?.message ?? 'Erreur lors de la vérification.')
      return
    }
    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })
    setBusy(false)
    if (verifyErr) {
      setError('Code invalide. Vérifiez votre application d\u2019authentification.')
      return
    }
    setEnrolling(false)
    setCode('')
    setQrCode(null)
    setSecret(null)
    setSuccess('Double authentification activée.')
    await loadFactors()
  }

  async function cancelEnrollment() {
    if (factorId) await supabase.auth.mfa.unenroll({ factorId })
    setEnrolling(false)
    setFactorId(null)
    setQrCode(null)
    setSecret(null)
    setCode('')
  }

  async function disableMfa() {
    if (!factor) return
    if (!window.confirm('Désactiver la double authentification ? Votre compte sera moins protégé.')) return
    setError('')
    setBusy(true)
    const { error: err } = await supabase.auth.mfa.unenroll({ factorId: factor.id })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setSuccess('Double authentification désactivée.')
    setFactor(null)
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 p-5 mt-4 flex items-center gap-2 text-gray-400">
        <Loader2 size={14} className="animate-spin" />
        <span className="font-sans text-[12px]">Chargement…</span>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 p-5 mt-4">
      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">
        Double authentification (MFA)
      </p>

      {error && (
        <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5 mb-4">{error}</p>
      )}
      {success && (
        <div className="flex items-center gap-2 text-emerald-600 mb-4">
          <CheckCircle2 size={14} />
          <span className="font-sans text-[12px]">{success}</span>
        </div>
      )}

      {!enrolling && factor && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-sans text-[13px] text-gray-700">Activée</p>
              <p className="font-sans text-[11px] text-gray-400 mt-0.5">
                Application d&apos;authentification (TOTP) — un code à 6 chiffres est demandé à chaque connexion.
              </p>
            </div>
          </div>
          <button
            onClick={disableMfa}
            disabled={busy}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-red-500 border border-red-200 px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
          >
            {busy ? <Loader2 size={11} className="animate-spin" /> : <ShieldOff size={12} />}
            Désactiver
          </button>
        </div>
      )}

      {!enrolling && !factor && (
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-sans text-[13px] text-gray-700">Non activée</p>
            <p className="font-sans text-[11px] text-gray-400 mt-0.5">
              Sécurisez votre compte avec un code à usage unique (Google Authenticator, 1Password, Authy…).
            </p>
          </div>
          <button
            onClick={startEnrollment}
            disabled={busy}
            className="flex items-center gap-1.5 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-ag-black transition-colors disabled:opacity-50 shrink-0"
          >
            {busy && <Loader2 size={11} className="animate-spin" />}
            Activer
          </button>
        </div>
      )}

      {enrolling && (
        <form onSubmit={confirmEnrollment} className="flex flex-col gap-4">
          <p className="font-sans text-[12px] text-gray-500">
            Scannez ce QR code avec votre application d&apos;authentification, puis saisissez le code affiché.
          </p>

          {qrCode && (
            <div className="flex justify-center bg-gray-50 border border-gray-200 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/svg+xml,${encodeURIComponent(qrCode)}`}
                alt="QR code MFA"
                width={160}
                height={160}
              />
            </div>
          )}

          {secret && (
            <p className="font-mono text-[11px] text-gray-400 text-center break-all">
              Clé manuelle : <span className="text-gray-600">{secret}</span>
            </p>
          )}

          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
              Code à 6 chiffres
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 font-mono text-[16px] text-center tracking-widest text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-black transition-colors disabled:opacity-50"
            >
              {busy && <Loader2 size={11} className="animate-spin" />}
              Confirmer
            </button>
            <button
              type="button"
              onClick={cancelEnrollment}
              disabled={busy}
              className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
