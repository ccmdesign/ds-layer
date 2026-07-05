export default defineNuxtConfig({
  // The playground consumes the layer exclusively via `extends` —
  // never import layer source files directly.
  extends: ['..'],
  devtools: { enabled: true },
  // No font wiring needed: @nuxt/fonts (bundled with Nuxt UI) resolves the
  // Satoshi family straight from the layer's --font-sans token and self-hosts it.
})
