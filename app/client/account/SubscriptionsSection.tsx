'use client'

import { useState } from 'react'
import { ArrowUpRight, BookOpen, Linkedin, Lock, CheckCircle, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  isSubscribed: boolean
  locale: string
}

export default function SubscriptionsSection({ isSubscribed, locale }: Props) {
  const [subscribed, setSubscribed] = useState(isSubscribed)
  const [status, setStatus]         = useState<Status>('idle')

  async function toggleArticles() {
    if (subscribed || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ locale }),
      })
      if (!res.ok) throw new Error('subscribe_failed')
      setSubscribed(true)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-5 mt-6">
      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">
        Abonnements &amp; Publications
      </p>
      <p className="font-sans text-[12px] text-gray-400 mb-4 leading-relaxed">
        Gérez vos abonnements aux publications Aegryn.
      </p>

      <div className="flex flex-col gap-3">

        {/* Articles & Insights — gratuit */}
        <div className="rounded-xl border border-gray-200 px-4 py-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <BookOpen size={16} className={`mt-0.5 shrink-0 ${subscribed ? 'text-ag-navy' : 'text-gray-300'}`} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-sans font-semibold text-gray-900 text-[13px]">Articles &amp; Insights</p>
                <span className="font-mono text-[9px] text-ag-apex bg-ag-navy px-1.5 py-0.5 uppercase tracking-widest rounded">
                  Gratuit
                </span>
                {subscribed && (
                  <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-600 uppercase tracking-widest">
                    <CheckCircle size={10} /> Actif
                  </span>
                )}
              </div>
              <p className="font-sans text-[12px] text-gray-500 mt-0.5">
                Analyses M&amp;A, valorisation, CIFSO, tech — un article par semaine par email.
              </p>
              {status === 'error' && (
                <p className="font-sans text-[11px] text-red-500 mt-1">Une erreur est survenue, réessayez.</p>
              )}
            </div>
          </div>
          {subscribed ? (
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest shrink-0 pt-0.5">
              Inscrit(e)
            </span>
          ) : (
            <button
              onClick={toggleArticles}
              disabled={status === 'loading'}
              className="rounded-lg font-mono text-[10px] uppercase tracking-widest text-white bg-ag-navy border border-ag-navy px-3 py-1.5 shrink-0 flex items-center gap-1.5 hover:bg-ag-black transition-colors disabled:opacity-50"
            >
              {status === 'loading'
                ? <><Loader2 size={11} className="animate-spin" /> Inscription…</>
                : <>S&apos;inscrire</>
              }
            </button>
          )}
        </div>

        {/* Newsletter LinkedIn — redirection */}
        <div className="rounded-xl border border-gray-200 px-4 py-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Linkedin size={16} className="mt-0.5 shrink-0 text-[#0077B5]" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-sans font-semibold text-gray-900 text-[13px]">Newsletter LinkedIn</p>
                <span className="font-mono text-[9px] text-ag-apex bg-ag-navy px-1.5 py-0.5 uppercase tracking-widest rounded">
                  Gratuit
                </span>
              </div>
              <p className="font-sans text-[12px] text-gray-500 mt-0.5">
                Suivez Aegryn sur LinkedIn et abonnez-vous directement à la newsletter sur la page.
              </p>
            </div>
          </div>
          <a
            href="https://www.linkedin.com/company/aegryn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-3 py-1.5 shrink-0 flex items-center gap-1.5 hover:bg-ag-navy hover:text-white transition-colors"
          >
            LinkedIn <ArrowUpRight size={11} />
          </a>
        </div>

        {/* Magazine — verrouillé */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 flex items-start justify-between gap-4 opacity-70">
          <div className="flex items-start gap-3">
            <Lock size={16} className="mt-0.5 shrink-0 text-gray-300" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-sans font-semibold text-gray-500 text-[13px]">Aegryn Magazine</p>
                <span className="font-mono text-[9px] text-gray-400 border border-gray-200 bg-gray-100 px-1.5 py-0.5 uppercase tracking-widest rounded">
                  Prochainement
                </span>
              </div>
              <p className="font-sans text-[12px] text-gray-400 mt-0.5">
                Accès numérique aux parutions trimestrielles. Disponible prochainement.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] text-gray-300 uppercase tracking-widest shrink-0 pt-0.5 flex items-center gap-1">
            <Lock size={10} /> Bientôt
          </span>
        </div>

      </div>
    </div>
  )
}
