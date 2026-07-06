# PRO-233 — DS-7 validation spike: go/no-go report

Date: 2026-07-05 · Branch: `feature/PRO-233-validation-spike-three-gates`
Plan: `docs/plans/PRO-233-plan.md` · Parent: PRO-226
Re-issued: 2026-07-06 — Gate 3 run after claude CLI auth was restored.

## Verdict

**GO — all three gates pass. DS-8 (Social House adoption) is unblocked.**

- Gate 1 (cascade coexistence): **PASS**
- Gate 2 (skin fidelity): **PASS** — with the stand-in caveat below
- Gate 3 (unprompted agent compliance): **PASS** — 2/2 attempts lint-clean
  with zero human corrections (see Gate 3 below)

History: the 2026-07-05 pipeline run issued **NO-GO (BLOCKED)** because Gate 3
could not run (headless claude CLI auth failure — an environment failure, not
a failure on the merits; the fallback ladder never re-opened). Auth was
restored interactively on 2026-07-06 and both Gate 3 attempts were executed
per the committed protocol, upgrading the verdict to GO.

## The spike

Two consuming apps, kept as regression fixtures and built in CI:

- `spikes/spike-app/` — fresh consuming app extending the layer, with the
  agent-steering stack installed the way SKILL.md documents for a consuming
  app: `.claude/skills/ccm-ds` and `AGENTS.md` (+ `CLAUDE.md`) as committed
  symlinks into the layer.
- `spikes/docus-coexist/` — minimal app extending BOTH the layer and `docus`
  (v5.12.3) — Social House's real configuration. Own `package.json` +
  lockfile because docus must not become a layer dependency.

The representative page is `spikes/spike-app/app/pages/review.vue`: a
"schedule a post" form (labeled title/caption/channel-select/date, validation
with inline errors, live character counter), a confirmation modal, a success
toast, and a card grid of six planned posts — using CcmStack, CcmCluster,
CcmSwitcher, CcmGrid (4 composition primitives), CcmChannelBadge,
CcmStatusBadge, `formatDate`, and Nuxt UI widgets (UForm/UFormField/UInput/
UTextarea/USelect/UButton/UModal/UCard/useToast).

## Gate 1 — Cascade coexistence: PASS

Layer + Tailwind v4 + Nuxt UI v4 + ccm components coexist cleanly in both
apps.

Evidence:

- `pnpm build:spike` and `pnpm --dir spikes/docus-coexist build` both complete
  with no cascade/build errors (also wired into CI).
- Built CSS of both apps carries the layer `@theme` tokens: OKLCH indigo/slate
  scales (`--color-indigo-500:oklch(58.5% .233 277.117)`), Satoshi
  `--font-sans` (self-hosted by @nuxt/fonts), Utopia
  `--spacing-*`/`--text-step-*` clamps, and the `.ccm-*` composition classes
  in the components cascade layer.
- SSR HTML of both apps resolves the Nuxt UI semantic aliases to the
  app.config map: `--ui-color-primary-500: var(--color-indigo-500)`,
  `--ui-color-neutral-*: var(--color-slate-*)`, `--ui-radius: var(--radius-sm)`.
- **Precedence exercised with a real conflict:** docus's own app.config sets
  `ui.colors.primary: 'emerald'`. With the layer listed first
  (`extends: [<layer>, 'docus']`), the merged config is
  `defuFn(layerConfig, docusConfig, inline)` — leftmost wins — and the
  rendered page is indigo. Docus's docs machinery (content rendering, search,
  color mode) keeps working; @nuxt/ui registers once (module dedupe by name).
  Screenshots: `PRO-233-browser-evidence/docus-coexist-{light,dark}.png`.

**Caveat worth keeping (real bug found):** multi-segment relative layer paths
(`extends: ['../..']`) silently mis-resolve in this stack (nuxt 4.4.8 /
c12 3.3.4 / pathe): `pathe.extname('../..')` returns `'.'`, so c12 treats the
path as a file and pins the layer `cwd` one directory short; the layer's
nuxt.config still half-loads through the package `main` field, so modules and
CSS apply but `app/app.config.ts` (and any srcDir-scanned surface) is
**silently dropped** — the spike initially rendered Nuxt UI's default green.
Fix used in both fixtures: an absolute path computed from the config file
(`fileURLToPath(new URL('../..', import.meta.url))`). Single-segment `'..'`
(the playground) is unaffected; package-name extends (how Social House will
consume `@ccm/ds`) are unaffected. Residual: report upstream to c12/pathe.

## Gate 2 — Skin fidelity: PASS (stand-in caveat)

Compared against the DS-4 references
(`playground/public/reference/social-house-{home,detail}-{light,dark}.png`),
light + dark, at 1280px in headless Chromium:

- `PRO-233-browser-evidence/review-light.png` / `review-dark.png` — the page
  convincingly wears the Social House look: Satoshi throughout, indigo
  primary actions, slate neutrals/borders/text hierarchy, the reference's
  dark slate-950 surface in dark mode, channel brand badges (Instagram/
  LinkedIn/YouTube/TikTok — the sanctioned hex in `channels.ts`), status
  badges riding the semantic colors (draft→warning, published→success,
  unknown→neutral), radius-sm corner language.
- Interaction evidence: `review-validation-errors.png` (inline errors on
  empty submit), `review-confirm-modal.png` (modal summarizing the entry);
  confirm closes the modal, fires the success toast, resets the form
  (asserted via DOM, values in the browser-test log on the ticket).

**Caveat:** the ticket wanted this page authored by the Gate 3 agent. Because
Gate 3 could not run (below), the page was composed by the pipeline runner
following `skills/ccm-ds` verbatim, and is clearly labeled as a stand-in in
the file header. Gate 2 therefore proves the SKIN (tokens + app.config +
Nuxt UI restyling produce the Social House look on a real composed page) —
it does not prove agent behavior. The stand-in passes the full DS-6 lint
gate with zero violations.

## Gate 3 — Unprompted agent compliance: PASS (2/2 attempts, re-run 2026-07-06)

Protocol (`scripts/gate3-attempt.sh <n>`): reset the spike app to the bare
scaffold (stand-in page removed), run `claude -p` with the fixed product brief
(`PRO-233-gate3/brief.txt` — names no components, no lint rules, no docs),
then run the DS-6 gates verbatim, zero human corrections. Evidence per attempt
(transcript, diff, lint JSON, build log) in `PRO-233-gate3/attempt-<n>/`.

| attempt | eslint errors | stylelint violations | build | files authored |
|---------|--------------|----------------------|-------|----------------|
| 1 | 0 | 0 | pass | `app/pages/review.vue` |
| 2 | 0 | 0 | pass | `app/pages/review.vue` |

Both attempts: the agent, steered only by `skills/ccm-ds` + `AGENTS.md`,
composed the page from Nuxt UI widgets + Ccm primitives and passed every DS-6
lint gate unaided. Violations per attempt: **0 and 0**.

Note on the summary.txt "stylelint errors: ?" quirk: stylelint's JSON
formatter writes to stderr, so the script's stdout-based counter shows `?`;
the counts above were read from `attempt-<n>/stylelint.stderr.txt`
(3 files each, `errored: false`, `warnings: []`). Stylelint exit code 0 in
both attempts.

History (2026-07-05 pipeline run): NOT RUN — the stored claude.ai OAuth token
had expired 2026-06-28 and headless refresh returned 401; no API key existed
on the machine, `claude auth login` is interactive-only, and the run correctly
refused to fake compliance numbers
(`PRO-233-gate3/attempt-1-notrun-auth-failure.txt`).

## Verification (local, clean install)

`pnpm install --frozen-lockfile` · `pnpm lint` ✓ · `pnpm lint:style` ✓ ·
`pnpm manifest:check` ✓ (30 entries) · `pnpm test` ✓ (73/73) ·
`pnpm build` ✓ · `pnpm build:spike` ✓ ·
`pnpm --dir spikes/docus-coexist build` ✓ · tokens/llms.txt drift ✓ none.

## Residuals

1. ~~Re-run Gate 3 and re-issue the verdict~~ — **done 2026-07-06**, verdict
   re-issued as GO (this revision).
2. Append this report to the Decisions Proof doc
   (https://proofeditor.ai/d/usd6lwl4) — external doc, not writable from the
   pipeline.
3. Report the multi-segment relative `extends` resolution bug upstream
   (c12 `resolveConfig` + `pathe.extname('../..') === '.'`).
