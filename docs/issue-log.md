# Issue Log — Bugs résolus

Chronologie des bugs diagnostiqués et corrigés sur le projet AEGRYN.

---

## ✅ ISSue-001 — Re-login immédiat dans l'espace client (session perdue)

**Détecté :** 02/08/2026  
**Résolu :** 02/08/2026  
**Commit fix :** `e79dedf` — `fix(cookie-script): charger directement via Script afterInteractive dans layout.tsx`  
**Environnement :** Vercel Preview (non reproductible en local)

### Symptôme

Après login réussi dans l'espace client (`/client/login`), tout clic sur un item du menu vertical (Tableau de bord, KYC, Mon compte, etc.) déclenchait immédiatement une redirection vers `/client/login`. L'overlay debug affichait :

```
NO SESSION
sb-cookies: aucun
```

Les logs Vercel confirmaient :

```
[MW] /client/account cookies=2 sb=NONE names=["ag-locale-pref","NEXT_LOCALE"]
[MW] getSession=false
[TRACE] path=/client/seller browser-sb=[] browser-hasSession=false
```

Le cookie `sb-regdgeodxwpqekhcfmmp-auth-token` était absent du navigateur dès la première page post-login.

### Diagnostic

Audit complet mené en plusieurs étapes :

1. **Middleware** (`proxy.ts`) : remplacement de `getClaims()` par `getSession()` pour éviter les échecs WebCrypto/JWKS en Edge Runtime → n'a pas résolu.
2. **Variables d'environnement Vercel** : vérification des clés Supabase (format JWT legacy vs `sb_publishable_`), ajout de `.trim()` → n'a pas résolu.
3. **Race condition GoTrueClient** : `DebugOverlay` créait sa propre instance `createBrowserClient` en parallèle du singleton → fix (réutilisation du singleton `lib/supabase.ts`) → n'a pas résolu seul.
4. **CookieScript en mode auto-blocking** : le dashboard CookieScript affichait **"Installation FAILED"** car le script était chargé indirectement via GTM. CookieScript ne détectant pas sa propre installation, il activait un mode de blocage agressif interceptant les écritures `document.cookie` — y compris le cookie de session Supabase `sb-*`.

### Cause racine

**CookieScript "Installation FAILED"** → auto-blocking de `document.cookie`

Le script CookieScript était chargé via un tag GTM (Google Tag Manager). GTM injecte les scripts dans un contexte isolé que CookieScript ne reconnaît pas comme une "installation valide". Résultat : CookieScript en mode dégradé bloquait les écritures `document.cookie` non-essentielles, incluant le cookie de session Supabase `sb-regdgeodxwpqekhcfmmp-auth-token`.

### Fix appliqué

Chargement de CookieScript **directement** via un tag `<Script>` Next.js dans `app/[locale]/layout.tsx` (stratégie `afterInteractive`) au lieu de passer par GTM :

```tsx
// app/[locale]/layout.tsx — avant (via GTM, indirect)
// GTM chargeait CookieScript → "Installation FAILED"

// Après (direct)
<Script
  id="cookie-script"
  src="https://cdn.cookie-script.com/s/95c60815b4306b9e3350caa17fee93a8.js"
  strategy="afterInteractive"
/>
```

CookieScript détecte désormais correctement son installation, lit le consentement stocké, et ne bloque plus les cookies de session.

### Vérification

- Preview `debug/login-cookie-trace` : AUTH OK visible dans DebugOverlay sur `/client/seller`
- Cookie `sb-regdgeodxwpqekhcfmmp-auth-token` présent après login
- Navigation dans l'espace compte sans redéconnexion

### Fichiers modifiés

| Fichier | Changement |
|---|---|
| `app/[locale]/layout.tsx` | Chargement direct CookieScript via `<Script>` |
| `proxy.ts` | `getClaims()` → `getSession()` + logs `[MW]`/`[ENV]` (debug) |
| `components/debug/DebugOverlay.tsx` | Réutilisation singleton `lib/supabase.ts` |
| `app/api/debug/trace/route.ts` | Nouveau endpoint de traçabilité preview |
| `app/client/login/LoginForm.tsx` | Beacons de trace par étape (preview uniquement) |

---

## ✅ ISSUE-002 — NotFoundError hydration React + GSAP (removeChild)

**Détecté :** 01/08/2026  
**Résolu :** 02/08/2026  
**Commits :** `9d02043`, `c19b009`

> Voir détail complet dans `docs/parking-lot.md` — section "Fix hydration NotFoundError".

---

---

## ✅ ISSUE-003 — Bouton "RECEVOIR" hover invisible (magazine)

**Détecté :** 2026-08-28  
**Résolu :** 2026-08-28  
**Commits :** `543cf08`, `f3a2c4d`  

**Symptôme :** Au survol du bouton "RECEVOIR" sur la page magazine, le texte devenait invisible (blanc sur fond blanc) — `hover:text-white` purgé par Tailwind.  
**Fix :** Déplacement des styles hover vers une classe CSS dédiée `magazine-btn-receive` dans `styles/globals.css` avec valeurs hexadécimales explicites (`#0F1A2B` / `#ffffff`).  
**Fichiers :** `components/magazine/IssueCard.tsx`, `styles/globals.css`

---

## ✅ ISSUE-004 — Mini cover issue-01 affichage incorrect

**Détecté :** 2026-08-28  
**Résolu :** 2026-08-28  
**Commit :** `029f4ba`  

**Symptôme :** La mini-carte du numéro 01 affichait l'image brute en paysage sans overlay ni texte.  
**Fix :** Restauration de l'approche overlay + texte identique au flipbook source, avec `transform: scale(0.369)` sur un conteneur 420×595px.  
**Fichiers :** `components/magazine/IssueMiniCard.tsx`

---

## ✅ ISSUE-005 — Logo navbar : texte "formerly BOHA-Group" et format non officiel

**Détecté :** 2026-08-28  
**Résolu :** 2026-08-28  
**Commits :** `12bd07c`, `2aa8ec4`, `47ae6a3`  

**Symptôme :** La navbar affichait un logo SVG composite non officiel avec la mention "formerly BOHA-Group".  
**Fix :** Remplacement par l'image officielle `logo-aegryn-navbar.jpg` (`public/images/`) via `next/image`, hauteur `h-16` (= hauteur de la navbar), lien `block` pour zone cliquable totale.  
**Fichiers :** `components/layout/Nav.tsx`

---

## ✅ ISSUE-006 — "AEGRYN" isolé dupliqué en haut de la page magazine

**Détecté :** 2026-08-28  
**Résolu :** 2026-08-28  
**Commit :** `47ae6a3`  

**Symptôme :** Un `<p>AEGRYN</p>` redondant avec le logo navbar apparaissait au-dessus du H1 de la page magazine.  
**Fix :** Suppression du paragraphe (lignes 64-66 de `app/[locale]/magazine/page.tsx`).  
**Fichiers :** `app/[locale]/magazine/page.tsx`

---

## ✅ ISSUE-007 — Lien "< CERTIFICATION" parasite en haut de page soumettre

**Détecté :** 2026-08-28  
**Résolu :** 2026-08-28  
**Commit :** `18871ce`  

**Symptôme :** Un lien retour `< CERTIFICATION` non désiré apparaissait en haut du hero de la page "Soumettre pour certification".  
**Fix :** Suppression du bloc `<Link href="/grade">` + nettoyage de l'import `ChevronLeft`.  
**Fichiers :** `app/[locale]/grade/submit/GradeSubmitForm.tsx`

---

*Ce fichier est mis à jour manuellement à chaque bug résolu.*
