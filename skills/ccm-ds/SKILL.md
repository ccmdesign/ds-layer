---
name: ccm-ds
description: Use for ANY UI work in an app that consumes the @ccm/ds layer (Nuxt 4 + Nuxt UI v4 + Ccm composition components) — building or changing pages, components, layouts, forms, styling, theming, spacing, or colors. Steers composition toward the component manifest, props over class strings, app.config-only theming, and the lint gate. Trigger before writing any Vue template or CSS in a consuming app.
---

# ccm-ds — produce on-system UI

You are working in an app that extends the `@ccm/ds` Nuxt layer. The system
already owns the widgets, the layout primitives, the tokens, and the theming
surface. Your job is to compose, not invent.

## Procedure

1. **Check the manifest first.** Read `node_modules/@ccm/ds/manifest.json`
   (in the layer repo itself: `manifest.json` at the root; prose rendering:
   `llms.txt`). It lists every layer component with props, slots, when-to-use,
   and anti-patterns — plus `kind: "skip"` entries for Every Layout primitives
   the layer deliberately does NOT ship (Icon, Imposter, Box, Center,
   Container, Sidebar) with what to use instead. Do not reintroduce a skip.
2. **Compose from Nuxt UI + Ccm components.**
   - Widgets (buttons, inputs, selects, modals, tables, badges, popovers…):
     Nuxt UI `U*` components. Never raw `<button>/<input>/<select>/<table>/
     <dialog>` — lint (`ccm/no-bespoke-widgets`) will fail you. Wrappers
     compose `U*` components or native elements — never re-implement their
     behavior; a wrapper encodes STRUCTURE or BEHAVIOR, never style alone.
   - Layout: the Ccm composition primitives — `CcmStack` (vertical rhythm),
     `CcmCluster` (wrapping rows), `CcmGrid` (container-intrinsic card grids),
     `CcmReel` (native scroll strips; paged widgets are `UCarousel`),
     `CcmSwitcher` (container-based orientation switch), `CcmCover`
     (viewport-height hero), `CcmFrame` (fixed aspect ratio media).
   - Adoption wrappers (PRO-235) — `CcmCard` (the recurring
     title/meta/badges/body/actions card anatomy composed on `UCard`; if the
     anatomy doesn't fit, drop to `UCard` directly — don't extend CcmCard.
     Put the primary action LAST in the `actions` slot; it is pushed to the
     inline-end), `CcmKeyValue` (native `dl/dt/dd` label/value pairs —
     `items` array and/or slotted pairs; `variant="grid" | "stacked"`),
     `CcmDisclosure` (native `details/summary`, zero-JS, collapsed by
     default — pass the native `open` attribute for default-open; controlled
     or animated accordions are `UAccordion`).

     ```vue
     <CcmCard title="Spring launch" meta="Tomorrow, 9:00">
       <template #badges><CcmStatusBadge status="in_buffer" /></template>
       <p>Body copy…</p>
       <template #actions>
         <UButton variant="outline" color="neutral">Edit</UButton>
         <UButton>Publish now</UButton> <!-- last = primary, pushed right -->
       </template>
     </CcmCard>

     <CcmKeyValue :items="[{ term: 'Channel', value: 'Instagram' }]" />

     <CcmDisclosure summary="Advanced options" :count="3">
       <p>Zero-JS collapsible content.</p>
     </CcmDisclosure>
     ```
   - Domain bits (channel badges/icons, status badges, date formatting):
     already in the layer — check the manifest before writing new ones.
3. **Props, not classes.** Spacing, thresholds, ratios, and variants are typed
   props on the components (`space="l"`, `threshold="m"`, `ratio="4:5"`).
   Outside `components/`, static `class` attributes are budgeted at 6
   utilities (`ccm/class-budget`); over budget means extract a component or
   use a composition primitive. Restyle Nuxt UI ONLY through `app.config.ts`
   (`ui` key) — never inline `:ui` props or ad-hoc CSS overrides. Any CSS you
   do write is plain CSS on the tokens (`var(--spacing-*)`,
   `var(--text-step-*)`, semantic `--ui-*` colors) — no raw hex, no raw px.
   `@apply` only for prose/markdown styling.
4. **Run the lint gate before declaring done.** `pnpm lint && pnpm lint:style`
   (plus the app's tests/build as usual). The steering rules are wired into
   CI; work is not done while they are red. Do not silence a rule with a
   disable comment unless the case is genuinely outside the system — and then
   say why in the comment.
5. **Propose extraction when a pattern recurs.** The second time you write (or
   meet) the same markup pattern, stop: propose promoting it into the layer —
   a `Ccm*` component with typed props, a `manifest.json` entry, regenerated
   `llms.txt` (`pnpm build:llms` in the layer repo). Tell the user; do not
   silently paste a third copy.

## Installing this skill in a consuming app

The skill ships inside the layer package. From the consuming app's root:

```bash
mkdir -p .claude/skills
cp -R node_modules/@ccm/ds/skills/ccm-ds .claude/skills/ccm-ds
# or keep it tracking the installed version:
ln -s ../../node_modules/@ccm/ds/skills/ccm-ds .claude/skills/ccm-ds
```

Optionally wire the ESLint rules into the app's flat config:

```js
import ccm from '@ccm/ds/lint/eslint-plugin-ccm/index.mjs'
// { plugins: { ccm } }, then:
// 'ccm/no-bespoke-widgets': 'error' on **/*.vue
// 'ccm/class-budget': ['error', { budget: 6 }] on **/*.vue outside **/components/**
```
