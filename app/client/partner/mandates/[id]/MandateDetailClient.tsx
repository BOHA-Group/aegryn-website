'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, FileText, MessageSquare } from 'lucide-react'

type Message = {
  id: string
  body: string
  is_admin: boolean
  sender_id: string
  created_at: string
}

type Props = {
  mandateId: string
  userId: string
  mandateStatus: string
  retrocessionPct: number
  messages: Record<string, unknown>[]
}

function fmtTime(d: string) {
  return new Date(d).toLocaleString('fr-CH', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function MandateDetailClient({
  mandateId, userId, mandateStatus, retrocessionPct, messages: initialMessages,
}: Props) {
  const [tab, setTab]           = useState<'invoice' | 'messages'>('invoice')
  const [messages, setMessages] = useState<Message[]>(initialMessages as unknown as Message[])
  const [msgBody, setMsgBody]   = useState('')
  const [msgLoading, setMsgLoading] = useState(false)
  const [msgError, setMsgError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Déclaration facture
  const [invRef, setInvRef]         = useState('')
  const [invAmount, setInvAmount]   = useState('')
  const [invDate, setInvDate]       = useState('')
  const [invLoading, setInvLoading] = useState(false)
  const [invError, setInvError]     = useState('')
  const [invSuccess, setInvSuccess] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!msgBody.trim()) return
    setMsgLoading(true)
    setMsgError('')

    const { data, error } = await supabase
      .from('partner_mandate_messages')
      .insert({ mandate_id: mandateId, sender_id: userId, body: msgBody.trim(), is_admin: false })
      .select()
      .single()

    if (error) {
      setMsgError('Impossible d\'envoyer le message.')
    } else if (data) {
      setMessages(prev => [...prev, data as unknown as Message])
      setMsgBody('')
    }
    setMsgLoading(false)
  }

  async function handleDeclareInvoice(e: React.FormEvent) {
    e.preventDefault()
    setInvLoading(true)
    setInvError('')
    setInvSuccess(false)

    const amount = parseFloat(invAmount)
    if (isNaN(amount) || amount <= 0) {
      setInvError('Montant invalide.')
      setInvLoading(false)
      return
    }

    const retro = parseFloat((amount * retrocessionPct / 100).toFixed(2))

    const { error } = await supabase
      .from('partner_mandate_invoices')
      .insert({
        mandate_id: mandateId,
        partner_id: userId,
        invoice_ref: invRef.trim() || null,
        invoice_amount_chf: amount,
        invoice_date: invDate,
        retrocession_amount_chf: retro,
        status: 'declared',
      })

    if (error) {
      setInvError('Impossible d\'enregistrer la facture. Réessayez.')
    } else {
      setInvSuccess(true)
      setInvRef('')
      setInvAmount('')
      setInvDate('')
    }
    setInvLoading(false)
  }

  const isActive = mandateStatus === 'active'

  return (
    <div>
      {/* Onglets */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('invoice')}
          className={`flex items-center gap-2 px-5 py-3 font-mono text-[10px] uppercase tracking-widest border-b-2 transition-colors ${
            tab === 'invoice'
              ? 'border-ag-navy text-ag-navy'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText size={12} />
          Déclarer une facture
        </button>
        <button
          onClick={() => setTab('messages')}
          className={`flex items-center gap-2 px-5 py-3 font-mono text-[10px] uppercase tracking-widest border-b-2 transition-colors ${
            tab === 'messages'
              ? 'border-ag-navy text-ag-navy'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <MessageSquare size={12} />
          Messages
          {messages.filter(m => m.is_admin).length > 0 && (
            <span className="bg-ag-apex text-ag-navy font-bold text-[9px] px-1.5 py-0.5 rounded-full">
              {messages.filter(m => m.is_admin).length}
            </span>
          )}
        </button>
      </div>

      {/* Onglet Facture */}
      {tab === 'invoice' && (
        <div className="bg-white border border-gray-200 p-6">
          {!isActive ? (
            <p className="font-sans text-[13px] text-gray-400 text-center py-8">
              Ce mandat est {mandateStatus === 'completed' ? 'terminé' : 'annulé'} — plus de déclaration possible.
            </p>
          ) : (
            <>
              <p className="font-sans text-[12px] text-gray-500 mb-5 leading-relaxed">
                Déclarez chaque facture émise à votre client. La rétrocession AEGRYN ({retrocessionPct}%) est calculée automatiquement.
                Transmettez ensuite le virement à <a href="mailto:finance@boha-group.com" className="underline text-ag-navy">finance@boha-group.com</a>.
              </p>

              {invSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 mb-4">
                  <p className="font-sans text-[12px] text-emerald-700">
                    ✓ Facture déclarée. La rétrocession a été calculée et est en attente de confirmation.
                  </p>
                </div>
              )}

              {invError && (
                <p className="font-sans text-[12px] text-red-500 mb-4">{invError}</p>
              )}

              <form onSubmit={handleDeclareInvoice} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
                      Référence facture <span className="text-gray-300">(optionnel)</span>
                    </label>
                    <input
                      type="text"
                      value={invRef}
                      onChange={e => setInvRef(e.target.value)}
                      placeholder="FAC-2026-001"
                      className="w-full border border-gray-200 px-3 py-2.5 font-sans text-[13px] focus:outline-none focus:border-ag-navy transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
                      Date d&apos;émission *
                    </label>
                    <input
                      type="date"
                      required
                      value={invDate}
                      onChange={e => setInvDate(e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 font-sans text-[13px] focus:outline-none focus:border-ag-navy transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
                    Montant facturé au client (CHF) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={invAmount}
                    onChange={e => setInvAmount(e.target.value)}
                    placeholder="5000"
                    className="w-full border border-gray-200 px-3 py-2.5 font-sans text-[13px] focus:outline-none focus:border-ag-navy transition-colors"
                  />
                  {invAmount && !isNaN(parseFloat(invAmount)) && parseFloat(invAmount) > 0 && (
                    <p className="font-mono text-[10px] text-gray-400 mt-1">
                      Rétrocession AEGRYN : CHF {(parseFloat(invAmount) * retrocessionPct / 100).toFixed(2)}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={invLoading}
                  className="self-start bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-navy/90 transition-colors disabled:opacity-50"
                >
                  {invLoading ? 'Enregistrement…' : 'Déclarer cette facture'}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Onglet Messages */}
      {tab === 'messages' && (
        <div className="bg-white border border-gray-200 flex flex-col" style={{ minHeight: '360px' }}>
          <div className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto max-h-96">
            {messages.length === 0 ? (
              <p className="font-sans text-[13px] text-gray-400 text-center py-10">
                Pas encore de messages. Posez vos questions à l&apos;équipe AEGRYN.
              </p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[75%] gap-1 ${msg.is_admin ? 'self-start' : 'self-end items-end'}`}
                >
                  <div className={`px-4 py-2.5 ${
                    msg.is_admin
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-ag-navy text-white'
                  }`}>
                    <p className="font-sans text-[13px] leading-relaxed">{msg.body}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.is_admin && (
                      <span className="font-mono text-[8px] uppercase tracking-widest text-ag-apex">AEGRYN</span>
                    )}
                    <span className="font-mono text-[8px] text-gray-300">{fmtTime(msg.created_at)}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {isActive && (
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex gap-3">
              {msgError && (
                <p className="font-sans text-[11px] text-red-500 w-full mb-2">{msgError}</p>
              )}
              <input
                type="text"
                value={msgBody}
                onChange={e => setMsgBody(e.target.value)}
                placeholder="Votre message à l'équipe AEGRYN…"
                className="flex-1 border border-gray-200 px-3 py-2.5 font-sans text-[13px] focus:outline-none focus:border-ag-navy transition-colors"
              />
              <button
                type="submit"
                disabled={msgLoading || !msgBody.trim()}
                className="bg-ag-navy text-white px-4 py-2.5 hover:bg-ag-navy/90 transition-colors disabled:opacity-40 flex items-center gap-2"
              >
                <Send size={13} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
