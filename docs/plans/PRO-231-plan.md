# PRO-231 — DS-5: Domain foundations (channel registry, status conventions, utils)

Port the shared-domain code Social House and Varro each encode separately into the layer,
unified and framework-light: channel registry + icons, one status→color mechanism, and
locale-aware date/clipboard utilities. Everything unit-tested and demoed on a playground page.

## Source material surveyed

| Concern | Social House | Varro |
| --- | --- | --- |
| Channel branding | `app/utils/channel-brand.mjs` (Iconify simple-icons + brand hex, fallback), `app/utils/channel-icon.mjs` (Lucide glyphs) | `varSocialChannelToggle.vue` inline `CHANNEL_LOGOS` map + 7 SVG SFCs in `icons/social/` |
| Status | `app/types/dashboard.ts` — JS map → Nuxt UI badge `color` (`success/info/neutral`) | `varTopicStatusBadge.vue` — CSS `[data-status]` selectors + vue-i18n label keys |
| Date | `format-date.mjs` — UTC-stable, en-US only, defensive (null→'', unparseable passthrough) | `formatDate.ts` — date-fns, arbitrary patterns, locale param, returns literal `'Invalid Date'` |
| Clipboard | `useClipboard.ts` — navigator.clipboard + hidden-textarea fallback | — |

## Decisions (each owned by this item)

1. **Status mechanism → JS map is the single source of truth.** A typed
   `STATUS_COLORS` registry (status id → semantic color `success | info | warning |
   error | neutral`) drives everything: consumable directly as a Nuxt UI badge `color`
   prop (Social House pattern) and rendered by a layer `CcmStatusBadge` that sets
   `data-status-color` and maps it to the `--ui-*` semantic CSS vars (Varro's visual
   pattern, minus the per-status CSS fork). Justification: a JS map is unit-testable,
   enumerable by the DS-6 manifest, and rides on the semantic color aliases PRO-230
   already themed — pure-CSS `[data-status]` selectors are neither testable nor
   enumerable and would duplicate the palette mapping.
2. **Channel icons → port Varro's SVG SFCs into the layer AND keep Iconify names in
   the registry.** The registry entry carries `icon` (`i-simple-icons-*`, Social
   House's proven mapping — works with `UIcon`/`UBadge` with zero new deps) and the
   layer ships dependency-free `CcmIcon*` SFCs (ported Varro paths + a Bluesky path
   sourced from simple-icons) resolved via `CcmChannelIcon`. Consumers pick either;
   the playground and `CcmChannelBadge` use the SFCs so nothing depends on the
   Iconify network/API.
3. **Channel vocabulary = union of both products:** instagram, linkedin, x
   (+`twitter` alias), facebook, youtube, tiktok, google_my_business, bluesky.
   Brand hex + white/monochrome `fg` per platform — the sanctioned token-system
   exception, confined to `app/utils/channels.ts` (no hex anywhere else). Unknown
   channel → neutral fallback (token-based gray, megaphone-ish glyph), matching
   Social House's defensive behavior.
4. **Status vocabulary = union:** draft→warning, pending→info, processing→neutral,
   completed→success, failed→error, rejected→neutral (Varro) + published→success,
   in_buffer→info, not_added→neutral (Social House). Unknown → neutral.
5. **i18n: locale dictionaries, not hardcoded strings.** Status labels resolve
   through exported `STATUS_MESSAGES` (en + pt) via `statusLabel(id, locale)`;
   `statusLabelKey(id)` returns the `status.<id>` key for vue-i18n consumers
   (Varro). No component hardcodes a user-facing string; Varro's literal
   `'Invalid Date'` return is dropped in favor of Social House's passthrough.
6. **Date formatter → Intl, no date-fns.** `Intl.DateTimeFormat` ships locale data
   in every modern runtime, so date-fns + per-locale bundles buy nothing here.
   API: `formatDate(value, { locale = 'en', style = 'medium' })` — accepts
   string/Date/number; string inputs are UTC-stabilized exactly like Social House
   (first 10 chars → UTC midnight, formatted with `timeZone: 'UTC'`) so a bare
   date never shifts a day west of UTC; null/''/non-values → `''`; unparseable
   strings pass through. Varro's arbitrary-pattern feature is intentionally not
   ported (unused beyond `MMM d, yyyy`).
7. **Clipboard → pure util + thin composable.** `copyToClipboard(text)` in
   `app/utils/clipboard.ts` (navigator.clipboard + hidden-textarea fallback,
   SSR-guarded via `typeof` checks instead of `import.meta.client` so it is
   framework-agnostic and jsdom-testable); `useClipboard()` composable wraps it
   to preserve both products' call sites.
8. **Placement:** domain modules live in the layer's `app/utils/` +
   `app/composables/` (Nuxt auto-imports them for consumers via `extends`; plain
   relative imports keep them vitest-testable, same pattern as PRO-229's
   `composition.ts`). Components stay flat in `app/components/` (`Ccm*` prefix).
9. **Manifest:** no manifest file exists yet (DS-6 owns the schema). Create a
   root `manifest.json` stub — `{ schema: "ds-6-draft", entries: [{ name, kind,
   path, description, since }] }` — listing every export from this item, for
   DS-6 to adopt or migrate.

## Files

- `app/utils/channels.ts` — registry + `channelBrand()` / `resolveChannel()` / `channelIds()`
- `app/utils/status.ts` — `STATUS_COLORS`, `STATUS_MESSAGES` (en/pt), `statusColor()`, `statusLabel()`, `statusLabelKey()`
- `app/utils/format-date.ts` — Intl-based unified formatter
- `app/utils/clipboard.ts` + `app/composables/useClipboard.ts`
- `app/components/CcmIcon{Instagram,Linkedin,X,Facebook,Youtube,Tiktok,GoogleMyBusiness,Bluesky}.vue`
- `app/components/CcmChannelIcon.vue`, `CcmChannelBadge.vue`, `CcmStatusBadge.vue`
- `test/domain/{channels,status,format-date,clipboard}.spec.ts`, `test/components/badges.spec.ts`
- `playground/app/pages/domain.vue` — channel badges + icons + status badges (en/pt) from the registry
- `manifest.json` (DS-6 stub)

## Verification

`pnpm install` → `pnpm test` (vitest, jsdom) → `pnpm lint` + `pnpm lint:style` →
`pnpm build`; playground `/domain` page renders registry-driven badges (browser test).
