/**
 * Social House skin — the layer's single Nuxt UI theming surface (PRO-230).
 *
 * Raw values live in tokens/*.tokens.json (DS-2) and reach CSS as `@theme`
 * variables (app/assets/css/tokens.css): the OKLCH indigo/slate palettes,
 * Satoshi via `--font-sans`, the radius scale (`--ui-radius: var(--radius-sm)`
 * pins Nuxt UI's corner language), and the Utopia type/space rhythm. This file
 * does the SEMANTIC mapping on top: which palette each Nuxt UI alias points at.
 *
 * Theming contract: ALL Nuxt UI theming lives here. When the skin needs to
 * diverge from stock Nuxt UI structure, add a `ui.<component>` entry
 * (slots/variants/defaultVariants) in this file — never inline `:ui` props,
 * never `@apply`, never scattered CSS overrides. Component slot overrides are
 * intentionally absent today: Social House renders stock Nuxt UI markup, so an
 * empty component map IS the faithful skin.
 */
export default defineAppConfig({
  ui: {
    colors: {
      // Brand aliases seeded from Social House (see tokens/color.tokens.json):
      // indigo carries the identity, slate carries every neutral surface,
      // border and text tone in both light and dark mode.
      primary: 'indigo',
      neutral: 'slate',
      // Support aliases pinned to Nuxt UI's stock palettes on purpose — this
      // is what Social House renders today. Changing any of them is a design
      // decision that belongs in this file when it happens.
      secondary: 'blue',
      info: 'blue',
      success: 'green',
      warning: 'yellow',
      error: 'red',
    },
  },
})
