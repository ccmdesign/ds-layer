import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  // PRO-233 Gate 1: Social House's real configuration — the app extends BOTH
  // the @ccm/ds layer and docus. The layer comes first so its skin
  // (app.config semantic map + @theme tokens) takes precedence over the
  // Docus/Nuxt UI defaults; docus still owns the docs machinery.
  // The layer path is absolute (resolved from this file): c12 misresolves
  // multi-segment relative extends ('../..') — see the Gate 1 notes in
  // docs/solutions/PRO-233-go-no-go.md.
  extends: [fileURLToPath(new URL('../..', import.meta.url)), 'docus'],
})
