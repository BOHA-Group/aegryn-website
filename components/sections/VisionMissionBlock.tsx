'use client'

/**
 * Bloc Vision + ADN.
 * Sections empilées en flux normal, sans pinning ni scroll-jacking.
 */
export function VisionMissionBlock({
  visionLabel,
  visionText,
  dnaContent,
}: {
  visionLabel:    React.ReactNode
  visionText:     React.ReactNode
  dnaContent:     React.ReactNode
}) {
  return (
    <div>
      {/* Vision */}
      <section className="border-b border-ag-border bg-ag-off-white/80 backdrop-blur-sm">
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

      {/* ADN */}
      <div className="bg-ag-white/80 backdrop-blur-sm">
        {dnaContent}
      </div>
    </div>
  )
}
