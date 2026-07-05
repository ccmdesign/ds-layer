# PRO-233 — DS-7: Validation spike — three gates, go/no-go

Parent: PRO-226 · Branch: `feature/PRO-233-validation-spike-three-gates` off `dev`.

## Objective

Prove the whole stack with an agent-built representative page in a fresh
consuming app, then issue a written go/no-go verdict. This is the kill switch
for DS-8 (Social House adoption). Both GO and NO-GO complete the ticket — the
deliverable is the verdict, honestly reached. No fixing forward past a failed
gate.

## Spike app locations (decision)

- `spikes/spike-app/` — the fresh consuming app. Mirrors the playground's
  consumption pattern established in PRO-227: **no own package.json**,
  `extends: ['../..']` in its `nuxt.config.ts`, built with the repo root's
  Nuxt. Rationale: the layer is not published to a registry; a `file:../..`
  dependency would hard-link the whole repo into itself (recursive) and add a
  second lockfile for no extra proof. The `extends`-relative pattern is the
  documented Nuxt-layers consumption path and identical to what a consuming
  repo does apart from the specifier string.
- `spikes/docus-coexist/` — the minimal Docus coexistence app (Gate 1's second
  half; Social House's real configuration). Docus is NOT a root dependency and
  must not become one, so this app **does** get its own `package.json` +
  `pnpm-lock.yaml` and installs independently (`pnpm --dir spikes/docus-coexist
  install`). Its `nuxt.config.ts` extends BOTH `docus` (or the current Docus
  consumption mechanism — resolve exact form against the docus README at
  implement time) AND the layer (`../..`).
- Agent-steering wiring in `spikes/spike-app/`, installed the way SKILL.md
  documents for a consuming app (symlink form, committed to git):
  - `.claude/skills/ccm-ds` → relative symlink to `skills/ccm-ds`
  - `AGENTS.md` → relative symlink to the repo-root `AGENTS.md`
  - `CLAUDE.md` → symlink to the same `AGENTS.md` (pure wiring redundancy so
    the doctrine is ambient regardless of which filename the CLI version
    prefers; content is identical, no extra instructions).

## CI / lint treatment (decision)

- Root ESLint + Stylelint already glob the whole repo, so `spikes/**` .vue/.css
  falls under the DS-6 gates automatically (class-budget 6 outside
  `**/components/**`, no-bespoke-widgets, color-no-hex, unit-disallowed-list).
  This is intentional: the agent-built page must live under the real gates as a
  regression fixture.
- Root scripts added: `dev:spike` / `build:spike` (`nuxt dev|build
  spikes/spike-app`).
- CI additions: build spike-app; install + build docus-coexist with its own
  frozen lockfile. If the Docus build proves unacceptably slow or flaky in CI,
  fall back to running it locally for the gate evidence and marking the CI
  step `continue-on-error` — recorded honestly in the report (the gate itself
  is judged on the local evidence either way).

## Gate 1 — Cascade coexistence

Claim to test: layer + Tailwind v4 + Nuxt UI + ccm components layer coexist
cleanly, including under Docus.

Method:
1. `pnpm build:spike` (and/or `nuxt generate`) succeeds with no cascade/build
   errors.
2. Inspect emitted CSS in the build output: (a) layer `@theme` tokens present
   (OKLCH indigo/slate, `--font-sans: 'Satoshi'`, Utopia `--spacing-*` /
   `--text-step-*`); (b) Nuxt UI semantic aliases resolve to the app.config
   map (`--ui-primary` → indigo chain); (c) `composition.css` classes present
   in the components cascade layer.
3. `spikes/docus-coexist`: build succeeds; same CSS inspections; verify
   app.config/`@theme` precedence — the layer's skin values must survive
   Docus's own Nuxt UI setup (or the app-level override must win where the app
   sets it). Evidence: grep of built CSS + rendered page HTML.

## Gate 2 — Skin fidelity

Claim to test: the agent-built representative page convincingly wears the
Social House look, light + dark, judged against the DS-4 reference screenshots
(`playground/public/reference/social-house-*.png`).

Method: run the spike app dev server (Bash background), capture light + dark
screenshots of the representative page with a headless browser
(`~/Documents/GitHub/tools/browser-harness` does NOT exist on this machine —
checked; use the chrome-devtools MCP instead; if that fails, fall back to
rendered-HTML/CSS assertions + an honest note in the report). Save screenshots
under `docs/solutions/PRO-233-browser-evidence/` and compare against the
references on: Satoshi type, indigo primary, slate neutrals, radius language,
dark-mode slate surfaces, overall component styling.

## Gate 3 — Unprompted agent compliance

Claim to test: an agent given ONLY the ccm-ds skill + AGENTS.md builds the
representative page passing all DS-6 lint gates with zero human corrections.

Protocol:
- Runner: `claude -p "<brief>" --permission-mode bypassPermissions` as a
  synchronous Bash subprocess with cwd = `spikes/spike-app/` (CLI v2.1.162
  confirmed installed). No Task-tool agents.
- The brief is a product brief, not a technique brief: build a `/review` page
  with a "schedule a post" form (labeled title + caption + channel select +
  date, with validation), a confirmation modal on submit, and a grid of
  existing post cards. It names NO components, NO lint rules, NO docs — the
  skill and AGENTS.md must do the steering.
- ≥2 independent attempts: attempt 1 from the clean scaffold; then archive the
  produced page + lint output to `docs/solutions/PRO-233-gate3/attempt-1/`,
  `git checkout` the spike app back to clean, run attempt 2 identically,
  archive likewise.
- After each attempt, with zero human edits, run the gates from the repo root:
  `pnpm lint` + `pnpm lint:style` (scoped counts for `spikes/spike-app`
  recorded) + `pnpm build:spike`. Count violations per attempt.
- Pass = every attempt lints clean with zero corrections. Any violation is
  counted and reported; the gate fails if an attempt needs a human fix.
- The final committed spike page is the output of the last attempt (kept
  verbatim — if it failed the gate, it is committed as-is as evidence, and the
  verdict says NO-GO).
- If the `claude` CLI errors in this nested context, record Gate 3 as NOT RUN
  with the reason — do not fake results.

## Deliverables

- `spikes/spike-app/` + `spikes/docus-coexist/` kept as regression fixtures.
- `docs/solutions/PRO-233-go-no-go.md` — per-gate protocol, evidence, verdict.
- Same report posted as the Plane comment on PRO-233.
- Residual for a human: append the report to the Decisions Proof doc
  (https://proofeditor.ai/d/usd6lwl4) — external doc, likely not writable from
  here.

## Verdict rules

- All three gates pass → GO, unblock DS-8.
- Any gate fails after reasonable iteration (config/wiring fixes to make the
  comparison fair — never weakening a gate) → NO-GO with evidence; fallback
  ladder re-opens (shadcn-vue if agents need vendored source; Reka UI + owned
  CSS if the library fights us). PR still merges either way — the spike +
  report are the deliverable.

## Step order

1. Scaffold spike-app + steering wiring; scaffold docus-coexist.
2. Gate 3 attempt 1 (agent builds the page) → lint counts → archive.
3. Gate 3 attempt 2 (clean re-run) → lint counts → archive; keep final page.
4. Gate 1 build + CSS inspection on both apps.
5. Gate 2 screenshots light + dark vs references.
6. Write report, verdict, PR to dev.
