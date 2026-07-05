# AGENTS.md — @ccm/ds doctrine

Ambient rules for any agent writing UI in this repo or in an app that consumes
the `@ccm/ds` layer. The machine-readable component inventory is
`manifest.json` (rendered for LLMs as `llms.txt`); the active procedure is the
`skills/ccm-ds` Claude Code skill; ESLint/Stylelint enforce the rules in CI.

## The five rules

1. **Pages compose components.** A page file wires existing Nuxt UI (`U*`) and
   layer (`Ccm*`) components together and passes props. It does not build
   widgets or layouts out of raw markup and utility soup. Raw
   `button/input/select/table/dialog` elements are lint errors
   (`ccm/no-bespoke-widgets`) — Nuxt UI owns the widgets.
2. **Class strings live only inside Tailwind Variants definitions**, i.e. in
   component files. Outside `components/`, static `class` attributes carry a
   utility budget of 6 (`ccm/class-budget`). Over budget means you found a
   component boundary: reach for a composition component
   (CcmStack/CcmCluster/CcmGrid/CcmReel/CcmSwitcher/CcmCover/CcmFrame) or
   extract a component.
3. **Nuxt UI is restyled via `app.config.ts` only** (the `ui` key — semantic
   color aliases, and `ui.<component>` slot/variant overrides when the skin
   must diverge). Never inline `:ui` props, never scattered CSS overrides.
4. **ccm-layer CSS is plain CSS on the tokens.** Custom properties from the
   generated scales — `var(--spacing-*)`, `var(--text-step-*)`, the color
   tokens and `--ui-*` semantic aliases. No raw hex, no raw px (Stylelint:
   `color-no-hex`, `unit-disallowed-list`). The only sanctioned hex lives in
   `app/utils/channels.ts` (platform brand colors).
5. **`@apply` is reserved for prose/markdown styling** — long-form typography
   where per-element classes are impractical. Never use it to build
   components.

## Before you claim UI work is done

Run the lint gate: `pnpm lint && pnpm lint:style` (in this repo also
`pnpm manifest:check` and `pnpm test:lint` if you touched the manifest or the
lint rules). Green lint is part of "done".

## Extraction rule

When a markup pattern recurs (2+ real uses), propose extracting it into the
layer: a `Ccm*` component with typed props, a `manifest.json` entry
(props/slots/whenToUse/antiPatterns), and `pnpm build:llms` to regenerate
`llms.txt`. Do not keep pasting the pattern.

## Deliberately not shipped — do not reintroduce

Every Layout primitives the layer intentionally omits (details in
`manifest.json` under `kind: "skip"`): **Icon** → UIcon · **Imposter** →
UModal/UPopover · **Box** → token-backed utilities/UCard · **Center** →
UContainer · **Container** → container queries (the CcmSwitcher pattern) ·
**Sidebar** → deferred; extract per the extraction rule when it recurs.
