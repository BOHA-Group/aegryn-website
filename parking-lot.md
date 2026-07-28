# Parking Lot — Éléments archivés (à réactiver sur décision)

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
