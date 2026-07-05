import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Component tests mount the layer's SFCs directly with @vue/test-utils —
// no Nuxt runtime. The components deliberately import everything they need
// from 'vue' (no reliance on Nuxt auto-imports) to keep this possible.
export default defineConfig({
  plugins: [vue()],
  // The root tsconfig extends playground/.nuxt/tsconfig.json, which only
  // exists after `nuxt prepare` — hence the `nuxt prepare playground &&`
  // guard in the package.json test script.
  test: {
    environment: 'jsdom',
    include: ['test/**/*.spec.ts'],
  },
})
