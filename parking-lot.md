# Parking Lot — Éléments archivés (à réactiver sur décision)

---

## Espace Client — Chemins bloqués en production

**Bloqué le :** 29/07/2026  
**Condition :** `VERCEL_ENV === 'production'` (serveur) ou `NEXT_PUBLIC_VERCEL_ENV === 'production'` (client)  
**Raison :** Problèmes d'hydratation React + navigation compte non résolus — à réouvrir après stabilisation

### Chemins bloqués et mécanisme

| Chemin / Élément | Fichier | Mécanisme |
|---|---|---|
| `/client/login` (URL directe) | `app/client/login/page.tsx:18` | `if (process.env.VERCEL_ENV === 'production') redirect('/')` |
| `/client/register` (URL directe) | `app/client/register/page.tsx:14` | `if (process.env.VERCEL_ENV === 'production') redirect('/')` |
| Nav desktop — bouton connexion | `components/layout/Nav.tsx:333` | `process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'` → `<span>` grisé + badge "Soon" |
| Nav mobile — bouton connexion | `components/layout/Nav.tsx:521` | idem |
| `/auction/catalog` — CTA login + register | `app/[locale]/auction/catalog/page.tsx:153` | `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` |
| `/auction/sessions` — lien register | `app/[locale]/auction/sessions/page.tsx:120` | `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` |
| `/grade/submit/success` — bouton "Accéder à mon espace" | `app/[locale]/grade/submit/success/page.tsx:33` | `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` |

### Pour réouvrir (tout ou partie)

**Réouvrir login + register (URLs directes) :**
- `app/client/login/page.tsx` : supprimer la ligne `if (process.env.VERCEL_ENV === 'production') redirect('/')`
- `app/client/register/page.tsx` : idem

**Réouvrir le bouton connexion dans la Nav :**
- `components/layout/Nav.tsx` : remplacer les deux blocs `{process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? (<span>...) : (<NextLink>...)}` par directement `<NextLink href="/client/login">` (desktop ligne ~333, mobile ligne ~521)

**Réouvrir les CTA dans les pages marketing :**
- `auction/catalog/page.tsx` : retirer la condition `&& process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` ligne 153
- `auction/sessions/page.tsx` : retirer le `{process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && (...)}` autour du lien register
- `grade/submit/success/page.tsx` : retirer le `{process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && (...)}` autour du NextLink

### Global-error en production
`app/global-error.tsx` : `useEffect` déclenche `window.location.reload()` automatiquement si `NEXT_PUBLIC_VERCEL_ENV === 'production'`. Pour désactiver, supprimer le `useEffect` et le `if (isProd)` dans ce fichier.

---

## Meta Pixel — ID à configurer

**Archivé le :** 26/07/2026  
**Statut :** Composant prêt (`components/analytics/MetaPixel.tsx`) — en attente de l'ID

### Pour activer
Dans Vercel → Environment Variables :
```
NEXT_PUBLIC_META_PIXEL_ID = <ID depuis Meta Business Manager>
```
Le composant se charge automatiquement après consentement cookie (cookie_consent_updated).  
Aucune modification de code requise.

---

## Assessment Days — Page & Feature complète

**Archivé le :** 28/07/2026  
**Statut :** Masqué — page prête, namespace i18n complet × 6 langues, pas de route active

### Description
Journées d'expertise gratuites sur rendez-vous dans 4 villes européennes. Pre-screening confidentiel 45 min, estimation de grade indicatif, fourchette de valorisation.

### Pour réactiver
1. Créer `app/[locale]/auction/assessment-days/page.tsx` (ou renommer le dossier si créé)
2. Supprimer la redirection dans `next.config.ts` : `{ source: '/:locale/auction/assessment-days', destination: '/:locale/auction/sessions', permanent: true }`
3. Ajouter le lien dans `Nav.tsx` (menu Enchères) avec la clé `nav.auctionAssessment`
4. Ajouter le lien dans `i18n/routing.ts` pathnames

### Clés i18n
- Namespace : `assessmentDays` (complet × 6 langues dans les fichiers JSON)
- Clé nav : `nav.auctionAssessment` = `"Assessment Days"` (identique × 6 langues)
- Clé gradeEngine : `gradeEngine.ngNote` contient un CTA vers Assessment Day
- Clé gradeEngine : `gradeEngine.ctaAssessment` = bouton de réservation

### Note
`nav.auctionAssessment` a été retiré des 6 fichiers JSON le 28/07/2026 car non référencé dans Nav.tsx. À rétablir lors de la réactivation.

---

## Section "/ THE FOUNDER" — Page About

**Archivé le :** 26/07/2026  
**Statut :** Masquée — prête à réactiver

### Pour réactiver

1. Dans `app/[locale]/about/page.tsx`, ajouter :
   ```tsx
   import { FounderSection } from '@/components/sections/FounderSection'
   ```
2. Remettre le bloc juste avant le CTA navy :
   ```tsx
   {/* Founder — Rolex-style scroll reveal */}
   <FounderSection />
   ```

### Composant
`components/sections/FounderSection.tsx` — GSAP pinned scroll, photo plein-section, overlay noir progressif, bio Yohann Bollack, liens LinkedIn + contact.

### Traductions utilisées
Namespace `about`, clés : `founder.label`, `founder.role`, `founder.bio1`, `founder.bio2`, `founder.cta`
