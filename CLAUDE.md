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

This is a single-page CV/portfolio landing page. All UI lives in `src/App.tsx`. Global base styles and CSS custom properties (colors, typography, spacing tokens) are defined in `src/index.css`. Static assets (images, SVG sprite) live in `public/` and `src/assets/`.

The SVG sprite at `public/icons.svg` is referenced via `<use href="/icons.svg#<id>">` — add new icons there rather than inlining SVGs in components.

Tailwind v4 uses `@import "tailwindcss"` (not `@tailwind base/components/utilities` directives). Custom design tokens go under an `@theme {}` block in `index.css`.
