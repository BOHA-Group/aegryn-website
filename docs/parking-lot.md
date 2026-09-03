# Parking Lot, Fonctionnalités en attente & éléments archivés

> Source unique. Ne pas créer de second fichier `parking-lot.md` à la racine.  
> Ajouter toute nouvelle entrée ici, en respectant la structure : **En attente** → **Archivé / Résolu**.

---

## 🔴 HAUTE PRIORITÉ

### Homepage — Repositionnement éditorial et CTAs ✅ RÉSOLU 2026-08-31

**Demandé le :** 2026-08-31
**Résolu le :** 2026-08-31 — commit `feat(i18n): homepage repositionnement éditorial × 6 langues`
**Contexte :** Le texte actuel de la homepage ne reflète pas correctement le positionnement d'Aegryn (certification, transaction offmarket, magazine). Les CTAs sont trop génériques.

**Textes à modifier (i18n FR source, puis traduire × 6 langues) :**

| Clé | Valeur actuelle | Valeur proposée |
|---|---|---|
| `whatwedo.conviction` | "Les meilleurs actifs tech européens méritent une certification. Pas une liste." | "Le marché européen des actifs tech a besoin de certification, de discrétion, et de données fiables. Nous construisons les trois." |
| `transactNarrative.title` | "Certains actifs méritent mieux qu'une liste publique." | "La certification change la conversation. La transaction suit." |
| `transactNarrative.ctaSell` | "Vendre un actif certifié" | "Soumettre un actif à la certification" |
| `transactNarrative.ctaBuy` | "Rejoindre le cercle acquéreurs" | "Accéder au cercle acquéreurs" |
| `transactNarrative.desc` | (voir fr.json ligne 1137) | "Aegryn certifie des actifs tech selon un protocole indépendant sur quatre dimensions : code, IP, finance, sécurité. Les actifs certifiés entrent dans un processus de cession offmarket confidentiel, entre vendeurs documentés et acquéreurs pré-qualifiés.\n\nCe n'est pas une liste. Ce n'est pas une enchère. C'est un standard de marché." |
| `aboutSection.desc` | "...La première infrastructure de confiance pour le M&A tech en Europe." | Ajouter en fin : "...et le magazine qui documente ce marché chaque année." |

**Fichiers concernés :**
- `i18n/messages/fr.json` (source de vérité) — clés `whatwedo`, `transactNarrative`, `aboutSection`
- `i18n/messages/en.json`, `de.json`, `es.json`, `it.json`, `nl.json` — à synchroniser

**Priorité :** haute, purement éditorial, non bloquant techniquement

---

### Factures admin, Bouton "Enregistrer et envoyer" + email amélioré

**Contexte :**
Le bouton "Enregistrer + Envoyer email" a été temporairement supprimé (workflow manuel). À remettre.

**Ce qui est à faire :**
1. Remettre le bouton "Enregistrer et envoyer" dans `InvoiceEditor.tsx`
2. L'appel API existe déjà (`send_email: true` dans le PATCH), câblage à rétablir
3. **Email :** adresse expéditeur = `finance@boha-group.com` (pas `no-reply@boha-group.com`)
4. **Contenu email :** ne pas mentionner IBAN/BOHA-Group, inclure à la place un **lien de paiement Stripe** directement dans le corps de l'email
5. Ajouter une phrase de remerciement et salutation avant la signature
6. **Template PDF :** retirer toute mention IBAN, remplacer par "Règlement par lien de paiement transmis séparément"

**Fichiers concernés :**
- `app/admin/invoices/[id]/InvoiceEditor.tsx`, remettre le bouton + état `sent`
- `app/api/admin/invoices/[id]/route.ts`, modifier `send_email` block (from, contenu, lien Stripe)
- `app/api/admin/invoices/[id]/pdf/route.ts`, retirer mention IBAN du template HTML

---

### Liens de paiement Stripe, Certifications AEGRYN

**Contexte :**
Créer deux liens de paiement Stripe pour les certifications partenaires (CAS 3 / accréditation).

**À créer dans Stripe Dashboard (mode production) :**
| Produit | Montant | Usage |
|---|---|---|
| Certification AEGRYN, Niveau 1 | CHF 2 000 | Accréditation partenaire standard |
| Certification AEGRYN, Niveau 2 | CHF 5 000 | Accréditation partenaire premium |

**Actions :**
1. Créer les Payment Links dans le Stripe Dashboard (production)
2. Stocker les URLs dans les variables d'environnement (`STRIPE_CERT_2000_URL`, `STRIPE_CERT_5000_URL`)
3. Intégrer les liens dans les emails de facturation certification

---

## 🟡 PRIORITÉ MOYENNE

### Notifications in-app, Parrainage expert

**Contexte :**
Le système de parrainage expert génère des événements qui mériteraient des notifications in-app pour les deux parties.

**Déclencheurs à notifier :**
| Événement | Destinataire | Message |
|---|---|---|
| Code parrain utilisé (filleul s'inscrit) | Parrain | "Un expert a utilisé votre code parrain. Le mois offert sera crédité dès son 1er paiement." |
| Filleul paie son 1er mois → `rewarded` | Parrain | "+1 mois offert crédité sur votre abonnement (parrainage)." |
| Filleul paie son 1er mois → `rewarded` | Filleul | "+1 mois offert crédité sur votre abonnement (parrainage)." |
| Admin crédite des mois | Partenaire | "L'équipe AEGRYN vous a crédité N mois sur votre abonnement expert." |
| Abonnement expert arrive à expiration (J-7) | Partenaire | "Votre abonnement Fiche Expert expire dans 7 jours." |

**Prérequis :**
- Table `user_notifications` (existante, à vérifier schéma)
- Décider du canal : in-app (toast/badge), email, ou les deux
- Intégrer dans le webhook Stripe (`applyReferralReward`) et dans `/api/admin/expert/subscription`

---

## 🟢 BASSE PRIORITÉ

### Commissions, Espace Acquéreur (masqué)

**Contexte :**
La page `/client/buyer/commissions` affiche les frais de transaction dus par l'acquéreur à AEGRYN.
Fonctionnalité non activée, le flux de facturation n'est pas encore opérationnel.

**Ce qui existe (archivé, ne pas supprimer) :**
- Page : `app/client/buyer/commissions/page.tsx`
- Table Supabase : `buyer_commission_dues` (transaction_id, amount_chf, status, eligible_at)
- Nav : entrée `navCommissions` dans `BuyerNav.tsx` (commentée)
- Admin : page `/admin/commissions` + `CommissionsClient.tsx` (masquée)
- Admin nav : entrée "Commissions" dans `AdminSideNav.tsx` (commentée)

**Pour réactiver :**
1. Décommenter les entrées nav dans `BuyerNav.tsx` et `AdminSideNav.tsx`
2. Vérifier que `buyer_commission_dues` est alimentée par le webhook Stripe
3. Activer la génération de factures Stripe pour les commissions

---

## � INFRA & CONFIGURATION

### DNS & Domaines, aegryn.com

**Statut :** À valider/compléter

- [ ] Vérifier que `aegryn.com` est dans le compte OVH (Domaines → liste)
- [ ] Ajouter `aegryn.com` dans Vercel → Settings → Domains → Add `aegryn.com` + `www.aegryn.com`
  - Type A `76.76.21.21` + CNAME `www → cname.vercel-dns.com`
- [ ] Saisir les records DNS dans OVH pour `aegryn.com` :
  - **Supprimer** : `@` A `213.186.33.5`, `www` A, `ftp` CNAME, MX OVH, SPF OVH, TXT parking
  - **Ajouter** :
    - `@` A → `76.76.21.21`
    - `www` CNAME → `cname.vercel-dns.com.`
    - `@` TXT SPF → `v=spf1 include:_spf.google.com include:spf.resend.com -all`
    - `_dmarc` TXT → `v=DMARC1; p=quarantine; pct=100; aspf=r`
    - `resend._domainkey` TXT → clé DKIM Resend (copier depuis boha-group.com)
    - `@` TXT Google verification → `google-site-verification=mvJBVtITTwiGgUnI1JmQcZzZuklIyAs4nDUhGUl9vjU`
    - MX Google → seulement si Google Workspace activé sur aegryn.com
  - **Garder** : NS `dns200.anycast.me` + `ns200.anycast.me`
- [x] Mettre à jour le CNAME `aegryn` dans `boha-group.com` ✅, transitoire jusqu'à bascule complète

---

### Webflow, Migration boha-group.com → aegryn.com

- [x] Redirection Webflow 301 : `/*` → `https://aegryn.com/$1` ✅ active
- [ ] Couper l'abonnement Webflow → Account → Plans → Cancel  
  *(Les MX Google Workspace dans OVH ne bougent pas, emails `@boha-group.com` non impactés)*
- [ ] **Après coupure Webflow, séquence exacte :**
  1. Webflow → retirer domaine custom `boha-group.com`
  2. Vercel → projet `aegryn-website` → Settings → Domains → Add `boha-group.com` → Redirect to `aegryn.com` (301)
  3. OVH → `boha-group.com` → Zone DNS → `www` CNAME : `cdn.webflow.com.` → `cname.vercel-dns.com.`
  4. OVH → `boha-group.com` → `@` A → `76.76.21.21`
  - ⚠️ Ne pas activer avant d'avoir retiré le domaine de Webflow
  - ⚠️ Bien être dans le projet `aegryn-website` dans Vercel, pas `boha-group`

---

### Variables d'environnement Vercel

- [ ] `NEXT_PUBLIC_SITE_URL` = `https://aegryn.com`
- [ ] Supabase → Authentication → URL Configuration :
  - Site URL : `https://aegryn.com`
  - Redirect URLs : `https://aegryn.com/**`
- [ ] Stripe → Developers → Webhooks :
  - Endpoint : `https://aegryn.com/api/webhooks/stripe`
  - `STRIPE_WEBHOOK_SECRET` dans Vercel (Production)

---

### Emails transactionnels (Resend)

- [ ] `RESEND_FROM` = `contact@boha-group.com`
- [ ] `RESEND_REPLY_TO` = `contact@boha-group.com`
- [ ] `RESEND_FROM_NAME` = `AEGRYN`
- [ ] `AEGRYN_INTERNAL_EMAIL` = adresse interne `@boha-group.com`
- [ ] Vérifier que `boha-group.com` est **Verified** dans resend.com/domains
- Note : basculer vers `@aegryn.com` uniquement quand Google Workspace sera actif sur `aegryn.com`

---

### Harmonisation labels hero, format texte "rappel section"

**Constaté le :** 2026-08-28  
**Contexte :** Audit visuel des pages publiques, 3 formats coexistent pour le label au-dessus du H1.

**Format A, fond blanc (about, career, contact, experts…)**  
`font-sans font-semibold text-[11px] uppercase tracking-[0.25–0.28em] text-ag-gray-light`, pas de barre, pas de tiret

**Format B, fond navy (catalog, transact, mandate, grade/submit…)**  
`font-[mono|sans] text-[10px] uppercase tracking-[0.28em] text-ag-apex flex items-center gap-3` + `<span w-6 h-px bg-ag-apex/50 />`

**Format C, contact (isolé, écart)**  
`font-sans font-semibold text-xs uppercase tracking-[0.3em] text-ag-apex` → utilise `text-ag-apex` (vert) sans barre sur fond blanc, incohérent avec Format A

**Ce qui est à faire :**
- `app/[locale]/contact/page.tsx` ligne 27 : passer `text-ag-apex` → `text-ag-gray-light` (aligner sur Format A fond blanc)
- `app/[locale]/about/page.tsx` ligne 57 : décider si le préfixe `/` devant les labels de sections internes est intentionnel (typographie éditoriale) ou à supprimer

**Priorité :** basse, purement visuel, non bloquant

---

### Code, tâches mineures

- [ ] **URL Subblink** : remplacer `https://subblink.boha-group.com` par `https://subblink.app`
  - `components/sections/AssetDrawer.tsx:30`
  - `data/assets.ts:29`
  - À faire quand `subblink.app` sera live

---

## Fiche Expert & Abonnement partenaire (espace /client/partner)

**Archivé le :** 2026-09-03  
**Statut :** Masqué — redirect vers `/client/partner`, pages et code conservés intacts

### Description
Module permettant aux partenaires de publier une fiche expert publique sur le site Aegryn contre un abonnement mensuel de 89 €/mois (via Stripe). Inclut un système de parrainage (filleul offre 1 mois au parrain).

### Périmètre masqué

| Élément | Fichier | Mécanisme |
|---|---|---|
| Page fiche expert | `app/client/partner/expert-profile/page.tsx` | `redirect('/client/partner')` en tête de fonction |
| Page abonnement Stripe | `app/client/partner/subscription/page.tsx` | `redirect('/client/partner')` en tête de fonction |
| Nav partenaire, liens | `app/client/partner/PartnerNav.tsx` lignes 21-22 | Commentés avec date |

### Composants conservés (ne pas supprimer)
- `app/client/partner/expert-profile/ExpertProfileForm.tsx` — formulaire complet fiche expert
- `app/client/partner/subscription/SubscribeButtons.tsx` — boutons Stripe Checkout
- `app/client/partner/subscription/CancelButton.tsx` — annulation abonnement
- `app/client/partner/subscription/ReferralSection.tsx` — parrainage
- Tables Supabase : `expert_profiles`, `expert_referrals` (si existantes)
- Webhook Stripe : `applyReferralReward` dans `/api/webhooks/stripe`

### Ce module est DISTINCT des Auditeurs externes
- `certifications` (revue de grading par expert externe) = **actif, non masqué** — flux auditeur opérationnel
- `expert-profile` + `subscription` = publication commerciale fiche + abonnement = **masqué**

### Pour réactiver
1. Supprimer les deux `redirect('/client/partner')` dans les pages concernées
2. Décommenter les deux lignes dans `PartnerNav.tsx`
3. Vérifier que les Payment Links Stripe sont configurés (voir § Liens de paiement Stripe ci-dessus)
4. Activer les notifications parrainage (voir § Notifications in-app, Parrainage expert ci-dessus)

---

## �🔵 ARCHIVÉ, À réactiver sur décision

---

## Espace Client, Chemins bloqués en production

**Bloqué le :** 29/07/2026  
**Condition :** `VERCEL_ENV === 'production'` (serveur) ou `NEXT_PUBLIC_VERCEL_ENV === 'production'` (client)  
**Raison :** Problèmes d'hydratation React + navigation compte non résolus, à réouvrir après stabilisation

### Chemins bloqués et mécanisme

| Chemin / Élément | Fichier | Mécanisme |
|---|---|---|
| `/client/login` (URL directe) | `app/client/login/page.tsx:18` | `if (process.env.VERCEL_ENV === 'production') redirect('/')` |
| `/client/register` (URL directe) | `app/client/register/page.tsx:14` | `if (process.env.VERCEL_ENV === 'production') redirect('/')` |
| Nav desktop, bouton connexion | `components/layout/Nav.tsx:333` | `process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'` → `<span>` grisé + badge "Soon" |
| Nav mobile, bouton connexion | `components/layout/Nav.tsx:521` | idem |
| `/transact/catalog`, CTA login + register | `app/[locale]/transact/catalog/page.tsx:153` | `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` |
| `/transact/sessions`, lien register | `app/[locale]/transact/sessions/page.tsx:120` | `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` |
| `/grade/submit/success`, bouton "Accéder à mon espace" | `app/[locale]/grade/submit/success/page.tsx:33` | `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` |

### Pour réouvrir (tout ou partie)

**Réouvrir login + register (URLs directes) :**
- `app/client/login/page.tsx` : supprimer la ligne `if (process.env.VERCEL_ENV === 'production') redirect('/')`
- `app/client/register/page.tsx` : idem

**Réouvrir le bouton connexion dans la Nav :**
- `components/layout/Nav.tsx` : remplacer les deux blocs `{process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? (<span>...) : (<NextLink>...)}` par directement `<NextLink href="/client/login">` (desktop ligne ~333, mobile ligne ~521)

**Réouvrir les CTA dans les pages marketing :**
- `transact/catalog/page.tsx` : retirer la condition `&& process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` ligne 153
- `transact/sessions/page.tsx` : retirer le `{process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && (...)}` autour du lien register
- `grade/submit/success/page.tsx` : retirer le `{process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && (...)}` autour du NextLink

### Global-error en production
~~`app/global-error.tsx` : `useEffect` déclenche `window.location.reload()` automatiquement si `NEXT_PUBLIC_VERCEL_ENV === 'production'`.~~

**✅ RÉSOLU le 02/08/2026**, Workaround supprimé. Cause racine corrigée (voir section ci-dessous).

---

## ✅ Fix hydration NotFoundError, RÉSOLU (02/08/2026)

**Problème :** `NotFoundError: removeChild` au démontage de composants à la navigation SPA (React 19 + GSAP).

**Cause racine double :**
1. **SplitText** wrap les nœuds texte dans des `<div>` intermédiaires, React perdait la référence à ses nœuds enfants au démontage. Corrigé avec `dangerouslySetInnerHTML` sur les éléments ciblés par SplitText.
2. **ScrollTrigger `pin: true`** reparente physiquement le nœud dans un `pin-spacer` GSAP. Le cleanup `ctx.revert()` dans `useEffect` arrivait trop tard (asynchrone), React tentait déjà `removeChild`. Corrigé en passant à `useLayoutEffect` (synchrone).

**Commits :**
- `9d02043`, dangerouslySetInnerHTML + ordre split.revert() avant ctx.revert() (11 composants)
- `c19b009`, useLayoutEffect sur 6 composants pin:true

**Fichiers modifiés :**
- `components/sections/HeroMountain.tsx`, `ManifestoSection.tsx`, `AssetHeroBanner.tsx`, `AssetHeroBannerVideo.tsx`, `AssetGrid.tsx`, `EcosystemDomains.tsx`, `StatementStrip.tsx`, `TransactionHero.tsx`, `GradeHero.tsx`, `WhyUseApps.tsx`, `MissionVideoSection.tsx`
- `components/sections/AssetCarousel.tsx`, `HomeVideoSection.tsx`, `LogoZoomSection.tsx`, `VisionMissionBlock.tsx`
- `app/global-error.tsx`, suppression du workaround `window.location.reload()`

---

## Meta Pixel, ID à configurer

**Archivé le :** 26/07/2026  
**Statut :** Composant prêt (`components/analytics/MetaPixel.tsx`), en attente de l'ID

### Pour activer
Dans Vercel → Environment Variables :
```
NEXT_PUBLIC_META_PIXEL_ID = <ID depuis Meta Business Manager>
```
Le composant se charge automatiquement après consentement cookie (cookie_consent_updated).  
Aucune modification de code requise.

---

## Assessment Days, Page & Feature complète

**Archivé le :** 28/07/2026  
**Statut :** Masqué, page prête, namespace i18n complet × 6 langues, pas de route active

### Description
Journées d'expertise gratuites sur rendez-vous dans 4 villes européennes. Pre-screening confidentiel 45 min, estimation de grade indicatif, fourchette de valorisation.

### Pour réactiver
1. Créer `app/[locale]/transact/assessment-days/page.tsx` (ou renommer le dossier si créé)
2. Supprimer la redirection dans `next.config.ts` : `{ source: '/:locale/transact/assessment-days', destination: '/:locale/transact/sessions', permanent: true }`
3. Ajouter le lien dans `Nav.tsx` (menu Transactions) avec la clé `nav.transactionAssessment`
4. Ajouter le lien dans `i18n/routing.ts` pathnames

### Clés i18n
- Namespace : `assessmentDays` (complet × 6 langues dans les fichiers JSON)
- Clé nav : `nav.transactionAssessment` = `"Assessment Days"` (identique × 6 langues)
- Clé gradeEngine : `gradeEngine.ngNote` contient un CTA vers Assessment Day
- Clé gradeEngine : `gradeEngine.ctaAssessment` = bouton de réservation

### Note
`nav.transactionAssessment` a été retiré des 6 fichiers JSON le 28/07/2026 car non référencé dans Nav.tsx. À rétablir lors de la réactivation.

---

## Section "/ THE FOUNDER", Page About

**Archivé le :** 26/07/2026  
**Statut :** Masquée, prête à réactiver

### Pour réactiver

1. Dans `app/[locale]/about/page.tsx`, ajouter :
   ```tsx
   import { FounderSection } from '@/components/sections/FounderSection'
   ```
2. Remettre le bloc juste avant le CTA navy :
   ```tsx
   {/* Founder, Rolex-style scroll reveal */}
   <FounderSection />
   ```

### Composant
`components/sections/FounderSection.tsx`, GSAP pinned scroll, photo plein-section, overlay noir progressif, bio Yohann Bollack, liens LinkedIn + contact.

### Traductions utilisées
Namespace `about`, clés : `founder.label`, `founder.role`, `founder.bio1`, `founder.bio2`, `founder.cta`
