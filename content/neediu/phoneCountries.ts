/**
 * Indicatifs téléphoniques : mêmes pays, longueurs et formats que le sélecteur de l'app neediu
 * (`neediu-app/apps/mobile/constants/phoneCountries.ts` : UE 27, Suisse, Norvège).
 * [code ISO, indicatif, nombre de chiffres du numéro national, format]
 */
export const PHONE_COUNTRIES = [
  ['AT', '+43', 10, 'XXXX XXXXXX'], ['BE', '+32', 9, 'XXX XX XX XX'], ['BG', '+359', 9, 'XXX XXX XXX'],
  ['HR', '+385', 9, 'XX XXX XXXX'], ['CY', '+357', 8, 'XX XXX XXX'], ['CZ', '+420', 9, 'XXX XXX XXX'],
  ['DK', '+45', 8, 'XX XX XX XX'], ['EE', '+372', 8, 'XXXX XXXX'], ['FI', '+358', 9, 'XX XXX XXXX'],
  ['FR', '+33', 9, 'X XX XX XX XX'], ['DE', '+49', 10, 'XXXX XXXXXX'], ['GR', '+30', 10, 'XXX XXX XXXX'],
  ['HU', '+36', 9, 'XX XXX XXXX'], ['IE', '+353', 9, 'XX XXX XXXX'], ['IT', '+39', 10, 'XXX XXX XXXX'],
  ['LV', '+371', 8, 'XXXX XXXX'], ['LT', '+370', 8, 'XXX XXXXX'], ['LU', '+352', 9, 'XXX XXX XXX'],
  ['MT', '+356', 8, 'XXXX XXXX'], ['NL', '+31', 9, 'X XXXX XXXX'], ['PL', '+48', 9, 'XXX XXX XXX'],
  ['PT', '+351', 9, 'XXX XXX XXX'], ['RO', '+40', 9, 'XXX XXX XXX'], ['SK', '+421', 9, 'XXX XXX XXX'],
  ['SI', '+386', 8, 'XX XXX XXX'], ['ES', '+34', 9, 'XXX XXX XXX'], ['SE', '+46', 9, 'XX XXX XX XX'],
  ['CH', '+41', 9, 'XX XXX XX XX'], ['NO', '+47', 8, 'XXX XX XXX'],
].map(([code, dial, digits, fmt]) => ({ code: code as string, dial: dial as string, digits: digits as number, fmt: fmt as string }))

/** Exemple grisé du format du pays : « XX XXX XX XX » devient « 79 123 45 67 ». */
export const phoneExample = (fmt: string) => {
  const digits = '7912345678901234'
  let i = 0
  return fmt.replace(/X/g, () => digits[i++ % digits.length])
}
