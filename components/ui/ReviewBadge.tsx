/**
 * ReviewBadge — badge pour les évaluations payantes (Review / Review+)
 *
 * RÈGLE DESIGN ABSOLUE : ne doit JAMAIS être confondu avec GradeBadge (★/AAA/AA/A/B)
 * - Forme : losange (clip-path) — PAS le carré des grades officiels
 * - Couleur : bleu institutionnel neutre, hors palette grade
 * - Toujours "Non publiable" en dessous dans tout contexte client-visible
 */

interface ReviewBadgeProps {
  label:     'Aegryn Review' | 'Aegryn Review+'
  sublabel?: string   // ex: "Co-revu — Cabinet juridique"
  score?:    number
  showNotPublishable?: boolean
}

export default function ReviewBadge({
  label,
  sublabel,
  score,
  showNotPublishable = false,
}: ReviewBadgeProps) {
  const isPlus = label === 'Aegryn Review+'

  return (
    <div className="inline-flex flex-col items-center gap-1">
      {/* Losange */}
      <div
        className={`relative flex flex-col items-center justify-center px-5 py-3 ${
          isPlus
            ? 'bg-blue-700 text-white'
            : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
        }`}
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
      >
        <span
          className="font-mono font-bold leading-none whitespace-nowrap"
          style={{ fontSize: isPlus ? 10 : 9 }}
        >
          {label}
        </span>
        {score != null && (
          <span className={`font-mono text-[8px] mt-0.5 ${isPlus ? 'text-white/70' : 'text-blue-500'}`}>
            {score}/100
          </span>
        )}
      </div>

      {sublabel && (
        <p className="font-mono text-[9px] text-blue-600 text-center max-w-[120px] leading-tight">
          {sublabel}
        </p>
      )}

      {showNotPublishable && (
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-400">
          Non publiable
        </p>
      )}
    </div>
  )
}
