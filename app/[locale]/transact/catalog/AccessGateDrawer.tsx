'use client'

import { useEffect } from 'react'
import { X, Lock, ArrowUpRight } from 'lucide-react'
import NextLink from 'next/link'

export type AccessStatus =
  | 'ok'
  | 'not_authenticated'
  | 'pending_nda'
  | 'pending_cgv'
  | 'pending_kyc'

interface Props {
  open:         boolean
  onClose:      () => void
  accessStatus: AccessStatus
  locale:       string
  labels: {
    conditionalAccess: string
    qualifiedOnly:     string
    accessDesc:        string
    step1:             string
    step2:             string
    step3:             string
    loginCta:          string
    registerCta:       string
    kycPending:        string
  }
  isAuthenticated: boolean
}

export default function AccessGateDrawer({
  open, onClose, accessStatus, locale, labels, isAuthenticated,
}: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else       document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const steps = [
    { n: '01', label: labels.step1, done: isAuthenticated },
    { n: '02', label: labels.step2, done: accessStatus === 'pending_cgv' || accessStatus === 'pending_kyc' || accessStatus === 'ok' },
    { n: '03', label: labels.step3, done: accessStatus === 'pending_kyc' || accessStatus === 'ok' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ag-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-ag-white shadow-2xl z-50 flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ag-border px-6 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-ag-border flex items-center justify-center">
              <Lock size={14} className="text-ag-gray-light" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ag-apex">
              {labels.conditionalAccess}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-ag-gray-light hover:text-ag-black transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-8 flex flex-col gap-8">
          <div>
            <h2 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em] mb-3">
              {labels.qualifiedOnly}
            </h2>
            <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
              {labels.accessDesc}
            </p>
          </div>

          {/* Étapes */}
          <div className="flex flex-col gap-3">
            {steps.map(({ n, label, done }) => (
              <div
                key={n}
                className={`border p-4 flex items-center gap-3 ${
                  done
                    ? 'border-ag-apex/40 bg-ag-apex/5'
                    : 'border-ag-border bg-ag-white'
                }`}
              >
                <span className={`font-mono text-[11px] font-bold shrink-0 ${done ? 'text-ag-apex' : 'text-ag-gray-light'}`}>
                  {n}
                </span>
                <p className={`font-sans text-[13px] leading-snug flex-1 ${done ? 'text-ag-black' : 'text-ag-gray'}`}>
                  {label}
                </p>
                {done && <span className="text-ag-apex text-[11px] font-mono">✓</span>}
              </div>
            ))}
          </div>

          {/* KYC pending special message */}
          {accessStatus === 'pending_kyc' && (
            <div className="border border-amber-300 bg-amber-50 p-4">
              <p className="font-sans text-[13px] text-amber-800 leading-relaxed">
                {labels.kycPending}
              </p>
            </div>
          )}

          {/* CTAs */}
          {!isAuthenticated && (
            <div className="flex flex-col gap-3">
              <NextLink
                href={`/client/login?next=/${locale}/transact/catalog`}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-black transition-colors"
              >
                {labels.loginCta} <ArrowUpRight size={12} />
              </NextLink>
              <NextLink
                href={`/client/register?next=/${locale}/transact/catalog`}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:border-ag-black hover:text-ag-black transition-all"
              >
                {labels.registerCta}
              </NextLink>
            </div>
          )}

          {accessStatus === 'pending_nda' && isAuthenticated && (
            <NextLink
              href={`/client/buyer?tab=nda`}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-black transition-colors"
            >
              Signer le NDA <ArrowUpRight size={12} />
            </NextLink>
          )}

          {accessStatus === 'pending_cgv' && isAuthenticated && (
            <NextLink
              href={`/client/buyer?tab=cgv`}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-black transition-colors"
            >
              Accepter les CGV <ArrowUpRight size={12} />
            </NextLink>
          )}

          {accessStatus === 'pending_kyc' && isAuthenticated && (
            <NextLink
              href={`/client/buyer/kyc`}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-black transition-colors"
            >
              Compléter mon KYC <ArrowUpRight size={12} />
            </NextLink>
          )}
        </div>
      </div>
    </>
  )
}
