import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolve paths relative to this file so the layer works when consumed
// from another project via `extends` (see docs/plans/PRO-227-plan.md).
const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  $meta: {
    name: 'ccm-ds',
  },
  modules: ['@nuxt/ui'],
  css: [join(currentDir, 'app/assets/css/main.css')],
})
