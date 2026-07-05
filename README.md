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
├── app/assets/css/main.css   # tailwindcss + @nuxt/ui imports + tokens + composition CSS
├── playground/               # consumer app: extends ['..']
├── manifest.json             # machine-readable component manifest (ccm-ds/manifest@1)
├── llms.txt                  # GENERATED from manifest.json (pnpm build:llms)
├── AGENTS.md                 # ambient doctrine rules for agents
├── skills/ccm-ds/            # Claude Code skill (ships with the package)
├── lint/eslint-plugin-ccm/   # ccm/class-budget + ccm/no-bespoke-widgets
├── eslint.config.mjs         # Nuxt baseline + DS-6 steering rules
├── stylelint.config.mjs      # standard baseline + no raw hex/px outside tokens
└── .github/workflows/ci.yml  # PR gate: install → tokens/manifest/llms checks → lint → fixture gate → test → build
```

## Agent-steering stack (DS-6)

Five parts make agents produce on-system UI:

1. **`manifest.json`** — per-component props/slots/when-to-use/anti-patterns,
   plus `kind: "skip"` entries for the Every Layout primitives the layer
   deliberately omits. Validated by `pnpm manifest:check`.
2. **`llms.txt`** — generated from the manifest (`pnpm build:llms`,
   byte-deterministic, CI-diffed like the tokens).
3. **`AGENTS.md`** — the five doctrine rules agents pick up ambiently.
4. **`skills/ccm-ds/`** — the active Claude Code procedure; consuming apps
   copy/symlink it into `.claude/skills/` (instructions in the skill).
5. **Lint enforcement** — ESLint `ccm/class-budget` (utility budget outside
   `components/`) and `ccm/no-bespoke-widgets` (no raw
   button/input/select/table/dialog), Stylelint `color-no-hex` +
   `unit-disallowed-list: px`. `test/lint/lint-gate.spec.ts` proves the
   fixtures fail through the real configs (`pnpm test:lint`).

## Links

- Plan & work items: [PRO-226](https://app.plane.so/ccm-design/browse/PRO-226/) (parent; sub-items PRO-227…233)
- Decision record: https://proofeditor.ai/d/usd6lwl4
- Every Layout source material: `ccmdesign/ccm-ops/reference/every-layout/`

Branch model: `main` = production, work branches off `dev`.
