# Aegryn — Design System & Charte Graphique

**Référence interne unique** des conventions visuelles et structurelles du site.
Conçue pour être **auto-suffisante** : toutes les valeurs nécessaires à la reproduction
de la charte sur un autre site sont dans ce fichier.

Sources de vérité : `tailwind.config.ts`, `styles/globals.css`, `app/[locale]/layout.tsx`,
`components/layout/*`, `lib/gsap.ts`, `package.json`.

> Pour la charte du **flipbook magazine** (format print 420×595px, folios, gabarits),
> voir `docs/magazine/flipbook-design-guidelines.md` — ce fichier ne couvre que le site web.

---

## 0. Stack & dépendances (versions exactes)

| Lib | Version | Rôle design |
|---|---|---|
| `tailwindcss` | `^3.4.17` | Utility-first — toute la charte est en classes Tailwind |
| `next` | `^16.3.3` | App Router, `next/font/local` pour les woff2 |
| `next-intl` | `^4.14.1` | 6 locales `fr en de es it nl` |
| `gsap` | `^3.12.7` | Animations scroll + plugins Club GreenSock |
| `@gsap/react` | `^2.1.2` | `useGSAP` |
| `lenis` | `^1.3.26` | Smooth scroll global |
| `framer-motion` | `^12.43.0` | Menus, drawers, `AnimatePresence` |
| `lucide-react` | `^0.511.0` | **Iconographie unique** — aucune autre lib d'icônes |
| `react-pageflip` | `^2.0.3` | Flipbook magazine (StPageFlip) |
| `recharts` | `^3.10.1` | Charts magazine/data |
| `three` + `@react-three/fiber` + `drei` | `^0.184 / ^9 / ^10` | Scènes 3D ponctuelles |
| `clsx` + `tailwind-merge` | — | Composition de classes |
| `prettier-plugin-tailwindcss` | `^0.6.11` | Trie les classes → les snippets ci-dessous respectent cet ordre |

Plugins GSAP enregistrés (`lib/gsap.ts`) : `ScrollTrigger`, `SplitText`,
`DrawSVGPlugin`, `ScrambleTextPlugin`, `Flip` — **toujours importer depuis `@/lib/gsap`**,
jamais `gsap` directement (enregistrement unique des plugins).

```ts
// lib/gsap.ts — reproduction exacte
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, Flip)
}
```

---

## 1. Couleurs

### Palette de marque (`ag-*`) — hex exacts

| Token | Hex | Usage |
|---|---|---|
| `ag-primary` / `ag-apex` | `#5ADDA4` | **Emerald Mint** — accent marque, CTAs, focus, grade ★ |
| `ag-secondary` / `ag-black` | `#050505` | **Near Black** — titres, surfaces sombres |
| `ag-tertiary` / `ag-off-white` | `#F8FAFC` | Fond alternatif de section |
| `ag-navy` | `#0A1D2E` | Footer, CTA primaires foncés, overlays `bg-ag-navy/30` |
| `ag-apex-ink` | `#0C7A52` | Apex foncé — **texte vert sur fond clair** (WCAG AA) |
| `ag-slate` / `ag-gray` | `#374151` | Texte secondaire (AA sur blanc) |
| `ag-gray-light` | `#6B7280` | Labels, meta, texte tertiaire (AA sur blanc) |
| `ag-white` | `#FFFFFF` | Fond principal |
| `ag-light-gray` | `#EFEFEF` | Fond de carte inactive |
| `ag-mid-gray` | `#D0CECA` | Scrollbar, séparateurs |
| `ag-border` | `#E2E8F0` | Bordures standard |
| `ag-border-h` | `#CBD5E1` | Bordures au survol |

### Statuts

| Token | Hex | Usage |
|---|---|---|
| `ag-live` | `#16A34A` | Badge « en ligne » |
| `ag-beta` | `#B45309` | Badge beta |
| `ag-dev` | `#94A3B8` | Badge en développement |

### Tokens de grade CIFSO

| Grade | Token | Hex |
|---|---|---|
| ★ | `ag-grade-star` | `#5ADDA4` |
| AAA | `ag-grade-aaa` | `#C9A84C` (or) |
| AA | `ag-grade-aa` | `#9BA8B0` (argent) |
| A | `ag-grade-a` | `#4A90D9` (bleu) |
| B | `ag-grade-b` | `#D4820A` (bronze) |
| Refusé | `ag-grade-refused` | `#C0392B` |

### Palette magazine (éditorial)

`magazine-black #0F1A2B` · `magazine-white #FFFFFF` · `magazine-ivory #F7F5F1` ·
`magazine-cream #EDEAE4` · `magazine-accent #5ADDA4`

### Alias legacy `aegryn-*`

Jeu parallèle (`aegryn.obsidian`, `aegryn.cream`…) — rétrocompatibilité uniquement,
**ne pas utiliser** dans le nouveau code. Préférer `ag-*`.

### Règles d'usage

- Texte vert sur fond clair → **`ag-apex-ink`**, jamais `ag-apex` (contraste insuffisant).
- `ag-apex` en texte : réservé aux fonds sombres (navy/noir), badges et bordures.
- Sélection : `background: rgba(90,221,164,0.25); color: #050505`.
- `focus-visible` : `outline: 2px solid #0A1D2E; outline-offset: 3px`.
- Scrollbar webkit : `width:5px`, track `#F8FAFC`, thumb `#D0CECA` → hover `#374151`.

---

## 2. Typographie

### Police

- **Plus Jakarta Sans** — police unique du site, `woff2` locaux via `next/font/local`,
  variable `--font-body`. Graisses : **300, 400, 500, 600, 700, 800**.
- Fallbacks : `system-ui, -apple-system, BlinkMacSystemFont, sans-serif`.
- `globals.css` impose `font-family: inherit` sur `*`, `*::before`, `*::after` —
  **aucune dérogation** (même dans inputs, boutons, tables).
- **Unbounded** (`--font-unbounded`, classe `font-unbounded`) — réservée au magazine.

### Hiérarchie (globals.css)

| Élément | Graisse |
|---|---|
| `h1`, `h2` | 700 |
| `h3`–`h6`, `label`, `figcaption`, `caption`, `small` | 600 |
| `button`, `input`, `select`, `textarea` | 600 |
| `.font-display` | 700 forcé |
| Corps | 400 — `16px / 1.6` (15px sous 640px) |

### Échelle éditoriale (`text-*-mag`)

| Classe | Spec |
|---|---|
| `text-display` | `clamp(64px,8vw,120px)` · lh 0.92 · ls −0.03em · 800 |
| `text-h1-mag` | `clamp(36px,5vw,64px)` · lh 1.08 · ls −0.02em · 700 |
| `text-h2-mag` | `clamp(22px,3vw,36px)` · lh 1.2 · ls −0.01em · 600 |
| `text-body-mag` | `18px` · lh 1.7 · 400 |
| `text-label-mag` | `12px` · lh 1.4 · ls +0.08em · 500 |

### Patterns typographiques récurrents

```tsx
/* Eyebrow / label de section — LE pattern signature */
<p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray-light">
/* variante tables : text-[11px] tracking-[0.2em] */

/* Corps secondaire */        text-ag-gray      text-[13px]/[14px]
/* Meta légère */             text-ag-gray-light text-[10px]/[11px]
/* Titres */                  tracking-tighter  /* −0.03em */
```

> Note : `font-mono` dans la config Tailwind est **mappée sur Plus Jakarta Sans** —
> les « mono » du site ne sont pas une vraie monospace, c'est un réglage volontaire
> (tracking large + uppercase = style technique).

---

## 3. Structure de page

### Layout racine

```
<body class="{--font-body} font-sans bg-ag-white text-ag-dark antialiased">
  <LenisProvider>               {/* smooth scroll */}
    <a skip-to-content />       {/* sr-only → focus:not-sr-only */}
    <Nav />                     {/* fixed h-16, z-50 */}
    <div id="main" class="pt-16">{children}</div>
    <Footer />                  {/* bg-ag-navy */}
    <ScrollToTop />
  </LenisProvider>
</body>
```

- **Conteneur standard** : `max-w-7xl mx-auto px-6 md:px-12`.
- Autres largeurs : `max-w-magazine: 1440px`, `max-w-prose: 720px`.
- Offset nav : `pt-16` sur `#main`.
- `html, body { max-width: 100vw; overflow-x: hidden }` — les tableaux larges utilisent
  `overflow-x-auto` + `min-width` interne (ex. `minWidth: 560`), **jamais** de débordement page.
- `html { scroll-behavior: auto }` — Lenis pilote le scroll, ne pas remettre `smooth`.

### Sections & surfaces

- Rythme vertical : `py-16` / `py-20` / `py-24` (standard), `py-32` (heros).
- Alternance fonds : `bg-ag-white` ↔ `bg-ag-off-white` ; bandeaux `bg-ag-navy` (texte apex).
- Cartes : `rounded-2xl border border-ag-border` + hover `bg-ag-off-white`.
- Sous-cartes/badges : `rounded-xl` / `rounded-lg`.
- Rayons : `rounded-lg` CTA · `rounded-xl` cartes/inputs · `rounded-2xl` blocs · `rounded-full` pills.
- Tables : `<div class="overflow-x-auto rounded-2xl border border-ag-border"><div style={{minWidth:560}}>` — scroll horizontal mobile, colonnes `grid-cols-[160px_1fr_1fr]`.

---

## 4. Navbar (`components/layout/Nav.tsx`)

| Propriété | Valeur |
|---|---|
| Position | `fixed top-0`, `h-16` (64px), `z-50` |
| Fond | `bg-ag-white border-b border-ag-border` |
| Conteneur | `max-w-7xl mx-auto px-6 md:px-12` |

**Mega-menus** (3) : Nos métiers `w-[860px]` 4 col · Nos convictions `w-[640px]` 2 col ·
Qui sommes-nous `w-[820px]` 3 col (`1fr 1.4fr 1fr`).

- Panneau : `absolute top-full mt-2 rounded-2xl border border-ag-border shadow-xl bg-ag-white`.
- Grille interne : `gap-px bg-ag-border` → filets de séparation entre colonnes `bg-ag-white p-4`.
- Trigger : survol `onMouseEnter` ; fermeture différée **150ms** (traversée souris).
- Animation entrée : framer-motion `opacity 0→1, y −6→0`, `0.2s`, ease `[0.16,1,0.3,1]`.
- Overlay : `fixed inset-0 top-16 bg-ag-navy/30 backdrop-blur-[2px]`.
- Chargement page : GSAP stagger liens `opacity 0, y −8, stagger 0.06, expo.out 0.6s`.
- Liens : `text-[13px] text-ag-gray hover:text-ag-black` ; sous-liens `text-[12px] text-ag-gray-light`.
- Headers de colonne : eyebrow standard `font-mono text-[10px] tracking-[0.24em] uppercase`.
- Mobile : hamburger `Menu`/`X` lucide → drawer GSAP (`y −16→0` 0.35s, items stagger `x −16`),
  accordéons par section.
- **LanguageSwitcher** : `<select>` transparent, icône `Globe 13px`,
  `text-[11px] font-semibold uppercase tracking-[0.12em]`, prop `dark` pour fond navy.

---

## 5. Footer (`components/layout/Footer.tsx` + `FooterMarquee.tsx`)

- Fond **`bg-ag-navy`**, `border-t border-white/10`, `max-w-7xl px-6 pt-10 pb-10`.
- Grille `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` : marque+réseaux · Aegryn ·
  Services · Plateforme · Publications · Advisory CTA.
- Titres de col : `text-[10px] tracking-[0.2em] uppercase text-white/60`.
- Liens : `text-sm text-white/75 hover:text-white`.
- Logo : `brightness-0 invert` (logo sombre → blanc sur navy).
- **Médaillon contact** (signature) : SVG circulaire rotatif GSAP **26s/tour linéaire**,
  texte sur cercle via `textLength` = circonférence exacte (Ø 110px, R 44 → C ≈ 276.5),
  font 7.5px `rgba(90,221,164,0.8)` ; centre `w-12 h-12 rounded-full bg-ag-apex/15
  border-ag-apex/40` → hover `bg-ag-apex` plein + flèche navy.
- Bandeau légal : `text-[10px] text-white/45`.
- **FooterMarquee** : « Aegryn » en défilement infini RTL **90s**, médaillon centré,
  séparateurs `w-1 h-1 rounded-full bg-ag-apex/30`.

---

## 6. Composants — recettes exactes

### Boutons

```tsx
/* Primaire navy */
className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono
  text-[11px] tracking-[0.14em] uppercase px-7 py-4 rounded-lg
  hover:bg-ag-navy-mid transition-colors"

/* Primaire apex */
className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans
  font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3 rounded-lg
  hover:bg-ag-apex/90 transition-colors"

/* Ghost / secondaire */
className="inline-flex items-center gap-2 border border-ag-border text-ag-gray
  font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-4 rounded-lg
  hover:border-ag-black hover:text-ag-black transition-all"

/* Ghost inversé (fond navy) */
className="border border-white/20 text-white/75 hover:border-white hover:text-white"

/* Lien texte souligné animé — classe utilitaire .link-underline (globals.css) */
```

`.link-underline` : `::after` barre `2px currentColor` sous le lien,
`width 0→100%` en 300ms `cubic-bezier(0.25,0,0,1)`. `.link-active` = barre pleine.

### Formulaires

```tsx
/* Input standard */
className="w-full px-4 py-3 rounded-xl border border-ag-border
  focus:border-ag-apex focus:outline-none text-[14px] transition-colors"

/* Label */
className="text-[12px] font-semibold text-ag-gray"  /* + uppercase tracking si eyebrow */
```

### Pills & badges

```tsx
/* Pill grade / tag */
className="rounded-full border border-ag-apex/40 bg-ag-apex/10 text-ag-apex-ink
  text-[12px] px-5 py-3.5"

/* Dot indicateur */
className="w-1.5 h-1.5 rounded-full bg-ag-apex animate-pulse"
```

### Icônes

- **lucide-react uniquement**. Tailles : 10–13px (meta/menus), 16–20px (UI), 24px+ (feature).
- CTA : `ArrowUpRight` quasi systématique. Réseaux sociaux : SVG inline custom (footer).

---

## 7. Animations — recettes

### Transitions globales (style « Rolex »)

```css
a, button {
  transition-property: color, background-color, border-color, opacity, transform, box-shadow;
  transition-duration: 250ms;
  transition-timing-function: cubic-bezier(0.25, 0, 0, 1);
}
```

Référence nommée dans le code : **Rolex** — micro-transitions discrètes et rapides.
Ne pas ajouter de `transition-all` custom qui casse ce rythme.

### Lenis (smooth scroll) — config exacte

```ts
new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
})
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
// + scrollTo(0, {immediate:true}) sur changement de route
```

### ScrollReveal (composant réutilisable)

`gsap.from` : `opacity 0, y 20` → `duration 0.7, ease expo.out`,
`scrollTrigger { start: 'top 80%', once: true }`, `staggerChildren` optionnel (0.08).

### Hero — reveal par lignes (réf. boha-group.com)

```ts
const split = new SplitText(el, { type: 'lines', linesClass: 'hero-line-inner' })
gsap.set(split.lines, { overflow: 'hidden', display: 'block' })
tl.from(split.lines, { yPercent: 105, duration: 1.0, stagger: 0.12, ease: 'expo.out' })
  .from(rule, { scaleX: 0, duration: 0.8, transformOrigin: 'left' }, '-=0.6')
/* + parallax photo : yPercent −12 scrubbed · overlay s'éclaircit au scroll */
```

### Keyframes CSS (globals.css + tailwind)

| Nom | Spec |
|---|---|
| `apex-pulse` | opacity 1↔0.4, 2.5s ease-in-out ∞ |
| `fade-up` | `opacity 0 + translateY(16px)` → visible, 0.65s `cubic-bezier(0.16,1,0.3,1)` |
| `bell-ring` | rotation ±15° decay, 2s (NotificationBell) |
| `marquee` | `translateX 0→−100%`, 6s linéaire (`animate-marquee`, `-pause`) |
| `pulse-slow` | pulse Tailwind 3s |

### Méga-menu / drawers

Entrée : `opacity 0→1, y −6→0`, **0.2s**, ease `[0.16,1,0.3,1]` (framer-motion).
Sortie : `y → −4`. Overlay fade 0.2s.

### Accessibilité mouvement

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Accessibilité & UX transverses

- Skip-link : `sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
  z-50 bg-ag-navy px-4 py-2 text-sm font-bold text-white rounded-lg`.
- `aria-label` sur tout lien icône ; icônes décoratives `aria-hidden`.
- `::selection` apex 25 % sur noir.
- Contrastes validés : `ag-gray`/`ag-gray-light` AA sur blanc ; `ag-apex` texte
  **interdit sur fond clair** → `ag-apex-ink`.
- `theme-color: #050505`, `color-scheme: light`, favicon `mask-icon` `#5ADDA4`.
- `format-detection: telephone=no`.

---

## 9. Solutions design & références

Ce qui fait l'identité du site, et d'où ça vient :

| Solution | Source / référence | Où dans le code |
|---|---|---|
| **Micro-transitions 250ms discrètes** | Style **Rolex** (nommé en commentaire) — réactivité sobre, pas d'animations tape-à-l'œil | `globals.css` règle `a, button` |
| **Reveal de titre par lignes clippées** (`SplitText` `yPercent:105`) | Style **boha-group.com** (nommé en commentaire) | `HeroMountain.tsx` |
| **Smooth scroll inertiel** | **Lenis** (studio-freight) couplé à `ScrollTrigger.update` + `gsap.ticker` | `LenisProvider.tsx` |
| **Plugins GSAP premium** | Club GreenSock : SplitText, DrawSVG, ScrambleText, Flip | `lib/gsap.ts` |
| **Mega-menus riches hover** (descriptions + colonnes) | Pattern SaaS premium (type Stripe/Linear) | `Nav.tsx` |
| **Marquee footer + médaillon SVG rotatif** | Signature éditoriale « horlogerie » — cohérent avec le positionnement suisse | `Footer.tsx`, `FooterMarquee.tsx` |
| **Flipbook** (tournage de page) | **StPageFlip** via `react-pageflip` | `components/magazine/*` |
| **Smooth scroll → jamais** `scroll-behavior:smooth` CSS | Lenis gère tout ; le CSS reste `auto` | `globals.css` |
| **Typographie** | **Plus Jakarta Sans** (open source, géométrique humaniste — proximité Circular/TT Norms) | `public/fonts/PlusJakartaSans/` |
| **Iconographie** | **Lucide** (fork Feather) — traits fins cohérents avec l'esthétique | partout |
| **Esthétique globale** | « Swiss institutional » : blanc dominant, navy profond, vert menthe en accent unique, eyebrow uppercase tracké, filets `border-ag-border`, rayons modérés (8–16px) | — |

---

## 10. Starter kit — reproduire la charte ailleurs

### Tailwind (extrait minimal)

```ts
theme: { extend: {
  colors: { ag: {
    primary: '#5ADDA4', secondary: '#050505', tertiary: '#F8FAFC',
    navy: '#0A1D2E', apex: '#5ADDA4', 'apex-ink': '#0C7A52',
    white: '#FFFFFF', 'off-white': '#F8FAFC', 'light-gray': '#EFEFEF',
    'mid-gray': '#D0CECA', black: '#050505', dark: '#0A0A0A',
    gray: '#374151', 'gray-light': '#6B7280',
    border: '#E2E8F0', 'border-h': '#CBD5E1',
    live: '#16A34A', beta: '#B45309', dev: '#94A3B8',
    'grade-star': '#5ADDA4', 'grade-aaa': '#C9A84C', 'grade-aa': '#9BA8B0',
    'grade-a': '#4A90D9', 'grade-b': '#D4820A', 'grade-refused': '#C0392B',
  }},
  fontFamily: {
    sans: ['var(--font-body)', 'Plus Jakarta Sans', '-apple-system', 'sans-serif'],
    mono: ['var(--font-body)', 'Plus Jakarta Sans', 'sans-serif'], // volontaire
    unbounded: ['var(--font-unbounded)', 'sans-serif'],
  },
  letterSpacing: { tighter: '-0.03em' },
}}
```

### CSS minimal

```css
body { font-family: var(--font-body), 'Plus Jakarta Sans', sans-serif;
       font-size: 16px; line-height: 1.6; color: #0A0A0A; background: #fff;
       -webkit-font-smoothing: antialiased; }
*, *::before, *::after { font-family: inherit; box-sizing: border-box; }
h1, h2 { font-weight: 700 } h3, h4, h5, h6 { font-weight: 600 }
button, input, select, textarea { font-weight: 600 }
a, button { transition: color .25s cubic-bezier(.25,0,0,1),
            background-color .25s cubic-bezier(.25,0,0,1),
            border-color .25s cubic-bezier(.25,0,0,1), opacity .25s, transform .25s; }
::selection { background: rgba(90,221,164,.25); color: #050505 }
:focus-visible { outline: 2px solid #0A1D2E; outline-offset: 3px }
html, body { max-width: 100vw; overflow-x: hidden }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.01ms!important;
    animation-iteration-count:1!important; transition-duration:.01ms!important } }
```

### Fichiers à copier pour une reproduction fidèle

| Fichier | Contient |
|---|---|
| `tailwind.config.ts` | Tous les tokens couleurs/fonts/keyframes |
| `styles/globals.css` | Base CSS, transitions, utilities, scrollbar |
| `public/fonts/PlusJakartaSans/*.woff2` | Les 6 graisses |
| `lib/gsap.ts` | Enregistrement plugins GSAP |
| `components/providers/LenisProvider.tsx` | Smooth scroll + sync ScrollTrigger |
| `components/animations/ScrollReveal.tsx` | Reveal standard |
| `components/layout/{Nav,Footer,FooterMarquee,LanguageSwitcher}.tsx` | Chrome complet |

### Checklist identité

1. Fond blanc, texte quasi-noir `#0A0A0A`, accent **un seul** : `#5ADDA4`.
2. Eyebrow `10–11px uppercase tracking 0.2em+` au-dessus de chaque titre de section.
3. CTAs uppercase `11px`, tracking `0.14em`, `rounded-lg`, navy ou apex.
4. Filets `#E2E8F0` partout, jamais d'ombres fortes (sauf menus `shadow-xl`).
5. Animations : courtes (≤0.7s), `expo.out`, déclenchées à `top 80%`, `once`.
6. Pas de vraie monospace — `font-mono` = Plus Jakarta Sans trackée.
7. Footer navy + marquee + médaillon rotatif = signature non négociable.
