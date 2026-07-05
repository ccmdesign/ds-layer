# PRO-229 — DS-3: Composition components — the Every Layout seven

Parent: PRO-226. Builds on PRO-227 (layer + playground scaffold) and PRO-228 (Utopia
tokens via `@theme static`). Source axioms: `ccm-ops/reference/every-layout/`
(chapters 01, 04, 06, 07, 08, 09, 10 + rudiments 05–06).

## Key decisions

1. **Component prefix: `Ccm`** — `CcmStack`, `CcmCluster`, `CcmGrid`, `CcmReel`,
   `CcmSwitcher`, `CcmCover`, `CcmFrame`. Avoids Nuxt UI's `U*` namespace entirely
   (the `Container`/`UContainer` collision recorded in the ticket is the cautionary
   tale). CSS classes use the matching kebab prefix: `.ccm-stack` etc.
2. **Thin Vue wrappers + plain CSS.** Each component is a renderless-ish SFC (no
   `<style>` block): it renders one element (`as` prop, default `div`), applies its
   `.ccm-*` class, and maps typed props to CSS custom properties via a `style`
   binding (only emitted when the prop differs from the CSS default) and to data
   attributes for enumerable modes. All layout CSS lives in
   `app/assets/css/composition.css` — zero Tailwind syntax — imported from
   `main.css` with `@import "./composition.css" layer(components);` so it registers
   in Tailwind v4's `components` cascade layer.
3. **Space props are token-typed.** `type SpaceToken = '3xs' | … | '3xl' |
   '3xs-2xs' | … | '2xl-3xl'` (the Utopia single steps + pairs from PRO-228),
   mapped to `var(--spacing-<token>)`. Shared types + mapper live in
   `app/utils/composition.ts` (auto-imported by Nuxt, plain-importable by tests).
   Every Layout's `--s0`/`--s1` defaults translate to Utopia `s` (1rem) and `m`
   (1.5rem).
4. **Switcher via container queries** (settled decision; deviation from the book's
   `flex-basis: calc((threshold - 100%) * 999)` hack, noted in code comments).
   The switcher itself is a named inline-size container; direct children get
   `flex-basis: 100%` (stacked) by default and `flex-basis: 0` (side-by-side)
   inside `@container` blocks. **CSS limitation → threshold is an enum:**
   `@container` size conditions cannot read custom properties, so `threshold`
   is typed as `'xs' | 's' | 'm' | 'l' | 'xl'` (20/30/40/50/60rem literals in the
   CSS, commented). Default `'s'` (30rem ≈ the book's `--measure` default). The
   book's quantity-threshold (`limit`, default 4, enumerated 1–6) is kept as a
   quantity query on `data-limit`.
5. **Grid: pure-CSS `min()`, not JS and not `@container`.** The book's final
   solution is `repeat(auto-fit, minmax(min(<min>, 100%), 1fr))`, which is already
   container-intrinsic; its earlier ResizeObserver variant is the "hack" being
   avoided. A real `@container` implementation is impossible with a typed `min`
   prop for the same reason as the Switcher (no `var()` in size conditions) and
   would only re-derive what `min()` gives us. Recorded as the CQ-decision
   interpretation for Grid; noted in code comments. `min` default =
   `calc(var(--measure) / 3)` with `--measure: 60ch` declared once (measure axiom,
   rudiment 06).
6. **Frame: typed `ratio`** — TS template-literal type `` `${number}:${number}` ``
   (default `'16:9'`) parsed to `--frame-n` / `--frame-d`, plus a `fit` prop
   (`'cover' | 'contain'`, default `'cover'`) — direct answer to the Social House
   4:5 cover-crop bugs cited in the ticket.
7. **Reel is a CSS scroll strip, not a carousel.** Boundary vs `UCarousel`
   documented in the component docblock (feeds DS-6 metadata): Reel = continuous
   CSS overflow scroll, native scrollbar affordance, no JS, no paging/snapping/
   controls; reach for `UCarousel` when you need paged navigation, dots/arrows, or
   autoplay. The book's JS `overflowing`-class padding enhancement is omitted
   (CSS-only), noted in comments. Scrollbar colors from slate tokens via
   `scrollbar-color`; `noBar` uses `scrollbar-width: none` + WebKit fallback.
8. **Cover centered element**: plain CSS cannot parametrize a selector (the book's
   custom element injects per-instance `<style>`), so the centered child is `h1`
   by default (book default) or any child marked `data-cover-centered`. Deviation
   noted in comments. `minHeight` default `100svh` (book: `100vh`; `svh` avoids
   mobile URL-bar overflow — deviation noted).
9. **Stack `splitAfter`**: `:nth-child()` cannot be parametrized in plain CSS
   either → enumerated 1–5 via `data-split-after`, validator-enforced.
10. **Tests: Vitest + @vue/test-utils + jsdom** (none existed). Plain Vue mounting
    — components deliberately import from `'vue'` explicitly (no reliance on Nuxt
    auto-imports) so they test without a Nuxt runtime. `pnpm test` added to CI
    between Stylelint and build.

## Props API (all components also take `as?: string = 'div'`; no user-facing strings anywhere)

| Component | Props (default) |
|---|---|
| CcmStack | `space: SpaceToken ('m')`, `recursive: boolean (false)`, `splitAfter?: 1–5` |
| CcmCluster | `space: SpaceToken ('m')`, `justify: CSS justify-content ('flex-start')`, `align: CSS align-items ('flex-start')` |
| CcmSwitcher | `threshold: 'xs'\|'s'\|'m'\|'l'\|'xl' ('s')`, `space: SpaceToken ('m')`, `limit: 1–6 (4)` |
| CcmCover | `space: SpaceToken ('m')`, `minHeight: string ('100svh')`, `noPad: boolean (false)` |
| CcmGrid | `min?: string (calc(--measure / 3))`, `space: SpaceToken ('m')` |
| CcmFrame | `ratio: \`${number}:${number}\` ('16:9')`, `fit: 'cover'\|'contain' ('cover')` |
| CcmReel | `space: SpaceToken ('s')`, `itemWidth: string ('auto')`, `height: string ('auto')`, `noBar: boolean (false)` |

## Files

```
app/components/Ccm{Stack,Cluster,Switcher,Cover,Grid,Frame,Reel}.vue
app/utils/composition.ts            # SpaceToken et al. + spaceVar() mapper
app/assets/css/composition.css      # all layout CSS, plain, tokens only
app/assets/css/main.css             # + @import "./composition.css" layer(components);
vitest.config.ts, test/components/*.spec.ts
playground/app/pages/composition/{index,stack,cluster,switcher,cover,grid,frame,reel}.vue
playground/app/app.vue              # + nav link
.github/workflows/ci.yml            # + pnpm test step
```

## Playground

One page per primitive under `/composition/…` (curl-testable individually), each
with ≥2 prop variations, labelled; index page links all seven. Demo chrome uses
playground-side Tailwind utilities (the zero-Tailwind constraint applies to the
layer's component CSS, not the demo app).

## Test strategy

- Unit (vitest): renders default element + slot; `as` polymorphism; custom
  properties emitted only for non-default props; data attributes
  (recursive/split-after/limit/threshold/no-bar/no-pad); Frame ratio parsing and
  invalid-ratio fallback+validator; SpaceToken mapping.
- Local gates: `pnpm install`, `pnpm test`, `pnpm lint`, `pnpm lint:style`,
  `pnpm build`.
- Browser: dev server, curl each of the 7 demo pages, assert component markup
  (`class="ccm-…"`, custom properties in SSR HTML).

## Risks

- `@container` in the Nitro/Vite CSS pipeline: none — plain CSS passthrough.
- Inline-size containment on the Switcher means its width can't be
  content-driven (rare; noted in comment).
- `scrollbar-color` needs Chromium 121+ — acceptable, affordance-only.
