# PRO-233 — DS-7 validation spike: go/no-go report

Date: 2026-07-05 · Branch: `feature/PRO-233-validation-spike-three-gates`
Plan: `docs/plans/PRO-233-plan.md` · Parent: PRO-226

## Verdict

**NO-GO (BLOCKED) — DS-8 stays blocked.**

- Gate 1 (cascade coexistence): **PASS**
- Gate 2 (skin fidelity): **PASS** — with the stand-in caveat below
- Gate 3 (unprompted agent compliance): **NOT RUN** — environment failure
  (claude CLI auth), not a failure on the merits

No gate failed on the merits, so the fallback ladder (shadcn-vue / Reka UI +
owned CSS) does **not** re-open. But the kill-switch question this ticket
exists to answer — does an unprompted agent produce compliant UI on this
stack? — is still open, so DS-8 must not start. Re-running Gate 3 is one
command per attempt once `claude` auth is restored (see Gate 3 below); the
verdict should then be re-issued on this ticket.

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

## Gate 3 — Unprompted agent compliance: NOT RUN

Reason: the `claude` CLI cannot authenticate headlessly on this machine.

- PATH CLI (2.1.162, homebrew): stored claude.ai OAuth token expired
  2026-06-28; headless refresh returns
  `API Error: 401 Invalid authentication credentials` (verified with clean
  env, with `--setting-sources project`, and against both the configured
  local headroom proxy and `api.anthropic.com`).
- Desktop-bundled CLI (2.1.197): separate credential store, "Not logged in".
- No `ANTHROPIC_API_KEY` anywhere on the machine; `claude auth login` is
  interactive-only, which an autonomous run must not fake.
- First attempt transcript: `PRO-233-gate3/attempt-1-notrun-auth-failure.txt`.

Per the ticket's protocol, this is recorded as NOT RUN — no substitute agent
was used and no compliance numbers were invented.

**The harness is committed and ready:** `scripts/gate3-attempt.sh <n>` resets
the spike app to the bare scaffold (removing the stand-in page), runs
`claude -p` with the fixed product brief (`PRO-233-gate3/brief.txt` — names no
components, no lint rules, no docs), then runs the DS-6 gates verbatim and
writes transcript, diff, per-gate violation counts to
`PRO-233-gate3/attempt-<n>/`. Protocol: ≥2 attempts, zero human corrections,
every attempt must lint clean.

To close the gate: `claude auth login`, then
`bash scripts/gate3-attempt.sh 1 && bash scripts/gate3-attempt.sh 2`, commit
the evidence, re-issue the verdict on PRO-233.

## Verification (local, clean install)

`pnpm install --frozen-lockfile` · `pnpm lint` ✓ · `pnpm lint:style` ✓ ·
`pnpm manifest:check` ✓ (30 entries) · `pnpm test` ✓ (73/73) ·
`pnpm build` ✓ · `pnpm build:spike` ✓ ·
`pnpm --dir spikes/docus-coexist build` ✓ · tokens/llms.txt drift ✓ none.

## Residuals

1. **Re-run Gate 3** after restoring claude CLI auth (one command per
   attempt, above) and re-issue the go/no-go verdict on this ticket.
2. Append this report to the Decisions Proof doc
   (https://proofeditor.ai/d/usd6lwl4) — external doc, not writable from the
   pipeline.
3. Report the multi-segment relative `extends` resolution bug upstream
   (c12 `resolveConfig` + `pathe.extname('../..') === '.'`).
