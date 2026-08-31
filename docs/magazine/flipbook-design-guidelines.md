# Aegryn Magazine — Flipbook Design Guidelines

**Fichier source unique :** `public/magazine/issue-01/aegryn-magazine-issue-01_1.html`
**Statut :** Issue 01 — 130 pages — "Built to Last"
**Public :** maquettiste / graphiste en charge des futures éditions

Ce document est la référence complète de mise en page du flipbook Aegryn. Il couvre le format, la grille, les gabarits photo/texte, la typographie, les placements publicitaires, l'animation de tournage de page, et l'historique des erreurs corrigées. **Toute nouvelle page ajoutée au flipbook doit respecter ces règles.**

---

## 1. Format & supports

Le flipbook existe sur **trois canaux** à partir d'un seul fichier HTML/CSS :

| Canal | Mécanisme | Ce qui change |
|---|---|---|
| **Web (lecture interactive)** | `page-flip.browser.js` (StPageFlip) anime le tournage de page dans le navigateur | Chrome de lecture (barre d'outils, flèches, miniatures, zoom) visible ; `#pg-source` cachée, dupliquée dans `#fb-book` |
| **Print / export PDF** | `@media print` (2 blocs, l.329 et l.379) : `#pg-source{display:block}`, chrome masqué, `.pg{page-break-after:always}`, `@page{size:420px 595px;margin:0}` | Chaque `.pg` devient une page PDF/papier séparée, dans l'ordre séquentiel — c'est un export "Imprimer" navigateur, pas un pipeline serveur dédié |
| **Édition web (résumé)** | `content/magazine/issue-01/meta.ts` → `sections[].pageRange` affiché dans la sidebar de `app/[locale]/magazine/[issue]/page.tsx` | Simple métadonnée de navigation, n'affecte pas le flipbook lui-même |

**Unité de grille : 1 page = 420 × 595 CSS px**, ratio identique à un A4 portrait (210 × 297 mm). Tout gabarit, marge ou position se calcule en px sur cette grille de 420×595, jamais en %, sauf exceptions documentées (ex. `.ga-photo-top{height:calc(62% - 14px)}`).

Pour les **livrables publicitaires** (annonceurs), la résolution de référence reste le vrai format print : **210 × 297 mm + 3 mm de fond perdu, CMYK, 300 dpi** (cf. §6) — indépendant de la grille 420×595px qui n'est qu'un canevas d'aperçu écran.

---

## 2. Grille de page — zones de sécurité (OBLIGATOIRE sur toute page)

```
┌─────────────────────────────────┐  ← top:0
│   RUNNING HEAD (.rh)   28px     │  zone réservée, jamais de texte dessous
├─────────────────────────────────┤  ← top:28px = début zone contenu
│                                  │
│         CONTENU                 │
│                                  │
├─────────────────────────────────┤  ← bottom:24px = fin zone contenu
│   FOLIO (.pn)          24px     │  zone réservée, jamais de texte dedans
└─────────────────────────────────┘  ← bottom:0
```

- **`.rh`** (running head) : `position:absolute;top:0;height:28px`, filet `.5px solid #e8e4dc`, texte `Section · Sous-titre` centré, `font-size:6px`, `letter-spacing:.3em`, majuscules.
- **`.pn`** (folio / numéro de page) : `position:absolute;bottom:0;height:24px`, filet `.5px solid #e8e4dc`.
- **RÈGLE D'OR :** tout conteneur de texte en position absolue doit respecter `top:28px` / `bottom:24px` (ou plus généreux). Un seul écart toléré : les légendes en surimpression sur photo avec dégradé (`padding-bottom:16-20px` intégré avant leur propre `bottom:22px`, qui reste à ≥ 38px du vrai bord de page).
  - **Erreur passée corrigée :** 5 gabarits utilisaient `bottom:22px` sans padding interne suffisant → texte à 2-9px dans la zone folio. Toujours vérifier avec `scripts/flipbook_overlap_check.py` après toute nouvelle page.
- **Marges de contenu standard** (`.body`) : `padding:16px 28px 14px` (haut/latéral/bas, à l'intérieur des zones top/bottom déjà réservées).

---

## 3. Folio (numéro de page) — règle de parité stricte

**Convention livre physique classique :**

| Parité de la page | Position visuelle | Classe CSS |
|---|---|---|
| **Paire** (2, 4, 6…) | Page de **gauche** d'un spread → folio en bas-**gauche** (coin extérieur) | `.pn-l` (`justify-content:flex-start;padding-left:26px`) |
| **Impaire** (3, 5, 7…) | Page de **droite** d'un spread → folio en bas-**droit** (coin extérieur) | `.pn-r` (`justify-content:flex-end;padding-right:26px`) |

**Le numéro de page doit TOUJOURS être sur le coin extérieur de la page** (jamais côté reliure/spine). C'est la raison de la règle de parité ci-dessus : dans un spread StPageFlip, l'élément à l'index pair du tableau `pages[]` (0-based) est rendu à gauche, l'impair à droite — d'où la correspondance ID-page (1-based) ↔ parité inverse au sens mathématique mais alignée physiquement.

- **Erreur passée corrigée :** un script de renumérotation avait inversé cette règle (impair→gauche, pair→droite) sur 127 pages, plaçant les folios sur les coins **intérieurs**. Toujours valider avec :
  ```python
  # (int(page_id) % 2 == 0) doit être == (classe == 'pn-l')
  ```
- Pages sombres (`.pg-navy`) ajoutent la classe `.pn-dk` en plus de `.pn-l`/`.pn-r` (couleur/filet adaptés au fond foncé).
- Cover (p1) et back cover (dernière page) n'ont **pas** de folio visible (identité visuelle pleine page).

---

## 4. Cover & Back Cover

- **Cover = page 1, toujours seule, jamais paire avec une autre page.** Structure spécifique (pas de `.pg-frame` standard) : image de fond pleine page, titre `Aegryn` massif (90px), tagline, QR code scannable (coin bas-droit, `api.qrserver.com`), bouton fullscreen au hover.
- **Back cover = TOUJOURS la dernière page physique du fichier**, jamais avant. Structure : fond navy `#0F1A2B`, logo AEGRYN centré (`logo-back-cover.png`), tagline "Engineered to Last", mentions légales en pied de page.
  - **Erreur passée corrigée :** la back cover s'est retrouvée en position ~102 lors d'une renumérotation bugguée (dupliquée/mal placée) — toujours vérifier `back cover == dernière page du fichier`.
- **StPageFlip isole nativement cover et back cover** (mode `showCover:true`) **à condition que le nombre total de pages soit PAIR**. Avec un total impair, la dernière page se retrouve pairée avec la pénultième au lieu d'être seule → back cover cassée visuellement. **Toujours vérifier `TOT_REAL % 2 === 0`** avant de livrer.

---

## 5. Démarrage de chapitre & position des pages pub

**Règle visée** (respectée dans la majorité des cas, avec quelques exceptions dues à la parité imposée par le total de pages) :
- **Un chapitre (section éditoriale) démarre idéalement en page de DROITE (impaire)** — c'est la page qu'on voit en premier en tournant la page précédente, donc l'emplacement le plus "noble" pour une ouverture de section.
- **Une pleine page de publicité s'isole idéalement en page de GAUCHE (paire)** dans un spread, pour ne jamais "casser" visuellement l'ouverture d'un article en page de droite.

Sur 7 emplacements pub actuels : 5 sont en page paire (gauche), 2 en page impaire (droite) — ces 2 exceptions (Emplacement 02 = p15, Emplacement 04 = p49, Emplacement 07 = p129) sont dictées par la pagination existante autour d'elles (transition de section, ou position juste avant back cover). **Ce n'est pas une règle absolue à 100%, mais une préférence à respecter chaque fois que la pagination le permet sans forcer une page blanche.**

Ouvertures de chapitre actuelles (`.opener`, `.opener-title`) : Build (p33, droite), Transaction (p87, droite), People (p107, droite), Life (p117, droite) — cohérent avec la règle. Tech & AI (p16) et Money (p62) démarrent en page paire (gauche) car leur page de titre précède un `pg-navy` déjà positionné par la structure existante ; à corriger en priorité si une nouvelle passe de pagination est faite.

---

## 6. Emplacements publicitaires — 7 slots, format & répartition

| # | Page | Parité | Titre / Emplacement | Section |
|---|---|---|---|---|
| 01 | p2 | Paire (gauche) | Inside Front Cover | Ouverture |
| 02 | p15 | Impaire (droite) | Opening | Éditorial |
| 03 | p32 | Paire (gauche) | Tech & AI | Avant section Tech & AI |
| 04 | p49 | Impaire (droite) | Build | Avant section Build |
| 05 | p86 | Paire (gauche) | Money | Avant section Money |
| 06 | p106 | Paire (gauche) | Transaction & Index | Fin section Transaction |
| 07 | p129 | Impaire (droite) | Inside Back Cover | Juste avant la back cover |

**Format de livraison annonceur (identique pour les 7 emplacements) :**
- **210 × 297 mm + 3 mm de fond perdu (bleed)**
- **CMYK, 300 dpi**
- Contact : `media@boha-group.com` · `aegryn.com/magazine`

**Structure HTML d'un emplacement pub (à dupliquer pour un 8e emplacement) :**
```html
<div id="pN" class="pg"><div class="pg-frame" style="...">
  <div class="rh"><span style="opacity:.5">Publicité</span><span style="margin:0 5px;opacity:.3">·</span>Advertising</div>
  <div class="body" style="display:flex;align-items:center;justify-content:center;padding:0">
    <div class="ad-slot-frame" style="border-color:#e8e8e8">
      <div class="ad-slot-corner tl"></div><div class="ad-slot-corner br"></div>
    </div>
    <div class="ad-slot-inner">
      <div class="ad-slot-num">Emplacement 08 · Advertising Space</div>
      <div class="ad-slot-title" style="color:#9a9690">Pleine page · [Section]</div>
      <div class="ad-slot-meta" style="color:#c0bbb3">210 × 297 mm + 3mm bleed · CMYK / 300dpi<br>media@boha-group.com · aegryn.com/magazine</div>
    </div>
  </div>
<div class="pn pn-l">N</div></div></div>
```
Variante fond sombre (Inside Front Cover, p2) : `border-color:rgba(255,255,255,.12)` sur `.ad-slot-frame`, page en `.pg-navy`.

**⚠️ Point de vigilance historique :** l'emplacement "Inside Back Cover" (juste avant la back cover) a été perdu lors d'une restauration de contenu antérieure. Toujours vérifier la présence des **7 emplacements** (pas 6) après toute réorganisation de pages.

---

## 7. Typographie — catalogue des styles de texte

**Police unique : Plus Jakarta Sans** (Google Fonts, chargée en `<head>` + `@import`). Aucune autre police.

### Corps de texte (paragraphes)
| Classe | Taille | Line-height | Usage |
|---|---|---|---|
| `.bx` | 10px | 1.65 | Corps de texte standard |
| `.bx-sm` | 9px | 1.6 | Corps de texte compact (colonnes étroites, légendes longues) |
| `.bx-lg` | 11px | 1.65 | Corps de texte aéré (pages avec peu de texte) |
| `.bx-air` | 10px | 1.92 | Variante très aérée, `margin-top:10px` entre `<p>` |

**Tous les styles `.bx*` doivent avoir `text-align:justify;hyphens:auto`** (règle appliquée uniformément — corrigée après audit, certaines pages n'étaient pas justifiées).

### Titres & display
| Classe | Taille | Usage |
|---|---|---|
| `.mix` | variable (font-size inline, ex. 22-26px) | Titre mixte : `font-weight:300` par défaut, `<strong>` en `font-weight:800` pour le mot-clé — signature visuelle "Barnes" |
| `.d72` → `.d18` | 66px → 15px | Échelle display (`.d-serif` base, `font-weight:300`) |
| `.lbl` | 7px | Label de rubrique en majuscules, `letter-spacing:.3em`, couleur verte `--green-dk` |
| `.opener-title` | 46px | Titre pleine page d'ouverture de section |

### Citations
| Classe | Usage |
|---|---|
| `.pq` | Citation encadrée (filet haut/bas), centrée, `break-inside:avoid` |
| `.pq-inline` | Citation en ligne dans le flux de texte, filets haut/bas |
| `.pq-attr` | Attribution (nom/source), petites majuscules |

### Divers
| Classe | Usage |
|---|---|
| `.cap` | Légende photo (italique, 7px, gris) |
| `.explain` | Encart "en langage simple" (fond vert clair, filet gauche vert) — précède le contenu technique |
| `.cta` | Encart appel à l'action (fond gris clair, bordure) |
| `.dc` | Lettrine (`::first-letter`, 4.2em) |
| `.dv` | Filet séparateur horizontal simple |

---

## 8. Modes CSS multi-colonnes

| Classe | Colonnes | Gap | Taille police | Usage |
|---|---|---|---|---|
| `.bx-col` | 2 | 16px | 10px | Article en colonnes journalistiques (défaut) |
| `.bx-col3` | 3 | 12px | 9px | ⚠️ Réservé aux blocs **larges** (≥ 300px de large) — trop étroit sinon (bug corrigé p18 : converti en `.bx-col`) |
| `.bx-col4` | 4 | 9px | 8px | Brèves denses type "news-in-brief" |
| `.gala3` | 3 | 11px | 8.5px | Variante "brèves" avec `.gala-item{break-inside:avoid}` |

Toutes les colonnes utilisent `column-rule:.5px solid #e0dcd5` (filet séparateur fin) et héritent de `text-align:justify;hyphens:auto`.

**Règle de largeur minimale : ne jamais descendre sous ~140px par colonne** (calcul : largeur disponible ÷ nombre de colonnes − gaps). En dessous, passer à moins de colonnes.

---

## 9. Gabarits photo/texte — 8 layouts (A→H), jamais deux pages identiques consécutives

Tous les gabarits utilisent `position:absolute` dans `.pg-frame` (420×595, `position:relative`), avec zones respectant `top:28px`/`bottom:24px`.

| Gabarit | Classes | Description |
|---|---|---|
| **A** | `.ga-photo-l` (48% larg.) + `.ga-text-r` (50%) | Photo pleine hauteur flush-gauche, texte à droite |
| **B** | `.ga-photo-r` (52%) + `.ga-text-l` (46%) | Photo pleine hauteur flush-droite, texte à gauche (miroir de A) |
| **C** | `.ga-photo-top` (62% haut.) + `.ga-text-bottom` | Photo en bandeau haut, texte en bandeau bas |
| **D** | `.ga-solo` (max-width:288px, centré) | Colonne de lecture unique, centrée, aération maximale |
| **E** | `.ga-bleed-l` (55%) + `.ga-narrow-r` (42%) | Photo bleed généreux à gauche, texte étroit à droite |
| **F** | `.ga-quote-page` + `.ga-quote-line` + `.ga-quote-body` | Page citation éditoriale, filet vertical vert, texte italique 18px centré verticalement |
| **G** | `.ga-duo` (grid 2fr/3fr) ou `.ga-trio` (grid 3fr/2fr/2fr) | Colonnes asymétriques pour comparaisons/données |
| **H** | `.ga-wrap-img` (`float:right`) | Image flottante, texte qui *wrap* autour (façon magazine papier) |

**Gabarit H — point d'attention QA :** le texte wrap correctement autour de l'image flottante ; un script de détection de chevauchement naïf (bounding-box) peut signaler un faux-positif ici car la boîte DOM du `<p>` englobe mathématiquement le float même quand le texte rendu ne le chevauche jamais visuellement. **Toujours vérifier par capture d'écran avant de "corriger" un signalement sur ce gabarit.**

**Pages sombres** (`.pg-navy`, fond `#0A1628`) : utilisées pour séparateurs de section, citations pleine page, et pages de clôture. `.rh-dk`/`.pn-dk` adaptent header/footer au fond sombre.

---

## 10. Pages de continuation (article > 1 page)

Quand un article dépasse la hauteur disponible sur une page, **ne jamais raccourcir ou couper le texte** — insérer une page de continuation en respectant ce motif existant :

```html
<!-- Fin de la page 1 de l'article -->
<div class="cont-bar" style="margin-top:10px">
  <div class="cont-bar-line"></div><div class="cont-bar-txt">Continued overleaf</div><div class="cont-bar-line"></div>
</div>

<!-- Début de la page 2 (continuation) -->
<div class="cont-bar">
  <div class="cont-bar-line"></div><div class="cont-bar-txt">Continued</div><div class="cont-bar-line"></div>
</div>
```
- `Continued overleaf` = dernier élément de la page qui déborde (annonce la suite).
- `Continued` = premier élément de la page suivante (reprend le fil).
- Le running head (`.rh`) de la page de continuation répète le **même** libellé `Section · Titre article` que la page d'origine.
- **Détection systématique du débordement** avant toute publication : `scripts/flipbook_overflow_check.py` (Playwright headless, compare `scrollHeight` vs `clientHeight` sur tous les conteneurs de texte sous `overflow:hidden`). Zéro résultat = zéro texte tronqué.

---

## 11. Animation de tournage de page (StPageFlip)

Librairie : `page-flip.browser.js` (locale, `/libs/`). Configuration (`new St.PageFlip(...)`) :

| Paramètre | Valeur | Effet |
|---|---|---|
| `width` / `height` | 420 / 595 | Dimensions d'une page (le canvas interne fait 840×595 en double-page) |
| `size` | `'fixed'` | Pas de stretch interne — le scaling visuel passe par un `transform:scale()` CSS externe sur `#fb-scaler` |
| `usePortrait` | `false` | Mode spread double-page (jamais page unique sauf cover/back cover) |
| `showCover` | `true` | Isole nativement page 1 et dernière page (density `"hard"` → réécrasée en `"soft"` juste après init pour un rendu flip souple identique aux pages internes, cf. §4) |
| `flippingTime` | 700 ms | Durée de l'animation de tournage |
| `maxShadowOpacity` | 0.4 | Ombre portée pendant le flip |
| `drawShadow` | `true` | Ombre/brillance native pendant le flip |
| `startPage` | 0 | Démarre sur la cover seule |
| `swipeDistance` | 30 | Seuil de swipe tactile |

**Répartition des spreads (`spreadDefs`) :** `[p1 seul] | [p2,p3] | [p4,p5] | … | [p128,p129] | [p130 seul]` — condition **stricte** : `TOT_REAL` doit être **pair**, sinon la dernière page se pair avec l'avant-dernière au lieu d'être isolée.

**Chrome de lecture (web uniquement, masqué en print) :**
- Barre d'outils basse (`#fb-toolbar`) : retour, miniatures, zoom −/+/%, navigation ‹ page ›, barre de progression, plein écran.
- Flèches de navigation latérales (`.fb-arrow`), hors du canvas scalé (coordonnées stables).
- Reliure centrale simulée (`#fb-spine`) + tranches de pages gauche/droite (`#fb-edge-l/r`, dégradé répétitif simulant l'épaisseur du papier) — fade in/out synchronisé avec la fin de l'animation de scale (460ms).
- Miniatures (`#fb-thumbs`) : une entrée par spread logique (61 entrées pour 130 pages), clic → `pageFlip.flip(idx)`.

---

## 12. Historique des erreurs corrigées (retour d'expérience — à ne pas reproduire)

| # | Erreur | Cause racine | Correction |
|---|---|---|---|
| 1 | IDs de page dupliqués (25 IDs sur 130 blocs physiques) | Regex de split incomplète (`class="pg"` strict) ne capturait pas `class="pg pg-navy"` lors d'un script de renumérotation | Regex corrigée en `class="pg[^"]*"` ; renumérotation complète |
| 2 | Contenu dupliqué (articles entiers répétés sur 2 pages) | Script de compaction antérieur ayant introduit des pages de continuation par copie au lieu de découpage | Restauration depuis la base saine `916146b` (120p, 0 doublon), puis réinsertion propre des continuations manquantes |
| 3 | Texte tronqué silencieusement (11 pages, `overflow:hidden`) | Contenu trop long pour la hauteur du gabarit, jamais détecté visuellement (le HTML statique ne montre pas le clipping) | Détection via Playwright headless (`scrollHeight` vs `clientHeight`) + insertion de 11 pages de continuation (120→130 pages) |
| 4 | Folios sur coins intérieurs au lieu d'extérieurs | Logique de parité inversée dans un script de renumérotation (`pn-l`↔`pn-r` swap) | Correction globale par parité (paire→`pn-l`, impaire→`pn-r`) sur 127 pages |
| 5 | Image manquante (p103) | Attribut `style` dupliqué sur le même élément — le navigateur n'honore que le premier | Fusion des deux attributs en un seul |
| 6 | Emplacement pub manquant (p129, "Inside Back Cover") | Perdu lors d'une restauration de base de contenu qui ne l'avait jamais eu | Retrouvé dans l'historique git (commit antérieur), restauré avec le style standard des 6 autres emplacements |
| 7 | Texte débordant dans la zone folio (2-9px, plusieurs pages) | 5 gabarits utilisaient `bottom:22px` au lieu de `24px`, sans padding interne compensatoire | Harmonisé à `bottom:24px` partout où nécessaire |
| 8 | Chevauchement `.spread-headline`/`.spread-sub` et zone folio | Positions `bottom:16px`/`30px` trop proches l'une de l'autre et du folio | Repositionné à `bottom:30px`/`62px` |
| 9 | Total de pages impair (131) après ajout de continuations | Casse l'isolement cover/back-cover de StPageFlip (exige un total pair) | Fusion d'un des ajouts les moins critiques (resserrement CSS au lieu d'une page dédiée) pour revenir à un total pair |
| 10 | Interlignes/espacements non harmonisés entre pages similaires | Copier-coller de blocs sans relecture systématique | `.bx`/`.bx-sm`/`.bx-lg`/`.bx-col`/`.bx-col3` harmonisés (justify + hyphens + line-height cohérent) |
| 11 | Bloc 3-colonnes trop étroit (p18, ~113px/colonne) | `.bx-col3` utilisé sur un conteneur trop étroit pour 3 colonnes | Converti en `.bx-col` (2 colonnes) |

---

## 13. Outils QA (à relancer après CHAQUE modification du flipbook)

```bash
# Détecte tout texte tronqué par overflow:hidden (zéro résultat = OK)
python3 scripts/flipbook_overflow_check.py

# Détecte les chevauchements texte/texte et intrusions dans les zones header/footer
python3 scripts/flipbook_overlap_check.py
```

**Note sur les faux positifs du second script :** deux motifs légitimes déclenchent des alertes qui NE sont PAS des bugs :
1. `.opener-num` — grand chiffre décoratif en fond (`opacity:.04`), volontairement derrière le texte de sommaire.
2. `.ga-wrap-img` (gabarit H) — le texte wrap correctement autour du float ; seule la boîte DOM du paragraphe englobe mathématiquement le float, jamais le texte rendu. **Toujours confirmer par capture d'écran** (`page.screenshot()` sur l'élément `#pN` en `media:'print'`) avant de modifier quoi que ce soit suite à une alerte sur ce gabarit.

**Checklist de validation avant tout commit :**
- [ ] Pages séquentielles 1..N, 0 doublon d'ID
- [ ] `TOT_REAL` (JS) == nombre de pages réelles, et **pair**
- [ ] 0 mismatch de parité folio (`pn-l`/`pn-r`)
- [ ] Back cover = dernière page physique du fichier
- [ ] 7 emplacements pub présents (`Emplacement 01` → `07`)
- [ ] `flipbook_overflow_check.py` → `[]`
- [ ] `flipbook_overlap_check.py` → seulement faux positifs connus (§13)
- [ ] 0 URL d'image distante (sauf Google Fonts)
- [ ] `div` balance (`<div>` count == `</div>` count)
- [ ] `content/magazine/issue-01/meta.ts` → `sections[].pageRange` à jour si les frontières de section ont bougé
- [ ] `npx tsc --noEmit` → 0 erreur

---

*Document généré à partir de l'audit complet du flipbook Issue 01 (130 pages). À maintenir à jour à chaque évolution structurelle (nouveau gabarit, nouvel emplacement pub, changement de pagination).*
