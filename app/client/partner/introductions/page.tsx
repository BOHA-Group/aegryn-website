import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import NewIntroductionForm from './NewIntroductionForm'
import IntroductionsList from './IntroductionsList'

export const metadata: Metadata = {
  title: 'Introductions — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
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

  return (
    <div className="p-8 max-w-4xl">

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
          <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Introductions</h1>
          <p className="font-sans text-[13px] text-gray-400 mt-1">
            Apports d&apos;affaires soumis à l&apos;équipe AEGRYN : actifs ou acquéreurs.
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

      {/* Liste avec édition/suppression inline */}
      <IntroductionsList initial={(introductions ?? []) as import('./IntroductionsList').Introduction[]} />

      <div className="mt-8 px-5 py-4 border border-gray-200 bg-gray-50">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          Les introductions qualifiées peuvent générer une commission lors de la finalisation d&apos;une transaction. Les conditions sont définies dans votre contrat de partenariat AEGRYN.
        </p>
      </div>
    </div>
  )
}
