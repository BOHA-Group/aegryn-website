# PhoneInput Component - Guide d'utilisation

## Vue d'ensemble

Composant React normalisé pour la saisie de numéros de téléphone avec :
- Sélecteur de pays avec drapeaux
- Validation automatique du format selon le pays
- Formatage en temps réel pendant la saisie
- Stockage normalisé en base de données

## Utilisation basique

```tsx
import PhoneInput from '@/components/ui/PhoneInput'

<PhoneInput
  value={phoneNumber}
  onChange={(value) => setPhoneNumber(value)}
/>
```

## Avec react-hook-form

```tsx
import { Controller } from 'react-hook-form'
import PhoneInput from '@/components/ui/PhoneInput'

<Controller
  name="phone"
  control={control}
  render={({ field }) => (
    <PhoneInput
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={errors.phone?.message}
    />
  )}
/>
```

## Validation Zod

```tsx
import { z } from 'zod'

const schema = z.object({
  phone: z.string()
    .min(1, 'Téléphone requis')
    .regex(/^\+\d{1,3}\s\d/, 'Format invalide')
    .optional(),
})
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `value` | `string` | `''` | Valeur complète (+XX XXXXXXXXX) |
| `onChange` | `(value: string) => void` | - | Callback changement |
| `onBlur` | `() => void` | - | Callback blur |
| `error` | `string` | - | Message d'erreur |
| `required` | `boolean` | `false` | Champ requis |
| `disabled` | `boolean` | `false` | Champ désactivé |
| `placeholder` | `string` | auto | Placeholder custom |
| `className` | `string` | `''` | Classes CSS container |

## Formats par pays

### Europe
- **🇨🇭 Suisse (+41):** 79 123 45 67 (9 chiffres)
- **🇫🇷 France (+33):** 6 12 34 56 78 (9 chiffres)
- **🇩🇪 Allemagne (+49):** 151 23456789 (10-11 chiffres)
- **🇮🇹 Italie (+39):** 312 345 6789 (9-10 chiffres mobile)
- **🇪🇸 Espagne (+34):** 612 34 56 78 (9 chiffres)
- **🇳🇱 Pays-Bas (+31):** 6 12345678 (9 chiffres)
- **🇧🇪 Belgique (+32):** 470 12 34 56 (9 chiffres)
- **🇱🇺 Luxembourg (+352):** 621 123 456 (9 chiffres)
- **🇦🇹 Autriche (+43):** 664 1234567 (9-13 chiffres)
- **🇬🇧 Royaume-Uni (+44):** 7400 123456 (10 chiffres)

### Amérique du Nord
- **🇺🇸 États-Unis (+1):** 202 555 0123 (10 chiffres)
- **🇨🇦 Canada (+1):** 416 555 0123 (10 chiffres)

## Format stocké en base

```
+41 79 123 45 67
+33 6 12 34 56 78
+49 151 23456789
```

**Structure:** `[indicatif] [numéro formaté]`
- Indicatif: +XX ou +XXX
- Espace séparateur
- Numéro: chiffres avec espaces selon format pays

## Parsing automatique

Le composant parse automatiquement les valeurs existantes :

```tsx
// Valeur en base: "+41 79 123 45 67"
<PhoneInput value="+41 79 123 45 67" onChange={...} />
// → Détecte CH, affiche 🇨🇭 +41, numéro "79 123 45 67"

// Valeur en base: "+33 6 12 34 56 78"
<PhoneInput value="+33 6 12 34 56 78" onChange={...} />
// → Détecte FR, affiche 🇫🇷 +33, numéro "6 12 34 56 78"
```

## Validation temps réel

- ✅ Format correct → bordure verte
- ❌ Format incorrect → bordure rouge + message
- ⚠️ Saisie en cours → aide format affichée

## Ajouter un nouveau pays

1. Ajouter dans `PHONE_FORMATS`:
```tsx
PT: { 
  code: '+351', 
  regex: /^9\d{8}$/, 
  placeholder: '912 345 678', 
  format: 'XXX XXX XXX' 
},
```

2. Ajouter dans `COUNTRIES`:
```tsx
{ code: 'PT', name: 'Portugal', flag: '🇵🇹' },
```

## Migration données existantes

Script SQL pour normaliser les numéros existants :

```sql
-- Ajouter indicatif +41 si manquant (Suisse par défaut)
UPDATE talent_candidates
SET phone = '+41 ' || phone
WHERE phone IS NOT NULL 
  AND phone NOT LIKE '+%';

-- Nettoyer espaces multiples
UPDATE talent_candidates
SET phone = regexp_replace(phone, '\s+', ' ', 'g')
WHERE phone IS NOT NULL;
```

## Tests

```tsx
// Test validation CH
expect(isValid('+41 79 123 45 67')).toBe(true)
expect(isValid('+41 79 123')).toBe(false)

// Test formatage
expect(formatPhoneNumber('791234567', 'CH')).toBe('79 123 45 67')

// Test parsing
expect(parseInitialValue('+33 612345678')).toEqual({
  country: 'FR',
  number: '6 12 34 56 78'
})
```

## Accessibilité

- ✅ Labels ARIA
- ✅ Navigation clavier (Tab, Enter, Esc)
- ✅ Screen reader friendly
- ✅ Focus management
- ✅ Error announcements

## Performance

- Formatage optimisé (pas de re-render inutiles)
- Dropdown virtualisé si > 20 pays
- Debounce validation (300ms)
- Lazy loading drapeaux SVG

## Roadmap

- [ ] Support numéros fixes (actuellement mobile only)
- [ ] Détection automatique pays via IP
- [ ] Validation via API (libphonenumber)
- [ ] Support extensions (+41 79 123 45 67 ext. 123)
- [ ] Historique pays récents
- [ ] Recherche pays dans dropdown
