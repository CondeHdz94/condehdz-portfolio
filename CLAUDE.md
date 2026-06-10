# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server (localhost:5173)
pnpm build        # type-check + production build
pnpm lint         # ESLint
pnpm preview      # preview production build
```

There are no tests configured yet.

## Stack

- **Vite 8** with `@vitejs/plugin-react` (Oxc transform)
- **React 19** + **TypeScript 6** (ES2023, strict unused-locals/params)
- **CSS custom properties** — no CSS framework; all styling is hand-written CSS in scoped files
- **React Router v7** for client-side routing (4 routes, all lazy-loaded except home)
- **Lenis** for smooth scroll (desktop/hover-capable devices only)
- **`@fontsource-variable/fraunces`** — variable Fraunces font, used in the Sistel case animated scene
- **pnpm** as package manager

## Architecture

CV/portfolio for **Camilo Conde — Design Engineer**. Multi-page SPA with React Router.

```
src/
├── main.tsx                        # Router setup (BrowserRouter + routes, lazy case imports)
├── App.tsx                         # Main landing page
├── App.css                         # Landing page styles
├── index.css                       # Global tokens, type scale, animations, color system
├── content/
│   ├── experience.ts               # EXPERIENCE array (company, role, period, tags, desc, caseStudy)
│   ├── contact.ts                  # HERO_LINKS, CONTACT_LINKS, SOCIAL_LINKS
│   └── skills.ts                   # SKILLS array + CATEGORIES (Foundations, Forms, Motion, Systems)
├── hooks/
│   ├── useDarkMode.ts              # Dark mode toggle with localStorage + 420ms transition
│   ├── useLenis.ts                 # Smooth scroll (skips touch/reduced-motion)
│   ├── useScrollReveal.ts          # IntersectionObserver: adds .is-visible to .reveal elements
│   ├── useBloomFollow.ts           # Lerp-based mouse-follow for ambient bloom (desktop only)
│   └── useHeroBlobs.ts             # Canvas-based hero background blobs + glass effect
├── components/
│   ├── SkillsLedger.tsx            # Skills grid with hover notes, tier styling
│   ├── SkillIcon.tsx               # SVG icon component (reads from public/icons.svg sprite)
│   └── animation/
│       └── index.tsx               # Timeline animation engine (Stage, Sprite, animate, interpolate)
├── cases/
│   ├── cases.config.ts             # CASES array + getCaseNav() for footer prev/next
│   ├── CaseLayout.tsx              # Shared: CaseSection, CaseLabel, SkillTags, CaseFooterNav
│   ├── uni2/
│   │   ├── Uni2Case.tsx            # UNI2 case page (Platform contribution + Uni2Lite founding eng)
│   │   ├── Uni2Case.css            # Imports TJCase.css, overrides indigo accent
│   │   └── saasReel/               # 45s animated SaaS reel (Shot1–Shot8 + AnalystApp + captions)
│   ├── taylor-johnson/
│   │   ├── TJCase.tsx              # TJ case page with 4 sub-cases
│   │   ├── TJCase.css              # Base case page styles (imported by all other cases)
│   │   ├── data.ts                 # BankData interface & BANK_DATA constant
│   │   ├── dataCase02.ts           # AS/400 schema & document config data
│   │   ├── scenes.tsx              # Case 01: SceneM1 (form), SceneM2 (table), SceneM3 (detail)
│   │   ├── scenesCase02.tsx        # Case 02: SceneAS400toPDF, SchemaAS400
│   │   ├── scenesCase03.tsx        # Case 03: SceneTopaz (digital signature)
│   │   ├── scenesCase04.tsx        # Case 04: SceneSelenium (process automation)
│   │   └── shared.tsx              # CRTLines, SceneFrame, SegBadge, StatBadge
│   └── sistel/
│       ├── SistelCase.tsx          # Sistel case page (e-learning design)
│       ├── SistelCase.css          # Imports TJCase.css, overrides orange accent
│       └── sceneSistel.tsx         # 28s animated scene with palette/guide switcher
└── assets/                         # (unused — hero assets are in public/hero/)
```

Public assets: `public/icons.svg` (SVG sprite), `public/fonts/` (Epilogue woff2), `public/hero/silhouette.svg`.

## Routing

| Path                    | Component          |
|-------------------------|--------------------|
| `/`                     | `App.tsx`          |
| `/case/uni2`            | `Uni2Case.tsx`     |
| `/case/taylor-johnson`  | `TJCase.tsx`       |
| `/case/sistel`          | `SistelCase.tsx`   |

Cases are ordered newest-first in `cases.config.ts` (UNI2 → Taylor & Johnson → Sistel). Footer prev/next follows that order.

## Design System

### Color unlock concept
The page is monochromatic by default. As the user scrolls, each section activates its own accent color via CSS custom property `--accent` on `:root`.

Mechanics:
- **Scroll listener** — compares `window.scrollY + innerHeight * 0.35` against each section's `offsetTop`; the section whose range contains that point wins and sets `--accent`
- **Hover** — interactive elements (links, skill chips, timeline rows) use `var(--accent)` on hover
- Hero section resets to `--accent-neutral` (stone gray)

### Accent color map (defined in `index.css`)
| Section    | Variable              | Light value | Dark value  |
|------------|-----------------------|-------------|-------------|
| Hero       | `--accent-neutral`    | `#9E9891`   | `#333333`   |
| About      | `--color-about`       | `#B45309`   | `#D97706`   |
| Experience | `--color-experience`  | `#2563EB`   | `#60A5FA`   |
| Skills     | `--color-skills`      | `#15803D`   | `#22C55E`   |
| Contact    | `--color-contact`     | `#9333EA`   | `#C084FC`   |

### Dark mode
- Initialized from `prefers-color-scheme` on load; falls back to `localStorage` key `"theme"`
- Manual toggle applies `.dark` class on `<html>` with a 420ms `.dark-transitioning` transition guard
- All color tokens have dark overrides in `.dark {}` block in `index.css`

### Landing page sections (in order)
1. **Hero** — name, title, bio, links, scroll hint; canvas blob background + parallax CC monogram
2. **About** — pull quote + two bio paragraphs
3. **Experience** — timeline (UNI2, Taylor & Johnson, Sistel) with case study cards
4. **Skills** — SkillsLedger: four categories (Foundations, Forms & State, Motion & Visual, Systems & Hygiene), chips with tier styling and hover notes
5. **Contact** — email, phone, GitHub, LinkedIn

### Ambient bloom
A fixed blurred circle tracks the mouse cursor on desktop (`useBloomFollow()`) — lerp-animated via `--bloom-x` / `--bloom-y` CSS vars. On touch devices it stays centered. Uses `var(--accent)` for color. Present on both the landing page and all three case pages.

### Scroll reveal
`useScrollReveal()` adds `.is-visible` to elements with the `.reveal` class as they enter the viewport (IntersectionObserver, threshold 0.08, unobserves after triggering). CSS in `index.css` handles the initial `opacity: 0 / translateY(32px)` and the transition. When `prefers-reduced-motion: reduce`, the hook returns early and CSS overrides elements to `opacity: 1 / transform: none`.

## Animation System

`src/components/animation/index.tsx` is a custom timeline-based animation engine used by all case study scenes.

Key exports:
- `<Stage>` — canvas container with optional timeline scrubber
- `<Sprite>` — renders children only between `start` and `end` timestamps
- `TimelineContext` / `SpriteContext` — orchestrate multi-sprite sequences
- `animate()` / `interpolate()` — imperative animation utilities
- 20+ easing functions (linear, quad, cubic, expo, elastic, back…)

## Case Pages

### CSS inheritance
`TJCase.css` is the base stylesheet for all case pages. `SistelCase.css` and `Uni2Case.css` both `@import '../taylor-johnson/TJCase.css'` and then override only the accent tokens and add case-specific components.

### UNI2 (`/case/uni2`)
Current role (2021–present). Two chapters:
- **Platform contribution** — 4+ years on a 30-role banking platform (React + Redux + MUI). Three platform highlights with sidebar nav: Biometric Pipeline, Modal System, Library Modernization. Stats: +3,140 commits, +5,300 files, +470K lines.
- **Uni2Lite founding engineer** — new platform from scratch (Feb 2025). FSD architecture, declarative form engine (Zod + RHF), agnostic stepper, dual edit/consult mode. Animated 45s SaaS reel (`saasReel/`).

Accent: indigo `#4F46E5` light / `#818CF8` dark.

### Taylor & Johnson (`/case/taylor-johnson`)
COBOL modernization project (2018–2021). IBM AS/400 banking system (5250 green-screen) → Fresche Solutions' Presto web rendering layer.

Four sub-cases with animated scenes:
1. **Interface Modernization** — 5250 → responsive web UIs (3 switchable scenes: form, table, detail)
2. **Parametric Document Generation** — PDF engine driven by AS/400 table parameters + SchemaAS400 visualization
3. **Digital Signature Integration** — TOPAZ LCD signature pads integrated into Presto layer
4. **Process Automation** — Selenium-based batch migration tool (Python + web services)

Shared scene components (`shared.tsx`): `CRTLines` (scanline overlay), `SceneFrame` (stage chrome), `SegBadge`, `StatBadge`.
Accent: green `#166534` light / `#4ADE80` dark.

### Sistel (`/case/sistel`)
E-learning design project at Sistel Ltda. (2017–2018). Passive slide decks and procedure manuals rebuilt as HTML5 interactive modules. 15+ modules, 14 clients.

Interactive controls: palette switcher (6 brand colors) and character style switcher (Geometric, Riso, Line, Mascot) — both feed live props into the `SceneSistel` animation.
Accent: orange `#EA580C` light / `#FB923C` dark.

## Content

- **Name:** Camilo Conde
- **Title:** Design Engineer
- **Email:** condeher94@gmail.com
- **Phone:** +57 312 721 6626
- **GitHub:** CondeHdz94
- **LinkedIn:** camilo-conde-652204220
- **Education:** Multimedia Engineer, Universidad de San Buenaventura (2016)
