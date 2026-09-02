import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import ccm from './lint/eslint-plugin-ccm/index.mjs'

export default createConfigForNuxt()
  .append({
    // Lint fixtures are linted programmatically by test/lint/lint-gate.spec.ts
    // (with `ignore: false`); the normal `pnpm lint` run must skip them or the
    // deliberate violations would fail CI.
    ignores: ['test/lint/fixtures/**'],
  })
  .append({
    // Route files are single-word by convention (index.vue, tokens.vue).
    // The Nuxt module variant of this config exempts pages/ automatically;
    // the standalone config does not, so mirror that here.
    files: ['**/pages/**/*.vue', '**/layouts/**/*.vue', '**/app.vue', '**/error.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  })
  .append({
    // DS-6 steering doctrine (PRO-232): widget duplication is banned
    // everywhere — Nuxt UI owns button/input/select/table/modal.
    name: 'ccm/steering-widgets',
    files: ['**/*.vue'],
    plugins: { ccm },
    rules: {
      'ccm/no-bespoke-widgets': 'error',
    },
  })
  .append({
    // DS-6 steering doctrine (PRO-232): utility-count budget on static class
    // attributes OUTSIDE components/ — pages compose components and pass
    // props; class strings belong inside Tailwind Variants definitions,
    // which live in component files.
    name: 'ccm/steering-class-budget',
    files: ['**/*.vue'],
    ignores: ['**/components/**'],
    rules: {
      'ccm/class-budget': ['error', { budget: 6 }],
    },
  })
