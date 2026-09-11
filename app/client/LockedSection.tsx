'use client'

import { Lock } from 'lucide-react'

/**
 * LockedSection — wrapper de page verrouillée.
 * Affiche un bandeau grisé "Prochainement disponible" qui
 * remplace le contenu opérationnel d'une section non encore ouverte.
 *
 * Usage dans une page serveur :
 *   if (LOCKED) return <LockedSection title="Co-signatures CIFSO" />
 */
export default function LockedSection({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="p-8 max-w-4xl">
      {/* En-tête grisée identique au layout normal */}
      <div className="mb-8 opacity-40 select-none">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">
          Espace membre
        </p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Bannière locked */}
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-8 py-14 flex flex-col items-center text-center gap-5">
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <Lock size={16} className="text-gray-400" />
        </div>
        <div className="flex flex-col gap-2 max-w-md">
          <p className="font-sans font-semibold text-gray-600 text-[15px]">
            Prochainement disponible
          </p>
          <p className="font-sans text-[13px] text-gray-400 leading-relaxed">
            {description ??
              "Cette section est en cours de configuration. Elle sera ouverte prochainement. Votre fiche profil reste accessible et modifiable dès maintenant."}
          </p>
        </div>
      </div>
    </div>
  )
}
