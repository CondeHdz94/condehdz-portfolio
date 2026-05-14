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
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config` file; configuration lives in CSS using `@theme` and `@import "tailwindcss"` at the top of `src/index.css`
- **React Router v7** for client-side routing (3 routes)
- **Lenis** for smooth scroll (desktop/hover-capable devices only)
- **pnpm** as package manager (migrated from npm)

## Architecture

CV/portfolio for **Camilo Conde — Design Engineer**. Multi-page SPA with React Router.

```
src/
├── main.tsx                        # Router setup (BrowserRouter + routes)
├── App.tsx                         # Main landing page (488 lines)
├── App.css                         # Landing page styles (728 lines)
├── index.css                       # Global tokens, animations, color system (145 lines)
├── hooks/
│   ├── useDarkMode.ts              # Dark mode toggle with localStorage + 420ms transition
│   └── useLenis.ts                 # Smooth scroll (skips touch/reduced-motion)
├── components/
│   └── animation/
│       └── index.tsx               # Timeline animation system (3900+ lines)
├── cases/
│   ├── sistel/
│   │   ├── SistelCase.tsx          # Sistel case page (scaffolded)
│   │   └── SistelCase.css          # Imports TJCase.css, overrides Sistel accent
│   └── taylor-johnson/
│       ├── TJCase.tsx              # Main TJ case page with 4 sub-cases
│       ├── TJCase.css              # Base case page styles
│       ├── data.ts                 # BankData interface & BANK_DATA constant
│       ├── dataCase02.ts           # AS/400 schema & document config data
│       ├── scenes.tsx              # Case 01: SceneM1 (form), SceneM2 (table), SceneM3 (detail)
│       ├── scenesCase02.tsx        # Case 02: SceneAS400toPDF, SchemaAS400
│       ├── scenesCase03.tsx        # Case 03: SceneTopaz (digital signature)
│       ├── scenesCase04.tsx        # Case 04: SceneSelenium (process automation)
│       └── shared.tsx              # CRTLines, SceneFrame, SegBadge, StatBadge
└── assets/
    └── hero.png                    # Hero background image
```

The SVG sprite at `public/icons.svg` is referenced via `<use href="/icons.svg#<id>">`.

Tailwind v4 uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`). Custom design tokens go under an `@theme {}` block in `index.css`.

## Routing

| Path                    | Component          |
|-------------------------|--------------------|
| `/`                     | `App.tsx`          |
| `/case/taylor-johnson`  | `TJCase.tsx`       |
| `/case/sistel`          | `SistelCase.tsx`   |

## Design System

### Color unlock concept
The page is monochromatic by default. As the user scrolls, each section dynamically activates its own accent color via CSS custom property `--accent` on `:root`. Colors are **dynamic** — they appear while the section is the most visible in the viewport and reset when another section takes over.

Mechanics:
- **Scroll** — Intersection Observer tracks `intersectionRatio` per section; the section with the highest ratio wins and sets `--accent`
- **Hover** — interactive elements (links, skill items, timeline rows) use `var(--accent)` on hover
- Hero section resets to `--accent-neutral` (stone gray)

### Accent color map (defined in `index.css`)
| Section    | Variable              | Light value | Dark value |
|------------|-----------------------|-------------|------------|
| Hero       | `--accent-neutral`    | `#D4D0CA`   | `#333333`  |
| About      | `--color-about`       | `#B45309`   | same       |
| Experience | `--color-experience`  | `#2563EB`   | same       |
| Skills     | `--color-skills`      | `#15803D`   | same       |
| Contact    | `--color-contact`     | `#9333EA`   | same       |

### Dark mode
- Initialized from `prefers-color-scheme` on load; falls back to `localStorage` key `"theme"`
- Manual toggle applies `.dark` class on `<html>` with a 420ms `.dark-transitioning` transition guard
- All color tokens have dark overrides in `.dark {}` block in `index.css`

### Landing page sections (in order)
1. **Hero** — name, title, bio, links, scroll hint; parallax background via `useParallax()`
2. **About** — animated stat counters (05+ years, 20+ projects, 03+ companies) + bio
3. **Experience** — timeline (Sistel, Taylor & Johnson, UNI2) with case study links
4. **Skills** — Languages, Frameworks & Tools, Design, Testing & More (no percentages)
5. **Contact** — email, phone, GitHub, LinkedIn, Behance

### Ambient bloom
A fixed blurred circle tracks the mouse cursor on desktop (`useBloomFollow()`) or stays centered on mobile. Uses `var(--accent)` for color.

### Scroll reveal
`useScrollReveal()` adds `.visible` to elements with the `.reveal` class as they enter the viewport. `useMobileScrollActive()` applies `is-scroll-active` to timeline rows and skill items on touch devices (simulates hover).

## Animation System

`src/components/animation/index.tsx` is a custom timeline-based animation engine used by all case study scenes.

Key exports:
- `<Stage>` — canvas container with optional timeline scrubber
- `<Sprite>` — renders children only between `start` and `end` timestamps
- `TimelineContext` / `SpriteContext` — orchestrate multi-sprite sequences
- `animate()` / `interpolate()` — imperative animation utilities
- 20+ easing functions (linear, quad, cubic, expo, elastic, back…)

## Case Pages

### Taylor & Johnson (`/case/taylor-johnson`)
COBOL modernization project at Taylor & Johnson International (2018–2021). Core problem: 40-year-old IBM AS/400 banking system (5250 green-screen) running daily. Solution: Fresche Solutions' Presto web rendering layer between COBOL backend and browser.

Four sub-cases, each with an animated scene:
1. **Interface Modernization** — 5250 → responsive web UIs (3 switchable scenes: form, table, detail)
2. **Parametric Document Generation** — PDF engine driven by AS/400 table parameters + SchemaAS400 visualization
3. **Digital Signature Integration** — TOPAZ LCD signature pads integrated into Presto layer
4. **Process Automation** — Selenium-based batch migration tool (Python + web services)

Shared scene components (`shared.tsx`): `CRTLines` (scanline overlay), `SceneFrame` (stage chrome), `SegBadge`, `StatBadge`.

### Sistel (`/case/sistel`)
E-learning design project at Sistel Ltda. (2017–2018). Currently scaffolded — context and principles written, animation scene placeholder in place.

Accent override: `#EA580C` light / `#FB923C` dark.

## Content

- **Name:** Camilo Conde
- **Title:** Design Engineer
- **Email:** condeher94@gmail.com
- **Phone:** +57 312 721 6626
- **GitHub:** CondeHdz94
- **LinkedIn:** camilo-conde-652204220
- **Education:** Multimedia Engineer, Universidad de San Buenaventura (2016)
