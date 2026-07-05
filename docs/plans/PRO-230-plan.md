# PRO-230 — DS-4: Skin + gallery (Social House look via app.config)

## Reference findings

- Social House (`social-house-frontend`) is a Docus 5 site: its entire widget look is
  **Nuxt UI defaults** + `ui.colors { primary: indigo, neutral: slate }` + Satoshi
  (`brand.css` sets `--font-sans: 'Satoshi', …`). Docus's own app.config only themes
  docs-specific components (commandPalette, contentNavigation) — no widget divergence.
- The custom dashboard surfaces (`app/pages/dashboard/[id].vue`, `PostCard.vue`,
  `Filters.vue`) style themselves with **Nuxt UI semantic vars** (`--ui-bg-muted`,
  `--ui-border-accented`, `--ui-radius`, `--ui-primary`) — confirming the skin contract
  is: get the semantic layer right and the look follows.
- DS-2 already owns the raw material: OKLCH indigo/slate scales, Satoshi `--font-sans`,
  radius scale with `--ui-radius: var(--radius-sm)` (0.25rem = Nuxt UI default), Utopia
  space/type. So the skin work is **semantic mapping + reviewability**, not new values.

## Decisions

1. **app.config is the single theming surface.** Expand `app/app.config.ts` to the full
   Nuxt UI v4 semantic color map (primary=indigo, neutral=slate, plus explicit
   secondary/info/success/warning/error so consumers see the whole contract in one
   place) and component theme entries (`ui.button`, `ui.card`, …) that pin the Social
   House rhythm via Tailwind utilities backed by the `@theme` tokens. No raw hex/px, no
   `@apply`, no inline `:ui` props anywhere in the layer or playground.
2. **Gallery = one page, `/gallery`, in the playground.** Sections, each with a
   `data-testid` for curl-able assertions:
   - Header with `UColorModeButton` (light/dark is a first-class review axis; toggle
     also added to the playground shell nav so every page is reviewable in both modes).
   - Token swatches: indigo/slate scales + the seven semantic colors as rendered chips;
     compact type/space/radius rows; deep links to `/tokens` for the full scales.
   - Themed Nuxt UI widgets: Button (color × variant matrix + sizes), Badge, Card,
     Input, Select, Modal (opens live), Toast (fired via `useToast`).
   - The 7 ccm composition components (Stack, Cluster, Grid, Reel, Switcher, Cover,
     Frame) as compact inline demos, spaced with Utopia tokens.
   - Reference section: side-by-side screenshots of current Social House pages
     (fidelity target) next to the gallery — images committed under
     `playground/public/reference/`.
3. **Screenshot approach.** Social House has a prebuilt `dist/`; serve it statically and
   capture light+dark screenshots headlessly (chrome-devtools MCP; fall back to the
   /browse harness). Capture the gallery in light+dark the same way for the
   side-by-side. If headless capture is unavailable, ship the gallery + record the
   screenshot pair as a residual.
4. **Dark mode source of truth** stays Nuxt UI's color-mode integration (`.dark` class);
   no bespoke toggling logic.
5. **Netlify**: attempt non-interactive `netlify status` / deploy from the worktree; if
   the repo has no linked site, record as residual and post the local route
   (`pnpm dev` → `/gallery`) for review.

## Steps

1. Rewrite `app/app.config.ts`: full semantic color map + component theme entries
   mapped from DS-2 tokens; comments point back to `tokens/*.tokens.json`.
2. Build `playground/app/pages/gallery.vue` (sections above) and add the color-mode
   toggle + Gallery link to `playground/app/app.vue`.
3. Capture Social House reference screenshots (dist served locally) + gallery
   screenshots, light and dark; commit under `playground/public/reference/`.
4. Verify: `pnpm install`, `pnpm lint`, `pnpm lint:style`, `pnpm test`, `pnpm build`;
   grep-checks for `:ui=` / `@apply` / raw hex in app code.
5. PR → dev; CI watch; merge on green.

## Grep contract (acceptance)

- `grep -rn ":ui=" app playground/app` → no matches
- `grep -rn "@apply" app playground/app` → no matches
- `grep -rniE "#[0-9a-f]{3,8}\b" app/**/*.vue playground/app` → no hardcoded hex in
  templates/styles (token files excluded by design)
