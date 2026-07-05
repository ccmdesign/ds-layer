<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 class="text-2xl font-semibold">
      @ccm/ds playground
    </h1>
    <p class="text-muted">
      Nuxt UI v4 + Tailwind v4, delivered through the layer via <code>extends</code>.
    </p>
    <UButton data-testid="ds-button" size="lg">
      It works
    </UButton>
    <UButton to="/tokens" variant="link" data-testid="tokens-link">
      Token reference →
    </UButton>
    <UButton to="/domain" variant="link" data-testid="domain-link">
      Domain foundations →
    </UButton>
  </main>
</template>
