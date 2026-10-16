import type { Metadata } from 'next'
import { redirect }      from 'next/navigation'
import { getUser }       from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import ExpertProfileForm from './ExpertProfileForm'

export const metadata: Metadata = {
  title: 'Ma fiche expert | Aegryn',
  robots: { index: false, follow: false },
}

export default async function ExpertClientPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const { data: expertProfile } = await supa.from('expert_profiles').select('*').eq('user_id', user.id).maybeSingle()

  return (
    <div className="pb-12 px-6 md:px-10 pt-10 max-w-3xl">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-500 mb-1">Espace Expert Aegryn</p>
        <h1 className="font-sans font-bold text-gray-900 text-[26px] tracking-tight">Ma fiche expert</h1>
        <p className="font-sans text-[13px] text-gray-500 mt-0.5">{user.email}</p>
      </div>

      {/* Statut fiche */}
      {expertProfile && (
        <div className={`border p-5 mb-6 ${
          expertProfile.is_visible
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-blue-200 bg-blue-50'
        }`}>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Statut de la fiche</p>
          {expertProfile.is_visible ? (
            <p className="font-sans text-[13px] text-emerald-800">✓ Fiche publiée et visible sur /experts</p>
          ) : (
            <p className="font-sans text-[13px] text-blue-700">⏳ En attente de validation par l'équipe Aegryn</p>
          )}
          {expertProfile.hidden_reason && !expertProfile.is_visible && (
            <p className="font-sans text-[12px] text-red-600 mt-1">Motif : {expertProfile.hidden_reason}</p>
          )}
          {!expertProfile.is_visible && expertProfile.updated_at && (
            <p className="font-sans text-[11px] text-gray-400 mt-1">
              Toute modification remet la fiche en attente de validation.
            </p>
          )}
        </div>
      )}

      <ExpertProfileForm initialData={expertProfile} />
    </div>
  )
}
