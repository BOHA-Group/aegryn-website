'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

// Formats téléphone par pays (regex + placeholder)
const PHONE_FORMATS = {
  // Europe de l'Ouest
  CH: { code: '+41', regex: /^[1-9]\d{8}$/, placeholder: '79 123 45 67', format: 'XX XXX XX XX' },
  FR: { code: '+33', regex: /^[1-9]\d{8}$/, placeholder: '6 12 34 56 78', format: 'X XX XX XX XX' },
  DE: { code: '+49', regex: /^[1-9]\d{9,10}$/, placeholder: '151 23456789', format: 'XXX XXXXXXXX' },
  IT: { code: '+39', regex: /^3\d{8,9}$/, placeholder: '312 345 6789', format: 'XXX XXX XXXX' },
  ES: { code: '+34', regex: /^[6-9]\d{8}$/, placeholder: '612 34 56 78', format: 'XXX XX XX XX' },
  NL: { code: '+31', regex: /^6\d{8}$/, placeholder: '6 12345678', format: 'X XXXXXXXX' },
  BE: { code: '+32', regex: /^4\d{8}$/, placeholder: '470 12 34 56', format: 'XXX XX XX XX' },
  LU: { code: '+352', regex: /^6\d{8}$/, placeholder: '621 123 456', format: 'XXX XXX XXX' },
  AT: { code: '+43', regex: /^6\d{8,12}$/, placeholder: '664 1234567', format: 'XXX XXXXXXX' },
  GB: { code: '+44', regex: /^7\d{9}$/, placeholder: '7400 123456', format: 'XXXX XXXXXX' },
  IE: { code: '+353', regex: /^8\d{8}$/, placeholder: '85 123 4567', format: 'XX XXX XXXX' },
  PT: { code: '+351', regex: /^9\d{8}$/, placeholder: '912 345 678', format: 'XXX XXX XXX' },
  
  // Europe du Nord
  SE: { code: '+46', regex: /^7\d{8}$/, placeholder: '70 123 45 67', format: 'XX XXX XX XX' },
  NO: { code: '+47', regex: /^[49]\d{7}$/, placeholder: '412 34 567', format: 'XXX XX XXX' },
  DK: { code: '+45', regex: /^[2-9]\d{7}$/, placeholder: '20 12 34 56', format: 'XX XX XX XX' },
  FI: { code: '+358', regex: /^4\d{7,9}$/, placeholder: '40 123 4567', format: 'XX XXX XXXX' },
  IS: { code: '+354', regex: /^[6-8]\d{6}$/, placeholder: '611 2345', format: 'XXX XXXX' },
  
  // Europe de l'Est
  PL: { code: '+48', regex: /^[4-8]\d{8}$/, placeholder: '501 234 567', format: 'XXX XXX XXX' },
  CZ: { code: '+420', regex: /^[6-7]\d{8}$/, placeholder: '601 234 567', format: 'XXX XXX XXX' },
  SK: { code: '+421', regex: /^9\d{8}$/, placeholder: '901 234 567', format: 'XXX XXX XXX' },
  HU: { code: '+36', regex: /^[2-3]\d{7,8}$/, placeholder: '20 123 4567', format: 'XX XXX XXXX' },
  RO: { code: '+40', regex: /^7\d{8}$/, placeholder: '712 345 678', format: 'XXX XXX XXX' },
  BG: { code: '+359', regex: /^[8-9]\d{8}$/, placeholder: '87 123 4567', format: 'XX XXX XXXX' },
  HR: { code: '+385', regex: /^9\d{7,8}$/, placeholder: '91 234 5678', format: 'XX XXX XXXX' },
  SI: { code: '+386', regex: /^[3-7]\d{7}$/, placeholder: '31 234 567', format: 'XX XXX XXX' },
  
  // Pays Baltes
  EE: { code: '+372', regex: /^[5-8]\d{6,7}$/, placeholder: '5123 4567', format: 'XXXX XXXX' },
  LV: { code: '+371', regex: /^2\d{7}$/, placeholder: '21 234 567', format: 'XX XXX XXX' },
  LT: { code: '+370', regex: /^6\d{7}$/, placeholder: '612 34567', format: 'XXX XXXXX' },
  
  // Europe du Sud
  GR: { code: '+30', regex: /^6\d{9}$/, placeholder: '691 234 5678', format: 'XXX XXX XXXX' },
  CY: { code: '+357', regex: /^9\d{7}$/, placeholder: '96 123 456', format: 'XX XXX XXX' },
  MT: { code: '+356', regex: /^[79]\d{7}$/, placeholder: '79 123 456', format: 'XX XXX XXX' },
  
  // Balkans
  RS: { code: '+381', regex: /^6\d{7,8}$/, placeholder: '60 123 4567', format: 'XX XXX XXXX' },
  BA: { code: '+387', regex: /^6\d{7,8}$/, placeholder: '61 123 456', format: 'XX XXX XXX' },
  ME: { code: '+382', regex: /^6\d{7}$/, placeholder: '67 123 456', format: 'XX XXX XXX' },
  MK: { code: '+389', regex: /^7\d{7}$/, placeholder: '70 123 456', format: 'XX XXX XXX' },
  AL: { code: '+355', regex: /^6\d{8}$/, placeholder: '66 123 4567', format: 'XX XXX XXXX' },
  
  // Autres
  TR: { code: '+90', regex: /^5\d{9}$/, placeholder: '501 234 5678', format: 'XXX XXX XXXX' },
  UA: { code: '+380', regex: /^[3-9]\d{8}$/, placeholder: '50 123 4567', format: 'XX XXX XXXX' },
  
  // Amérique du Nord
  US: { code: '+1', regex: /^[2-9]\d{9}$/, placeholder: '202 555 0123', format: 'XXX XXX XXXX' },
  CA: { code: '+1', regex: /^[2-9]\d{9}$/, placeholder: '416 555 0123', format: 'XXX XXX XXXX' },
} as const

type CountryCode = keyof typeof PHONE_FORMATS

const COUNTRIES: { code: CountryCode; name: string; flag: string }[] = [
  // Europe de l'Ouest
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  
  // Europe du Nord
  { code: 'SE', name: 'Suède', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮' },
  { code: 'IS', name: 'Islande', flag: '🇮🇸' },
  
  // Europe de l'Est
  { code: 'PL', name: 'Pologne', flag: '🇵🇱' },
  { code: 'CZ', name: 'Tchéquie', flag: '🇨🇿' },
  { code: 'SK', name: 'Slovaquie', flag: '🇸🇰' },
  { code: 'HU', name: 'Hongrie', flag: '🇭🇺' },
  { code: 'RO', name: 'Roumanie', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgarie', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatie', flag: '🇭🇷' },
  { code: 'SI', name: 'Slovénie', flag: '🇸🇮' },
  
  // Pays Baltes
  { code: 'EE', name: 'Estonie', flag: '🇪🇪' },
  { code: 'LV', name: 'Lettonie', flag: '🇱🇻' },
  { code: 'LT', name: 'Lituanie', flag: '�🇹' },
  
  // Europe du Sud
  { code: 'GR', name: 'Grèce', flag: '�🇬�' },
  { code: 'CY', name: 'Chypre', flag: '🇨🇾' },
  { code: 'MT', name: 'Malte', flag: '🇲🇹' },
  
  // Balkans
  { code: 'RS', name: 'Serbie', flag: '🇷🇸' },
  { code: 'BA', name: 'Bosnie-Herzégovine', flag: '�🇧🇦' },
  { code: 'ME', name: 'Monténégro', flag: '🇲🇪' },
  { code: 'MK', name: 'Macédoine du Nord', flag: '🇲🇰' },
  { code: 'AL', name: 'Albanie', flag: '🇦🇱' },
  
  // Autres
  { code: 'TR', name: 'Turquie', flag: '🇹🇷' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
]

type PhoneInputProps = {
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
}

export default function PhoneInput({
  value = '',
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  placeholder,
  className = '',
}: PhoneInputProps) {
  // Parser la valeur initiale
  const parseInitialValue = (val: string): { country: CountryCode; number: string } => {
    if (!val) return { country: 'CH', number: '' }
    
    for (const country of COUNTRIES) {
      const format = PHONE_FORMATS[country.code]
      if (val.startsWith(format.code)) {
        return {
          country: country.code,
          number: val.slice(format.code.length).trim(),
        }
      }
    }
    return { country: 'CH', number: val }
  }

  const initial = parseInitialValue(value)
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(initial.country)
  const [phoneNumber, setPhoneNumber] = useState(initial.number)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentFormat = PHONE_FORMATS[selectedCountry]

  // Mettre à jour la valeur complète quand pays ou numéro change
  useEffect(() => {
    const fullNumber = phoneNumber ? `${currentFormat.code} ${phoneNumber}` : ''
    onChange(fullNumber)
  }, [selectedCountry, phoneNumber, currentFormat.code, onChange])

  // Formater le numéro pendant la saisie
  const formatPhoneNumber = (input: string, countryCode: CountryCode): string => {
    // Retirer tous les caractères non-numériques
    const digits = input.replace(/\D/g, '')
    
    // Appliquer le format selon le pays
    const format = PHONE_FORMATS[countryCode].format
    let formatted = ''
    let digitIndex = 0

    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      if (format[i] === 'X') {
        formatted += digits[digitIndex]
        digitIndex++
      } else {
        formatted += format[i]
      }
    }

    return formatted
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input, selectedCountry)
    setPhoneNumber(formatted)
  }

  const handleCountryChange = (countryCode: CountryCode) => {
    setSelectedCountry(countryCode)
    setIsDropdownOpen(false)
    // Reformater le numéro avec le nouveau format
    if (phoneNumber) {
      const digits = phoneNumber.replace(/\D/g, '')
      const formatted = formatPhoneNumber(digits, countryCode)
      setPhoneNumber(formatted)
    }
  }

  // Validation
  const isValid = !phoneNumber || currentFormat.regex.test(phoneNumber.replace(/\D/g, ''))

  return (
    <div className={className}>
      <div className="flex gap-2">
        {/* Sélecteur de pays */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-3 h-[50px] rounded-xl border border-ag-border bg-white hover:border-ag-apex/60 focus:border-ag-apex focus:outline-none focus:ring-2 focus:ring-ag-apex/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg">{COUNTRIES.find(c => c.code === selectedCountry)?.flag}</span>
            <span className="font-mono text-[13px] text-ag-gray">{currentFormat.code}</span>
            <ChevronDown className="w-4 h-4 text-ag-gray" />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-ag-border rounded-xl shadow-lg max-h-64 overflow-y-auto z-20">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountryChange(country.code)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-ag-off-white transition-colors text-left"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-[13px] text-ag-dark">{country.name}</span>
                    <span className="font-mono text-[12px] text-ag-gray">{PHONE_FORMATS[country.code].code}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Input numéro */}
        <div className="flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handleNumberChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder || currentFormat.placeholder}
            className={`w-full px-4 py-3 rounded-xl border ${
              error || (!isValid && phoneNumber)
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                : 'border-ag-border focus:border-ag-apex focus:ring-ag-apex/10'
            } bg-white text-[14px] text-ag-dark placeholder-ag-gray-light outline-none transition-colors focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <p className="mt-1 text-[12px] text-red-600">{error}</p>
      )}
      {!error && !isValid && phoneNumber && (
        <p className="mt-1 text-[12px] text-orange-600">
          Format attendu : {currentFormat.format}
        </p>
      )}
      
      {/* Aide format */}
      {!error && !phoneNumber && (
        <p className="mt-1 text-[11px] text-ag-gray-light">
          Format : {currentFormat.code} {currentFormat.placeholder}
        </p>
      )}
    </div>
  )
}
