# Parking Lot — Éléments archivés (à réactiver sur décision)

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
