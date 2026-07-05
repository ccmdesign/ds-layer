# PRO-232 — DS-6: Agent-steering stack (skill, AGENTS.md, manifest, llms.txt, lint)

Build the five-part steering stack that makes agents produce on-system UI: active
procedure (Claude Code skill), ambient rules (AGENTS.md), data (component manifest),
generated llms.txt, and lint enforcement wired to CI with fixtures proving the gates fire.

## Current state surveyed

- `manifest.json` — PRO-231 left a `ds-6-draft` stub: 16 flat entries
  (`name/kind/path/description/since`), no props/variants/slots/when-to-use/anti-patterns,
  none of the 7 composition components, no Every Layout skip entries.
- `eslint.config.mjs` / `stylelint.config.mjs` — baselines with "custom DS rules land in
  DS-6" comments. CI (`.github/workflows/ci.yml`) runs install → tokens-deterministic →
  ESLint → Stylelint → vitest → build.
- Components: 7 composition primitives (typed props, JSDoc'd) + 2 badges + CcmChannelIcon +
  8 icon SFCs. Utils: channels/status/format-date/clipboard/composition. Vitest mounts SFCs
  directly (no Nuxt runtime).
- Playground pages carry a repeated 7-utility page-shell (`mx-auto flex max-w-4xl flex-col
  gap-l px-4 py-l`) — exactly the pattern the doctrine says should be composition components.
- No raw `<button|input|select|table|dialog>` anywhere; no raw px/hex in linted CSS surfaces
  (generated `tokens.css` is already stylelint-ignored; channel brand hex lives in TS, outside
  Stylelint's remit — the sanctioned exception holds).

## Decisions (owned by this item)

1. **Manifest: grow the PRO-231 stub in place** (same file, `manifest.json` at repo root) —
   schema id `ccm-ds/manifest@1`. Entry shape:
   `{ name, kind: component|composable|util|data|skip, path?, description, whenToUse?,
   props?: [{name, type, default?, description}], slots?, variants?, antiPatterns?,
   useInstead? (skip only), since }`. All 7 composition components get full
   props/slots/whenToUse/antiPatterns cross-checked against the SFC source (incl. the
   Reel-vs-UCarousel boundary from PRO-229). The 6 Every Layout skip entries ship as
   `kind: "skip"` with `useInstead` (Icon→UIcon, Imposter→UModal/UPopover,
   Box→utilities+tokens, Center→UContainer, Container→container-query guidance,
   Sidebar→deferred + extraction rule). Rationale for in-place growth: one file, one schema,
   `files` already publishes it.
2. **Manifest validation = `scripts/check-manifest.mjs`** (no ajv dep): required fields, kind
   enum, unique names, `path` exists on disk for non-skip entries, skip entries carry
   `useInstead`, and bidirectional component coverage — every `app/components/*.vue` has an
   entry and vice versa. Wired as `pnpm manifest:check` + a CI step.
3. **llms.txt = generated, committed, CI-verified** — `scripts/build-llms.mjs` renders
   `llms.txt` (llms.txt spec shape: H1 + blockquote + sections) purely from `manifest.json`
   in stable authored order, trailing newline, no timestamps → byte-deterministic. CI step
   mirrors the tokens gate: `pnpm build:llms && git diff --exit-code -- llms.txt`.
4. **ESLint custom rules: local flat-config plugin** at `lint/eslint-plugin-ccm/` (no
   published package, imported directly by `eslint.config.mjs`):
   - `ccm/class-budget` — counts space-separated utilities in **static** `class` attrs of
     Vue templates; budget default **6** (one layout concern + modifiers; beyond that is a
     component boundary). Applies to all `.vue` outside `**/components/**` (doctrine: class
     strings only inside Tailwind Variants definitions, which live in components).
     Dynamic `:class` bindings are out of scope (documented heuristic).
   - `ccm/no-bespoke-widgets` — flags raw `<button|input|select|table|dialog>` template
     elements anywhere; message names the Nuxt UI replacement (UButton/UInput/USelect/
     UTable/UModal). Escape hatch = eslint-disable comment with reason.
5. **Playground brought under budget by dogfooding, not exemption**: the repeated page
   shells become `<CcmStack as="main" space="l|xl" class="mx-auto max-w-4xl px-4 py-l">`
   (4 utilities), the app.vue nav becomes a `CcmCluster`, and the two remaining 7-utility
   demo boxes switch `flex items-center justify-center` → `grid place-items-center`.
   No blanket playground ignore — the reference consumer must live under the same rules.
6. **Stylelint tightening in the existing config**: `color-no-hex: true` and
   `unit-disallowed-list: ['px']` with custom messages pointing at tokens. Token surfaces
   stay exempt exactly as today (generated `tokens.css` ignored; DTCG JSON and channels.ts
   are outside Stylelint). Repo CSS is already px/hex-free, so no code churn.
7. **Fixture gate**: `test/lint/fixtures/**` (excluded from the normal lint runs) +
   `test/lint/lint-gate.spec.ts` which runs the REAL configs programmatically —
   ESLint Node API with `overrideConfigFile` + `ignore:false`, Stylelint Node API with the
   imported repo config minus `ignoreFiles` — asserting: over-budget page fails,
   same markup inside components/ passes, bespoke widgets fail, raw hex/px CSS fails,
   clean fixtures pass. Runs inside the existing vitest CI step **plus** a dedicated
   "Lint fixture gate" step (`pnpm test:lint`) so the gate is visible.
8. **Skill ships in-repo at `skills/ccm-ds/SKILL.md`** (published via package `files`).
   Frontmatter name `ccm-ds`, description triggers on UI work in consuming apps.
   Procedure: check manifest → compose Nuxt UI + Ccm (props not classes) → app.config-only
   restyling → run the lint gate before declaring done → propose extraction into the layer
   when a pattern recurs (2+ repetitions rule). Install story documented in the skill and
   README: copy or symlink `node_modules/@ccm/ds/skills/ccm-ds` →
   `.claude/skills/ccm-ds` in the consuming app.
9. **AGENTS.md at repo root** with the five doctrine rules (pages compose components;
   class strings only inside Tailwind Variants definitions; Nuxt UI restyled via app.config
   only; ccm-layer CSS is plain CSS on tokens; @apply reserved for prose/markdown) +
   pointers to manifest/llms.txt/skill/lint gate. Added to package `files` along with
   `llms.txt` and `skills/`.

## Steps

1. Manifest v1 (grow stub) + `scripts/check-manifest.mjs` + `pnpm manifest:check`.
2. `scripts/build-llms.mjs` + committed `llms.txt` + determinism check (run twice, diff).
3. `lint/eslint-plugin-ccm/` (two rules) + eslint.config wiring + playground compliance edits.
4. Stylelint rule tightening.
5. Fixtures + `test/lint/lint-gate.spec.ts` + `pnpm test:lint`.
6. `skills/ccm-ds/SKILL.md` + AGENTS.md + README section + package.json `files`.
7. CI: add manifest-check, llms-deterministic, and lint-fixture-gate steps.
8. Verify: clean install, `manifest:check`, `build:llms` ×2 diff-clean, lint, lint:style,
   test, build all green.

## Acceptance mapping

- Fixture violations fail CI / clean code passes → step 5 spec + dedicated CI step.
- llms.txt regenerates from the manifest in the build → step 2 + CI diff gate.
- Skill installs into a consuming app and triggers on UI task → step 6 (frontmatter
  description written for trigger; install = copy/symlink, documented).
