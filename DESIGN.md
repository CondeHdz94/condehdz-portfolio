---
name: Camilo Conde — Portfolio
description: Design Engineer portfolio where the design itself is the argument.
colors:
  first-draft: "#FAFAF9"
  pale-parchment: "#F2F0EB"
  stone-border: "#E4E2DC"
  worn-stone: "#736D67"
  warm-slate: "#57534E"
  obsidian-stone: "#1C1917"
  quiet-ash: "#D4D0CA"
  amber-ember: "#B45309"
  conviction-blue: "#2563EB"
  growth-green: "#15803D"
  electric-violet: "#9333EA"
typography:
  display:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 22vw, 20rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5.5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  pill: "100px"
  sm: "4px"
  circle: "50%"
spacing:
  section-v: "112px"
  section-h: "48px"
  section-max: "860px"
  mobile-v: "72px"
  mobile-h: "24px"
components:
  skill-tag:
    backgroundColor: "transparent"
    textColor: "{colors.warm-slate}"
    rounded: "{rounded.pill}"
    padding: "8px 16px 6px"
  skill-tag-hover:
    backgroundColor: "transparent"
    textColor: "var(--accent)"
  hero-link:
    backgroundColor: "transparent"
    textColor: "{colors.warm-slate}"
    rounded: "{rounded.pill}"
    padding: "13px 24px 11px"
  hero-link-hover:
    backgroundColor: "transparent"
    textColor: "{colors.obsidian-stone}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.worn-stone}"
    typography: "{typography.label}"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "var(--accent)"
---

# Design System: Camilo Conde — Portfolio

## 1. Overview

**Creative North Star: "The Selective Reveal"**

This system gives nothing away unprompted. Color is earned by scroll. Hierarchy is earned by attention. The ambient bloom exists only where something is active. The design operates on a single principle: everything is conditional on context, and that conditionality is the craft.

The palette begins in monochrome — warm paper, stone, ink — and unlocks section by section as the visitor moves through the page. This is not a scroll animation gimmick. It is the argument: a Design Engineer who can build a system where the interface itself demonstrates taste without announcing it.

Two visual registers coexist. The **CV register** is flat, editorial, typographically driven. The **case study register** is cinematic — deep shadows, phosphor glow, glass panels — because the work being shown demands immersion. Moving from one to the other is a threshold, not a transition. The contrast between them is intentional and structural.

This system explicitly rejects: gradient text, glassmorphism as default decoration, hero-metric templates, identical card grids, and any aesthetic that reads as "built by AI." If an element cannot justify its presence against the North Star, it does not exist.

**Key Characteristics:**
- Monochromatic at rest, chromatic in context
- Typography carries hierarchy; components stay silent
- Flat in the CV register, cinematic in case studies
- One easing curve: `cubic-bezier(0.16, 1, 0.3, 1)` — everything moves the same way
- Warm stone undertones throughout; never pure black or pure white

## 2. Colors: The Reveal Palette

The palette is built around a single dramatic act: the transition from monochrome to color. At rest, only stone tones are visible. In motion, section accents emerge one at a time.

### Primary (Section Accents — the unlock)
Each accent is active only while its section dominates the viewport. They are never simultaneously visible.

- **Amber Ember** (`#B45309`): About section. Warm authority. Used on `--color-about`.
- **Conviction Blue** (`#2563EB`): Experience section. Precise and confident. Used on `--color-experience`. Lighter in dark mode (`#60A5FA`).
- **Growth Green** (`#15803D`): Skills section. Deliberate and alive. Used on `--color-skills`. Lighter in dark mode (`#22C55E`).
- **Electric Violet** (`#9333EA`): Contact section. Final beat, highest energy. Used on `--color-contact`. Lighter in dark mode (`#C084FC`).

**The One Voice Rule.** Only one accent is active at a time. `--accent` on `:root` is the single source of truth. Components reference `var(--accent)`, never a hardcoded section color. Rarity is the point.

### Neutral (The resting state)
- **First Draft** (`#FAFAF9`): Page background. The canvas before anything is written. Light mode `--bg`.
- **Pale Parchment** (`#F2F0EB`): Elevated surface. Something that has been handled. Light mode `--surface`.
- **Stone Border** (`#E4E2DC`): Dividers and borders. The structure of the page, barely visible.
- **Worn Stone** (`#736D67`): Muted text — labels, eyebrows, captions. Text that steps back.
- **Warm Slate** (`#57534E`): Body text. Readable without competing.
- **Obsidian Stone** (`#1C1917`): Strong text — headings, company names, the hero name. Warm black with volcanic weight.
- **Quiet Ash** (`#D4D0CA`): Neutral accent (hero state). The color of the system before the unlock. Present, not silent.

**The Warmth Rule.** Every neutral leans warm. No cool grays, no pure blacks, no optical whites. The undertone is always toward stone and amber, never toward blue or green.

## 3. Typography

**Display / Body Font:** Epilogue (single family, all weights)
**Mono Font:** IBM Plex Mono (case studies and technical content only)

**Character:** A single family across all sizes and weights creates coherence without variety. Epilogue's slightly condensed geometry reads as precise at large sizes; at small sizes the weight contrast (`400` body, `600` label, `700–900` display) creates hierarchy without needing a second face. The mono pairing appears exclusively in the case study register, marking the transition from editorial to technical.

### Hierarchy
- **Display** (weight 900, `clamp(4.5rem, 22vw, 20rem)`, lh 1, ls `-0.04em`): Hero name only. Never used for body content or section headings.
- **Headline** (weight 700, `clamp(2.25rem, 5.5vw, 4rem)`, lh 1.05, ls `-0.03em`): Section entry headlines and contact CTA.
- **Stat** (weight 700, `clamp(2.75rem, 4vw, 3.25rem)`, lh 1, ls `-0.04em`): Numerical stats in About. Color is `var(--accent)`.
- **Title** (weight 700, `1.375rem`, lh 1.2, ls `-0.03em`): Company names in timeline, subheadings.
- **Lead** (weight 300, `clamp(0.9375rem, 1.8vw, 1.1875rem)`): Hero subtitle. Light weight signals secondary role.
- **Body** (weight 400, `1rem`, lh 1.85): Prose. Max line length 65ch enforced.
- **Secondary** (weight 400, `0.875rem`, lh 1.75): Timeline descriptions, supporting text.
- **Label** (weight 600, `0.6875rem`, ls `0.12em`, uppercase): Section numbers, eyebrows, nav links, role titles. The smallest legible size in the system.

**The Single Family Rule.** Epilogue handles every weight. Never introduce a second display face. The hero name at `clamp(4.5rem, 22vw, 20rem)` weight 900 and a label at `0.6875rem` weight 600 are the same font — that coherence is visible and intentional.

## 4. Elevation

This system has two registers with distinct elevation philosophies.

**CV Register:** Flat by default. Depth is atmospheric, not structural. Surfaces layer through tone (`--surface` over `--bg`) and borders (`--border`). No `box-shadow` anywhere in the CV. The single permitted atmospheric element is the ambient bloom: a blurred radial glow tied to `var(--accent)`, `opacity: 0.13`, `filter: blur(80px)`. It creates depth without weight.

**The Atmospheric Exception Rule.** The ambient bloom is the only permitted depth element in the CV register. It is not an elevation token. It is climate.

**Case Study Register:** Cinematic depth is permitted and expected. Shadows, phosphor glow, glass panel effects, CRT overlays — all serve the narrative of the work being shown. The depth of the case study is a threshold signal: arriving here feels different from the CV. That contrast is structural.

### Shadow Vocabulary (Case Study Register only)
- **Panel lift** (`0 30px 80px -20px rgba(28,25,23,0.35)`): Floating panels in animations. Structural separation.
- **Panel border** (`0 0 0 1px #1a2818`): Terminal panel edge definition on dark backgrounds.
- **Modern panel** (`0 30px 80px -30px rgba(28,25,23,0.18)`): Lighter lift for the web-modernized panels.
- **Phosphor glow** (`0 0 6px rgba(74,222,128,0.85), 0 0 14px rgba(74,222,128,0.45)`): CRT terminal text. Not a shadow — atmospheric radiation.

## 5. Components

**Philosophy: Editorial y reservado.** Components do not compete with content. At rest, they are nearly invisible — border-only, no fill, no color. On interaction, `var(--accent)` appears. That appearance is the selective reveal at component scale.

### Navigation
- **Layout:** Fixed, 3-column grid (`1fr auto 1fr`). Logo left, links center, toggle right.
- **Default:** Transparent background, no border. Invisible until scrolled.
- **Scrolled:** `border-bottom: 1px solid var(--border)`. Structure appears when needed.
- **Links:** `0.6875rem`, weight 600, `0.1em` letter-spacing, uppercase, `var(--text-muted)`. Hover → `var(--accent)`.
- **Active link:** Same as hover. One state, not two.

### Skill Tags / Hero Links (same component, two contexts)
- **Shape:** Pill (`border-radius: 100px`). The roundness is the only decoration.
- **Default:** `border: 1px solid var(--border)`, transparent fill, `var(--text)`.
- **Hover:** Border → `var(--accent)`, text → `var(--accent)`. No fill change. The border is the only signal needed.
- **No pressed state.** These are not actions; they are labels or links.

### Timeline Items
- **Separator:** `border-top: 1px solid var(--border)`. No padding block, no card.
- **Hover:** Company name gains `color: var(--accent)` and `translateX(6px)`. The single animated element.
- **Transition:** `cubic-bezier(0.16, 1, 0.3, 1)`, `0.35s` on transform, `0.4s` on color.
- **No hover fill.** The item does not become a card on hover.

### Section Labels
- **Structure:** Number in `var(--accent)` + separator + uppercase label in `var(--text-muted)`.
- **The number is the accent.** The only place where section color appears at rest (it tracks `--accent` which is set by scroll position).

### Theme Toggle
- **Shape:** Circle (`border-radius: 50%`), `34×34px`.
- **Default:** `border: 1px solid var(--border)`, transparent fill, `var(--text-muted)`.
- **Hover:** Border and icon → `var(--accent)`.
- **Animate:** `scale(0.4) rotate(180deg)` at midpoint, returns to `scale(1) rotate(360deg)`. Duration: `0.5s`, same easing curve.

### Case Study Entry Point (T&J timeline item)
- **Pattern:** A text link at the bottom of the relevant experience item. `var(--text-secondary)` at rest, `var(--accent)` on hover. Arrow `→` character, no icon SVG.
- **No card, no badge, no modal.** The link earns its presence through the content above it.

## 6. Do's and Don'ts

### Do:
- **Do** reference `var(--accent)` for all interactive color states. Never hardcode a section color in a component.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for every transition. One curve, everywhere. No exceptions.
- **Do** enforce 65ch max line length on body text.
- **Do** keep the CV register flat. Introduce shadows only in case study routes.
- **Do** use `prefers-reduced-motion` to disable transform-based animations while preserving opacity and color transitions.
- **Do** lean warm on every neutral. Tint toward stone and amber, never toward blue or green.
- **Do** treat the ambient bloom as climate, not structure. It follows `--accent`; it does not replace it.

### Don't:
- **Don't** use gradient text (`background-clip: text`). Prohibited. Use `var(--text-strong)` or `var(--accent)` as a solid color.
- **Don't** use glassmorphism decoratively in the CV register. Glass and blur belong exclusively in case study immersive contexts where they serve narrative.
- **Don't** create hero-metric layouts (large number, small label, stat grid below). The About section stats exist; do not replicate this pattern elsewhere.
- **Don't** use identical card grids. If items look the same, question whether they need to be cards at all.
- **Don't** animate keyboard-initiated actions. Navigation, shortcuts — no animation.
- **Don't** use `transition: all`. Specify exact properties.
- **Don't** introduce a second display typeface. Epilogue at weight 900 is the display. Trust it.
- **Don't** add decorative borders as side stripes (`border-left` > 1px as accent). Rewrite with full borders or background tints.
- **Don't** bring case study visual language (deep shadows, neon glow) into the CV register. The contrast between registers is the design.
