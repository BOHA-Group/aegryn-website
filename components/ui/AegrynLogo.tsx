type Props = {
  className?: string
  variant?: 'white' | 'navy' | 'color'
}

export default function AegrynLogo({ className = 'h-8 w-auto', variant = 'white' }: Props) {
  const textColor = variant === 'navy' ? '#0A1D2E' : '#F8FAFC'
  const apexColor = '#5ADDA4'

  return (
    <svg
      className={className}
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Aegryn"
    >
      <title>Aegryn</title>
      {/* A — lambda without crossbar */}
      <path
        d="M2 28 L12 4 L22 28"
        stroke={textColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Cut Apex triangle */}
      <polygon
        points="12,4 8,12 16,12"
        fill={apexColor}
      />
      {/* E — 3 bars no vertical stem */}
      <line x1="28" y1="7" x2="44" y2="7" stroke={textColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="16" x2="41" y2="16" stroke={textColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="25" x2="44" y2="25" stroke={textColor} strokeWidth="3" strokeLinecap="round" />
      {/* G */}
      <text x="52" y="26" fontFamily="system-ui" fontWeight="800" fontSize="22" fill={textColor} letterSpacing="-1">
        GRYN
      </text>
    </svg>
  )
}
