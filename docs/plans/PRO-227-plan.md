# PRO-227 — DS-1: Repo scaffold — layer skeleton, playground, CI

Parent: PRO-226 (@ccm/ds product contract). This item scaffolds the repo only; tokens (PRO-228), Every Layout components (PRO-229), skin (PRO-230), and agent-steering (PRO-232) land later.

## Key decisions

1. **Layer at repo root** (not `/layer`). This matches the official Nuxt layer starter: `nuxt.config.ts` + `app/` at root are the publishable layer, and a `playground/` app consumes it via `extends: ['..']`. One package.json, no workspace indirection — simplest thing that later items can extend.
2. **Package manager: pnpm** (10.x, pinned via `packageManager` field). Single root install; the playground has no package.json of its own and is run via `nuxt dev playground`.
3. **Versions** (latest stable at plan time, resolved and pinned by the lockfile):
   - `nuxt` ^4.4.8 (Nuxt 4)
   - `@nuxt/ui` ^4.9.0 (Nuxt UI v4 — bundles Tailwind CSS v4 via `@tailwindcss/vite`)
   - `tailwindcss` ^4.3.2 (explicit dep so `@import "tailwindcss"` resolves predictably)
   - `@nuxt/eslint` ^1.16.0, `stylelint` ^17.14.0 + `stylelint-config-standard` ^40 (baseline only; custom DS rules land in DS-6)

## Structure

```
ds-layer/
├── nuxt.config.ts            # the layer: registers @nuxt/ui, injects layer CSS (resolved relative to this file)
├── app/
│   └── assets/css/main.css   # @import "tailwindcss"; @import "@nuxt/ui";
├── playground/
│   ├── nuxt.config.ts        # extends: ['..'] — ONLY coupling to the layer
│   └── app/app.vue           # renders a UButton (acceptance criterion)
├── .github/workflows/ci.yml  # PR to dev/main: pnpm install → lint → build playground
├── eslint.config.mjs         # baseline @nuxt/eslint flat config
├── stylelint.config.mjs      # baseline standard config (Tailwind at-rules allowed)
├── package.json              # @ccm/ds, main: ./nuxt.config.ts
├── .gitignore / .npmrc
└── README.md                 # + one-paragraph architecture summary linking the Decisions doc
```

Layer CSS is registered with paths resolved relative to the layer file (`fileURLToPath(import.meta.url)` + `join`, avoiding an `@nuxt/kit` import) so paths survive being consumed from another project — the pattern the future token/component items (PRO-228/229) will reuse.

## Steps

1. Scaffold layer: package.json, nuxt.config.ts, app/assets/css/main.css, tsconfig, .gitignore, .npmrc.
2. Scaffold playground: playground/nuxt.config.ts (`extends: ['..']`), playground/app/app.vue with `<UButton>`.
3. Lint scaffolding: eslint.config.mjs (via @nuxt/eslint config), stylelint.config.mjs; `lint` + `lint:style` scripts.
4. CI: .github/workflows/ci.yml — pnpm install (frozen lockfile), lint, build playground; runs on pull_request.
5. README: architecture paragraph + quickstart, keep existing links.
6. Branches: create `main` from current dev tip and push (repo bootstrap — explicitly permitted for this ticket).

## Test strategy

- Local: `pnpm install` → `pnpm lint` → `pnpm lint:style` → `pnpm build` (builds playground) all green.
- Browser: start `pnpm dev` (playground), assert a Nuxt UI button renders (headless browser or curl of rendered HTML).
- CI: workflow added in this PR runs on the PR itself; must be green before merge.

## Risks

- Nuxt UI v4 module inside a layer: module registration from layers is supported by Nuxt 4; verified by the playground build actually rendering `UButton`.
- CI on a workflow added by the same PR: `pull_request` events do run newly added workflows; if checks never register, treat as green-by-absence (bootstrap PR).
- pnpm on GitHub runners: use `pnpm/action-setup` reading the `packageManager` field to avoid version drift.
