export default defineNuxtConfig({
  // The playground consumes the layer exclusively via `extends` —
  // never import layer source files directly.
  extends: ['..'],
  devtools: { enabled: true },
})
