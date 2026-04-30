# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (localhost:5173)
npm run build     # type-check + production build
npm run lint      # ESLint
npm run preview   # preview production build
```

There are no tests configured yet.

## Stack

- **Vite** with `@vitejs/plugin-react` (Oxc transform)
- **React 19** + **TypeScript** (ES2023, strict unused-locals/params)
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config` file; configuration lives in CSS using `@theme` and `@import "tailwindcss"` at the top of `src/index.css`

## Architecture

Single-page CV/portfolio for **Camilo Conde — Design Engineer**. All UI lives in `src/App.tsx`. Global base styles and CSS custom properties (colors, typography, tokens) are in `src/index.css`. Component-level styles are in `src/App.css`. Static assets live in `public/` and `src/assets/`.

The SVG sprite at `public/icons.svg` is referenced via `<use href="/icons.svg#<id>">`.

Tailwind v4 uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`). Custom design tokens go under an `@theme {}` block in `index.css`.

## Design System

### Color unlock concept
The page is monochromatic by default. As the user scrolls, each section dynamically activates its own accent color via CSS custom property `--accent` on `:root`. Colors are **dynamic** — they appear while the section is the most visible in the viewport and reset when another section takes over.

Mechanics:
- **Scroll (B)** — Intersection Observer tracks `intersectionRatio` per section; the section with the highest ratio wins and sets `--accent`
- **Hover (C)** — interactive elements (links, skill items, timeline rows) use `var(--accent)` on hover
- Hero section resets to `--accent-neutral` (stone gray)

### Accent color map (defined in `index.css`)
| Section    | Variable              | Light value | Dark value |
|------------|-----------------------|-------------|------------|
| Hero       | `--accent-neutral`    | `#D4D0CA`   | `#333333`  |
| About      | `--color-about`       | `#D97706`   | same       |
| Experience | `--color-experience`  | `#2563EB`   | same       |
| Skills     | `--color-skills`      | `#16A34A`   | same       |
| Contact    | `--color-contact`     | `#9333EA`   | same       |

### Dark mode
- Initialized from `prefers-color-scheme` on load
- Manual toggle stored in state, applied as `.dark` class on `<html>`
- All color tokens have dark overrides in `.dark {}` block in `index.css`

### Sections (in order)
1. **Hero** — name, title, bio, links, scroll hint
2. **About** — stats (05+ years, 20+ projects, 03+ companies) + bio
3. **Experience** — Sistel, Taylor & Johnson, UNI2
4. **Skills** — Languages, Frameworks & Tools, Design, Testing & More (no percentages)
5. **Contact** — email, phone, GitHub, LinkedIn, Behance

Projects section intentionally omitted for now.

## Content

- **Name:** Camilo Conde
- **Title:** Design Engineer
- **Email:** condeher94@gmail.com
- **Phone:** +57 312 721 6626
- **GitHub:** CondeHdz94
- **LinkedIn:** camilo-conde-652204220
- **Education:** Multimedia Engineer, Universidad de San Buenaventura (2016)
