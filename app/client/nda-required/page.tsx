/**
 * /client/nda-required : accord de confidentialité requis avant l'accès aux
 * dossiers de certification, à la data room ou aux dossiers partenaire.
 * Remplace les anciennes pages d'acceptation de NDA par compte : le NDA mutuel
 * est envoyé par Aegryn (envoi manuel) et se signe par lien personnel, sans compte.
 */
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { getUser } from '@/lib/supabaseServer'
import { getNdaAccess } from '@/lib/nda/access'
import RequestNda from './RequestNda'

export const metadata: Metadata = { title: 'Accord de confidentialité | Aegryn', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function NdaRequiredPage({ searchParams }: { searchParams: Promise<{ need?: string }> }) {
  const user = await getUser()
  if (!user) redirect('/client/login')
  const need = (await searchParams).need === 'partner' ? 'partner' : 'certification'
  const access = await getNdaAccess(user.email, [need])
  if (access.state === 'signed') redirect(need === 'partner' ? '/client/partner' : '/client/seller')

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <div className="flex items-center gap-3">
        <ShieldCheck size={20} className="text-ag-navy" />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-400">Espace client · accord de confidentialité</p>
      </div>
      <h1 className="font-sans text-[26px] font-bold tracking-tight text-gray-900">Un accord de confidentialité est requis</h1>
      <p className="text-[15px] leading-relaxed text-gray-600">
        {need === 'partner'
          ? 'Avant d’accéder aux dossiers qui vous sont confiés, un accord de confidentialité mutuel doit être signé.'
          : 'Avant d’ouvrir vos dossiers de certification et la data room, un accord de confidentialité mutuel doit être signé.'}
        {' '}Il se signe en ligne par un lien personnel envoyé par e-mail, sans mot de passe supplémentaire. Vous recevez ensuite votre exemplaire signé en PDF, également disponible dans votre compte.
      </p>
      {access.state === 'pending' ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] text-amber-900">
          Un accord ({access.reference}) vous a été envoyé à <strong>{user.email}</strong>. Ouvrez le lien reçu par e-mail pour le signer ; cette page se débloque ensuite automatiquement.
        </div>
      ) : (
        <>
          <p className="text-[14px] text-gray-500">Aucun accord n’a encore été envoyé à <strong>{user.email}</strong>. Demandez-le : l’équipe Aegryn vous l’adresse sous 2 jours ouvrés.</p>
          <RequestNda need={need} label="Demander mon NDA" doneLabel="Demande envoyée. Vous recevrez le NDA par e-mail sous 2 jours ouvrés." />
        </>
      )}
    </div>
  )
}
