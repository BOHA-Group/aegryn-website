import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Users, Plus } from 'lucide-react'
import NewIntroductionForm from './NewIntroductionForm'

export const metadata: Metadata = {
  title: 'Introductions — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new:          { label: 'Nouvelle',    color: 'text-blue-600 border-blue-200 bg-blue-50' },
  contacted:    { label: 'Contactée',   color: 'text-gray-500 border-gray-200 bg-gray-50' },
  qualified:    { label: 'Qualifiée',   color: 'text-amber-600 border-amber-200 bg-amber-50' },
  closed_won:   { label: 'Convertie',   color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  closed_lost:  { label: 'Non retenue', color: 'text-red-400 border-red-100 bg-red-50' },
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

type Introduction = {
  id: string
  introduction_type: string
  contact_name: string
  contact_email: string
  introduction_status: string
  context_note: string | null
  created_at: string
  admin_note: string | null
}

export default async function PartnerIntroductionsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: introductions } = await supa
    .from('introductions')
    .select('id, introduction_type, contact_name, contact_email, introduction_status, context_note, created_at, admin_note')
    .eq('partner_id', user.id)
    .order('created_at', { ascending: false })

  const [_showForm, setShowForm] = [false, () => {}]
  void setShowForm

  return (
    <div className="p-8 max-w-4xl">

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
          <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Introductions</h1>
          <p className="font-sans text-[13px] text-gray-400 mt-1">
            Apports d&apos;affaires soumis à l&apos;équipe AEGRYN — actifs ou acquéreurs.
          </p>
        </div>
      </div>

      {/* Formulaire nouvelle introduction */}
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Plus size={14} className="text-gray-500" />
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Soumettre une introduction</p>
        </div>
        <NewIntroductionForm />
      </div>

      {/* Liste */}
      {!introductions || introductions.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-12 text-center">
          <Users size={24} className="text-gray-300 mx-auto mb-3" />
          <p className="font-sans text-[14px] text-gray-400">
            Aucune introduction soumise pour le moment.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(introductions as Introduction[]).map(intro => {
            const statusCfg = STATUS_CONFIG[intro.introduction_status] ?? STATUS_CONFIG.new

            return (
              <div key={intro.id} className="bg-white border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-sans font-semibold text-gray-900 text-[14px]">{intro.contact_name}</p>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-gray-400 border border-gray-200 px-1.5 py-0.5">
                        {intro.introduction_type === 'asset' ? 'Actif' : 'Acquéreur'}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-gray-400">{intro.contact_email}</p>
                  </div>
                  <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest shrink-0 ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </div>

                {intro.context_note && (
                  <p className="font-sans text-[11px] text-gray-500 mb-3 italic border-l-2 border-gray-200 pl-3">
                    {intro.context_note}
                  </p>
                )}

                {intro.admin_note && (
                  <div className="bg-gray-50 border border-gray-200 px-3 py-2 mb-3">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-gray-400 mb-1">Note AEGRYN</p>
                    <p className="font-sans text-[11px] text-gray-600">{intro.admin_note}</p>
                  </div>
                )}

                <p className="font-mono text-[9px] text-gray-300">Soumise le {fmtDate(intro.created_at)}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 px-5 py-4 border border-gray-200 bg-gray-50">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          Les introductions qualifiées peuvent générer une commission lors de la finalisation d&apos;une transaction. Les conditions sont définies dans votre contrat de partenariat AEGRYN.
        </p>
      </div>
    </div>
  )
}
