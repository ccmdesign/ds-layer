# PRO-235 — DS-8a adoption wrappers: CcmCard, CcmKeyValue, CcmDisclosure

## Approach

Add the three Social House adoption wrappers to `@ccm/ds`, following the layer's
existing conventions exactly (studied: CcmStack/CcmGrid/CcmStatusBadge, the
composition.css cascade-layer pattern, the manifest schema, the badges/composition
test suites, and the /composition gallery pages).

Doctrine: a wrapper encodes STRUCTURE or BEHAVIOR, never style alone. All three
compose Nuxt UI widgets or native elements — they never rebuild behavior.

## Components

1. **CcmCard** — composes `UCard` (the layer's actual restyle target: gallery.vue
   uses UCard; UPageCard appears nowhere in the layer). Encodes the recurring SH
   card structure: header row (title + optional trailing slot), meta line, badges
   row, body (default slot), actions row in the footer with the last action pushed
   to the inline-end (`margin-inline-start: auto` on `:last-child`). Props (3 of
   the ≤7 budget): `title`, `meta`, `variant` (forwarded to UCard). Slots: `title`,
   `trailing`, `meta`, `badges`, `default`, `actions`. Header/footer only render
   when they have content. Required doc line in the component docblock: "If this
   doesn't fit, drop to UCard directly — don't extend me." No `:ui` passthrough.
2. **CcmKeyValue** — native `<dl>/<dt>/<dd>`. Props: `items` (`{ term, value }[]`),
   `variant` (`'grid' | 'stacked'`, default `'grid'`). Default slot for custom
   dt/dd pairs (works alongside `items`). Grid variant uses
   `grid-template-columns: minmax(3.5rem, max-content) minmax(0, 1fr)`.
3. **CcmDisclosure** — native `<details>/<summary>` with DS skin; works without
   JS, default collapsed (pass the native `open` attribute for default-open —
   fallthrough, not a prop). Props: `summary` label, `count` (badge affordance).
   Slots: `summary` override, `default` content. Closed-state guard:
   `.ccm-disclosure:not([open]) > *:not(summary) { display: none !important; }`
   so author CSS on inner content can't defeat the UA hiding.

## CSS

New `app/assets/css/wrappers.css`, imported by `main.css` with
`layer(components)` (same mechanism as composition.css). Plain CSS on the
tokens: `var(--spacing-*)`, `var(--text-step-*)`, `--ui-*` semantic aliases.
Cascade-layer CSS (not scoped) because all three style slotted content
(actions cluster, dt/dd pairs, closed-state hiding), which scoped CSS can't
reach cleanly.

## Lint-rule wording (deliverable 4)

`lint/eslint-plugin-ccm/index.mjs` `ccm/no-bespoke-widgets` doc comment +
description updated: wrappers must COMPOSE `U*` components or native elements,
never re-implement their behavior. Same wording lands in the manifest doctrine,
AGENTS.md rule 1, and the skill. (lint-gate.spec.ts asserts rule IDs only, so
wording changes are test-safe.)

## Housekeeping

- `manifest.json`: 3 component entries (props/slots/whenToUse/antiPatterns,
  `since: "PRO-235"`) + doctrine wording → 33 entries; `pnpm build:llms` to
  regenerate `llms.txt` (CI diffs it).
- Gallery: `playground/app/pages/wrappers/{index,card,key-value,disclosure}.vue`
  in the composition-page style, each with a `UColorModeButton` for light/dark
  review; linked from the playground index.
- Tests: `test/components/wrappers.spec.ts` (@vue/test-utils, jsdom; UCard
  stubbed with slot-rendering stub since component tests run without Nuxt).
- Docs: `skills/ccm-ds/SKILL.md` step-2 inventory + wrapper doctrine; AGENTS.md.

## Test strategy

`pnpm lint`, `pnpm lint:style`, `pnpm test`, `pnpm manifest:check`,
`pnpm build`, `pnpm build:spike`, docus-coexist build
(`pnpm --dir spikes/docus-coexist install --frozen-lockfile && pnpm --dir
spikes/docus-coexist build`), plus browser check of the three gallery pages
light + dark.

## Risks

- UCard slot API drift (Nuxt UI v4): header/footer are plain slots — verified
  against gallery.vue usage.
- `details` closed-state hiding vs the grid content wrapper: guarded by the
  explicit `:not([open])` rule.
- Stylelint `unit-disallowed-list` bans px only; the spec'd `3.5rem` is fine.
- llms.txt/tokens determinism gates in CI: regenerate and commit together.
