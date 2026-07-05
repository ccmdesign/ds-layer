import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  // PRO-233 validation spike: a fresh consuming app. It consumes the layer
  // exclusively via `extends` — never import layer source files directly.
  // The layer path is absolute (resolved from this file) because c12 resolves
  // multi-segment relative extends ('../..') against the wrong base — see
  // docs/solutions/PRO-233-go-no-go.md Gate 1 notes.
  extends: [fileURLToPath(new URL('../..', import.meta.url))],
})
