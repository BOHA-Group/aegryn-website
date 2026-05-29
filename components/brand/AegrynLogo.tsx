'use client'

interface AegrynLogoProps {
  className?: string
  size?: number
  variant?: 'full' | 'mark'
  onDark?: boolean
}

export function AegrynLogo({ className = '', size = 32, variant = 'full', onDark = false }: AegrynLogoProps) {
  const bodyColor = onDark ? '#FFFFFF' : '#050505'

  /**
   * SVG source exact — coordonnées verbatim depuis logo.svg officiel.
   * viewBox="0 0 441.14 487.91" — AUCUNE modification de coordonnées.
   */
  const mark = (
    <svg
      width={size}
      height={Math.round(size * 487.91 / 441.14)}
      viewBox="0 0 441.14 487.91"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <polygon fill="#5adda4" points="297.96 171.32 266.09 100.56 220.57 0 191.6 64.14 254.09 127.04 297.96 171.32"/>
      <polygon fill={bodyColor} points="317.41 214.36 246.64 143.18 184.15 80.28 175.05 100.56 0 487.91 90.63 487.91 220.57 201.12 350.51 487.91 441.14 487.91 317.41 214.36"/>
    </svg>
  )

  if (variant === 'mark') return <span className={className} aria-label="Aegryn">{mark}</span>

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Aegryn">
      {mark}
      <span
        style={{
          fontFamily: 'var(--font-body), "Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: size * 0.42,
          letterSpacing: '0.15em',
          color: bodyColor,
          lineHeight: 1,
          textTransform: 'uppercase' as const,
        }}
      >
        Aegryn
      </span>
    </span>
  )
}
