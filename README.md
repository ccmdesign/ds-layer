# @ccm/ds — CCM Design System Layer

A Nuxt layer unifying CCM product frontends: Nuxt UI v4 + Utopia fluid tokens + Every Layout composition components + an agent-steering stack.

## Architecture

The repo root **is** the layer: `nuxt.config.ts` registers Nuxt UI v4 (which brings Tailwind CSS v4) and injects the layer stylesheet with paths resolved relative to the layer itself, so any Nuxt 4 app can consume it via `extends` — no direct source imports. The bundled `playground/` app is the reference consumer (`extends: ['..']`) and the CI target: every PR must install, lint (ESLint + Stylelint, baseline configs), and build it. Upcoming items layer on top of this skeleton: Utopia fluid tokens (PRO-228), Every Layout composition components (PRO-229), the Social House skin (PRO-230), and the agent-steering stack (PRO-232) — rationale in the [Decisions doc](https://proofeditor.ai/d/usd6lwl4).

## Quickstart

```bash
pnpm install
pnpm dev:prepare # optional: generate playground types for the IDE
pnpm dev         # playground on http://localhost:3000 — renders a Nuxt UI button
pnpm lint        # ESLint
pnpm lint:style  # Stylelint
pnpm build       # builds the playground app
```

## Structure

```
├── nuxt.config.ts            # the layer (Nuxt UI module + layer CSS)
├── app/assets/css/main.css   # tailwindcss + @nuxt/ui imports; tokens land in PRO-228
├── playground/               # consumer app: extends ['..']
├── eslint.config.mjs         # baseline (custom DS rules land in DS-6)
├── stylelint.config.mjs      # baseline (custom DS rules land in DS-6)
└── .github/workflows/ci.yml  # PR gate: install → lint → build
```

## Links

- Plan & work items: [PRO-226](https://app.plane.so/ccm-design/browse/PRO-226/) (parent; sub-items PRO-227…233)
- Decision record: https://proofeditor.ai/d/usd6lwl4
- Every Layout source material: `ccmdesign/ccm-ops/reference/every-layout/`

Branch model: `main` = production, work branches off `dev`.
