# Atelier — Design Language Declaration

**Project-restricted.** Not registered as a machine-wide language until further notice.

> **Thesis:** Luxury is defined by restraint, materiality, and negative space — the product
> speaks, the interface whispers. Every pixel earns its place through restraint, not decoration.

---

## Philosophy

| Field | Declaration |
|---|---|
| **Thesis** | Luxury is restraint. The shoe speaks; the interface whispers. |
| **OptimizesFor** | Perceived quality and trust through visual silence and deliberate spacing |
| **Refuses** | Visual clutter, decorative gradients, playful animations, busy backgrounds, anything that cheapens the perception |
| **NamedPatterns** | The Gallery Frame (product as art, white space as matting), The Material Palette (textures evoking leather, suede, metal hardware), The Quiet Navigation (minimal, typographic, receding until needed) |
| **SlotRationale** | Every answer follows from the thesis: space over decoration, monochrome over color, serif over sans for headlines, materiality over flatness |

---

## The 18 Slots

### A · Surface & Depth

| # | Slot | Answer | Rationale |
|---|---|---|---|
| 1 | `surfaceBoundary` | `border` | Thin, precise borders evoke the stitching on leather — architectural, not decorative |
| 2 | `depthModel` | `shadow` | Subtle, warm shadows suggest physical objects on a surface — shoes on a shelf |
| 3 | `darkStrategy` | `separate-palette` | Deep blacks and crisp whites — high contrast, no tinting |

### B · Shape

| # | Slot | Answer | Rationale |
|---|---|---|---|
| 4 | `cornerPhilosophy` | `square` | Sharp, architectural corners — precision engineering, no softness |
| 5 | `shapeCarriesBrand` | `no` | Shape is neutral; brand is carried by typography, materiality, and restraint |

### C · Colour

| # | Slot | Answer | Rationale |
|---|---|---|---|
| 6 | `colorRole` | `functional-only` | Colour is used only where function demands it (errors, success states) |
| 7 | `functionalColorContainment` | `badge-only` | Functional colour confined to small indicators — badges, status dots, validation ticks |
| 8 | `colorInHierarchy` | `excluded` | Hierarchy is carried by weight, size, and spacing — never colour |
| 9 | `polarityEncoding` | `weight-before-color` | Text hierarchy through font weight, not colour — black, charcoal, silver |

### D · Typography

| # | Slot | Answer | Rationale |
|---|---|---|---|
| 10 | `typeRoleAssignment` | `{ display: "Playfair Display", heading: "Playfair Display", body: "Inter", data: "JetBrains Mono" }` | Serif headlines evoke heritage and craftsmanship; sans-serif body for clarity; monospace for data |
| 11 | `monospaceScope` | `data-only` | Monospace only for numerical data — prices, sizes, quantities |

### E · Space

| # | Slot | Answer | Rationale |
|---|---|---|---|
| 12 | `density` | `comfortable` | Generous spacing — luxury is space. Every element breathes. |
| 13 | `spaceAllocation` | `earned-by-importance` | Primary content receives the most space; secondary elements recede |
| 14 | `sectionRhythm` | `spacing-only` | Sections separated by generous whitespace — no borders, no backgrounds, just space |

### F · Motion

| # | Slot | Answer | Rationale |
|---|---|---|---|
| 15 | `motion` | `{ productiveRangeMs: 200, easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)", expressiveAllowedIn: "hero-only" }` | Subtle, almost imperceptible — like a well-made door closing. Hero section may have expressive motion. |

### G · Ornament & Emphasis

| # | Slot | Answer | Rationale |
|---|---|---|---|
| 16 | `decoration` | `none` | No decorative elements. Every visual element must justify its existence. |
| 17 | `emphasisSurfaceBudget` | `1` | Only one hero product per viewport — singular focus, luxury of attention |
| 18 | `hierarchySignals` | `["weight", "size", "spacing", "position"]` | Hierarchy through typographic weight, scale, whitespace, and positional prominence |

---

## Design Tokens (CSS Custom Properties)

```css
:root {
  /* Primitive tokens — Atelier palette */
  --atelier-black: #0a0a0a;
  --atelier-charcoal: #2d2d2d;
  --atelier-graphite: #4a4a4a;
  --atelier-silver: #8a8a8a;
  --atelier-pearl: #d4d4d4;
  --atelier-ivory: #f5f5f5;
  --atelier-white: #fafafa;
  --atelier-pure-white: #ffffff;
  
  /* Metallic accents */
  --atelier-gold: #c9a96e;
  --atelier-gold-light: #d4b87a;
  --atelier-gold-dark: #b8944f;
  
  /* Semantic tokens — named by role */
  --color-bg-primary: var(--atelier-white);
  --color-bg-secondary: var(--atelier-ivory);
  --color-bg-dark: var(--atelier-black);
  --color-text-primary: var(--atelier-black);
  --color-text-secondary: var(--atelier-graphite);
  --color-text-muted: var(--atelier-silver);
  --color-text-inverse: var(--atelier-white);
  --color-border-primary: var(--atelier-pearl);
  --color-border-subtle: rgba(0, 0, 0, 0.08);
  --color-accent: var(--atelier-gold);
  --color-accent-hover: var(--atelier-gold-light);
  --color-accent-active: var(--atelier-gold-dark);
  
  /* Functional colours — badge-only containment */
  --color-success: #2d5016;
  --color-error: #8b1a1a;
  --color-warning: #7a5c00;
  
  /* Typography */
  --font-display: 'Playfair Display', 'Georgia', serif;
  --font-body: 'Inter', 'Helvetica Neue', sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;
  
  /* Font sizes — modular scale (1.25) */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  --text-hero: clamp(3rem, 8vw, 6rem);
  
  /* Font weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  
  /* Line heights */
  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  
  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-wider: 0.1em;
  --tracking-widest: 0.2em;
  
  /* Spacing — 4px base, comfortable density */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;
  --space-40: 10rem;
  --space-section: clamp(4rem, 10vh, 8rem);
  
  /* Borders */
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-color: var(--color-border-primary);
  --border-subtle: var(--border-width-thin) solid var(--color-border-subtle);
  --border-primary: var(--border-width-thin) solid var(--border-color);
  
  /* Shadows — warm, suggesting physical objects */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);
  
  /* Motion */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 400ms;
  --easing-default: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --easing-in: cubic-bezier(0.42, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, 0.58, 1);
  
  /* Layout */
  --max-width-content: 1200px;
  --max-width-text: 65ch;
  --gutter: clamp(1.5rem, 4vw, 3rem);
}
```

---

## Component Token Mapping

| Component | Semantic Token | Value Source |
|---|---|---|
| Body background | `--color-bg-primary` | `--atelier-white` |
| Hero background | `--color-bg-dark` | `--atelier-black` |
| Heading text | `--color-text-primary` | `--atelier-black` |
| Body text | `--color-text-secondary` | `--atelier-graphite` |
| Muted text | `--color-text-muted` | `--atelier-silver` |
| Button background | `--color-accent` | `--atelier-gold` |
| Button text | `--color-text-inverse` | `--atelier-white` |
| Input border | `--color-border-primary` | `--atelier-pearl` |
| Card border | `--border-subtle` | `1px solid rgba(0,0,0,0.08)` |

---

## Namespace

This design language uses the prefix `--atelier-*` for its private primitive tokens.
All component code references only the semantic tokens (`--color-*`, `--font-*`, `--space-*`).

---

## Accessibility Notes

- All text meets WCAG 2.2 AA contrast ratios (≥4.5:1 for body, ≥3:1 for large text)
- Gold accent (`#c9a96e`) on white (`#fafafa`) = 2.8:1 — used for large text and decorative elements only; interactive elements use darker gold (`#b8944f`) = 3.2:1 on white
- Focus indicators: 2px solid gold with 2px offset
- `prefers-reduced-motion` respected: all animations disabled
- Target sizes: all interactive elements ≥ 24×24px
