'use client'

/**
 * Bloc Vision + Notre signe.
 * Sections empilées en flux normal, sans pinning ni scroll-jacking.
 */
export function VisionMissionBlock({
  visionLabel,
  visionText,
  signContent,
}: {
  visionLabel:    React.ReactNode
  visionText:     React.ReactNode
  signContent:    React.ReactNode
}) {
  return (
    <div>
      {/* Vision */}
      <section className="border-b border-ag-border bg-ag-off-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid md:grid-cols-[280px_1fr]">
            <div className="py-16 md:pr-16 flex items-start">
              {visionLabel}
            </div>
            <div className="py-16 md:px-16">
              {visionText}
            </div>
          </div>
        </div>
      </section>

      {signContent}
    </div>
  )
}
