'use client'

import { useState }     from 'react'
import { useForm }      from 'react-hook-form'
import { zodResolver }  from '@hookform/resolvers/zod'
import { z }            from 'zod'
import { X, Lock, CheckCircle } from 'lucide-react'

const T = {
  ink:   '#0C0C0C',
  gold:  '#9C7A3C',
  paper: '#FAF8F3',
  line:  '#D9D2C2',
  grey6: '#5C5C5C',
}

const schema = z.object({
  note: z.string().max(1000).optional(),
})
type FormData = z.infer<typeof schema>

interface Props {
  assetId:   string
  assetName: string
  onClose:   () => void
}

export default function DossierRequestModal({ assetId, assetName, onClose }: Props) {
  const [state, setState] = useState<'form' | 'success' | 'error'>('form')

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch('/api/transaction/request-dossier', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ asset_id: assetId, note: data.note }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Erreur serveur')
      }
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div
        className="relative w-full max-w-[480px] rounded-sm border shadow-2xl"
        style={{ borderColor: T.line, backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b"
          style={{ borderColor: T.line }}>
          <div className="flex items-center gap-2.5">
            <Lock size={13} style={{ color: T.gold }} />
            <span className="text-[11px] font-bold uppercase"
              style={{ letterSpacing: '0.14em', fontFamily: 'Arial, sans-serif', color: T.ink }}>
              Demande d'accès au dossier
            </span>
          </div>
          <button onClick={onClose} className="hover:opacity-60 transition-opacity">
            <X size={16} style={{ color: T.grey6 }} />
          </button>
        </div>

        <div className="px-7 py-6">
          {state === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle size={36} style={{ color: T.gold }} />
              <p className="text-[15px] leading-[1.6]"
                style={{ fontFamily: 'Georgia, serif', color: T.ink }}>
                Votre demande a été transmise à l'équipe Aegryn.
              </p>
              <p className="text-[12px]" style={{ color: T.grey6, fontFamily: 'Arial, sans-serif' }}>
                Si votre candidature est retenue, le lien d'accès au dossier{' '}
                <strong>{assetName}</strong> apparaîtra dans votre espace client.
              </p>
              <p className="text-[11px] italic" style={{ color: T.grey6, fontFamily: 'Arial, sans-serif' }}>
                Aucun email ne sera envoyé. Connectez-vous à /client/buyer pour vérifier le statut.
              </p>
              <button onClick={onClose}
                className="mt-2 px-6 py-2.5 text-[11px] font-bold uppercase transition-opacity hover:opacity-80"
                style={{ backgroundColor: T.ink, color: '#fff', letterSpacing: '0.1em', fontFamily: 'Arial, sans-serif' }}>
                Fermer
              </button>
            </div>
          ) : state === 'error' ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <p className="text-[14px]" style={{ color: '#C0392B', fontFamily: 'Georgia, serif' }}>
                Une erreur est survenue. Veuillez réessayer ou contacter l'équipe Aegryn.
              </p>
              <button onClick={() => setState('form')}
                className="px-6 py-2.5 text-[11px] font-bold uppercase hover:opacity-80 transition-opacity"
                style={{ backgroundColor: T.ink, color: '#fff', letterSpacing: '0.1em', fontFamily: 'Arial, sans-serif' }}>
                Réessayer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <p className="text-[14px] leading-[1.65]"
                style={{ fontFamily: 'Georgia, serif', color: T.ink }}>
                Vous demandez l'accès au dossier complet de{' '}
                <strong>{assetName}</strong>. Votre demande sera examinée
                par l'équipe Aegryn sous 48 heures ouvrées.
              </p>

              {/* Note optionnelle */}
              <div>
                <label className="block text-[10px] font-bold uppercase mb-2"
                  style={{ letterSpacing: '0.12em', color: T.gold, fontFamily: 'Arial, sans-serif' }}>
                  Message (optionnel)
                </label>
                <textarea
                  {...register('note')}
                  rows={4}
                  placeholder="Présentez votre profil d'acquéreur, votre intérêt pour cet actif…"
                  className="w-full border rounded-sm px-4 py-3 text-[13px] resize-none outline-none focus:border-stone-400 transition-colors"
                  style={{ borderColor: T.line, fontFamily: 'Georgia, serif', backgroundColor: T.paper, color: T.ink }}
                />
              </div>

              {/* Engagement confidentialité */}
              <div className="px-4 py-3 rounded-sm border-l-4"
                style={{ borderColor: T.gold, backgroundColor: T.paper }}>
                <p className="text-[11px] leading-[1.6]"
                  style={{ color: T.grey6, fontFamily: 'Arial, sans-serif' }}>
                  En soumettant cette demande, vous vous engagez à maintenir
                  la stricte confidentialité des informations contenues dans le dossier
                  et à ne pas les divulguer à des tiers non autorisés par Aegryn.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-[12px] font-bold uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: T.ink, color: '#fff', letterSpacing: '0.1em', fontFamily: 'Arial, sans-serif' }}
              >
                {isSubmitting ? 'Envoi en cours…' : 'Soumettre la demande'}
              </button>

              <p className="text-[10px] italic text-center"
                style={{ color: T.grey6, fontFamily: 'Arial, sans-serif' }}>
                Le lien d'accès n'est jamais communiqué par email —
                il sera visible uniquement dans votre espace client.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
