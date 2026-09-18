# Aegryn — Design System & Charte Graphique

**Référence interne unique** des conventions visuelles et structurelles du site.
Conçue pour être **auto-suffisante** : toutes les valeurs nécessaires à la reproduction
de la charte sur un autre site sont dans ce fichier.

Sources de vérité : `tailwind.config.ts`, `styles/globals.css`, `app/[locale]/layout.tsx`,
`components/layout/*`, `lib/gsap.ts`, `package.json`.

> Pour la charte du **flipbook magazine** (format print 420×595px, folios, gabarits),
> voir `docs/magazine/flipbook-design-guidelines.md` — ce fichier ne couvre que le site web.

**Dernière mise à jour** : 18 septembre 2026 — audit exhaustif de 128 composants, 69 pages,
patterns de boutons, cartes, grilles, espacements, animations, et conventions visuelles.

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

```tsx
<body className={`${plusJakartaSans.variable} font-sans bg-ag-white text-ag-dark antialiased`}>
  <LenisProvider>               {/* smooth scroll */}
    <a skip-to-content />       {/* sr-only → focus:not-sr-only */}
    <Nav />                     {/* fixed h-16, z-50 */}
    <div id="main" className="pt-16">{children}</div>
    <Footer />                  {/* bg-ag-navy */}
    <ScrollToTop />
  </LenisProvider>
</body>
```

**Conteneurs** — largeurs standard
- **Standard** : `max-w-7xl mx-auto px-6 md:px-12` (1280px + padding responsive)
- **Magazine** : `max-w-magazine` (1440px)
- **Prose** : `max-w-prose` (720px) — articles, contenu éditorial étroit
- **3xl** : `max-w-3xl` (768px) — formulaires, sections centrées
- **2xl** : `max-w-2xl` (672px) — titres, chapeaux
- **xl** : `max-w-xl` (576px) — sous-titres, descriptions courtes

**Offset navbar** : `pt-16` (64px) sur `#main` — compense la navbar fixed.

**Overflow** : `html, body { max-width: 100vw; overflow-x: hidden }` — les tableaux larges
utilisent `overflow-x-auto` + `min-width` interne (ex. `minWidth: 560`), **jamais** de débordement page.

**Scroll** : `html { scroll-behavior: auto }` — Lenis pilote le scroll, ne pas remettre `smooth`.

### Sections & surfaces

**Rythme vertical** — padding sections
- Compact : `py-12` (48px)
- Standard : `py-16` (64px) ou `py-20` (80px)
- Large : `py-24` (96px)
- Hero : `py-32` (128px) ou `pt-24 pb-20`

**Alternance fonds** — rythme visuel
- Blanc : `bg-ag-white`
- Off-white : `bg-ag-off-white` (alternance)
- Navy : `bg-ag-navy` (bandeaux, footer, CTA hero)
- Bordures de section : `border-t border-ag-border` (séparation discrète)

**Cartes & surfaces**
- Carte standard : `rounded-2xl border border-ag-border bg-ag-white`
- Hover : `hover:bg-ag-off-white transition-colors`
- Sous-cartes : `rounded-xl` ou `rounded-lg`
- Inputs : `rounded-xl`
- Boutons : `rounded-lg`
- Pills : `rounded-full`

**Tables** — scroll horizontal mobile
```tsx
<div className="overflow-x-auto rounded-2xl border border-ag-border">
  <div style={{ minWidth: 560 }}>
    <table className="w-full">
      {/* colonnes : grid-cols-[160px_1fr_1fr] ou équivalent */}
    </table>
  </div>
</div>
```

### Grilles & espacements

**Grilles responsive** — patterns récurrents
```tsx
/* 3 colonnes */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5
/* 2 colonnes */
grid grid-cols-1 md:grid-cols-2 gap-6
/* 4 colonnes (petits éléments) */
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
/* Asymétrique (hero + sidebar) */
grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12
```

**Gaps** — espacement entre éléments
- Très serré : `gap-1` (4px) — tags inline
- Serré : `gap-2` ou `gap-3` (8–12px) — icônes + texte
- Standard : `gap-4` ou `gap-5` (16–20px) — cartes, sections
- Large : `gap-6` ou `gap-8` (24–32px) — blocs majeurs
- Très large : `gap-12` (48px) — colonnes hero
- Filets : `gap-px` + `bg-ag-border` — grilles avec séparateurs visuels

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

### Boutons (toutes variantes)

**Primaire Navy** — CTA principal, actions importantes
```tsx
className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white
  font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3
  hover:bg-ag-navy-mid transition-colors"
/* Variante large : px-7 py-4 */
/* Variante avec icône : gap-2, ArrowUpRight lucide 13px */
```

**Primaire Apex** — CTA secondaire, actions positives
```tsx
className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy
  font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3
  hover:bg-ag-apex/90 transition-colors"
/* Variante formulaire : w-full md:w-auto justify-center px-8 py-4 */
```

**Ghost / Outline** — actions secondaires sur fond clair
```tsx
className="rounded-lg inline-flex items-center gap-2 border border-ag-border
  text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3
  hover:border-ag-black hover:text-ag-black transition-all"
/* Variante noire : border-ag-black text-ag-black hover:bg-ag-black hover:text-white */
/* Variante navy : border-ag-navy text-ag-navy hover:bg-ag-navy hover:text-white */
```

**Ghost inversé** — sur fond navy/sombre
```tsx
className="rounded-lg inline-flex items-center gap-2 border border-white/30
  text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase
  px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
/* Variante apex : hover:border-ag-apex hover:bg-ag-apex hover:text-ag-black */
```

**Lien texte souligné animé** — classe utilitaire `.link-underline` (globals.css)
```tsx
className="link-underline"
/* ::after barre 2px currentColor, width 0→100% en 300ms cubic-bezier(0.25,0,0,1) */
/* .link-active = barre pleine permanente */
```

**Tailles et espacements**
- Petit : `text-[10px] px-5 py-2.5`
- Standard : `text-[11px] px-6 py-3`
- Large : `text-[11px] px-7 py-4` ou `px-8 py-4`
- Pleine largeur : `w-full justify-center`
- Icône : `gap-2` (standard), `gap-1.5` (compact), `gap-3` (large)

### Cartes (patterns récurrents)

**Carte standard** — grilles d'actifs, articles, experts
```tsx
className="rounded-2xl border border-ag-border bg-ag-white p-8 flex flex-col gap-5
  group hover:bg-ag-off-white transition-colors"
/* Variante compacte : p-6 gap-4 */
/* Variante avec image : overflow-hidden (pour image plein bord) */
```

**Carte de navigation / feature**
```tsx
className="rounded-2xl border border-ag-border bg-ag-white p-6 flex flex-col gap-3
  hover:border-ag-apex/40 transition-all"
/* Header : flex items-start justify-between gap-3 */
/* Icône : lucide 20px text-ag-apex-ink */
```

**Grilles de cartes** — patterns standard
```tsx
/* 3 colonnes responsive */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
/* Avec filets de séparation : gap-px bg-ag-border, enfants bg-ag-white */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border
  border border-ag-border rounded-2xl overflow-hidden"
/* Enfants : bg-ag-white p-6 (ou p-8) */

/* 2 colonnes asymétriques (hero + sidebar) */
className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12"
```

### Formulaires

**Input standard**
```tsx
className="w-full px-4 py-3 rounded-xl border border-ag-border
  focus:border-ag-apex focus:outline-none text-[14px] transition-colors
  placeholder-ag-gray-light"
/* Variante search : rounded-full pl-9 pr-10 py-2.5 */
```

**Label**
```tsx
className="text-[12px] font-semibold text-ag-gray mb-2"
/* Variante eyebrow : uppercase tracking-[0.2em] text-ag-gray-light */
```

**Select / Textarea**
```tsx
/* Mêmes classes que input, textarea ajoute : resize-none min-h-[120px] */
```

### Pills & badges

**Pill / tag standard**
```tsx
className="rounded-full border border-ag-apex/40 bg-ag-apex/10 text-ag-apex-ink
  text-[12px] px-5 py-3.5"
/* Variante compacte : text-[10px] px-2.5 py-1 */
/* Variante neutre : border-ag-border bg-ag-off-white text-ag-gray */
```

**Badge status / catégorie**
```tsx
className="font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1
  rounded-lg border"
/* Grade ★ : border-ag-apex/30 bg-ag-apex/5 text-ag-apex-ink */
/* Live : border-ag-live/30 bg-ag-live/5 text-ag-live */
/* Beta : border-ag-beta/30 bg-ag-beta/5 text-ag-beta */
```

**Dot indicateur**
```tsx
className="w-1.5 h-1.5 rounded-full bg-ag-apex animate-pulse"
/* Variante statique : sans animate-pulse */
```

### Icônes

- **lucide-react uniquement**. Aucune autre lib d'icônes (pas de react-icons, heroicons, etc.).
- Tailles : 10–13px (meta/menus), 16–20px (UI courante), 24px+ (feature/hero).
- CTA : `ArrowUpRight` quasi systématique (13px dans boutons, 16px dans liens).
- Navigation : `ChevronDown` (menus), `Menu`/`X` (mobile), `Globe` (langue).
- Réseaux sociaux : SVG inline custom (footer) — pas lucide.

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

**Durées standard**
- Ultra-rapide : `150ms` (hover icône, dot pulse)
- Rapide : `200ms` (hover bouton ghost, border)
- Standard : `250ms` (défaut global)
- Modérée : `300ms` (link-underline, cartes complexes)
- Lente : `500ms`+ (reveal, fade-in majeur)

**Easings récurrents**
- `cubic-bezier(0.25, 0, 0, 1)` — défaut Rolex (out rapide)
- `cubic-bezier(0.16, 1, 0.3, 1)` — mega-menu, fade-up (out doux)
- `expo.out` — GSAP reveals, hero
- `none` — scrub parallax, marquee

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

**Implémentation** : `components/providers/LenisProvider.tsx` — wraps tout le site.

### ScrollReveal (composant réutilisable)

**Pattern standard** — fade-up au scroll
```ts
gsap.from(el, {
  opacity: 0,
  y: 20,
  duration: 0.7,
  ease: 'expo.out',
  scrollTrigger: {
    trigger: el,
    start: 'top 80%',
    once: true,
  },
})
// Avec stagger enfants : stagger: 0.08
```

**Composant** : `components/animations/ScrollReveal.tsx`

### Hero — reveal par lignes (réf. boha-group.com)

**Technique SplitText** — chaque ligne clip up depuis le bas
```ts
const split = new SplitText(el, { type: 'lines', linesClass: 'hero-line-inner' })
gsap.set(split.lines, { overflow: 'hidden', display: 'block' })

const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
tl.from(labelRef.current, { opacity: 0, y: 8, duration: 0.5, delay: 0.1 })
  .from(split.lines, { yPercent: 105, duration: 1.0, stagger: 0.12 }, '-=0.2')
  .from(ruleRef.current, { scaleX: 0, duration: 0.8, transformOrigin: 'left' }, '-=0.6')
  .from(subtitleRef.current, { opacity: 0, y: 12, duration: 0.6 }, '-=0.55')
  .from(ctasRef.current?.children ?? [], { opacity: 0, y: 10, stagger: 0.1, duration: 0.5 }, '-=0.4')

// Parallax photo
gsap.to(photoRef.current, {
  yPercent: -12,
  ease: 'none',
  scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
})

// Overlay s'éclaircit au scroll
gsap.to('#hero-overlay', {
  opacity: 0.45,
  ease: 'none',
  scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '60% top', scrub: true },
})
```

**Référence** : `components/sections/HeroMountain.tsx`

### Keyframes CSS (globals.css + tailwind)

| Nom | Spec | Usage |
|---|---|---|
| `apex-pulse` | opacity 1↔0.4, 2.5s ease-in-out ∞ | Dot live, accents |
| `fade-up` | `opacity 0 + translateY(16px)` → visible, 0.65s `cubic-bezier(0.16,1,0.3,1)` | Entrée éléments |
| `bell-ring` | rotation ±15° decay, 2s | NotificationBell |
| `marquee` | `translateX 0→−100%`, 6s linéaire | Footer marquee |
| `pulse-slow` | pulse Tailwind 3s | Variante pulse douce |

**Classes utilitaires**
```tsx
animate-apex-pulse
animate-fade-up
animate-bell-ring
animate-marquee
animate-marquee-pause  /* paused au hover */
animate-pulse-slow
```

### Mega-menu / drawers

**Framer Motion** — panneau dropdown
```tsx
<motion.div
  initial={{ opacity: 0, y: -6 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -4 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
```

**Overlay** — fond semi-transparent
```tsx
className="fixed inset-0 top-16 bg-ag-navy/30 backdrop-blur-[2px]"
/* Fade in/out 0.2s */
```

**Délai fermeture** — 150ms (traversée souris entre trigger et panneau)

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

**Respect total** — toutes animations désactivées si préférence utilisateur activée.

---

## 8. Patterns de page — recettes complètes

### Hero patterns

**Hero Mountain** — homepage, pages majeures
```tsx
<section className="relative h-[96vh] min-h-[640px] overflow-hidden pt-20">
  {/* Photo plein format + parallax */}
  <div className="absolute inset-0 scale-[1.12]">
    <Image fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/95" />
  </div>
  
  {/* Contenu */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
    <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">
      {label}
    </p>
    <h1 className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em]
      text-[clamp(36px,5vw,72px)] max-w-2xl mb-5">
      {title}
    </h1>
    <p className="font-sans text-[16px] text-white/55 max-w-xl mb-10">
      {description}
    </p>
    <div className="flex items-center gap-4">
      {/* CTAs */}
    </div>
  </div>
</section>
```

**Hero Navy** — pages secondaires, blog
```tsx
<section className="bg-ag-navy pt-24 pb-20 px-6">
  <div className="max-w-7xl mx-auto">
    <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5
      flex items-center gap-3">
      <span className="w-8 h-px bg-ag-apex" />
      {label}
    </p>
    <h1 className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em]
      text-[clamp(36px,5vw,72px)] max-w-2xl mb-5">
      {title}
    </h1>
    <p className="font-sans text-[16px] text-white/55 max-w-xl">
      {description}
    </p>
  </div>
</section>
```

**Hero Blanc** — pages utilitaires, formulaires
```tsx
<section className="bg-ag-white border-b border-ag-border pt-32 pb-16 px-6">
  <div className="max-w-7xl mx-auto">
    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
      {breadcrumb}
    </p>
    <h1 className="font-sans font-bold text-ag-black leading-tight tracking-tighter
      text-[clamp(28px,4vw,48px)] max-w-3xl mb-5">
      {title}
    </h1>
    <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-xl">
      {description}
    </p>
  </div>
</section>
```

### Section patterns

**Section avec eyebrow + titre + grille**
```tsx
<section className="py-24 px-6 bg-ag-white border-t border-ag-border">
  <div className="max-w-7xl mx-auto">
    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
      {eyebrow}
    </p>
    <h2 className="font-sans font-bold text-ag-black text-[clamp(24px,3vw,36px)]
      leading-tight tracking-tighter mb-5">
      {title}
    </h2>
    <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-16 max-w-xl">
      {description}
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Cartes */}
    </div>
  </div>
</section>
```

**Strip CTA** — bandeau navy avec icônes + CTA
```tsx
<section className="bg-ag-navy border-t border-white/10 py-16 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
      <div>
        <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase
          text-ag-apex-ink mb-4 flex items-center gap-3">
          <span className="w-6 h-px bg-ag-apex" />
          {label}
        </p>
        <h2 className="font-sans font-bold text-white text-[clamp(20px,2.5vw,28px)]
          leading-tight mb-4">
          {title}
        </h2>
        <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
      
      <Link href="..." className="rounded-lg inline-flex items-center gap-2
        bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.14em]
        uppercase px-6 py-3 hover:bg-ag-apex/90 transition-colors">
        {cta}
        <ArrowUpRight size={13} />
      </Link>
    </div>
  </div>
</section>
```

### Article / Blog layout

**Structure complète**
```tsx
{/* Hero navy */}
<section className="bg-ag-navy pt-24 pb-20 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center gap-2 mb-5">
      <span className="font-sans text-[11px] text-ag-gray-light border border-ag-border
        rounded-full px-2.5 py-0.5">
        {category}
      </span>
      <span className="text-white/40">·</span>
      <span className="font-mono text-[10px] text-white/40">{date}</span>
    </div>
    <h1 className="font-sans font-bold text-white leading-[1.08] tracking-[-0.02em]
      text-[clamp(28px,4vw,48px)] max-w-3xl mb-5">
      {title}
    </h1>
    <p className="font-sans text-[16px] text-white/65 max-w-2xl">
      {excerpt}
    </p>
  </div>
</section>

{/* Corps article */}
<article className="bg-ag-white py-16 px-6">
  <div className="max-w-3xl mx-auto">
    <div className="prose prose-ag">
      {/* Contenu markdown/HTML */}
    </div>
  </div>
</article>
```

**Prose styles** — si utilisé (optionnel, le site n'utilise pas @tailwindcss/typography)
```css
.prose-ag h2 {
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 700;
  color: var(--ag-black);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--ag-border);
}
.prose-ag p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--ag-gray);
  margin-bottom: 1.25rem;
}
```

---

### 🔵 Page Navy Blue — Pattern complet

**Référence** : `/advisory/technology`, `/advisory/strategy`, `/advisory/risk-compliance`, etc.

**Caractéristiques** :
- Hero **navy** (`bg-ag-navy`) avec titre blanc géant
- Sections alternées **blanc** / **cream** (`bg-ag-white` / `bg-ag-cream`)
- CTA final **cream** centré
- Typographie : titres très grands (`clamp(48px,6vw,86px)`)
- Espacement : `py-32` hero, `py-20` sections standard, `py-24` dimensions

**Structure complète**
```tsx
{/* Hero Navy — py-32 */}
<section className="border-b border-ag-border bg-ag-navy overflow-hidden">
  <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-32">
    <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em]
      text-ag-apex/70 mb-8">
      {eyebrow}
    </p>
    <h1
      className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.18] max-w-3xl mb-8"
      style={{ fontSize: 'clamp(48px,6vw,86px)' }}
    >
      {title}
    </h1>
    <p className="text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
      {description}
    </p>
    <Link
      href="/contact"
      className="rounded-lg inline-flex items-center gap-3 bg-ag-apex text-ag-navy
        font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4
        hover:bg-ag-apex/90 transition-colors"
    >
      {cta} <ArrowUpRight size={14} />
    </Link>
  </div>
</section>

{/* Section Blanc — py-20 */}
<section className="border-b border-ag-border bg-ag-white">
  <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
    <h2 className="font-sans font-bold text-[28px] text-ag-navy mb-6">
      {sectionTitle}
    </h2>
    <p className="text-[15px] text-ag-gray leading-relaxed max-w-3xl">
      {sectionDesc}
    </p>
  </div>
</section>

{/* Section Cream (bg-ag-cream ou bg-ag-off-white) — py-20 */}
<section className="border-b border-ag-border bg-ag-cream">
  <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
    <h2 className="font-sans font-bold text-[28px] text-ag-navy mb-4">
      {approachTitle}
    </h2>
    <p className="text-[15px] text-ag-gray leading-relaxed max-w-3xl mb-12">
      {approachDesc}
    </p>
    {/* Grille 4 colonnes — cartes numérotées */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step, idx) => (
        <div key={idx} className="bg-white border border-ag-border p-6">
          <div className="font-sans font-semibold text-[10px] tracking-[0.2em]
            text-ag-apex-ink mb-4">
            {String(idx + 1).padStart(2, '0')}
          </div>
          <h3 className="font-sans font-semibold text-[16px] text-ag-navy mb-3">
            {step.label}
          </h3>
          <p className="text-[13px] text-ag-gray leading-relaxed">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Section Blanc — Dimensions — py-24 */}
<section className="border-b border-ag-border bg-ag-white">
  <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
    <div className="grid md:grid-cols-2 gap-12">
      {dimensions.map((dim, idx) => (
        <div key={idx} className="border-l-2 border-ag-apex/20 pl-6">
          <h3 className="font-sans font-semibold text-[18px] text-ag-navy mb-3">
            {dim.label}
          </h3>
          <p className="text-[14px] text-ag-gray leading-relaxed">
            {dim.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* CTA Final Cream — py-20, centré */}
<section className="border-b border-ag-border bg-ag-cream">
  <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center">
    <h2 className="font-sans font-bold text-[32px] text-ag-navy mb-6">
      {ctaTitle}
    </h2>
    <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mx-auto mb-10">
      {ctaDesc}
    </p>
    <Link
      href="/contact"
      className="rounded-lg inline-flex items-center gap-3 bg-ag-apex text-ag-navy
        font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4
        hover:bg-ag-apex/90 transition-colors"
    >
      {ctaButton} <ArrowUpRight size={14} />
    </Link>
  </div>
</section>
```

**Règles Navy Blue** :
- Hero : **toujours** `bg-ag-navy`, `py-32`, titre `clamp(48px,6vw,86px)`
- Sections : alternance `bg-ag-white` / `bg-ag-cream`, `py-20` ou `py-24`
- Titres sections : `text-[28px]` (h2), `text-ag-navy`
- CTA final : **toujours** centré, `bg-ag-cream`, `py-20`
- Grilles : 4 colonnes (`lg:grid-cols-4`) pour steps, 2 colonnes pour dimensions
- Cartes steps : fond blanc, bordure, numéro vert `text-ag-apex-ink`
- Dimensions : bordure gauche `border-l-2 border-ag-apex/20`, `pl-6`

---

### ⚪ Page Blanc — Pattern complet

**Référence** : `/about` (À propos), `/portfolio`, `/contact`, etc.

**Caractéristiques** :
- Hero **blanc** (`bg-ag-white`) avec titre noir géant
- Sections **toutes blanches** ou alternées `bg-ag-white` / `bg-ag-off-white`
- Section navy **unique** au milieu (Swiss, groupe)
- Typographie : titres très grands (`clamp(48px,6vw,86px)`)
- Espacement : `py-32` hero, `py-24` sections standard
- Grilles avec filets `gap-px bg-ag-border`

**Structure complète**
```tsx
{/* Hero Blanc — py-32 */}
<section className="border-b border-ag-border">
  <div className="mx-auto max-w-7xl px-6 md:px-12 py-32">
    <div className="flex items-start justify-between gap-8">
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em]
          text-ag-gray-light mb-8">
          {eyebrow}
        </p>
        <h1
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.18]
            max-w-3xl mb-8 whitespace-pre-line"
          style={{ fontSize: 'clamp(48px,6vw,86px)' }}
        >
          {title}
        </h1>
        <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl whitespace-pre-line">
          {description}
        </p>
      </div>
      {/* Optionnel : logo, image, illustration à droite */}
    </div>
  </div>
</section>

{/* Section Blanc — Eyebrow slash — py-24 */}
<section className="border-b border-ag-border">
  <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em]
      text-ag-gray-light mb-10">
      / {eyebrow}
    </p>
    <h2
      className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1]
        max-w-2xl mb-16 whitespace-pre-line"
      style={{ fontSize: 'clamp(32px,4vw,56px)' }}
    >
      {sectionTitle}
    </h2>
    
    {/* Grille 3 colonnes avec filets */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border mb-16">
      {items.map((item, i) => (
        <div key={i} className="bg-ag-white p-10">
          <p className="font-sans font-bold text-ag-black tracking-[0.08em] text-[22px] mb-4">
            {item.word}
          </p>
          <p className="text-[14px] text-ag-gray leading-relaxed">
            {item.meaning}
          </p>
        </div>
      ))}
    </div>
    
    {/* Texte de synthèse */}
    <div className="max-w-3xl space-y-5">
      <p className="text-[16px] text-ag-black leading-relaxed font-semibold">
        {synthesis}
      </p>
      <p className="text-[14px] text-ag-gray leading-relaxed">
        {note}
      </p>
    </div>
  </div>
</section>

{/* Section Blanc — 2 colonnes titre + texte — py-24 */}
<section className="border-b border-ag-border bg-ag-white">
  <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em]
      text-ag-gray-light mb-10">
      / {eyebrow}
    </p>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
      <h2
        className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1]
          whitespace-pre-line"
        style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
      >
        {title}
      </h2>
      <p className="text-[15px] text-ag-gray leading-relaxed self-end">
        {description}
      </p>
    </div>
    
    {/* Grille 3 colonnes avec filets */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border">
      {items.map((item, i) => (
        <div key={i} className="bg-ag-white p-10">
          <p className="font-sans font-semibold text-[10px] tracking-[0.2em]
            text-ag-apex-ink mb-6">
            {item.num}
          </p>
          <h3 className="font-sans font-bold text-ag-black text-[18px]
            tracking-[-0.02em] leading-snug mb-4">
            {item.title}
          </h3>
          <p className="text-[13px] text-ag-gray leading-relaxed">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Section Navy — Unique au milieu — py-28 */}
<section className="bg-ag-navy py-28 px-6 md:px-12 border-b border-ag-navy">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div>
        <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase
          text-white/60 mb-4">
          {label}
        </p>
        <h2
          className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1]
            whitespace-pre-line mb-8"
          style={{ fontSize: 'clamp(26px,3vw,48px)' }}
        >
          {title}
        </h2>
        <Link
          href="/advisory"
          className="rounded-lg inline-flex items-center gap-3 font-sans font-semibold
            text-[11px] tracking-[0.16em] uppercase text-white border border-white/30
            px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
        >
          {cta} <ArrowUpRight size={14} />
        </Link>
      </div>
      <p className="text-[15px] text-white/70 leading-relaxed self-center">
        {description}
      </p>
    </div>
  </div>
</section>

{/* Section Blanc — Grille 5 colonnes — py-24 */}
<section className="border-b border-ag-border">
  <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em]
      text-ag-gray-light mb-10">
      / {eyebrow}
    </p>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
      <h2
        className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1]
          whitespace-pre-line"
        style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
      >
        {title}
      </h2>
      <p className="text-[15px] text-ag-gray leading-relaxed self-end">
        {subtitle}
      </p>
    </div>
    
    {/* Grille 5 colonnes avec filets */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-ag-border">
      {items.map((item, i) => (
        <div key={i} className="bg-ag-white p-8 flex flex-col gap-5">
          <p className="font-sans font-semibold text-[10px] tracking-[0.2em]
            text-ag-gray-light">
            {item.num}
          </p>
          <p className="font-sans font-bold text-ag-black text-[13px] tracking-[0.12em]
            leading-none">
            {item.title}
          </p>
          <p className="text-[13px] text-ag-gray leading-relaxed flex-1">
            {item.desc}
          </p>
          <Link
            href={item.href}
            className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold
              text-[10px] tracking-[0.14em] uppercase text-ag-black border border-ag-border
              px-4 py-2.5 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy
              transition-all self-start"
          >
            {item.cta} <ArrowUpRight size={12} />
          </Link>
        </div>
      ))}
    </div>
  </div>
</section>

{/* CTA Final Blanc — Grille 3 colonnes — py-24 */}
<section className="border-b border-ag-border">
  <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em]
      text-ag-gray-light mb-16">
      / {eyebrow}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border">
      {profiles.map((profile) => (
        <div key={profile} className="bg-ag-white p-10 flex flex-col gap-6">
          <div className="flex-1">
            <h3 className="font-sans font-bold text-ag-black text-[18px]
              tracking-[-0.02em] leading-snug mb-3">
              {profile.title}
            </h3>
            <p className="text-[13px] text-ag-gray leading-relaxed">
              {profile.desc}
            </p>
          </div>
          <Link
            href={profile.href}
            className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold
              text-[11px] tracking-[0.14em] uppercase text-ag-black border border-ag-border
              px-5 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy
              transition-all self-start"
          >
            {profile.btn} <ArrowUpRight size={13} />
          </Link>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Règles Blanc** :
- Hero : **toujours** `bg-ag-white`, `py-32`, titre `clamp(48px,6vw,86px)`, texte noir
- Eyebrow : **toujours** préfixé `/` (slash), `text-[10px] tracking-[0.28em]`
- Sections : **toutes blanches** ou alternées `bg-ag-white` / `bg-ag-off-white`, `py-24`
- Section navy : **une seule** au milieu, `py-28`, 2 colonnes, bouton ghost blanc
- Titres sections : `clamp(28px,3.5vw,48px)` ou `clamp(32px,4vw,56px)`
- Grilles : **toujours** avec filets `gap-px bg-ag-border`, cartes `bg-ag-white p-10` ou `p-8`
- Grilles 3 colonnes : standard (name, contribution, CTA final)
- Grilles 5 colonnes : disciplines/services avec CTA par carte
- Numéros : `text-[10px] tracking-[0.2em] text-ag-gray-light` ou `text-ag-apex-ink`
- CTAs : ghost `border-ag-border` → hover `border-ag-apex bg-ag-apex text-ag-navy`

**Différences clés Navy Blue vs Blanc** :

| Aspect | Navy Blue | Blanc |
|---|---|---|
| Hero fond | `bg-ag-navy` | `bg-ag-white` |
| Hero titre | Blanc `text-white` | Noir `text-ag-black` |
| Hero padding | `py-32` | `py-32` |
| Eyebrow hero | `text-ag-apex/70` | `text-ag-gray-light` |
| Eyebrow sections | Aucun slash | **Toujours** `/` slash |
| Sections fond | Alternance blanc/cream | Toutes blanches (+ 1 navy) |
| Grilles | Sans filets (gap-8) | **Avec filets** `gap-px bg-ag-border` |
| Cartes steps | `p-6`, numéro vert | `p-10` ou `p-8`, numéro vert ou gris |
| CTA final | Centré, `bg-ag-cream` | Grille 3 col, `bg-ag-white` |
| Section navy | Aucune | **Une seule** au milieu |

---

## 9. Accessibilité & UX transverses

### Accessibilité clavier & screen readers

**Skip-link** — premier élément focusable
```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4
  focus:left-4 z-50 bg-ag-navy px-4 py-2 text-sm font-bold text-white rounded-lg">
  Aller au contenu principal
</a>
```

**Labels ARIA**
- `aria-label` sur **tout** lien icône seul (sans texte visible)
- `aria-hidden="true"` sur icônes décoratives (accompagnées de texte)
- `aria-labelledby` sur sections avec heading
- `aria-describedby` sur formulaires avec aide contextuelle

**Focus visible**
```css
:focus-visible {
  outline: 2px solid var(--ag-navy);
  outline-offset: 3px;
}
```

### Contrastes (WCAG AA minimum)

**Validés**
- `ag-gray` (#374151) sur blanc : **8.2:1** (AAA)
- `ag-gray-light` (#6B7280) sur blanc : **5.9:1** (AA)
- `ag-apex-ink` (#0C7A52) sur blanc : **4.8:1** (AA)
- Blanc sur `ag-navy` (#0A1D2E) : **14.5:1** (AAA)

**Interdits**
- `ag-apex` (#5ADDA4) sur fond clair : **2.1:1** ❌ — **toujours** utiliser `ag-apex-ink`
- `ag-apex` en texte : réservé aux fonds sombres (navy/noir), badges et bordures

**Règle d'or** : si le fond est `bg-ag-white`, `bg-ag-off-white` ou `bg-ag-light-gray`,
le texte vert **doit** être `text-ag-apex-ink`, jamais `text-ag-apex`.

### Sélection & focus

**Sélection de texte**
```css
::selection {
  background: rgba(90, 221, 164, 0.25);  /* apex 25% */
  color: var(--ag-black);
}
```

**Meta tags**
```html
<meta name="theme-color" content="#050505" />
<meta name="color-scheme" content="light" />
<meta name="format-detection" content="telephone=no" />
<link rel="mask-icon" href="/favicon.svg" color="#5ADDA4" />
```

### Responsive & mobile

**Breakpoints Tailwind** (défaut)
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

**Typographie responsive**
```css
body { font-size: 16px; }
@media (max-width: 640px) {
  body { font-size: 15px; }
}
```

**Titres responsive** — `clamp()` systématique
```tsx
text-[clamp(36px,5vw,72px)]  /* Hero h1 */
text-[clamp(28px,4vw,48px)]  /* Page h1 */
text-[clamp(24px,3vw,36px)]  /* Section h2 */
text-[clamp(20px,2.5vw,28px)]/* Strip h2 */
```

**Touch targets** — minimum 44×44px (WCAG 2.5.5)
- Boutons : `px-6 py-3` = 48px hauteur minimum
- Liens navbar : `py-1` + padding parent = 44px+ zone cliquable
- Icônes seules : wrapper `w-11 h-11` minimum

---

## 10. Solutions design & références

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

## 11. Index des composants — référence rapide

### Layout & Chrome

| Composant | Fichier | Usage |
|---|---|---|
| **Nav** | `components/layout/Nav.tsx` | Navbar fixed, mega-menus, mobile drawer |
| **Footer** | `components/layout/Footer.tsx` | Footer navy, grille 6 col, médaillon rotatif |
| **FooterMarquee** | `components/layout/FooterMarquee.tsx` | Bandeau défilant « Aegryn » |
| **LanguageSwitcher** | `components/layout/LanguageSwitcher.tsx` | Select 6 langues, variante dark |
| **ScrollToTop** | `components/ui/ScrollToTop.tsx` | Bouton scroll-to-top |
| **LenisProvider** | `components/providers/LenisProvider.tsx` | Smooth scroll global |

### Sections & Heros

| Composant | Fichier | Usage |
|---|---|---|
| **HeroMountain** | `components/sections/HeroMountain.tsx` | Hero homepage, photo parallax, reveal lignes |
| **DiscoverGrid** | `components/sections/discover/DiscoverGrid.tsx` | Page blog, hero navy + grille articles |
| **AdvisoryTechStrip** | `components/sections/AdvisoryTechStrip.tsx` | Strip CTA advisory, 6 piliers |
| **GradeStrip** | `components/sections/GradeStrip.tsx` | Strip CTA certification |
| **DiscoverStrip** | `components/sections/DiscoverStrip.tsx` | Strip CTA blog, carousel articles |

### Grilles & Cartes

| Composant | Fichier | Usage |
|---|---|---|
| **AssetsGrid** | `components/sections/assets/AssetsGrid.tsx` | Grille actifs certifiés, filtres |
| **ProprietaryAssetsGrid** | `components/sections/assets/ProprietaryAssetsGrid.tsx` | Grille actifs propriétaires |
| **ExpertiseGrid** | `components/sections/alliances/ExpertiseGrid.tsx` | Grille expertises partenaires |
| **IndustryArticles** | `components/sections/industries/IndustryArticles.tsx` | Articles par secteur |
| **AssetCarousel** | `components/sections/AssetCarousel.tsx` | Carousel actifs, variantes navy/blanc |

### Formulaires

| Composant | Fichier | Usage |
|---|---|---|
| **ContactForm** | `components/contact/ContactForm.tsx` | Formulaire contact standard |
| **TalentHiringForm** | `components/forms/TalentHiringForm.tsx` | Formulaire recrutement |
| **WaitlistForm** | `components/transaction/WaitlistForm.tsx` | Formulaire waitlist transaction |
| **PhoneInput** | `components/ui/PhoneInput.tsx` | Input téléphone international |

### UI & Utilities

| Composant | Fichier | Usage |
|---|---|---|
| **FilterPills** | `components/ui/FilterPills.tsx` | Pills filtres blog/actifs |
| **AssetIndicators** | `components/ui/AssetIndicators.tsx` | Dots status, badges grade |
| **NotificationBell** | `components/client/NotificationBell.tsx` | Cloche notifications, animation ring |
| **ScrollReveal** | `components/animations/ScrollReveal.tsx` | Wrapper reveal GSAP |

### Grade & Certification

| Composant | Fichier | Usage |
|---|---|---|
| **GradePricing** | `components/sections/grade/GradePricing.tsx` | Grille tarifs certification |
| **GradeDimensions** | `components/sections/grade/GradeDimensions.tsx` | 5 dimensions CIFSO |
| **GradeAudienceTable** | `components/sections/grade/GradeAudienceTable.tsx` | Table lecture par profil |
| **CifsoBrochure** | `components/sections/grade/CifsoBrochure.tsx` | Brochure print A4 |

---

## 12. Starter kit — reproduire la charte ailleurs

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
  fontSize: {
    'display':  ['clamp(64px,8vw,120px)', { lineHeight: '0.92', letterSpacing: '-0.03em', fontWeight: '800' }],
    'h1-mag':   ['clamp(36px,5vw,64px)',  { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }],
    'h2-mag':   ['clamp(22px,3vw,36px)',  { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '600' }],
    'body-mag': ['18px',                   { lineHeight: '1.7',  letterSpacing: '0',       fontWeight: '400' }],
    'label-mag':['12px',                   { lineHeight: '1.4',  letterSpacing: '0.08em',  fontWeight: '500' }],
  },
  maxWidth: { magazine: '1440px', prose: '720px' },
  letterSpacing: { tighter: '-0.03em' },
  keyframes: {
    marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-100%)' } },
  },
  animation: {
    'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'marquee': 'marquee 6s linear infinite',
    'marquee-pause': 'marquee 6s linear infinite paused',
  },
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
| `styles/globals.css` | Base CSS, transitions, utilities, scrollbar, keyframes |
| `public/fonts/PlusJakartaSans/*.woff2` | Les 6 graisses (300, 400, 500, 600, 700, 800) |
| `lib/gsap.ts` | Enregistrement plugins GSAP (SplitText, DrawSVG, ScrambleText, Flip) |
| `components/providers/LenisProvider.tsx` | Smooth scroll + sync ScrollTrigger |
| `components/animations/ScrollReveal.tsx` | Reveal standard GSAP |
| `components/layout/Nav.tsx` | Navbar complète, mega-menus, mobile drawer |
| `components/layout/Footer.tsx` | Footer navy, grille 6 col, médaillon rotatif |
| `components/layout/FooterMarquee.tsx` | Marquee défilant |
| `components/layout/LanguageSwitcher.tsx` | Select langues |
| `components/ui/ScrollToTop.tsx` | Bouton scroll-to-top |
| `i18n/routing.ts` | Config next-intl 6 locales |
| `app/[locale]/layout.tsx` | Layout racine, meta, fonts |

### Checklist identité — 10 points non négociables

1. **Fond blanc, texte quasi-noir** `#0A0A0A`, accent **un seul** : `#5ADDA4`.
2. **Eyebrow systématique** : `font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light` au-dessus de chaque titre de section.
3. **CTAs uppercase** : `text-[11px] tracking-[0.14em] uppercase rounded-lg`, navy ou apex.
4. **Filets `#E2E8F0` partout**, jamais d'ombres fortes (sauf menus `shadow-xl`).
5. **Animations courtes** : ≤0.7s, `expo.out`, déclenchées à `top 80%`, `once: true`.
6. **Pas de vraie monospace** — `font-mono` = Plus Jakarta Sans trackée.
7. **Footer navy + marquee + médaillon rotatif** = signature non négociable.
8. **Texte vert sur fond clair** : **toujours** `text-ag-apex-ink`, jamais `text-ag-apex`.
9. **Smooth scroll Lenis** : jamais `scroll-behavior: smooth` CSS.
10. **Lucide uniquement** : aucune autre lib d'icônes (pas react-icons, heroicons, etc.).
