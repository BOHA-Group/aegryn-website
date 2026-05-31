'use client'

import { LogoZoomSection } from '@/components/sections/LogoZoomSection'

/**
 * Bloc Vision + Mission.
 * Reçoit le contenu JSX de la section Vision (col label + col texte)
 * et le contenu JSX de la section Mission comme slots,
 * afin de rester agnostique des traductions tout en étant Client Component.
 */
export function VisionMissionBlock({
  visionLabel,
  visionText,
  missionContent,
}: {
  visionLabel: React.ReactNode
  visionText:  React.ReactNode
  missionContent: React.ReactNode
}) {
  return (
    <>
      {/* Vision — grille 3 colonnes avec label + texte + logo zoomé */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid md:grid-cols-[280px_1fr] divide-y md:divide-y-0 md:divide-x divide-ag-border">
            <div className="py-16 md:pr-16 flex items-start">
              {visionLabel}
            </div>
            <div className="py-16 md:px-16">
              {visionText}
            </div>
          </div>
        </div>
      </section>

      {/* Logo zoom + transition Mission — effet cinématique pané */}
      <LogoZoomSection missionSlot={missionContent} />
    </>
  )
}
