// Baseline ESLint config (flat). Custom DS rules land in DS-6.
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt().append({
  // Route files are single-word by convention (index.vue, tokens.vue).
  // The Nuxt module variant of this config exempts pages/ automatically;
  // the standalone config does not, so mirror that here.
  files: ['**/pages/**/*.vue', '**/layouts/**/*.vue', '**/app.vue', '**/error.vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
